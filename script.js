const mobileMenu = document.querySelector("#mobileMenuDrawer, #mobileMenu");
const menuButton = document.querySelector("#mobileMenuToggle, .menu-button");

function closeMobileMenu() {
  if (!mobileMenu || !menuButton) return;
  menuButton.setAttribute("aria-expanded", "false");
  mobileMenu.hidden = true;
  document.body.classList.remove("menu-open");
}

if (mobileMenu && menuButton) {
  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    mobileMenu.hidden = isOpen;
    document.body.classList.toggle("menu-open", !isOpen);
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      closeMobileMenu();
    });
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMobileMenu();
});

const solutionTabs = document.querySelectorAll("[data-solution-tab]");
const solutionPanels = document.querySelectorAll("[data-solution-panel]");

// 支持大分类方案 Tab 切换（按客户角色 vs 按行业场景）
document.querySelectorAll(".solution-macro-btn").forEach((macroBtn) => {
  macroBtn.addEventListener("click", () => {
    document.querySelectorAll(".solution-macro-btn").forEach((b) => {
      b.classList.remove("active");
      b.setAttribute("aria-selected", "false");
    });
    macroBtn.classList.add("active");
    macroBtn.setAttribute("aria-selected", "true");

    const targetMode = macroBtn.getAttribute("data-macro-target");
    if (targetMode === "roles") {
      document.getElementById("solutionRolesSection").style.display = "block";
      document.getElementById("solutionIndustrySection").style.display = "none";
    } else {
      document.getElementById("solutionRolesSection").style.display = "none";
      document.getElementById("solutionIndustrySection").style.display = "block";
    }
  });
});

// 支持 .sol-tab-btn 角色分段控制器切换
document.querySelectorAll(".sol-tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".sol-tab-btn").forEach((b) => {
      b.classList.remove("active");
      b.setAttribute("aria-selected", "false");
    });
    btn.classList.add("active");
    btn.setAttribute("aria-selected", "true");

    const targetId = btn.getAttribute("data-target");
    document.querySelectorAll(".solution-panel-card").forEach((p) => {
      if (p.id === targetId) {
        p.style.display = "block";
        p.classList.add("active");
      } else {
        p.style.display = "none";
        p.classList.remove("active");
      }
    });
  });
});


function activateSolutionTab(tab) {
  const target = tab.dataset.solutionTab;

  solutionTabs.forEach((item) => {
    const isActive = item === tab;
    item.classList.toggle("is-active", isActive);
    item.setAttribute("aria-selected", String(isActive));
    item.tabIndex = isActive ? 0 : -1;
  });

  solutionPanels.forEach((panel) => {
    const isActive = panel.dataset.solutionPanel === target;
    panel.classList.toggle("is-active", isActive);
    panel.hidden = !isActive;
  });
}

solutionTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    activateSolutionTab(tab);
  });

  tab.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;

    event.preventDefault();
    const tabs = [...solutionTabs];
    const currentIndex = tabs.indexOf(tab);
    const nextIndex = (() => {
      if (event.key === "Home") return 0;
      if (event.key === "End") return tabs.length - 1;
      return event.key === "ArrowRight"
        ? (currentIndex + 1) % tabs.length
        : (currentIndex - 1 + tabs.length) % tabs.length;
    })();

    activateSolutionTab(tabs[nextIndex]);
    tabs[nextIndex].focus();
  });
});

const caseFilters = document.querySelectorAll("[data-case-filter]");
const caseCards = document.querySelectorAll("[data-case-category]");
let activeCaseFilter = null;

function activateCaseFilter(filter) {
  const target = filter.dataset.caseFilter;
  activeCaseFilter = target === "all" ? null : filter;
  const nextTarget = activeCaseFilter?.dataset.caseFilter;

  caseFilters.forEach((item) => {
    const isActive = activeCaseFilter ? item === activeCaseFilter : false;
    item.classList.toggle("is-active", isActive);
    item.setAttribute("aria-pressed", String(isActive));
  });

  caseCards.forEach((card) => {
    const categories = (card.dataset.caseCategory || "").split(/\s+/).filter(Boolean);
    const shouldShow = !nextTarget || categories.includes(nextTarget);
    card.classList.toggle("is-hidden", !shouldShow);
  });
}

caseFilters.forEach((filter) => {
  filter.addEventListener("click", () => {
    activateCaseFilter(filter);
  });
});

if (caseFilters.length) {
  const defaultTarget = document.querySelector("[data-default-case-filter]")?.dataset.defaultCaseFilter;
  const defaultFilter = defaultTarget
    ? [...caseFilters].find((filter) => filter.dataset.caseFilter === defaultTarget)
    : caseFilters[0];
  activateCaseFilter(defaultFilter || caseFilters[0]);
}

// 全局卡片整卡热区点击跳转委托（覆盖全站产品卡片、角色方案卡片、行业卡片、案例卡片、解决方案卡片等）
let cardPointerDownPos = null;

document.addEventListener("mousedown", (event) => {
  cardPointerDownPos = { x: event.clientX, y: event.clientY, time: Date.now() };
});

document.addEventListener("click", (event) => {
  // 如果用户点击了原生交互表单或明确的可编辑元素，不拦截
  if (event.target.closest("button, input, select, textarea, [contenteditable]")) return;

  // 检查是否位于卡片容器内
  const card = event.target.closest(
    ".panorama-card, .role-card, .case-card, .case-card-redesign, .landmark-card, .industry-card, .solution-panel-card, .clickable-card, .glass-card"
  );
  if (!card) return;

  // 针对行业卡片特别处理（若无子链接则跳转至解决方案页）
  if (card.classList.contains("industry-card") && !card.querySelector("a[href]")) {
    window.location.href = "solutions.html";
    return;
  }

  // 查找卡片内的主跳转链接
  const primaryLink =
    card.querySelector("a.panorama-link, a.role-card-action, a.case-link, a.card-action-link, a.landmark-link, a.clickable-card-link, a.btn-text, a[data-primary-link]") ||
    card.querySelector("a[href]");

  if (!primaryLink) return;

  // 若直接点击的就是该链接本身（或通过 CSS ::after 伪元素点击），遵循原生行为
  if (event.target === primaryLink || event.target.closest("a") === primaryLink) {
    return;
  }

  // 若点击了卡片内的其他特定外链，遵循该特定链接
  const otherLink = event.target.closest("a");
  if (otherLink && otherLink !== primaryLink) {
    return;
  }

  // 判断是否为真正意义上的大距离拖拽选字（只有位移 > 8px 且有选区时才视为选字不跳转）
  if (cardPointerDownPos) {
    const dx = Math.abs(event.clientX - cardPointerDownPos.x);
    const dy = Math.abs(event.clientY - cardPointerDownPos.y);
    const selection = window.getSelection();
    if ((dx > 8 || dy > 8) && selection && selection.toString().trim().length > 0) {
      return;
    }
  }

  // 执行跳转
  if (primaryLink.target === "_blank") {
    window.open(primaryLink.href, "_blank", "noopener,noreferrer");
  } else {
    // 优先采用直接设置 location 确保在所有浏览器及 iframe/容器中 100% 触发
    if (primaryLink.href) {
      window.location.href = primaryLink.href;
    } else {
      primaryLink.click();
    }
  }
});

// 详情页/案例页吸顶子导航栏 (Sticky Subnav) 滚动状态监听与激活项视口居中
const stickySubnav = document.querySelector(".detail-subnav-sticky-bar, #cases-sticky-tab");
if (stickySubnav) {
  // 查找组合选型区/底部联系/预约演示/CTA区域或页脚作为内容结束标记
  const bottomExitTarget =
    document.getElementById("product-combos-section") ||
    document.getElementById("contact") ||
    document.getElementById("cases-bottom-cta") ||
    document.querySelector(".footer-cta-section") ||
    document.getElementById("contact-form-section") ||
    document.querySelector(".site-footer");

  const handleStickySubnavScroll = () => {
    const isStuck = window.scrollY > 40;
    stickySubnav.classList.toggle("is-stuck", isStuck);

    if (bottomExitTarget) {
      const targetRect = bottomExitTarget.getBoundingClientRect();
      // 当底部联系/CTA板块进入视口（距顶部小于视口高度的 85%），说明平台产品/解决方案/案例内容已展示完毕，平滑隐藏吸顶子导航
      const isPastContent = targetRect.top < window.innerHeight * 0.85;
      stickySubnav.classList.toggle("is-hidden", isPastContent);
    }
  };
  window.addEventListener("scroll", handleStickySubnavScroll, { passive: true });
  handleStickySubnavScroll();

  // 页面初次加载时，如果有激活状态的 tab，自动在横向滚动条中轻微居中
  const activeTab = stickySubnav.querySelector(".filter-tab.is-active, .filter-tab.active");
  const tabTrack = stickySubnav.querySelector(".filter-tabs");
  if (activeTab && tabTrack) {
    setTimeout(() => {
      const activeRect = activeTab.getBoundingClientRect();
      const trackRect = tabTrack.getBoundingClientRect();
      if (activeRect.left < trackRect.left || activeRect.right > trackRect.right) {
        activeTab.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      }
    }, 200);
  }
}

document.querySelectorAll(".case-media img").forEach((image) => {
  const markMissing = () => {
    image.closest(".case-media")?.classList.add("is-image-missing");
    image.hidden = true;
  };

  image.addEventListener("error", markMissing);
  if (image.complete && image.naturalWidth === 0) markMissing();
});

const casePages = {
  "jiangbei-airport": {
    title: "重庆江北国际机场 T3A 航站楼",
    summary: "53万㎡超大型航空综合体工程，实施土建、异形钢构幕墙、机电管网及行李弱电全专业 BIM 数字化协同与施工深化。",
    scenario: "民航机场 / 综合体",
    image: "assets/thumbs/case_cq_jiangbei_airport.jpg?v=20260917",
    caption: "民航机场超大型交通枢纽案例，重点呈现异形钢构幕墙与机电综合管网深化协同。",
    signals: ["Airport", "Terminal", "BIM", "Deepen"],
    profileIntro: "该案例适合大型航站楼、交通枢纽、大型公建和复杂异形空间工程对照全专业 BIM 协同与数字化交付路径。",
    profile: [
      ["工程尺度", "53 万 ㎡ 超大型航空综合体 / 地上四层地下两层"],
      ["客户单位", "重庆机场集团有限公司"],
      ["关联产品", "BIM 咨询服务 / BIMCC 智能建造平台"],
      ["能力关键词", "异形钢构幕墙 / 全专业管网综合 / 预拼装模拟 / 数字化移交"]
    ],
    focusTitle: "航站楼超大型工程 BIM 应用重点",
    focusIntro: "围绕中央处理大厅与四指廊空间几何关系、高空网架提升、密集机电管廊与弱电系统开展深度协调。",
    focus: [
      ["异形钢结构与幕墙深化", "针对曲面空间网架、复杂指廊采光顶与双曲幕墙节点进行三维精细化建模、碰撞校核与安装模拟。"],
      ["全专业机电管网综合", "梳理航站楼密集管廊、空调机房、行李分拣及弱电路由，累计排除数千处标高与走线空间冲突。"],
      ["虚拟预拼装与施工模拟", "在数字环境中推演钢网架提升、大型构件吊装工序与行李传输带交叉作业，指导现场一次安装就位。"],
      ["竣工数字化资产交付", "将工程全生命周期高质量模型与设备台账参数完整归档，为智慧机场后期运营维护奠定数字底座。"]
    ],
    capabilities: [
      ["BIM 咨询全流程服务", "覆盖设计协调、施工深化、进度模拟与竣工模型交付。"],
      ["超大型公共建筑方案", "适合航站楼、高铁站房、会展中心与复杂商业综合体。"],
      ["工程数字技术服务", "三维激光扫描、实景建模与施工偏差比对。"],
      ["多参建方同源协同", "统一数据交换标准，打通业主、设计院、总包及各专业分包。"]
    ],
    relatedTitle: "适合对照 BIM 咨询与公共建筑方案",
    relatedIntro: "如果项目涉及复杂异形结构、多专业管网碰撞或全生命周期数字化交付，可继续查看 BIM 咨询服务与公建方案。"
  },
  "cq-jiangong": {
    title: "重庆建工集团工程质量企业智慧监管平台",
    summary: "大型特级建筑国企工程质量企业智慧监管平台，围绕工程质量监管、过程留痕、问题闭环和数据看板，帮助施工集团形成企业级质量智慧监管能力。",
    scenario: "企业级管理平台 / 集团质量监管",
    image: "assets/thumbs/case_cq_jiangong.jpg?v=20260917_02",
    caption: "大型施工集团企业级质量智慧监管案例，实现集团-区域-项目三级穿透。",
    signals: ["Group", "Quality", "Supervision", "Loop"],
    profileIntro: "该案例适合大型建筑总承包集团、工程局、投资建设平台对照企业级工程质量监管与项企联动路径。",
    profile: [
      ["平台尺度", "集团企业级质量智慧监管平台"],
      ["客户单位", "重庆建工集团股份有限公司"],
      ["关联产品", "BIMCC 智能建造平台 / 飞椽 Fyra 智能开发平台"],
      ["能力关键词", "集团穿透监管 / 实测实量数字化 / 隐患闭环 / 质量看板"]
    ],
    focusTitle: "施工集团企业级质量监管的应用重点",
    focusIntro: "围绕集团多级组织管理要求、一线检查整改闭环、质量实测数据真实性与管理决策看板展开构建。",
    focus: [
      ["集团-区域-项目三级穿透", "实现集团总部对下属数十家分子公司、数百个直属项目质量动态的一屏掌控与层级实时下钻。"],
      ["质量隐患排查与闭环管理", "现场手机端拍照上报、整改责任到人、复核验收留痕、限时闭环销号，杜绝虚假整改与过程脱节。"],
      ["实测实量数字化与自动分析", "现场实测数据即时录入防篡改，系统自动绘制正态分布曲线与合格率排名，精准识别高频质量通病。"],
      ["质量标准固化与知识复用", "将集团工艺标准、工法样板与评优标准内置入系统，实现项目群管理标准化、模板化复制。"]
    ],
    capabilities: [
      ["施工单位智能建造方案", "覆盖企业项目履约、质量安全闭环与物资协同。"],
      ["飞椽 Fyra 低代码引擎", "支撑质量验评表单、审批流程与移动端界面敏捷适配。"],
      ["数据中台与经营看板", "汇总集团多源工程数据，输出直观的项目画像与排名评价。"],
      ["移动端多角色协同", "支持项目经理、质量员、施工员、监理多端在线协同。"]
    ],
    relatedTitle: "适合对照施工单位智能建造与企业级统管方案",
    relatedIntro: "如果关注集团项目多、质量标准落地难、实测数据不真实等问题，可继续查看施工单位解决方案。"
  },
  "hainan-jiaotou": {
    title: "海南交投数智建管平台",
    summary: "面向交通投资集团的数智建管场景，围绕投资、进度、质量、安全和工程数据协同，建立投资建造一体化管理体系。",
    scenario: "交通基建 / 业主方数智建管",
    image: "assets/thumbs/case_hainan_jiaotou.jpg?v=20260917",
    caption: "交通投资集团数字化建管案例，实现投资、进度与工程现场一张图协同。",
    signals: ["Highway", "Traffic", "Invest", "Digital"],
    profileIntro: "该案例适合省市交通投资集团、城投平台、高速公路与港航工程建设业主对照全生命周期数字建管路径。",
    profile: [
      ["平台尺度", "交通投资建设集团级数智建管平台"],
      ["客户单位", "海南省交通投资控股有限公司"],
      ["关联产品", "BIMCC 智能建造平台 / BIMGIS 一张图"],
      ["能力关键词", "交通基建 / 投建管运协同 / 线性工程监管 / 电子档案"]
    ],
    focusTitle: "交通投资建管一体化的应用重点",
    focusIntro: "围绕全岛重点交通项目群分布、多标段线性工程推进、计量支付与现场质量安全协同组织平台能力。",
    focus: [
      ["全岛交通基建一张图", "结合 GIS 宏观地理信息与高精度工程 BIM 模型，全景展示高速公路、互通枢纽与沿线服务区建设态势。"],
      ["投资控制与计量支付联动", "计量支付、资金拨付审批与现场实际工程形象进度强关联，防止超计量与资金超概风险。"],
      ["线性工程质量安全协同", "实现业主、代建、监理、施工全在线协同，全天候监管桥梁、隧道、互通等控制性节点工程。"],
      ["工程档案全过程电子化", "按照交通行业电子档案标准，推动图纸、验评表单、旁站记录实时归集，实现交工即交档。"]
    ],
    capabilities: [
      ["建设单位数字建管方案", "面向业主方全过程投资受控与工程数据资产沉淀。"],
      ["BIMGIS 空间渲染底座", "支持大范围地理遥感影像与多标段高精 BIM 模型轻量化加载。"],
      ["决策指挥中心大屏", "为集团领导呈现投资完成度、工期预警与安全风险全貌。"],
      ["标准化业务扩展能力", "统一数据口径与指标字典，支撑后续公路资产运营衔接。"]
    ],
    relatedTitle: "适合对照建设单位与交通基础设施方案",
    relatedIntro: "如果关注业主投资进度联动、多标段线性工程协同与电子档案归集，可继续查看建设单位建管方案。"
  },
  "cq-rail15": {
    title: "重庆轨道交通 15 号线 BIM+智慧工地建管平台",
    summary: "城市轨道快线重点工程项目级平台，融合 BIM、智慧工地和现场物联数据，支撑长线路、多标段、多参建方协同建造。",
    scenario: "轨道交通 / 线性工程",
    image: "assets/thumbs/case_cq_rail15.jpg?v=20260917",
    caption: "轨道交通全线级管控平台，实现盾构监控、智慧工地与多标段协同。",
    signals: ["Metro", "BIM", "SmartSite", "GIS"],
    profileIntro: "该案例适合地铁、市域快线、铁路、特长隧道等线性多工点工程建设方对照项目级平台与智慧工地集成路径。",
    profile: [
      ["工程尺度", "全长超 60 公里 / 设车站 14 座 / 重庆首条城轨快线"],
      ["客户单位", "重庆机电控股集团 / 中建电子 / 轨道集团"],
      ["关联产品", "BIMCC 智能建造平台 / 智慧工地物联系统"],
      ["能力关键词", "BIM+GIS 一张图 / 盾构智能监控 / 劳务实名制 / 风险预警"]
    ],
    focusTitle: "城市轨道快线建管平台的应用重点",
    focusIntro: "围绕地下车站、区间盾构、高架桥梁、密集工点、复杂地质及多参建单位的高效协同展开。",
    focus: [
      ["BIM+GIS 全线工点一张图", "整合线路走向、三维地质层、车站主体及区间隧道模型，实现全线宏观与微观工点无缝切换。"],
      ["盾构掘进关键参数实时接入", "实时采集盾构姿态、推进速度、注浆压力及地表沉降数据，保障越江和穿越密集建筑群安全。"],
      ["全天候智慧工地集成", "深度部署劳务实名制通行、人员精准定位、深基坑安全监测、塔吊防碰撞与高支模形变预警。"],
      ["多参建方统一协同工作流", "打通业主指挥部、总包部、监理标段与专业分包，实现进度、质量验收在线提报与闭环。"]
    ],
    capabilities: [
      ["轨道交通行业级解决方案", "专为长线路、地下多专业复杂接口工程量身打造。"],
      ["智慧工地全套软硬件集成", "提供边缘物联硬件集成、网络部署与平台管理一体化服务。"],
      ["BIM 复杂空间咨询服务", "开展换乘站机电综合管线排布与施工顺序模拟推演。"],
      ["应急指挥大屏调度", "提供突发事件三维定位、周边资源联动与应急预案推演。"]
    ],
    relatedTitle: "适合对照轨道交通与项目级智能建造方案",
    relatedIntro: "如果工程具有工期长、标段多、地下作业风险高等特点，可继续查看项目级与智慧工地方案。"
  },
  "cq-jidian": {
    title: "重庆机电控股集团企业级 BIM 施工管理平台",
    summary: "企业级数字建造平台案例，面向集团工程管理与投资建造一体化场景，围绕集团管控、投资协同与 BIM 施工管理展开。",
    scenario: "企业级管理平台 / 集团统管",
    image: "assets/thumbs/case_cq_jidian.jpg?v=20260917",
    caption: "大型工业国企企业级数字建造平台案例，实现投建一体化协同管控。",
    signals: ["Enterprise", "Invest", "BIM", "Standard"],
    profileIntro: "该案例适合大型国企集团、工业投资平台、总承包工程公司对照投资建造一体化平台建设路径。",
    profile: [
      ["平台尺度", "企业级投资建造一体化平台"],
      ["客户单位", "重庆机电控股（集团）公司"],
      ["关联产品", "BIMCC 智能建造平台 / 飞椽 Fyra 智能开发平台"],
      ["能力关键词", "投资建造一体化 / 集团统管 / BIM 过程管控 / 资产沉淀"]
    ],
    focusTitle: "投资建造一体化管控的应用重点",
    focusIntro: "围绕集团多板块工程投资预算、施工过程精细化管理、BIM 技术赋能与数字资产沉淀组织能力。",
    focus: [
      ["集团工程业务全景视窗", "将分布于各产业园区的厂房建设、技术改造及基建项目全部纳入集团统一视窗管理。"],
      ["投建全过程业务协同", "打通项目立项策划、招采合约、施工履约、竣工验收与资产转固的全生命周期数据链。"],
      ["BIM 驱动的精细化施工", "基于三维模型进行工程量清单精准核算，辅助设计变更审定与工程进度款支付审核。"],
      ["企业管理标准体系固化", "借助飞椽低代码敏捷配置能力，快速将集团内审红线与管理流程规范落地到系统表单中。"]
    ],
    capabilities: [
      ["企业级数字化转型方案", "助力多元化产业集团实现工程投资与建设穿透式监管。"],
      ["投资控制与商务成本系统", "实现合同台账、设计变更、计量结算与资金预测全流程联动。"],
      ["资产交接与数字档案中台", "确保建设期技术资料、竣工图纸与设备台账平滑移交运营。"],
      ["统一认证与多级权限架构", "支持大型企业复杂组织架构与细粒度数据隔离要求。"]
    ],
    relatedTitle: "适合对照企业级数字化运营与转型方案",
    relatedIntro: "如果您的企业需要统管下属多个分子公司或异地建设项目，可继续查看企业级方案。"
  },
  "yongan-chouxu": {
    title: "福建永安抽水蓄能电站智慧工地平台",
    summary: "大型抽水蓄能电站地下洞室群高安全标准工程，高集成度部署人员定位、有害气体监测、AI 识别、一张图指挥与爆破预警系统。",
    scenario: "水利水务 / 清洁能源地下工程",
    image: "assets/thumbs/case_yongan_chouxu.jpg?v=20260917",
    caption: "抽水蓄能深埋地下洞室群高难度智慧工地案例，攻克地下无信号定位与安全闭环。",
    signals: ["Hydro", "Tunnel", "Safety", "IoT"],
    profileIntro: "该案例适合水利水电、抽水蓄能、地下矿山、深埋隧洞等高风险极端作业环境工程对照高标准智慧工地建设路径。",
    profile: [
      ["工程尺度", "大型抽水蓄能电站地下厂房与复杂引水隧洞群"],
      ["客户单位", "中国水利水电第十四工程局有限公司"],
      ["关联产品", "BIMCC 智慧工地平台 / 地下定位与安全感知系统"],
      ["能力关键词", "地下空间高精定位 / 有害气体氡气监测 / 爆破智能清场 / 智能通风联动"]
    ],
    focusTitle: "深埋地下复杂空间智慧工地的应用重点",
    focusIntro: "围绕高危地下作业、极端潮湿粉尘环境、无线通讯穿透难题与重大安全风险防范展开重点建设。",
    focus: [
      ["地下洞室群 UWB 精准人员车辆定位", "攻克深埋地下无 GPS 难题，实现地下厂房、主副厂房及施工支洞人员车辆亚米级定位与轨迹追踪。"],
      ["多维有害气体与氡气环境智能感知", "全天候自动监测地下空间 CO、一氧化氮、硫化氢、氡气与粉尘浓度，超标触发声光警报并联动轴流风机。"],
      ["爆破作业智能人员清场核验", "设立爆破警戒电子围栏，爆破前自动比对危险区域滞留人员名单，清零后方可授权起爆流程。"],
      ["三维透明洞室应急指挥一张图", "结合三维地下工程地质与开挖断面模型，发生异常时毫秒级推送最优逃生路线与抢险指引。"]
    ],
    capabilities: [
      ["水利水务与高危工程专属方案", "专为地下洞室、高边坡、隧洞工程设计的工业级标准。"],
      ["工业级防潮防爆边缘设备集成", "提供 IP67 以上高防护等级设备，确保潮湿高粉尘环境长效运行。"],
      ["视频 AI 与违规行为智能识别", "精准抓拍未佩戴安全帽、违规搭乘工程车、擅入危险区域等行为。"],
      ["隐蔽工程全过程影像资料溯源", "施工记录、初支喷锚厚度检测与质检资料全生命周期绑定。"]
    ],
    relatedTitle: "适合对照水利水务与智慧工地方案",
    relatedIntro: "如果工程涉及隧洞作业、深基坑、高风险特种作业与多传感器物联集成，可继续查看智慧工地方案。"
  },
  "cq-gsvi": {
    title: "重庆工商职业学院数字基建管理平台",
    summary: "面向院校基建项目的全过程数字化管理，围绕投资预算、合同变更、现场质量安全、工程进度与档案数字化移交展开。",
    scenario: "院校基建 / 公共教育工程",
    image: "assets/thumbs/case_cq_gsvi.jpg?v=20260917",
    caption: "高校基建数字化管理案例，实现投资预算、质量安全与数字档案交钥匙工程。",
    signals: ["Campus", "Education", "BaseBuild", "Archive"],
    profileIntro: "该案例适合大专院校、科研院所、医院及公共事业单位基建管理部门对照数字化管理与审计合规路径。",
    profile: [
      ["工程尺度", "新校区多期建设及产教融合实训基地工程群"],
      ["客户单位", "重庆工商职业学院"],
      ["关联产品", "BIMCC 智能建造平台 / 数字档案中台"],
      ["能力关键词", "院校基建 / 投资变更控制 / 质量安全协同 / 竣工数字化移交"]
    ],
    focusTitle: "高校与公共基建数字化管理的应用重点",
    focusIntro: "围绕业主单位小团队高效管项目、严格控制设计变更与超概预算、确保审计资料齐备组织数字化能力。",
    focus: [
      ["全过程投资预算与变更把控", "严格控制设计变更、工程签证与进度款申报流程，设定红线预警，杜绝超投资概算风险。"],
      ["校区工程形象与进度直观呈现", "结合无人机全景航拍与工程 BIM 模型，让学校领导层足不出户掌握教学楼、宿舍区建设实况。"],
      ["基建处-代建-监理-施工全在线协同", "统一所有参建方沟通与报验渠道，隐患排查、整改与验收留痕备查，提高流转效率。"],
      ["交钥匙工程数字档案合规归集", "严格依照城建档案馆与高校档案馆双重标准，在线编目工程图纸与技术资料，保障移交顺利。"]
    ],
    capabilities: [
      ["公共事业与高校基建管理方案", "契合事业单位内控规范、政府采购与专项审计审查要求。"],
      ["工程电子档案规范化整理服务", "支持档案数字化扫描、电子签名、元数据封装与一键归档。"],
      ["轻量化移动端协同助手", "界面清晰直观，降低非专业管理人员的学习门槛与上手成本。"],
      ["智慧校园后期运维数据接口预留", "建筑构件与资产设备台账预留与校园智慧后勤系统的对接通道。"]
    ],
    relatedTitle: "适合对照建设单位与数字档案方案",
    relatedIntro: "如果关注业主投资合规受控、多方协同流程规范以及竣工档案数字化交接，可继续查看建设单位建管方案。"
  },
  "chenggong-wenti": {
    title: "呈贡文体活动中心智慧运维平台",
    summary: "总建筑面积 11.4 万㎡大型文体综合场馆，以数字孪生底座贯通建设期 BIM 模型与后期物业运营台账，实现设备设施智慧运维、能耗监测与空间运营。",
    scenario: "文体场馆 / 数字孪生智慧运维",
    image: "assets/thumbs/case_chenggong_wenti.jpg?v=20260917",
    caption: "大型文体中心数字孪生运维案例，实现从施工竣工到运营物业的一模到底移交。",
    signals: ["Stadium", "Twin", "Operation", "Energy"],
    profileIntro: "该案例适合大型文体场馆、会展中心、剧院、商业综合体与产业园区对照建设到运营数字孪生移交路径。",
    profile: [
      ["工程尺度", "总建筑面积 114,296 ㎡ / 涵盖艺术中心、图书博览、体育馆等 5 栋综合单体"],
      ["客户单位", "昆明呈贡广工建设有限公司 / 呈贡区文旅局"],
      ["关联产品", "数字孪生与智慧运维系统 / BIMGIS 空间底座"],
      ["能力关键词", "一模到底 / 数字孪生底座 / 设施设备预测性维保 / 综合能耗优化"]
    ],
    focusTitle: "文体综合体数字孪生智慧运维的应用重点",
    focusIntro: "围绕大型公共场馆资产数量多、能耗支出大、赛事活动人员密集安全保障要求高等核心挑战展开。",
    focus: [
      ["五大单体高保真三维孪生底座", "轻量化加载艺术中心、博物馆、体育馆全量建筑、机电模型，实现室内外空间、机房全息透视。"],
      ["关键设备全生命周期预防性维护", "给冷热水机组、变配电柜、消防泵、电梯建立唯一数字身份，根据运行时长与状态自动生成维保工单。"],
      ["精细化能耗计量与智慧节能策略", "分区域、分系统实时监测水电气热用量，通过能耗负荷分析与照明空调自适应控制降低运营成本。"],
      ["大型赛事与活动智能安保调度", "结合场馆人流热力感知、出入口客流统计，实时推演疏散动线，保障万人级集会活动平安顺畅。"]
    ],
    capabilities: [
      ["数字孪生与智慧运维一体化方案", "实现从施工数字化交付到智慧运营平滑过渡。"],
      ["楼宇物联网与工业协议中枢", "支持接入 BACnet、Modbus、OPC、MQTT 等主流楼宇智控协议。"],
      ["巡检工单与报修闭环平台", "支持现场维保扫码溯源、工单流转、满意度评价与物资备件核销。"],
      ["空间租赁与商业运营辅助", "通过三维空间可视化辅助展区划分、租位管理与客流动线优化。"]
    ],
    relatedTitle: "适合对照数字孪生与智慧运维方案",
    relatedIntro: "如果您希望将工程建设阶段沉淀的 BIM 模型与数据转化为长期运营资产，可继续查看数字孪生方案。"
  },
  "gezhouba-platform": {
    title: "葛洲坝集团智能项管平台",
    summary: "集团级项目管理平台案例，围绕集团统管、多项目管理、资金进度穿透和工程数据协同展开。",
    scenario: "企业级管理平台",
    image: "https://www.bimcc.cn/wp-content/uploads/2026/03/葛洲坝集团智能项管平台.jpg",
    caption: "企业级平台案例，重点呈现多项目统管和工程数据协同。",
    signals: ["Group", "Project", "Data", "Dashboard"],
    profileIntro: "该案例适合建设集团、工程局和大型企业客户对照企业级平台建设路径。",
    profile: [
      ["平台尺度", "企业级平台"],
      ["工程场景", "多项目工程管理"],
      ["关联产品", "BIMCC 智能建造平台 / 飞椽 Fyra"],
      ["能力关键词", "集团统管 / 进度穿透 / 数据协同"]
    ],
    focusTitle: "集团级工程管理平台的应用重点",
    focusIntro: "围绕多项目统一入口、项目数据汇聚、管理驾驶舱和业务流程沉淀建立平台能力。",
    focus: [
      ["多项目统管", "将企业、区域、项目、标段和工点放到同一管理视图中。"],
      ["工程数据协同", "围绕进度、资金、质量、安全、资料等管理对象统一数据口径。"],
      ["管理驾驶舱", "面向经营管理层呈现项目状态、风险事项和关键指标。"],
      ["平台持续配置", "通过飞椽 Fyra 支撑页面、流程、表单、报表和大屏持续迭代。"]
    ],
    capabilities: [
      ["BIMCC 智能建造平台", "承载项目管理、项企联动和工程业务协同。"],
      ["飞椽 Fyra", "支撑企业级应用快速配置和多端入口建设。"],
      ["数据中台", "统一主数据、指标口径、权限和报表服务。"],
      ["企业级解决方案", "适合集团多项目监管、经营驾驶舱和标准化落地。"]
    ],
    relatedTitle: "适合对照企业级数字化运营与转型方案",
    relatedIntro: "如果需要解决集团多项目统管、数据汇聚和经营监管问题，可继续查看企业级方案。"
  },
  "machinery-platform": {
    title: "重庆机电控股集团企业级 BIM 施工管理平台",
    summary: "企业级数字建造平台案例，围绕投资建造一体化、集团管控和项目过程管理展开。",
    scenario: "企业级管理平台",
    image: "https://www.bimcc.cn/wp-content/uploads/2026/01/重庆机电控股集团企业级.jpg",
    caption: "企业级 BIM 施工管理平台案例，适合对照集团工程管理需求。",
    signals: ["Invest", "Build", "BIM", "Control"],
    profileIntro: "该案例适合大型业主、集团企业和工程管理部门对照企业级数字建管需求。",
    profile: [
      ["平台尺度", "企业级平台"],
      ["客户类型", "集团企业"],
      ["关联产品", "BIMCC 智能建造平台 / 飞椽 Fyra"],
      ["能力关键词", "投资建造一体化 / 集团管控"]
    ],
    focusTitle: "投资建造一体化管理的应用重点",
    focusIntro: "围绕投资、建造、资产和项目过程数据形成统一管理入口。",
    focus: [
      ["集团管控", "将企业层、项目层和业务条线的管理要求统一组织。"],
      ["投资建造协同", "围绕投资、进度、合同、质量和安全数据建立联动视图。"],
      ["BIM 施工管理", "将模型、工程对象和施工过程数据关联到平台中。"],
      ["标准化复制", "沉淀流程、表单、指标和项目管理模板，支撑多项目复用。"]
    ],
    capabilities: [
      ["建设单位数字建管", "适合业主统一监管项目过程和数字化交付成果。"],
      ["BIMCC 智能建造平台", "承载项目全过程管理和多方协同。"],
      ["低 / 零代码配置", "支撑不同项目和组织流程的持续适配。"],
      ["数字档案", "沉淀项目资料、模型成果和交付数据。"]
    ],
    relatedTitle: "适合对照建设单位数字建管方案",
    relatedIntro: "如果关注投资、建造、资产和项目监管一体化，可继续查看建设单位方案。"
  },
  "rail-15-platform": {
    title: "重庆轨道 15 号线管控平台",
    summary: "轨道交通项目级平台案例，融合 BIM、智慧工地和现场数据，支撑长线路、多标段、多参建方协同。",
    scenario: "项目级平台 / 轨道交通",
    image: "https://www.bimcc.cn/wp-content/uploads/2026/01/重庆轨道15号线管控平台-1.jpg",
    caption: "轨道交通项目级管控平台，适合对照线性工程和智慧工地场景。",
    signals: ["Rail", "BIM", "Site", "GIS"],
    profileIntro: "该案例适合轨道交通、铁路、市政线性工程和重点项目建设方对照项目级平台路径。",
    profile: [
      ["平台尺度", "项目级平台"],
      ["工程场景", "轨道交通 / 线性工程"],
      ["关联产品", "BIMCC 智能建造平台 / 智慧工地"],
      ["能力关键词", "轨交管控 / 现场数据 / 智慧工地"]
    ],
    focusTitle: "轨道交通项目管控的应用重点",
    focusIntro: "围绕线路、标段、工点、现场数据和多参建方协同组织项目管理能力。",
    focus: [
      ["BIM + GIS 一张图", "将线路、标段、工点、模型和现场对象放入统一空间视图。"],
      ["智慧工地接入", "接入现场人员、设备、视频和环境等数据，支撑现场监管。"],
      ["质量安全闭环", "围绕检查、整改、复核、验收和归档形成过程留痕。"],
      ["多方协同", "支持建设、施工、监理、咨询和分包单位围绕同源数据协同。"]
    ],
    capabilities: [
      ["项目级智能建造平台", "支撑项目驾驶舱、业务协同和过程管理。"],
      ["智慧工地建设", "连接现场设备、视频、人员和风险事项。"],
      ["BIM 咨询服务", "支撑模型深化、施工模拟和数字化交付。"],
      ["监管驾驶舱", "面向项目管理层呈现进度、质量、安全和风险状态。"]
    ],
    relatedTitle: "适合对照项目级智能建造平台方案",
    relatedIntro: "如果项目具有长线路、多标段、多专业协同特点，可继续查看项目级和轨道交通方案。"
  },
  "jeddah-infrastructure": {
    title: "沙特吉达市中心综合开发基础设施项目",
    summary: "海外复杂基础设施项目案例，围绕多专业、多参建方协同和工程信息管理展开。",
    scenario: "基础设施 / 海外项目",
    image: "https://www.bimcc.cn/wp-content/uploads/2026/01/沙特吉达市中心综合开发基础设施.jpg",
    caption: "海外基础设施案例，适合对照复杂项目协同与工程数据管理需求。",
    signals: ["Infra", "Overseas", "BIM", "Coordinate"],
    profileIntro: "该案例适合大型基础设施、海外工程和复杂多方协同项目对照数字化管理路径。",
    profile: [
      ["平台尺度", "项目级平台"],
      ["工程场景", "基础设施 / 海外工程"],
      ["关联产品", "BIMCC 智能建造平台 / BIM 咨询"],
      ["能力关键词", "海外协同 / 复杂基础设施"]
    ],
    focusTitle: "复杂基础设施协同的应用重点",
    focusIntro: "围绕多专业接口、跨团队协同、工程资料和项目过程管理组织数字化能力。",
    focus: [
      ["多专业协同", "支撑设计、施工、咨询和管理团队围绕模型与资料协同。"],
      ["工程信息管理", "将项目资料、业务数据和管理流程放入统一平台。"],
      ["BIM 咨询支撑", "围绕模型创建、深化协调、施工模拟和数字化交付提供技术服务。"],
      ["项目过程留痕", "沉淀沟通、任务、问题、资料和交付成果。"]
    ],
    capabilities: [
      ["BIM 咨询服务", "支撑复杂基础设施模型与施工协同。"],
      ["项目级平台", "支撑项目过程管理和多参建方协同。"],
      ["数字档案", "整理工程资料、模型成果和交付内容。"],
      ["行业级方案", "适合复用到市政、公路、桥梁和基础设施场景。"]
    ],
    relatedTitle: "适合对照行业级智能建造一体化方案",
    relatedIntro: "如果项目属于复杂基础设施或多参建方协同场景，可继续查看行业级方案。"
  },
  "raffles-curtain-wall": {
    title: "重庆来福士广场幕墙项目",
    summary: "复杂公共建筑与地标工程案例，围绕异形结构、BIM 预拼装和多专业协同展开。",
    scenario: "公共建筑 / 综合体",
    image: "https://www.bimcc.cn/wp-content/uploads/2026/01/重庆来福士.jpg",
    caption: "复杂公共建筑案例，适合对照异形结构和 BIM 咨询服务场景。",
    signals: ["Building", "BIM", "Facade", "Model"],
    profileIntro: "该案例适合公共建筑、综合体、幕墙、机电和复杂空间项目对照 BIM 咨询能力。",
    profile: [
      ["平台尺度", "项目级服务"],
      ["工程场景", "公共建筑 / 综合体 / 幕墙"],
      ["关联产品", "BIM 咨询服务 / BIMCC 智能建造平台"],
      ["能力关键词", "异形结构 / 地标工程 / BIM 预拼装"]
    ],
    focusTitle: "复杂公共建筑 BIM 应用重点",
    focusIntro: "围绕复杂曲面、异形构件、预拼装和专业协调组织 BIM 技术服务。",
    focus: [
      ["异形构件建模", "面向复杂形体和构件关系建立可协同的 BIM 模型。"],
      ["BIM 预拼装", "通过模型辅助构件深化、安装顺序和现场协同。"],
      ["专业协调", "支撑幕墙、机电、结构、装修等专业之间的接口协调。"],
      ["数字化交付", "将模型成果和过程资料沉淀为项目可交付内容。"]
    ],
    capabilities: [
      ["BIM 咨询服务", "覆盖模型创建、深化设计、碰撞检查和施工模拟。"],
      ["工程数字技术", "结合实景采集、点云和模型对比支撑复杂空间管理。"],
      ["项目级平台", "可连接质量安全、进度资料和协同流程。"],
      ["公共建筑方案", "适合医院、文体、教育、科研办公和综合体项目。"]
    ],
    relatedTitle: "适合对照 BIM 咨询与公共建筑方案",
    relatedIntro: "如果项目涉及复杂空间、多专业协同或数字化交付，可继续查看 BIM 咨询服务。"
  },
  "luotian-water-platform": {
    title: "深圳罗田水库 - 铁岗水库输水隧洞工程智慧平台",
    summary: "水利水务与隧洞工程智慧平台案例，围绕隧洞建设、质量溯源、现场监管和智慧管理展开。",
    scenario: "水利水务 / 隧洞工程",
    image: "https://www.bimcc.cn/wp-content/uploads/2026/01/深圳罗田水库-铁岗水库输水隧洞工程智慧管理平台.jpg",
    caption: "水利隧洞工程案例，适合对照远程工区、质量溯源和智慧工地场景。",
    signals: ["Water", "Tunnel", "Trace", "Site"],
    profileIntro: "该案例适合水利水务、抽水蓄能、隧洞和远程工区项目对照智慧平台建设路径。",
    profile: [
      ["平台尺度", "项目级平台"],
      ["工程场景", "水利水务 / 隧洞工程"],
      ["关联产品", "BIMCC 智能建造平台 / 智慧工地"],
      ["能力关键词", "隧洞建设 / 质量溯源 / 智慧管理"]
    ],
    focusTitle: "水利隧洞智慧平台的应用重点",
    focusIntro: "围绕远程工区、质量溯源、现场监管和工程资料组织项目智慧管理能力。",
    focus: [
      ["远程工区监管", "将分散工点、现场数据和项目状态集中到管理视图。"],
      ["质量溯源", "围绕检查、整改、验收、资料和影像形成可追溯链路。"],
      ["智慧工地接入", "连接人员、设备、视频、环境和专项监测数据。"],
      ["运维衔接", "将建设阶段模型、资料和设备信息沉淀为长期运营基础。"]
    ],
    capabilities: [
      ["智慧工地建设", "支撑现场设备接入、风险预警和监管平台对接。"],
      ["项目级智能建造平台", "支撑项目驾驶舱、质量安全和资料管理。"],
      ["数字孪生与智慧运维", "连接模型、设备台账、监测数据和运维工单。"],
      ["水利水务方案", "适合输水隧洞、抽水蓄能、水运码头和远程工区。"]
    ],
    relatedTitle: "适合对照水利水务与智慧工地方案",
    relatedIntro: "如果项目关注隧洞、工区、质量溯源和现场设备接入，可继续查看水利水务与智慧工地能力。"
  }
};

casePages["rail-15-platform"] = casePages["cq-rail15"];
casePages["machinery-platform"] = casePages["cq-jidian"];

const productPages = {
  leitu: {
    title: "累土智控土石方数字化管控平台",
    summary: "面向民航机场、高铁路基及重大土石方工程的数字化管控整体解决方案，融合高精度 GNSS、物联网传感器与智能算法，实现强夯、碾压、摊铺及机械调运的毫米级精细化管控与质量全闭环。",
    primaryCta: "预约累土智控演示",
    image: "assets/v8/banner-bimcc.png",
    caption: "强夯·碾压·摊铺·机械调度一体化智能管控平台。",
    signals: ["Leitu", "GNSS", "IoT", "Earthwork"],
    valueTitle: "从人工粗放放样走向全流程数字化高精度智控",
    valueIntro: "累土智控彻底解决传统土石方施工中强夯定位偏差大、碾压漏压超压、摊铺厚度不均、机械台班工效模糊等长期痛点，实现降本增效与质量硬核保障。",
    values: [
      ["强夯精准计量，消除返工风险", "GNSS 高精度差分定位结合张力与霍尔传感器，夯击能、次数、落距、夯沉量自动毫秒级计量，定位误差 < 3cm。"],
      ["碾压遍数实时追踪，杜绝漏压欠压", "车载平板引导作业轨迹，振动传感器实时分析频率与幅值，自动生成压实度等值线图，合格率达 99.6%。"],
      ["摊铺平整度智能监控，保障结构质量", "动态监测摊铺厚度与温度曲线，智能调度摊铺料车与压路机协同，杜绝超铺欠铺与温度离析裂纹。"],
      ["机械台班与油耗穿透，杜绝怠速浪费", "自动识别怠速、运输、重载工况，精确监测燃油消耗与违规卸料，机械综合燃油节省 15%~20%。"]
    ],
    capabilities: [
      ["高精差分定位终端", "厘米级北斗/GNSS 差分定位，车载高抗振平板实时导航作业。"],
      ["强夯智能监测系统", "自动记录夯击次数、夯沉量、提升高度，自动预警异常夯击能。"],
      ["压实遍数等值线引擎", "动态计算碾压遍数、速度与轨迹重叠，实时渲染三维压实热力图。"],
      ["摊铺平整度与测温管控", "红外实时测温与厚度传感器联动，多机协同作业动态智能编排。"],
      ["机械工效与油耗台班", "怠速、运输、重载工况智能识别，电子围栏告警与集群语音调度。"],
      ["施工单元一张图管控", "土方分区设计图纸导入，施工单元智能划分与自检三检数字闭环。"]
    ],
    scenarios: [
      ["民用航空机场场道工程", "支撑大型机场跑道、停机坪超大面积土石方强夯地基加固与大厚度分层碾压高精度管控。", ["高填方精准夯实", "跑道地基压实度闭环", "机场专用全要素大屏"]],
      ["高速铁路与公路路基工程", "对长大线路路基分层填筑、连续压实进行毫米级质量追溯，杜绝工后沉降隐患。", ["长大区间连续压实", "边坡边角无死角覆盖", "动态质量检测评定"]],
      ["水利大坝与场地平整", "对堆石坝、防渗体土料填筑及超大园区场地平整进行机械集群实时统筹调度。", ["大体积填筑协同", "料车运距与轨迹追溯", "填方挖方平衡优化"]],
      ["工程机械台班精细化运营", "为施工总包与机械租赁企业提供设备工时、油耗监测与工效考核工具。", ["怠速燃油精准管控", "司机工时台班结算", "设备异常偷漏油预警"]]
    ],
    deliverables: ["累土智控平台云端系统", "车载高抗振平板应用", "高精度 GNSS 基站与天线套件", "强夯张力/霍尔传感监测套件", "碾压振动传感与测速组件", "油耗与姿态监测硬件", "施工单元自检三检报表", "土石方数字化管控大屏驾驶舱"],
    relatedTitle: "累土智控适合配合智慧工地与智能建造一体化实施",
    relatedIntro: "可重点查看机场场道、重大基建土石方及智慧工地相关案例与协同方案。"
  },
  "ai-shift-meeting": {
    title: "AI 班前会系统",
    summary: "智能安全交底与行为识别软硬件一体化系统。基于 AI 大模型与边缘计算，实现班前会语音自动转写、纪要一键提炼、未交底人员门禁拦截与隐患全流程闭环。",
    primaryCta: "预约 AI 班前会演示",
    image: "assets/v8/aurora-tech.png",
    caption: "让每日班前安全技术交底真正落到实处，实现施工安全源头闭环。",
    signals: ["AI", "Shift", "Safety", "Gate"],
    valueTitle: "重塑班组安全交底，变形式化走过场为数字化刚性闭环",
    valueIntro: "AI 班前会系统直击传统交底“记录靠手写、签字常代签、未交底混入场、过程难追溯”等痛点，提供软硬件一体、方案灵活（A/B 方案）的智能化解决方案。",
    values: [
      ["大模型智能纪要", "语音实时转文字并由 AI 大模型自动提炼安全注意事项、风险防范要点与工作分配，告别人工繁琐记录。"],
      ["门禁闸机强联动", "未交底人员人脸识别自动拦截，杜绝“未交底即作业”，确保 100% 安全交底入场。"],
      ["多模态智能识别", "集成未佩戴安全帽/工装识别、疲劳/酒后状态辅助筛查、人员站位监测与违规抽烟抓拍。"],
      ["全流程数字留痕", "交底音频、视频、签到表、纪要及确认签字全部自动上云归档，可追溯、防抵赖、支持监管一键报送。"]
    ],
    capabilities: [
      ["智能语音转写与摘要", "现场讲话实时转文字，AI 大模型秒级生成标准化会议纪要与交底重点。"],
      ["电子签名与人脸签到", "工人现场人脸核验或扫码完成交底确认签字，彻底杜绝替签漏签。"],
      ["门禁闸机联动权限控制", "打通人员实名制闸机，班前会完成自动下发进场通行权限，未完成即时阻断。"],
      ["智能宣讲台与硬件集成", "集成监控摄像头、高清宣讲大屏、AI边缘计算终端与云端协同中台。"],
      ["隐患闭环与数据驾驶舱", "统计各班组交底率、出勤率、违规行为分析，生成项目与企业级安全合规大屏。"],
      ["双方案弹性部署架构", "支持方案 A（轻量移动端扫码签字）与方案 B（智能宣讲大屏+工牌/人脸双重验证）。"]
    ],
    scenarios: [
      ["高危施工作业与特种工种", "高空、深基坑、动火、吊装等高风险工种每日强制技术安全交底。"],
      ["矿山与隧道地下工程", "恶劣环境下的班组点名、安全告知、出入井人员合规性精准管控。"],
      ["高铁枢纽与大型交通工程", "多标段、多班组、数千工人规模化快速交底与精准防漏检。"],
      ["智慧工地标准化标杆项目", "打造数字化安全展示亮点，迎检汇报与示范工程评优首选。"],
      ["企业级多项目安全巡查", "集团总部通过云端中台实时调阅各工地每日班前会开展实况与违规预警。"]
    ],
    deliverables: ["AI 班前会智能终端/宣讲台", "AI 边缘计算服务器", "班前会管理软件云平台", "闸机联动控制网关", "移动端交底小程序/APP", "项目安全看板大屏", "部署与实施培训服务"],
    relatedTitle: "AI 班前会已在多个国家级重点工程标杆落地",
    relatedIntro: "可查看新疆某矿山项目、广安东站/长赣高铁站、雄安启动区二期等典型应用案例。"
  }
,
"bimcc-platform": {
    title: "BIMCC 智能建造平台",
    summary: "覆盖工程项目全生命周期的数字建造管理平台，融合 BIM、GIS、UE、3DGS、AI 和 IoT 能力，连接工程业务数据、模型数据与现场物联数据。",
    primaryCta: "预约平台演示",
    image: "assets/v8/banner-bimcc.png",
    caption: "把模型、现场、业务和数据统一到一个平台。",
    signals: ["BIMCC", "BIM", "GIS", "IoT"],
    valueTitle: "以一张图和一套业务平台管理工程项目",
    valueIntro: "BIMCC 不只展示模型，更将进度、质量、安全、成本、物资设备、资料档案和多方协同放进统一业务闭环。",
    values: [
      ["一张图看项目", "融合 BIM、GIS、实景、设备和业务数据，实现从宏观态势到微观工点的穿透式管理。"],
      ["一套平台管业务", "覆盖协同办公、进度、质量、安全、成本、物资设备、数字档案和智慧运维等场景。"],
      ["多方协同同源数据", "支持业主、施工、监理、咨询、分包和 BIM 服务团队基于同源数据协同。"],
      ["项企联动沉淀资产", "打通企业、项目和工点之间的数据关系，让项目经验和业务模板持续沉淀。"]
    ],
    capabilities: [
      ["工程协同及前期管理", "支撑项目前期、协同办公、任务协作和多方沟通。"],
      ["生产进度管理", "支持计划编制、进度跟踪、形象进度、计划对比和预警。"],
      ["成本商务与物资设备", "管理合同、计量支付、材料设备、进出场和现场使用状态。"],
      ["技术质量与安全管理", "覆盖技术方案、质量检查、安全巡检、隐患整改和危大工程管理。"],
      ["智慧物联与 BIMGIS", "接入智慧工地设备、视频、传感器，并与模型和地图联动。"],
      ["数字档案与智慧运维", "沉淀项目资料、竣工成果、设备台账和运维工单。"]
    ],
    scenarios: [
      ["建设单位项目监管", "统一查看项目进度、投资、质量、安全、资料和数字化交付成果。"],
      ["施工单位项目履约", "围绕履约、安全质量、进度成本和现场协同提升项目管理能力。"],
      ["政府或集团监管平台", "构建区域项目一张图、风险预警和多项目监管驾驶舱。"],
      ["多参建方协同项目", "支撑业主、施工、监理、咨询和分包团队在线协同与过程留痕。"],
      ["建设到运维衔接", "把模型、设备台账和档案资料转化为长期运营资产。"]
    ],
    deliverables: ["BIMCC 智能建造平台", "项目驾驶舱", "BIM + GIS 一张图", "质量安全闭环台账", "生产进度看板", "物资设备管理模块", "数字档案体系", "多端协同入口"],
    relatedTitle: "BIMCC 是多数解决方案的业务承载平台",
    relatedIntro: "可查看轨道交通、水利水务、企业级平台和公共建筑等项目案例。"
  },
  "smart-site": {
    title: "智慧工地建设",
    summary: "围绕项目现场安全、质量、进度、人员、设备、视频和环境监测，提供智慧工地建设全流程服务和监管平台对接能力。",
    primaryCta: "获取智慧工地方案",
    image: "assets/v8/banner-bimcc.png",
    caption: "将现场设备和风险数据接入项目管理闭环。",
    signals: ["Site", "IoT", "Video", "Risk"],
    valueTitle: "让现场数据进入管理视图",
    valueIntro: "智慧工地能力连接设备、视频、人员、环境和专项监测数据，为项目管理和监管上报提供现场依据。",
    values: [
      ["设备统一接入", "连接实名制、视频监控、环境监测、塔吊升降机和专项监测设备。"],
      ["风险提前识别", "通过设备报警、视频 AI、巡检记录和业务规则辅助发现现场风险。"],
      ["问题闭环处置", "围绕发现、派发、整改、复核和归档形成完整处理链路。"],
      ["监管平台对接", "按监管要求对接数据上报和现场看板，减少重复填报。"]
    ],
    capabilities: [
      ["人员实名制与劳务管理", "支撑人员进出、考勤、班组和现场用工数据管理。"],
      ["视频监控与 AI 识别", "接入现场视频，辅助安全风险识别和异常提示。"],
      ["环境与设备监测", "接入扬尘、噪声、车辆、机械、塔吊、升降机和专项监测数据。"],
      ["质量安全巡检整改", "支持移动端检查、隐患整改、复核验收和统计分析。"],
      ["智慧工地驾驶舱", "汇总现场数据、风险事项、设备状态和监管上报情况。"],
      ["BIM + GIS 一张图联动", "将现场点位、风险、视频和业务对象挂接到模型或地图视图。"]
    ],
    scenarios: [
      ["项目智慧工地建设", "适合房建、市政、轨道、高速、水利水电和机场等项目现场。"],
      ["质量安全巡检整改", "通过移动端支撑发现问题、派发整改、现场反馈和复核归档。"],
      ["视频 AI 风险识别", "围绕人员行为、区域风险和现场异常进行辅助识别。"],
      ["大型机械与专项监测", "接入塔吊、升降机、深基坑、高支模和环境监测等专项数据。"],
      ["智慧工地监管上报", "对接监管平台或企业平台，形成统一数据入口。"]
    ],
    deliverables: ["智慧工地平台", "设备接入清单", "视频联动与 AI 识别规则", "质量安全巡检模块", "风险预警与闭环流程", "现场驾驶舱", "监管上报接口", "培训与运维机制"],
    relatedTitle: "智慧工地常与项目级平台一起落地",
    relatedIntro: "可查看重庆轨道 15 号线、罗田水库输水隧洞等现场管理案例。"
  },
  "bim-consulting": {
    title: "BIM 咨询服务",
    summary: "面向建筑工程、公路工程、市政工程等项目，提供全过程、全专业 BIM 技术服务和数字化交付支撑。",
    primaryCta: "预约 BIM 咨询",
    image: "assets/v8/aurora-tech.png",
    caption: "让模型成果进入施工协同、项目管理和数字化交付。",
    signals: ["BIM", "Model", "Review", "Deliver"],
    valueTitle: "把 BIM 从模型交付转化为管理能力",
    valueIntro: "BIM 咨询服务覆盖设计协调、专业深化、施工模拟、模型审查、平台数据融合和数字化交付。",
    values: [
      ["专业深化协同", "覆盖机电、幕墙、钢结构、景观小市政、精装和装配式等专业方向。"],
      ["设计施工联动", "通过碰撞检查、净高分析、方案比选和施工模拟降低现场返工风险。"],
      ["模型进入平台", "将模型构件、工程资料、质量安全和进度数据接入 BIMCC 或数字孪生平台。"],
      ["支撑数字交付", "形成可查询、可追溯、可运维衔接的模型和资料成果。"]
    ],
    capabilities: [
      ["BIM 实施顾问", "制定 BIM 实施策划、标准、流程和交付要求。"],
      ["设计协调与模型审查", "开展碰撞检查、管线综合、净高分析和专业协调。"],
      ["深化建模与施工应用", "服务机电、幕墙、钢结构、装配式和复杂节点施工。"],
      ["施工模拟与技术交底", "通过模型辅助施工组织、方案推演和技术交底。"],
      ["BIM + GIS 项目管理", "将模型与地图、进度、质量安全和现场数据融合。"],
      ["数字化交付服务", "整理模型、图纸、设备台账、资料档案和运维衔接数据。"]
    ],
    scenarios: [
      ["设计协调与施工深化", "适合多专业、多标段、复杂空间和高协同要求项目。"],
      ["BIM + GIS 项目管理", "将模型与项目管理、现场监管和一张图展示结合。"],
      ["施工模拟与技术交底", "服务复杂施工方案、节点做法和现场交底。"],
      ["实景采集与质量验评", "结合无人机、三维扫描、点云和 3DGS 做现场对比。"],
      ["数字化交付与运维衔接", "让 BIM 成果服务竣工移交和长期资产运营。"]
    ],
    deliverables: ["BIM 实施策划", "专业模型成果", "碰撞检查报告", "深化设计成果", "施工模拟成果", "BIM + GIS 一张图数据", "数字化交付资料", "平台融合数据"],
    relatedTitle: "BIM 咨询适合与平台和数字孪生共同推进",
    relatedIntro: "可查看公共建筑、轨道交通、市政基础设施和数字孪生相关案例。"
  },
  "digital-twin": {
    title: "数字孪生与智慧运维",
    summary: "通过数字孪生技术搭建可视化运维一张图，集成综合运维看板、设备管理、工单管理、档案管理和监测数据。",
    primaryCta: "预约运维方案沟通",
    image: "assets/v8/aurora-main.png",
    caption: "把建设阶段的数据延伸为运营阶段的资产管理能力。",
    signals: ["Twin", "Asset", "IoT", "Ops"],
    valueTitle: "让模型、设备、工单和档案形成资产视图",
    valueIntro: "数字孪生与智慧运维面向园区、场馆、公共建筑、轨道交通和基础设施运营场景。",
    values: [
      ["建设数据衔接运维", "整理 BIM 模型、竣工资料、设备台账和系统数据，为长期运营使用。"],
      ["设备状态可视", "将设备位置、状态、报警、维保和档案挂接到空间场景中。"],
      ["工单协同闭环", "支持报修、派单、处理、复核、评价和统计分析。"],
      ["运维驾驶舱汇报", "汇总设备状态、工单趋势、报警事件、巡检任务和运维绩效。"]
    ],
    capabilities: [
      ["数字孪生一张图", "统一展示空间模型、设备点位、业务数据和监测状态。"],
      ["设备台账管理", "管理设备基础信息、位置、状态、维保记录、档案和关联工单。"],
      ["工单闭环管理", "支持报修、派单、处理、复核、评价和统计分析。"],
      ["实时监测与预警", "接入物联网数据和报警信息，形成阈值预警和处置提醒。"],
      ["档案资料管理", "关联竣工资料、图纸文件、设备说明和运维记录。"],
      ["指挥中心与管理大屏", "支撑综合运维大屏、领导汇报看板与应急调度一张图。"]
    ],
    scenarios: [
      ["公共建筑智慧运维", "适合场馆、学校、医院、办公楼和综合体。"],
      ["轨道交通与基础设施运维", "结合线路空间、设备台账和监测数据进行运营管理。"],
      ["建设交付到运维衔接", "将模型、档案、设备资料和系统数据整理为可运营资产。"],
      ["设备监测与工单处置", "围绕设备状态、报警事件、巡检任务和维修工单形成闭环。"],
      ["数字孪生展示与汇报", "支撑管理汇报、参观展示、应急调度和运营评估。"]
    ],
    deliverables: ["数字孪生智慧运维平台", "BIM + GIS 运维一张图", "综合运维驾驶舱", "设备台账模块", "工单管理流程", "巡检维保模块", "监测预警接入", "档案资料管理"],
    relatedTitle: "数字孪生适合连接建设交付和长期运营",
    relatedIntro: "可查看公共建筑、园区场馆、轨道交通和基础设施运维相关案例。"
  },
    "engineering-tech": {
    title: "工程建模与数字技术",
    summary: "围绕工程全生命周期的全专业三维 BIM 建模、高精度 GIS 航测实景建模、三维激光点云逆向工程与标准化构件库资产化研发。",
    primaryCta: "咨询工程建模服务",
    image: "assets/v8/aurora-tech.png",
    caption: "全专业正向 BIM 建模、实景航测建模与构件库资产化服务。",
    signals: ["BIM", "GIS", "Model", "LiDAR"],
    valueTitle: "高精度三维建模，夯实工程数字化数据源头",
    valueIntro: "工程建模服务覆盖设计深化、施工制造、实景复核与轻量化构件库，确保模型资产“建得出、用得上、管得好”。",
    values: [
      ["全专业正向深度建模", "覆盖建筑、结构、机电管综、钢结构、幕墙及桥隧等复杂专业高精度建模。"],
      ["航测实景与激光扫描", "通过无人机倾斜摄影与三维激光雷达点云，高保真还原施工现场真实空间地形。"],
      ["实模一致与逆向分析", "结合实景点云与设计模型进行高精度形变分析、偏差比对与隐蔽工程复核。"],
      ["构件库标准化资产沉淀", "建立企业级标准化参数化构件库，实现模型构件规范化、轻量化与高频复用。"]
    ],
    capabilities: [
      ["全专业 BIM 深化建模", "机电管综综合排布、复杂节点详图深化、预制构件拆分建模。"],
      ["大场景 GIS 实景三维", "无人机航测倾斜摄影高精三维实景重建、正射影像生成与实景融合。"],
      ["三维激光扫描逆向工程", "复杂空间、既有建筑、地下管廊毫米级点云采集与逆向精准翻模。"],
      ["点云与模型合规比对", "点云与设计 BIM 模型自动偏差分析，快速发现施工尺寸与净高误差。"],
      ["模型轻量化与拓扑优化", "超大规模模型几何与语义分离轻量化处理，保障 Web 与移动端秒级加载。"],
      ["企业级构件库资产建设", "参数化构件族定制研发、构件编码规范制定与构件管理云平台搭建。"]
    ],
    scenarios: [
      ["重大基础设施与复杂枢纽", "服务大型机场、高铁站房、复杂超高层建筑的全专业高精度 BIM 建模。"],
      ["既有建筑改造与逆向翻模", "针对老旧建筑、历史风貌区、工业厂房进行三维激光扫描与逆向数字建档。"],
      ["大范围场地平整与土石方", "结合倾斜摄影实景三维高精地形，精确计算挖填方量并进行现状复核。"],
      ["企业级标准化构件体系", "为建筑集团建立标准化参数化构件云资产，赋能全集团多项目规范统一。"],
      ["施工质量验评与实模核验", "利用激光扫描与 3DGS 实景比对关键工序节点，严控施工毫米级偏差。"]
    ],
    deliverables: ["全专业深度 BIM 模型成果", "无人机倾斜摄影三维实景模型", "三维激光点云成果与逆向模型", "碰撞检查与管线综合深化报告", "点云偏差对比与分析报告", "企业级标准化构件库资产", "模型轻量化处理及平台接入"],
    relatedTitle: "工程建模为上层建造平台与数字孪生提供高质量数据基石",
    relatedIntro: "可查看大型公共建筑、轨道交通、水利水务及数字孪生相关案例。"
  },
  fyra: {
    title: "飞椽数字底座 (Fyra Engine)",
    summary: "工程企业级统一数字底座，融合自研 BIM+GIS 空间时空引擎、低代码可视化编排、多协议物联网感知与工程行业 AI 算力，为全线业务应用提供坚实支撑。",
    primaryCta: "预约飞椽底座演示",
    image: "assets/v8/banner-fyra.png",
    caption: "融合 BIM、GIS、IoT 与工程 AI 能力的统一自主技术底座。",
    signals: ["Fyra", "BIM+GIS", "Digital Base", "IoT & AI"],
    valueTitle: "以融合底座打通模型、空间、业务与物联全栈能力",
    valueIntro: "飞椽数字底座下沉为工程数字化建设的坚实基座，将自研 BIMGIS 时空引擎、低代码可视化编排、多源物联感知与工程行业 AI 算力深度融合，赋能上层业务应用敏捷交付与同源治理。",
    values: [
      ["BIMGIS 空间时空底座", "自研多源模型轻量化解析与大场景地理时空渲染引擎，毫秒级加载超大工程与城市级模型。"],
      ["低代码与业务流编排", "提供零代码/低代码页面配置、动态表单、审批流程与报表设计器，支撑业务应用极速构建。"],
      ["多源物联网与感知中台", "统一接入机械车载、环境感知、AI 抓拍、GNSS 等多协议物联设备与边缘网关。"],
      ["工程行业 AI 智能体算力", "工程知识图谱、规范库 RAG 检索、自然语言多维调度与现场安全智能问答中台。"]
    ],
    capabilities: [
      ["BIMGIS 空间时空引擎", "将超大规模 BIM 构件、GIS 地形、无人机倾斜摄影与空间时空拓扑统一渲染。"],
      ["页面与低代码渲染引擎", "构建各业务门户、工作台、复杂业务详情页和交互式数据驾驶舱。"],
      ["表单与流程流转引擎", "支撑现场填报、审批流转、任务协同、问题整改与复核归档的高性能配置。"],
      ["物联网多协议接入中台", "支持 MQTT、Modbus、HTTP 等工业与工程物联协议，实时计算并分发传感器流数据。"],
      ["工程行业 AI 大模型中台", "集成自然语言查询、智能问答、工程规范库解析与现场异常智能诊断。"],
      ["统一元数据与主数据中台", "打通工程企业与项目多源异构数据，建立统一主数据标准与 API 开放服务。"]
    ],
    scenarios: [
      ["企业级统一数字化基座建设", "为大型工程局、城投平台打造底层互通、技术自主、多应用共享的数字底座。", ["全集团数据拉通", "底层技术资产统一", "组织权限集中管控"]],
      ["智能建造与专业系统支撑", "为 BIMCC 建造平台、累土智控、智慧工地提供底层三维渲染与数据中台能力。", ["高并发大场景渲染", "复杂业务组件复用", "多端即时同步更新"]],
      ["数字孪生与全景一张图构建", "为园区、机场、水务等运维阶段提供宏微观一体的空间底座与物联网联动。", ["时空地理拓扑接入", "实时工况虚实映射", "全域态势一体调度"]],
      ["工程 AI 智能体创新孵化", "基于行业知识库与规则引擎，快速开发安全、质量、造价等专业 AI 助手。", ["工程知识库构建", "安全规程多轮对话", "智能辅助决策分析"]]
    ],
    deliverables: ["飞椽数字底座软件平台", "BIMGIS 空间渲染组件", "低代码可视化设计器", "物联网数据接入网关", "工程 AI 智能体算力套件", "标准 API 开放平台", "底座开发者与运维支持"],
    relatedTitle: "飞椽数字底座为全场景业务赋能",
    relatedIntro: "可重点查看企业级数字化、智能建造平台、累土智控及智慧工地等落地应用。"
  }
};

productPages["enterprise"] = productPages["bimcc-platform"];
productPages["site"] = productPages["smart-site"];
productPages["ai-pre-shift-meeting"] = productPages["ai-shift-meeting"];
productPages["leitu"] = productPages["leitu"];
productPages["engineering-modeling"] = productPages["engineering-tech"];

const solutionPages = {
  enterprise: {
    title: "企业级数字化运营与转型方案",
    summary: "面向施工单位、建设单位、全咨监理、教育医疗和企业运营管理场景，支撑多项目统管、组织协同、数据汇聚和经营决策。",
    signals: ["Group", "Data", "Process", "Decision"],
    caption: "让企业从单项目数字化走向多项目、全组织、可持续运营。",
    painTitle: "企业数字化建设常见的管理问题",
    painIntro: "项目多、系统多、数据口径不一致，会让管理层难以及时看到真实建设状态。",
    pain: [
      ["项目多，数据难贯通", "不同项目、区域和业务条线各自管理，集团难以形成统一数据视图。"],
      ["企业标准难落到项目", "制度、流程、表单和指标难以在多个项目之间统一执行。"],
      ["系统越建越多", "项目平台、设备系统、报表工具和协同工具分散，重复录入和对账成本高。"],
      ["数字资产难沉淀", "项目结束后，业务模板、数据口径、经验成果和资料资产没有持续复用。"]
    ],
    planTitle: "以统一平台沉淀企业工程管理能力",
    planIntro: "筑云通过 BIMCC、飞椽 Fyra、数据中台和业务模板库，构建集团到项目的数字化运营体系。",
    plan: [
      ["经营决策层", "建设集团级运营驾驶舱，汇总进度、投资、质量、安全、履约和经营指标。"],
      ["项目管理层", "统一多项目台账、计划、问题、合同、成本、物资设备和资料档案。"],
      ["现场感知层", "接入智慧工地、视频、设备、人员和环境监测数据。"],
      ["平台支撑层", "通过飞椽 Fyra 支撑流程、表单、报表、大屏和移动端持续配置。"]
    ],
    modules: [
      ["集团运营驾驶舱", "汇总多项目关键指标和风险事项。"],
      ["项企联动管理", "打通企业、区域、项目、标段和工点管理链路。"],
      ["标准化模板库", "沉淀流程、表单、指标和项目管理方法。"],
      ["数据中台与接口", "统一主数据、指标口径、数据服务和权限边界。"],
      ["企业级智慧工地监管", "接入多项目现场设备和监管数据。"],
      ["低 / 零代码应用迭代", "支撑业务变化下的快速配置和二次迭代。"]
    ],
    scenarios: [
      ["集团级运营驾驶舱", "服务总部经营管理和领导决策。"],
      ["多项目项企联动", "服务区域公司、项目公司和项目部统一协同。"],
      ["企业标准化落地", "把统一制度、模板和指标落实到具体项目。"],
      ["多系统集成", "对接已有系统、智慧工地平台和数据接口。"],
      ["企业级智慧监管", "面向质量安全、风险预警和现场监管。"]
    ],
    deliverables: ["企业级工程管理平台", "集团运营驾驶舱", "多项目台账", "标准流程与表单", "数据中台与指标体系", "智慧工地接入", "报表和大屏", "运营与培训机制"],
    relatedTitle: "企业级方案可参考集团平台案例",
    relatedIntro: "可查看葛洲坝集团智能项管平台、重庆机电控股集团企业级 BIM 施工管理平台等案例。"
  },
  industry: {
    title: "行业级智能建造一体化解决方案",
    summary: "面向房建、民航、水利水务、隧洞、市政公路、铁路和桥梁等工程类型，提供可复用的智能建造方案和行业模板。",
    signals: ["Industry", "Template", "Scene", "Delivery"],
    caption: "把行业经验沉淀为可复用的工程数字化能力。",
    painTitle: "不同工程类型需要不同的数字化重点",
    painIntro: "行业级方案关注工程对象、现场条件、数据采集方式和监管要求的差异。",
    pain: [
      ["工程类型差异大", "房建、轨道、水利、机场和市政工程的业务重点与现场管理方式不同。"],
      ["行业模板不足", "通用软件难以直接适配工程流程、专业对象和现场监管要求。"],
      ["多专业协同复杂", "设计、施工、监理、设备、运营和监管之间需要同源数据支撑。"],
      ["经验复制困难", "单个项目形成的管理方法难以复制到同类工程。"]
    ],
    planTitle: "围绕工程场景配置平台、服务和技术组合",
    planIntro: "筑云结合 BIMCC、智慧工地、BIM 咨询、数字孪生和工程数字技术，为不同行业场景配置能力组合。",
    plan: [
      ["行业模型", "按工程类型配置业务模块、指标、流程和数据对象。"],
      ["现场接入", "根据现场条件接入设备、视频、传感器、全景和专项监测数据。"],
      ["一张图管理", "结合 BIM、GIS 和项目数据形成行业场景视图。"],
      ["案例复用", "将已落地项目经验转化为同类工程的实施模板。"]
    ],
    modules: [
      ["房建与公共建筑", "覆盖医院、文体、教育、科研办公、综合体和高端住宅。"],
      ["民航机场", "覆盖航站楼、飞行区、配套设施和土石方管理。"],
      ["轨道交通与铁路", "覆盖线路、标段、工点和多参建方协同。"],
      ["水利水务与隧洞", "覆盖输水隧洞、抽水蓄能、水运码头和远程工区监管。"],
      ["市政公路与桥梁", "覆盖道路、桥梁、隧道立交和综合管廊。"],
      ["智慧运维", "覆盖园区、场馆、轨道和公共建筑的资产运营。"]
    ],
    scenarios: [
      ["大型复杂工程协同", "适合多专业、多参建方、多标段工程。"],
      ["线性工程管理", "适合轨道、铁路、市政道路和高速公路。"],
      ["远程工区监管", "适合水利水务、抽水蓄能和隧洞工程。"],
      ["公共建筑数字交付", "适合医院、学校、文体场馆和综合体。"],
      ["土石方与现场专项管控", "适合机场、市政和大型基础设施前期工程。"]
    ],
    deliverables: ["行业场景方案", "行业模板库", "项目级平台配置", "BIM + GIS 一张图", "智慧工地接入", "BIM 咨询成果", "数字档案", "相似案例匹配"],
    relatedTitle: "行业级方案需要结合相近工程案例判断",
    relatedIntro: "可按轨道交通、水利水务、公共建筑、民航机场和基础设施筛选案例。"
  },
  project: {
    title: "项目级智能建造平台解决方案",
    summary: "面向单体重点建设项目，构建覆盖模型、场地、劳务、设备、质量安全、进度资料和多方协同的项目中控平台。",
    signals: ["Project", "Site", "BIM", "Archive"],
    caption: "把项目现场和业务流程纳入同一个管理闭环。",
    painTitle: "单体项目的核心问题是现场、业务和资料分散",
    painIntro: "项目级平台需要让多参建方在同一入口完成管理、协同和过程留痕。",
    pain: [
      ["项目管理信息分散", "进度、质量、安全、成本、资料和现场问题分布在不同系统或台账中。"],
      ["现场数据进入慢", "设备、视频、人员、环境和巡检数据无法及时进入管理视图。"],
      ["多方协同缺少统一入口", "业主、施工、监理、咨询和分包之间沟通链路长。"],
      ["BIM 应用停留在展示层", "模型没有与进度、质量、安全、资料和现场对象持续联动。"]
    ],
    planTitle: "围绕项目全过程构建数字化管理平台",
    planIntro: "以 BIMCC 平台为核心，结合智慧工地、BIM 咨询、移动端和数字档案，让项目过程可视、可控、可追溯。",
    plan: [
      ["项目驾驶舱", "汇总项目关键指标、进度、质量安全、问题闭环和资料状态。"],
      ["BIM + GIS 一张图", "将模型、地图、工点、设备和业务对象关联展示。"],
      ["现场协同", "通过移动端、设备接入和视频联动支撑现场处置。"],
      ["数字档案", "沉淀过程资料、验收证据、模型成果和竣工交付内容。"]
    ],
    modules: [
      ["项目驾驶舱", "统一项目态势、风险事项和关键指标。"],
      ["生产进度管理", "支持计划、形象进度、偏差分析和预警。"],
      ["质量安全闭环", "覆盖检查、整改、复核、归档和统计。"],
      ["智慧工地接入", "接入现场人员、设备、视频和环境监测。"],
      ["物资设备协同", "管理材料、设备、台账、进出场和使用状态。"],
      ["数字档案与竣工交付", "归集过程资料、模型成果和交付清单。"]
    ],
    scenarios: [
      ["项目驾驶舱与一张图指挥", "适合重点项目总控和管理汇报。"],
      ["生产进度联动", "适合计划对比、形象进度和现场调度。"],
      ["质量安全闭环", "适合隐患整改、危大工程和巡检复核。"],
      ["智慧工地统一接入", "适合现场设备、视频、人员和环境数据管理。"],
      ["多方协同与移动处置", "适合参建方协同和现场任务流转。"]
    ],
    deliverables: ["项目级智能建造平台", "项目驾驶舱", "BIM + GIS 一张图", "智慧工地设备接入", "质量安全闭环台账", "进度管理看板", "移动端协同入口", "数字档案体系"],
    relatedTitle: "项目级方案可参考轨道、水利和公共建筑案例",
    relatedIntro: "可查看重庆轨道 15 号线管控平台、罗田水库输水隧洞工程智慧平台等案例。"
  },
  "build-client": {
    title: "建设单位数字建管解决方案",
    summary: "面向建设单位、项目公司、城投平台和大型业主，统一项目监管、投资进度质量安全数据和数字化交付成果。",
    signals: ["Owner", "Invest", "Quality", "Deliver"],
    caption: "帮助建设单位看全项目过程，沉淀可交付数字资产。",
    painTitle: "建设单位需要从全局掌握项目过程",
    painIntro: "进度、投资、质量、安全、协同和交付数据如果无法联动，项目风险就很难提前判断。",
    pain: [
      ["项目过程看不全", "关键数据分散在参建方、系统和线下文件中，业主难以及时掌握全局。"],
      ["进度投资质安难联动", "投资、进度、质量和安全数据口径不同，影响决策判断。"],
      ["参建方协同成本高", "设计、施工、监理、咨询和供应商之间缺少同源管理入口。"],
      ["数据无法沉淀到交付和运维", "建设阶段形成的模型、资料和设备台账难以延伸为运营资产。"]
    ],
    planTitle: "用数字建管平台统一项目监管和交付成果",
    planIntro: "筑云基于 BIMCC、数字孪生、BIM 咨询和数字档案，帮助建设单位建立全过程项目管理视图。",
    plan: [
      ["全过程监管", "覆盖前期、设计、施工、验收和运维衔接阶段。"],
      ["投资进度联动", "将进度、投资、合同、计量和工程量数据统一展示。"],
      ["质量安全监管", "形成巡检、整改、复核、风险预警和问题闭环。"],
      ["数字化交付", "沉淀模型、档案、设备台账和运维衔接数据。"]
    ],
    modules: [
      ["项目全过程监管", "建设单位统一掌握项目状态和风险事项。"],
      ["进度投资联动分析", "把计划、工程量、投资和支付数据关联。"],
      ["质量安全风险监管", "管理隐患、问题、整改和复核闭环。"],
      ["多方协同与过程留痕", "支撑参建方协同、审批流转和资料归集。"],
      ["数字化交付与运维衔接", "形成可持续使用的模型、档案和设备数据。"],
      ["多项目统一监管", "适合集团业主或城投平台管理多个项目。"]
    ],
    scenarios: [
      ["甲方项目监管", "适合业主方掌握项目全局。"],
      ["集团多项目统管", "适合多项目、多区域、多专业协同。"],
      ["投资建设一体化管理", "适合关注投资、进度、合同和支付联动的项目。"],
      ["数字化交付", "适合竣工资料、模型和运维数据要求较高的项目。"],
      ["资产运营衔接", "适合建设期数据进入运维管理的项目。"]
    ],
    deliverables: ["建设单位数字建管平台", "项目全过程监管驾驶舱", "进度投资联动看板", "质量安全闭环台账", "参建方协同流程", "数字档案", "数字孪生运维底座", "项目交付数据清单"],
    relatedTitle: "建设单位方案可参考企业级和项目级案例",
    relatedIntro: "可查看重庆机电控股、海南交投、公共建筑和轨道交通等案例方向。"
  },
  "build-contractor": {
    title: "施工单位智能建造解决方案",
    summary: "面向施工总包、工程局、分公司和项目部，覆盖履约管理、质量安全、进度成本、物资设备、智慧工地和数字档案。",
    signals: ["Build", "Site", "Cost", "Risk"],
    caption: "让施工管理从现场分散处理走向平台统一闭环。",
    painTitle: "施工单位需要同时管履约、现场和成本",
    painIntro: "施工项目如果缺少统一平台，质量安全、进度、成本和设备数据很难形成闭环。",
    pain: [
      ["项目多，标准难统一", "企业和项目部之间的流程、表单、指标和数据口径难以同步。"],
      ["质量安全闭环慢", "隐患整改、复核验收和问题归档依赖人工跟进。"],
      ["进度与现场脱节", "计划、形象进度、资源投入和现场实际状态不同步。"],
      ["智慧工地设备多，平台分散", "设备和视频数据没有进入统一项目管理入口。"]
    ],
    planTitle: "用智能建造平台统一施工履约管理",
    planIntro: "筑云结合 BIMCC、智慧工地、飞椽 Fyra、BIM 咨询和数字档案，支撑施工单位项目履约和多项目管控。",
    plan: [
      ["履约驾驶舱", "汇总项目进度、质量安全、成本、物资设备和风险事项。"],
      ["现场管理闭环", "连接巡检、整改、设备、视频和移动端处置。"],
      ["成本物资协同", "把合同、成本、物资设备和生产进度进行联动。"],
      ["企业标准复用", "通过模板、流程和权限配置支撑多项目复制。"]
    ],
    modules: [
      ["企业多项目履约监管", "服务总部、区域公司和项目部多层级管理。"],
      ["质量安全闭环管理", "覆盖检查、整改、复核、验收和统计。"],
      ["生产进度管理", "支持计划编制、形象进度、偏差分析和预警。"],
      ["成本商务管理", "支撑合同、计量、支付、成本和经营分析。"],
      ["物资设备管理", "管理材料、设备、台账、进出场和使用状态。"],
      ["智慧工地统一接入", "连接人员、设备、视频、环境和专项监测数据。"]
    ],
    scenarios: [
      ["项目履约监管", "适合施工总包、工程局和项目部。"],
      ["质量安全创优", "适合安全质量要求高、检查频繁的项目。"],
      ["生产进度协同", "适合多专业、多标段、多分包协同。"],
      ["物资设备与成本联动", "适合现场资源和成本管理压力大的项目。"],
      ["观摩迎检与展示", "适合智慧工地、指挥中心和项目展示需求。"]
    ],
    deliverables: ["施工单位智能建造平台", "项目履约驾驶舱", "智慧工地接入", "质量安全闭环模块", "进度计划与看板", "成本商务模块", "物资设备模块", "数字档案与展示能力"],
    relatedTitle: "施工单位方案可结合智慧工地案例判断",
    relatedIntro: "可查看轨道交通、公共建筑、水利隧洞和企业级施工管理平台案例。"
  },
  "build-supervision": {
    title: "全咨 / 监理数字化协同解决方案",
    summary: "面向全过程工程咨询、监理单位和项目管理团队，支撑多方协同、过程留痕、质量安全闭环、验收证据和数字化交付。",
    signals: ["Consult", "Supervise", "Archive", "Trace"],
    caption: "让咨询与监理过程有据可查、协同可控、成果可交付。",
    painTitle: "全咨与监理的核心价值需要过程数据证明",
    painIntro: "过程工作如果分散在群消息、纸质单据和多个台账中，后期汇报和交付压力会持续放大。",
    pain: [
      ["参建方多，协同边界复杂", "业主、施工、设计、咨询、监理和分包同时参与，责任边界容易模糊。"],
      ["问题闭环依赖线下跟进", "质量、安全、进度和现场问题从发现到归档缺少统一链路。"],
      ["过程资料难以持续归集", "监理日志、旁站记录、验收资料、会议纪要和影像资料分散。"],
      ["咨询成果难与项目数据联动", "BIM 咨询和专项分析成果如果停留在文件层，很难进入日常管理。"]
    ],
    planTitle: "以协同管理为主线沉淀全过程证据链",
    planIntro: "筑云将监理管理、问题闭环、资料档案、BIM 模型、现场影像和智慧工地数据统一组织。",
    plan: [
      ["协同管理层", "项目驾驶舱、多方协同、任务分发、会议纪要和移动端处置。"],
      ["监理业务层", "监理日志、旁站记录、巡检检查、问题整改、复核验收和监理报告。"],
      ["咨询成果层", "BIM 咨询、设计协调、模型审查、施工模拟和数字化交付。"],
      ["资料档案层", "工程档案、图纸资料、质量检验、中间交工和竣工资料。"]
    ],
    modules: [
      ["多方协同与权限隔离", "支撑不同参建方在线协同和边界管理。"],
      ["质量安全问题闭环", "形成发现、整改、复核、验收和归档链路。"],
      ["监理过程数字化", "管理监理日志、旁站记录、巡检检查和会议纪要。"],
      ["BIM 咨询成果协同", "将模型、协调和模拟成果接入管理流程。"],
      ["验收证据与数字档案", "沉淀可交付的过程资料和模型成果。"],
      ["项目管理汇报看板", "展示进度、质量、安全、资料和风险事项。"]
    ],
    scenarios: [
      ["全过程工程咨询", "适合咨询团队统筹项目过程管理。"],
      ["监理业务数字化", "适合监理日志、旁站、验收和问题闭环。"],
      ["多参建方协同", "适合业主、施工、监理、咨询和分包共同参与。"],
      ["BIM 咨询成果应用", "适合模型、协调、深化和施工模拟进入平台。"],
      ["数字档案交付", "适合验收证据、竣工资料和项目复盘要求。"]
    ],
    deliverables: ["全咨 / 监理协同平台", "项目协同驾驶舱", "质量安全闭环台账", "监理日志与旁站模块", "移动端检查入口", "BIM 咨询成果应用", "验收证据体系", "数字档案清单"],
    relatedTitle: "全咨监理方案可参考协同管理类项目",
    relatedIntro: "可查看公共建筑、轨道交通和项目级智能建造平台相关案例。"
  },
  "build-regulation": {
    title: "政府 / 集团监管解决方案",
    summary: "面向政府监管部门、集团总部、区域平台和大型业主单位，构建区域项目一张图监管、风险预警、多层级穿透和指挥决策体系。",
    signals: ["Regulate", "Map", "Risk", "Command"],
    caption: "让区域项目和集团项目真正实现一张图监管。",
    painTitle: "监管需要把分散项目变成可穿透的数据网络",
    painIntro: "项目数量多、类型多、阶段不同，监管单位需要统一视图、统一指标和风险闭环。",
    pain: [
      ["项目分散，监管视图不统一", "区域内或集团内项目难以在统一平台上掌握整体态势。"],
      ["现场数据接不上来", "智慧工地、视频、实名制、环境和专项监测设备各自独立。"],
      ["风险发现不及时", "质量安全、危大工程和现场异常依赖人工上报。"],
      ["多层级管理难穿透", "宏观态势难以下钻到具体项目、标段和工点。"]
    ],
    planTitle: "以 BIM + GIS 一张图建立多项目监管体系",
    planIntro: "筑云整合多项目业务数据、BIM / GIS 模型、智慧工地设备、视频监控、风险预警和监管台账。",
    plan: [
      ["监管决策层", "监管驾驶舱、区域一张图、领导大屏、风险分析和指挥调度。"],
      ["项目监管层", "项目台账、进度监管、质量监管、安全监管、危大工程和数字档案。"],
      ["现场感知层", "智慧工地接入、视频监控、AI 识别、实名制和专项监测。"],
      ["数据治理层", "数据标准、主数据、指标体系、接口服务、数据资产和监管报表。"]
    ],
    modules: [
      ["全域总览", "展示项目分布、状态、风险和监管重点。"],
      ["多层级穿透", "从政府 / 集团总览下钻到区域、公司、项目、标段和工点。"],
      ["风险预警", "融合设备、视频 AI、业务填报和台账形成提醒与闭环。"],
      ["智慧工地统一接入", "接入人员、视频、环境、机械和专项监测数据。"],
      ["监管报表", "生成风险排名、问题闭环、设备接入和项目评价报表。"],
      ["指挥中心展示", "支撑领导驾驶舱、BI 大屏、指挥中心和观摩展厅。"]
    ],
    scenarios: [
      ["区域项目监管", "适合政府部门和行业主管单位。"],
      ["集团多项目穿透管理", "适合集团总部、区域公司和项目部多层级管理。"],
      ["智慧工地统一接入", "适合既有现场设备和监管平台整合。"],
      ["风险预警与闭环处置", "适合质量安全、危大工程和现场异常管理。"],
      ["指挥中心与展厅汇报", "适合领导汇报、检查观摩和应急调度。"]
    ],
    deliverables: ["政府 / 集团监管平台", "BIM + GIS 区域一张图", "监管驾驶舱", "多项目台账", "智慧工地统一接入", "质量安全预警体系", "问题整改闭环台账", "监管报表与评价分析"],
    relatedTitle: "监管方案可参考集团和区域平台案例",
    relatedIntro: "可查看企业级平台、交通基建、公共建筑和水利水务相关案例。"
  }
};

const industrySolutionAliases = {
  "industry-building": {
    title: "房建与公共建筑智能建造方案",
    summary: "面向医院、文体、教育、科研办公、综合体和高端住宅等建筑场景，支撑质量安全进度、BIM 协同和数字化交付。",
    signals: ["Building", "BIM", "Quality", "Archive"]
  },
  "industry-airport": {
    title: "民航机场数字化施工方案",
    summary: "面向航站楼、飞行区、配套设施和土石方工程，支撑大体量、复杂接口和多专业协同管理。",
    signals: ["Airport", "Earth", "Schedule", "Safety"]
  },
  "industry-rail": {
    title: "轨道交通与铁路智能建造方案",
    summary: "面向长线路、多标段、多专业和多参建方协同，构建 BIM + GIS 一张图和项目管控平台。",
    signals: ["Rail", "Line", "GIS", "Site"]
  },
  "industry-water": {
    title: "水利水务与隧洞智能建造方案",
    summary: "面向输水隧洞、抽水蓄能、水运码头和远程工区，支撑智慧工地、质量溯源和设备监测。",
    signals: ["Water", "Tunnel", "IoT", "Trace"]
  },
  "industry-municipal": {
    title: "市政公路与桥梁智能建造方案",
    summary: "面向市政道路、高速公路、桥梁、隧道立交和综合管廊，支撑 BIM 咨询、施工模拟和现场巡检。",
    signals: ["Road", "Bridge", "BIM", "Inspect"]
  },
  "industry-operations": {
    title: "智慧运维与园区资产数字孪生方案",
    summary: "面向场馆、园区、轨道、市政、港区和公共建筑运营阶段，构建数字孪生一张图和运维闭环。",
    signals: ["Twin", "Asset", "Ops", "Work"]
  }
};

for (const [slug, alias] of Object.entries(industrySolutionAliases)) {
  solutionPages[slug] = {
    ...solutionPages.industry,
    ...alias,
    caption: "按具体工程类型配置平台模块、现场接入和交付内容。"
  };
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function getSlug(defaultSlug) {
  const params = new URLSearchParams(window.location.search);
  return params.get("slug") || params.get("id") || defaultSlug;
}

function setField(root, selector, value) {
  if (!value) return;
  root.querySelectorAll(selector).forEach((element) => {
    element.textContent = value;
  });
}

function setSignals(root, prefix, signals = []) {
  ["A", "B", "C", "D"].forEach((key, index) => {
    setField(root, `[data-${prefix}-field="signal${key}"]`, signals[index]);
  });
}

function getSvg(name, size = 16, color = "currentColor") {
  const icons = {
    building: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v8h4"/><path d="M18 9h2a2 2 0 0 1 2 2v11h-4"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>`,
    airport: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>`,
    rail: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="16" x="4" y="3" rx="2"/><path d="M4 11h16"/><path d="M12 3v8"/><path d="m8 19-2 3"/><path d="m18 22-2-3"/><circle cx="8" cy="15" r="1"/><circle cx="16" cy="15" r="1"/></svg>`,
    water: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>`,
    bridge: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 20h18"/><path d="M3 13c3.5-3.5 6.5-3.5 10 0 3.5 3.5 6.5 3.5 10 0"/><path d="M7 10v10"/><path d="M17 10v10"/></svg>`,
    campus: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
    energy: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
    education: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`,
    check: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    alert: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
    shield: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    layers: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
    cpu: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9"/><path d="M9 1v3"/><path d="M15 1v3"/><path d="M9 20v3"/><path d="M15 20v3"/><path d="M20 9h3"/><path d="M20 14h3"/><path d="M1 9h3"/><path d="M1 14h3"/></svg>`,
    cube: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21 16-9 5-9-5V8l9-5 9 5v8Z"/><path d="m3.27 6.96 8.73 4.88 8.73-4.88"/><path d="M12 22.08V12"/></svg>`,
    chart: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>`,
    sparkle: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3z"/></svg>`,
    workflow: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="8" height="8" x="3" y="3" rx="2"/><path d="M7 11v4a2 2 0 0 0 2 2h4"/><rect width="8" height="8" x="13" y="13" rx="2"/></svg>`,
    arrowRight: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`
  };
  return icons[name] || icons.cube;
}

function renderCards(root, selector, items = [], mode = "cards") {
  const container = root.querySelector(selector);
  if (!container) return;

  function getScenarioWorkflowSteps(title = "", tag = "", rawItem = null) {
    if (Array.isArray(rawItem) && Array.isArray(rawItem[2]) && rawItem[2].length === 3) {
      return rawItem[2];
    }
    if (rawItem && Array.isArray(rawItem.steps) && rawItem.steps.length === 3) {
      return rawItem.steps;
    }
    const combined = `${title} ${tag}`.toLowerCase();
    if (combined.includes("企业级") || combined.includes("数字化平台") || combined.includes("城投") || combined.includes("多项目")) {
      return ["权限与组织梳理", "业务模块拼装", "集团驾驶舱上线"];
    }
    if (combined.includes("智能建造") || combined.includes("机场") || combined.includes("枢纽") || combined.includes("履约")) {
      return ["进度网络仿真", "多专业工序协同", "数字化竣工归档"];
    }
    if (combined.includes("智慧工地") || combined.includes("轨道") || combined.includes("铁路") || combined.includes("物联")) {
      return ["边缘设备组网", "风险隐患智能告警", "现场联动闭环监管"];
    }
    if (combined.includes("数字孪生") || combined.includes("一张图") || combined.includes("水利") || combined.includes("隧洞")) {
      return ["空间底座接入", "工况实时孪生", "态势综合调度"];
    }
    if (combined.includes("ai") || combined.includes("市政") || combined.includes("路桥") || combined.includes("智能体")) {
      return ["工程知识库构建", "自然语言查询调度", "智能辅助填报生成"];
    }
    if (combined.includes("运维") || combined.includes("资产") || combined.includes("园区") || combined.includes("场馆")) {
      return ["空间资产挂接", "设备遥测阈值告警", "工单流转闭环处置"];
    }
    if (combined.includes("展厅") || combined.includes("指挥") || combined.includes("观摩") || combined.includes("大屏")) {
      return ["多源数据接入", "三维视效渲染", "指挥多屏联动"];
    }
    if (combined.includes("土石方") || combined.includes("扫描") || combined.includes("无人机") || combined.includes("点云") || combined.includes("实景")) {
      return ["激光点云扫描", "实景三维高精重构", "实模一致对比验评"];
    }
    if (combined.includes("班前") || combined.includes("交底") || combined.includes("安全")) {
      return ["AI 考勤与交底", "高危风险语音播报", "作业人员签字确认"];
    }
    if (combined.includes("实训") || combined.includes("教育") || combined.includes("院校") || combined.includes("课程")) {
      return ["岗位实训课件导入", "工程虚拟仿真演练", "实操技能考评认证"];
    }
    if (combined.includes("咨询") || combined.includes("深化") || combined.includes("设计")) {
      return ["全专业碰撞排查", "机电管线净高优化", "深化成果轻量交付"];
    }
    if (combined.includes("监管") || combined.includes("政府")) {
      return ["区域数据规范映射", "监管指标穿透核查", "预警事项督办闭环"];
    }
    return ["方案规划与配置", "协同编排与落地", "成果沉淀与复用"];
  }

  const scenarioMeta = [
    { icon: "building", tag: "房建与公建重点工程" },
    { icon: "airport", tag: "民航机场与综合枢纽" },
    { icon: "rail", tag: "轨道交通与铁路干线" },
    { icon: "water", tag: "水利水务与地下隧洞" },
    { icon: "bridge", tag: "市政路桥与立交管廊" },
    { icon: "campus", tag: "园区资产与智慧运维" },
    { icon: "energy", tag: "能源电力与工业基建" },
    { icon: "education", tag: "高校院校实训基地" }
  ];

  const capMeta = [
    { icon: "cpu", tag: "CORE ENGINE" },
    { icon: "layers", tag: "DATA PIPELINE" },
    { icon: "cube", tag: "SPATIAL 3D" },
    { icon: "shield", tag: "SECURITY AUTH" },
    { icon: "workflow", tag: "WORKFLOW DSL" },
    { icon: "chart", tag: "REALTIME TELEMETRY" },
    { icon: "sparkle", tag: "AI VISION" },
    { icon: "campus", tag: "MULTI-TENANT" }
  ];

  const painMeta = [
    { tag: "BOTTLENECK 01 · 协同断层" },
    { tag: "BOTTLENECK 02 · 穿透困难" },
    { tag: "BOTTLENECK 03 · 数据孤岛" },
    { tag: "BOTTLENECK 04 · 资产流失" },
    { tag: "BOTTLENECK 05 · 响应滞后" },
    { tag: "BOTTLENECK 06 · 标准缺失" }
  ];

  container.innerHTML = items
    .map((item, index) => {
      const title = Array.isArray(item) ? item[0] : item.title || item.name || item;
      const text = Array.isArray(item) ? item[1] : item.text || item.description || "";
      const count = String(index + 1).padStart(2, "0");

      if (mode === "deliverables") {
        const docFormats = [".IFC / BIM", ".RVT / DWG", ".JSON / DSL", ".PDF 交付报告", ".API 接口", ".SQL 数据中台", ".MP4 4D模拟", ".ZIP 资产包"];
        const formatTag = docFormats[index % docFormats.length];
        return `
          <div class="deliverable-item-card">
            <div class="deliverable-icon-box">
              ${getSvg("cube", 18, "#34d399")}
            </div>
            <div style="flex: 1; min-width: 0;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
                <span style="font-family: var(--font-mono); font-size: 0.6875rem; color: #34d399; letter-spacing: 0.08em;">DELIVERABLE · ${count}</span>
                <span class="deliverable-format-tag">${formatTag}</span>
              </div>
              <div class="deliverable-title">${escapeHtml(title)}</div>
            </div>
            <span class="deliverable-check-icon">${getSvg("check", 14, "#34d399")}</span>
          </div>
        `;
      }

      if (mode === "values") {
        if (index === 0) {
          // Asymmetric Spotlight Card for First Value with Real Telemetry & Progress Meters
          return `
            <div class="bento-spotlight-card">
              <div class="spotlight-header-bar">
                <div class="spotlight-tag-group">
                  <span class="spotlight-tag">${getSvg("sparkle", 13, "var(--cyan-400)")} CORE VALUE SPOTLIGHT</span>
                  <span class="spotlight-badge">关键架构突破</span>
                </div>
                <div class="spotlight-status-live">
                  <span class="status-pulse"></span>
                  <span>100% 同源贯通</span>
                </div>
              </div>
              <h3 class="spotlight-title">${escapeHtml(title)}</h3>
              <p class="spotlight-desc">${escapeHtml(text)}</p>
              
              <!-- 真实架构指标遥测进度槽 -->
              <div class="spotlight-telemetry-panel">
                <div class="spotlight-metric-row">
                  <div class="spotlight-metric-info">
                    <span>全生命周期数据一致性</span>
                    <strong style="color: #38bdf8; font-family: var(--font-number); font-weight: 800; font-feature-settings: 'tnum' 1; font-variant-numeric: tabular-nums;">100.0%</strong>
                  </div>
                  <div class="spotlight-bar-track"><div class="spotlight-bar-fill" style="width: 100%;"></div></div>
                </div>
                <div class="spotlight-metric-row">
                  <div class="spotlight-metric-info">
                    <span>DSL 实时编排解析延迟</span>
                    <strong style="color: #34d399; font-family: var(--font-number); font-weight: 800; font-feature-settings: 'tnum' 1; font-variant-numeric: tabular-nums;">&lt; 8ms</strong>
                  </div>
                  <div class="spotlight-bar-track"><div class="spotlight-bar-fill" style="width: 96%; background: linear-gradient(90deg, #38bdf8, #34d399);"></div></div>
                </div>
              </div>

              <div class="spotlight-footer-meta">
                <span class="meta-indicator">${getSvg("shield", 13, "#38bdf8")} 企业级物理/网络隔离</span>
                <span class="meta-indicator">${getSvg("cpu", 13, "#818cf8")} 原生 WebGPU 硬件加速</span>
                <span class="meta-tag">BIMCC ARCHITECTURE V8</span>
              </div>
            </div>
          `;
        }
        return `
          <div class="bento-metric-card">
            <div class="card-top-bar">
              <div class="card-top-bar-left">
                <span class="card-icon-box card-icon-cyan">
                  ${getSvg("layers", 13, "var(--cyan-400)")}
                </span>
                <span class="card-num-badge">PILLAR ${count}</span>
              </div>
              <span class="card-status-dot"></span>
            </div>
            <h3 class="card-heading">${escapeHtml(title)}</h3>
            <p class="card-body-text">${escapeHtml(text)}</p>
          </div>
        `;
      }

      if (mode === "capabilities") {
        const meta = capMeta[index % capMeta.length];
        return `
          <div class="capability-item-card">
            <div class="capability-top-bar">
              <div class="capability-tag-wrapper">
                <span class="capability-icon-square">${getSvg(meta.icon, 14, "var(--indigo-400)")}</span>
                <span class="capability-domain-tag">${meta.tag}</span>
              </div>
              <span class="capability-code-badge">${count}</span>
            </div>
            <h3 class="capability-heading">${escapeHtml(title)}</h3>
            <p class="capability-body-text">${escapeHtml(text)}</p>
            <div class="capability-footer-bar">
              <span class="capability-check-pill">${getSvg("check", 12, "#34d399")} 生产环境已验证</span>
              <span style="font-size: 0.6875rem; color: var(--text-muted); font-family: var(--font-mono);">BIMCC RUNTIME</span>
            </div>
          </div>
        `;
      }

      if (mode === "scenarios") {
        const meta = scenarioMeta[index % scenarioMeta.length];
        const steps = getScenarioWorkflowSteps(title, meta.tag, item);
        return `
          <div class="scenario-showcase-card">
            <div class="scenario-badge-bar">
              <div class="scenario-pill-group">
                <span class="scenario-icon-box">${getSvg(meta.icon, 14, "#38bdf8")}</span>
                <span class="scenario-category-pill">${meta.tag}</span>
              </div>
              <span class="scenario-order-num">SCN-${count}</span>
            </div>
            <h3 class="scenario-heading">${escapeHtml(title)}</h3>
            <p class="scenario-body-text">${escapeHtml(text)}</p>
            
            <!-- 场景专属 3 阶业务全流程流水线 -->
            <div class="scenario-workflow-track">
              ${steps
                .map(
                  (st, i) => `
                <div class="workflow-step ${i === 0 ? "active" : ""}">
                  <span class="step-dot"></span>
                  <span>0${i + 1} ${escapeHtml(st)}</span>
                </div>
                ${i < steps.length - 1 ? `<span class="step-arrow">${getSvg("arrowRight", 10, "var(--text-muted)")}</span>` : ""}
              `
                )
                .join("")}
            </div>
          </div>
        `;
      }

      if (mode === "pain") {
        const meta = painMeta[index % painMeta.length];
        return `
          <div class="pain-item-card">
            <div class="pain-top-bar">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="color: #fb7185;">${getSvg("alert", 15, "#fb7185")}</span>
                <span class="pain-warn-badge">${meta.tag}</span>
              </div>
              <span class="pain-pulse-dot"></span>
            </div>
            <h3 class="pain-heading">${escapeHtml(title)}</h3>
            <p class="pain-body-text">${escapeHtml(text)}</p>
          </div>
        `;
      }

      if (mode === "plan") {
        return `
          <div class="plan-phase-card">
            <div class="plan-phase-step">
              <span class="plan-step-pill">${getSvg("workflow", 12, "var(--cyan-400)")} STAGE ${count}</span>
              <span class="plan-step-line"></span>
            </div>
            <h3 class="plan-heading">${escapeHtml(title)}</h3>
            <p class="plan-body-text">${escapeHtml(text)}</p>
          </div>
        `;
      }

      return `
        <div class="feature-item-card">
          <div class="card-top-bar">
            <span class="card-num-badge">${count}</span>
            <span class="card-status-dot"></span>
          </div>
          <h3 class="card-heading">${escapeHtml(title)}</h3>
          <p class="card-body-text">${escapeHtml(text)}</p>
        </div>
      `;
    })
    .join("");
}

function renderKeyValueCards(root, selector, items = []) {
  const container = root.querySelector(selector);
  if (!container) return;

  container.innerHTML = items
    .map(([label, value]) => {
      return `
        <div class="deliverable-item-card">
          <div style="font-family: var(--font-mono); font-size: 0.8125rem; color: var(--cyan-400); font-weight: 700;">${escapeHtml(label)}</div>
          <strong style="color: #ffffff; font-size: 0.9375rem;">${escapeHtml(value)}</strong>
        </div>
      `;
    })
    .join("");
}

function markCurrentDetailLinks(root, selector, slug) {
  root.querySelectorAll(selector).forEach((link) => {
    const targetSlug = link.dataset.productLink || link.dataset.solutionLink;
    const isGroupedIndustry = link.dataset.solutionLink === "industry" && slug.startsWith("industry-");
    const isActive = targetSlug === slug || isGroupedIndustry;
    link.classList.toggle("is-active", isActive);
    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

function hydrateProductDetail() {
  const root = document.querySelector("[data-product-field]");
  if (!root) return;

  const slug = getSlug("fyra");
  if (slug === "ai-shift-meeting" || slug === "ai-pre-shift-meeting") {
    window.location.replace("ai-pre-shift-meeting.html");
    return;
  }
  const data = productPages[slug] || productPages.fyra;
  document.title = `${data.title} - 筑云科技 BIMCC`;

  setField(document, '[data-product-field="title"]', data.title);
  setField(document, '[data-product-field="summary"]', data.summary);
  setField(document, '[data-product-field="primaryCta"]', data.primaryCta);
  setField(document, '[data-product-field="caption"]', data.caption);
  setField(document, '[data-product-field="valueTitle"]', data.valueTitle);
  setField(document, '[data-product-field="valueIntro"]', data.valueIntro);
  setField(document, '[data-product-field="capabilityTitle"]', data.capabilityTitle || "核心能力模块");
  setField(document, '[data-product-field="capabilityIntro"]', data.capabilityIntro || "围绕平台建设、现场应用和长期运营组织产品能力。");
  setField(document, '[data-product-field="scenarioTitle"]', data.scenarioTitle || "典型应用场景");
  setField(document, '[data-product-field="scenarioIntro"]', data.scenarioIntro || "面向不同组织角色、工程类型和项目阶段快速落地。");
  setField(document, '[data-product-field="deliverableTitle"]', data.deliverableTitle || "可交付内容");
  setField(document, '[data-product-field="deliverableIntro"]', data.deliverableIntro || "以平台、数据、流程、培训和运营机制作为交付结果。");
  setField(document, '[data-product-field="relatedTitle"]', data.relatedTitle);
  setField(document, '[data-product-field="relatedIntro"]', data.relatedIntro);
  setSignals(document, "product", data.signals);
  markCurrentDetailLinks(document, "[data-product-link]", slug);

  const image = document.querySelector('[data-product-field="image"]');
  if (image) {
    image.src = data.image;
    image.alt = `${data.title}视觉展示`;
  }

  renderCards(document, '[data-product-list="values"]', data.values, "values");
  renderCards(document, '[data-product-list="capabilities"]', data.capabilities, "capabilities");
  renderCards(document, '[data-product-list="scenarios"]', data.scenarios, "scenarios");
  renderCards(document, '[data-product-list="deliverables"]', data.deliverables, "deliverables");

  // Render 4 Highly-Differentiated Hero Layout Archetypes per Product Slug
  renderDynamicProductHero(slug, data);

  // 初始化技术规格与交付控制台 (默认选中 private 信创私有化模式)
  if (typeof window.selectDeployMode === "function") {
    window.selectDeployMode("private");
  }
}

function getProductHeroTags(slug) {
  const tagMap = {
    'leitu': [
      { text: 'GNSS 厘米级差分定位', color: 'var(--cyan-400)', bg: 'rgba(56,189,248,0.1)', border: 'rgba(56,189,248,0.25)' },
      { text: '夯击能/夯沉量自动计量', color: '#818cf8', bg: 'rgba(129,140,248,0.1)', border: 'rgba(129,140,248,0.25)' },
      { text: '压实等值线实时渲染', color: '#34d399', bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.25)' },
      { text: '机械台班怠速精准识别', color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.25)' }
    ],
    'smart-site': [
      { text: 'AI 视频隐患秒级抓拍', color: 'var(--cyan-400)', bg: 'rgba(56,189,248,0.1)', border: 'rgba(56,189,248,0.25)' },
      { text: '塔吊群防碰撞力矩遥测', color: '#818cf8', bg: 'rgba(129,140,248,0.1)', border: 'rgba(129,140,248,0.25)' },
      { text: '人员环境全要素闭环', color: '#34d399', bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.25)' }
    ],
    'bim-consulting': [
      { text: '全专业施工图管综深化', color: 'var(--cyan-400)', bg: 'rgba(56,189,248,0.1)', border: 'rgba(56,189,248,0.25)' },
      { text: '4D 施工模拟与工法交底', color: '#818cf8', bg: 'rgba(129,140,248,0.1)', border: 'rgba(129,140,248,0.25)' },
      { text: '全生命周期一模到底交付', color: '#34d399', bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.25)' }
    ],
    'engineering-tech': [
      { text: '全专业正向深度建模', color: 'var(--cyan-400)', bg: 'rgba(56,189,248,0.1)', border: 'rgba(56,189,248,0.25)' },
      { text: '航测倾斜摄影与激光扫描', color: '#818cf8', bg: 'rgba(129,140,248,0.1)', border: 'rgba(129,140,248,0.25)' },
      { text: '激光点云实模精准对比', color: '#34d399', bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.25)' },
      { text: '构件库标准化资产沉淀', color: '#c084fc', bg: 'rgba(192,132,252,0.1)', border: 'rgba(192,132,252,0.25)' }
    ],
    'bimcc-platform': [
      { text: '1000万+ 构件秒开', color: 'var(--cyan-400)', bg: 'rgba(56,189,248,0.1)', border: 'rgba(56,189,248,0.25)' },
      { text: '4D 进度与成本动态穿透', color: '#818cf8', bg: 'rgba(129,140,248,0.1)', border: 'rgba(129,140,248,0.25)' },
      { text: '信创国产环境 100% 适配', color: '#34d399', bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.25)' }
    ],
    'digital-twin': [
      { text: '3DGS 厘米级高斯辐射', color: 'var(--cyan-400)', bg: 'rgba(56,189,248,0.1)', border: 'rgba(56,189,248,0.25)' },
      { text: '水动力物理管网模拟', color: '#818cf8', bg: 'rgba(129,140,248,0.1)', border: 'rgba(129,140,248,0.25)' },
      { text: '设备故障 MTBF +42%', color: '#34d399', bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.25)' }
    ]
  };
  const tags = tagMap[slug] || [];
  if (!tags.length) return '';
  return `
    <div style="display: flex; flex-wrap: wrap; gap: 10px;">
      ${tags.map(t => `
        <span style="font-size: 0.75rem; font-family: var(--font-mono); color: ${t.color}; background: ${t.bg}; border: 1px solid ${t.border}; padding: 4px 10px; border-radius: 4px; display: inline-flex; align-items: center; gap: 6px; white-space: nowrap;">
          ${getSvg('check', 12, t.color)} ${t.text}
        </span>
      `).join('')}
    </div>
  `;
}

function renderDynamicProductHero(slug, data) {
  const container = document.getElementById('productHeroContainer');
  if (!container) return;

  if (slug === 'leitu') {
    // Archetype 0: Earthwork Telemetry Deck (累土智控土石方数字化管控平台)
    container.innerHTML = `
      <div class="hero-grid" style="align-items: center; gap: 40px;">
        <div class="hero-content">
          <div class="eyebrow-badge"><span class="status-pulse"></span>EARTHWORK DIGITAL TELEMETRY · LEITU OS</div>
          <h1 class="hero-title" style="font-size: 40px; line-height: 1.35; margin-bottom: 16px;">${escapeHtml(data.title)}</h1>
          <p class="hero-description" style="font-weight: 400; line-height: 1.65; letter-spacing: 0.02em; margin-bottom: 24px;">${escapeHtml(data.summary)}</p>
          <div class="hero-actions" style="margin-bottom: 28px;">
            <a class="button button-primary header-cta-btn" href="contact.html">预约演示</a>
          </div>
          ${getProductHeroTags(slug)}
        </div>
        <div class="spatial-hud-box">
          <div class="lod-tabs-strip">
            <button class="lod-tab-btn active" type="button">强夯精控</button>
            <button class="lod-tab-btn" type="button">连续压实</button>
            <button class="lod-tab-btn" type="button">智能摊铺</button>
            <button class="lod-tab-btn" type="button">调运工效</button>
          </div>
          <div class="spatial-hero-metric-card" style="padding: 24px 28px 18px;">
            <div class="hero-num-tag" style="font-size: 0.6875rem; color: var(--cyan-400); margin-bottom: 6px; letter-spacing: 0.08em;">
              [RTK-GNSS DIFFERENTIAL TELEMETRY · LEITU ACTIVE]
            </div>
            <div class="spatial-hero-val" style="font-size: 2.3rem; font-weight: 800; letter-spacing: 0;">386,400 <span style="font-size: 1.1rem; font-weight: 500; color: #94a3b8;">m³</span></div>
            <div class="spatial-hero-lbl" style="font-size: 0.8125rem; color: #94a3b8; margin-top: 4px;">土石方智能计量 · 强夯/压实/摊铺全闭环监测</div>
            <div class="spatial-sub-pill" style="margin-top: 14px; font-size: 0.75rem; color: #cbd5e1; display: inline-flex; align-items: center; gap: 8px; background: rgba(56, 189, 248, 0.08); padding: 5px 12px; border-radius: 9999px; border: 1px solid rgba(56, 189, 248, 0.2);">
              <span class="status-pulse" style="background: #34d399;"></span> 84 台机械在线 · 强夯定位 &lt; 3cm · 压实合格率 99.6%
            </div>
          </div>
          <div class="spatial-telemetry-grid">
            <div class="spatial-stat-card">
              <span class="spatial-stat-val" style="font-size: 1.25rem; font-weight: 800; letter-spacing: 0;">&lt; 3 cm</span>
              <span class="spatial-stat-lbl">强夯放样误差</span>
            </div>
            <div class="spatial-stat-card">
              <span class="spatial-stat-val" style="font-size: 1.25rem; font-weight: 800; letter-spacing: 0; color: #34d399;">99.6%</span>
              <span class="spatial-stat-lbl">连续压实合格率</span>
            </div>
            <div class="spatial-stat-card">
              <span class="spatial-stat-val" style="font-size: 1.25rem; font-weight: 800; letter-spacing: 0; color: #38bdf8;">-18.5%</span>
              <span class="spatial-stat-lbl">综合燃油消耗</span>
            </div>
          </div>
        </div>
      </div>
    `;
  } else if (slug === 'fyra') {
    // Archetype 1: Center-Stage Visual Flow Workspace (飞椽数字底座)
    container.innerHTML = `
      <div class="product-hero-center">
        <div class="eyebrow-badge"><span class="status-pulse"></span>PRODUCT FOUNDATION · BIM+GIS &amp; LOW-CODE ENGINE</div>
        <h1 class="hero-title" style="font-size: 40px; line-height: 1.35; margin-bottom: 16px;">${escapeHtml(data.title)}</h1>
        <p class="hero-description" style="font-weight: 400; line-height: 1.65; letter-spacing: 0.02em; max-width: 760px; margin: 0 auto 28px;">${escapeHtml(data.summary)}</p>
        <div class="hero-actions" style="justify-content: center; margin-bottom: 36px;">
          <a class="button button-primary header-cta-btn" href="contact.html">预约演示</a>
        </div>
        <div class="wide-canvas-board">
          <div class="canvas-header-bar">
            <span class="canvas-tag">FYRA DIGITAL FOUNDATION</span>
            <div class="canvas-metrics-inline">
              <span>BIMGIS 空间实体: <span class="hero-num-metric">1000万+</span></span>
              <span>DSL 实时渲染: <span class="hero-num-metric">&lt;8ms</span></span>
              <span>多协议物联接入: <span class="hero-num-metric">100%</span></span>
            </div>
          </div>
          <div class="canvas-flow-track" id="heroDynamicTrack">
            <div class="canvas-node-card">
              <div class="hero-num-tag" style="font-size: 0.6875rem; color: var(--cyan-400); margin-bottom: 4px;">01 SPATIAL BASE</div>
              <div style="font-weight: 700; color: #fff; margin-bottom: 4px;">BIM+GIS 空间时空底座</div>
              <div style="font-size: 0.75rem; color: var(--text-muted); white-space: nowrap;">大场景地理时空 · 构件语义解析</div>
            </div>
            <div class="canvas-node-card active-engine">
              <div class="hero-num-tag" style="font-size: 0.6875rem; color: var(--cyan-400); margin-bottom: 4px;">02 ZERO-CODE ENGINE</div>
              <div style="font-weight: 700; color: #fff; margin-bottom: 4px;">飞椽可视化编排底座</div>
              <div style="font-size: 0.75rem; color: var(--text-secondary); white-space: nowrap;">DSL 实时解析渲染 <span class="hero-num-metric">&lt; 8ms</span></div>
            </div>
            <div class="canvas-node-card">
              <div class="hero-num-tag" style="font-size: 0.6875rem; color: #c084fc; margin-bottom: 4px;">03 APPS &amp; AGENTS</div>
              <div style="font-weight: 700; color: #fff; margin-bottom: 4px;">建造应用与 AI 智能体</div>
              <div style="font-size: 0.75rem; color: var(--text-muted); white-space: nowrap;">赋能 BIMCC · 累土 · 智慧工地</div>
            </div>
          </div>
        </div>
      </div>
    `;
  } else if (slug === 'bimcc-platform') {
    // Archetype 2A: 3D Spatial Hologram & LOD Dial HUD (BIMCC 智能建造平台)
    container.innerHTML = `
      <div class="hero-grid" style="align-items: center; gap: 40px;">
        <div class="hero-content">
          <div class="eyebrow-badge"><span class="status-pulse"></span>3D SPATIAL ENGINE · BIMCC</div>
          <h1 class="hero-title" style="font-size: 40px; line-height: 1.35; margin-bottom: 16px;">${escapeHtml(data.title)}</h1>
          <p class="hero-description" style="font-weight: 400; line-height: 1.65; letter-spacing: 0.02em; margin-bottom: 24px;">${escapeHtml(data.summary)}</p>
          <div class="hero-actions" style="margin-bottom: 28px;">
            <a class="button button-primary header-cta-btn" href="contact.html">预约演示</a>
          </div>
          ${getProductHeroTags(slug)}
        </div>
        <div class="spatial-hud-box">
          <div class="lod-tabs-strip">
            <button class="lod-tab-btn active" type="button">LOD 100 概念</button>
            <button class="lod-tab-btn" type="button">LOD 300 深化</button>
            <button class="lod-tab-btn" type="button">LOD 400 制造</button>
            <button class="lod-tab-btn" type="button">LOD 500 运维</button>
          </div>
          <div class="spatial-hero-metric-card" style="padding: 24px 28px 18px;">
            <div class="hero-num-tag" style="font-size: 0.6875rem; color: var(--cyan-400); margin-bottom: 6px; letter-spacing: 0.08em;">
              [WebGPU ACCELERATED · NATIVE CORE]
            </div>
            <div class="spatial-hero-val" style="font-size: 2.3rem; font-weight: 800; letter-spacing: 0;">14,280,000</div>
            <div class="spatial-hero-lbl" style="font-size: 0.8125rem; color: #94a3b8; margin-top: 4px;">空间实体构件 · LOD 自动逐级退化 · 毫秒级空间检索</div>
            <div class="spatial-sub-pill" style="margin-top: 14px; font-size: 0.75rem; color: #cbd5e1; display: inline-flex; align-items: center; gap: 8px; background: rgba(56, 189, 248, 0.08); padding: 5px 12px; border-radius: 9999px; border: 1px solid rgba(56, 189, 248, 0.2);">
              <span class="status-pulse" style="background: #34d399;"></span> 渲染帧率 60.0 fps (锁定) · 延迟 &lt; 16ms
            </div>
          </div>
          <div class="spatial-telemetry-grid">
            <div class="spatial-stat-card">
              <span class="spatial-stat-val" style="font-size: 1.25rem; font-weight: 800; letter-spacing: 0;">48 次/帧</span>
              <span class="spatial-stat-lbl">渲染批次 DRAWCALLS</span>
            </div>
            <div class="spatial-stat-card">
              <span class="spatial-stat-val" style="font-size: 1.25rem; font-weight: 800; letter-spacing: 0; color: #34d399;">14.28 M</span>
              <span class="spatial-stat-lbl">三角面片 TRIANGLES</span>
            </div>
            <div class="spatial-stat-card">
              <span class="spatial-stat-val" style="font-size: 1.25rem; font-weight: 800; letter-spacing: 0; color: #38bdf8;">184 MB</span>
              <span class="spatial-stat-lbl">显存占用 VRAM</span>
            </div>
          </div>
        </div>
      </div>
    `;
  } else if (slug === 'digital-twin') {
    // Archetype 2B: IoT & Digital Twin Operations HUD (数字孪生与智慧运维)
    container.innerHTML = `
      <div class="hero-grid" style="align-items: center; gap: 40px;">
        <div class="hero-content">
          <div class="eyebrow-badge"><span class="status-pulse"></span>SPATIAL TWIN &amp; IOT OPS</div>
          <h1 class="hero-title" style="font-size: 40px; line-height: 1.35; margin-bottom: 16px;">${escapeHtml(data.title)}</h1>
          <p class="hero-description" style="font-weight: 400; line-height: 1.65; letter-spacing: 0.02em; margin-bottom: 24px;">${escapeHtml(data.summary)}</p>
          <div class="hero-actions" style="margin-bottom: 28px;">
            <a class="button button-primary header-cta-btn" href="contact.html">预约演示</a>
          </div>
          <div style="display: flex; flex-wrap: wrap; gap: 10px;">
            <span style="font-size: 0.75rem; font-family: var(--font-mono); color: var(--cyan-400); background: rgba(56,189,248,0.1); border: 1px solid rgba(56,189,248,0.25); padding: 4px 10px; border-radius: 4px; display: inline-flex; align-items: center; gap: 6px; white-space: nowrap;">
              ${getSvg('check', 12, 'var(--cyan-400)')} 3DGS 厘米级高斯辐射
            </span>
            <span style="font-size: 0.75rem; font-family: var(--font-mono); color: #818cf8; background: rgba(129,140,248,0.1); border: 1px solid rgba(129,140,248,0.25); padding: 4px 10px; border-radius: 4px; display: inline-flex; align-items: center; gap: 6px; white-space: nowrap;">
              ${getSvg('check', 12, '#818cf8')} 水动力物理管网模拟
            </span>
            <span style="font-size: 0.75rem; font-family: var(--font-mono); color: #34d399; background: rgba(52,211,153,0.1); border: 1px solid rgba(52,211,153,0.25); padding: 4px 10px; border-radius: 4px; display: inline-flex; align-items: center; gap: 6px; white-space: nowrap;">
              ${getSvg('check', 12, '#34d399')} 设备故障 MTBF +42%
            </span>
          </div>
        </div>
        <div class="spatial-hud-box">
          <div class="lod-tabs-strip">
            <button class="lod-tab-btn active" type="button">空间一张图</button>
            <button class="lod-tab-btn" type="button">设备台账</button>
            <button class="lod-tab-btn" type="button">物联遥测</button>
            <button class="lod-tab-btn" type="button">工单闭环</button>
          </div>
          <div class="spatial-hero-metric-card" style="padding: 24px 28px 18px;">
            <div class="hero-num-tag" style="font-size: 0.6875rem; color: var(--cyan-400); margin-bottom: 6px; letter-spacing: 0.08em;">
              [REAL-TIME SPATIAL TWIN &amp; IOT TELEMETRY]
            </div>
            <div class="spatial-hero-val" style="font-size: 2.3rem; font-weight: 800; letter-spacing: 0;">38,420 <span style="font-size: 1.1rem; font-weight: 500; color: #94a3b8;">点位</span></div>
            <div class="spatial-hero-lbl" style="font-size: 0.8125rem; color: #94a3b8; margin-top: 4px;">物联网遥测点位在线 · 机电设备工况数字孪生感知</div>
            <div class="spatial-sub-pill" style="margin-top: 14px; font-size: 0.75rem; color: #cbd5e1; display: inline-flex; align-items: center; gap: 8px; background: rgba(56, 189, 248, 0.08); padding: 5px 12px; border-radius: 9999px; border: 1px solid rgba(56, 189, 248, 0.2);">
              <span class="status-pulse" style="background: #34d399;"></span> 态势更新 100ms · 故障预测准确率 98.4%
            </div>
          </div>
          <div class="spatial-telemetry-grid">
            <div class="spatial-stat-card">
              <span class="spatial-stat-val" style="font-size: 1.25rem; font-weight: 800; letter-spacing: 0;">99.98%</span>
              <span class="spatial-stat-lbl">系统可用性 SLA</span>
            </div>
            <div class="spatial-stat-card">
              <span class="spatial-stat-val" style="font-size: 1.25rem; font-weight: 800; letter-spacing: 0; color: #34d399;">&lt; 850 ms</span>
              <span class="spatial-stat-lbl">管网水动力仿真</span>
            </div>
            <div class="spatial-stat-card">
              <span class="spatial-stat-val" style="font-size: 1.25rem; font-weight: 800; letter-spacing: 0; color: #38bdf8;">+42.6%</span>
              <span class="spatial-stat-lbl">设备平均无故障 MTBF</span>
            </div>
          </div>
        </div>
      </div>
    `;
  } else if (slug === 'smart-site') {
    // Archetype 3: 2x2 Bento Smart Perception Grid (智慧工地)
    container.innerHTML = `
      <div class="hero-grid" style="align-items: center; gap: 40px;">
        <div class="hero-content">
          <div class="eyebrow-badge"><span class="status-pulse"></span>SMART JOBSITE · EDGE AI</div>
          <h1 class="hero-title" style="font-size: 40px; line-height: 1.35; margin-bottom: 16px;">${escapeHtml(data.title)}</h1>
          <p class="hero-description" style="font-weight: 400; line-height: 1.65; letter-spacing: 0.02em; margin-bottom: 24px;">${escapeHtml(data.summary)}</p>
          <div class="hero-actions" style="margin-bottom: 28px;">
            <a class="button button-primary header-cta-btn" href="contact.html">预约演示</a>
          </div>
          ${getProductHeroTags(slug)}
        </div>
        <div class="bento-perception-grid">
          <div class="bento-perception-card">
            <div class="bento-perception-header">
              <span class="bento-hud-tag hero-num-tag">01 视觉中枢</span>
              <span class="bento-hud-metric" style="font-size: 1.15rem; font-weight: 800; letter-spacing: 0;">&lt; 0.3s</span>
            </div>
            <div style="font-weight: 700; color: #fff; margin-bottom: 4px;">AI 隐患抓拍引擎</div>
            <div style="font-size: 0.75rem; color: var(--text-secondary); line-height: 1.5;">未佩戴安全帽 · 临边越界 · 烟火违规毫秒级识别</div>
          </div>
          <div class="bento-perception-card">
            <div class="bento-perception-header">
              <span class="bento-hud-tag hero-num-tag" style="color: #818cf8;">02 特种设备</span>
              <span class="bento-hud-metric" style="font-size: 1.15rem; font-weight: 800; letter-spacing: 0; color: #818cf8;">100% 覆盖</span>
            </div>
            <div style="font-weight: 700; color: #fff; margin-bottom: 4px;">塔吊群防碰撞系统</div>
            <div style="font-size: 0.75rem; color: var(--text-secondary); line-height: 1.5;">多机回转防撞 · 倾角力矩遥测 · 升降机限载自动切断</div>
          </div>
          <div class="bento-perception-card">
            <div class="bento-perception-header">
              <span class="bento-hud-tag hero-num-tag" style="color: #34d399;">03 环境监测</span>
              <span class="bento-hud-metric" style="font-size: 1.15rem; font-weight: 800; letter-spacing: 0; color: #34d399;">24h 联动</span>
            </div>
            <div style="font-weight: 700; color: #fff; margin-bottom: 4px;">微气象与智能喷淋</div>
            <div style="font-size: 0.75rem; color: var(--text-secondary); line-height: 1.5;">扬尘 PM2.5/PM10 动态超标自启雾炮与围挡喷淋</div>
          </div>
          <div class="bento-perception-card">
            <div class="bento-perception-header">
              <span class="bento-hud-tag hero-num-tag" style="color: #c084fc;">04 劳务实名</span>
              <span class="bento-hud-metric" style="font-size: 1.15rem; font-weight: 800; letter-spacing: 0; color: #c084fc;">分账 100%</span>
            </div>
            <div style="font-weight: 700; color: #fff; margin-bottom: 4px;">住建监管数据贯通</div>
            <div style="font-size: 0.75rem; color: var(--text-secondary); line-height: 1.5;">人员人脸闸机考勤 · 工人工资分账专户直连穿透</div>
          </div>
        </div>
      </div>
    `;
  } else if (slug === 'engineering-tech' || slug === 'engineering-modeling') {
    // Archetype 5: 3D Modeling & Reverse BIM Deck (工程建模)
    container.innerHTML = `
      <div class="hero-grid" style="align-items: center; gap: 40px;">
        <div class="hero-content">
          <div class="eyebrow-badge"><span class="status-pulse"></span>ENGINEERING 3D MODELING &amp; ASSETS</div>
          <h1 class="hero-title" style="font-size: 40px; line-height: 1.35; margin-bottom: 16px;">${escapeHtml(data.title)}</h1>
          <p class="hero-description" style="font-weight: 400; line-height: 1.65; letter-spacing: 0.02em; margin-bottom: 24px;">${escapeHtml(data.summary)}</p>
          <div class="hero-actions" style="margin-bottom: 28px;">
            <a class="button button-primary header-cta-btn" href="contact.html">预约演示</a>
          </div>
          ${getProductHeroTags('engineering-tech')}
        </div>
        <div class="drone-telemetry-deck">
          <div class="drone-telemetry-hud">
            <div class="drone-coords-row">
              <span>[ENGINEERING MODELING &amp; LIDAR]</span>
              <span>LOD 400 · 误差 &lt; 2mm · 倾斜摄影 1.2cm/px</span>
            </div>
            <div class="drone-main-stat" style="font-size: 2.2rem; font-weight: 800; letter-spacing: 0;">3,680,000 <span style="font-size: 1.1rem; font-weight: 500; color: #94a3b8;">构件</span></div>
            <div class="drone-sub-desc">全专业正向深化建模 · 空间冲突管综 100% 碰撞清零</div>
            <div class="drone-chips-flex">
              <span class="drone-chip"><span class="status-pulse" style="background:#34d399;"></span> 倾斜摄影正射重建</span>
              <span class="drone-chip">机电管线综合深化</span>
              <span class="drone-chip">轻量化压缩率 92%</span>
            </div>
          </div>
          <div class="drone-kpi-grid">
            <div class="drone-kpi-cell">
              <span class="drone-kpi-val" style="font-size: 1.25rem; font-weight: 800; letter-spacing: 0;">45,000+</span>
              <span class="drone-kpi-lbl">标准构件库资产</span>
            </div>
            <div class="drone-kpi-cell">
              <span class="drone-kpi-val" style="font-size: 1.25rem; font-weight: 800; letter-spacing: 0; color: #34d399;">100%</span>
              <span class="drone-kpi-lbl">管综碰撞清零</span>
            </div>
            <div class="drone-kpi-cell">
              <span class="drone-kpi-val" style="font-size: 1.25rem; font-weight: 800; letter-spacing: 0; color: #38bdf8;">LOD 400</span>
              <span class="drone-kpi-lbl">施工制造级深度</span>
            </div>
          </div>
        </div>
      </div>
    `;
  } else {
    // Archetype 4: Milestone Roadmap & Precision KPI Board (bim-consulting 等)
    container.innerHTML = `
      <div class="hero-grid" style="align-items: center; gap: 40px;">
        <div class="hero-content">
          <div class="eyebrow-badge"><span class="status-pulse"></span>FULL-PROCESS CONSULTING</div>
          <h1 class="hero-title" style="font-size: 40px; line-height: 1.35; margin-bottom: 16px;">${escapeHtml(data.title)}</h1>
          <p class="hero-description" style="font-weight: 400; line-height: 1.65; letter-spacing: 0.02em; margin-bottom: 24px;">${escapeHtml(data.summary)}</p>
          <div class="hero-actions" style="margin-bottom: 28px;">
            <a class="button button-primary header-cta-btn" href="contact.html">预约演示</a>
          </div>
          ${getProductHeroTags(slug)}
        </div>
        <div class="milestone-pipeline-box">
          <div class="milestone-stage-row">
            <span class="milestone-step-num">01</span>
            <div class="milestone-step-info">
              <div class="milestone-step-title">方案与合规性审查</div>
              <div class="milestone-step-desc">日照 / 净高 / 节能辅助模拟深度分析</div>
            </div>
            <span class="milestone-step-kpi">合规 100%</span>
          </div>
          <div class="milestone-stage-row">
            <span class="milestone-step-num">02</span>
            <div class="milestone-step-info">
              <div class="milestone-step-title">全专业施工图深化</div>
              <div class="milestone-step-desc">机电管综与复杂节点 100% 碰撞清零</div>
            </div>
            <span class="milestone-step-kpi">清零 100%</span>
          </div>
          <div class="milestone-stage-row">
            <span class="milestone-step-num">03</span>
            <div class="milestone-step-info">
              <div class="milestone-step-title">施工技术交底推演</div>
              <div class="milestone-step-desc">4D 施工时序模拟与复杂节点做法交底</div>
            </div>
            <span class="milestone-step-kpi">返工 0 风险</span>
          </div>
          <div class="milestone-stage-row">
            <span class="milestone-step-num">04</span>
            <div class="milestone-step-info">
              <div class="milestone-step-title">一模到底数字交付</div>
              <div class="milestone-step-desc">整理交付模型 / 图纸 / 设备台账与档案</div>
            </div>
            <span class="milestone-step-kpi">资产 100%</span>
          </div>
        </div>
      </div>
    `;
  }
}

const solutionHeroWorkbenches = {
  enterprise: {
    studioTitle: "BIMCC Enterprise Multi-Project Studio",
    badge: "集团三级中控",
    cards: [
      {
        tag: "01 总部经营",
        tagColor: "#38bdf8",
        tagBg: "rgba(56, 189, 248, 0.12)",
        borderColor: "rgba(56, 189, 248, 0.3)",
        title: "多项目产值与资金穿透",
        items: ["集团多项目经营总览大屏", "动态资金与产值精准对齐", "跨项目风险多维智能预警"]
      },
      {
        tag: "02 区域指挥",
        tagColor: "#818cf8",
        tagBg: "rgba(129, 140, 248, 0.15)",
        borderColor: "rgba(129, 140, 248, 0.35)",
        title: "进度穿透与资源统筹",
        items: ["区域关键里程碑实时穿透", "跨项目物资周转与集采协同", "企业级工法与专家智库共享"]
      },
      {
        tag: "03 基层执行",
        tagColor: "#34d399",
        tagBg: "rgba(52, 211, 153, 0.12)",
        borderColor: "rgba(52, 211, 153, 0.3)",
        title: "标准化现场数据归集",
        items: ["现场作业数据自动同源沉淀", "标准工法与构件库统一复用", "质量安全隐患穿透式督办"]
      }
    ],
    footerIcon: "building",
    footerText: "集团统管 120+ 重点工程 · 跨组织数据同源穿透",
    footerEdition: "BIMCC Enterprise Edition"
  },
  industry: {
    studioTitle: "BIMCC Multi-Sector Engineering Studio",
    badge: "8 大行业专属模板",
    cards: [
      {
        tag: "房建公建",
        tagColor: "#38bdf8",
        tagBg: "rgba(56, 189, 248, 0.12)",
        borderColor: "rgba(56, 189, 248, 0.3)",
        title: "高精管综与空间算量",
        items: ["机电综合管线 100% 碰撞清零", "清单工程量规则精准挂接", "4D 施工时序推演与工法交底"]
      },
      {
        tag: "轨交枢纽",
        tagColor: "#a78bfa",
        tagBg: "rgba(167, 139, 250, 0.15)",
        borderColor: "rgba(167, 139, 250, 0.35)",
        title: "多源 GIS + 盾构监测",
        items: ["WGS84 / CGCS2000 空间坐标融合", "盾构区间毫米级沉降监测预警", "特大地下换乘空间全景复用"]
      },
      {
        tag: "水利水务",
        tagColor: "#34d399",
        tagBg: "rgba(52, 211, 153, 0.12)",
        borderColor: "rgba(52, 211, 153, 0.3)",
        title: "三维库容流体仿真",
        items: ["物理级三维库容开挖精准分析", "堤坝渗流应力动态实时云图", "防汛排涝调度三维推演大屏"]
      }
    ],
    footerIcon: "cube",
    footerText: "50,000+ 行业标准构件族库 · 8 大工程行业即开即用",
    footerEdition: "BIMCC Industry Template"
  },
  project: {
    studioTitle: "BIMCC Single-Project Command HUD",
    badge: "项目级实时中控",
    cards: [
      {
        tag: "01 空间中枢",
        tagColor: "#38bdf8",
        tagBg: "rgba(56, 189, 248, 0.12)",
        borderColor: "rgba(56, 189, 248, 0.3)",
        title: "4D 施工时序演进推演",
        items: ["空间实体构件 LOD400 深化", "工期偏差与关键路径动态告警", "复杂施工工法 3D 动画交底"]
      },
      {
        tag: "02 现场物联",
        tagColor: "#fbbf24",
        tagBg: "rgba(251, 191, 36, 0.15)",
        borderColor: "rgba(251, 191, 36, 0.35)",
        title: "AI 边缘感知与特种设备",
        items: ["塔吊防碰撞与吊装盲区预警", "深基坑沉降位移监测 <0.1mm", "现场劳务实名制与通道联动"]
      },
      {
        tag: "03 验工计价",
        tagColor: "#34d399",
        tagBg: "rgba(52, 211, 153, 0.12)",
        borderColor: "rgba(52, 211, 153, 0.3)",
        title: "产值与进度动态穿透",
        items: ["验工计价与模型空间构件挂接", "工程变更与现场签证线上闭环", "竣工档案资料一模到底归集"]
      }
    ],
    footerIcon: "chart",
    footerText: "现场隐患闭环率 99.4% · 质量验评一次合格率 98.6%",
    footerEdition: "BIMCC Site Command Edition"
  },
  "build-client": {
    studioTitle: "BIMCC Owner Investment & Asset Engine",
    badge: "业主全过程管控",
    cards: [
      {
        tag: "01 投资穿透",
        tagColor: "#38bdf8",
        tagBg: "rgba(56, 189, 248, 0.12)",
        borderColor: "rgba(56, 189, 248, 0.3)",
        title: "概算/预算/结算三算对比",
        items: ["全合同执行动态实时穿透", "超概算指标智能拦截与预警", "资金支付计划与现场进度联动"]
      },
      {
        tag: "02 节点合规",
        tagColor: "#818cf8",
        tagBg: "rgba(129, 140, 248, 0.15)",
        borderColor: "rgba(129, 140, 248, 0.35)",
        title: "进度里程碑支付联锁",
        items: ["付款审批关联模型工程量与留痕", "变更签证多方线上快速会签", "工期延误风险责任动态穿透"]
      },
      {
        tag: "03 资产移交",
        tagColor: "#34d399",
        tagBg: "rgba(52, 211, 153, 0.12)",
        borderColor: "rgba(52, 211, 153, 0.3)",
        title: "一模到底竣工资产池",
        items: ["空间实体与图纸资料 100% 挂接", "设备台账免转换导入智慧运维", "资产档案全生命周期永久可溯"]
      }
    ],
    footerIcon: "shield",
    footerText: "投资变更失控率 0% · 竣工资产交付周期缩短 45 天",
    footerEdition: "BIMCC Owner Edition"
  },
  "build-contractor": {
    studioTitle: "BIMCC Contractor Lean Execution Studio",
    badge: "总包现场精细化",
    cards: [
      {
        tag: "01 深化设计",
        tagColor: "#38bdf8",
        tagBg: "rgba(56, 189, 248, 0.12)",
        borderColor: "rgba(56, 189, 248, 0.3)",
        title: "图纸会审与碰撞清零",
        items: ["多专业机电管线预排布深化", "复杂钢结构节点 3D 动画交底", "构件加工料单与工程量精准输出"]
      },
      {
        tag: "02 资源精控",
        tagColor: "#fb923c",
        tagBg: "rgba(251, 146, 60, 0.15)",
        borderColor: "rgba(251, 146, 60, 0.35)",
        title: "钢筋套料与物资集采",
        items: ["钢筋原材套料优化节约 3.2%", "现场用工工效与班组实时分析", "大型机械设备运行工时动态监控"]
      },
      {
        tag: "03 质安闭环",
        tagColor: "#34d399",
        tagBg: "rgba(52, 211, 153, 0.12)",
        borderColor: "rgba(52, 211, 153, 0.3)",
        title: "现场隐患随手拍与留痕",
        items: ["AI 边缘识别未戴安全帽违章", "隐患整改全流程时效 <4h 闭环", "分部分项检验批验收电子化留痕"]
      }
    ],
    footerIcon: "workflow",
    footerText: "节点返工率下降 70% · 现场综合履约合格率 99.8%",
    footerEdition: "BIMCC Contractor Edition"
  },
  "build-supervision": {
    studioTitle: "BIMCC Digital Supervision & Quality Hub",
    badge: "数字监理全流程",
    cards: [
      {
        tag: "01 旁站巡视",
        tagColor: "#38bdf8",
        tagBg: "rgba(56, 189, 248, 0.12)",
        borderColor: "rgba(56, 189, 248, 0.3)",
        title: "实景影像与关键见证",
        items: ["无人机航拍时序进度实景记录", "关键隐蔽工程实景打卡见证留痕", "数字监理日志与现场气象联动"]
      },
      {
        tag: "02 平行检验",
        tagColor: "#a78bfa",
        tagBg: "rgba(167, 139, 250, 0.15)",
        borderColor: "rgba(167, 139, 250, 0.35)",
        title: "检验批数据自动比对",
        items: ["实测实量数据自动合规校验", "质量偏差超标自动下发整改单", "材料进场复试全链条追溯管理"]
      },
      {
        tag: "03 监理月报",
        tagColor: "#34d399",
        tagBg: "rgba(52, 211, 153, 0.12)",
        borderColor: "rgba(52, 211, 153, 0.3)",
        title: "数据驱动综合评估报告",
        items: ["进度/质量/安全数据一键成报", "监理通知单全流程追溯回执", "合规审计全链条档案完整可溯"]
      }
    ],
    footerIcon: "shield",
    footerText: "监理记录留痕率 100% · 合规隐患整改闭环时效 <4h",
    footerEdition: "BIMCC Supervision Edition"
  },
  "build-regulation": {
    studioTitle: "BIMCC Regulation GIS Command Hub",
    badge: "住建全域一张图",
    cards: [
      {
        tag: "01 辖区全景",
        tagColor: "#38bdf8",
        tagBg: "rgba(56, 189, 248, 0.12)",
        borderColor: "rgba(56, 189, 248, 0.3)",
        title: "在建项目 GIS 空间底座",
        items: ["辖区在建项目空间多层级分布", "项目风险等级动态热力渲染", "重大危险源物联传感器多维监测"]
      },
      {
        tag: "02 信用评价",
        tagColor: "#fbbf24",
        tagBg: "rgba(251, 191, 36, 0.15)",
        borderColor: "rgba(251, 191, 36, 0.35)",
        title: "环保监测与发薪穿透",
        items: ["扬尘噪声 PM2.5 在线超标联动", "农民工工资专用账户发放监管", "参建主体信用分评定与公示联动"]
      },
      {
        tag: "03 联合执法",
        tagColor: "#34d399",
        tagBg: "rgba(52, 211, 153, 0.12)",
        borderColor: "rgba(52, 211, 153, 0.3)",
        title: "跨部门行政协同调度",
        items: ["隐患逾期未改自动流转执法中枢", "移动端现场协同核查与复验", "执法全过程电子化存证与通报"]
      }
    ],
    footerIcon: "building",
    footerText: "辖区重大工程纳管率 100% · 执法协同效率提升 3 倍",
    footerEdition: "BIMCC Regulation Edition"
  }
};

function getSolutionHeroTags(slug) {
  const tagMap = {
    'build-client': [
      { text: '投资进度双向对账穿透', color: 'var(--cyan-400)', bg: 'rgba(56,189,248,0.1)', border: 'rgba(56,189,248,0.25)' },
      { text: '质量安全全局预警闭环', color: '#818cf8', bg: 'rgba(129,140,248,0.1)', border: 'rgba(129,140,248,0.25)' },
      { text: '竣工档案数字资产移交', color: '#34d399', bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.25)' }
    ],
    'build-contractor': [
      { text: '全专业机电管综碰撞清零', color: '#fb923c', bg: 'rgba(251,146,60,0.1)', border: 'rgba(251,146,60,0.25)' },
      { text: '4D 施工时序演练与交底', color: 'var(--cyan-400)', bg: 'rgba(56,189,248,0.1)', border: 'rgba(56,189,248,0.25)' },
      { text: '智慧工地物联直连预警', color: '#34d399', bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.25)' }
    ],
    'build-supervision': [
      { text: '多方协同巡检电子留痕', color: '#34d399', bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.25)' },
      { text: '危大工程隐患 100% 销项', color: 'var(--cyan-400)', bg: 'rgba(56,189,248,0.1)', border: 'rgba(56,189,248,0.25)' },
      { text: '证据链合法合规归档', color: '#818cf8', bg: 'rgba(129,140,248,0.1)', border: 'rgba(129,140,248,0.25)' }
    ],
    'build-regulation': [
      { text: '辖区重大工程一张图总览', color: '#c084fc', bg: 'rgba(192,132,252,0.1)', border: 'rgba(192,132,252,0.25)' },
      { text: '多维安全风险秒级预警', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)' },
      { text: '监管数据与企业双向互通', color: '#34d399', bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.25)' }
    ],
    'enterprise': [
      { text: '集团级运营多项目驾驶舱', color: 'var(--cyan-400)', bg: 'rgba(56,189,248,0.1)', border: 'rgba(56,189,248,0.25)' },
      { text: '跨项目构件与数据资产复用', color: '#818cf8', bg: 'rgba(129,140,248,0.1)', border: 'rgba(129,140,248,0.25)' },
      { text: '零代码应用按需敏捷扩展', color: '#34d399', bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.25)' }
    ],
    'industry': [
      { text: '8 大重点行业专属工程模板', color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.25)' },
      { text: 'BIM+GIS 复杂空间高精建模', color: 'var(--cyan-400)', bg: 'rgba(56,189,248,0.1)', border: 'rgba(56,189,248,0.25)' },
      { text: '软硬件一体化实装落地交付', color: '#34d399', bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.25)' }
    ],
    'project': [
      { text: '单体重大工程现场总控', color: 'var(--cyan-400)', bg: 'rgba(56,189,248,0.1)', border: 'rgba(56,189,248,0.25)' },
      { text: 'BIM+GIS 实模一体动态渲染', color: '#818cf8', bg: 'rgba(129,140,248,0.1)', border: 'rgba(129,140,248,0.25)' },
      { text: '现场作业全要素闭环管控', color: '#34d399', bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.25)' }
    ]
  };
  const tags = tagMap[slug] || [];
  if (!tags.length) return '';
  return `
    <div style="display: flex; flex-wrap: wrap; gap: 10px;">
      ${tags.map(t => `
        <span style="font-size: 0.75rem; font-family: var(--font-mono); color: ${t.color}; background: ${t.bg}; border: 1px solid ${t.border}; padding: 4px 10px; border-radius: 4px; display: inline-flex; align-items: center; gap: 6px; white-space: nowrap;">
          ${getSvg('check', 12, t.color)} ${t.text}
        </span>
      `).join('')}
    </div>
  `;
}

function hydrateSolutionDetail() {
  const root = document.querySelector("[data-solution-field]");
  if (!root) return;

  const slug = getSlug("enterprise");
  const data = solutionPages[slug] || solutionPages.enterprise;
  document.title = `${data.title} - 筑云科技 BIMCC`;

  setField(document, '[data-solution-field="title"]', data.title);
  setField(document, '[data-solution-field="summary"]', data.summary);
  setField(document, '[data-solution-field="caption"]', data.caption);
  setField(document, '[data-solution-field="painTitle"]', data.painTitle);
  setField(document, '[data-solution-field="painIntro"]', data.painIntro);
  setField(document, '[data-solution-field="planTitle"]', data.planTitle);
  setField(document, '[data-solution-field="planIntro"]', data.planIntro);
  setField(document, '[data-solution-field="moduleTitle"]', data.moduleTitle || "关键能力模块");
  setField(document, '[data-solution-field="moduleIntro"]', data.moduleIntro || "每个模块都面向真实业务动作。");
  setField(document, '[data-solution-field="scenarioTitle"]', data.scenarioTitle || "应用场景");
  setField(document, '[data-solution-field="scenarioIntro"]', data.scenarioIntro || "对应项目阶段、组织层级和工程类型。");
  setField(document, '[data-solution-field="deliverableTitle"]', data.deliverableTitle || "交付内容");
  setField(document, '[data-solution-field="deliverableIntro"]', data.deliverableIntro || "方案最终落到系统、流程、看板和数据上。");
  setField(document, '[data-solution-field="relatedTitle"]', data.relatedTitle);
  setField(document, '[data-solution-field="relatedIntro"]', data.relatedIntro);
  setSignals(document, "solution", data.signals);
  markCurrentDetailLinks(document, "[data-solution-link]", slug);

  // Inject Micro-Capsule Hero Tags
  const tagsContainer = document.getElementById("solutionHeroTagsContainer");
  if (tagsContainer) {
    tagsContainer.innerHTML = getSolutionHeroTags(slug);
  }

  // Render Differentiated Solution Hero Studio Workbench (7 Distinct Framework Archetypes)
  const studioContainer = document.getElementById("solutionStudioContainer");
  if (studioContainer) {
    let studioHTML = '';

    if (slug === 'enterprise') {
      // Archetype 1: Executive Bento Cockpit (1 Top Wide Spotlight + 2 Bottom Columns)
      studioHTML = `
        <div class="solution-blueprint-studio">
          <div class="studio-titlebar">
            <div class="studio-traffic-lights">
              <span class="light-dot red"></span>
              <span class="light-dot yellow"></span>
              <span class="light-dot green"></span>
              <span style="margin-left: 8px; font-size: 0.75rem; color: #94a3b8; font-weight: 600; font-family: monospace;">BIMCC Enterprise Multi-Project Studio</span>
            </div>
            <div class="studio-live-badge" style="font-size: 0.6875rem;"><span class="status-pulse"></span>集团三级中控</div>
          </div>
          <div class="sol-bento-layout">
            <div class="sol-bento-top">
              <div class="sol-bento-top-head">
                <span class="blueprint-stage-tag" style="background: rgba(56,189,248,0.15); color: #38bdf8;">01 总部经营中枢</span>
                <span style="font-size: 0.6875rem; color: var(--cyan-400); font-family: var(--font-mono);">[MULTI-PROJECT REALTIME]</span>
              </div>
              <div style="font-size: 1rem; font-weight: 700; color: #fff;">120+ 重点工程综合经营大屏</div>
              <div class="sol-bento-metrics-row">
                <div class="sol-bento-metric-col">
                  <span class="sol-bento-metric-val" style="color: #38bdf8;">128</span>
                  <span class="sol-bento-metric-label">实时统管重大项目</span>
                </div>
                <div class="sol-bento-metric-col">
                  <span class="sol-bento-metric-val" style="color: #34d399;">&lt;1.2%</span>
                  <span class="sol-bento-metric-label">资金概算偏差率</span>
                </div>
                <div class="sol-bento-metric-col">
                  <span class="sol-bento-metric-val" style="color: #a78bfa;">99.4%</span>
                  <span class="sol-bento-metric-label">综合履约合规率</span>
                </div>
              </div>
            </div>
            <div class="sol-bento-bottom-grid">
              <div class="blueprint-stage-card" style="border-color: rgba(129, 140, 248, 0.3);">
                <span class="blueprint-stage-tag" style="background: rgba(129, 140, 248, 0.15); color: #818cf8;">02 区域指挥</span>
                <div class="blueprint-stage-title">进度穿透与资源统筹</div>
                <div class="blueprint-stage-item">关键里程碑实时穿透</div>
                <div class="blueprint-stage-item">跨项目物资集采协同</div>
              </div>
              <div class="blueprint-stage-card" style="border-color: rgba(52, 211, 153, 0.3);">
                <span class="blueprint-stage-tag" style="background: rgba(52, 211, 153, 0.12); color: #34d399;">03 基层执行</span>
                <div class="blueprint-stage-title">标准化数据自动归集</div>
                <div class="blueprint-stage-item">作业数据同源沉淀</div>
                <div class="blueprint-stage-item">50,000+ 构件库复用</div>
              </div>
            </div>
          </div>
          <div class="engine-studio-footer" style="background: rgba(0,0,0,0.3); padding: 12px 18px; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.06);">
            <div style="font-size: 0.75rem; color: #e2e8f0; display: flex; align-items: center; gap: 8px;">
              ${getSvg('building', 14, '#38bdf8')}
              <span>集团统管 120+ 重点工程 · 跨组织数据同源穿透</span>
            </div>
            <span style="color: var(--text-muted); font-size: 0.6875rem; font-family: monospace;">BIMCC Enterprise Edition</span>
          </div>
        </div>
      `;
    } else if (slug === 'industry') {
      // Archetype 2: Multi-Sector Engineering Blueprint Selector (Tabbed View)
      studioHTML = `
        <div class="solution-blueprint-studio">
          <div class="studio-titlebar">
            <div class="studio-traffic-lights">
              <span class="light-dot red"></span>
              <span class="light-dot yellow"></span>
              <span class="light-dot green"></span>
              <span style="margin-left: 8px; font-size: 0.75rem; color: #94a3b8; font-weight: 600; font-family: monospace;">BIMCC Multi-Sector Engineering Studio</span>
            </div>
            <div class="studio-live-badge" style="font-size: 0.6875rem;"><span class="status-pulse"></span>8 大行业专属模板</div>
          </div>
          <div class="sol-sector-layout">
            <div class="sol-sector-tabs">
              <button class="sol-sector-tab-btn active">房建公建</button>
              <button class="sol-sector-tab-btn">轨交枢纽</button>
              <button class="sol-sector-tab-btn">水利水务</button>
              <button class="sol-sector-tab-btn">市政路桥</button>
            </div>
            <div class="sol-sector-body-grid">
              <div class="sol-sector-preview-card">
                <div>
                  <span class="blueprint-stage-tag" style="background: rgba(56,189,248,0.15); color: #38bdf8; margin-bottom: 8px;">Active Blueprint</span>
                  <div style="font-size: 1rem; font-weight: 700; color: #fff; margin-bottom: 6px;">房建公建管综与算量</div>
                  <div style="font-size: 0.75rem; color: var(--text-secondary); line-height: 1.6;">机电综合管线 100% 碰撞清零 · 清单工程量精准挂接 · 4D 施工时序演进</div>
                </div>
                <div style="background: rgba(2,6,23,0.7); border: 1px solid rgba(56,189,248,0.2); border-radius: 6px; padding: 10px; margin-top: 12px;">
                  <div style="font-size: 0.6875rem; color: var(--cyan-400); font-family: monospace;">[CLASH DETECTION: 0 ERRORS]</div>
                  <div style="font-size: 0.8125rem; font-weight: 700; color: #34d399; margin-top: 2px;">算量偏差 &lt;0.3% · 施工交底 3D 动画</div>
                </div>
              </div>
              <div class="sol-sector-spec-stack">
                <div class="blueprint-stage-card" style="padding: 12px; border-color: rgba(167, 139, 250, 0.3);">
                  <span class="blueprint-stage-tag" style="background: rgba(167, 139, 250, 0.15); color: #a78bfa;">轨交枢纽</span>
                  <div style="font-size: 0.8125rem; font-weight: 700; color: #fff;">多源 GIS + 盾构监测</div>
                  <div style="font-size: 0.6875rem; color: var(--text-muted);">沉降位移 &lt;0.1mm · 空间对齐</div>
                </div>
                <div class="blueprint-stage-card" style="padding: 12px; border-color: rgba(52, 211, 153, 0.3);">
                  <span class="blueprint-stage-tag" style="background: rgba(52, 211, 153, 0.12); color: #34d399;">水利水务</span>
                  <div style="font-size: 0.8125rem; font-weight: 700; color: #fff;">三维库容流体仿真</div>
                  <div style="font-size: 0.6875rem; color: var(--text-muted);">物理级渗流应力动态云图</div>
                </div>
              </div>
            </div>
          </div>
          <div class="engine-studio-footer" style="background: rgba(0,0,0,0.3); padding: 12px 18px; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.06);">
            <div style="font-size: 0.75rem; color: #e2e8f0; display: flex; align-items: center; gap: 8px;">
              ${getSvg('cube', 14, '#38bdf8')}
              <span>50,000+ 行业标准构件族库 · 8 大工程行业即开即用</span>
            </div>
            <span style="color: var(--text-muted); font-size: 0.6875rem; font-family: monospace;">BIMCC Industry Template</span>
          </div>
        </div>
      `;
    } else if (slug === 'project') {
      // Archetype 3: Single-Project 2x2 Telemetry Matrix
      studioHTML = `
        <div class="solution-blueprint-studio">
          <div class="studio-titlebar">
            <div class="studio-traffic-lights">
              <span class="light-dot red"></span>
              <span class="light-dot yellow"></span>
              <span class="light-dot green"></span>
              <span style="margin-left: 8px; font-size: 0.75rem; color: #94a3b8; font-weight: 600; font-family: monospace;">BIMCC Single-Project Command HUD</span>
            </div>
            <div class="studio-live-badge" style="font-size: 0.6875rem;"><span class="status-pulse"></span>项目级实时中控</div>
          </div>
          <div class="sol-matrix-layout">
            <div class="sol-matrix-hud-bar">
              <span>● LIVE TELEMETRY: 4D BIM &amp; IOT STREAM</span>
              <span>DELAY: &lt;18ms</span>
            </div>
            <div class="sol-matrix-grid-2x2">
              <div class="sol-matrix-card" style="border-color: rgba(56,189,248,0.3);">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span class="blueprint-stage-tag" style="background: rgba(56,189,248,0.15); color: #38bdf8;">01 空间中枢</span>
                  ${getSvg('cube', 12, '#38bdf8')}
                </div>
                <div style="font-size: 0.875rem; font-weight: 700; color: #fff;">4D 施工时序推演</div>
                <div style="font-size: 0.6875rem; color: var(--text-muted);">LOD400 构件 · 关键路径偏差预警</div>
              </div>
              <div class="sol-matrix-card" style="border-color: rgba(251,191,36,0.3);">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span class="blueprint-stage-tag" style="background: rgba(251,191,36,0.15); color: #fbbf24;">02 现场物联</span>
                  ${getSvg('alert', 12, '#fbbf24')}
                </div>
                <div style="font-size: 0.875rem; font-weight: 700; color: #fff;">AI 违章与特种设备</div>
                <div style="font-size: 0.6875rem; color: var(--text-muted);">塔吊防碰撞 · 深基坑位移 &lt;0.1mm</div>
              </div>
              <div class="sol-matrix-card" style="border-color: rgba(129,140,248,0.3);">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span class="blueprint-stage-tag" style="background: rgba(129,140,248,0.15); color: #818cf8;">03 劳务实名</span>
                  ${getSvg('shield', 12, '#818cf8')}
                </div>
                <div style="font-size: 0.875rem; font-weight: 700; color: #fff;">通道门禁与工效分析</div>
                <div style="font-size: 0.6875rem; color: var(--text-muted);">实名制考勤 · 班组工效实时测算</div>
              </div>
              <div class="sol-matrix-card" style="border-color: rgba(52,211,153,0.3);">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span class="blueprint-stage-tag" style="background: rgba(52,211,153,0.15); color: #34d399;">04 验工计价</span>
                  ${getSvg('chart', 12, '#34d399')}
                </div>
                <div style="font-size: 0.875rem; font-weight: 700; color: #fff;">产值与进度穿透</div>
                <div style="font-size: 0.6875rem; color: var(--text-muted);">构件挂接工程量 · 签证线上闭环</div>
              </div>
            </div>
          </div>
          <div class="engine-studio-footer" style="background: rgba(0,0,0,0.3); padding: 12px 18px; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.06);">
            <div style="font-size: 0.75rem; color: #e2e8f0; display: flex; align-items: center; gap: 8px;">
              ${getSvg('chart', 14, '#34d399')}
              <span>现场隐患闭环率 99.4% · 质量验评一次合格率 98.6%</span>
            </div>
            <span style="color: var(--text-muted); font-size: 0.6875rem; font-family: monospace;">BIMCC Site Command Edition</span>
          </div>
        </div>
      `;
    } else if (slug === 'build-client') {
      // Archetype 4: Owner Investment Waterfall Stream
      studioHTML = `
        <div class="solution-blueprint-studio">
          <div class="studio-titlebar">
            <div class="studio-traffic-lights">
              <span class="light-dot red"></span>
              <span class="light-dot yellow"></span>
              <span class="light-dot green"></span>
              <span style="margin-left: 8px; font-size: 0.75rem; color: #94a3b8; font-weight: 600; font-family: monospace;">BIMCC Owner Investment &amp; Asset Engine</span>
            </div>
            <div class="studio-live-badge" style="font-size: 0.6875rem;"><span class="status-pulse"></span>业主全过程管控</div>
          </div>
          <div class="sol-waterfall-layout">
            <div class="sol-waterfall-row" style="border-color: rgba(56,189,248,0.3);">
              <div class="sol-waterfall-badge-step" style="background: rgba(56,189,248,0.2); color: #38bdf8;">01</div>
              <div style="flex: 1;">
                <div style="font-size: 0.875rem; font-weight: 700; color: #fff;">投资预算 · 概算/预算/结算三算对比</div>
                <div style="font-size: 0.75rem; color: var(--text-secondary);">合同执行动态穿透 · 超概算指标智能拦截</div>
              </div>
              <span style="font-size: 0.6875rem; font-family: var(--font-number); font-weight: 700; font-feature-settings: 'tnum' 1; font-variant-numeric: tabular-nums; color: var(--cyan-400); background: rgba(56,189,248,0.1); padding: 3px 8px; border-radius: 4px;">三算穿透 100%</span>
            </div>
            <div class="sol-waterfall-connector">${getSvg('arrowRight', 14, '#64748b')}</div>
            <div class="sol-waterfall-row" style="border-color: rgba(129,140,248,0.3);">
              <div class="sol-waterfall-badge-step" style="background: rgba(129,140,248,0.2); color: #818cf8;">02</div>
              <div style="flex: 1;">
                <div style="font-size: 0.875rem; font-weight: 700; color: #fff;">过程合规 · 进度里程碑与支付联锁</div>
                <div style="font-size: 0.75rem; color: var(--text-secondary);">付款依据模型工程量与留痕 · 变更签证多方线上会签</div>
              </div>
              <span style="font-size: 0.6875rem; font-family: var(--font-number); font-weight: 700; font-feature-settings: 'tnum' 1; font-variant-numeric: tabular-nums; color: #818cf8; background: rgba(129,140,248,0.1); padding: 3px 8px; border-radius: 4px;">支付联锁安全</span>
            </div>
            <div class="sol-waterfall-connector">${getSvg('arrowRight', 14, '#64748b')}</div>
            <div class="sol-waterfall-row" style="border-color: rgba(52,211,153,0.3);">
              <div class="sol-waterfall-badge-step" style="background: rgba(52,211,153,0.2); color: #34d399;">03</div>
              <div style="flex: 1;">
                <div style="font-size: 0.875rem; font-weight: 700; color: #fff;">资产移交 · 一模到底竣工资产池</div>
                <div style="font-size: 0.75rem; color: var(--text-secondary);">空间实体与资料 100% 挂接 · 免转换导入智慧运维</div>
              </div>
              <span style="font-size: 0.6875rem; font-family: var(--font-number); font-weight: 700; font-feature-settings: 'tnum' 1; font-variant-numeric: tabular-nums; color: #34d399; background: rgba(52,211,153,0.1); padding: 3px 8px; border-radius: 4px;">交付缩短 45天</span>
            </div>
          </div>
          <div class="engine-studio-footer" style="background: rgba(0,0,0,0.3); padding: 12px 18px; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.06);">
            <div style="font-size: 0.75rem; color: #e2e8f0; display: flex; align-items: center; gap: 8px;">
              ${getSvg('shield', 14, '#38bdf8')}
              <span>投资变更失控率 0% · 资产交付周期缩短 45 天</span>
            </div>
            <span style="color: var(--text-muted); font-size: 0.6875rem; font-family: monospace;">BIMCC Owner Edition</span>
          </div>
        </div>
      `;
    } else if (slug === 'build-contractor') {
      // Archetype 5: Contractor Split Deepening Studio
      studioHTML = `
        <div class="solution-blueprint-studio">
          <div class="studio-titlebar">
            <div class="studio-traffic-lights">
              <span class="light-dot red"></span>
              <span class="light-dot yellow"></span>
              <span class="light-dot green"></span>
              <span style="margin-left: 8px; font-size: 0.75rem; color: #94a3b8; font-weight: 600; font-family: monospace;">BIMCC Contractor Lean Execution Studio</span>
            </div>
            <div class="studio-live-badge" style="font-size: 0.6875rem;"><span class="status-pulse"></span>总包现场精细化</div>
          </div>
          <div class="sol-split-layout">
            <div class="sol-split-cad-box">
              <div>
                <span class="blueprint-stage-tag" style="background: rgba(56,189,248,0.15); color: #38bdf8; margin-bottom: 8px;">01 深化设计中枢</span>
                <div style="font-size: 1rem; font-weight: 700; color: #fff; margin-bottom: 6px;">全专业图纸会审与碰撞清零</div>
                <div style="font-size: 0.75rem; color: var(--text-secondary); line-height: 1.6;">机电管线预排布深化 · 复杂钢结构 3D 交底 · 构件加工料单精准输出</div>
              </div>
              <div style="padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: space-between;">
                <span style="font-size: 0.75rem; color: var(--cyan-400); font-weight: 700;">节点返工率下降 70%</span>
                <span style="font-size: 0.6875rem; color: var(--text-muted);">CAD/BIM 联动</span>
              </div>
            </div>
            <div class="sol-split-stack">
              <div class="blueprint-stage-card" style="border-color: rgba(251, 146, 60, 0.35);">
                <span class="blueprint-stage-tag" style="background: rgba(251, 146, 60, 0.15); color: #fb923c;">02 资源精控</span>
                <div style="font-size: 0.8125rem; font-weight: 700; color: #fff;">钢筋套料与物资集采</div>
                <div style="font-size: 0.6875rem; color: var(--text-muted);">原材套料优化节约 3.2% · 机械工时监控</div>
              </div>
              <div class="blueprint-stage-card" style="border-color: rgba(52, 211, 153, 0.3);">
                <span class="blueprint-stage-tag" style="background: rgba(52, 211, 153, 0.12); color: #34d399;">03 质安闭环</span>
                <div style="font-size: 0.8125rem; font-weight: 700; color: #fff;">现场隐患随手拍 &lt;4h 闭环</div>
                <div style="font-size: 0.6875rem; color: var(--text-muted);">AI 违章边缘识别 · 验收电子留痕</div>
              </div>
            </div>
          </div>
          <div class="engine-studio-footer" style="background: rgba(0,0,0,0.3); padding: 12px 18px; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.06);">
            <div style="font-size: 0.75rem; color: #e2e8f0; display: flex; align-items: center; gap: 8px;">
              ${getSvg('workflow', 14, '#38bdf8')}
              <span>节点返工率下降 70% · 现场综合履约合格率 99.8%</span>
            </div>
            <span style="color: var(--text-muted); font-size: 0.6875rem; font-family: monospace;">BIMCC Contractor Edition</span>
          </div>
        </div>
      `;
    } else if (slug === 'build-supervision') {
      // Archetype 6: Supervision Timeline & Parallel Inspection
      studioHTML = `
        <div class="solution-blueprint-studio">
          <div class="studio-titlebar">
            <div class="studio-traffic-lights">
              <span class="light-dot red"></span>
              <span class="light-dot yellow"></span>
              <span class="light-dot green"></span>
              <span style="margin-left: 8px; font-size: 0.75rem; color: #94a3b8; font-weight: 600; font-family: monospace;">BIMCC Digital Supervision Hub</span>
            </div>
            <div class="studio-live-badge" style="font-size: 0.6875rem;"><span class="status-pulse"></span>数字监理全流程</div>
          </div>
          <div class="sol-timeline-layout">
            <div class="sol-timeline-top-feed">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span class="blueprint-stage-tag" style="background: rgba(167,139,250,0.15); color: #a78bfa;">01 旁站巡视见证</span>
                <span style="font-size: 0.6875rem; color: #a78bfa; font-family: monospace;">[IMAGE TIMESTAMP FEED]</span>
              </div>
              <div style="font-size: 0.9375rem; font-weight: 700; color: #fff;">无人机航拍与实景影像见证打卡</div>
              <div style="font-size: 0.75rem; color: var(--text-secondary);">关键隐蔽工程实景影像溯源 · 数字监理日志与现场气象自动联动</div>
            </div>
            <div class="sol-timeline-bottom-row">
              <div class="sol-timeline-mini-card" style="border-color: rgba(56,189,248,0.3);">
                <div style="font-size: 0.8125rem; font-weight: 700; color: #38bdf8;">02 平行检验</div>
                <div style="font-size: 0.6875rem; color: var(--text-muted); margin-top: 4px;">实测实量自动比对</div>
              </div>
              <div class="sol-timeline-mini-card" style="border-color: rgba(251,191,36,0.3);">
                <div style="font-size: 0.8125rem; font-weight: 700; color: #fbbf24;">03 偏差发单</div>
                <div style="font-size: 0.6875rem; color: var(--text-muted); margin-top: 4px;">超标自动派发通知</div>
              </div>
              <div class="sol-timeline-mini-card" style="border-color: rgba(52,211,153,0.3);">
                <div style="font-size: 0.8125rem; font-weight: 700; color: #34d399;">04 监理月报</div>
                <div style="font-size: 0.6875rem; color: var(--text-muted); margin-top: 4px;">质安数据一键成报</div>
              </div>
            </div>
          </div>
          <div class="engine-studio-footer" style="background: rgba(0,0,0,0.3); padding: 12px 18px; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.06);">
            <div style="font-size: 0.75rem; color: #e2e8f0; display: flex; align-items: center; gap: 8px;">
              ${getSvg('shield', 14, '#38bdf8')}
              <span>监理记录留痕率 100% · 合规隐患整改闭环时效 &lt;4h</span>
            </div>
            <span style="color: var(--text-muted); font-size: 0.6875rem; font-family: monospace;">BIMCC Supervision Edition</span>
          </div>
        </div>
      `;
    } else if (slug === 'build-regulation') {
      // Archetype 7: Government Macro GIS Command
      studioHTML = `
        <div class="solution-blueprint-studio">
          <div class="studio-titlebar">
            <div class="studio-traffic-lights">
              <span class="light-dot red"></span>
              <span class="light-dot yellow"></span>
              <span class="light-dot green"></span>
              <span style="margin-left: 8px; font-size: 0.75rem; color: #94a3b8; font-weight: 600; font-family: monospace;">BIMCC Regulation GIS Command Hub</span>
            </div>
            <div class="studio-live-badge" style="font-size: 0.6875rem;"><span class="status-pulse"></span>住建全域一张图</div>
          </div>
          <div class="sol-gis-layout">
            <div class="sol-gis-map-banner">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <span class="blueprint-stage-tag" style="background: rgba(52,211,153,0.2); color: #34d399;">01 辖区全景一张图</span>
                <span style="font-size: 0.6875rem; color: #34d399; font-family: monospace;">[GIS MULTI-LAYER]</span>
              </div>
              <div style="font-size: 1rem; font-weight: 700; color: #fff;">在建工程空间分布与风险热力图</div>
              <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 4px;">辖区重大项目 100% 空间纳管 · 风险源动态红黄绿分级</div>
            </div>
            <div class="sol-gis-split-row">
              <div class="blueprint-stage-card" style="border-color: rgba(251,191,36,0.3);">
                <span class="blueprint-stage-tag" style="background: rgba(251,191,36,0.15); color: #fbbf24;">02 信用与环保</span>
                <div style="font-size: 0.8125rem; font-weight: 700; color: #fff;">扬尘噪声与农工发薪</div>
                <div style="font-size: 0.6875rem; color: var(--text-muted);">PM2.5 在线监测 · 发薪专户穿透</div>
              </div>
              <div class="blueprint-stage-card" style="border-color: rgba(56,189,248,0.3);">
                <span class="blueprint-stage-tag" style="background: rgba(56,189,248,0.12); color: #38bdf8;">03 联合执法</span>
                <div style="font-size: 0.8125rem; font-weight: 700; color: #fff;">跨部门行政协同调度</div>
                <div style="font-size: 0.6875rem; color: var(--text-muted);">超期隐患自动流转 · 效能 3x</div>
              </div>
            </div>
          </div>
          <div class="engine-studio-footer" style="background: rgba(0,0,0,0.3); padding: 12px 18px; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.06);">
            <div style="font-size: 0.75rem; color: #e2e8f0; display: flex; align-items: center; gap: 8px;">
              ${getSvg('building', 14, '#38bdf8')}
              <span>辖区重大工程纳管率 100% · 执法协同效率提升 3 倍</span>
            </div>
            <span style="color: var(--text-muted); font-size: 0.6875rem; font-family: monospace;">BIMCC Regulation Edition</span>
          </div>
        </div>
      `;
    }

    studioContainer.innerHTML = studioHTML;
  }

  renderCards(document, '[data-solution-list="pain"]', data.pain, "pain");
  renderCards(document, '[data-solution-list="plan"]', data.plan, "plan");
  renderCards(document, '[data-solution-list="modules"]', data.modules, "capabilities");
  renderCards(document, '[data-solution-list="scenarios"]', data.scenarios, "scenarios");
  renderCards(document, '[data-solution-list="deliverables"]', data.deliverables, "deliverables");
}

function hydrateCaseDetail() {
  const root = document.querySelector("[data-case-field]");
  if (!root) return;

  const slug = getSlug("jiangbei-airport");
  const data = casePages[slug] || casePages["jiangbei-airport"] || casePages["gezhouba-platform"];
  document.title = `${data.title} - 筑云科技 BIMCC`;

  setField(document, '[data-case-field="title"]', data.title);
  setField(document, '[data-case-field="summary"]', data.summary);
  setField(document, '[data-case-field="caption"]', data.caption);
  setField(document, '[data-case-field="profileIntro"]', data.profileIntro);
  setField(document, '[data-case-field="focusTitle"]', data.focusTitle);
  setField(document, '[data-case-field="focusIntro"]', data.focusIntro);
  setField(document, '[data-case-field="relatedTitle"]', data.relatedTitle);
  setField(document, '[data-case-field="relatedIntro"]', data.relatedIntro);
  setSignals(document, "case", data.signals);

  const image = document.querySelector('[data-case-field="image"]');
  if (image) {
    image.src = data.image;
    image.alt = `${data.title}项目图`;
  }

  renderKeyValueCards(document, '[data-case-list="profile"]', data.profile);
  renderCards(document, '[data-case-list="focus"]', data.focus, "capabilities");
  renderCards(document, '[data-case-list="capabilities"]', data.capabilities, "scenarios");
}

hydrateProductDetail();
hydrateSolutionDetail();
hydrateCaseDetail();

const leadForm = document.querySelector("#leadForm");
const formStatus = document.querySelector("#formStatus");

if (leadForm && formStatus) {
  const submitButton = leadForm.querySelector('button[type="submit"]');
  let localSubmitTimer;

  function setFormState({ submitting = false, message = "" } = {}) {
    leadForm.setAttribute("aria-busy", String(submitting));
    leadForm.classList.toggle("is-submitting", submitting);
    if (submitButton) submitButton.disabled = submitting;
    if (message) {
      formStatus.textContent = message;
      formStatus.classList.add("has-message");
    }
  }

  setFormState({ submitting: false });

  leadForm.addEventListener("submit", (event) => {
    event.preventDefault();
    window.clearTimeout(localSubmitTimer);

    const requiredFields = [...leadForm.querySelectorAll("[required]")];
    const missingField = requiredFields.find((field) => !field.value.trim());

    if (missingField) {
      setFormState({
        submitting: false,
        message: "请先补充必填信息，便于团队判断沟通方向。",
      });
      missingField.focus();
      return;
    }

    setFormState({
      submitting: true,
      message: "正在提交预约信息。",
    });

    localSubmitTimer = window.setTimeout(() => {
      leadForm.reset();
      setFormState({
        submitting: false,
        message: "已收到预约信息，筑云团队将尽快与你沟通。",
      });
    }, 420);
  });
}

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealItems = document.querySelectorAll(".reveal");

if (reduceMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  revealItems.forEach((item) => observer.observe(item));
}

const heroStage = document.querySelector(".hero-stage");

if (heroStage && !reduceMotion) {
  heroStage.addEventListener("pointermove", (event) => {
    const rect = heroStage.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    heroStage.style.setProperty("--pointer-x", `${x.toFixed(1)}%`);
    heroStage.style.setProperty("--pointer-y", `${y.toFixed(1)}%`);
  });

  heroStage.addEventListener("pointerleave", () => {
    heroStage.style.removeProperty("--pointer-x");
    heroStage.style.removeProperty("--pointer-y");
  });
}

/* ==========================================================================
   Reflect & AuthKit Micro-Interactions: Card Spotlight & Magnetic Feedback
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  // 1. 全局卡片局部光晕追踪 (Spotlight effect)
  const interactiveCards = document.querySelectorAll(".glass-card, .double-bezel, .case-card, .product-card, .solve-card, .pain-card");
  
  interactiveCards.forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    });
  });

  // 2. 顶部导航栏滚动监听 (Header blur on scroll)
  const siteHeader = document.querySelector(".site-header");
  if (siteHeader) {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        siteHeader.style.backgroundColor = "rgba(4, 7, 15, 0.88)";
        siteHeader.style.boxShadow = "0 20px 40px rgba(0, 0, 0, 0.45)";
      } else {
        siteHeader.style.backgroundColor = "rgba(6, 9, 19, 0.75)";
        siteHeader.style.boxShadow = "none";
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
  }
});

// ==========================================================================
// 8. 核心技术多引擎 Studio Workbench 交互函数 (technology.html)
// ==========================================================================
const engineData = {
  bim: {
    badge: "WebGPU 60FPS · Active",
    canvasTitle: "[WebGL2 / WebGPU Native Core]",
    modelName: "1,420,000 实体构件",
    shaderDesc: "LOD 自动逐级退化 · 毫秒级空间检索",
    fps: "60.0 fps (锁定)",
    fpsColor: "#34d399",
    drawCalls: "48 次/帧",
    triangles: "14.28 M",
    vram: "184 MB",
    os: "麒麟OS / 统信 100%",
    tree: [
      { text: "标段主体结构", icon: "building", active: true },
      { text: "承台与立柱 #04", icon: "cube", active: false },
      { text: "机电综合管综 #12", icon: "cpu", active: false },
      { text: "消防水泵机组 #01", icon: "shield", active: false },
      { text: "构件属性: 82 项已挂接", icon: "check", active: false, highlight: true }
    ]
  },
  gis: {
    badge: "Cesium 3D Tiles 3.0 · Multi-Scale",
    canvasTitle: "[WGS84 / CGCS2000 空间坐标融合]",
    modelName: "全流域宏观地理底座",
    shaderDesc: "地形高程 + 卫星影像 + 倾斜摄影多源融合",
    fps: "58.4 fps",
    fpsColor: "#38bdf8",
    drawCalls: "62 次/帧",
    triangles: "28.50 M",
    vram: "310 MB",
    os: "国测局标准坐标系认证",
    tree: [
      { text: "全域三维数字底座", icon: "building", active: true },
      { text: "0.5m 卫星影像正射切片", icon: "layers", active: false },
      { text: "DEM 高程地形栅格", icon: "water", active: false },
      { text: "标段与红线界址", icon: "sparkle", active: false },
      { text: "空间图层: 16 层协同", icon: "check", active: false, highlight: true }
    ]
  },
  ue5: {
    badge: "Unreal Engine 5.4 · Nanite / Lumen",
    canvasTitle: "[物理级光照追踪 & 粒子仿真]",
    modelName: "特大型枢纽拟真数字孪生",
    shaderDesc: "实时天气动态演化 · 复杂工法推演",
    fps: "60.0 fps (RTX 算力集群)",
    fpsColor: "#a78bfa",
    drawCalls: "112 次/帧",
    triangles: "142.0 M",
    vram: "1.2 GB",
    os: "像素流送 (Pixel Streaming) 支持",
    tree: [
      { text: "指挥中心大屏推演场景", icon: "workflow", active: true },
      { text: "物理天光与体积雾系统", icon: "sparkle", active: false },
      { text: "塔吊群作业防碰撞仿真", icon: "building", active: false },
      { text: "水流与沉降应力云图", icon: "water", active: false },
      { text: "实时推演延迟: < 25ms", icon: "check", active: false, highlight: true }
    ]
  },
  "3dgs": {
    badge: "3D Gaussian Splatting · 毫米级实景",
    canvasTitle: "[高斯点辐射场逆向建模]",
    modelName: "隐蔽工程高精点云辐射场",
    shaderDesc: "实景照片点云逆向还原 · 时序沉降比对",
    fps: "60.0 fps",
    fpsColor: "#fbbf24",
    drawCalls: "24 次/帧",
    triangles: "8.6 M (Gaussians)",
    vram: "240 MB",
    os: "无人机倾斜航测点云全兼容",
    tree: [
      { text: "无人机航拍点云模型", icon: "cube", active: true },
      { text: "时序进度对比 (T1 vs T2)", icon: "workflow", active: false },
      { text: "现场裂缝与隐患标注", icon: "alert", active: false },
      { text: "自动计算开挖土方量", icon: "chart", active: false },
      { text: "实景精度误差: < 3mm", icon: "check", active: false, highlight: true }
    ]
  }
};

window.switchEngineTab = function(engineKey) {
  const data = engineData[engineKey];
  if (!data) return;

  // 1. Update tab active state
  document.querySelectorAll(".engine-engine-tab").forEach(tab => {
    tab.classList.toggle("active", tab.dataset.engineTab === engineKey);
  });

  // 2. Update UI elements
  const stateBadge = document.getElementById("engineStateBadge");
  if (stateBadge) stateBadge.textContent = data.badge;

  const titleElem = document.getElementById("engineCanvasTitle");
  if (titleElem) titleElem.textContent = data.canvasTitle;

  const modelElem = document.getElementById("engineModelName");
  if (modelElem) modelElem.textContent = data.modelName;

  const shaderElem = document.getElementById("engineShaderDesc");
  if (shaderElem) shaderElem.textContent = data.shaderDesc;

  const fpsElem = document.getElementById("mMetricFPS");
  if (fpsElem) {
    fpsElem.textContent = data.fps;
    fpsElem.style.color = data.fpsColor;
  }

  const dcElem = document.getElementById("mMetricDrawCalls");
  if (dcElem) dcElem.textContent = data.drawCalls;

  const triElem = document.getElementById("mMetricTriangles");
  if (triElem) triElem.textContent = data.triangles;

  const vramElem = document.getElementById("mMetricVRAM");
  if (vramElem) vramElem.textContent = data.vram;

  const osElem = document.getElementById("mMetricOS");
  if (osElem) osElem.textContent = data.os;

  // 3. Update Left Tree
  const treeContainer = document.getElementById("engineTreeContainer");
  if (treeContainer && data.tree) {
    let treeHTML = '<div style="font-size: 0.6875rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase; margin-bottom: 4px;">空间拓扑图层</div>';
    data.tree.forEach((item, idx) => {
      const svgIcon = typeof getSvg === 'function' ? getSvg(item.icon || 'cube', 13, item.highlight ? '#38bdf8' : 'currentColor') : '';
      if (item.highlight) {
        treeHTML += `<div class="engine-tree-item" style="margin-top: auto; font-size: 0.6875rem; color: #38bdf8; display: flex; align-items: center; gap: 6px;">${svgIcon}<span>${item.text}</span></div>`;
      } else {
        const indent = idx > 0 ? 'style="padding-left: 18px;"' : '';
        const activeClass = item.active ? ' active' : '';
        treeHTML += `<div class="engine-tree-item${activeClass}" ${indent} style="display: flex; align-items: center; gap: 6px;">${svgIcon}<span>${item.text}</span></div>`;
      }
    });
    treeContainer.innerHTML = treeHTML;
  }
};

function selectDeployMode(mode) {
  const deployData = {
    private: {
      profileTitle: "信创私有化交付模式 (ENTERPRISE)",
      desc: "部署于客户私有信创机房或服务器，全链路物理网络隔离，支持纯离线内网稳定运行。",
      badges: [
        { text: "物理网络隔离", cls: "spec-chip-cyan" },
        { text: "独占计算与存储资源", cls: "" },
        { text: "纯离线内网稳定运行", cls: "spec-chip-emerald" },
        { text: "双机热备与高可用", cls: "" }
      ],
      clients: [
        { name: "PC Web 浏览器", sub: "Chrome / Edge / 360安全浏览器 / Firefox", icon: "monitor" },
        { name: "移动端原生 APP", sub: "iOS & Android 移动巡检与现场离线填报", icon: "smartphone" },
        { name: "政企协同工作台", sub: "企微 / 钉钉 / 飞书 单点登录与应用集成", icon: "users" },
        { name: "指挥中心大屏", sub: "超高清数字孪生视效与多屏拼接联动", icon: "tv" }
      ],
      compliance: {
        groups: [
          { name: "芯片算力", items: ["华为鲲鹏", "华为昇腾", "飞腾 Phytium", "海光 Hygon"] },
          { name: "国产数据库", items: ["达梦 DM8", "东方通 TongWeb", "人大金仓", "OceanBase"] },
          { name: "操作系统", items: ["统信 UOS", "麒麟 KylinOS", "openEuler"] }
        ],
        endorse: "国家高新技术企业 · CMMI 5级认证 · 鲲鹏/昇腾互认证 · 达梦兼容 · 等保三级"
      },
      cycle: {
        number: "3",
        sep: "–",
        subNumber: "5",
        unit: "工作日",
        tag: "标准环境基准",
        gains: [
          { icon: "trend", text: "离线镜像标准化部署" },
          { icon: "shield", text: "工程数据本地自主可控" }
        ],
        stages: [
          { num: "01", name: "运行环境检测与基线确认" },
          { num: "02", name: "离线镜像导入与信创适配" },
          { num: "03", name: "业务模型与权限组织初始化" },
          { num: "04", name: "联调验收与交付赋能" }
        ]
      },
      service: [
        { title: "专属技术专班通道", desc: "设立原厂技术专班群实时对接，快速协调排查系统运行问题" },
        { title: "原厂本地驻场支持", desc: "依托重庆总部及全国技术网络，提供资深技术顾问现场保障" },
        { title: "关键业务节点护航", desc: "系统上线初期与重要保障节点，提供原厂专项保障与深度巡检" }
      ]
    },
    hybrid: {
      profileTitle: "行业专网 / 混合协同模式 (HYBRID)",
      desc: "核心业务数据本地安全留存，多标段协同通过安全专网受控互通，兼顾合规与弹性算力。",
      badges: [
        { text: "国企行业专网直连", cls: "spec-chip-purple" },
        { text: "工程数据本地留存", cls: "" },
        { text: "多标段跨网络协同", cls: "spec-chip-cyan" },
        { text: "安全前置网关隔离", cls: "" }
      ],
      clients: [
        { name: "PC Web 浏览器", sub: "主流浏览器专线高速访问，免额外插件安装", icon: "monitor" },
        { name: "现场移动巡检端", sub: "支持现场弱网/无网离线填报，入网自动同步", icon: "smartphone" },
        { name: "行业统一工作台", sub: "支持国企统一门户微前端嵌入与单点登录对接", icon: "users" },
        { name: "指挥中心联动大屏", sub: "支持项目部与集团指挥中心跨网分布式大屏联动", icon: "tv" }
      ],
      compliance: {
        groups: [
          { name: "身份治理", items: ["统一身份认证", "OAuth2 / CAS 单点登录", "RBAC 细粒度权限控制"] },
          { name: "网络隔离", items: ["安全加密专网传输", "前置机反向代理网关", "敏感工程数据分级隔离"] },
          { name: "安全基线", items: ["等保三级安全基线", "全链路操作审计日志", "接口访问控制防护"] }
        ],
        endorse: "严格遵循国家网络安全等级保护三级规范 · 满足大型国央企工程数字化建设安全要求"
      },
      cycle: {
        number: "5",
        sep: "–",
        subNumber: "10",
        unit: "工作日",
        tag: "专网接入基准",
        gains: [
          { icon: "trend", text: "专线联通即配即用" },
          { icon: "shield", text: "多网数据安全可控" }
        ],
        stages: [
          { num: "01", name: "专网拓扑与网关安全评估" },
          { num: "02", name: "安全专线配置与网络打通" },
          { num: "03", name: "业务模型与跨标段权限配置" },
          { num: "04", name: "跨网性能联调与验收上线" }
        ]
      },
      service: [
        { title: "专属架构顾问对接", desc: "资深技术顾问全程跟进，推进专网系统架构落地与配置调优" },
        { title: "多网协同排障支持", desc: "协助跨网络专线联调对接，协同排查多网复杂链路异常" },
        { title: "系统性能定向调优", desc: "针对工程大数据并发场景，提供定向架构诊断与运行优化" }
      ]
    },
    saas: {
      profileTitle: "标准云端敏捷模式 (FAST PASS)",
      desc: "依托高可用云原生集群开箱即用，全面免除企业本地软硬件采购与长期运维负担。",
      badges: [
        { text: "开箱即用无需本地部署", cls: "spec-chip-emerald" },
        { text: "免服务器硬件投入", cls: "spec-chip-cyan" },
        { text: "标准化模板即选即用", cls: "" },
        { text: "多租户安全数据隔离", cls: "" }
      ],
      clients: [
        { name: "主流现代浏览器", sub: "Chrome / Edge / Firefox 快速访问，免客户端安装", icon: "monitor" },
        { name: "移动端协同巡检", sub: "微信小程序 / 企微与钉钉轻量巡检、审批与报表", icon: "smartphone" },
        { name: "协同平台一键对接", sub: "一键扫码绑定企业微信、钉钉租户组织架构", icon: "users" },
        { name: "项目驾驶舱看板", sub: "一键全屏展示项目实时进度、质量安全三维看板", icon: "tv" }
      ],
      compliance: {
        groups: [
          { name: "传输安全", items: ["TLS 安全传输加密", "全站 HTTPS 强制", "接口防护与流量控制"] },
          { name: "数据安全", items: ["多租户逻辑强隔离", "定时自动化数据快照备份", "敏感数据分级加密存储"] },
          { name: "平台认证", items: ["国家等保三级规范", "国家高新技术企业", "CMMI 5级成熟度研发体系"] }
        ],
        endorse: "遵循国家等保三级安全规范 · CMMI 5级工程化研发管理 · 严守企业租户数据隔离安全底线"
      },
      cycle: {
        number: "1",
        sep: "–",
        subNumber: "3",
        unit: "工作日",
        tag: "快速开通基准",
        gains: [
          { icon: "trend", text: "零本地服务器投入" },
          { icon: "check", text: "标准化行业模板即用" }
        ],
        stages: [
          { num: "01", name: "专属企业租户空间开通" },
          { num: "02", name: "组织架构与权限角色导入" },
          { num: "03", name: "工程业务标准化模板启用" },
          { num: "04", name: "在线系统培训与开箱即用" }
        ]
      },
      service: [
        { title: "官方在线技术支持", desc: "专业技术顾问工作日在线答疑，指导业务配置与日常系统操作" },
        { title: "全套实操指引文档", desc: "提供工程全流程实操视频、知识库指引与行业最佳实践持续更新" },
        { title: "持续云端敏捷升级", desc: "享受平台核心能力在线升级与持续迭代，无需企业本地维护负担" }
      ]
    }
  };

  const data = deployData[mode] || deployData.private;

  // 1. 切换按钮状态
  document.querySelectorAll(".deploy-option-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.deployMode === mode);
  });

  // 2. 顶部激活徽章
  const profileBadge = document.getElementById("specActiveProfileBadge");
  if (profileBadge) profileBadge.textContent = data.profileTitle;

  // 辅助 SVG 映射
  const getDeviceSvg = (iconName) => {
    if (iconName === "monitor") return '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>';
    if (iconName === "smartphone") return '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><line x1="12" x2="12.01" y1="18" y2="18"/></svg>';
    if (iconName === "users") return '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>';
    if (iconName === "tv") return '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="15" x="2" y="7" rx="2" ry="2"/><polyline points="17 2 12 7 7 2"/></svg>';
    return '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>';
  };

  const getGainSvg = (iconName) => {
    if (iconName === "trend") return '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>';
    if (iconName === "users") return '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>';
    if (iconName === "shield") return '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>';
    return '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>';
  };

  // 3. 部署架构
  const deployContainer = document.getElementById("specDeployContainer");
  if (deployContainer) {
    deployContainer.innerHTML = `
      <div class="spec-main-desc">${data.desc}</div>
      <div class="spec-chips-wrap">
        ${data.badges.map(b => `<span class="spec-chip ${b.cls}">${b.text}</span>`).join("")}
      </div>
    `;
  }

  // 4. 支持终端
  const clientsContainer = document.getElementById("specClientsContainer");
  if (clientsContainer) {
    clientsContainer.innerHTML = `
      <div class="spec-device-grid">
        ${data.clients.map(c => `
          <div class="spec-device-card">
            <span class="spec-device-icon">${getDeviceSvg(c.icon)}</span>
            <div class="spec-device-info">
              <span class="spec-device-name">${c.name}</span>
              <span class="spec-device-sub">${c.sub}</span>
            </div>
          </div>
        `).join("")}
      </div>
    `;
  }

  // 5. 国产化与信创合规
  const compContainer = document.getElementById("specCompatibilityContainer");
  if (compContainer) {
    compContainer.innerHTML = `
      <div class="spec-compliance-block">
        ${data.compliance.groups.map(g => `
          <div class="spec-group-row">
            <span class="spec-group-name">${g.name}</span>
            <div class="spec-chips-wrap">
              ${g.items.map(it => `<span class="spec-chip">${it}</span>`).join("")}
            </div>
          </div>
        `).join("")}
        <div class="spec-security-endorse">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
          <span>${data.compliance.endorse}</span>
        </div>
      </div>
    `;
  }

  // 6. 交付周期 SLA（精细排版与真实指标）
  const cycleContainer = document.getElementById("specCycleContainer");
  if (cycleContainer) {
    const numDisplay = data.cycle.subNumber 
      ? `<span class="spec-num-val">${data.cycle.number}</span><span class="spec-num-sep">${data.cycle.sep}</span><span class="spec-num-val">${data.cycle.subNumber}</span>`
      : `<span class="spec-num-val">${data.cycle.number}</span>`;

    cycleContainer.innerHTML = `
      <div class="spec-sla-layout">
        <div class="spec-sla-header-row">
          <div class="spec-sla-badge">
            <div class="spec-sla-metric">
              <span class="spec-sla-number">${numDisplay}</span>
              <span class="spec-sla-unit">${data.cycle.unit}</span>
            </div>
            ${data.cycle.tag ? `<span class="spec-sla-tag">${data.cycle.tag}</span>` : ''}
          </div>
          ${data.cycle.gains && data.cycle.gains.length ? `
            <div class="spec-sla-gains">
              ${data.cycle.gains.map(g => `
                <span class="spec-sla-gain-item">
                  ${getGainSvg(g.icon)}
                  <span>${g.text}</span>
                </span>
              `).join("")}
            </div>
          ` : ''}
        </div>
        <div class="spec-timeline-steps">
          ${data.cycle.stages.map((st, i) => `
            <span class="timeline-step-chip">
              <span class="step-num">${st.num}</span>
              <span class="step-name">${st.name}</span>
            </span>
            ${i < data.cycle.stages.length - 1 ? '<span class="timeline-step-arrow"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></span>' : ''}
          `).join("")}
        </div>
      </div>
    `;
  }

  // 7. 售后保障体系
  const serviceContainer = document.getElementById("specServiceContainer");
  if (serviceContainer) {
    serviceContainer.innerHTML = `
      <div class="spec-service-grid">
        ${data.service.map(s => `
          <div class="service-pillar-card">
            <span class="pillar-name">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--cyan-400)" stroke-width="2"><path d="m9 12 2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>
              ${s.title}
            </span>
            <span class="pillar-desc">${s.desc}</span>
          </div>
        `).join("")}
      </div>
    `;
  }
}
window.selectDeployMode = selectDeployMode;

// 方案选型全景矩阵多维筛选与整行直达交互
document.addEventListener("DOMContentLoaded", () => {
  const matrixFilterBtns = document.querySelectorAll(".matrix-filter-btn");
  const matrixRows = document.querySelectorAll(".solution-matrix-table .matrix-tr[data-category]");

  if (matrixFilterBtns.length > 0 && matrixRows.length > 0) {
    matrixFilterBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const targetCategory = btn.getAttribute("data-filter");
        matrixFilterBtns.forEach(b => b.classList.toggle("is-active", b === btn));

        matrixRows.forEach(row => {
          const rowCategory = row.getAttribute("data-category");
          const shouldShow = targetCategory === "all" || rowCategory === targetCategory;
          if (shouldShow) {
            row.classList.remove("is-hidden-row");
          } else {
            row.classList.add("is-hidden-row");
          }
        });
      });
    });
  }

  // 整行点击无缝直达对应方案咨询
  matrixRows.forEach(row => {
    row.addEventListener("click", (e) => {
      if (e.target.closest("a, button")) return;
      const href = row.getAttribute("data-href");
      if (href) {
        window.location.href = href;
      }
    });
  });

  // 方案选型全景矩阵 Tab 吸顶动态底色切换 (常态无黑条背景，吸顶时提供磨砂遮蔽)
  const matrixFilterWrap = document.querySelector(".matrix-filter-wrapper");
  if (matrixFilterWrap) {
    const handleFilterSticky = () => {
      const rect = matrixFilterWrap.getBoundingClientRect();
      const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--header-height")) || 68;
      if (rect.top <= headerHeight + 2) {
        matrixFilterWrap.classList.add("is-stuck");
      } else {
        matrixFilterWrap.classList.remove("is-stuck");
      }
    };
    window.addEventListener("scroll", handleFilterSticky, { passive: true });
    window.addEventListener("resize", handleFilterSticky, { passive: true });
    handleFilterSticky();
  }

  // 规格参数控制台默认载入私有化信创交付模式
  if (document.getElementById("specDeployContainer") && typeof selectDeployMode === "function") {
    selectDeployMode("private");
  }
});

