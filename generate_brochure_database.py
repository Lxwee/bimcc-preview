import json, os
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
    return os.path.join("assets/cases_brochure", out_name)

# Define full list of authentic brochure cases
cases = [
    {
        "id": "raffles-city",
        "name": "重庆来福士广场幕墙项目",
        "category": "综合体",
        "client": "上海旭博建筑装饰工程有限公司 / 凯德集团",
        "scale": "总建筑面积 113.4 万 m²，占地 91782 m²",
        "desc": "项目建设地点位于朝天门与解放碑之间，总建筑面积约1134264m²（包含市政配套设施），实现了全过程全专业实施BIM技术应用。",
        "pno": 52,
        "box_card": (0.05, 0.12, 0.95, 0.35),
        "box_thumb": (0.10, 0.18, 0.92, 0.34)
    },
    {
        "id": "the-ring",
        "name": "重庆约克北郡三期（香港置地光环购物公园）",
        "category": "综合体",
        "client": "中建三局集团有限公司 / 香港置地",
        "scale": "总建筑面积 437,880 m²",
        "desc": "位于重庆市渝北区金州大道北侧，背靠照母山森林公园，紧临黄桷水库。包含超高层办公楼、商业楼及配套设施用房、地下商业、地下超市及地下汽车库等。",
        "pno": 52,
        "box_card": (0.05, 0.43, 0.95, 0.65),
        "box_thumb": (0.10, 0.49, 0.92, 0.64)
    },
    {
        "id": "jiangbei-airport-t3a",
        "name": "重庆江北国际机场T3A航站楼",
        "category": "民航机场",
        "client": "重庆机场集团有限公司",
        "scale": "建筑面积 53 万 m²，地上四层",
        "desc": "由中央处理大厅和四个指廊构成。BIM技术服务包括航站楼土建、钢结构、装饰、幕墙、屋面、机电以及行李分拣、安检、登机桥与弱电系统。",
        "pno": 52,
        "box_card": (0.05, 0.73, 0.95, 0.95),
        "box_thumb": (0.10, 0.79, 0.92, 0.94)
    },
    {
        "id": "chongqing-east-station",
        "name": "重庆东站综合交通枢纽轨道交通工程",
        "category": "轨道交通",
        "client": "重庆机电控股集团机电工程技术有限公司",
        "scale": "总建筑面积 189,593 m²，相当于9个标准地铁站",
        "desc": "西部地区最大高铁枢纽重庆东站的重要组成部分，是重庆轨道交通最大在建综合体，集高铁、城际、地铁与地面交通一体化。",
        "pno": 53,
        "box_card": (0.05, 0.12, 0.95, 0.35),
        "box_thumb": (0.10, 0.18, 0.92, 0.34)
    },
    {
        "id": "chongqing-line-15",
        "name": "重庆市轨道交通15号线系列",
        "category": "轨道交通",
        "client": "重庆机电控股集团 / 中建电子信息技术有限公司",
        "scale": "全线设车站14座，城轨快线",
        "desc": "重庆市正在建设的一条东西向城轨快线，也是重庆首条城市轨道快线，工程起于九曲河东站，终到两江影视城站。",
        "pno": 53,
        "box_card": (0.05, 0.43, 0.95, 0.65),
        "box_thumb": (0.10, 0.49, 0.92, 0.64)
    },
    {
        "id": "puyang-polytechnic",
        "name": "濮阳职业技术学院本科部新校区（濮阳工学院）",
        "category": "文体教育",
        "client": "濮阳城市投资集团 / 中铁建设集团",
        "scale": "建筑面积 117,784 m²，9栋单体建筑",
        "desc": "河南省濮阳市首个本科院校，包含综合办公楼、产学研中心、实训楼、数据中心、文化艺术中心、图书馆（最大单跨大于50米）、明道书院中式古建等。",
        "pno": 53,
        "box_card": (0.05, 0.73, 0.95, 0.95),
        "box_thumb": (0.10, 0.79, 0.92, 0.94)
    },
    {
        "id": "ruc-tongzhou",
        "name": "中国人民大学通州新校区",
        "category": "文体教育",
        "client": "中建八局发展建设有限公司",
        "scale": "总建筑面积 14 万 m²",
        "desc": "位于北京城市副中心创新发展轴和生态文明带相交区域。学生事务中心及公共教学楼二期76332m²，北区学部楼57644m²，地下由连通道连接。",
        "pno": 54,
        "box_card": (0.05, 0.12, 0.95, 0.35),
        "box_thumb": (0.10, 0.18, 0.92, 0.34)
    },
    {
        "id": "yunyang-sports-park",
        "name": "重庆市云阳县体育公园",
        "category": "文体教育",
        "client": "云阳县城市开发投资（集团）有限公司 / 重庆建工市政",
        "scale": "总占地 8 万 m²，建筑面积近 5 万 m²",
        "desc": "环湖绿道上的重要节点建筑，主要由体育馆、室外运动场及配套设施组成。主体包括室内恒温游泳馆、室内网球场、室内羽毛球馆等。",
        "pno": 54,
        "box_card": (0.05, 0.43, 0.95, 0.65),
        "box_thumb": (0.10, 0.49, 0.92, 0.64)
    },
    {
        "id": "chenggong-cultural-center",
        "name": "昆明市呈贡区文体活动中心PPP项目",
        "category": "文体教育",
        "client": "昆明呈贡广工建设有限公司",
        "scale": "总建筑面积 114,296 m²",
        "desc": "位于昆明呈贡斗南片区滇池湖畔，紧邻昆明火车南站与行政中心。由公共艺术中心、活动中心、图书博物馆、文化档案馆、体育馆5栋建筑及地下车库组成。",
        "pno": 54,
        "box_card": (0.05, 0.73, 0.95, 0.95),
        "box_thumb": (0.10, 0.79, 0.92, 0.94)
    },
    {
        "id": "three-vertical-expressway",
        "name": "快速路三纵线双山隧道至金家湾立交改造工程",
        "category": "市政交通",
        "client": "重庆市市政设计研究院 / 中建隧道 / 中国建筑第六工程局",
        "scale": "全长 6.3 km，新建隧道4座，桥梁9座",
        "desc": "快速路三纵线关键段。北起双山隧道，终至金家湾立交。新建隧道4座、主线高架桥2座、拼宽辅道桥7座、人行地通道8座。通过三星级智慧工地验收（90分）。",
        "pno": 55,
        "box_card": (0.05, 0.12, 0.95, 0.35),
        "box_thumb": (0.10, 0.18, 0.92, 0.34)
    },
    {
        "id": "kaizhou-yunyang-expressway",
        "name": "开州至云阳高速（江口-云阳-龙缸段）PPP项目",
        "category": "市政交通",
        "client": "中国十九冶集团有限公司",
        "scale": "路线全长 69.8 公里，设计时速 80 km/h",
        "desc": "全线设置服务区2处，互通立交10处，新建匝道收费站7座。全线双向四车道，其中云阳长江二桥按双向六车道标准建设。",
        "pno": 55,
        "box_card": (0.05, 0.43, 0.95, 0.65),
        "box_thumb": (0.10, 0.49, 0.92, 0.64)
    },
    {
        "id": "luotian-tiegang-water-tunnel",
        "name": "罗田水库-铁岗水库输水隧洞工程",
        "category": "水利水务",
        "client": "中国水利水电第十四工程局有限公司",
        "scale": "总投资 58.023 亿元，主线全长 21.68 km",
        "desc": "国务院部署的172项节水供水重大水利工程之一、广东省重大项目。基于BIM+GIS融合现场进度、质量、安全与监测数据，获深圳市主要领导高度认可。",
        "pno": 55,
        "box_card": (0.05, 0.73, 0.95, 0.95),
        "box_thumb": (0.10, 0.79, 0.92, 0.94)
    },
    {
        "id": "sebzor-hydro-tajikistan",
        "name": "塔吉克斯坦塞布佐水电站（海外一带一路）",
        "category": "海外与水利",
        "client": "TGEM / 国际能源合作项目",
        "scale": "引水式水电站，全长 3 km",
        "desc": "位于塔吉克斯坦戈尔诺-巴达赫尚自治州，投运后为该州增加25%发电量，为塔吉克斯坦22.7万人及阿富汗46.8万人提供绿色电力服务。",
        "pno": 56,
        "box_card": (0.05, 0.12, 0.95, 0.35),
        "box_thumb": (0.10, 0.18, 0.92, 0.34)
    },
    {
        "id": "lancang-gs-hydro",
        "name": "澜沧江GS水电站项目",
        "category": "水利水务",
        "client": "中国水利水电第十四工程局有限公司",
        "scale": "装机容量 2200 MW（4×550MW），一等大(1)型工程",
        "desc": "坝址位于云南省迪庆州德钦县佛山乡。主要由混凝土面板堆石坝、右岸溢洪洞、右岸放空冲沙隧洞、右岸引水发电系统等组成。",
        "pno": 56,
        "box_card": (0.05, 0.43, 0.95, 0.65),
        "box_thumb": (0.10, 0.49, 0.92, 0.64)
    },
    {
        "id": "chongqing-fourth-hospital",
        "name": "重庆市第四人民医院科学城院区建设项目（一期）",
        "category": "医疗卫生",
        "client": "中建一局集团第二建筑有限公司",
        "scale": "总建筑面积 207,531 m²",
        "desc": "集120指挥调度、医疗、教学、科研为一体的三甲综合教学医院，国家创伤区域医疗中心、国家紧急医学救援基地。包含门急诊楼、医技楼、住院楼、感染楼等。",
        "pno": 56,
        "box_card": (0.05, 0.73, 0.95, 0.95),
        "box_thumb": (0.10, 0.79, 0.92, 0.94)
    },
    {
        "id": "peking-union-hospital",
        "name": "北京协和医院东院区＆西院区转化医学平台",
        "category": "医疗卫生",
        "client": "中国建筑第八工程局有限公司西南分公司",
        "scale": "总建筑面积 55,437 m²，观察床位293床",
        "desc": "位于北京市东城区帅府园1号。主要功能为国家级科研及转化医学平台，实验室生物安全等级BSL-2，动物生物安全等级ABSL-2。",
        "pno": 57,
        "box_card": (0.05, 0.12, 0.95, 0.35),
        "box_thumb": (0.10, 0.18, 0.92, 0.34)
    },
    {
        "id": "puyang-medical-hospital",
        "name": "濮阳医专附属医院",
        "category": "医疗卫生",
        "client": "云南省建设投资控股集团有限公司河南省分公司",
        "scale": "建筑面积 150,880 m²，床位1200余张，总投资8.47亿元",
        "desc": "集医疗、教学、科研、保健、急救为一体的现代化三甲综合医院。地上120800m²，地下30000m²，配置智慧工地项目管控平台与智慧展厅。",
        "pno": 57,
        "box_card": (0.05, 0.43, 0.95, 0.65),
        "box_thumb": (0.10, 0.49, 0.92, 0.64)
    },
    {
        "id": "yubei-tcm-hospital",
        "name": "重庆市渝北区中医院",
        "category": "医疗卫生",
        "client": "重庆建工集团股份有限公司",
        "scale": "总建筑面积 150,281 m²，地上15层/地下4层",
        "desc": "占地面积约67495m²，包含门诊医技住院综合楼和污水处理站，全过程应用BIM智慧管理平台进行施工模拟与设备运维管理。",
        "pno": 57,
        "box_card": (0.05, 0.73, 0.95, 0.95),
        "box_thumb": (0.10, 0.79, 0.92, 0.94)
    },
    {
        "id": "beijing-subcenter-admin",
        "name": "北京城市副中心行政办公区二期",
        "category": "科研办公",
        "client": "中国建筑第八工程局有限公司",
        "scale": "总占地 4 万 m²，165/169地块总建面 15.7 万 m²",
        "desc": "位于北京市通州区潞城镇运河东大街。采用BIMCC数字建造管理平台与智慧工地系统，支撑国家级政务核心区高品质建设。",
        "pno": 58,
        "box_card": (0.05, 0.12, 0.95, 0.35),
        "box_thumb": (0.10, 0.18, 0.92, 0.34)
    },
    {
        "id": "daxing-airport-hebei-air",
        "name": "河北航大兴机场运营基地项目",
        "category": "民航机场",
        "client": "中建安装集团有限公司",
        "scale": "占地 84 亩，规划建面 16 万 m²",
        "desc": "位于大兴机场临空经济区航空物流区，由河北航空总部办公楼、空勤楼、地勤楼、GOC运行指挥中心组成，为厦航及河北航3000人提供住勤保障。",
        "pno": 58,
        "box_card": (0.05, 0.43, 0.95, 0.65),
        "box_thumb": (0.10, 0.49, 0.92, 0.64)
    },
    {
        "id": "jinping-underground-lab",
        "name": "中国锦屏极深地下暗物质实验室（锦屏大设施）",
        "category": "科研办公",
        "client": "中建三局集团有限公司",
        "scale": "地下实验空间 4 万 m²，世界最深地下实验室",
        "desc": "我国首个极深地下实验室，位于锦屏山引水隧道群中，地下2400米岩石覆盖。由4个实验大厅、2条辅助隧道、4个服务隧道等组成。",
        "pno": 59,
        "box_card": (0.05, 0.73, 0.95, 0.95),
        "box_thumb": (0.10, 0.79, 0.92, 0.94)
    },
    {
        "id": "guojiatuo-yangtze-bridge",
        "name": "重庆郭家沱长江大桥",
        "category": "特大型桥梁",
        "client": "中建桥梁有限公司",
        "scale": "全长 1403.8 m，主跨 720 m 公轨两用悬索桥",
        "desc": "国内最大跨度的公轨两用悬索桥。上层为快速路六纵线，下层预留轨道交通8号线，全生命周期采用BIM进行钢桁梁顶推与索塔监控。",
        "pno": 60,
        "box_card": (0.05, 0.12, 0.95, 0.35),
        "box_thumb": (0.10, 0.18, 0.92, 0.34)
    },
    {
        "id": "lijia-jialing-bridge",
        "name": "重庆礼嘉嘉陵江特大桥",
        "category": "特大型桥梁",
        "client": "中建隧道建设有限公司",
        "scale": "全长 785 m，最大跨径 245 m，双向8车道",
        "desc": "国内首座上承式梁拱组合连续刚构桥，集梁桥、拱桥、矮塔斜拉桥施工工艺于一身，设计时速80km/h，实现复杂结构的高精度BIM深化。",
        "pno": 60,
        "box_card": (0.05, 0.43, 0.95, 0.65),
        "box_thumb": (0.10, 0.49, 0.92, 0.64)
    },
    {
        "id": "five-bridges-rotation",
        "name": "快速路二横线西段五桥同转主线桥（世界纪录）",
        "category": "特大型桥梁",
        "client": "中建隧道建设有限公司",
        "scale": "全长 14.4 公里，创造3项转体桥世界纪录",
        "desc": "道路全长14.4公里，采用世界首例“五桥同转”技术，刷新了大跨度集群式转体数量最多、吨位最重、首次同联多T构转体3项世界纪录。",
        "pno": 60,
        "box_card": (0.05, 0.73, 0.95, 0.95),
        "box_thumb": (0.10, 0.79, 0.92, 0.94)
    },
    {
        "id": "nanning-wuxu-t3",
        "name": "南宁吴圩国际机场T3航站区“4101”智能建造",
        "category": "民航机场",
        "client": "广西机场管理集团有限责任公司",
        "scale": "大型国际枢纽机场，四大引擎+十个子系统",
        "desc": "打造基于BIMGIS的一张图决策平台。软硬兼施智能管控，基于飞行区施工监控自动形成土石方进度管控并智能调配，支撑全生命周期管理。",
        "pno": 45,
        "box_card": (0.05, 0.12, 0.95, 0.48),
        "box_thumb": (0.10, 0.22, 0.92, 0.46)
    },
    {
        "id": "yongan-pumped-storage",
        "name": "福建永安抽水蓄能电站智慧工地平台",
        "category": "水利水务",
        "client": "中国水利水电第十四工程局有限公司",
        "scale": "大型抽水蓄能电站地下洞室群",
        "desc": "高集成度部署实名制、人车定位、洞内有害气体监测、氡气监测、AI识别、一张图指挥调度及爆破预警系统。",
        "pno": 46,
        "box_card": (0.05, 0.12, 0.95, 0.48),
        "box_thumb": (0.10, 0.22, 0.92, 0.46)
    },
    {
        "id": "saudi-jeddah",
        "name": "沙特吉达市中心综合开发基础设施工程（一带一路）",
        "category": "海外与水利",
        "client": "中交第四航务工程勘察设计院有限公司",
        "scale": "中东重大国际总承包项目",
        "desc": "为沙特吉达市中心综合开发项目部署基于BIM+GIS的多语言数字化工程信息管理系统，支撑海外大型基建协同。",
        "pno": 44,
        "box_card": (0.50, 0.55, 0.95, 0.95),
        "box_thumb": (0.52, 0.60, 0.93, 0.92)
    },
    {
        "id": "xiongan-water-plant",
        "name": "雄安起步区1#供水厂工程（净水厂）",
        "category": "市政公用",
        "client": "中建安装集团有限公司",
        "scale": "占地 15 公顷，13个建筑单体",
        "desc": "雄安新区首个净水厂工程，由综合楼、组合池A/B、膜车间、清水池等13个单体组成。全过程应用BIM进行深化设计与三星智慧工地建设。",
        "pno": 61,
        "box_card": (0.05, 0.43, 0.95, 0.65),
        "box_thumb": (0.10, 0.49, 0.92, 0.64)
    },
    {
        "id": "chengdu-hezuo-plant",
        "name": "成都合作污水处理厂四期及配套管网项目",
        "category": "市政公用",
        "client": "成都环境工程建设有限公司",
        "scale": "占地 69.6 亩，18个建筑单体",
        "desc": "主要包括粗格栅及污水提升泵房、中细格栅及曝气沉砂池、调节事故池等18个单体。深化应用BIM进行可视化交底与进度管控。",
        "pno": 61,
        "box_card": (0.05, 0.73, 0.95, 0.95),
        "box_thumb": (0.10, 0.79, 0.92, 0.94)
    }
]

# Generate card and thumb crops for all cases
for item in cases:
    card_name = f"card_{item['id']}.png"
    thumb_name = f"thumb_{item['id']}.png"
    item["card_img"] = crop_exact(item["pno"], item["box_card"], card_name)
    item["thumb_img"] = crop_exact(item["pno"], item["box_thumb"], thumb_name)
    print(f"Generated assets for case: {item['name']}")

# Save cases_brochure_data.json
json_path = "/Users/bimcc/Desktop/Design Website/官网升级/bimcc-redesign/data/cases_brochure_data.json"
os.makedirs(os.path.dirname(json_path), exist_ok=True)
with open(json_path, "w", encoding="utf-8") as f:
    json.dump(cases, f, ensure_ascii=False, indent=2)

print(f"Saved {len(cases)} authentic brochure cases to {json_path}!")
