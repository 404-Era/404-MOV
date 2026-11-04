import os
from PIL import Image

root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ref_path = os.path.join(root_dir, 'frontend', 'public', 'assets', 'mockup_reference.jpg')
out_path = os.path.join(root_dir, 'frontend', 'public', 'assets', 'roman_carax.png')

if not os.path.exists(ref_path):
    print(f"Reference image not found at {ref_path}")
    exit(0)

im = Image.open(ref_path).convert('RGBA')

# Roman Carax bounds: x from 260 to 750, y from 0 to 226
x1, y1, x2, y2 = 260, 0, 750, 226
char_crop = im.crop((x1, y1, x2, y2))
width, height = char_crop.size

result = Image.new('RGBA', (width, height))

# Background around character in mockup is very dark (around 11, 12, 18)
# Character has hair, face, camera, jacket.
for y in range(height):
    for x in range(width):
        r, g, b, a = char_crop.getpixel((x, y))
        diff = max(r - 11, g - 12, b - 18)
        if diff < 12:
            result.putpixel((x, y), (0, 0, 0, 0))
        elif diff < 28:
            alpha = int(((diff - 12) / 16.0) * 255)
            result.putpixel((x, y), (r, g, b, alpha))
        else:
            result.putpixel((x, y), (r, g, b, 255))

result.save(out_path)
print("Successfully extracted roman_carax.png, size:", result.size)
