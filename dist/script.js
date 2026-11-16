const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

const PROJECTS = {
  enterpriseApp: {
    kicker: 'CASE STUDY / 01',
    index: '01 / ENTERPRISE APP UI',
    title: '企业版 App UI · 业务移动端',
    summary: '覆盖销售管理、仅出库、售后出库、配件申领、销售出库、已销售订单和财务管理等移动端业务场景，把门店高频任务组织成清晰的入口、列表与状态。',
    role: 'UI / 交互设计',
    focus: '销售 · 售后 · 配件 · 财务',
    output: 'UI 稿 · 业务流程 · 状态设计',
    heroImage: 'assets/enterprise-app-detail.png',
    contextTitle: '把门店高频操作放到同一条业务路径里',
    context: '企业版 App 面向门店日常经营，既要处理销售与售后，也要承接配件申领、出库和日常收支。页面不是孤立的视觉稿，而是要让不同角色在手机上快速找到入口、核对信息并完成操作。',
    problems: ['销售、售后、配件和财务入口多，用户需要快速判断下一步。', '出库详情需要同时核对客户、出库人、机器、IMEI 和采购信息。', '仅出库、已出库、取消出库、待分货等状态需要清晰区分。'],
    solution: '以业务入口和任务状态为主线组织页面，把列表筛选、详情核对和操作反馈串起来。',
    solutionPoints: ['用模块入口承接销售管理、售后出库、配件管理和财务管理。', '在出库详情中聚合单据、客户、机器与成本信息，降低来回查找。', '用筛选、标签、颜色提示和确认动作区分正常与异常状态。'],
    result: '形成从入口、订单列表、物品列表到详情与操作反馈的完整 UI 方案，覆盖多种业务状态。',
    tags: ['移动端 UI', '复杂业务', '状态设计', '出库流程'],
    gallery: ['assets/enterprise-app-list.png', 'assets/enterprise-app-detail.png']
  },
  enterprisePC: {
    kicker: 'CASE STUDY / 02',
    index: '02 / ENTERPRISE PC UI',
    title: '企业版 PC 改版 · 工作台与经营数据',
    summary: '从快捷菜单、经营数据、销售指标到库存列表与筛选，重新整理后台首页与关键列表，让企业版 PC 更接近门店经营和管理者决策的真实工作流。',
    role: 'UI / 产品设计',
    focus: '工作台 · 数据看板 · 库存列表',
    output: '页面改版 · 交互状态 · 高保真',
    heroImage: 'assets/enterprise-pc-home.png',
    contextTitle: '让工作台先回答“现在要做什么”',
    context: '企业版 PC 承接采购、仓储、销售、财务和数据仓库等多条业务线。改版重点不是增加信息，而是重新安排信息的优先级，让管理者先看到经营状态，再进入高频任务和具体列表。',
    problems: ['多业务导航同时存在，入口层级和业务关系不够清楚。', '销售指标、库存预警、采购分析和机器状态信息密度高。', '快捷入口、经营数据和列表操作之间缺少连续的任务顺序。'],
    solution: '以工作台作为经营入口，建立“快捷任务—核心指标—风险提醒—业务数据—列表操作”的阅读和操作节奏。',
    solutionPoints: ['把新增采购单、销售发货、新到货入库等高频动作前置。', '用指标卡、风险模块和分业务数据区块组织复杂信息。', '在库存列表与筛选中补充状态、范围和操作反馈，减少反复查找。'],
    result: '完成企业版首页、经营数据、快捷入口和库存列表筛选等高保真页面，为后续模块扩展提供统一结构。',
    tags: ['PC 后台', '工作台', '数据看板', '信息架构'],
    gallery: ['assets/enterprise-pc-home.png', 'assets/enterprise-pc-inventory.png']
  },
  crmAI: {
    kicker: 'CASE STUDY / 03',
    index: '03 / CRM AI PRODUCT',
    title: 'CRM AI 销售助手 · 从会话到跟进',
    summary: '围绕 AI 自动会话、新建会话、线索/客户管理、通话资料、客户分析、跟进建议和字段回填，设计默认、运行、成功、失败、重试和权限等完整状态，让 AI 结果能继续被使用。',
    role: '产品 / UI / 交互设计',
    focus: 'AI 会话 · 线索 · 客户 · 证据',
    output: '高保真交付 · 可点击原型 · 状态矩阵',
    heroImage: 'assets/crm-ai-result.png',
    contextTitle: '让 AI 结果从“生成内容”变成下一步行动',
    context: 'CRM AI 销售助手需要连接销售线索、客户资料、通话记录和字段更新。设计重点是让使用者知道 AI 分析基于什么、得到什么结论，以及哪些内容需要确认后才能写回系统。',
    problems: ['AI 会话存在默认、生成中、完成、失败、重试和权限不足等状态。', '分析依据与客户资料较多，需要让用户知道结论来自哪些资料。', 'AI 生成内容不能直接覆盖业务字段，需要提供确认和回填动作。'],
    solution: '围绕“选择资料—运行分析—查看证据—确认字段—继续跟进”设计完整闭环。',
    solutionPoints: ['把 AI 自动会话、新建会话、线索管理和客户管理放进同一导航体系。', '在结果页明确客户分析、跟进建议、沟通摘要和分析依据。', '用确认字段回填、重试、失败提示和权限状态保证结果可控。'],
    result: '完成从 AI 会话到线索/客户跟进的高保真交付，覆盖结果证据、字段回填和异常状态。',
    tags: ['AI 产品', 'CRM', '状态矩阵', '结果可控'],
    gallery: ['assets/crm-ai-result.png', 'assets/crm-ai-evidence.png']
  },
  privateMall: {
    kicker: 'PROJECT / 04',
    index: '04 / PRIVATE MALL',
    title: '私域商城小程序 · 从许愿到下单',
    summary: '围绕许愿瓶、商品分类、商品详情、收藏、确认订单、订单状态和回收设备信息，整理一套私域商城小程序的用户路径。',
    role: 'UI / 产品设计',
    focus: '许愿 · 商品 · 订单 · 回收',
    output: '小程序 UI · 用户流程 · 状态页面',
    heroImage: 'assets/private-mall-product.png',
    contextTitle: '把“找不到想要的设备”变成可继续跟进的愿望',
    context: '私域商城既要承接已有商品，也要承接用户暂时找不到目标设备时的许愿需求，同时还包含下单、订单跟踪和回收设备等流程。',
    problems: ['商品、分类与许愿入口需要同时存在，但不能互相干扰。', '许愿状态、商品状态和订单状态需要让用户看得懂。', '回收设备信息包含估价、设备信息和地址等多步填写。'],
    solution: '用许愿瓶和愿望榜单承接需求，用分类、详情、收藏和订单完成购买闭环，再把回收流程拆成连续的信息填写。',
    solutionPoints: ['建立许愿瓶、我的愿望和愿望榜单的内容关系。', '用商品详情、布局切换、收藏和订单详情支撑浏览与购买。', '通过分步表单承接地址、估价、设备信息和回收记录。'],
    result: '形成覆盖许愿、浏览、下单、订单状态、收藏和回收记录的完整小程序 UI。',
    tags: ['小程序', '私域商城', '电商流程', '分步表单']
  },
  chainApp: {
    kicker: 'PROJECT / 05',
    index: '05 / CHAIN APP',
    title: '万机之家连锁版 App · 门店经营入口',
    summary: '覆盖门店工作台、采购、销售、库存、会员、客流、考勤、门店运营 SOP 和个人中心等连锁版 App 场景。',
    role: 'UI / 产品设计',
    focus: '门店工作台 · 经营模块 · 角色入口',
    output: 'App UI · 导航结构 · 业务入口',
    heroImage: 'assets/chain-app-workbench.png',
    contextTitle: '让店长和店员在同一套 App 里找到自己的任务',
    context: '连锁版 App 同时服务门店经营和个人中心，既包含采购、销售、库存等主业务，也包含员工和门店管理相关功能。',
    problems: ['业务模块多，首页需要兼顾高频任务和完整功能。', '不同角色关注的门店、岗位和个人信息不同。', '登录、设置、门店管理与经营页面需要保持统一体验。'],
    solution: '以首页工作台为主入口，用全部功能和个人中心承接低频管理动作，保持底部导航和业务模块的一致性。',
    solutionPoints: ['将采购、销售、会员、客流等功能整理为清晰的模块入口。', '通过门店、角色和个人中心信息帮助用户确认当前工作环境。', '补齐登录、修改密码、设置和退出等基础状态。'],
    result: '完成连锁版 App 的首页、登录、全部功能和个人中心等核心页面。',
    tags: ['连锁 App', '门店经营', '导航设计', '角色场景']
  },
  storeApp: {
    kicker: 'PROJECT / 06',
    index: '06 / STORE APP',
    title: '门店版 App · 维修与订单状态',
    summary: '覆盖 IMEI 入库、服务费管理、维修开单、订单超时、私域商城分享、闲鱼授权和消息通知等门店端场景。',
    role: 'UI / 交互设计',
    focus: 'IMEI · 维修 · 订单 · 分享',
    output: 'App UI · 异常状态 · 操作引导',
    heroImage: 'assets/store-app-repair.png',
    contextTitle: '把门店现场的复杂状态变成可处理的提醒',
    context: '门店版 App 需要处理设备入库、维修留机、订单交付、分享商品和授权等现场任务，状态变化快，操作边界也多。',
    problems: ['IMEI、成本、服务费和设备信息需要在入库时集中核对。', '维修订单存在超时提醒、交付当天提醒和多种订单状态。', '授权、分享、消息通知等功能需要清楚告知当前状态和下一步。'],
    solution: '用状态提醒、分步表单和操作引导把高风险任务拆开，并为正常、空值和超时场景提供不同反馈。',
    solutionPoints: ['在入库详情中明确 IMEI、型号、成本和服务费关系。', '通过红点、倒计时和订单状态提示门店及时处理。', '为私域分享、闲鱼授权和消息通知设计完整的操作状态。'],
    result: '完成门店端入库、维修、订单、分享和授权等高频流程的 UI 与状态设计。',
    tags: ['门店 App', 'IMEI', '维修流程', '超时提醒']
  },
  storePC: {
    kicker: 'PROJECT / 07',
    index: '07 / STORE PC',
    title: '门店版 PC · 工作台与经营数据',
    summary: '围绕工作台、销售、库存、私域商城、客户经营、AI 销售管家、财务和统计，构建门店版 PC 的经营数据入口。',
    role: 'UI / 产品设计',
    focus: '经营数据 · 快捷入口 · 门店切换',
    output: 'PC UI · 数据模块 · 组件框架',
    heroImage: 'assets/store-pc-workbench.png',
    contextTitle: '让店长从经营数据直接进入具体任务',
    context: '门店版 PC 的核心是工作台：店长需要快速看到收入、毛利和业务数据，也要能进入库存、维修、会员等具体模块。',
    problems: ['经营数据和业务模块并列存在，需要建立明确层级。', '门店切换、时间筛选和指标卡需要形成统一的查看方式。', '快捷入口需要支持高频任务，同时保留完整统计模块。'],
    solution: '用工作台统一承接数据概览、快捷入口、统计与门店筛选，让信息查看和任务执行保持同一条路径。',
    solutionPoints: ['将销售、库存、盘点、调拨和各类统计整理为快捷入口。', '通过时间、分店和业务数据模块组织经营信息。', '补充门店版与企业版切换、收起菜单和工作台状态。'],
    result: '形成门店版 PC 工作台、经营数据和业务模块入口的 UI 方案。',
    tags: ['门店 PC', '经营看板', '数据筛选', '组件框架']
  },
  recycle: {
    kicker: 'PROJECT / 08',
    index: '08 / RECYCLE ORDER',
    title: '回收接单侠 · 线索到订单',
    summary: '围绕发布线索、线索大厅、指派、回收订单、订单详情、线索结算、通知中心和超时状态，设计回收业务的完整状态链。',
    role: 'UI / 交互设计',
    focus: '线索 · 接单 · 上门 · 结算',
    output: '移动端 UI · 状态矩阵 · 业务流程',
    heroImage: 'assets/recycle-leads.png',
    contextTitle: '让每条回收线索都能被清楚地接住',
    context: '回收接单侠的业务从发布线索开始，经过接单、拨打、上门、成交或取消，并需要处理超时、被他人接单和结算等情况。',
    problems: ['线索、订单和通知是连续业务，不能只按页面孤立设计。', '待接单、待上门、已成交、已取消和超时状态较多。', '发布线索需要填写地址、机型、时间和线索费等信息。'],
    solution: '以线索和订单状态为骨架，设计线索大厅、详情、倒计时、结算和通知中心的连续体验。',
    solutionPoints: ['用状态标签和倒计时帮助接单者判断优先级。', '为发布线索、城市选择、时间选择和线索费设置连续表单。', '补齐空数据、已读、取消、成交和超时等异常状态。'],
    result: '完成从发布线索、接单、拨打、上门到成交/取消/结算的移动端 UI 状态体系。',
    tags: ['回收业务', '线索管理', '订单状态', '异常处理']
  }
};

const SAMPLE_JDS = {
  product: `我们正在寻找一名产品设计师，负责 ToB / SaaS 产品的体验设计工作。

你将参与用户研究、需求分析、信息架构、复杂业务流程、交互设计和高保真原型，和产品及研发团队一起推进库存、商品、订单等后台场景落地。熟悉 Figma，能够建立组件和设计规范，有 B 端 / ERP 产品经验更佳。`,
  ux: `负责企业服务产品的用户体验设计，从用户与业务场景出发，完成用户流程、信息架构、交互原型和视觉方案。

希望你能够处理复杂状态、异常流程和后台任务，也能和产品、研发协作，把设计方案推进到上线。熟悉 Figma、设计系统和可用性验证。`,
  strategy: `加入体验策略团队，参与服务蓝图、业务流程梳理和用户研究项目，为复杂的门店与企业服务场景建立清晰的问题定义与体验方案。

需要良好的结构化思维、跨团队沟通能力，以及把研究结论转化为信息架构、交互原型和可落地设计的能力。`
};

const SKILLS = [
  {
    label: 'B 端 SaaS / ERP',
    keywords: ['tob', 'b端', 'saas', 'erp', '后台', '企业版', '连锁', '门店', '企业服务'],
    weight: 18,
    evidence: ['企业版 App / PC UI', '万机之家连锁版 App', 'ERP 50+ 项需求'],
    advice: '优先讲一个复杂 B 端案例，说明角色、业务约束和你的设计取舍。'
  },
  {
    label: '业务流程 / 信息架构',
    keywords: ['信息架构', '内容架构', '导航', '结构梳理', '分类', '业务流程', '任务路径', '流程梳理'],
    weight: 16,
    evidence: ['工作台与数据中心导航重构', '角色与任务分析', '订单到对账的业务闭环'],
    advice: '准备一组前后对比，说明你如何缩短路径、整理层级并保留关键状态。'
  },
  {
    label: '库存 / 商品 / 订单',
    keywords: ['库存', '商品', '采购', '销售', '订单', '维修', '出库', '调拨', '盘点', '收银'],
    weight: 13,
    evidence: ['多门店配件库存', 'IMEI 风险拦截', '商品与订单流程'],
    advice: '把最贴近 JD 的业务模块讲深，补充异常、权限和批量操作等细节。'
  },
  {
    label: '交互原型与状态设计',
    keywords: ['交互设计', '交互', '用户流程', '流程设计', '任务流', '高保真', '状态反馈', '异常状态', '空状态', '提交失败'],
    weight: 13,
    evidence: ['HTML 交互原型', '空状态 / 提交失败 / 风险提醒', '高保真流程验证'],
    advice: '准备一条完整任务流，重点说明边界状态、错误反馈和提交前后的变化。'
  },
  {
    label: 'UI / 视觉与界面',
    keywords: ['视觉', '界面', 'ui', '视觉方案', '页面', '设计表现'],
    weight: 10,
    evidence: ['企业版 App / PC UI', '门店版 App / PC UI', '回收接单侠全 UI'],
    advice: '挑一个代表页面，说明层级、信息密度和视觉决策如何服务业务。'
  },
  {
    label: '组件库 / Design System',
    keywords: ['设计系统', '组件', '组件库', '规范', 'tokens', 'design system', '设计语言', '复用'],
    weight: 10,
    evidence: ['门店 PC 组件库与设计规范', 'B 端后台组件规则', 'Figma 组件与页面复用'],
    advice: '准备组件复用、命名或规范沉淀的实际例子，说明它如何帮助团队交付。'
  },
  {
    label: '数据中心 / 经营分析',
    keywords: ['数据中心', '经营分析', '数据看板', '仪表盘', '指标', '可视化', '趋势'],
    weight: 8,
    evidence: ['数据中心与经营看板', '核心指标信息组织', '风险前置与渐进披露'],
    advice: '说明你如何让指标、趋势和行动入口形成关系，而不是只做展示。'
  },
  {
    label: 'HTML / AI 辅助原型',
    keywords: ['html', 'ai', '原型开发', '交互原型', '快速原型'],
    weight: 7,
    evidence: ['AI 辅助 HTML 原型', '交互逻辑与错误状态细化', '快速验证复杂流程'],
    advice: '展示一个从需求到可运行原型的例子，说明你如何人工校验逻辑和细节。'
  },
  {
    label: '用户研究 / 需求分析',
    keywords: ['用户研究', '用户访谈', '访谈', '洞察', '用研', '需求分析', '竞品分析'],
    weight: 6,
    evidence: ['业务与用户场景研究', '竞品分析与需求拆解', '需求 / 技术 / 设计评审'],
    advice: '准备一个研究或需求分析例子，说明结论怎样影响了信息架构、流程或页面方案。'
  },
  {
    label: '跨团队交付',
    keywords: ['产品经理', '研发', '开发', '跨团队', '协作', '推进', '上线', '验收', '评审', '交付'],
    weight: 5,
    evidence: ['20 次需求 / 技术 / 设计评审', '开发沟通与验收', '内部上线的财务模块'],
    advice: '补充你如何和产品、研发对齐，并通过评审、标注和验收推动方案落地。'
  }
];

const roleSelect = $('#roleSelect');
const jdInput = $('#jdInput');
const analyzeBtn = $('#analyzeBtn');
const loadSample = $('#loadSample');
const matchResult = $('#matchResult');
const scoreRing = $('#scoreRing');
const scoreValue = $('#scoreValue');
const scoreTitle = $('#scoreTitle');
const scoreDesc = $('#scoreDesc');
const matchedSkills = $('#matchedSkills');
const gapSkills = $('#gapSkills');
const evidenceList = $('#evidenceList');
const resultTip = $('#resultTip');

function normalize(value) {
  return value.toLowerCase().replace(/[\s\n\r·•/、，。！？：；（）()\-]+/g, '');
}

function getMatchResult(jd) {
  const text = normalize(`${jd} ${roleSelect.value}`);
  const matched = SKILLS.filter((skill) => skill.keywords.some((keyword) => text.includes(normalize(keyword))));
  const gaps = SKILLS.filter((skill) => !matched.includes(skill)).sort((a, b) => b.weight - a.weight);
  const matchedWeight = matched.reduce((sum, skill) => sum + skill.weight, 0);
  const lengthBonus = Math.min(8, Math.max(0, Math.round((jd.length - 100) / 55)));
  const score = Math.min(98, Math.max(8, matchedWeight + lengthBonus));
  return { matched, gaps, score };
}

function resultCopy(score) {
  if (score >= 85) return { title: '项目证据有清晰交集。', desc: '当前 JD 与简历 / 作品集资料库有较多重合，优先讲最接近的案例和可核验结果。' };
  if (score >= 70) return { title: '有清晰的能力交集。', desc: '方向是对的，面试前把最接近岗位的案例讲得更具体，会明显提升说服力。' };
  if (score >= 55) return { title: '有基础，但需要补证据。', desc: '你已经覆盖了一部分要求，可以优先补一到两个高频能力点，再决定如何投递。' };
  return { title: '先补齐核心证据。', desc: '这份 JD 和当前资料库的交集偏少，建议先找出最接近的项目或调整目标岗位。' };
}

function animateNumber(target, value) {
  const start = Number(target.textContent) || 0;
  const startTime = performance.now();
  const duration = 650;
  function tick(now) {
    const progress = Math.min(1, (now - startTime) / duration);
    const eased = 1 - Math.pow(1 - progress, 3);
    target.textContent = Math.round(start + (value - start) * eased);
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function analyzeJD() {
  const jd = jdInput.value.trim();
  if (!jd) {
    showToast('先粘贴一段 JD，再来分析匹配度。');
    jdInput.focus();
    return;
  }
  const { matched, gaps, score } = getMatchResult(jd);
  const copy = resultCopy(score);
  matchResult.classList.remove('is-hidden');
  scoreRing.style.setProperty('--score-angle', `${score * 3.6}deg`);
  animateNumber(scoreValue, score);
  scoreTitle.textContent = copy.title;
  scoreDesc.textContent = copy.desc;
  matchedSkills.innerHTML = matched.length ? matched.map((skill) => `<span class="skill-chip">${skill.label}</span>`).join('') : '<span class="gap-item">暂未识别到明显命中项</span>';
  gapSkills.innerHTML = gaps.slice(0, 3).map((skill) => `<span class="gap-item">${skill.label}</span>`).join('') || '<span class="gap-item">当前没有明显缺口</span>';
  const evidence = [...new Set(matched.flatMap((skill) => skill.evidence))].slice(0, 6);
  evidenceList.innerHTML = evidence.length ? evidence.map((item) => `<span class="evidence-item">${item}</span>`).join('') : '<span class="gap-item">等待 JD 命中对应项目</span>';
  const topGap = gaps[0];
  resultTip.textContent = topGap ? `建议：${topGap.advice}` : '建议：把最能证明这些能力的项目过程写进案例摘要，避免只列技能名称。';
  matchResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function showToast(message) {
  const toast = $('#toast');
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove('show'), 2600);
}

analyzeBtn.addEventListener('click', analyzeJD);
loadSample.addEventListener('click', () => {
  jdInput.value = SAMPLE_JDS[roleSelect.value];
  jdInput.focus();
  analyzeJD();
});
roleSelect.addEventListener('change', () => {
  if (!jdInput.value.trim() || Object.values(SAMPLE_JDS).includes(jdInput.value)) {
    jdInput.value = SAMPLE_JDS[roleSelect.value];
    analyzeJD();
  }
});

const dialog = $('#projectDialog');
const closeDialog = $('#closeDialog');

function openProjectCase(projectId) {
  const project = PROJECTS[projectId];
  if (!project) return;
  $('#dialogKicker').textContent = project.kicker;
  $('#dialogIndex').textContent = project.index;
  $('#dialogTitle').textContent = project.title;
  $('#dialogSummary').textContent = project.summary;
  $('#dialogRole').textContent = project.role;
  $('#dialogFocus').textContent = project.focus;
  $('#dialogOutput').textContent = project.output;
  $('#dialogHeroImage').src = project.heroImage;
  $('#dialogHeroImage').alt = `${project.title} 代表画面`;
  $('#dialogContextTitle').textContent = project.contextTitle;
  $('#dialogContext').textContent = project.context;
  $('#dialogProblems').innerHTML = project.problems.map((item) => `<li>${item}</li>`).join('');
  $('#dialogSolution').textContent = project.solution;
  $('#dialogSolutionList').innerHTML = project.solutionPoints.map((item) => `<li>${item}</li>`).join('');
  $('#dialogResult').textContent = project.result;
  $('#dialogTags').innerHTML = project.tags.map((tag) => `<span>${tag}</span>`).join('');
  const gallery = project.gallery || [project.heroImage];
  $('#dialogGallery').innerHTML = gallery.map((src, index) => `<figure><img src="${src}" alt="${project.title} 过程画面 ${index + 1}" /><figcaption>${project.index} / 过程画面 ${String(index + 1).padStart(2, '0')}</figcaption></figure>`).join('');
  dialog.showModal();
  $('.case-dialog-scroll').scrollTop = 0;
}

$$('.case-trigger').forEach((button) => {
  button.addEventListener('click', (event) => {
    event.stopPropagation();
    openProjectCase(button.dataset.project || button.closest('[data-project]')?.dataset.project);
  });
});
closeDialog.addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });

const navToggle = $('.nav-toggle');
const nav = $('.nav');
navToggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});
$$('.nav a').forEach((link) => link.addEventListener('click', () => {
  nav.classList.remove('is-open');
  navToggle.setAttribute('aria-expanded', 'false');
}));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: .08 });
$$('.reveal').forEach((element) => revealObserver.observe(element));

const cursorGlow = $('.cursor-glow');
window.addEventListener('pointermove', (event) => {
  cursorGlow.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
}, { passive: true });

jdInput.value = SAMPLE_JDS.product;
window.setTimeout(analyzeJD, 420);
