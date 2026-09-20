# BIMCC 官网本地原型文件结构建议

版本：2026-09-01  
用途：规划后续本地 HTML 原型的目录、文件、命名和代码边界，便于快速预览和持续修改。  

---

## 1. 推荐目录

建议在当前工作目录下新增：

```text
prototype/
  bimcc-home/
    index.html
    styles.css
    script.js
    README.md
    assets/
      brand/
      screenshots/
      cases/
      honors/
      icons/
      placeholder/
    data/
      site.json
      home.json
      products.json
      solutions.json
      cases.json
```

说明：

- `index.html` 放首页原型。
- `styles.css` 放页面样式和设计 token。
- `script.js` 放移动菜单、Tab、折叠、轻量交互。
- `README.md` 说明预览方式和待替换素材。
- `assets/` 放真实素材和占位素材。
- `data/` 放可模拟 CMS 的静态 JSON，后续迁移正式项目更顺。

---

## 2. 原型文件职责

| 文件 | 职责 | 注意事项 |
|---|---|---|
| `index.html` | 页面结构、真实文案、模块顺序 | 不写大量内联样式 |
| `styles.css` | 颜色、字体、布局、组件、响应式 | 保持 token 化，便于换视觉方向 |
| `script.js` | 导航、移动菜单、Tab、筛选、表单占位 | 不接真实接口 |
| `README.md` | 如何预览、如何替换素材、当前限制 | 每轮修改后同步 |
| `data/*.json` | 模拟 CMS 内容 | 所有待复核字段保留状态 |

---

## 3. 页面结构建议

首页目录先采用单页结构：

```text
prototype/bimcc-home/index.html
```

当需要扩展二级页时，再改为多页面：

```text
prototype/bimcc-site/
  index.html
  products/
    index.html
    fyra.html
    bimcc-platform.html
  solutions/
    index.html
    enterprise.html
    project.html
  cases/
    index.html
    detail.html
  contact/
    index.html
```

不建议一开始就拆太多页面。先把首页体验跑通，再逐步扩展。

---

## 4. 资产目录规范

```text
assets/
  brand/
    logo-standard.svg
    logo-dark.svg
    logo-light.svg
  screenshots/
    hero-platform-dashboard-2400x1350.jpg
    fyra-devstudio-editor-1920x1200.jpg
    bimcc-project-map-1920x1080.jpg
    digital-twin-operation-1920x1080.jpg
  cases/
    case-hainan-jiaotou-cover-1600x1200.jpg
    case-rail-transit-cover-1600x1200.jpg
  honors/
    honor-cmmi-certificate-1200x1600.jpg
  icons/
    icon-platform.svg
    icon-solution.svg
  placeholder/
    placeholder-dashboard.svg
    placeholder-case-cover.svg
```

真实素材未提供时，可以先放占位文件，但文件名必须说明用途。

---

## 5. 数据文件建议

### `site.json`

```json
{
  "brandName": "筑云科技 BIMCC",
  "primaryNav": [
    "首页",
    "产品平台",
    "解决方案",
    "客户案例",
    "技术与研发",
    "资源中心",
    "关于筑云",
    "联系我们"
  ],
  "primaryCta": "预约咨询",
  "verificationStatus": "pending"
}
```

### `home.json`

```json
{
  "heroMetrics": [
    {
      "value": "80%",
      "label": "大型国央企 / 政府监管客户",
      "source": "宣传册",
      "status": "pending"
    },
    {
      "value": "1000+",
      "label": "重点建设项目",
      "source": "宣传册",
      "status": "pending"
    },
    {
      "value": "80+",
      "label": "专利软著",
      "source": "宣传册",
      "status": "pending"
    },
    {
      "value": "100+",
      "label": "国家级、省部级奖项",
      "source": "宣传册",
      "status": "pending"
    }
  ]
}
```

注意：

- `2014 年成立` 不进入 `heroMetrics`。
- 可以在关于页或发展历程数据中记录 `2014 年成立`。

---

## 6. CSS 组织建议

`styles.css` 建议分层：

```text
1. Reset 与基础设置
2. 设计 token
3. Layout 工具类
4. Header / Footer
5. 首页 8 个模块
6. 组件样式
7. 交互状态
8. 响应式
9. 打印或降级规则
```

设计 token 示例：

```css
:root {
  --color-bg: #f6f8fb;
  --color-surface: #ffffff;
  --color-text: #172033;
  --color-muted: #657184;
  --color-accent: #1463ff;
  --radius-card: 16px;
  --radius-button: 999px;
  --max-width: 1200px;
}
```

说明：

- 色值只是原型建议，进入高保真前需根据视觉参考确认。
- 如果公司已有 VI 色值，应优先使用公司 VI。
- 避免整站只使用单一深蓝。

---

## 7. HTML 命名建议

建议使用语义化类名：

```text
site-header
hero
hero-proof
pain-solution
capability-map
product-platforms
solution-entry
delivery-advantages
featured-cases
trust-cta
site-footer
```

组件类名建议：

```text
metric-card
product-card
solution-card
case-card
proof-strip
section-heading
cta-row
mobile-menu
```

避免使用：

```text
box1
blue-card
new-section
content-left
content-right
```

---

## 8. JS 交互边界

低保真阶段只需要轻量 JS：

- 移动端导航展开 / 收起。
- 产品卡片或方案 Tab 切换。
- 案例筛选的前端模拟。
- 表单提交占位提示。
- 返回顶部或锚点平滑滚动。

不建议加入：

- 复杂滚动劫持。
- 大量视差动画。
- 真实接口请求。
- 登录状态。
- CMS 写入。
- 依赖大量第三方库的交互。

---

## 9. 响应式断点建议

建议按以下断点检查：

| 断点 | 宽度 | 重点 |
|---|---:|---|
| Mobile | 390px | Hero、导航、卡片堆叠、CTA |
| Tablet | 768px | 两列布局、案例卡片、方案入口 |
| Laptop | 1280px | 导航一行显示、首屏节奏 |
| Desktop | 1440px | 首页视觉完整度和留白 |

移动端原则：

- 首页模块仍保持 8 个。
- 首屏不堆太多数字。
- 导航改为按钮菜单。
- 案例和产品卡片单列优先。
- CTA 保持可点击，不被图片挤到很深的位置。

---

## 10. 文件命名规则

建议使用小写英文、连字符和尺寸：

```text
hero-platform-dashboard-2400x1350.jpg
fyra-devstudio-editor-1920x1200.jpg
case-rail-transit-cover-1600x1200.jpg
honor-cmmi-certificate-1200x1600.jpg
contact-qrcode-wechat-800x800.png
```

不建议：

```text
图片1.jpg
最终版2.png
微信截图2026.jpg
客户logo新新新.svg
```

---

## 11. 版本迭代建议

原型目录内可保留一个修改记录：

```text
prototype/bimcc-home/README.md
```

记录内容：

```text
版本：
修改日期：
本轮修改：
待确认：
下一轮重点：
```

不建议复制多个完整目录：

```text
bimcc-home-v1
bimcc-home-v2
bimcc-home-final
bimcc-home-final-final
```

更建议用文档记录版本差异，必要时再使用 Git 管理。

---

## 12. 进入正式开发前需要补充

正式生产开发前至少确认：

- 现有官网是否保留 URL。
- 是否有后台 CMS。
- 是否要迁移新闻、案例、资源内容。
- 是否有备案、隐私政策、Cookie 或合规要求。
- 表单提交到哪里。
- 下载资料是否需要留资。
- SEO 标题和描述是否最终确认。
- 图片和客户 Logo 是否授权。
- 统计数字是否复核。

本地 HTML 原型只解决“页面长什么样、信息如何组织、交互是否顺畅”。生产开发还需要技术栈和部署方案确认。
