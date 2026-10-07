import background from "../assets/images/background.webp";
import sticker00 from "../assets/images/sticker00.webp";
import sticker1 from "../assets/images/sticker1.webp";
import sticker2 from "../assets/images/sticker2.webp";
import sticker3 from "../assets/images/sticker3.webp";
import sticker4 from "../assets/images/sticker4.webp";
import sticker5 from "../assets/images/sticker5.webp";
import sticker6 from "../assets/images/sticker6.webp";
import sticker7 from "../assets/images/sticker7.webp";
import sticker8 from "../assets/images/sticker8.webp";
import sticker9 from "../assets/images/sticker9.webp";
import sticker10 from "../assets/images/sticker10.webp";
import sticker11 from "../assets/images/sticker11.webp";
import sticker12 from "../assets/images/sticker12.webp";
import sticker13 from "../assets/images/sticker13.webp";
import sticker14 from "../assets/images/sticker14.webp";
import sticker15 from "../assets/images/sticker15.webp";
import sticker16 from "../assets/images/sticker16.webp";

const imageSources = [
  background,
  sticker00,
  sticker1,
  sticker2,
  sticker3,
  sticker4,
  sticker5,
  sticker6,
  sticker7,
  sticker8,
  sticker9,
  sticker10,
  sticker11,
  sticker12,
  sticker13,
  sticker14,
  sticker15,
  sticker16,
];

export function preloadImages() {
  imageSources.forEach((source) => {
    const image = new Image();
    image.decoding = "async";
    image.src = source;
  });
}
