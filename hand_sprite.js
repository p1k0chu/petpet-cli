import {loadImage} from "canvas"
import {join} from "node:path";

const __dirname = import.meta.dir;

export const g = {
  x: 18,
  y: 18,
  w: 112,
  h: 112,
  scale: 0.875,
};

export const frames = [
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
export function optimizeFrameColors(data) {
  for (let i = 0; i < data.length; i += 4) {
    // clamp greens to avoid pure greens from turning transparent
    data[i + 1] = data[i + 1] > 250 ? 250 : data[i + 1];
    // clamp transparency
    data[i + 3] = data[i + 3] > 127 ? 255 : 0;
  }
}

export const handSpritePromise = loadImage(join(__dirname, "img/sprite.png"));

