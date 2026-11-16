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
    heroImage: 'assets/enterprise-app-list.png',
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
    heroImage: 'assets/crm-home.png',
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
    heroImage: 'assets/private-mall-home.png',
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
    heroImage: 'assets/chain-app-home.png',
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
    tags: ['门店 App', 'IMEI', '维修流程', '超时提醒'],
    gallery: ['assets/store-app-repair.png']
  },
  storePC: {
    kicker: 'PROJECT / 07',
    index: '07 / STORE PC',
    title: '门店版 PC · 工作台与经营数据',
    summary: '围绕工作台、销售、库存、私域商城、客户经营、AI 销售管家、财务和统计，构建门店版 PC 的经营数据入口。',
    role: 'UI / 产品设计',
    focus: '经营数据 · 快捷入口 · 门店切换',
    output: 'PC UI · 数据模块 · 组件框架',
    heroImage: 'assets/store-pc-home.png',
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
    heroImage: 'assets/recycle-home.png',
    contextTitle: '让每条回收线索都能被清楚地接住',
    context: '回收接单侠的业务从发布线索开始，经过接单、拨打、上门、成交或取消，并需要处理超时、被他人接单和结算等情况。',
    problems: ['线索、订单和通知是连续业务，不能只按页面孤立设计。', '待接单、待上门、已成交、已取消和超时状态较多。', '发布线索需要填写地址、机型、时间和线索费等信息。'],
    solution: '以线索和订单状态为骨架，设计线索大厅、详情、倒计时、结算和通知中心的连续体验。',
    solutionPoints: ['用状态标签和倒计时帮助接单者判断优先级。', '为发布线索、城市选择、时间选择和线索费设置连续表单。', '补齐空数据、已读、取消、成交和超时等异常状态。'],
    result: '完成从发布线索、接单、拨打、上门到成交/取消/结算的移动端 UI 状态体系。',
    tags: ['回收业务', '线索管理', '订单状态', '异常处理'],
    gallery: ['assets/recycle-home.png', 'assets/recycle-lead-motion.gif']
  }
};

const PRODUCT_CASES = {
  superAdmin: {
    kicker: 'PRODUCT CASE / P01',
    index: 'P01 / BACKEND PRODUCT DESIGN',
    title: '超管后台优化一期 · 把复杂财务做成可追溯流程',
    summary: '围绕权益记录、退款流水、财务拆分、均摊计划、收款订单、业绩归属、快速查询授权与审计日志，整理一套可核对、可复盘的超管后台交互原型。',
    role: '产品 / 交互 / 原型设计',
    focus: '财务流程 · 权限 · 审计',
    output: 'HTML 交互原型 · 状态流程 · 弹窗与表格',
    visualType: 'finance-flow',
    contextTitle: '后台最怕“改得动，但追不回去”',
    context: '超管后台同时承接权益购买、退款、财务结算、销售归属和授权查询等任务。设计重点不是把页面做满，而是让每一次调整都有前置条件、确认节点和后续记录。',
    problems: ['权益、退款、均摊和收款记录跨多个业务节点，用户需要知道当前状态和下一步。', '业绩归属同时存在自动判定、人工申报和财务复核，角色边界容易混淆。', '查询授权和审计日志涉及权限与追溯，不能只靠页面上的一个按钮解决。'],
    solution: '以“记录链路 + 角色权限 + 状态反馈”为骨架，把复杂后台拆成可以执行和验收的连续流程。',
    solutionPoints: ['把退款流水独立成审计记录，并让退款、均摊终止和财务审核有清晰状态。', '区分自动判定、人工申报、财务复核和结果回看，避免把不同角色塞进同一动作。', '为快速查询授权、操作日志和查询审计补充范围、条件、时间与命中数量等信息。'],
    result: '形成一套覆盖权益、财务、业绩归属、授权与审计的后台交互原型；当前展示的是方案和原型交付，不虚构线上数据结果。',
    evidence: '证据来自你提供的“超管后台优化一期”HTML 原型：包含退款流水、财务拆分、均摊计划、收款订单、业绩归属判定/复核、快速查询授权和审计日志等可运行页面与状态。',
    tags: ['后台产品', '财务流程', '权限设计', '审计追溯'],
    gallery: []
  },
  smartReplenish: {
    kicker: 'PRODUCT CASE / P02',
    index: 'P02 / APP + PC PRODUCT DESIGN',
    title: '门店版智能补货 · 让建议有规则，也有解释',
    summary: '从销售数据、库存维度和门店权限出发，设计可解释的智能补货建议，让店长知道为什么补、补多少，以及修改之后发生了什么。',
    role: '产品 / UI / 交互设计',
    focus: '规则计算 · 权限 · 通知 · 追溯',
    output: '需求方案 · App/PC 原型 · 验收口径',
    visualType: 'replenishment-rule',
    contextTitle: '补货建议不能只给一个数字',
    context: '门店需要根据销量和库存快速判断补货，但人工估算难以稳定复用，也很难解释建议从哪里来。方案把规则、数据口径、权限和通知拆开，让建议能够被查看、修改和追溯。',
    problems: ['不同门店、品类和规格需要按同一套维度计算，否则建议无法复用。', '管理员和普通员工的查看、编辑、通知权限不同，需要在流程里显式区分。', '没有销量、缺少属性或修改建议后，系统都要给出可理解的状态反馈。'],
    solution: '以“统一规则—明确口径—门店查看—修改留痕”为主线，让 App 与 PC 共享同一批规则、数据和状态。',
    solutionPoints: ['明确日均销量、可销售天数、目标库存和建议补货量的计算关系。', '按店铺、品类、品牌、型号和规格展开数据，并显式提示缺失属性。', '让管理员配置规则、普通员工按权限查看；补货量可编辑，系统计算量保持只读并记录修改。'],
    result: '把一个依赖经验的补货任务整理成可配置、可解释、可验证的产品流程；需求文档和原型均保留规则、通知、日志及边界口径。',
    evidence: '证据来自 ERP 需求库中的《门店版智能补货 PRD v4》和配套原型：包含规则生效时间、计算公式、三层权限、通知历史、修改日志、导出和边界状态。',
    tags: ['产品逻辑', '规则型产品', 'App + PC', '权限与日志'],
    gallery: []
  },
  warningLinkage: {
    kicker: 'PRODUCT CASE / P03',
    index: 'P03 / PC PRODUCT DESIGN',
    title: '企业版首页预警联动 · 从发现问题到进入处理',
    summary: '把库存年龄、未到货和相关列表接到企业版 PC 首页，用预警卡片降低重复查找成本，同时保留阈值、筛选、空态、错误态和权限边界。',
    role: '产品 / PC 交互设计',
    focus: '首页预警 · 阈值设置 · 列表联动',
    output: '需求方案 · HTML 原型 · 验收状态',
    visualType: 'warning-linkage',
    contextTitle: '首页不只是展示数据，还要把人带到下一步',
    context: '用户通常先在工作台发现库存或到货异常，再进入列表处理。预警联动的价值，是让首页数量和列表筛选保持同一语义，减少反复进入页面确认的成本。',
    problems: ['首页卡片、列表数量和筛选条件如果口径不同，会造成用户对数据的信任下降。', '阈值设置仍在列表页，首页需要说明提醒来源和进入后的处理路径。', '无数据、接口异常和权限不足不能共用一个空白状态。'],
    solution: '围绕“卡片发现—保留语义进入列表—按设置继续处理”设计跨页面联动，并把未确认的边界单独列出来。',
    solutionPoints: ['在既有销售看板和库存信息之间安排预警卡片，不打断工作台主层级。', '让卡片数量、列表筛选、清空条件和阈值设置保持关联。', '把时间锚点、边界符号、去重规则、权限和异常状态列为验收问题，而不是默默猜测。'],
    result: '形成一套能从首页进入业务处理的 PC 交互方案；原需求处于评审草案阶段，网站会明确标注边界待确认。',
    evidence: '证据来自 ERP 需求库中的《首页库存预警与未到货预警联动》PRD 与 HTML 原型。文档明确区分了已确定范围、待确认口径和本地演示数据，适合展示产品判断过程。',
    tags: ['PC 产品', '跨页面联动', '异常状态', '验收意识'],
    gallery: []
  }
};

const CASE_LIBRARY = { ...PROJECTS, ...PRODUCT_CASES };

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

const jdInput = $('#jdInput');
const analyzeBtn = $('#analyzeBtn');
const matchResult = $('#matchResult');
const scoreRing = $('#scoreRing');
const scoreValue = $('#scoreValue');
const scoreTitle = $('#scoreTitle');
const scoreDesc = $('#scoreDesc');
const scoreStatus = $('#scoreStatus');
const hardGate = $('#hardGate');
const radarChart = $('#radarChart');
const dimensionCards = $('#dimensionCards');
const matchedSkills = $('#matchedSkills');
const gapSkills = $('#gapSkills');
const evidenceList = $('#evidenceList');
const jdTrace = $('#jdTrace');
const resumeTrace = $('#resumeTrace');
const jdTraceCount = $('#jdTraceCount');
const resumeTraceCount = $('#resumeTraceCount');
const resultTip = $('#resultTip');
let lastAnalyzedJD = '';

const RESUME_PROFILE = {
  years: 5,
  locations: ['成都', '远程'],
  employment: '全职',
  salary: null,
  availability: null,
  tracks: ['b端', 'saas', 'erp', '后台', '企业版', '连锁', '门店', 'crm', '小程序', '库存', '采购', '销售', '订单', '维修', '回收', '商城'],
  stabilityScore: 78,
  stabilityEvidence: ['5 年+ UI / UX 设计经验', '连续聚焦 B 端 SaaS、ERP、后台与复杂流程', '有从需求、原型到开发验收的连续交付记录']
};

const HARD_SKILL_CATALOG = [
  { label: 'Figma', terms: ['figma'], evidence: 'Figma 作品集与页面组件', resume: true },
  { label: 'ERP / SaaS', terms: ['erp', 'saas', 'b端', '企业级', '企业服务'], evidence: 'ERP 50+ 项需求与 B 端 SaaS 项目', resume: true },
  { label: '交互原型', terms: ['交互设计', '交互', '原型', '高保真', 'axure', 'protopie'], evidence: 'HTML 交互原型与高保真流程验证', resume: true },
  { label: 'UI / 视觉', terms: ['ui', '视觉', '界面', 'sketch', 'adobe xd'], evidence: 'App / PC / 后台 / 小程序 UI', resume: true },
  { label: 'HTML / AI 原型', terms: ['html', 'css', 'ai辅助', 'ai工具', '原型开发'], evidence: 'AI 辅助 HTML 原型交付', resume: true },
  { label: 'Design System', terms: ['组件库', '设计系统', 'design system', '设计规范', 'tokens'], evidence: '门店 PC 组件库与设计规范', resume: true },
  { label: '用户研究 / 需求分析', terms: ['用户研究', '用户访谈', '需求分析', '竞品分析', '用户洞察'], evidence: '业务与用户场景研究、需求拆解', resume: true },
  { label: '数据看板', terms: ['数据看板', '数据中心', '仪表盘', '数据可视化', '经营分析'], evidence: '数据中心与经营看板', resume: true },
  { label: 'SQL / 数据库', terms: ['sql', '数据库', 'mysql', 'postgresql'], evidence: '当前简历资料库未记录该技能', resume: false },
  { label: '前端开发', terms: ['javascript', 'typescript', 'react', 'vue', '前端开发'], evidence: '当前简历资料库未记录该技能', resume: false }
];

const SOFT_SKILL_CATALOG = [
  { label: '沟通与跨团队协作', terms: ['沟通', '协作', '跨部门', '跨团队', '产品研发'], evidence: '需求 / 技术 / 设计评审、开发沟通与验收' },
  { label: '需求拆解与逻辑', terms: ['需求拆解', '逻辑思维', '业务理解', '问题分析', '结构化'], evidence: '从业务目标、用户任务到信息架构的拆解' },
  { label: '推动与落地', terms: ['推动', '推进', '落地', '项目管理', '跟进'], evidence: 'HTML 原型、开发沟通与内部上线财务模块' },
  { label: '用户思维 / 研究', terms: ['用户思维', '用户导向', '用户体验', '客户对接', '同理心'], evidence: '业务与用户场景研究、竞品分析' },
  { label: '文档与复盘', terms: ['文档', '复盘', '总结', '验收', '评审'], evidence: '需求、验收、研发接入说明与自检记录' },
  { label: '学习与抗压', terms: ['学习能力', '抗压', '适应', '快速学习'], evidence: '当前公开资料未展开具体行为案例' }
];

function normalize(value) {
  return value.toLowerCase().replace(/[\s\n\r·•/、，。！？：；（）()\-]+/g, '');
}

function escapeHTML(value) {
  return String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
}

function containsAny(text, terms) {
  const normalized = normalize(text);
  return terms.some((term) => normalized.includes(normalize(term)));
}

function isRequiredTerm(jd, terms) {
  const raw = jd.toLowerCase();
  return terms.some((term) => {
    const needle = term.toLowerCase();
    const index = raw.indexOf(needle);
    if (index < 0) return false;
    const nearby = raw.slice(Math.max(0, index - 34), Math.min(raw.length, index + needle.length + 42));
    return /必须|必备|硬性|至少|熟练|精通|要求|需具备|负责/.test(nearby);
  });
}

function extractMinimumYears(jd) {
  const matches = [...jd.matchAll(/(?:至少|不少于|相关经验|工作经验|经验要求|拥有)[^\n。；;]{0,12}(\d+(?:\.\d+)?)\s*年/g)];
  return matches.length ? Math.max(...matches.map((match) => Number(match[1]))) : 0;
}

function getHardSkillDimension(jd) {
  const mentioned = HARD_SKILL_CATALOG.filter((skill) => containsAny(jd, skill.terms));
  const matched = mentioned.filter((skill) => skill.resume);
  const missingRequired = mentioned.filter((skill) => !skill.resume && isRequiredTerm(jd, skill.terms));
  const score = mentioned.length ? Math.max(0, Math.round((matched.length / mentioned.length) * 100 - missingRequired.length * 12)) : 62;
  return {
    score,
    matched,
    mentioned,
    missingRequired,
    highlights: matched.map((skill) => `${skill.label}：${skill.evidence}`),
    risks: missingRequired.map((skill) => `必填硬技能缺口：${skill.label}`),
    jd: mentioned.length ? `识别到 ${mentioned.map((skill) => skill.label).join('、')}；${missingRequired.length ? `其中 ${missingRequired.map((skill) => skill.label).join('、')} 未在资料库中出现。` : '当前资料库均有对应证据。'}` : 'JD 暂未识别到明确工具或技术栈，硬技能按保守分处理。',
    resume: matched.length ? matched.map((skill) => skill.evidence) : ['当前简历与作品集资料库没有对应硬技能证据。']
  };
}

function getExperienceDimension(jd) {
  const requiredYears = extractMinimumYears(jd);
  const yearsScore = requiredYears ? Math.min(100, Math.round((RESUME_PROFILE.years / requiredYears) * 100)) : 84;
  const industryMentioned = containsAny(jd, ['b端', 'saas', 'erp', '后台', '企业版', '连锁', '门店', '企业服务', 'to b']);
  const industryScore = industryMentioned ? (containsAny(jd, RESUME_PROFILE.tracks) ? 100 : 52) : 80;
  const roleMentioned = containsAny(jd, ['产品设计', 'ui设计', 'ux', '交互设计', '设计师', '视觉设计']);
  const roleScore = roleMentioned ? 100 : 76;
  const projectMentioned = containsAny(jd, ['库存', '采购', '销售', '订单', '维修', '回收', '循环经济', 'crm', '商城', '小程序']);
  const projectScore = projectMentioned ? 94 : 76;
  const score = Math.min(100, Math.round(yearsScore * .35 + industryScore * .3 + roleScore * .2 + projectScore * .15));
  const risks = requiredYears && RESUME_PROFILE.years < requiredYears ? [`年限门槛：JD 要求 ${requiredYears} 年，资料库记录为 5 年+`] : [];
  return {
    score,
    requiredYears,
    yearsMismatch: Boolean(requiredYears && RESUME_PROFILE.years < requiredYears),
    highlights: ['5 年+ UI / UX 设计经验', industryMentioned ? 'B 端 SaaS / ERP / 连锁业务经历' : '覆盖 App、PC、后台和小程序项目'],
    risks,
    jd: requiredYears ? `JD 提到至少 ${requiredYears} 年相关经验；同时检查了岗位类型、行业和项目业务是否对齐。` : 'JD 未写明明确年限门槛，按岗位类型、行业和项目业务做匹配。',
    resume: ['5 年+ UI / UX 设计经验', '企业连锁版、CRM、私域商城 0-1', 'ERP 50+ 项需求与复杂业务流程']
  };
}

function getSoftDimension(jd) {
  const mentioned = SOFT_SKILL_CATALOG.filter((skill) => containsAny(jd, skill.terms));
  const matched = mentioned.filter((skill) => skill.resume !== false);
  const missing = mentioned.filter((skill) => skill.resume === false);
  const score = mentioned.length ? Math.round((matched.length / mentioned.length) * 100) : 74;
  return {
    score,
    highlights: matched.map((skill) => `${skill.label}：${skill.evidence}`),
    risks: missing.map((skill) => `需要补充事实案例：${skill.label}`),
    jd: mentioned.length ? `从 JD 中识别到 ${mentioned.map((skill) => skill.label).join('、')} 等行为要求。` : 'JD 暂未出现明确软性要求，按已有行为证据给出基础分。',
    resume: matched.length ? matched.map((skill) => skill.evidence) : ['公开资料中已记录需求拆解、评审、协作与验收经验。']
  };
}

function getConstraintDimension(jd) {
  const checks = [];
  const risks = [];
  const highlights = [];
  if (containsAny(jd, ['成都', '远程', 'remote', '异地', '北京', '上海', '深圳', '广州', '杭州'])) {
    const locationMatch = containsAny(jd, ['成都', '远程', 'remote']);
    checks.push(locationMatch ? 100 : 45);
    if (locationMatch) highlights.push('地点：成都 / Remote 与资料库意向一致');
    else risks.push('工作地点需要确认：资料库意向为成都 / Remote');
  }
  if (/(薪资|薪酬|月薪|年薪|\d+\s*[kK]|\d+\s*万\/年)/.test(jd)) {
    checks.push(RESUME_PROFILE.salary ? 100 : 55);
    if (!RESUME_PROFILE.salary) risks.push('薪资：简历资料库暂未提供期望范围');
  }
  if (/出差|驻场|长期外派/.test(jd)) {
    checks.push(65);
    risks.push('出差 / 驻场：当前资料库未记录明确接受范围');
  }
  if (/到岗|入职|立即入职|可到岗/.test(jd)) {
    checks.push(60);
    risks.push('到岗时间：当前资料库未提供可到岗日期');
  }
  if (/全职|兼职|实习/.test(jd)) {
    const fullTime = /全职/.test(jd);
    checks.push(fullTime ? 100 : 55);
    if (fullTime) highlights.push('合作形式：全职方向一致');
  }
  const score = checks.length ? Math.round(checks.reduce((sum, value) => sum + value, 0) / checks.length) : 90;
  return {
    score,
    highlights,
    risks,
    jd: checks.length ? '识别了 JD 中的地点、薪资、出差、到岗或合作形式，并与资料库逐项比对。' : 'JD 暂未出现明确的地点、薪资、出差或到岗约束。',
    resume: ['所在地：成都', '求职方向：全职 UI / 产品设计', '期望薪资与可到岗时间：资料库暂未记录']
  };
}

function getStabilityDimension(jd) {
  let score = RESUME_PROFILE.stabilityScore;
  const risks = ['完整平均在职时长、离职原因和空窗期信息未在公开资料中展开'];
  if (/应届|校招|实习生/.test(jd)) {
    score = 42;
    risks.unshift('岗位偏应届 / 校招，与当前 5 年+ 经验方向不完全一致');
  }
  if (/稳定|长期发展|长期任职/.test(jd)) score = Math.min(100, score + 5);
  return {
    score,
    highlights: RESUME_PROFILE.stabilityEvidence,
    risks,
    jd: '这一维度是风险观察，不是能力淘汰项；当前按连续同赛道经历和资料完整度评估。',
    resume: RESUME_PROFILE.stabilityEvidence
  };
}

function getMatchResult(jd, gateEnabled) {
  const hard = getHardSkillDimension(jd);
  const experience = getExperienceDimension(jd);
  const soft = getSoftDimension(jd);
  const constraints = getConstraintDimension(jd);
  const stability = getStabilityDimension(jd);
  const dimensions = [
    { key: 'hard', label: '硬技能匹配', weight: 30, ...hard },
    { key: 'experience', label: '经验履历匹配', weight: 25, ...experience },
    { key: 'soft', label: '软性要求匹配', weight: 15, ...soft },
    { key: 'constraints', label: '期望与约束', weight: 15, ...constraints },
    { key: 'stability', label: '稳定性与风险', weight: 15, ...stability }
  ];
  const baseScore = Math.round(dimensions.reduce((sum, dimension) => sum + dimension.score * dimension.weight, 0) / 100);
  const gateReasons = [];
  if (hard.missingRequired.length) gateReasons.push(`缺少必填硬技能：${hard.missingRequired.map((skill) => skill.label).join('、')}`);
  if (experience.yearsMismatch) gateReasons.push(`年限未达到 JD 要求：${experience.requiredYears} 年`);
  const blocked = Boolean(gateEnabled && gateReasons.length);
  const score = blocked ? Math.min(59, baseScore) : baseScore;
  const highlights = [...new Set(dimensions.flatMap((dimension) => dimension.highlights))].slice(0, 8);
  const risks = [...new Set([...gateReasons, ...dimensions.flatMap((dimension) => dimension.risks)])].slice(0, 8);
  const evidence = [...new Set(dimensions.flatMap((dimension) => dimension.resume))].slice(0, 8);
  return { dimensions, baseScore, score, blocked, gateReasons, highlights, risks, evidence };
}

function resultCopy(score, blocked) {
  if (blocked) return { title: '硬性门槛未通过。', desc: '综合分已按门槛规则封顶；这不是能力总评，先确认缺失技能或年限是否可以补充。' };
  if (score >= 85) return { title: '项目证据有清晰交集。', desc: '当前 JD 与简历 / 作品集资料库有较多重合，优先讲最接近的案例和可核验结果。' };
  if (score >= 70) return { title: '有清晰的能力交集。', desc: '方向是对的，面试前把最接近岗位的案例讲得更具体，会明显提升说服力。' };
  if (score >= 55) return { title: '有基础，但需要补证据。', desc: '你已经覆盖了一部分要求，可以优先补一到两个高频能力点，再决定如何投递。' };
  return { title: '先补齐核心证据。', desc: '这份 JD 和当前资料库的交集偏少，建议先找出最接近的项目，或重新核对这份 JD 与作品方向是否匹配。' };
}

function radarPoint(cx, cy, radius, index, total, value = 100) {
  const angle = -Math.PI / 2 + (Math.PI * 2 * index) / total;
  const distance = radius * (value / 100);
  return `${(cx + Math.cos(angle) * distance).toFixed(1)},${(cy + Math.sin(angle) * distance).toFixed(1)}`;
}

function renderRadar(dimensions) {
  const cx = 150;
  const cy = 150;
  const radius = 100;
  const total = dimensions.length;
  const grid = [25, 50, 75, 100].map((level) => `<polygon points="${dimensions.map((_, index) => radarPoint(cx, cy, radius, index, total, level)).join(' ')}" />`).join('');
  const axes = dimensions.map((_, index) => `<line x1="${cx}" y1="${cy}" x2="${radarPoint(cx, cy, radius, index, total).split(',')[0]}" y2="${radarPoint(cx, cy, radius, index, total).split(',')[1]}" />`).join('');
  const labels = dimensions.map((dimension, index) => {
    const point = radarPoint(cx, cy, radius + 27, index, total).split(',');
    const anchor = Number(point[0]) < cx - 5 ? 'end' : Number(point[0]) > cx + 5 ? 'start' : 'middle';
    return `<text x="${point[0]}" y="${point[1]}" text-anchor="${anchor}">${escapeHTML(dimension.label.replace('匹配', '').replace('与', ' / '))}</text>`;
  }).join('');
  const data = dimensions.map((dimension, index) => radarPoint(cx, cy, radius, index, total, dimension.score)).join(' ');
  const dots = dimensions.map((dimension, index) => {
    const point = radarPoint(cx, cy, radius, index, total, dimension.score).split(',');
    return `<circle cx="${point[0]}" cy="${point[1]}" r="3.5" />`;
  }).join('');
  return `<g class="radar-grid">${grid}</g><g class="radar-axes">${axes}</g><polygon class="radar-data" points="${data}" />${dots}<g class="radar-labels">${labels}</g>`;
}

function renderDimensionCards(dimensions) {
  return dimensions.map((dimension) => {
    const level = dimension.score >= 80 ? 'high' : dimension.score >= 60 ? 'mid' : 'low';
    return `<article class="dimension-card dimension-${level}"><div class="dimension-card-top"><b>${escapeHTML(dimension.label)}</b><span>${dimension.weight}%</span></div><strong>${dimension.score}</strong><div class="dimension-bar"><i style="width:${dimension.score}%"></i></div><p>${escapeHTML(dimension.risks[0] || dimension.highlights[0] || '当前暂无明显风险')}</p></article>`;
  }).join('');
}

function renderTrace(result) {
  jdTrace.innerHTML = result.dimensions.map((dimension) => `<div class="trace-row"><b>${escapeHTML(dimension.label)}</b><span>${escapeHTML(dimension.jd)}</span></div>`).join('');
  resumeTrace.innerHTML = result.dimensions.map((dimension) => `<div class="trace-row"><b>${escapeHTML(dimension.label)}</b><span>${escapeHTML(dimension.resume.join('；'))}</span></div>`).join('');
  jdTraceCount.textContent = `${result.dimensions.length} 项`;
  resumeTraceCount.textContent = `${result.evidence.length} 条证据`;
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

function renderMatchResult(jd) {
  const result = getMatchResult(jd, hardGate.checked);
  const copy = resultCopy(result.score, result.blocked);
  matchResult.classList.remove('is-hidden');
  scoreRing.style.setProperty('--score-angle', `${result.score * 3.6}deg`);
  animateNumber(scoreValue, result.score);
  scoreTitle.textContent = copy.title;
  scoreDesc.textContent = copy.desc;
  scoreStatus.textContent = result.blocked ? '硬性门槛拦截' : result.score >= 80 ? '高度匹配' : result.score >= 60 ? '部分匹配' : '低匹配';
  scoreStatus.className = `score-status ${result.blocked ? 'is-blocked' : result.score >= 80 ? 'is-high' : result.score >= 60 ? 'is-mid' : 'is-low'}`;
  radarChart.innerHTML = renderRadar(result.dimensions);
  dimensionCards.innerHTML = renderDimensionCards(result.dimensions);
  matchedSkills.innerHTML = result.highlights.length ? result.highlights.map((item) => `<span class="skill-chip">${escapeHTML(item)}</span>`).join('') : '<span class="gap-item">暂未识别到明确亮点</span>';
  gapSkills.innerHTML = result.risks.length ? result.risks.map((item) => `<span class="gap-item">${escapeHTML(item)}</span>`).join('') : '<span class="gap-item">当前没有明显风险项</span>';
  evidenceList.innerHTML = result.evidence.length ? result.evidence.map((item) => `<span class="evidence-item">${escapeHTML(item)}</span>`).join('') : '<span class="gap-item">等待 JD 命中对应项目</span>';
  renderTrace(result);
  resultTip.textContent = result.blocked ? `建议：先确认 ${result.gateReasons.join('；')} 是否是不可替代的硬门槛。` : result.risks[0] ? `建议：优先补充“${result.risks[0]}”对应的事实、时间或项目证据。` : '建议：把得分最高的项目证据整理成一段面试开场，继续用事实说明取舍。';
  lastAnalyzedJD = jd;
  matchResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function analyzeJD() {
  const jd = jdInput.value.trim();
  if (!jd) {
    showToast('先粘贴一段 JD，再来分析匹配度。');
    jdInput.focus();
    return;
  }
  renderMatchResult(jd);
}

function showToast(message) {
  const toast = $('#toast');
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove('show'), 2600);
}

analyzeBtn.addEventListener('click', analyzeJD);
hardGate.addEventListener('change', () => {
  if (lastAnalyzedJD) renderMatchResult(lastAnalyzedJD);
});

const dialog = $('#projectDialog');
const closeDialog = $('#closeDialog');

function renderEvidenceVisual(type) {
  const visuals = {
    'finance-flow': `
      <div class="evidence-diagram evidence-finance">
        <div class="evidence-diagram-head"><div><span>FLOW MAP / 01</span><strong>一条记录，经过哪些节点才算完成？</strong></div><em>交互原型逻辑</em></div>
        <div class="evidence-flow">
          <div class="evidence-node"><small>01</small><b>权益记录</b><span>购买 / 变更</span></div><i>→</i>
          <div class="evidence-node"><small>02</small><b>退款流水</b><span>登记 / 审核</span></div><i>→</i>
          <div class="evidence-node"><small>03</small><b>财务拆分</b><span>结算 / 均摊</span></div><i>→</i>
          <div class="evidence-node"><small>04</small><b>审计日志</b><span>可查询 / 可回看</span></div>
        </div>
        <div class="evidence-foot"><span>角色：超管 / 财务 / 销售</span><span>状态：待审 · 已确认 · 已终止</span><span>留痕：操作人 · 时间 · 条件</span></div>
      </div>`,
    'replenishment-rule': `
      <div class="evidence-diagram evidence-replenish">
        <div class="evidence-diagram-head"><div><span>RULE MAP / 02</span><strong>建议补货量不是一个黑盒数字</strong></div><em>PRD 计算口径</em></div>
        <div class="evidence-formula-grid">
          <div><small>01</small><b>日均销量</b><strong>周期销量 ÷ 天数</strong></div>
          <div><small>02</small><b>可销售天数</b><strong>当前库存 ÷ 日均销量</strong></div>
          <div><small>03</small><b>目标库存</b><strong>日均销量 × 补货天数</strong></div>
        </div>
        <div class="evidence-output"><span>系统输出</span><strong>建议补货量 = max(0, ceil(目标库存 − 当前库存))</strong></div>
        <div class="evidence-foot"><span>输入维度：门店 · 品类 · 品牌 · 型号 · 规格</span><span>权限：管理员配置 · 普通员工查看</span></div>
      </div>`,
    'warning-linkage': `
      <div class="evidence-diagram evidence-warning">
        <div class="evidence-diagram-head"><div><span>LINKAGE MAP / 03</span><strong>从首页发现异常，到列表继续处理</strong></div><em>跨页面联动</em></div>
        <div class="evidence-alert-layout">
          <div class="evidence-alert-stack"><div class="evidence-alert alert-red"><b>库存年龄</b><strong>03</strong><span>需要处理</span></div><div class="evidence-alert alert-amber"><b>未到货</b><strong>08</strong><span>查看明细</span></div><div class="evidence-alert alert-blue"><b>相关列表</b><strong>12</strong><span>进入筛选</span></div></div>
          <div class="evidence-link-arrow">→</div>
          <div class="evidence-route"><div class="evidence-route-row"><span>首页卡片</span><b>保留筛选语义</b></div><div class="evidence-route-row"><span>列表页</span><b>继续处理</b></div><div class="evidence-route-row"><span>设置页</span><b>调整阈值</b></div></div>
        </div>
        <div class="evidence-state-row"><span>空数据</span><span>接口异常</span><span>权限不足</span><small>三种状态分别反馈</small></div>
      </div>`
  };
  return visuals[type] || '';
}

function openProjectCase(projectId) {
  const project = CASE_LIBRARY[projectId];
  if (!project) return;
  $('#dialogKicker').textContent = project.kicker;
  $('#dialogIndex').textContent = project.index;
  $('#dialogTitle').textContent = project.title;
  $('#dialogSummary').textContent = project.summary;
  $('#dialogRole').textContent = project.role;
  $('#dialogFocus').textContent = project.focus;
  $('#dialogOutput').textContent = project.output;
  const visualMarkup = renderEvidenceVisual(project.visualType);
  $('#dialogVisualWrap').classList.toggle('is-hidden', !visualMarkup);
  $('#dialogVisual').innerHTML = visualMarkup;
  const heroImage = $('#dialogHeroImage');
  heroImage.src = project.heroImage || '';
  heroImage.alt = project.heroImage ? `${project.title} 代表画面` : '';
  heroImage.classList.toggle('is-hidden', !project.heroImage);
  $('.dialog-hero').classList.toggle('no-image', !project.heroImage);
  $('#dialogContextTitle').textContent = project.contextTitle;
  $('#dialogContext').textContent = project.context;
  $('#dialogProblems').innerHTML = project.problems.map((item) => `<li>${item}</li>`).join('');
  $('#dialogSolution').textContent = project.solution;
  $('#dialogSolutionList').innerHTML = project.solutionPoints.map((item) => `<li>${item}</li>`).join('');
  $('#dialogResult').textContent = project.result;
  $('#dialogTags').innerHTML = project.tags.map((tag) => `<span>${tag}</span>`).join('');
  $('#dialogEvidence').textContent = project.evidence || '当前案例基于已整理的项目 UI、简历和可见交付内容，线上结果数据待补充。';
  const gallery = project.gallery || (project.heroImage ? [project.heroImage] : []);
  const galleryWrap = $('.dialog-gallery-wrap');
  galleryWrap.classList.toggle('is-hidden', gallery.length === 0);
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

const workFilters = $$('.work-filter');
const caseCards = $$('.case-card');
const caseEmpty = $('#caseEmpty');
function applyWorkFilter(filter) {
  let visibleCount = 0;
  caseCards.forEach((card) => {
    const visible = filter === 'all' || card.dataset.category === filter;
    card.classList.toggle('is-filtered-out', !visible);
    if (visible) visibleCount += 1;
  });
  workFilters.forEach((button) => {
    const active = button.dataset.filter === filter;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-selected', String(active));
  });
  caseEmpty.classList.toggle('is-hidden', visibleCount > 0);
}
workFilters.forEach((button) => button.addEventListener('click', () => applyWorkFilter(button.dataset.filter)));

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
