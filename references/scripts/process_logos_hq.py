import os
import urllib.request
from PIL import Image
import io

def process_image(url, out_path):
    print(f"Downloading HQ {url}...")
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    response = urllib.request.urlopen(req)
    img_data = response.read()
    
    img = Image.open(io.BytesIO(img_data)).convert("RGBA")
    
    # Scale down a bit if it's monstrously huge to save filesize, but keep it high-res enough for retina
    img.thumbnail((800, 800), Image.LANCZOS)
    
    data = img.getdata()
    
    new_data = []
    for r, g, b, a in data:
        luminance = (r * 0.299 + g * 0.587 + b * 0.114)
        if r > 210 and g > 210 and b > 210:
            # Softer alpha scaling for high-res anti-aliasing
            alpha = int(max(0, min(255, (255 - luminance) * 6.0)))
            new_data.append((r, g, b, alpha))
        else:
            new_data.append((r, g, b, 255))
            
    img.putdata(new_data)
    img.save(out_path, "PNG", optimize=True)
    print(f"Saved to {out_path}")

out_dir = "/Users/bimcc/Desktop/Design Website/exports/logos_hq"
os.makedirs(out_dir, exist_ok=True)

for i in range(23, 33):
    url = f"https://www.bimcc.cn/wp-content/uploads/2025/12/logo-{i}.jpg"
    out_path = os.path.join(out_dir, f"logo-{i}.png")
    try:
        process_image(url, out_path)
    except Exception as e:
        print(f"Failed logo-{i}: {e}")

