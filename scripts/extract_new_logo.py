import sys
import os
from PIL import Image
import base64

# Default reference image or path passed via CLI argument
root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
default_src = os.path.join(root_dir, 'frontend', 'public', 'assets', 'mockup_reference.jpg')
src_path = sys.argv[1] if len(sys.argv) > 1 else default_src

if not os.path.exists(src_path):
    print(f"Reference image not found at {src_path}. Exiting.")
    sys.exit(0)

im = Image.open(src_path).convert('RGB')

# Bounds: x from 141 to 903, y from 210 to 374
# Add 2px margin for clean subpixel edges: x=[139, 905], y=[208, 376]
crop = im.crop((139, 208, 905, 376))
w, h = crop.size

out = Image.new('RGBA', (w, h))

for y in range(h):
    for x in range(w):
        r, g, b = crop.getpixel((x, y))
        m = max(r, g, b)
        # Cut off faint diffuse halo to ensure NO halo/glow around the logo
        if m < 20:
            out.putpixel((x, y), (0, 0, 0, 0))
        elif m < 45:
            # Clean antialiasing edge
            alpha = int(((m - 20) / 25.0) * 255)
            out.putpixel((x, y), (r, g, b, alpha))
        else:
            out.putpixel((x, y), (r, g, b, 255))

# Save high-res PNG
out_png = os.path.join(root_dir, 'frontend', 'public', 'assets', 'logo.png')
out.save(out_png)
print(f"Saved logo.png, size: {out.size}")

# Also generate SVG wrapper with embedded high-res data for /assets/logo.svg
with open(out_png, 'rb') as f:
    b64 = base64.b64encode(f.read()).decode('utf-8')

svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}">
  <image href="data:image/png;base64,{b64}" width="{w}" height="{h}" />
</svg>
'''

out_svg = os.path.join(root_dir, 'frontend', 'public', 'assets', 'logo.svg')
with open(out_svg, 'w', encoding='utf-8') as f:
    f.write(svg_content)

print(f"Saved logo.svg with viewBox 0 0 {w} {h}")
