import os
from PIL import Image

root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ref_path = os.path.join(root_dir, 'frontend', 'public', 'assets', 'mockup_reference.jpg')
out_path = os.path.join(root_dir, 'frontend', 'public', 'assets', 'cyberpunk_404mov_logo.png')

if not os.path.exists(ref_path):
    print(f"Reference image not found at {ref_path}")
    exit(0)

im = Image.open(ref_path).convert('RGBA')

# Crop exact logo area
logo = im.crop((23, 7, 214, 69))
width, height = logo.size

result = Image.new('RGBA', (width, height))

for y in range(height):
    for x in range(width):
        r, g, b, a = logo.getpixel((x, y))
        # Background is around (11, 12, 18)
        diff = max(r - 11, g - 12, b - 18)
        if diff < 15:
            # Transparent background
            result.putpixel((x, y), (0, 0, 0, 0))
        elif diff < 40:
            # Soft edge
            alpha = int(((diff - 15) / 25.0) * 255)
            result.putpixel((x, y), (r, g, b, alpha))
        else:
            # Solid yellow / accent stroke
            result.putpixel((x, y), (r, g, b, 255))

result.save(out_path)
print("Successfully saved cyberpunk_404mov_logo.png, size:", result.size)
