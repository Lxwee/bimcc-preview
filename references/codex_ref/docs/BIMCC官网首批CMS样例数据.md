# BIMCC 官网首批 CMS 样例数据

版本：2026-09-01  
用途：为新版官网第一批页面提供可录入 CMS 的样例数据结构，帮助内容运营、开发和测试同步字段、关系和展示逻辑。  
承接文件：
- `BIMCC官网CMS字段模型与内容数据字典.md`
- `BIMCC官网首页完整文案稿.md`
- `BIMCC首页精选案例字段表.md`
- `BIMCC官网SEO与上线验收清单.md`

资料边界：以下内容用于 CMS 建模、页面联调和内容录入起稿，不代表可直接上线。统计数字、客户名称、案例图片、Logo、证书和联系方式需复核或授权后发布。

---

## 1. 使用规则

### 内容状态

建议所有首批样例先使用：

```text
status: review
verification_status: pending
permission_status: pending
```

可直接上线的内容必须满足：
- 统计数字有来源并完成复核。
- 客户名称、Logo、项目图和截图有授权。
- 平台截图已脱敏。
- 联系方式、二维码、地址和表单接收人已确认。
- SEO 标题、描述、H1、alt 文案已填写。

### 关系字段

录入时请优先建立以下关系：

```text
首页 -> 精选产品
首页 -> 精选方案
首页 -> 精选案例
产品 -> 相关方案
产品 -> 相关案例
方案 -> 推荐产品组合
方案 -> 典型案例
案例 -> 使用产品服务
案例 -> 相关方案
资源 -> 相关产品或方案
```

---

## 2. Site Settings 样例

| 字段 | 样例值 | 状态 | 备注 |
|---|---|---|---|
| site_name | 筑云科技 BIMCC | 可用 | 品牌名 |
| site_description | 一体化数字建设解决方案服务商 | 可用 | 默认 SEO |
| primary_cta_label | 预约咨询 | 可用 | 全站主 CTA |
| primary_cta_url | /contact | 可用 | 指向联系页 |
| primary_nav | 首页、产品平台、解决方案、客户案例、技术与研发、资源中心、关于筑云、联系我们 | 可用 | 顶部导航需保留首页 |
| phone | 023-68682379 | 待复核 | 来源宣传册 |
| mobile | 18584713100 | 待复核 | 来源宣传册 |
| email | info@bimcc.com | 待复核 | 来源宣传册 |
| address_hq | 重庆市江北区南桥寺永辉总部大厦 7 楼 | 待复核 | 来源宣传册 |
| privacy_url | /privacy | 待补充 | 表单合规必需 |
| icp_text | 待补充 | 待补充 | 官网底部必需 |

---

## 3. Navigation 样例

| label | url | parent | sort_order | show_in_header | show_in_footer |
|---|---|---|---:|---|---|
| 首页 | / | 无 | 10 | true | true |
| 产品平台 | /products | 无 | 20 | true | true |
| 解决方案 | /solutions | 无 | 30 | true | true |
| 客户案例 | /cases | 无 | 40 | true | true |
| 技术与研发 | /research | 无 | 50 | true | true |
| 资源中心 | /resources | 无 | 60 | true | true |
| 关于筑云 | /about | 无 | 70 | true | true |
| 联系我们 | /contact | 无 | 80 | true | true |
| 飞椽 Fyra 智能开发平台 | /products/fyra | 产品平台 | 21 | false | true |
| BIMCC 智能建造平台 | /products/bimcc-platform | 产品平台 | 22 | false | true |
| 智慧工地建设 | /products/smart-site | 产品平台 | 23 | false | true |
| 数字孪生与智慧运维 | /products/digital-twin-operation | 产品平台 | 24 | false | true |
| BIM 咨询服务 | /products/bim-consulting | 产品平台 | 25 | false | true |
| 企业级数字化运营与转型方案 | /solutions/enterprise-digital-operation | 解决方案 | 31 | false | true |
| 项目级智能建造平台解决方案 | /solutions/project-smart-construction | 解决方案 | 32 | false | true |
| 建设单位数字建管解决方案 | /solutions/owner-digital-management | 解决方案 | 33 | false | true |
| 施工单位智能建造解决方案 | /solutions/contractor-smart-construction | 解决方案 | 34 | false | true |
| 全咨监理数字化协同解决方案 | /solutions/consulting-supervision-collaboration | 解决方案 | 35 | false | true |
| 政府集团监管解决方案 | /solutions/government-group-supervision | 解决方案 | 36 | false | true |

---

## 4. Home Page 样例

| 字段 | 样例值 | 备注 |
|---|---|---|
| title | 首页 | 页面标题 |
| slug | home | 可映射 `/` |
| page_type | home | 页面类型 |
| hero_title | 一体化数字建设解决方案服务商 | H1 |
| hero_subtitle | 让工程建设管理，从项目现场走向全生命周期数字化 | 首屏副标题 |
| hero_description | 筑云科技 BIMCC 以飞椽 Fyra 智能开发平台为技术底座，融合 BIM、GIS、物联网、AI 与数字孪生能力，为建设单位、施工企业、全咨监理、政府监管与教育医疗客户，提供从前期规划、施工管控到运维交付的一体化数字建设服务。 | 首屏说明 |
| hero_image | hero-platform-dashboard-2400x1350.jpg | 待提供真实截图 |
| hero_cta_primary.label | 预约方案咨询 | 主 CTA |
| hero_cta_primary.url | /contact | 指向联系页 |
| hero_cta_secondary.label | 查看客户案例 | 次 CTA |
| hero_cta_secondary.url | /cases | 指向案例库 |
| seo_title | 筑云科技 BIMCC - 一体化数字建设解决方案服务商 | 待上线前确认 |
| seo_description | 面向建设单位、施工企业、全咨监理和政府监管提供智能建造平台、智慧工地、数字孪生和 BIM 咨询服务。 | 待上线前确认 |
| og_image | og-home-bimcc-1200x630.jpg | 待设计 |
| status | review | 待复核 |

---

## 5. 首页信任数字样例

| metric_value | metric_label | metric_description | source | verification_status | sort_order |
|---|---|---|---|---|---:|
| 80% | 大型国央企 / 政府监管客户 | 长期服务高标准工程建设与监管场景 | 宣传册 | pending | 10 |
| 1000+ | 重点建设项目 | 覆盖房建、交通、水利、民航、市政等场景 | 宣传册 | pending | 20 |
| 80+ | 专利软著 | 持续沉淀自研平台与工程数字技术 | 宣传册 | pending | 30 |
| 100+ | 国家级、省部级奖项 | 多次获得 BIM 与智能建造领域荣誉 | 宣传册 | pending | 40 |

说明：
- “2014 年成立”不进入首页 Hero 指标。
- 所有数字上线前必须确认统计口径、是否可公开、是否需要加“截至某年”。

---

## 6. 首页痛点解法样例

| pain_title | pain_description | solution_description | sort_order |
|---|---|---|---:|
| 系统割裂，数据重复填报 | 多个系统分散建设，现场和企业数据难以统一。 | 统一平台、统一账号、统一数据底座，减少多系统切换和重复上报。 | 10 |
| 集团看不清项目 | 企业级管理和项目级执行之间反馈不及时。 | 构建企业、项目、工点多层级联动，实现进度、质量、安全、成本动态监管。 | 20 |
| 现场风险闭环慢 | 现场风险发现晚，问题流转和闭环缺少统一机制。 | 融合智慧工地设备、AI 识别与预警机制，让风险从被动处理转向主动预警。 | 30 |
| BIM 与业务脱节 | BIM 模型停留在成果交付，未进入真实管理流程。 | 将 BIM/GIS 可视化与质量、安全、进度、成本、物资设备等业务流程融合。 | 40 |
| 定制开发周期长 | 标准化平台和项目个性化需求难以兼顾。 | 依托飞椽 Fyra 零代码开发平台，快速搭建适配企业与项目特点的管理系统。 | 50 |
| 数据难沉淀到运维 | 施工阶段数据无法持续服务资产运营。 | 通过数字孪生与智慧运维平台，让工程建设数据持续服务资产运营。 | 60 |

---

## 7. 首页能力地图样例

| capability_name | capability_level | parent_capability | related_product | description | sort_order |
|---|---|---|---|---|---:|
| 飞椽 Fyra 智能开发平台 | 技术底座 | 无 | 飞椽 Fyra | 面向工程行业的 AI+零代码应用开发底座。 | 10 |
| BIMCC 智能建造平台 | 业务平台 | 飞椽 Fyra 智能开发平台 | BIMCC 智能建造平台 | 覆盖项目管理、协同办公、质量安全、进度成本、BIM+GIS 和数字档案等场景。 | 20 |
| 智慧工地建设 | 服务交付 | BIMCC 智能建造平台 | 智慧工地建设 | 支持现场物联网设备接入、视频监控、风险预警和监管平台对接。 | 30 |
| 数字孪生与智慧运维 | 服务交付 | BIMCC 智能建造平台 | 数字孪生与智慧运维 | 从建设交付延伸到资产运营，形成可视化运维驾驶舱。 | 40 |
| BIM 咨询服务 | 服务交付 | BIMCC 智能建造平台 | BIM 咨询服务 | 提供全过程、全专业 BIM 技术服务和数字化交付支撑。 | 50 |
| 工程数字技术创新 | 技术能力 | 飞椽 Fyra 智能开发平台 | 技术与研发 | 融合 BIM、GIS、UE、3DGS、AI 和物联网等工程数字技术。 | 60 |

---

## 8. Product 样例

| product_name | slug | product_category | one_liner | is_featured | status | sort_order |
|---|---|---|---|---|---|---:|
| 飞椽 Fyra 智能开发平台 | fyra | 平台产品 | 工程行业 AI+零代码应用开发底座 | true | review | 10 |
| BIMCC 智能建造平台 | bimcc-platform | 平台产品 | 项目全生命周期数字建造管理平台 | true | review | 20 |
| 智慧工地建设服务 | smart-site | 服务能力 | 现场设备接入与智慧监管一体化 | true | review | 30 |
| 数字孪生与智慧运维 | digital-twin-operation | 平台产品 | 从工程交付到资产运营的一张图 | true | review | 40 |
| BIM 咨询服务 | bim-consulting | 咨询服务 | 全过程、全专业 BIM 技术服务 | true | review | 50 |
| 数字化教育体系 | digital-education | 服务能力 | 面向高校与职教的智能建造实训体系 | false | review | 60 |

### Product 详情样例

#### 飞椽 Fyra 智能开发平台

| 字段 | 样例值 |
|---|---|
| target_users | 工程企业数字化负责人、研发团队、项目管理团队 |
| pain_points | 系统建设周期长、项目差异化需求多、重复开发成本高 |
| core_capabilities | 页面构建、表单构建、流程配置、报表配置、数据大屏、APP/H5、物联网中台、AI 能力 |
| scenarios | 企业级数字化运营、项目级管理平台、行业监管平台、智慧工地扩展应用 |
| product_screenshots | fyra-devstudio-editor-1920x1200.jpg |
| related_solutions | 企业级数字化运营与转型方案、项目级智能建造平台解决方案 |
| seo_title | 飞椽 Fyra 智能开发平台 - 工程行业 AI+零代码应用开发底座 |
| seo_description | 面向工程建设企业提供表单、流程、数据大屏和多端应用快速构建能力，支撑项目级和企业级数字化应用落地。 |

#### BIMCC 智能建造平台

| 字段 | 样例值 |
|---|---|
| target_users | 建设单位、施工企业、全咨监理、政府监管、集团公司 |
| pain_points | 项目数据分散、多方协同复杂、进度质量安全难以动态监管 |
| core_capabilities | 协同办公、设计管控、质量安全、进度成本、物资设备、数字档案、BIM+GIS 一张图、智慧运维 |
| scenarios | 项目级智能建造、企业多项目监管、政府集团监管、数字化交付 |
| product_screenshots | bimcc-project-map-1920x1080.jpg |
| related_solutions | 建设单位数字建管解决方案、施工单位智能建造解决方案、项目级智能建造平台解决方案 |
| seo_title | BIMCC 智能建造平台 - 项目级与企业级数字建造平台 |
| seo_description | 融合工程业务数据、模型数据和物联数据，支撑进度、质量、安全、成本、资料和 BIMGIS 一张图管理。 |

---

## 9. Solution 样例

| solution_name | slug | solution_type | target_role | recommended_products | is_featured | status | sort_order |
|---|---|---|---|---|---|---|---:|
| 企业级数字化运营与转型方案 | enterprise-digital-operation | 建设层级 | 建设集团、工程企业、数字化负责人 | 飞椽 Fyra、BIMCC 智能建造平台 | true | review | 10 |
| 项目级智能建造平台解决方案 | project-smart-construction | 建设层级 | 建设单位、施工单位、项目管理团队 | BIMCC 智能建造平台、智慧工地建设服务 | true | review | 20 |
| 建设单位数字建管解决方案 | owner-digital-management | 客户角色 | 建设单位、业主方 | BIMCC 智能建造平台、数字孪生与智慧运维、BIM 咨询服务 | true | review | 30 |
| 施工单位智能建造解决方案 | contractor-smart-construction | 客户角色 | 施工总包、项目部 | BIMCC 智能建造平台、智慧工地建设服务、飞椽 Fyra | true | review | 40 |
| 全咨监理数字化协同解决方案 | consulting-supervision-collaboration | 客户角色 | 全咨单位、监理单位 | BIMCC 智能建造平台、BIM 咨询服务 | true | review | 50 |
| 政府集团监管解决方案 | government-group-supervision | 客户角色 | 政府监管、集团监管 | 监管驾驶舱、智慧工地平台、数据中台 | true | review | 60 |

### Solution 详情样例

| solution_name | core_problem | solution_path | deliverables | seo_title |
|---|---|---|---|---|
| 企业级数字化运营与转型方案 | 企业与项目数据割裂，缺少统一经营监管视图。 | 业务诊断、平台搭建、项目数据接入、驾驶舱配置、运营优化。 | 企业门户、项目驾驶舱、数据中台、管理报表、应用模板。 | 企业级数字化运营与转型方案 - 筑云科技 BIMCC |
| 项目级智能建造平台解决方案 | 项目现场多方协同复杂，进度、质量、安全、资料和模型难以统一管理。 | 项目建模、平台部署、设备接入、业务流程配置、数据沉淀。 | 项目管理平台、BIM+GIS 一张图、智慧工地接入、数字档案。 | 项目级智能建造平台解决方案 - 筑云科技 BIMCC |

---

## 10. Case 样例

以下案例用于样例录入和页面联调。客户名称、Logo、项目图片和成果表述需授权后才能公开展示。

| case_title | public_title | slug | client_type | industry | services_used | permission_status | featured_home |
|---|---|---|---|---|---|---|---|
| 重庆机电控股集团企业级 BIM 施工管理平台 | 某大型制造集团企业级 BIM 施工管理平台 | chongqing-machinery-bim-platform | 国央企 / 集团企业 | 企业级平台 | BIMCC 智能建造平台、飞椽 Fyra | pending | true |
| 重庆建工集团工程质量企业智慧监管平台 | 某大型建设集团工程质量智慧监管平台 | chongqing-construction-quality-supervision | 国央企 / 施工企业 | 企业级监管 | BIMCC 智能建造平台、智慧工地建设服务 | pending | true |
| 海南交投数智建管平台 | 某交通建设集团数智建管平台 | hainan-transport-digital-platform | 国央企 / 建设单位 | 交通基础设施 | BIMCC 智能建造平台、数字孪生与智慧运维 | pending | true |
| 重庆轨道交通 15 号线 BIM+智慧工地建管平台 | 某轨道交通项目 BIM+智慧工地建管平台 | chongqing-rail-15-smart-site | 建设单位 / 项目公司 | 轨道交通 | BIMCC 智能建造平台、智慧工地建设服务、BIM 咨询服务 | pending | true |
| 南宁吴圩国际机场 T3 航站区及配套设施建设工程 | 某大型民航机场航站区建设工程数字化管理项目 | nanning-airport-t3-digital-construction | 建设单位 | 民航机场 | BIMCC 智能建造平台、BIM 咨询服务 | pending | true |
| 永安抽蓄智慧工地平台 | 某抽水蓄能项目智慧工地平台 | yongan-pumped-storage-smart-site | 建设单位 / 项目公司 | 水利水电 | 智慧工地建设服务、BIMCC 智能建造平台 | pending | true |
| 重庆工商职业学院数字基建管理平台 | 某高校数字基建管理平台 | chongqing-vocational-college-digital-infra | 教育客户 | 教育基建 | BIMCC 智能建造平台、数字化教育体系 | pending | false |
| 呈贡文体活动中心智慧运维平台 | 某文体活动中心智慧运维平台 | chenggong-cultural-sports-operation | 运营单位 | 文体建筑 / 运维 | 数字孪生与智慧运维、BIM 咨询服务 | pending | false |

### Case 卡片样例

| 字段 | 样例值 |
|---|---|
| problem_summary | 多专业、多角色协同复杂，项目过程监管和数据沉淀要求高。 |
| solution_summary | 通过 BIMCC 智能建造平台、BIM+GIS 一张图和智慧工地能力统一项目过程管理。 |
| outcome_summary | 待业务提供可公开成果，不在样例中虚构量化收益。 |
| cover_image | case-{slug}-cover-1600x1200.jpg |
| related_products | BIMCC 智能建造平台、智慧工地建设服务、BIM 咨询服务 |
| related_solutions | 项目级智能建造平台解决方案 |
| status | review |

---

## 11. Resource 样例

| title | slug | resource_type | summary | related_products | related_solutions | status |
|---|---|---|---|---|---|---|
| 智能建造平台如何支撑项目级管理闭环 | smart-construction-platform-project-management | 行业洞察 | 介绍项目进度、质量、安全、资料和模型协同的数字化管理路径。 | BIMCC 智能建造平台 | 项目级智能建造平台解决方案 | draft |
| 飞椽 Fyra 如何降低工程系统重复开发成本 | fyra-reduce-custom-development-cost | 产品动态 | 说明零代码平台在表单、流程、报表、大屏和移动端应用中的落地方式。 | 飞椽 Fyra 智能开发平台 | 企业级数字化运营与转型方案 | draft |
| 从建设交付到智慧运维的数据延续 | digital-twin-operation-data-continuity | 行业洞察 | 介绍数字孪生与智慧运维如何承接建设期数据并服务资产运营。 | 数字孪生与智慧运维 | 建设单位数字建管解决方案 | draft |
| 交通基础设施项目数字化建设实践 | transport-infrastructure-digital-construction | 案例实践 | 汇总交通、市政、轨道、民航等基础设施项目中的数字建管实践。 | BIMCC 智能建造平台、智慧工地建设服务 | 政府集团监管解决方案 | draft |

---

## 12. Honor 样例

荣誉资质需按证书原文录入，以下仅为分类样例。

| honor_name | honor_type | issuing_org | issue_year | verification_status | display_scope | status |
|---|---|---|---|---|---|---|
| 高新技术企业 | 资质认证 | 待补充 | 待复核 | pending | 荣誉资质页 | review |
| CMMI 认证 | 资质认证 | 待补充 | 待复核 | pending | 首页、荣誉资质页 | review |
| 专利软著代表项 | 专利软著 | 待补充 | 待复核 | pending | 荣誉资质页 | review |
| BIM 与智能建造领域代表奖项 | 奖项 | 待补充 | 待复核 | pending | 首页、荣誉资质页 | review |
| 国产化生态适配代表项 | 生态适配 | 待补充 | 待复核 | pending | 荣誉资质页 | review |

说明：
- 宣传册提到 `80+ 专利软著` 和 `100+ 国家级、省部级奖项`，但具体条目需证书或内部清单确认。
- 首页只展示代表性资质和奖项，完整内容进入荣誉资质页。

---

## 13. Asset 样例

| asset_id | file_name | asset_type | page_usage | rights_status | need_desensitize | alt_text | notes |
|---|---|---|---|---|---|---|---|
| hero-platform-dashboard | hero-platform-dashboard-2400x1350.jpg | 产品截图 | 首页 Hero | pending | yes | BIMCC 智能建造平台项目驾驶舱截图 | P0 素材 |
| fyra-devstudio-editor | fyra-devstudio-editor-1920x1200.jpg | 产品截图 | 飞椽产品页、首页产品模块 | pending | yes | 飞椽 Fyra 表单与流程配置界面 | P0 素材 |
| bimcc-project-map | bimcc-project-map-1920x1080.jpg | 产品截图 | BIMCC 产品页、首页 Hero | pending | yes | BIMCC 智能建造平台 BIM+GIS 一张图截图 | P0 素材 |
| smart-site-device | smart-site-device-1600x1200.jpg | 项目照片 | 智慧工地产品页 | pending | yes | 智慧工地现场设备接入场景图 | P0 素材 |
| digital-twin-operation | digital-twin-operation-1920x1080.jpg | 产品截图 | 数字孪生与智慧运维页 | pending | yes | 数字孪生智慧运维驾驶舱截图 | P0 素材 |
| case-hainan-jiaotou-cover | case-hainan-jiaotou-cover-1600x1200.jpg | 案例封面 | 首页精选案例、案例库 | pending | yes | 交通基础设施数字化管理项目案例封面 | 客户授权后展示 |
| honor-cmmi-certificate | honor-cmmi-certificate-1200x1600.jpg | 证书 | 首页信任背书、荣誉资质页 | pending | no | 筑云科技 CMMI 认证证书 | 需复核证书原件 |
| contact-qrcode-wechat | contact-qrcode-wechat-800x800.png | 二维码 | 联系页、Footer | pending | no | 筑云科技官网咨询二维码 | 需确认账号 |
| og-home-bimcc | og-home-bimcc-1200x630.jpg | OG 图 | 首页分享 | pending | no | 筑云科技 BIMCC 官网首页分享图 | 待设计 |

---

## 14. Lead 表单样例

| 字段 | 样例值 | 说明 |
|---|---|---|
| name | 王先生 | 测试数据，上线前清理 |
| phone | 13800000000 | 测试数据，上线前清理 |
| company | 某建设集团 | 样例 |
| role | 项目负责人 | 可选 |
| demand_type | 解决方案咨询 | 下拉选项 |
| interested_products | BIMCC 智能建造平台、智慧工地建设服务 | 多选 |
| project_location | 重庆 | 可选 |
| message | 希望了解项目级智能建造平台建设方案。 | 用户填写 |
| source_page | /solutions/project-smart-construction | 自动记录 |
| consent_privacy | true | 必填 |
| follow_status | new | 默认 |

需求类型选项：

```text
产品咨询
解决方案咨询
案例资料
商务合作
资料下载
其他
```

---

## 15. 首页模块组装样例

建议首页 `sections` 按以下顺序配置：

| sort_order | section_type | section_title | data_source | status |
|---:|---|---|---|---|
| 10 | hero_platform | 一体化数字建设解决方案服务商 | Page 字段 + Asset | review |
| 20 | proof_metrics | 核心数字背书 | Metric 模型 | review |
| 30 | pain_solution_grid | 工程数字化，不该只是多个系统的叠加 | 首页痛点解法 | review |
| 40 | capability_map | 以自研平台为底座，覆盖工程建设全生命周期 | 首页能力地图 | review |
| 50 | product_platform | 产品平台与服务能力 | Product 关联 | review |
| 60 | solution_segments | 按你的角色与行业，找到适合的数字建设路径 | Solution 关联 | review |
| 70 | technical_advantages | 自研技术底座，让工程数字化更快落地、更易扩展 | 技术优势数据 | review |
| 80 | featured_cases | 1000+ 项目实践，覆盖多类工程建设场景 | Case 关联 | review |
| 90 | conversion_cta | 预约咨询，获取适合你的数字建设方案 | Contact 配置 | review |

说明：
- 视觉上首页是 8 个主模块，但 CMS 可以把首屏和信任数字拆成两个数据块，前端展示时合并为一个首屏区域。
- 前台显示仍需遵守首页 8 模块节奏。

---

## 16. SEO 样例

| page | seo_title | seo_description | og_image |
|---|---|---|---|
| 首页 | 筑云科技 BIMCC - 一体化数字建设解决方案服务商 | 面向建设单位、施工企业、全咨监理和政府监管提供智能建造平台、智慧工地、数字孪生和 BIM 咨询服务。 | og-home-bimcc-1200x630.jpg |
| 产品平台总览 | 产品平台 - 筑云科技 BIMCC 智能建造与数字建设产品矩阵 | 了解飞椽 Fyra、BIMCC 智能建造平台、智慧工地、数字孪生与 BIM 咨询等产品和服务能力。 | og-products-bimcc-1200x630.jpg |
| 飞椽 Fyra | 飞椽 Fyra 智能开发平台 - 工程行业 AI+零代码应用开发底座 | 面向工程建设企业提供表单、流程、数据大屏和多端应用快速构建能力。 | og-fyra-1200x630.jpg |
| BIMCC 智能建造平台 | BIMCC 智能建造平台 - 项目级与企业级数字建造平台 | 融合工程业务数据、模型数据和物联数据，支撑项目全生命周期数字建造管理。 | og-bimcc-platform-1200x630.jpg |
| 解决方案总览 | 解决方案 - 筑云科技工程数字化与智能建造解决方案 | 按建设单位、施工单位、全咨监理、政府集团监管、企业级和项目级场景找到适合方案。 | og-solutions-1200x630.jpg |
| 客户案例 | 客户案例 - 筑云科技智能建造与数字建设项目实践 | 查看筑云科技在房建、交通、水利、民航、市政等重点建设项目中的数字化实践。 | og-cases-1200x630.jpg |
| 联系我们 | 联系我们 - 筑云科技 BIMCC 方案咨询 | 联系筑云科技，咨询智能建造平台、智慧工地、数字孪生、BIM 咨询和工程数字化解决方案。 | og-contact-1200x630.jpg |

---

## 17. 录入顺序建议

第一批录入：
1. Site Settings。
2. Navigation。
3. Asset 占位。
4. Product。
5. Solution。
6. Case。
7. Home Page 与首页 sections。
8. SEO 字段。
9. Lead 表单字段。

第二批录入：
1. 荣誉资质。
2. 资源中心。
3. 关于筑云。
4. 技术与研发。
5. 其余产品与服务详情页。

---

## 18. CMS 联调验收

- 首页能按 `sort_order` 正确渲染模块。
- Header 能读取 Navigation 并保留“首页”。
- 主 CTA 能读取 Site Settings。
- 首页信任数字能显示 4 项，不出现“2014 年成立”。
- Product、Solution、Case 之间的关联能正常显示。
- 未授权案例能显示 `public_title`，不暴露 `case_title`、客户 Logo 和未授权图片。
- 图片 alt 能进入前端。
- SEO 字段能输出到页面。
- 表单提交能记录 `source_page` 和 `demand_type`。
- review 状态内容不会被误发布到正式站，除非上线流程允许。
