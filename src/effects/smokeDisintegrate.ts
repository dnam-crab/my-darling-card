import html2canvas from "html2canvas";

export type SmokeDisintegrateOptions = {
  /** Total time from trigger until every canvas subset disappears. */
  duration?: number;
  /** Number of canvas subsets. More subsets creates finer disintegration. */
  frameCount?: number;
  /** Kept as an alias for callers using the previous API. */
  particleCount?: number;
  /** Number of times each source pixel is copied into different subsets. */
  repetitionCount?: number;
  /** Restore the original element visibility after cleanup. */
  restoreVisibility?: boolean;
  onComplete?: () => void;
};

/**
 * Captures the real rendered element, including nested layout and styles,
 * using the same html2canvas approach as the referenced CodePen.
 */
async function captureElement(element: HTMLElement, width: number, height: number) {
  const canvas = await html2canvas(element, {
    backgroundColor: null,
    logging: false,
    useCORS: true,
    scale: 1,
    width,
    height,
  });

  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas 2D context is unavailable");
  const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
  for (let index = 3; index < pixels.length; index += 4) {
    if (pixels[index] > 0) return canvas;
  }
  throw new Error("Element snapshot is empty");
}

function fallbackCapture(element: HTMLElement, width: number, height: number) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) return canvas;

  const computed = getComputedStyle(element);
  const radius = Number.parseFloat(computed.borderRadius) || 0;
  context.fillStyle = computed.backgroundColor;
  context.beginPath();
  context.roundRect(0, 0, width, height, radius);
  context.fill();
  context.fillStyle = computed.color;
  context.font = `${computed.fontWeight} ${computed.fontSize} ${computed.fontFamily}`;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(element.textContent?.trim() ?? "", width / 2, height / 2);
  return canvas;
}

/**
 * This is the core technique from the referenced CodePen: every source pixel
 * is assigned to several canvas subsets, then the subsets are staggered and
 * transformed independently. No smoke particles or radial explosion are used.
 */
function generateFrames(source: HTMLCanvasElement, count: number, repetitionCount: number) {
  const { width, height } = source;
  const context = source.getContext("2d");
  if (!context) return [];

  const originalData = context.getImageData(0, 0, width, height);
  const imageDatas = Array.from({ length: count }, () =>
    context.createImageData(width, height),
  );

  for (let x = 0; x < width; x += 1) {
    for (let y = 0; y < height; y += 1) {
      for (let repetition = 0; repetition < repetitionCount; repetition += 1) {
        // Same x-biased distribution as the CodePen: neighboring pixels tend
        // to travel together, creating visible disintegration chunks.
        const frameIndex = Math.min(
          count - 1,
          Math.floor((count * (Math.random() + (2 * x) / width)) / 3),
        );
        const pixelIndex = (y * width + x) * 4;
        for (let offset = 0; offset < 4; offset += 1) {
          imageDatas[frameIndex].data[pixelIndex + offset] =
            originalData.data[pixelIndex + offset];
        }
      }
    }
  }

  return imageDatas.map((imageData) => {
    const frame = source.cloneNode(true) as HTMLCanvasElement;
    frame.getContext("2d")?.putImageData(imageData, 0, 0);
    return frame;
  });
}

/**
 * Reusable CodePen-style canvas-subset disintegration for any HTML element.
 * duration controls the complete transition; frameCount controls grouping;
 * repetitionCount controls how much of the original surface is repeated.
 */
export async function smokeDisintegrate(
  element: HTMLElement,
  options: SmokeDisintegrateOptions = {},
): Promise<void> {
  const {
    duration = 4000,
    frameCount = options.particleCount ?? 32,
    repetitionCount = 2,
    restoreVisibility = true,
    onComplete,
  } = options;

  const rect = element.getBoundingClientRect();
  const width = Math.max(1, Math.ceil(rect.width));
  const height = Math.max(1, Math.ceil(rect.height));
  const originalVisibility = element.style.visibility;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const originalTransition = element.style.transition;
    const originalTransform = element.style.transform;
    const originalOpacity = element.style.opacity;
    element.style.transition = "opacity 320ms ease-out, transform 320ms ease-out";
    element.style.opacity = "0";
    element.style.transform = "translateY(-8px)";
    await new Promise((resolve) => window.setTimeout(resolve, 340));
    element.style.transition = originalTransition;
    element.style.transform = originalTransform;
    element.style.opacity = originalOpacity;
    if (restoreVisibility) element.style.visibility = originalVisibility;
    onComplete?.();
    return;
  }

  let source: HTMLCanvasElement;
  try {
    source = await captureElement(element, width, height);
  } catch {
    source = fallbackCapture(element, width, height);
  }

  const frames = generateFrames(
    source,
    Math.max(8, Math.min(128, Math.floor(frameCount))),
    Math.max(1, Math.floor(repetitionCount)),
  );
  if (frames.length === 0) return;

  const container = document.createElement("div");
  container.style.cssText = [
    "position:fixed",
    `left:${rect.left}px`,
    `top:${rect.top}px`,
    `width:${width}px`,
    `height:${height}px`,
    "pointer-events:none",
    "overflow:visible",
    "z-index:2147483647",
    "display:block",
    "visibility:visible",
    "isolation:isolate",
  ].join(";");

  // Keep the CodePen's staggered-frame feel while stretching the complete
  // animation to the requested four seconds.
  const transitionDuration = Math.max(500, duration * 0.75);
  const maximumDelay = Math.max(0, duration - transitionDuration);
  frames.forEach((frame, index) => {
    frame.style.position = "absolute";
    frame.style.left = "0";
    frame.style.top = "0";
    frame.style.width = `${width}px`;
    frame.style.height = `${height}px`;
    frame.style.display = "block";
    frame.style.visibility = "visible";
    frame.style.pointerEvents = "none";
    frame.style.transition = `transform ${transitionDuration}ms ease-out, opacity ${transitionDuration}ms ease-out`;
    frame.style.transitionDelay = `${maximumDelay * (index / Math.max(1, frames.length - 1))}ms`;
    frame.style.opacity = "1";
    frame.style.transform = "rotate(0deg) translate(0px, 0px) rotate(0deg)";
    container.appendChild(frame);
  });

  document.body.appendChild(container);
  element.style.visibility = "hidden";

  // Force reflow, exactly as the CodePen does, so the initial and final
  // transforms become a real CSS transition instead of one skipped update.
  void container.offsetLeft;
  frames.forEach((frame) => {
    const randomRadian = 2 * Math.PI * (Math.random() - 0.5);
    frame.style.transform =
      `rotate(${15 * (Math.random() - 0.5)}deg) ` +
      `translate(${60 * Math.cos(randomRadian)}px, ${30 * Math.sin(randomRadian)}px) ` +
      `rotate(${15 * (Math.random() - 0.5)}deg)`;
    frame.style.opacity = "0";
  });

  await new Promise((resolve) => window.setTimeout(resolve, duration + 100));
  container.remove();
  if (restoreVisibility) element.style.visibility = originalVisibility;
  onComplete?.();
}
