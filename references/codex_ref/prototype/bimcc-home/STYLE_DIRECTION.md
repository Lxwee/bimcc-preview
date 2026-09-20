# BIMCC Style Direction

## Design Read

工程数字化 B2B 官网升级，面向建设单位、施工企业、监管单位和项目决策者。视觉走克制深空产品感：清晰、有力量、安静但有记忆点。

## Reference Extraction

- Raycast: 首屏需要一个聚焦的视觉焦点，让访客快速记住“平台中枢”而不是只看见背景氛围。
- Reflect: 用柔和的连接关系、分层玻璃和低速素材运动表达数据、模型、现场和业务之间的关联。
- AuthKit: 按钮、边框、焦点态和背景光流要细腻克制，像产品界面本身在呼吸，而不是营销动画。
- Scale with Teddy: 可以使用更丰富的局部色彩，但必须服务于重点信息，不能让整页变成彩色噪声。

## Motion thesis

首屏是唯一强记忆点：平台截图、BIM / GIS / IoT / AI / Twin 关系节点和背景光场组成一个深空产品中枢。其他动效只用于反馈、进入节奏和材质呼吸，保持自然、安静、可关闭。

## Secondary Page System

二级页不重新发明视觉语言。每个页面继承首页的深空产品材质，并在 hero 区域增加轻量信号图谱：

- 产品平台：Fyra、BIMCC、Site、Twin，说明从底座到现场和运维。
- 解决方案：Role、Scene、Proof、Path，说明角色、场景、证据和咨询路径。
- 客户案例：Project、Client、Proof、Delivery，说明项目证据和交付可信度。
- 技术研发：BIM、GIS、IoT、AI，说明自研平台的能力组合。
- 资源中心：SEO、CMS、Case、Guide，说明内容资产和迁移承接。
- 关于筑云：Trust、Patent、Award、Service，说明企业可信证据。
- 联系我们：Phone、WeChat、Form、QR，说明真实转化路径。

## Practical Rules

- 页面主题保持深色，不做浅色分段跳变。
- 主色仍是 cyan / indigo，少量 emerald 和 warm signal 只用于节点和证据层。
- Hero 保持 2 行内标题、1 个主 CTA、1 个辅助 CTA。
- Logo 墙仍放在首屏下方，不塞进 hero 文案区。
- 动效只使用 transform、translate、opacity、filter、background-position，并提供 `prefers-reduced-motion` 降级。
- 不引入新事实、新客户、新截图或未经确认的指标。
