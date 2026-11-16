const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

const PROJECTS = {
  wangji: {
    kicker: 'CASE STUDY / 01',
    index: '01 / ENTERPRISE APP UI',
    title: '企业版 App UI · 业务移动端',
    summary: '覆盖销售管理、仅出库、售后出库、配件申领、销售出库、已销售订单和财务管理等移动端业务场景，把门店高频任务组织成清晰的入口、列表与状态。',
    role: 'UI / 交互设计',
    focus: '销售 · 售后 · 配件 · 财务',
    output: 'UI 稿 · 业务流程 · 状态设计'
  },
  chain: {
    kicker: 'CASE STUDY / 02',
    index: '02 / ENTERPRISE PC UI',
    title: '企业版 PC 改版 · 工作台与经营数据',
    summary: '从快捷菜单、经营数据、销售指标到库存列表与筛选，重新整理后台首页与关键列表，让企业版 PC 更接近门店经营和管理者决策的真实工作流。',
    role: 'UI / 产品设计',
    focus: '工作台 · 数据看板 · 库存列表',
    output: '页面改版 · 交互状态 · 高保真'
  },
  inventory: {
    kicker: 'CASE STUDY / 03',
    index: '03 / CRM AI PRODUCT',
    title: 'CRM AI 销售助手 · 从会话到跟进',
    summary: '围绕 AI 自动会话、新建会话、线索/客户管理、通话资料、客户分析、跟进建议和字段回填，设计默认、运行、成功、失败、重试和权限等完整状态，让 AI 结果能继续被使用。',
    role: '产品 / UI / 交互设计',
    focus: 'AI 会话 · 线索 · 客户 · 证据',
    output: '高保真交付 · 可点击原型 · 状态矩阵'
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
$$('.detail-trigger').forEach((button) => {
  button.addEventListener('click', (event) => {
    event.stopPropagation();
    const project = PROJECTS[button.closest('.project-card').dataset.project];
    $('#dialogKicker').textContent = project.kicker;
    $('#dialogIndex').textContent = project.index;
    $('#dialogTitle').textContent = project.title;
    $('#dialogSummary').textContent = project.summary;
    $('#dialogRole').textContent = project.role;
    $('#dialogFocus').textContent = project.focus;
    $('#dialogOutput').textContent = project.output;
    dialog.showModal();
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
