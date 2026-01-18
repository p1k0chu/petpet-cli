import { createCanvas, Image, loadImage } from "canvas";
import GifEncoder from "gif-encoder";
import { createWriteStream } from "fs";
import { g, frames, optimizeFrameColors, handSpritePromise } from "./hand_Sprite.js"

const SIZE = 112;

const filePath = process.argv[2];
const userImagePromise = loadImage(filePath);

const canvas = createCanvas(SIZE, SIZE);
const ctx = canvas.getContext("2d");

const gif = new GifEncoder(SIZE, SIZE);
const stream = createWriteStream("output.gif");
gif.pipe(stream);

// Configure gif settings
gif.setRepeat(0); // 0 -> infinite loop
gif.setDelay(63); // delay in ms

gif.writeHeader();

const handSprite = await handSpritePromise
const userImage = await userImagePromise

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
