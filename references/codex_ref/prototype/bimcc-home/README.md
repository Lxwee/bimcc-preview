# BIMCC 官网本地 HTML 原型

版本：2026-09-03  
定位：中保真可评审静态原型，用于验证首页、二级页结构、文案节奏、导航、CTA、移动端浏览和 CMS 迁移拆分。
视觉方向：沿用 Webv8 暗黑流体玻璃方案，并吸收 Raycast 的强首屏焦点、Reflect 的安静素材动效、AuthKit 的细腻按钮和背景微动效、Scale with Teddy 的受控色彩层次。

## 文件

```text
index.html
products.html
solutions.html
cases.html
technology.html
resources.html
about.html
contact.html
styles.css
script.js
assets/brand/favicon.svg
assets/v8/
assets/clients/
data/site.json
data/home.json
data/products.json
data/solutions.json
data/cases.json
data/page-products.json
data/page-solutions.json
data/page-cases.json
data/page-technology.json
data/page-resources.json
data/page-about.json
data/page-contact.json
data/cms-modules.json
data/seo-map.json
tests/prototype-contract.test.mjs
CMS_HANDOFF.md
```

## 预览

可以直接打开：

```text
/Users/bimcc/Desktop/CodeX 记录文件/prototype/bimcc-home/index.html
```

也可以在目录中启动本地服务：

```bash
python3 -m http.server 5173
```

然后访问：

```text
http://localhost:5173
```

## 当前包含

- 顶部导航：首页、产品平台、解决方案、客户案例、技术研发、关于我们。
- 主 CTA：预约咨询。
- 首页 8 个主模块。
- 产品平台、解决方案、客户案例、技术研发、关于我们、联系我们、资源中心兼容页。
- 二级页使用 `data-page-module` 与 `data-content-source` 标记，便于正式开发拆 CMS 字段。
- 每个首页模块带 `data-cms-module` 标记，便于后续拆成 CMS 区块。
- `data/cms-modules.json` 提供首页模块、锚点、字段、素材来源和上线注意事项。
- `data/page-*.json` 提供二级页内容模型、案例口径、技术能力、资源栏目、关于页信任证据、联系卡片和方案路径。
- Hero 核心数字：80%、1000+、80+、100+。
- V8 主视觉素材和官网首页合作伙伴 Logo 展示墙。
- 飞椽 Fyra 平台展示块，使用现有 V8 素材说明技术底座与低代码交付能力。
- 官网公开案例图片引用，案例表达可参照官网及宣传册。
- 案例卡片包含项目类型、资料来源和能力关键词。
- 官网公开联系方式和服务网络。
- 联系区公众号 / 二维码素材位，正式页面复用现官网联系我们素材。
- 联系表单包含本地演示、接口预留、上线后接收三类状态提示。
- SEO 基础 meta、Open Graph、Organization 结构化数据和 URL 迁移草案。
- 解决方案 Tab 切换。
- 案例前端筛选，手机端使用横向胶囊条降低滚动成本。
- 产品和案例卡片在手机端使用横向证据卡带，保留完整内容但减少长卷轴。
- 二级页产品矩阵、解决方案角色入口、技术能力、资源栏目、关于页信任卡片、案例列表和联系卡片在手机端使用横向卡带。
- 移动端菜单。
- 本地表单占位反馈和正式接口口子预留。
- pending、待复核、待授权标识。
- 深空产品感首屏：背景光场、BIM / GIS / IoT / AI / Twin 关系节点、按钮流光和 reduced motion 降级。
- 二级页继承深空产品视觉系统，并在 hero 区增加轻量信号图谱，避免首页和内页质感断层。

## 截图输出

浏览器检查会生成：

```text
/Users/bimcc/Desktop/CodeX 记录文件/.impeccable/review/bimcc-home-desktop.png
/Users/bimcc/Desktop/CodeX 记录文件/.impeccable/review/bimcc-home-mobile.png
```

## 当前不包含

- 可公开且已脱敏的真实平台截图。
- 真实表单提交后端或 CMS 接收方式。
- CMS 接入。
- 正式生产路由与完整 301 跳转清单。

## 视觉参考节点

`STYLE_DIRECTION.md` 记录本轮视觉提炼和 Motion thesis。当前已采用 Webv8 暗黑流体玻璃方向。客户 Logo、案例成果相关数据和产品截图可参照官网及宣传册；微信咨询和公众号二维码复用现官网联系我们页面。进入正式开发前，建议确认 CMS 权限、表单接收方式和 SEO URL 迁移规则。

## 正式上线提示

- 设计和本地 HTML 原型不需要 CMS 授权。
- 替换线上官网需要后台账号、主题或页面编辑权限、媒体库上传权限。
- 如果要接入真实表单，需要 CMS 表单插件、邮件通知、webhook、自定义接口或服务商配合。
- SEO URL 指当前官网已经存在的栏目和详情页地址。新版可以重做内容，但核心旧链接建议保留或做 301 跳转。
- `CMS_HANDOFF.md` 记录正式上线所需授权、模块字段映射、表单接入和 SEO 迁移清单。
- `data/cms-modules.json` 可作为 WordPress/CMS 模块拆分和字段建模的初始清单。

## 校验

运行：

```bash
node tests/prototype-contract.test.mjs
```

该测试检查首页模块数量、二级页文件、CMS / 页面模块标记、导航、Hero 指标、占位标识、响应式钩子和交互脚本入口。

如需做真实浏览器截图检查，在项目根目录运行：

```bash
node prototype/bimcc-home/tests/visual-check.mjs
```

该检查需要本机浏览器权限，用于验证桌面端导航高度、横向溢出、Hero 标题行数、Hero CTA 可见性和移动端基础布局。
