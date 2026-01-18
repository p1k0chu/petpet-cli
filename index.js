import { createCanvas, Image, loadImage } from "canvas";
import GifEncoder from "gif-encoder";
import { createWriteStream } from "fs";

const g = {
  x: 18,
  y: 18,
  w: 112,
  h: 112,
  scale: 0.875,
};

const frames = [
  {
    x: g.x,
    y: g.y,
    w: g.w * g.scale,
    h: g.h * g.scale,
  },
  {
    x: g.x - 4,
    y: g.y + 12,
    w: g.w * g.scale + 4,
    h: g.h * g.scale - 12,
  },
  {
    x: g.x - 12,
    y: g.y + 18,
    w: g.w * g.scale + 12,
    h: g.h * g.scale - 18,
  },
  {
    x: g.x - 12,
    y: g.y + 12,
    w: g.w * g.scale + 4,
    h: g.h * g.scale - 12,
  },
  {
    x: g.x - 4,
    y: g.y,
    w: g.w * g.scale,
    h: g.h * g.scale,
  },
];

/** Remove partially transparent & #00ff00 (bg color) green pixels */
function optimizeFrameColors(data) {
  for (let i = 0; i < data.length; i += 4) {
    // clamp greens to avoid pure greens from turning transparent
    data[i + 1] = data[i + 1] > 250 ? 250 : data[i + 1];
    // clamp transparency
    data[i + 3] = data[i + 3] > 127 ? 255 : 0;
  }
}

const handSprite = await loadImage("img/sprite.png");

const SIZE = 112;

const filePath = process.argv[2];
const userImage = await loadImage(filePath);

const canvas = createCanvas(SIZE, SIZE);
const ctx = canvas.getContext("2d");

const gif = new GifEncoder(SIZE, SIZE);
const stream = createWriteStream("output.gif");
gif.pipe(stream);

// Configure gif settings
gif.setRepeat(0); // 0 -> infinite loop
gif.setDelay(63); // delay in ms

gif.writeHeader();

for (let i = 0; i < frames.length; i++) {
  const frame = frames[i];

  ctx.clearRect(0, 0, SIZE, SIZE);

  ctx.drawImage(userImage, frame.x, frame.y, frame.w, frame.h);
  ctx.drawImage(handSprite, i * SIZE, 0, SIZE, SIZE, 0, 0, SIZE, SIZE);

  const imgData = ctx.getImageData(0, 0, SIZE, SIZE).data;
  optimizeFrameColors(imgData);
  gif.addFrame(imgData);
}

// Finalize the GIF
gif.finish();

console.log("GIF generated: output.gif");
