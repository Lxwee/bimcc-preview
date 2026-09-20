# BIMCC 官网第一批上线页面路由与开发任务拆分

版本：2026-09-01  
用途：将第一批上线页面拆解为路由、页面组件、CMS 数据依赖、SEO 字段、开发任务和验收重点，便于前端、后端、CMS 和内容团队协同。  
承接文件：
- `BIMCC官网SEO与上线验收清单.md`
- `BIMCC官网CMS字段模型与内容数据字典.md`
- `BIMCC官网首批CMS样例数据.md`
- `BIMCC官网设计组件规范与页面模块库.md`
- `BIMCC官网首页页面级Wireframe说明.md`

资料边界：本文档是开发拆分建议，不限定具体技术栈。若已有官网技术架构，应优先沿用现有栈、部署方式、CMS 和统计工具。

---

## 1. 第一批上线范围

第一批目标是尽快形成“首页可转化、产品能解释、方案能分流、案例能证明、联系能承接”的闭环。

| 页面 | 路由建议 | 优先级 | 上线目的 |
|---|---|---|---|
| 首页 | `/` | P0 | 建立定位、信任、产品和方案入口 |
| 产品平台总览 | `/products` | P0 | 汇总飞椽、BIMCC、智慧工地、数字孪生、BIM 咨询 |
| 飞椽 Fyra 智能开发平台 | `/products/fyra` | P0 | 展示 AI+零代码技术底座 |
| BIMCC 智能建造平台 | `/products/bimcc-platform` | P0 | 展示项目级和企业级智能建造平台 |
| 解决方案总览 | `/solutions` | P0 | 按角色、层级和行业分流 |
| 企业级数字化运营与转型方案 | `/solutions/enterprise-digital-operation` | P0 | 承接企业和集团客户 |
| 项目级智能建造平台解决方案 | `/solutions/project-smart-construction` | P0 | 承接单项目和项目群数字建管需求 |
| 客户案例列表 | `/cases` | P0 | 展示项目经验和行业覆盖 |
| 客户案例详情模板 | `/cases/{case-slug}` | P0 | 支持后续批量录入案例 |
| 联系我们 | `/contact` | P0 | 承接预约咨询、电话、二维码和表单 |

---

## 2. 路由结构建议

```text
/
/products
/products/fyra
/products/bimcc-platform
/solutions
/solutions/enterprise-digital-operation
/solutions/project-smart-construction
/cases
/cases/{case-slug}
/contact
```

后续扩展路由：

```text
/products/smart-site
/products/digital-twin-operation
/products/bim-consulting
/solutions/owner-digital-management
/solutions/contractor-smart-construction
/solutions/consulting-supervision-collaboration
/solutions/government-group-supervision
/research
/resources
/about
/honors
```

路由规则：
- 已有旧官网重要 URL 需要映射 301。
- 未授权案例不得使用真实客户名作为 slug。
- slug 使用英文小写和短横线。
- 页面路径一旦上线，后续不要频繁改动。

---

## 3. 公共组件任务

| 组件 | 开发任务 | 数据来源 | 验收重点 |
|---|---|---|---|
| `SiteHeader` | 顶部导航、当前页状态、移动菜单 | Navigation、Site Settings | 包含“首页”，桌面端不换行 |
| `MegaMenu` | 产品、方案、案例下拉菜单 | Navigation、Product、Solution、Case 分类 | 键盘可访问，移动端可展开 |
| `SiteFooter` | 页脚导航、联系方式、备案、二维码 | Site Settings、Navigation | 联系方式待复核，不能误上线 |
| `Button` | 主按钮、次按钮、文字链接 | 组件配置 | hover、active、focus、disabled 完整 |
| `AssetImage` | 图片渲染、alt、宽高、裁切焦点 | Asset | 预留尺寸，避免 CLS |
| `SeoMeta` | title、description、canonical、OG | Page、Product、Solution、Case | 每页唯一 |
| `ContactLeadForm` | 咨询表单、校验、提交状态 | Lead | 隐私政策勾选、错误和成功状态 |
| `ConversionCTA` | 全站咨询收口模块 | Site Settings、Page | CTA 文案统一 |
| `Breadcrumb` | 详情页路径导航 | 路由配置 | 层级清晰，不影响移动端 |

---

## 4. 首页开发任务

路由：`/`

组件拆分：

```text
SiteHeader
HeroPlatform
ProofMetrics
PainSolutionGrid
CapabilityMap
ProductPlatformSection
SolutionSegmentTabs
TechnicalAdvantageMatrix
FeaturedCases
ConversionCTA
SiteFooter
```

CMS 依赖：
- Page: home。
- Metric: 4 个核心数字。
- Product: 首页推荐产品。
- Solution: 首页推荐方案。
- Case: 首页精选案例。
- Asset: hero 主视觉、产品截图、案例封面、证书图、二维码。
- Site Settings: CTA、联系方式、导航。

验收重点：
- 首页主模块保持 8 个。
- Header 包含“首页”。
- Hero 不出现“2014 年成立”作为核心指标。
- 首屏 CTA 在桌面和移动端可见。
- 首页信任数字为 80%、1000+、80+、100+ 四类，且有待复核状态。
- 所有图片有 alt。
- 未授权案例不显示真实客户 Logo。

---

## 5. 产品页面开发任务

### 5.1 产品平台总览

路由：`/products`

组件：
- `ProductHero`
- `ProductMatrix`
- `ProductPlatformCard`
- `RelatedSolutions`
- `FeaturedCases`
- `ConversionCTA`

CMS 依赖：
- Product 列表。
- Solution 关联。
- Case 关联。
- Asset 产品截图。

验收重点：
- 飞椽 Fyra 和 BIMCC 智能建造平台优先展示。
- 产品分类清晰，不把咨询服务和平台产品混成同一层级。
- 每个产品入口能跳转到详情页。

### 5.2 飞椽 Fyra 智能开发平台

路由：`/products/fyra`

组件：
- `ProductDetailHero`
- `PainPointSection`
- `CapabilityGrid`
- `ArchitectureSection`
- `ScenarioCards`
- `RelatedCases`
- `RelatedSolutions`
- `ConversionCTA`

CMS 依赖：
- Product: fyra。
- Asset: 飞椽编辑器截图、架构图。
- Solution: 企业级、项目级、监管级方案。
- Case: 使用飞椽或定制化平台的案例。

验收重点：
- 明确“工程行业 AI+零代码应用开发底座”。
- 展示表单、流程、报表、大屏、APP/H5、物联网中台和 AI 能力。
- 不使用无法说明真实功能的假截图。

### 5.3 BIMCC 智能建造平台

路由：`/products/bimcc-platform`

组件：
- `ProductDetailHero`
- `LifecycleMap`
- `ModuleGrid`
- `BimGisVisual`
- `SmartSiteIntegration`
- `RelatedCases`
- `ConversionCTA`

CMS 依赖：
- Product: bimcc-platform。
- Asset: 平台驾驶舱、BIM+GIS 一张图、智慧工地接入截图。
- Solution: 建设单位、施工单位、项目级、企业级方案。
- Case: BIMCC 平台应用案例。

验收重点：
- 说明项目全生命周期数字建造管理平台。
- 覆盖进度、质量、安全、成本、物资设备、协同办公、数字档案和 BIMGIS。
- 平台截图必须脱敏。

---

## 6. 解决方案页面开发任务

### 6.1 解决方案总览

路由：`/solutions`

组件：
- `SolutionHero`
- `SolutionSegmentTabs`
- `RoleSolutionGrid`
- `IndustryScenarioGrid`
- `RelatedProducts`
- `FeaturedCases`
- `ConversionCTA`

CMS 依赖：
- Solution 列表。
- Product 推荐组合。
- Case 关联案例。

验收重点：
- 支持按客户角色、建设层级、行业场景分流。
- 默认展示“按客户角色”。
- 每个入口包含适用对象、核心问题、推荐产品和案例入口。

### 6.2 企业级数字化运营与转型方案

路由：`/solutions/enterprise-digital-operation`

组件：
- `SolutionDetailHero`
- `ProblemSection`
- `SolutionPath`
- `ProductCombo`
- `DeliverableGrid`
- `RelatedCases`
- `ConversionCTA`

CMS 依赖：
- Solution: enterprise-digital-operation。
- Product: 飞椽 Fyra、BIMCC 智能建造平台。
- Asset: 企业驾驶舱、数据中台或多项目监管图。

验收重点：
- 面向集团和工程企业，不写成单项目方案。
- 重点表达项企联动、多项目监管、应用模板和数据资产。

### 6.3 项目级智能建造平台解决方案

路由：`/solutions/project-smart-construction`

组件：
- `SolutionDetailHero`
- `ProjectPainGrid`
- `LifecycleProcess`
- `SmartSiteIntegration`
- `ProductCombo`
- `RelatedCases`
- `ConversionCTA`

CMS 依赖：
- Solution: project-smart-construction。
- Product: BIMCC 智能建造平台、智慧工地建设服务。
- Case: 项目级智能建造案例。

验收重点：
- 面向具体项目和项目群。
- 突出进度、质量、安全、资料、模型、设备和现场闭环。
- 成果描述不得虚构精确量化收益。

---

## 7. 客户案例页面开发任务

### 7.1 案例列表

路由：`/cases`

组件：
- `CaseListHero`
- `CaseFilters`
- `CaseGrid`
- `CaseFeatureCard`
- `Pagination`
- `ConversionCTA`

筛选维度：
- 行业。
- 客户类型。
- 产品服务。
- 项目层级。

CMS 依赖：
- Case 列表。
- Product 服务关联。
- Solution 方案关联。
- Asset 案例封面。

验收重点：
- 未授权案例显示 `public_title`。
- 不展示未授权客户 Logo。
- 筛选后空状态可用。
- 分页或加载更多可用。

### 7.2 案例详情模板

路由：`/cases/{case-slug}`

组件：
- `CaseDetailHero`
- `CaseMeta`
- `ChallengeSection`
- `SolutionSection`
- `OutcomeSection`
- `CaseGallery`
- `RelatedProducts`
- `RelatedSolutions`
- `SimilarCases`
- `ConversionCTA`

CMS 依赖：
- Case 单条内容。
- Asset 图集。
- Product 和 Solution 关联。

验收重点：
- 授权状态控制前台展示。
- `case_title` 和 `public_title` 不混用。
- 未确认成果不写精确数字。
- 图片 alt 使用公开口径。

---

## 8. 联系页面开发任务

路由：`/contact`

组件：
- `ContactHero`
- `ContactLeadForm`
- `ContactInfoCards`
- `OfficeLocations`
- `QrCodeBlock`
- `FaqMini`
- `SiteFooter`

CMS 依赖：
- Site Settings: 电话、手机、邮箱、地址、二维码。
- Lead: 表单字段。
- Page: contact SEO。

表单字段：

```text
姓名
手机
公司名称
职位或角色
需求类型
感兴趣产品
项目或企业所在地
需求描述
隐私政策确认
```

验收重点：
- 电话、手机、邮箱、地址、二维码必须复核。
- 隐私政策未勾选时不能提交。
- 表单提交成功、提交失败、提交中状态完整。
- 能记录 `source_page` 和 `demand_type`。
- 测试数据上线前清理。

---

## 9. 数据接口与 CMS 查询建议

建议最小查询：

| 页面 | 必需数据 |
|---|---|
| 首页 | Page home、Metric、Featured Product、Featured Solution、Featured Case、Site Settings |
| 产品总览 | Product list、Product categories、Related Solution |
| 产品详情 | Product by slug、Related Solution、Related Case、Asset |
| 解决方案总览 | Solution list、Solution segments、Related Product、Featured Case |
| 解决方案详情 | Solution by slug、Recommended Product、Typical Case、Asset |
| 案例列表 | Case list、filters、pagination |
| 案例详情 | Case by slug、Related Product、Related Solution、Similar Cases |
| 联系我们 | Site Settings、Lead form config |

缓存建议：
- 导航、页脚、Site Settings 可长缓存。
- 首页、产品和方案内容可中等缓存。
- 表单接口不缓存。
- 案例筛选结果可按参数缓存。

---

## 10. SEO 开发任务

每个页面必须输出：
- `title`
- `meta description`
- `canonical`
- `og:title`
- `og:description`
- `og:image`
- 图片 `alt`
- 语义化 H1-H3

额外任务：
- 生成 `sitemap.xml`。
- 配置 `robots.txt`。
- 配置 404 页面。
- 配置旧 URL 301 重定向。
- 接入访问统计和转化事件，具体工具待确认。

转化事件建议：

| 事件 | 触发位置 |
|---|---|
| `cta_click_header_consult` | Header 预约咨询 |
| `cta_click_hero_consult` | 首页 Hero 主 CTA |
| `cta_click_case_view` | 查看客户案例 |
| `form_submit_contact` | 联系页表单提交 |
| `phone_click_footer` | Footer 电话点击 |
| `download_resource` | 资料下载 |

---

## 11. 开发排期建议

### 开发包 A：基础框架

内容：
- 路由结构。
- Header、Footer、SEO 基础组件。
- Site Settings 和 Navigation 数据接入。
- 图片组件和通用按钮。

验收：
- 全站导航可访问。
- Header 包含“首页”。
- Footer 联系信息有待复核状态时不误发布。

### 开发包 B：首页

内容：
- 首页 8 个主模块。
- 首页 CMS 数据绑定。
- 首页桌面端和移动端响应式。
- CTA 与案例跳转。

验收：
- 首屏定位、主视觉、CTA、核心数字完整。
- 移动端无横向溢出。
- “2014 年成立”不在 Hero 指标中。

### 开发包 C：产品与方案

内容：
- 产品总览、飞椽、BIMCC。
- 解决方案总览、企业级方案、项目级方案。
- 产品与方案之间的关联跳转。

验收：
- 产品和方案页面可以互链。
- 图片占位、真实截图和 alt 字段可替换。

### 开发包 D：案例与联系

内容：
- 案例列表、筛选、详情模板。
- 联系页和表单。
- 线索记录与来源归因。

验收：
- 未授权案例不暴露真实客户资料。
- 表单全状态可用。

### 开发包 E：上线验收

内容：
- SEO、性能、可访问性。
- 链接检查。
- 重定向。
- 表单和统计事件。

验收：
- 第一批页面全部可访问。
- `sitemap.xml`、`robots.txt`、canonical 正常。
- 表单和 CTA 转化链路可用。

---

## 12. 风险与待确认

| 风险 | 影响 | 处理方式 |
|---|---|---|
| 视觉参考未提供 | 高保真稿方向可能反复 | 进入高保真首页视觉稿前提醒用户提供 |
| 平台截图不足 | 首屏可信度下降 | 先用明确占位，尽快采集脱敏截图 |
| 客户案例授权不明 | 案例页无法公开真实名称和 Logo | 使用 `public_title`，授权后再替换 |
| 联系方式未复核 | 线索丢失或信息错误 | 上线前由市场或销售确认 |
| 旧 URL 未映射 | SEO 权重和旧链接访问受损 | 开发前建立旧 URL 清单 |
| 表单合规未确认 | 上线风险 | 补隐私政策和 consent 字段 |
| CMS 字段过度自由 | 页面样式难以统一 | 使用结构化 blocks 和枚举字段 |

---

## 13. 开发验收清单

- 第一批 10 类页面路由可访问。
- Header 包含“首页”，导航桌面端不换行。
- 首页 8 个主模块渲染顺序正确。
- 首页信任数字不出现“2014 年成立”。
- 所有 P0 页面有 H1、SEO title、SEO description、canonical。
- 产品、方案、案例之间的关联跳转可用。
- 未授权案例使用公开标题。
- 图片有 alt，首屏图预留宽高。
- 联系表单有成功、失败、提交中、校验错误状态。
- 移动端无横向溢出、按钮换行和文字遮挡。
- 旧 URL 重定向清单已处理。
- 测试数据、占位文案和待复核内容不会误发布。
