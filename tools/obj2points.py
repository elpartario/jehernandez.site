"""Convert an OBJ mesh into a point-cloud binary for the site.

Usage:  python tools/obj2points.py path/to/model.obj [points] [outname.bin]

Reads only the vertices (v lines), centers them on the bounding-box center,
normalizes the longest axis to [-1, 1], shuffles, keeps `points` of them
(default 160000; models with fewer vertices are padded by re-sampling so the
output count is EXACT — the skull<->heart morph pairs points 1:1 and needs
matching counts), and writes int16 x,y,z,random per point (8 bytes/point).
The random channel drives per-point noise/brightness variation in the shader.
Output lands in assets/<outname> (default skull.bin).
"""
import struct, random, sys, os

src = sys.argv[1] if len(sys.argv) > 1 else r"Z:/TouchDesigner/Models/Coyote.obj"
N = int(sys.argv[2]) if len(sys.argv) > 2 else 160000
out = sys.argv[3] if len(sys.argv) > 3 else 'skull.bin'
dst = os.path.join(os.path.dirname(__file__), '..', 'assets', out)

verts = []
with open(src, 'r', encoding='utf-8', errors='ignore') as f:
    for line in f:
        if line.startswith('v '):
            p = line.split()
            verts.append((float(p[1]), float(p[2]), float(p[3])))

xs = [v[0] for v in verts]; ys = [v[1] for v in verts]; zs = [v[2] for v in verts]
cx = (min(xs) + max(xs)) / 2; cy = (min(ys) + max(ys)) / 2; cz = (min(zs) + max(zs)) / 2
s = 2.0 / max(max(xs) - min(xs), max(ys) - min(ys), max(zs) - min(zs))

random.seed(42)
random.shuffle(verts)
sel = verts[:N] if len(verts) > N else verts + [random.choice(verts) for _ in range(N - len(verts))]

buf = bytearray()
for (x, y, z) in sel:
    q = lambda v: max(-32767, min(32767, int(v * s * 32767)))
    buf += struct.pack('<hhhh', q(x - cx), q(y - cy), q(z - cz), random.randint(-32767, 32767))

open(dst, 'wb').write(buf)
print(f"{len(verts)} vertices in, {len(sel)} points out -> {os.path.normpath(dst)} ({len(buf)} bytes)")
