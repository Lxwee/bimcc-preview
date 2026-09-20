import os
import urllib.request
from PIL import Image
import rembg
import io

sources = [
    "https://www.bimcc.cn/wp-content/uploads/2025/12/logo-23.jpg",
    "https://www.bimcc.cn/wp-content/uploads/2025/12/logo-24.jpg",
    "https://www.bimcc.cn/wp-content/uploads/2025/12/logo-25.jpg",
    "https://www.bimcc.cn/wp-content/uploads/2025/12/logo-26.jpg",
    "https://www.bimcc.cn/wp-content/uploads/2025/12/logo-27.jpg",
    "https://www.bimcc.cn/wp-content/uploads/2025/12/logo-28.jpg",
    "https://www.bimcc.cn/wp-content/uploads/2025/12/logo-29.jpg",
    "https://www.bimcc.cn/wp-content/uploads/2025/12/logo-30.jpg",
    "https://www.bimcc.cn/wp-content/uploads/2025/12/logo-31.jpg",
    "https://www.bimcc.cn/wp-content/uploads/2025/12/logo-32.jpg",
]

out_dir = "../exports/logos_rembg"
os.makedirs(out_dir, exist_ok=True)

session = rembg.new_session("u2net")

for url in sources:
    filename = url.split('/')[-1].replace('.jpg', '.png')
    out_path = os.path.join(out_dir, filename)
    print(f"Processing {filename}...")
    
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as response:
        img_data = response.read()
        
    input_img = Image.open(io.BytesIO(img_data)).convert("RGBA")
    
    # Scale down first to speed up and improve edge detection
    # rembg works best on images around 1024px or less
    input_img.thumbnail((600, 600), Image.Resampling.LANCZOS)
    
    # Without alpha_matting = insanely fast and clean
    output_img = rembg.remove(input_img, session=session, post_process_mask=True)
    
    output_img.save(out_path, format="PNG", optimize=True)
    print(f"Saved {out_path}")

print("Done!")
