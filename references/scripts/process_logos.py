import os
import urllib.request
from PIL import Image
import io

def process_image(url, out_path):
    print(f"Downloading {url}...")
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    response = urllib.request.urlopen(req)
    img_data = response.read()
    
    img = Image.open(io.BytesIO(img_data)).convert("RGBA")
    data = img.getdata()
    
    new_data = []
    # Make white pixels transparent and preserve colors for non-white
    # A simple threshold + linear falloff for anti-aliasing
    for r, g, b, a in data:
        # Calculate perceived brightness (luminance)
        luminance = (r * 0.299 + g * 0.587 + b * 0.114)
        
        # If the pixel is very bright and somewhat neutral (close to white)
        # We decrease alpha to make it transparent
        if r > 220 and g > 220 and b > 220:
            # Scale alpha based on how close to pure white it is
            # 220 -> alpha 255, 255 -> alpha 0
            alpha = int(max(0, min(255, (255 - luminance) * 7.2)))
            new_data.append((r, g, b, alpha))
        else:
            new_data.append((r, g, b, 255))
            
    img.putdata(new_data)
    img.save(out_path, "PNG")
    print(f"Saved to {out_path}")

out_dir = "/Users/bimcc/Desktop/Design Website/exports/logos"
os.makedirs(out_dir, exist_ok=True)

for i in range(23, 33):
    url = f"https://www.bimcc.cn/wp-content/uploads/2025/12/logo-{i}-300x169.jpg"
    out_path = os.path.join(out_dir, f"logo-{i}.png")
    try:
        process_image(url, out_path)
    except Exception as e:
        print(f"Failed logo-{i}: {e}")

