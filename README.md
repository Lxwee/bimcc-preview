# BIMCC 筑云科技官网升级项目

版本：2026-09  
定位：筑云科技一体化数字建设解决方案官方网站，涵盖首页 8 大核心模块、产品矩阵、解决方案、标杆案例库、技术底座与资质背书。  
视觉方向：深空暗曜石体系（Obsidian Dark）配合精密磨砂玻璃双层流光质感，支持高分屏全画幅 3D 工程与建筑效果图展示。

## 目录结构

```text
index.html                     # 官网首页（8大核心模块、分段切换器、案例库、双层发光CTA）
products.html                  # 产品平台总览页
product-detail.html            # 产品详情页
solutions.html                 # 解决方案总览页
solution-detail.html           # 解决方案详情页
cases.html                     # 客户案例全量库
case-detail.html               # 案例详情页
technology.html                # 技术与研发
resources.html                 # 资源中心
about.html                     # 关于筑云与企业资质
contact.html                   # 咨询与预约演示
styles.css                     # 全局深色设计系统样式表
script.js                      # 交互脚本（导航、Tab分段切换、表单校验、动画）
assets/                        # 高清视觉资源（品牌Logo、3D建筑效果图、产品架构图、资质证书）
data/                          # 结构化数据（cases.json, products.json, solutions.json 等）
```

## 本地预览

在项目根目录下启动本地 HTTP 服务：

```bash
python3 server.py
# 或
python3 -m http.server 8089
```

访问：
```text
http://localhost:8089/
```

## 核心特性

- **视觉系统**：深邃暗曜石背景（`#030712` ~ `#071022`）结合双层磨砂玻璃质感与微光微动效。
- **纯净 3D 案例库**：8 大标杆案例卡片全量采用纯画幅、高分辨率 3D 建筑与工程渲染图，杜绝任何文字杂质与白边。
- **分段控制器**：按客户角色分类 / 按行业场景分类的双层磨砂分段控制器，交互平滑，状态明确。
- **多端响应式**：桌面端（1920px/1440px）、平板端（768px）与移动端全适配。
- **全链路闭环**：包含在线预约咨询表单与多端交互支持。
��卡片、案例列表和联系卡片在手机端使用横向卡带。
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
>>>>>>> 09d8d67 (feat: 筑云科技官网全新升级中保真原型与全量素材)
