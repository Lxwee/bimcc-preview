# BIMCC 官网 CMS 字段模型与内容数据字典

版本：2026-09-01  
用途：为新版官网开发、CMS 建模、内容录入、SEO 配置和后续运营提供字段标准。  
适用范围：首页、产品平台、解决方案、客户案例、资源中心、荣誉资质、联系我们和全站公共配置。

资料边界：宣传册与官网信息仅作为内容来源和事实参考。涉及客户、案例、联系方式、资质证书、统计数字和图片授权的字段需要上线前复核。

---

## 1. 字段命名原则

建议采用英文 snake_case 字段名，中文后台标签，便于开发、API、CMS 和内容运营协作。

通用规则：
- `title`：页面或内容主标题。
- `slug`：URL 片段，需唯一。
- `summary`：列表页或卡片摘要。
- `body`：正文富文本或结构化模块。
- `status`：draft、review、published、archived。
- `sort_order`：手动排序，数字越小越靠前。
- `seo_title`、`seo_description`、`og_image`：SEO 与社交分享字段。
- `created_at`、`updated_at`、`published_at`：系统时间字段。

内容状态建议：

| 状态 | 含义 | 使用场景 |
|---|---|---|
| draft | 草稿 | 内容录入中 |
| review | 待审核 | 等待市场、业务或法务确认 |
| published | 已发布 | 前台展示 |
| archived | 已归档 | 不删除，但前台隐藏 |

---

## 2. 全站配置 Site Settings

| 字段名 | 中文标签 | 类型 | 必填 | 示例 | 说明 |
|---|---|---|---|---|---|
| site_name | 网站名称 | text | 是 | 筑云科技 BIMCC | 全站品牌名 |
| site_description | 网站简介 | textarea | 是 | 一体化数字建设解决方案服务商 | 用于默认 SEO |
| logo_light | 浅色 Logo | asset | 是 | logo-light.svg | 深色背景使用 |
| logo_dark | 深色 Logo | asset | 是 | logo-dark.svg | 浅色背景使用 |
| primary_nav | 顶部导航 | relation/list | 是 | 首页、产品平台、解决方案 | 支持排序 |
| primary_cta_label | 主 CTA 文案 | text | 是 | 预约咨询 | 全站统一 |
| primary_cta_url | 主 CTA 链接 | url | 是 | /contact | 指向联系页或表单 |
| phone | 电话 | text | 待复核 | 023-68682379 | 来源宣传册，需确认 |
| mobile | 手机 | text | 待复核 | 18584713100 | 来源宣传册，需确认 |
| email | 邮箱 | email | 待复核 | info@bimcc.com | 来源宣传册，需确认 |
| address_hq | 重庆总部地址 | textarea | 待复核 | 重庆市江北区南桥寺永辉总部大厦 7 楼 | 来源宣传册 |
| qr_wechat | 微信或企微二维码 | asset | 否 | qr-wechat.png | 需确认用途 |
| icp_text | ICP 备案信息 | text | 是 | 待补充 | 官网底部合规信息 |
| privacy_url | 隐私政策链接 | url | 是 | /privacy | 表单必需 |

---

## 3. 页面模型 Page

用于管理首页、关于页、技术与研发页、联系我们页等非结构化或半结构化页面。

| 字段名 | 中文标签 | 类型 | 必填 | 示例 | 说明 |
|---|---|---|---|---|---|
| title | 页面标题 | text | 是 | 关于筑云 | 后台识别 |
| slug | URL 片段 | slug | 是 | about | 唯一 |
| page_type | 页面类型 | select | 是 | about | home、about、contact、research 等 |
| hero_title | Hero 标题 | text | 是 | 深耕建设工程行业的一体化数字建设解决方案服务商 | 前台 H1 |
| hero_subtitle | Hero 副标题 | textarea | 是 | 自主研发、深度行业适配、全生命周期服务 | 控制长度 |
| hero_image | Hero 图片 | asset | 否 | hero-platform-dashboard.jpg | 首页优先使用真实平台图 |
| hero_cta_primary | Hero 主 CTA | object | 否 | 预约咨询 | label + url |
| hero_cta_secondary | Hero 次 CTA | object | 否 | 查看案例 | label + url |
| sections | 页面模块 | blocks | 是 | Hero、能力地图、案例 | 结构化模块数组 |
| seo_title | SEO 标题 | text | 是 | 筑云科技 BIMCC - 一体化数字建设解决方案服务商 | 建议 20-32 个中文字符 |
| seo_description | SEO 描述 | textarea | 是 | 面向建设单位、施工企业、全咨监理和政府监管提供智能建造平台、智慧工地、数字孪生和 BIM 咨询服务。 | 建议 70-120 个中文字符 |
| og_image | 分享图 | asset | 否 | og-home.jpg | 1200x630 |
| status | 状态 | select | 是 | published | 发布控制 |

---

## 4. 产品模型 Product

适用于飞椽 Fyra、BIMCC 智能建造平台、智慧工地、数字孪生与智慧运维、BIM 咨询服务等。

| 字段名 | 中文标签 | 类型 | 必填 | 示例 | 说明 |
|---|---|---|---|---|---|
| product_name | 产品名称 | text | 是 | 飞椽 Fyra 智能开发平台 | 前台展示 |
| slug | URL 片段 | slug | 是 | fyra | 唯一 |
| product_category | 产品分类 | select | 是 | 平台产品 | 平台产品、服务能力、咨询服务 |
| one_liner | 一句话定位 | text | 是 | 工程行业 AI+零代码应用开发底座 | 卡片和 Hero 使用 |
| target_users | 适用对象 | list | 是 | 企业数字化负责人、项目管理团队 | 支持多选 |
| pain_points | 解决问题 | blocks/list | 是 | 系统建设周期长、业务变化快 | 每项含标题和说明 |
| core_capabilities | 核心能力 | blocks/list | 是 | 表单构建、流程配置、数据大屏 | 每项含图标、标题、说明 |
| scenarios | 应用场景 | relation/list | 是 | 企业级数字化、项目级管理 | 可关联解决方案 |
| architecture_image | 架构图 | asset | 否 | fyra-architecture.svg | 无素材时先占位 |
| product_screenshots | 产品截图 | asset/list | 是 | fyra-devstudio-editor.jpg | 真实截图优先 |
| related_cases | 相关案例 | relation/list | 否 | 某企业级数字化平台 | 需授权后前台展示 |
| related_solutions | 相关方案 | relation/list | 否 | 企业级数字化运营与转型方案 | 用于互链 |
| download_asset | 资料下载 | asset | 否 | fyra-introduction.pdf | 是否留资需确认 |
| sort_order | 排序 | number | 是 | 10 | 产品总览页排序 |
| is_featured | 首页推荐 | boolean | 是 | true | 首页产品模块使用 |
| seo_title | SEO 标题 | text | 是 | 飞椽 Fyra 智能开发平台 - 工程行业 AI+零代码应用开发底座 | 产品页 SEO |
| seo_description | SEO 描述 | textarea | 是 | 面向工程建设企业提供表单、流程、数据大屏和多端应用快速构建能力，支撑项目级和企业级数字化应用落地。 | 产品页 SEO |
| status | 状态 | select | 是 | published | 发布控制 |

---

## 5. 解决方案模型 Solution

适用于建设单位、施工单位、全咨监理、政府集团监管、企业级、项目级等解决方案页面。

| 字段名 | 中文标签 | 类型 | 必填 | 示例 | 说明 |
|---|---|---|---|---|---|
| solution_name | 方案名称 | text | 是 | 企业级数字化运营与转型方案 | 前台展示 |
| slug | URL 片段 | slug | 是 | enterprise-digital-operation | 唯一 |
| solution_type | 方案类型 | select | 是 | 建设层级 | 客户角色、建设层级、行业场景 |
| target_role | 目标客户 | select/list | 是 | 建设单位、集团公司 | 便于筛选 |
| target_industry | 行业场景 | select/list | 否 | 房建、市政、轨道 | 可多选 |
| core_problem | 核心问题 | textarea | 是 | 企业与项目数据割裂，缺少统一经营监管视图 | Hero 或摘要使用 |
| solution_path | 方案路径 | blocks/list | 是 | 诊断、平台搭建、数据接入、运营优化 | 每项含步骤名和说明 |
| recommended_products | 推荐产品组合 | relation/list | 是 | BIMCC、飞椽 Fyra、智慧工地 | 关联 Product |
| deliverables | 交付成果 | list/blocks | 是 | 平台门户、项目驾驶舱、管理报表 | 展示成果 |
| typical_cases | 典型案例 | relation/list | 否 | 某国有建设集团 | 授权后展示 |
| metrics | 相关数字 | object/list | 否 | 1000+ 重点项目 | 必须标注来源和复核状态 |
| hero_image | 方案主图 | asset | 否 | solution-enterprise-dashboard.jpg | 平台或项目图 |
| sort_order | 排序 | number | 是 | 20 | 总览页排序 |
| is_featured | 首页推荐 | boolean | 是 | true | 首页方案模块使用 |
| seo_title | SEO 标题 | text | 是 | 企业级数字化运营与转型方案 - 筑云科技 BIMCC | 方案页 SEO |
| seo_description | SEO 描述 | textarea | 是 | 面向建设集团和工程企业，提供从项目数据接入、平台驾驶舱到经营监管的一体化数字化运营解决方案。 | 方案页 SEO |
| status | 状态 | select | 是 | published | 发布控制 |

---

## 6. 客户案例模型 Case

适用于案例列表、案例详情、首页精选案例和产品/方案详情页关联案例。

| 字段名 | 中文标签 | 类型 | 必填 | 示例 | 说明 |
|---|---|---|---|---|---|
| case_title | 案例标题 | text | 是 | 海口新海港和南港二线口岸客运查验基础设施项目 | 需确认公开口径 |
| public_title | 前台公开标题 | text | 是 | 某大型交通基础设施智能建造项目 | 未授权时使用 |
| slug | URL 片段 | slug | 是 | haikou-port-smart-construction | 唯一 |
| client_name | 客户名称 | text | 待授权 | 待复核 | 内部可存，前台受控 |
| client_type | 客户类型 | select | 是 | 政府监管 / 国央企 / 建设单位 | 可筛选 |
| industry | 行业 | select/list | 是 | 民航、交通、市政 | 可多选 |
| location | 项目所在地 | text | 否 | 海南海口 | 公开前复核 |
| project_stage | 项目阶段 | select | 否 | 建设期 | 建设期、运营期、咨询期 |
| services_used | 使用产品服务 | relation/list | 是 | BIMCC 智能建造平台、BIM 咨询 | 关联产品 |
| problem_summary | 客户挑战 | textarea | 是 | 多专业、多角色协同复杂，项目监管要求高 | 详情页使用 |
| solution_summary | 筑云方案 | textarea | 是 | 通过 BIM+GIS、项目驾驶舱和智慧工地能力统一管理 | 详情页使用 |
| outcome_summary | 成果摘要 | textarea | 是 | 待业务提供可公开成果 | 禁止虚构量化成果 |
| cover_image | 封面图 | asset | 是 | case-haikou-port-cover.jpg | 授权后展示 |
| gallery | 图集 | asset/list | 否 | 项目现场图、平台截图 | 需授权 |
| logo | 客户 Logo | asset | 否 | client-logo.svg | 需授权 |
| permission_status | 授权状态 | select | 是 | pending | pending、approved、limited、not_allowed |
| featured_home | 首页精选 | boolean | 是 | true | 首页案例使用 |
| related_products | 相关产品 | relation/list | 否 | BIMCC、智慧工地 | 互链 |
| related_solutions | 相关方案 | relation/list | 否 | 项目级智能建造平台解决方案 | 互链 |
| seo_title | SEO 标题 | text | 是 | 智能建造平台项目案例 - 筑云科技 BIMCC | 未授权时避免真实客户名 |
| seo_description | SEO 描述 | textarea | 是 | 查看筑云科技在交通、市政、房建等重点建设项目中的智能建造平台、智慧工地和 BIM 咨询实践。 | 案例页 SEO |
| status | 状态 | select | 是 | review | 发布控制 |

---

## 7. 资源内容模型 Resource

适用于行业洞察、产品动态、案例实践、公司新闻、资料下载。

| 字段名 | 中文标签 | 类型 | 必填 | 示例 | 说明 |
|---|---|---|---|---|---|
| title | 标题 | text | 是 | 智能建造平台如何支撑项目级管理闭环 | 前台展示 |
| slug | URL 片段 | slug | 是 | smart-construction-platform-project-management | 唯一 |
| resource_type | 内容类型 | select | 是 | 行业洞察 | 行业洞察、产品动态、案例实践、公司新闻、资料下载 |
| summary | 摘要 | textarea | 是 | 介绍项目进度、质量、安全和数据协同的数字化管理路径。 | 列表和 SEO 使用 |
| cover_image | 封面图 | asset | 否 | resource-smart-construction.jpg | 建议 16:9 |
| body | 正文 | richtext/blocks | 是 | 正文内容 | 支持图片、引用、表格 |
| download_file | 下载文件 | asset | 否 | bimcc-solution.pdf | 是否留资需确认 |
| require_lead_form | 下载是否留资 | boolean | 是 | false | 下载资源使用 |
| related_products | 相关产品 | relation/list | 否 | BIMCC 智能建造平台 | 互链 |
| related_solutions | 相关方案 | relation/list | 否 | 项目级智能建造平台解决方案 | 互链 |
| tags | 标签 | list | 否 | BIM、智慧工地、数字孪生 | 用于筛选 |
| author | 作者 | text | 否 | 筑云科技 | 默认可用 |
| published_at | 发布时间 | datetime | 是 | 2026-09-01 | 前台展示 |
| seo_title | SEO 标题 | text | 是 | 智能建造平台如何支撑项目级管理闭环 - 筑云科技 BIMCC | 内容页 SEO |
| seo_description | SEO 描述 | textarea | 是 | 了解智能建造平台在项目管理、现场监管、BIM+GIS 和数据驾驶舱中的应用方式。 | 内容页 SEO |
| status | 状态 | select | 是 | draft | 发布控制 |

---

## 8. 荣誉资质模型 Honor

适用于资质证书、认证、奖项、专利软著、标准参编和国产化适配。

| 字段名 | 中文标签 | 类型 | 必填 | 示例 | 说明 |
|---|---|---|---|---|---|
| honor_name | 名称 | text | 是 | CMMI 认证 | 需按证书原文录入 |
| honor_type | 类型 | select | 是 | 资质认证 | 资质认证、奖项、专利软著、标准、生态适配 |
| issuing_org | 颁发机构 | text | 待复核 | 待补充 | 需证书核验 |
| issue_year | 颁发年份 | number | 待复核 | 2024 | 需证书核验 |
| valid_until | 有效期至 | date | 否 | 待补充 | 过期证书不展示或标注 |
| certificate_image | 证书图片 | asset | 否 | honor-cmmi.jpg | 需可公开 |
| certificate_number | 证书编号 | text | 否 | 待补充 | 是否公开需确认 |
| public_summary | 前台说明 | textarea | 是 | 筑云科技持续沉淀研发能力和质量管理体系。 | 不虚构认证范围 |
| display_scope | 展示范围 | select | 是 | 荣誉资质页 | 首页、荣誉资质页、隐藏 |
| sort_order | 排序 | number | 是 | 10 | 越小越靠前 |
| verification_status | 复核状态 | select | 是 | pending | pending、verified、expired、hidden |
| status | 状态 | select | 是 | review | 发布控制 |

---

## 9. 素材模型 Asset

用于统一管理图片、Logo、证书、PDF、视频和二维码。

| 字段名 | 中文标签 | 类型 | 必填 | 示例 | 说明 |
|---|---|---|---|---|---|
| asset_title | 素材标题 | text | 是 | 首页平台驾驶舱主视觉 | 后台识别 |
| file | 文件 | asset/file | 是 | hero-platform-dashboard-2400x1350.jpg | 原始文件 |
| asset_type | 素材类型 | select | 是 | 产品截图 | Logo、产品截图、项目照片、证书、PDF、视频、二维码 |
| usage_scope | 使用范围 | select/list | 是 | 官网首页、产品页 | 授权范围 |
| source_owner | 来源负责人 | text | 是 | 市场部 / 产品部 / 项目组 | 追溯来源 |
| rights_status | 授权状态 | select | 是 | approved | pending、approved、limited、not_allowed |
| alt_text | 替代文本 | text | 是 | BIMCC 智能建造平台项目驾驶舱截图 | SEO 和无障碍 |
| focal_point | 裁切焦点 | text/object | 否 | center | 移动端裁切使用 |
| version | 版本 | text | 否 | v1 | 便于替换 |
| notes | 备注 | textarea | 否 | 客户 Logo 仅限案例页使用 | 风险提示 |

---

## 10. 表单线索模型 Lead

用于联系我们页、预约咨询、资料下载和浮动 CTA。

| 字段名 | 中文标签 | 类型 | 必填 | 示例 | 说明 |
|---|---|---|---|---|---|
| lead_id | 线索编号 | system | 是 | auto | 系统生成 |
| name | 姓名 | text | 是 | 张先生 | 用户填写 |
| phone | 手机 | tel | 是 | 13800000000 | 需校验 |
| company | 公司名称 | text | 是 | 某建设集团 | 用户填写 |
| role | 职位或角色 | text | 否 | 项目负责人 | 可选 |
| demand_type | 需求类型 | select | 是 | 产品咨询 | 产品咨询、解决方案、案例资料、合作、其他 |
| interested_products | 感兴趣产品 | relation/list | 否 | BIMCC、飞椽 Fyra | 可多选 |
| project_location | 项目或企业所在地 | text | 否 | 重庆 | 可选 |
| message | 需求描述 | textarea | 是 | 希望了解项目级智能建造平台建设方案 | 用户填写 |
| source_page | 来源页面 | url/text | 是 | /solutions/project-platform | 用于归因 |
| consent_privacy | 隐私政策确认 | boolean | 是 | true | 必须 |
| submitted_at | 提交时间 | datetime | 是 | auto | 系统生成 |
| follow_status | 跟进状态 | select | 是 | new | new、assigned、contacted、closed |
| assigned_to | 跟进人 | text/user | 否 | 待分配 | 需业务流程确认 |

---

## 11. 首页模块字段

首页建议使用结构化模块，而不是单一富文本。

| 模块 | 字段建议 | 说明 |
|---|---|---|
| Hero | hero_title、hero_subtitle、hero_image、hero_cta_primary、hero_cta_secondary | 首屏核心内容 |
| 信任数字 | metric_label、metric_value、metric_source、verification_status | 数字必须有来源 |
| 痛点解法 | pain_title、pain_description、solution_description | 成对录入 |
| 能力地图 | capability_name、capability_level、parent_capability、related_product | 支持层级 |
| 产品平台 | featured_products | 关联 Product |
| 解决方案 | featured_solutions、segment_type | 关联 Solution |
| 技术优势 | advantage_title、proof_asset、proof_text | 能力和证据配对 |
| 精选案例 | featured_cases | 关联 Case |
| CTA | cta_title、cta_description、cta_button_label、cta_button_url | 收口转化 |

---

## 12. 关联关系

推荐关系：

```text
Product 关联 Solution
Product 关联 Case
Solution 关联 Product
Solution 关联 Case
Case 关联 Product
Case 关联 Solution
Resource 关联 Product
Resource 关联 Solution
Honor 关联 Page 或 Site Settings
Asset 被 Page、Product、Solution、Case、Resource、Honor 引用
```

作用：
- 产品页可展示相关方案和案例。
- 方案页可推荐产品组合。
- 案例页可反向证明产品和方案。
- 资源中心可形成 SEO 内链。

---

## 13. 上线前字段复核

必须复核：
- 首页 4 个核心数字的最终口径和来源。
- “80% 大型国央企 / 政府监管客户”的统计口径。
- 客户案例名称、Logo、项目图片和平台截图授权。
- 资质证书名称、机构、有效期和公开展示范围。
- 电话、邮箱、地址、二维码和表单接收人。
- 资料下载是否需要留资。
- 隐私政策、备案信息和表单合规文案。

不建议上线：
- 没有来源的精确数字。
- 未授权客户 Logo。
- 无法核验的证书图片。
- 宣传册 OCR 识别错误内容。
- 没有 alt 的关键图片。
- 只存在于设计稿、未进入 CMS 的硬编码正文。
