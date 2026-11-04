import os
from PIL import Image

root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
in_path = os.path.join(root_dir, 'frontend', 'public', 'assets', 'cyberpunk_404mov_logo.png')
out_path = os.path.join(root_dir, 'frontend', 'public', 'assets', 'cyberpunk_404mov_logo_hd.png')

if not os.path.exists(in_path):
    print(f"File not found: {in_path}")
    exit(0)

im = Image.open(in_path)
w, h = im.size

# Upscale 4x using Lanczos
scale = 4
large = im.resize((w * scale, h * scale), Image.Resampling.LANCZOS)

# Clean alpha mask: sharp edges without blur
data = large.load()
for y in range(large.size[1]):
    for x in range(large.size[0]):
        r, g, b, a = data[x, y]
        if a < 60:
            data[x, y] = (0, 0, 0, 0)
        elif a > 180:
            # Full vivid cyber yellow with original nuance
            data[x, y] = (r, g, b, 255)
        else:
            # Smooth antialiased boundary
            smoothed_a = int((a - 60) / 120.0 * 255)
            data[x, y] = (r, g, b, smoothed_a)

large.save(out_path)
print("Saved cyberpunk_404mov_logo_hd.png, size:", large.size)
