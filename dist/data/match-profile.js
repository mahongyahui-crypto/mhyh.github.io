// Local profile and matching catalogs. No network or model data is used.
export const RESUME_PROFILE = {
  years: 5,
  degree: null,
  locations: ['成都', '远程'],
  employment: '全职',
  salary: null,
  availability: null,
  travel: null,
  tracks: ['b端', 'saas', 'erp', '后台', '企业版', '连锁', '门店', 'crm', '小程序', '库存', '采购', '销售', '订单', '维修', '回收', '商城']
};

export const REQUIRED_SKILL_CATALOG = [
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
export const EXPERIENCE_CATALOG = [
  { label: '产品 / UI / UX 设计', terms: ['产品设计', 'ui设计', 'ux设计', '交互设计', '设计师', '视觉设计'], weight: 3, resume: true, evidence: '5 年+ UI / UX 设计经验' },
  { label: '用户研究 / 需求分析', terms: ['用户研究', '用户访谈', '需求分析', '竞品分析', '用户洞察'], weight: 3, resume: true, evidence: 'ERP 50+ 项需求与业务场景拆解' },
  { label: '信息架构 / 业务流程', terms: ['信息架构', '业务流程', '流程梳理', '导航设计', '任务路径'], weight: 3, resume: true, evidence: '企业版 App / PC 工作台与复杂业务流程' },
  { label: '交互原型 / 高保真', terms: ['交互设计', '交互原型', '高保真', '原型设计', 'html原型'], weight: 3, resume: true, evidence: 'HTML 交互原型与高保真流程验证' },
  { label: '组件库 / 设计规范', terms: ['组件库', '设计系统', '设计规范', 'design system', 'tokens'], weight: 2, resume: true, evidence: '门店 PC 组件库与设计规范' },
  { label: '状态 / 异常设计', terms: ['状态设计', '异常状态', '空状态', '错误状态', '提交失败', '风险提醒'], weight: 2, resume: true, evidence: '空状态、提交失败、风险提醒与状态矩阵' },
  { label: '开发沟通 / 验收', terms: ['开发沟通', '研发沟通', '验收', '评审', '交付', '上线'], weight: 2, resume: true, evidence: '需求 / 技术 / 设计评审、开发沟通与验收' },
  { label: 'B 端 ERP / SaaS 项目', terms: ['b端', 'erp', 'saas', '后台', '企业版', '管理系统'], weight: 3, resume: true, evidence: '企业版 App / PC 与 ERP 50+ 项目需求' },
  { label: 'App / 移动端项目', terms: ['app', '移动端', '手机端', '移动应用'], weight: 2, resume: true, evidence: '企业版、连锁版、门店版 App' },
  { label: 'PC / 后台项目', terms: ['pc端', 'pc', '后台', '管理系统'], weight: 2, resume: true, evidence: '企业版与门店版 PC 后台' },
  { label: '小程序 / 商城项目', terms: ['小程序', '商城', '私域'], weight: 2, resume: true, evidence: '私域商城小程序 UI' },
  { label: '前端开发经历', terms: ['前端开发', 'javascript', 'typescript', 'react', 'vue'], weight: 3, resume: false, evidence: '当前简历与作品集资料库未记录前端开发经历' }
];

export const INDUSTRY_CATALOG = [
  { label: '二手 3C / 回收 / 循环经济', terms: ['二手', '3c', '回收', '循环经济', '手机回收', '数码回收', '消费电子'], matchScore: 100, resume: true, evidence: '回收接单侠、IMEI 与门店回收业务' },
  { label: '零售 / 门店 / 连锁 / 电商', terms: ['零售', '门店', '连锁', '电商', '私域', '商城'], matchScore: 80, resume: true, evidence: '门店经营、连锁版 App、私域商城' },
  { label: '企业服务 / SaaS / ERP', terms: ['企业服务', 'saas', 'erp', '企业管理软件', 'crm'], matchScore: 100, resume: true, evidence: '万机管家企业版、ERP、CRM' },
  { label: '制造业 / 工业', terms: ['制造业', '工业', '工厂'], matchScore: 0, resume: false, evidence: '公开资料未记录该行业经历' },
  { label: '金融 / 教育 / 医疗', terms: ['金融', '银行', '保险', '证券', '教育', '医疗', '医院'], matchScore: 0, resume: false, evidence: '公开资料未记录该行业经历' },
  { label: '物流 / 运输', terms: ['物流', '运输', '仓储物流'], matchScore: 45, resume: false, evidence: '有库存与订单业务，但不是物流行业履历' }
];

export const BONUS_CATALOG = [
  { label: 'Figma / 设计工具', terms: ['figma', 'sketch', 'adobe xd'], resume: true, evidence: 'Figma 作品集与页面组件' },
  { label: 'AI 工具 / AI 原型', terms: ['ai工具', 'ai辅助', '生成式ai', 'ai产品'], resume: true, evidence: 'AI 辅助 HTML 原型交付' },
  { label: '数据可视化 / 仪表盘', terms: ['数据可视化', '仪表盘', '经营分析', '数据看板'], resume: true, evidence: '数据中心与经营看板' },
  { label: '组件库 / Design System', terms: ['组件库', '设计系统', '设计规范', 'design system'], resume: true, evidence: '门店 PC 组件库与设计规范' },
  { label: 'B 端 / ERP / SaaS 经验', terms: ['b端', 'erp', 'saas', '企业服务'], resume: true, evidence: '企业版 App / PC 与 ERP 50+ 项目需求' },
  { label: '二手 3C / 回收行业经验', terms: ['二手', '3c', '回收', '循环经济'], resume: true, evidence: '回收接单侠、IMEI 与门店回收业务' },
  { label: '大客户经验', terms: ['大客户', '重点客户', '客户成功'], resume: false, evidence: '当前资料库未记录大客户经验' },
  { label: '证书 / 英语能力', terms: ['证书', '英语', '英文', 'cet-4', 'cet-6'], resume: false, evidence: '当前资料库未记录证书或英语能力' },
  { label: '出海 / 国际化经验', terms: ['出海', '国际化', '海外', '英文产品'], resume: false, evidence: '当前资料库未记录出海或国际化项目' }
];

export const DEGREE_RANK = { '高中': 1, '大专': 2, '本科': 3, '硕士': 4, '博士': 5 };
export const CITY_TERMS = ['成都', '北京', '上海', '深圳', '广州', '杭州', '重庆', '武汉', '西安', '南京', '苏州'];

export const SKILLS = [
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
