import os
from PIL import Image

hi_pages_dir = "/Users/bimcc/Desktop/Design Website/官网升级/bimcc-redesign/assets/brochure/hi_pages"
cases_out = "/Users/bimcc/Desktop/Design Website/官网升级/bimcc-redesign/assets/cases_brochure"
prod_out = "/Users/bimcc/Desktop/Design Website/官网升级/bimcc-redesign/assets/products_brochure"
os.makedirs(cases_out, exist_ok=True)
os.makedirs(prod_out, exist_ok=True)

def crop_box(page_num, rel_box, out_name, out_dir=cases_out):
    page_path = os.path.join(hi_pages_dir, f"page_{page_num:02d}.png")
    if not os.path.exists(page_path):
        print(f"Missing page {page_num}")
        return
    img = Image.open(page_path)
    w, h = img.size
    # rel_box is (x1, y1, x2, y2) as percentage of width and height
    x1 = int(rel_box[0] * w)
    y1 = int(rel_box[1] * h)
    x2 = int(rel_box[2] * w)
    y2 = int(rel_box[3] * h)
    cropped = img.crop((x1, y1, x2, y2))
    save_path = os.path.join(out_dir, out_name)
    cropped.save(save_path, "PNG", quality=95)
    print(f"Saved: {save_path} ({cropped.size})")

# Let's crop key flagship case images from the brochure:

# 1. Page 52: 综合体标杆
# - 重庆来福士广场幕墙项目 (top)
crop_box(52, (0.05, 0.12, 0.95, 0.35), "raffles_city_chongqing.png")
# - 重庆约克北郡三期香港置地光环购物公园 (mid)
crop_box(52, (0.05, 0.43, 0.95, 0.65), "hongkong_land_the_ring.png")
# - 重庆江北国际机场T3A航站楼 (bottom)
crop_box(52, (0.05, 0.73, 0.95, 0.95), "jiangbei_airport_t3a.png")

# 2. Page 53: 枢纽与高校
# - 重庆东站综合交通枢纽轨道交通工程 (top)
crop_box(53, (0.05, 0.12, 0.95, 0.35), "chongqing_east_railway_hub.png")
# - 重庆轨道交通15号线 (mid)
crop_box(53, (0.05, 0.43, 0.95, 0.65), "chongqing_rail_line15.png")
# - 濮阳职业技术学院本科部新校区 / 濮阳工学院 (bottom)
crop_box(53, (0.05, 0.73, 0.95, 0.95), "puyang_polytechnic_campus.png")

# 3. Page 54: 文体教育
# - 中国人民大学通州新校区 (top)
crop_box(54, (0.05, 0.12, 0.95, 0.35), "ruc_tongzhou_campus.png")
# - 云阳县体育公园 (mid)
crop_box(54, (0.05, 0.43, 0.95, 0.65), "yunyang_sports_park.png")
# - 昆明呈贡区文体活动中心 (bottom)
crop_box(54, (0.05, 0.73, 0.95, 0.95), "chenggong_cultural_sports_center.png")

# 4. Page 55: 市政水利
# - 快速路三纵线双山隧道至金家湾立交 (top)
crop_box(55, (0.05, 0.12, 0.95, 0.35), "three_vertical_expressway.png")
# - 开州至云阳高速公路 (mid)
crop_box(55, (0.05, 0.43, 0.95, 0.65), "kaizhou_yunyang_expressway.png")
# - 罗田水库-铁岗水库输水隧洞工程 (bottom)
crop_box(55, (0.05, 0.73, 0.95, 0.95), "luotian_tiegang_water_tunnel.png")

# 5. Page 56: 水电与医疗
# - 塔吉克斯坦塞布佐水电站 (top)
crop_box(56, (0.05, 0.12, 0.95, 0.35), "sebzor_hydro_power_tajikistan.png")
# - 澜沧江GS水电站项目 (mid)
crop_box(56, (0.05, 0.43, 0.95, 0.65), "lancang_gs_hydro_station.png")
# - 重庆市第四人民医院科学城院区一期 (bottom)
crop_box(56, (0.05, 0.73, 0.95, 0.95), "chongqing_fourth_hospital.png")

# 6. Page 57: 顶级医疗
# - 北京协和医院东院区&西院区转化医学平台 (top)
crop_box(57, (0.05, 0.12, 0.95, 0.35), "peking_union_hospital.png")
# - 濮阳医专附属医院 (mid)
crop_box(57, (0.05, 0.43, 0.95, 0.65), "puyang_medical_college_hospital.png")
# - 重庆市渝北区中医院 (bottom)
crop_box(57, (0.05, 0.73, 0.95, 0.95), "yubei_tcm_hospital.png")

# 7. Page 58: 办公与住宅
# - 北京城市副中心行政办公区二期 (top)
crop_box(58, (0.05, 0.12, 0.95, 0.35), "beijing_subcenter_admin_phase2.png")
# - 河北航大兴机场运营基地项目 (mid)
crop_box(58, (0.05, 0.43, 0.95, 0.65), "daxing_airport_hebei_airlines.png")
# - 万科系列项目 (bottom)
crop_box(58, (0.05, 0.73, 0.95, 0.95), "vanke_residential_series.png")

# 8. Page 59: 科研文旅
# - 阿那亚雾灵山A13地块 (top)
crop_box(59, (0.05, 0.12, 0.95, 0.35), "aranya_wulingshan.png")
# - 四川天府国际会议中心 (mid)
crop_box(59, (0.05, 0.43, 0.95, 0.65), "tianfu_intl_convention_center.png")
# - 锦屏大设施极深地下暗物质实验室 (bottom)
crop_box(59, (0.05, 0.73, 0.95, 0.95), "jinping_underground_lab.png")

# 9. Page 60: 特大型桥梁
# - 郭家沱长江大桥 (top)
crop_box(60, (0.05, 0.12, 0.95, 0.35), "guojiatuo_yangtze_bridge.png")
# - 礼嘉嘉陵江特大桥 (mid)
crop_box(60, (0.05, 0.43, 0.95, 0.65), "lijia_jialing_river_bridge.png")
# - 重庆快速路二横线西段五桥同转 (bottom)
crop_box(60, (0.05, 0.73, 0.95, 0.95), "five_bridges_rotation_expressway.png")

# 10. Page 61: 厂房与净水
# - 京东方成都创新中心 (top)
crop_box(61, (0.05, 0.12, 0.95, 0.35), "boe_chengdu_innovation_center.png")
# - 雄安起步区1#供水厂（净水厂）(mid)
crop_box(61, (0.05, 0.43, 0.95, 0.65), "xiongan_water_purification_plant.png")
# - 成都合作污水处理厂四期 (bottom)
crop_box(61, (0.05, 0.73, 0.95, 0.95), "chengdu_hezuo_wastewater_plant.png")

# 11. Page 45: 南宁吴圩国际机场T3航站区
crop_box(45, (0.05, 0.12, 0.95, 0.48), "nanning_wuxu_airport_t3.png")

# 12. Page 46: 永安抽水蓄能电站
crop_box(46, (0.05, 0.12, 0.95, 0.48), "yongan_pumped_storage_station.png")

# 13. Page 44: 沙特吉达市中心综合开发
crop_box(44, (0.50, 0.55, 0.95, 0.95), "saudi_jeddah_downtown.png")

# 14. Page 62: BIMVR 菲律宾马尼拉艺术社区
crop_box(62, (0.05, 0.55, 0.95, 0.95), "manila_bay_art_community_bimvr.png")

# 15. Page 63: 呈贡文体活动中心智慧运维
crop_box(63, (0.05, 0.55, 0.95, 0.95), "chenggong_smart_operations.png")

# 16. Page 64: 罗田水库智慧展厅
crop_box(64, (0.05, 0.55, 0.95, 0.95), "luotian_reservoir_smart_showroom.png")

# 17. Page 65: 中山大学肿瘤医学科学中心观摩会
crop_box(65, (0.05, 0.35, 0.95, 0.95), "sysu_cancer_center_observation.png")

# 18. Page 41: 企业级平台大屏
crop_box(41, (0.05, 0.10, 0.95, 0.95), "enterprise_platform_cockpit_matrix.png", prod_out)

# 19. Page 15: BIMCC智能建造平台架构图
crop_box(15, (0.05, 0.35, 0.95, 0.95), "bimcc_platform_architecture.png", prod_out)

# 20. Page 14: 飞椽零代码底座技术架构图
crop_box(14, (0.05, 0.05, 0.95, 0.85), "fyra_engine_architecture.png", prod_out)

# 21. Page 07-08: 资质软著证书
crop_box(7, (0.05, 0.55, 0.95, 0.95), "certificates_and_honors.png", prod_out)

print("All brochure assets cropped successfully!")
