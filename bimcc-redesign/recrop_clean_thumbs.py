import os
from PIL import Image

hi_pages_dir = "/Users/bimcc/Desktop/Design Website/官网升级/bimcc-redesign/assets/brochure/hi_pages"
cases_out = "/Users/bimcc/Desktop/Design Website/官网升级/bimcc-redesign/assets/cases_brochure"
os.makedirs(cases_out, exist_ok=True)

def crop_exact(pno, box, out_name):
    p_path = os.path.join(hi_pages_dir, f"page_{pno:02d}.png")
    img = Image.open(p_path)
    w, h = img.size
    x1, y1, x2, y2 = int(box[0]*w), int(box[1]*h), int(box[2]*w), int(box[3]*h)
    cropped = img.crop((x1, y1, x2, y2))
    save_path = os.path.join(cases_out, out_name)
    cropped.save(save_path, "PNG")
    print(f"Cleanly cropped: {out_name} -> {cropped.size}")

# Pure illustrations / photo crops without top text
# Page 52
crop_exact(52, (0.08, 0.20, 0.92, 0.35), "raffles_city_chongqing.png")
crop_exact(52, (0.08, 0.50, 0.92, 0.65), "hongkong_land_the_ring.png")
crop_exact(52, (0.08, 0.80, 0.92, 0.95), "jiangbei_airport_t3a.png")

# Page 53
crop_exact(53, (0.08, 0.20, 0.92, 0.35), "chongqing_east_railway_hub.png")
crop_exact(53, (0.08, 0.50, 0.92, 0.65), "chongqing_rail_line15.png")
crop_exact(53, (0.08, 0.80, 0.92, 0.95), "puyang_polytechnic_campus.png")

# Page 54
crop_exact(54, (0.08, 0.20, 0.92, 0.35), "ruc_tongzhou_campus.png")
crop_exact(54, (0.08, 0.50, 0.92, 0.65), "yunyang_sports_park.png")
crop_exact(54, (0.08, 0.80, 0.92, 0.95), "chenggong_cultural_sports_center.png")

# Page 55
crop_exact(55, (0.08, 0.20, 0.92, 0.35), "three_vertical_expressway.png")
crop_exact(55, (0.08, 0.50, 0.92, 0.65), "kaizhou_yunyang_expressway.png")
crop_exact(55, (0.08, 0.80, 0.92, 0.95), "luotian_tiegang_water_tunnel.png")

# Page 56
crop_exact(56, (0.08, 0.20, 0.92, 0.35), "sebzor_hydro_power_tajikistan.png")
crop_exact(56, (0.08, 0.50, 0.92, 0.65), "lancang_gs_hydro_station.png")
crop_exact(56, (0.08, 0.80, 0.92, 0.95), "chongqing_fourth_hospital.png")

# Page 57
crop_exact(57, (0.08, 0.20, 0.92, 0.35), "peking_union_hospital.png")
crop_exact(57, (0.08, 0.50, 0.92, 0.65), "puyang_medical_college_hospital.png")
crop_exact(57, (0.08, 0.80, 0.92, 0.95), "yubei_tcm_hospital.png")

# Page 58
crop_exact(58, (0.08, 0.20, 0.92, 0.35), "beijing_subcenter_admin_phase2.png")
crop_exact(58, (0.08, 0.50, 0.92, 0.65), "daxing_airport_hebei_airlines.png")
crop_exact(58, (0.08, 0.80, 0.92, 0.95), "vanke_residential_series.png")

# Page 59
crop_exact(59, (0.08, 0.20, 0.92, 0.35), "aranya_wulingshan.png")
crop_exact(59, (0.08, 0.50, 0.92, 0.65), "tianfu_intl_convention_center.png")
crop_exact(59, (0.08, 0.80, 0.92, 0.95), "jinping_underground_lab.png")

# Page 60
crop_exact(60, (0.08, 0.20, 0.92, 0.35), "guojiatuo_yangtze_bridge.png")
crop_exact(60, (0.08, 0.50, 0.92, 0.65), "lijia_jialing_river_bridge.png")
crop_exact(60, (0.08, 0.80, 0.92, 0.95), "five_bridges_rotation_expressway.png")

# Page 61
crop_exact(61, (0.08, 0.20, 0.92, 0.35), "boe_chengdu_innovation_center.png")
crop_exact(61, (0.08, 0.50, 0.92, 0.65), "xiongan_water_purification_plant.png")
crop_exact(61, (0.08, 0.80, 0.92, 0.95), "chengdu_hezuo_wastewater_plant.png")

print("All clean photo crops updated successfully!")
