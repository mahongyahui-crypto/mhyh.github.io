// V3 local candidate profile and evidence catalog.
// All records below are candidate-confirmed facts. They are not third-party verification.

export const MATCH_WEIGHTS = Object.freeze({
  professional: 30,
  project: 25,
  responsibility: 25,
  industry: 10,
  constraint: 10
});

export const MATCH_DIMENSIONS = Object.freeze([
  { key: 'professional', label: '专业技能匹配', shortLabel: '专业技能', weight: MATCH_WEIGHTS.professional },
  { key: 'project', label: '项目经验匹配', shortLabel: '项目经验', weight: MATCH_WEIGHTS.project },
  { key: 'responsibility', label: '岗位职责匹配', shortLabel: '岗位职责', weight: MATCH_WEIGHTS.responsibility },
  { key: 'industry', label: '行业背景匹配', shortLabel: '行业背景', weight: MATCH_WEIGHTS.industry },
  { key: 'constraint', label: '任职条件匹配', shortLabel: '任职条件', weight: MATCH_WEIGHTS.constraint }
]);

export const ANALYSIS_AS_OF = '2026-11-20';

export const CAREER_TIMELINE = Object.freeze([
  Object.freeze({ company: '西安腾宇网络科技有限公司', role: 'UI 设计师', start: '2021-06-01', end: '2022-05-31', display: '2021.06—2022.05' }),
  Object.freeze({ company: '陕西超掌柜科技有限公司', role: 'UI 设计师', start: '2022-05-01', end: '2026-07-28', display: '2022.05—2026.07' }),
  Object.freeze({ company: '西安腾为计算机系统有限责任公司', role: 'UI 设计师', start: '2026-07-29', end: null, display: '2026.07—至今' })
]);

function asUtcDate(value) {
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function getUiExperienceMonths(asOf = ANALYSIS_AS_OF) {
  const asOfDate = asUtcDate(asOf) || asUtcDate(ANALYSIS_AS_OF);
  const ranges = CAREER_TIMELINE
    .map(({ start, end }) => {
      const startDate = asUtcDate(start);
      const endDate = end ? asUtcDate(end) : asOfDate;
      if (!startDate || !endDate || endDate <= startDate) return null;
      return [startDate.getTime(), Math.min(endDate.getTime() + 86400000, asOfDate.getTime())];
    })
    .filter(Boolean)
    .sort((a, b) => a[0] - b[0]);
  const merged = [];
  ranges.forEach(([start, end]) => {
    const previous = merged[merged.length - 1];
    if (previous && start <= previous[1]) previous[1] = Math.max(previous[1], end);
    else merged.push([start, end]);
  });
  const totalDays = merged.reduce((sum, [start, end]) => sum + Math.max(0, end - start) / 86400000, 0);
  return Math.floor(totalDays / 30.4375);
}

export function getUiExperienceYears(asOf = ANALYSIS_AS_OF) {
  return getUiExperienceMonths(asOf) / 12;
}

const currentUiExperienceMonths = getUiExperienceMonths(ANALYSIS_AS_OF);

export const RESUME_PROFILE = Object.freeze({
  displayName: '马弘雅卉',
  positioning: 'UI/UX & Product Designer',
  formalRoles: CAREER_TIMELINE.map(({ role }) => role),
  uiStartDate: '2021-06-01',
  analysisDate: ANALYSIS_AS_OF,
  uiExperienceMonths: currentUiExperienceMonths,
  uiYears: currentUiExperienceMonths / 12,
  years: currentUiExperienceMonths / 12,
  uiYearsDisplay: '5年+ UI/UX 设计经验',
  formalProductManagerYears: 0,
  degree: '大专',
  degreeLabel: '全日制大专',
  major: '广告设计与制作',
  locations: ['成都', '远程'],
  employment: '全职',
  salary: null,
  availability: null,
  travel: null,
  tracks: ['UI 设计', 'UX 设计', 'B 端', 'SaaS', 'ERP', '后台', '企业版', '连锁', '门店', 'CRM', '小程序', '库存', '采购', '销售', '订单', '维修', '回收', '商城'],
  confirmedFacts: [
    '三段正式工作经历均为 UI 设计师；2021 年 6 月开始计算 UI 设计经验。',
    '截至 2026 年 11 月，资料口径为 5年+ UI/UX 设计经验，不提前写成 6 年。',
    '陕西超掌柜于 2026-07-28 离职，西安腾为于 2026-07-29 入职，不存在两个月职业空档。',
    '可以分析产品设计、功能研究、交互思考、设计规范和真实产品交付，但不换算为正式产品经理任职年限。',
    '项目作品尚未全部上传不影响已确认履历事实的支持程度。'
  ]
});

const evidenceDefaults = {
  fact_confirmation_status: 'confirmed_by_candidate',
  evidence_source: '本人已确认履历资料',
  visibility: 'public_summary',
  updated_at: '2026-11-20'
};

function evidence(record) {
  return Object.freeze({ ...evidenceDefaults, ...record });
}

export const PROJECT_EVIDENCE = Object.freeze([
  evidence({
    project_id: 'project.chaodian-saas', evidence_id: 'evidence.chaodian-saas.ui-flow',
    project_name: '超掌柜餐饮 SaaS', personal_role: 'UI 设计师；在无专职产品经理的早期阶段参与功能和流程研究',
    work_content: '参与 PC 管理后台、点餐端、平板端及打印相关界面从 0 到 1 设计；自主研究功能、操作流程和异常场景，输出高保真 UI 并根据汇报反馈迭代。',
    supported_skills: ['UI 设计', '高保真 UI', '业务流程研究', '异常场景梳理', 'SaaS', 'B 端'],
    supported_responsibilities: ['功能研究', '操作流程梳理', '高保真设计', '设计迭代', '汇报沟通'],
    industry_terms: ['餐饮', 'SaaS', 'B 端', '企业服务'], project_terms: ['SaaS', 'B 端', 'PC 管理后台', '点餐端', '平板端', '打印'],
    project_status: '真实项目经历已确认；当前作品未单独上传', confirmed_result: '完成相关多端界面设计与迭代交付；未将其扩展为独立 PRD 或产品战略职责。',
    verification_status: 'not_independently_verified', portfolio_status: 'not_uploaded', portfolio_reference: null, work_type: 'confirmed_experience'
  }),
  evidence({
    project_id: 'project.wanji-enterprise-pc', evidence_id: 'evidence.wanji-enterprise-pc.visual-upgrade',
    project_name: '万机管家企业版 ERP PC', personal_role: 'UI 设计师；独立主导整套 UI 视觉升级',
    work_content: '涉及工作台、数据看板、库存列表等核心页面；设计周期约 1 个月，完成设计并交付开发。',
    supported_skills: ['UI 设计', '视觉升级', 'PC 后台', '数据看板', 'ERP', 'B 端'],
    supported_responsibilities: ['独立主导 UI 视觉升级', '核心页面设计', '开发交付'],
    industry_terms: ['企业服务', 'ERP', 'B 端'], project_terms: ['ERP', 'PC', '后台', '工作台', '数据看板', '库存'],
    project_status: '已交付开发，尚未正式上线', confirmed_result: '完成企业版 PC 核心页面 UI 视觉升级；未改变既有业务流程和交互逻辑。原产品服务约 2000 多家企业客户。',
    verification_status: 'not_independently_verified', portfolio_status: 'linked', portfolio_reference: 'enterprisePC', work_type: 'confirmed_experience'
  }),
  evidence({
    project_id: 'project.wanji-store-pc', evidence_id: 'evidence.wanji-store-pc.component-library',
    project_name: '万机管家门店版 ERP PC', personal_role: 'UI 设计师；参与从 0 到 1 建设并独立搭建 PC 端 UI 组件库',
    work_content: '负责相关 UI 设计和设计规范，与研发共建组件使用机制；开发侧组件使用率约 85%。',
    supported_skills: ['UI 设计', 'PC 后台', '组件库', '设计规范', 'ERP', 'B 端'],
    supported_responsibilities: ['从 0 到 1 设计', '组件库搭建', '设计规范建设', '研发协作'],
    industry_terms: ['企业服务', 'ERP', '门店', '零售'], project_terms: ['ERP', 'PC', '后台', '门店', '组件库', '设计规范'],
    project_status: '约 1 个月完成并上线', confirmed_result: '产品约 200 家客户使用；开发侧组件使用率约 85%。该数据为项目事实口径，不等同于个人单独带来的业务增长。',
    verification_status: 'not_independently_verified', portfolio_status: 'linked', portfolio_reference: 'storePC', work_type: 'confirmed_experience'
  }),
  evidence({
    project_id: 'project.recycle-order', evidence_id: 'evidence.recycle-order.ui',
    project_name: '回收接单侠', personal_role: 'UI 设计师；独立负责从 0 到 1 的 UI 设计',
    work_content: '负责回收业务相关页面、状态和交互细节设计，相关功能已上线。',
    supported_skills: ['UI 设计', '移动端设计', '状态设计', '业务流程'],
    supported_responsibilities: ['独立负责从 0 到 1 UI 设计', '状态设计', '上线交付'],
    industry_terms: ['二手 3C', '回收', '循环经济'], project_terms: ['App', '移动端', '回收', '订单', '线索'],
    project_status: '已上线', confirmed_result: '相关功能已上线；约 3000+ 用户使用。用户规模不解释为个人设计带来的增长。',
    verification_status: 'not_independently_verified', portfolio_status: 'linked', portfolio_reference: 'recycle', work_type: 'confirmed_experience'
  }),
  evidence({
    project_id: 'project.private-mall', evidence_id: 'evidence.private-mall.ui-motion',
    project_name: '私域商城', personal_role: 'UI 设计师；独立负责从 0 到 1 的 UI 设计',
    work_content: '完成全站 UI 设计，并为全站按钮设计交互动效；产品已上线。',
    supported_skills: ['UI 设计', '交互设计', '动效', '小程序', '商城'],
    supported_responsibilities: ['独立负责从 0 到 1 UI 设计', '交互动效设计', '上线交付'],
    industry_terms: ['零售', '私域', '商城', '电商'], project_terms: ['小程序', '商城', 'App', '交互动效'],
    project_status: '已上线', confirmed_result: '约 200 家客户使用；客户数量不解释为个人设计带来的业务增长。',
    verification_status: 'not_independently_verified', portfolio_status: 'linked', portfolio_reference: 'privateMall', work_type: 'confirmed_experience'
  }),
  evidence({
    project_id: 'project.chain-app', evidence_id: 'evidence.chain-app.mobile-ui',
    project_name: '连锁版 App', personal_role: 'UI 设计师；主导移动端 UI 设计',
    work_content: '负责连锁版 App 的移动端 UI 设计，产品已上线。',
    supported_skills: ['UI 设计', '移动端设计', '连锁经营', '门店场景'],
    supported_responsibilities: ['主导移动端 UI 设计', '上线交付'],
    industry_terms: ['连锁', '门店', '零售'], project_terms: ['App', '移动端', '连锁', '门店'],
    project_status: '已上线', confirmed_result: '约 10 家企业客户使用；客户数量不解释为个人设计带来的业务增长。',
    verification_status: 'not_independently_verified', portfolio_status: 'linked', portfolio_reference: 'chainApp', work_type: 'confirmed_experience'
  }),
  evidence({
    project_id: 'project.erp-iterations', evidence_id: 'evidence.erp-iterations.delivery',
    project_name: 'ERP 日常需求迭代', personal_role: 'UI 设计师；个人独立完成企业版及门店版 ERP 需求设计与交付',
    work_content: '独立完成约 60 项需求设计与交付，参与需求评审、开发验收和用户反馈跟进；部分上线需求获得用户正面反馈。',
    supported_skills: ['UI 设计', '需求分析', '交互设计', 'ERP', 'B 端', '开发验收', 'AI 辅助原型'],
    supported_responsibilities: ['需求评审', '需求设计', '开发验收', '用户反馈跟进', '设计交付'],
    industry_terms: ['企业服务', 'ERP', 'B 端', '门店'], project_terms: ['ERP', '企业版', '门店版', '需求迭代'],
    project_status: '持续迭代；约 60 项需求完成设计与交付', confirmed_result: '库存批量调价功能有真实用户好评截图；该反馈仅作为已记录的用户反馈证据，不外推为整体业务增长。',
    verification_status: 'user_feedback_screenshot_available', portfolio_status: 'not_uploaded', portfolio_reference: null, work_type: 'confirmed_experience'
  }),
  evidence({
    project_id: 'project.crm-im', evidence_id: 'evidence.crm-im.product-design',
    project_name: 'CRM 与 IM 客服系统', personal_role: '与另一位同事共同负责产品设计',
    work_content: '两个系统合计约半个多月完成并上线；CRM 主要供内部课程、销售、直播团队使用，IM 客服系统面向平台用户开放。',
    supported_skills: ['产品设计', 'UI 设计', 'CRM', 'IM', '企业服务'],
    supported_responsibilities: ['共同负责产品设计', '系统上线交付', '内部业务协作'],
    industry_terms: ['企业服务', 'CRM', '客服系统'], project_terms: ['CRM', 'IM', '后台', '管理系统'],
    project_status: '已上线；IM 实际使用人数尚未核实', confirmed_result: '完成两个系统的产品设计交付；不将共同负责描述为独立主导。',
    verification_status: 'not_independently_verified', portfolio_status: 'linked', portfolio_reference: 'crmAI', work_type: 'confirmed_experience'
  }),
  evidence({
    project_id: 'project.finance-internal-operations', evidence_id: 'evidence.finance-internal-operations.design',
    project_name: '超管财务及内部经营管理', personal_role: '参与需求、业务流程、原型、UI 设计与验收',
    work_content: '参与超管财务及内部经营管理相关需求和业务流程梳理，完成原型、UI 设计及验收协作；部分功能已经使用，具体模块上线状态需分别核实。',
    supported_skills: ['业务流程', '原型设计', 'UI 设计', '后台系统'],
    supported_responsibilities: ['需求参与', '流程梳理', '原型设计', 'UI 设计', '验收协作'],
    industry_terms: ['企业服务', '后台'], project_terms: ['财务', '经营管理', '后台', '权限'],
    project_status: '部分功能已经使用；具体模块上线状态待核实', confirmed_result: '保留参与范围和待核实边界，不写成独立负责或全部上线。',
    verification_status: 'pending_confirmation', portfolio_status: 'not_uploaded', portfolio_reference: null, work_type: 'confirmed_experience'
  }),
  evidence({
    project_id: 'project.ai-prd-platform', evidence_id: 'evidence.ai-prd-platform.design',
    project_name: 'AI 需求及 PRD 自动生成平台', personal_role: '参与方案设计、交互及 PRD',
    work_content: '参与 AI 需求及 PRD 自动生成平台的方案设计、交互和 PRD；实际上线状态当前待核实。',
    supported_skills: ['交互设计', '产品设计', 'AI 辅助设计实践'],
    supported_responsibilities: ['方案设计', '交互设计', 'PRD 参与'],
    industry_terms: ['企业服务'], project_terms: ['AI', 'PRD', '需求分析'],
    project_status: '实际上线状态待核实', confirmed_result: '仅展示已确认的参与范围，不推断模型能力或上线结果。',
    verification_status: 'pending_confirmation', portfolio_status: 'not_uploaded', portfolio_reference: null, work_type: 'confirmed_experience'
  }),
  evidence({
    project_id: 'project.client-visits', evidence_id: 'evidence.client-visits.research',
    project_name: '真实客户访谈', personal_role: '参与客户走访与现场沟通',
    work_content: '参与真实客户走访，客户数量尚待完整核对；我方功能介绍不自动解释为用户主动提出的需求。',
    supported_skills: ['用户访谈', '场景理解', '需求沟通'],
    supported_responsibilities: ['客户走访', '现场沟通'],
    industry_terms: ['企业服务', '门店'], project_terms: ['客户访谈', '需求沟通'],
    project_status: '真实经历已确认；客户数量待核对', confirmed_result: '保留参与客户访谈这一事实，不编造客户数量或主动需求结论。',
    verification_status: 'pending_confirmation', portfolio_status: 'not_uploaded', portfolio_reference: null, work_type: 'confirmed_experience'
  })
]);

export const DEGREE_RANK = Object.freeze({ 高中: 1, 大专: 2, 本科: 3, 硕士: 4, 博士: 5 });
export const CITY_TERMS = Object.freeze(['成都', '北京', '上海', '深圳', '广州', '杭州', '重庆', '武汉', '西安', '南京', '苏州']);

// Compatibility exports for the existing page shell. The V3 engine does not score these
// catalogs directly; it uses PROJECT_EVIDENCE and the centralized weights above.
export const REQUIRED_SKILL_CATALOG = Object.freeze([
  { label: 'UI / UX 设计', terms: ['ui', 'ux', '用户体验', '界面设计'], evidence: '两段主要正式工作经历均为 UI 设计师', resume: true },
  { label: 'Figma', terms: ['figma'], evidence: '当前资料记录有 Figma 相关使用经历；“熟练”深度仍需逐项核实', resume: true },
  { label: 'ERP / SaaS / B 端', terms: ['erp', 'saas', 'b端', '企业服务'], evidence: '超掌柜餐饮 SaaS、万机管家企业版与门店版 ERP', resume: true },
  { label: '交互与高保真设计', terms: ['交互设计', '交互', '高保真', '原型'], evidence: '多端业务流程、状态和高保真 UI 设计经历', resume: true },
  { label: '组件库 / 设计规范', terms: ['组件库', '设计系统', '设计规范', 'design system'], evidence: '万机管家门店版 ERP PC 组件库与规范', resume: true },
  { label: '前端开发', terms: ['javascript', 'typescript', 'react', 'vue', '前端开发'], evidence: '当前已确认履历未记录正式前端开发经历', resume: false }
]);

export const EXPERIENCE_CATALOG = Object.freeze([
  { label: '产品 / UI / UX 设计', terms: ['产品设计', 'ui设计', 'ux设计', '设计师'], weight: 1, resume: true, evidence: '两段主要正式工作经历均为 UI 设计师' },
  { label: 'ERP / SaaS / B 端项目', terms: ['erp', 'saas', 'b端', '企业版', '门店版'], weight: 1, resume: true, evidence: '超掌柜餐饮 SaaS、万机管家企业版与门店版 ERP' },
  { label: 'App / 移动端项目', terms: ['app', '移动端', '手机端'], weight: 1, resume: true, evidence: '企业版 App、连锁版 App、回收接单侠与私域商城' },
  { label: 'PC / 后台项目', terms: ['pc', '后台', '管理系统'], weight: 1, resume: true, evidence: '企业版与门店版 ERP PC、CRM 与 IM 系统' }
]);

export const INDUSTRY_CATALOG = Object.freeze([
  { label: '企业服务 / SaaS / ERP', terms: ['企业服务', 'saas', 'erp', 'crm'], matchScore: 100, resume: true, evidence: '超掌柜餐饮 SaaS、万机管家 ERP、CRM 系统' },
  { label: '零售 / 门店 / 连锁 / 电商', terms: ['零售', '门店', '连锁', '电商', '商城'], matchScore: 80, resume: true, evidence: '万机管家门店版、连锁版 App、私域商城' },
  { label: '二手 3C / 回收', terms: ['二手', '3c', '回收', '循环经济'], matchScore: 100, resume: true, evidence: '回收接单侠及门店回收业务' }
]);

export const BONUS_CATALOG = Object.freeze([
  { label: 'Figma / 设计工具', terms: ['figma', 'sketch', 'adobe xd'], resume: true, evidence: '资料记录有 Figma 相关使用经历；“熟练”深度仍需核实' },
  { label: '组件库 / 设计规范', terms: ['组件库', '设计系统', '设计规范', 'design system'], resume: true, evidence: '门店版 ERP PC 组件库与设计规范' },
  { label: 'AI 辅助原型实践', terms: ['ai辅助', 'ai 工具', 'ai工具', 'ai原型'], resume: true, evidence: '已确认资料记录有 AI 辅助开发实践，但不在未提出时自动加分' }
]);

export const SKILLS = Object.freeze([]);
