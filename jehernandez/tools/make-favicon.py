"""Render assets/favicon.png from the skull point cloud (assets/skull.bin).

Run from the site root:  python tools/make-favicon.py
Re-run after swapping the model or changing SKULL_ROT in js/skull-rot.js
(update ROT_SEQ below to match). Needs numpy + Pillow.
"""
import os
import numpy as np
from PIL import Image, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)

# keep in sync with window.SKULL_ROT in js/skull-rot.js
ROT_SEQ = [('x', -90), ('z', -90), ('x', 90)]
RED = (255, 14, 19)      # matches the skull shader color (1.0, 0.055, 0.075)
N = 256                  # supersampled accumulation buffer
OUT = 64                 # final favicon size

pts = np.fromfile(os.path.join(ROOT, 'assets', 'skull.bin'), dtype='<i2')
pts = pts.reshape(-1, 4)[:, :3].astype(np.float32) / 32767.0

def rot(axis, deg):
    a = np.radians(deg)
    c, s = np.cos(a), np.sin(a)
    if axis == 'x': return np.array([[1, 0, 0], [0, c, -s], [0, s, c]], np.float32)
    if axis == 'y': return np.array([[c, 0, s], [0, 1, 0], [-s, 0, c]], np.float32)
    return np.array([[c, -s, 0], [s, c, 0], [0, 0, 1]], np.float32)

M = np.eye(3, dtype=np.float32)
for ax, dg in ROT_SEQ:
    M = rot(ax, dg) @ M          # same order as skullRotMatrix (view space)

p = pts @ M.T
xi = ((p[:, 0] * 0.86 + 1) / 2 * (N - 1)).astype(int).clip(0, N - 1)
yi = ((-p[:, 1] * 0.86 + 1) / 2 * (N - 1)).astype(int).clip(0, N - 1)

acc = np.zeros((N, N), np.float32)
np.add.at(acc, (yi, xi), 1.0)
acc /= max(np.percentile(acc[acc > 0], 97), 1e-6)
acc = np.clip(acc * 1.5, 0, 1)

img = Image.fromarray((acc * 255).astype('uint8'))
img = img.filter(ImageFilter.GaussianBlur(1.1)).resize((OUT, OUT), Image.LANCZOS)
a = np.asarray(img).astype(np.float32) / 255

rgba = np.zeros((OUT, OUT, 4), 'uint8')
lum = np.clip(a * 1.7, 0, 1)
rgba[..., 0] = (RED[0] * lum).astype('uint8')
rgba[..., 1] = (RED[1] * lum).astype('uint8')
rgba[..., 2] = (RED[2] * lum).astype('uint8')
rgba[..., 3] = (255 * np.clip(a * 2.4, 0, 1)).astype('uint8')

dst = os.path.join(ROOT, 'assets', 'favicon.png')
Image.fromarray(rgba).save(dst)
print('wrote', dst, os.path.getsize(dst), 'bytes')
