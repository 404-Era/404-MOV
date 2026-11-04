import os
import base64

root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
png_path = os.path.join(root_dir, 'frontend', 'public', 'assets', 'cyberpunk_404mov_logo_hd.png')
svg_path = os.path.join(root_dir, 'frontend', 'public', 'assets', 'logo.svg')

if not os.path.exists(png_path):
    print(f"File not found: {png_path}")
    exit(0)

with open(png_path, 'rb') as f:
    b64_data = base64.b64encode(f.read()).decode('utf-8')

svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 191 62" width="191" height="62">
  <image href="data:image/png;base64,{b64_data}" width="191" height="62" />
</svg>
'''

with open(svg_path, 'w', encoding='utf-8') as f:
    f.write(svg_content)

print(f"Saved {svg_path} successfully!")
