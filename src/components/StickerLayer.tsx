import { useMemo } from "react";
import sticker1 from "../../assets/images/sticker1.png";
import sticker2 from "../../assets/images/sticker2.png";
import sticker3 from "../../assets/images/sticker3.png";
import sticker4 from "../../assets/images/sticker4.png";
import sticker5 from "../../assets/images/sticker5.png";
import sticker6 from "../../assets/images/sticker6.png";
import sticker7 from "../../assets/images/sticker7.png";
import sticker9 from "../../assets/images/sticker9.png";
import sticker10 from "../../assets/images/sticker10.png";
import sticker11 from "../../assets/images/sticker11.png";
import sticker12 from "../../assets/images/sticker12.png";

const stickerSources = [
  sticker1,
  sticker2,
  sticker3,
  sticker4,
  sticker5,
  sticker6,
  sticker7,
  sticker9,
  sticker10,
  sticker11,
  sticker12,
];

function createStickerInstances() {
  const instances: string[] = [];

  for (let round = 0; round < 4; round += 1) {
    const batch = [...stickerSources].sort(() => Math.random() - 0.5);
    const previous = instances.at(-1);
    if (batch[0] === previous) {
      const swapIndex = batch.findIndex((source) => source !== previous);
      [batch[0], batch[swapIndex]] = [batch[swapIndex], batch[0]];
    }
    instances.push(...batch);
  }

  return instances.slice(0, 40);
}

const stickerInstances = createStickerInstances();
const ellipseStart = Math.random() * Math.PI * 2;

type StickerPlacement = {
  left: number;
  top: number;
  rotation: number;
  scale: number;
  duration: number;
  delay: number;
  driftX: number;
  driftY: number;
};

function randomPlacement(index: number): StickerPlacement {
  const angle = ellipseStart + index * 0.42;
  // Start with an ellipse large enough to wrap the content card, then grow
  // both radii as the path winds outward.
  const radius = 22 + index * 0.95;
  const horizontalRadius = radius;
  const verticalRadius = radius * 0.98;
  const isTopLeftAnchor = index === stickerInstances.length - 2;
  const isTopRightAnchor = index === stickerInstances.length - 1;
  const isBottomRightAnchor = index === stickerInstances.length - 3;
  const ellipseLeft = 50 + Math.cos(angle) * horizontalRadius;
  const ellipseTop = 50 + Math.sin(angle) * verticalRadius;
  return {
    // Elliptical spiral: the path starts around the card and expands smoothly.
    left: isTopLeftAnchor
      ? 8 + Math.random() * 3
      : isTopRightAnchor
        ? 89 + Math.random() * 3
        : isBottomRightAnchor
          ? 89 + Math.random() * 3
        : Math.min(95, Math.max(5, ellipseLeft + (Math.random() - 0.5) * 3)),
    top: isTopLeftAnchor || isTopRightAnchor
      ? 8 + Math.random() * 3
      : isBottomRightAnchor
        ? 89 + Math.random() * 3
      : Math.min(94, Math.max(6, ellipseTop + (Math.random() - 0.5) * 3)),
    rotation: -14 + Math.random() * 28,
    scale: 0.26 + Math.random() * 0.74,
    duration: 5.5 + Math.random() * 2.5,
    delay: Math.random() * -6,
    driftX: -8 + Math.random() * 16,
    driftY: -14 + Math.random() * 28,
  };
}

export function StickerLayer() {
  const placements = useMemo<StickerPlacement[]>(
      () => {
        return stickerInstances.map((_, index) => randomPlacement(index));
      },
    [],
  );

  return (
    <div className="sticker-layer" aria-hidden="true">
      {stickerInstances.map((source, index) => {
        const placement = placements[index];
        return (
          <span
            className="sticker-orbit"
            key={`${source}-${index}`}
            style={{
              left: `${placement.left}%`,
              top: `${placement.top}%`,
              animationDuration: `${placement.duration}s`,
              animationDelay: `${placement.delay}s`,
              ["--drift-x" as string]: `${placement.driftX}px`,
              ["--drift-y" as string]: `${placement.driftY}px`,
            }}
          >
            <img
              className="floating-sticker"
              src={source}
              alt=""
              style={{
                transform: `rotate(${placement.rotation}deg) scale(${placement.scale})`,
              }}
            />
          </span>
        );
      })}
    </div>
  );
}
