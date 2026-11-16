const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

const PROJECTS = {
  wangji: {
    kicker: 'CASE STUDY / 01',
    index: '01 / PRODUCT DESIGN',
    title: '万机管家 · 门店工作台',
    summary: '示例项目摘要：围绕门店的销售、库存与经营任务，重新整理信息层级和任务路径，让工作台更接近真实的一线工作节奏。',
    role: '产品 / UX 设计',
    focus: '信息架构 · 任务流程',
    output: '流程图 · 组件 · 原型'
  },
  chain: {
    kicker: 'CASE STUDY / 02',
    index: '02 / PRODUCT DESIGN',
    title: '连锁版 App · 产品语言',
    summary: '示例项目摘要：从页面结构、组件复用和关键流程出发，建立一套可以持续扩展的连锁业务 App 设计语言。',
    role: '产品 / 体验设计',
    focus: '设计系统 · 复杂流程',
    output: '组件库 · 页面 · 交互稿'
  },
  inventory: {
    kicker: 'CASE STUDY / 03',
    index: '03 / UX STRATEGY',
    title: '库存信息架构 · Flow + Health',
    summary: '示例项目摘要：把库存流水、健康状态和异常提醒组织成更容易理解的决策入口，帮助使用者从“查看数据”走向“采取行动”。',
    role: 'UX 策略 / 信息架构',
    focus: '内容组织 · 状态反馈',
    output: '结构梳理 · 视觉稿 · 规范'
  }
};

const SAMPLE_JDS = {
  product: `我们正在寻找一名产品设计师，负责 ToB 产品的体验设计工作。

你将参与用户研究、需求分析、信息架构、交互设计和高保真原型，和产品及研发团队一起推进复杂业务流程落地。熟悉 Figma，能够建立组件和设计规范，有 B 端 / SaaS 产品经验更佳。`,
  ux: `负责移动端与 Web 产品的用户体验设计，从用户访谈和洞察出发，完成用户流程、信息架构、交互原型和视觉方案。

希望你关注细节，也能和产品、研发协作，把设计方案推进到上线。熟悉 Figma、设计系统与可用性测试。`,
  strategy: `加入体验策略团队，参与服务蓝图、业务流程梳理和用户研究项目，为复杂服务场景建立清晰的问题定义与体验方案。

需要良好的结构化思维、跨团队沟通能力，以及把研究结论转化为可落地设计的能力。`
};

const SKILLS = [
  { label: '用户研究', keywords: ['用户研究', '用户访谈', '访谈', '洞察', '用研', '可用性测试'], weight: 16, advice: '准备一段访谈、洞察或验证过程，说明结论如何影响设计。' },
  { label: '信息架构', keywords: ['信息架构', '内容架构', '导航', '结构梳理', '分类'], weight: 14, advice: '展示一次复杂内容或权限结构被重新组织的前后对比。' },
  { label: '交互设计', keywords: ['交互设计', '交互', '用户流程', '流程设计', '任务流', '体验设计'], weight: 15, advice: '准备一条完整任务流，补充关键边界状态和取舍。' },
  { label: '视觉与界面', keywords: ['视觉', '界面', 'ui', '视觉方案', '高保真'], weight: 11, advice: '挑一个代表页面，说明层级、密度和视觉决策。' },
  { label: '设计系统', keywords: ['设计系统', '组件', '组件库', '规范', 'tokens', '设计语言'], weight: 12, advice: '准备组件复用、命名或规范沉淀的实际例子。' },
  { label: 'Figma', keywords: ['figma'], weight: 10, advice: '把 Figma 中的组件、自动布局或协作方式写进项目说明。' },
  { label: '复杂业务 / ToB', keywords: ['tob', 'b端', 'saas', '业务流程', '企业服务', '后台', '门店', '复杂业务'], weight: 14, advice: '用一个复杂业务案例讲清楚约束、角色和最终取舍。' },
  { label: '跨团队协作', keywords: ['产品经理', '研发', '开发', '跨团队', '协作', '推进', '上线'], weight: 8, advice: '补充你如何和产品、研发对齐并推动方案落地。' }
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
const resultTip = $('#resultTip');

function normalize(value) {
  return value.toLowerCase().replace(/[\s\n\r·•/]+/g, '');
}

function getMatchResult(jd) {
  const text = normalize(`${jd} ${roleSelect.value}`);
  const matched = SKILLS.filter((skill) => skill.keywords.some((keyword) => text.includes(normalize(keyword))));
  const gaps = SKILLS.filter((skill) => !matched.includes(skill));
  const matchedWeight = matched.reduce((sum, skill) => sum + skill.weight, 0);
  const lengthBonus = Math.min(8, Math.max(0, Math.round((jd.length - 90) / 50)));
  const score = Math.min(98, Math.max(8, matchedWeight + lengthBonus));
  return { matched, gaps, score };
}

function resultCopy(score) {
  if (score >= 85) return { title: '很适合先聊一轮。', desc: '你的能力关键词与这份 JD 有很清晰的交集，下一步重点是补足项目证据。' };
  if (score >= 70) return { title: '有清晰的能力交集。', desc: '方向是对的，面试前把最接近岗位的案例讲得更具体，会明显提升说服力。' };
  if (score >= 55) return { title: '有基础，但需要补证据。', desc: '你已经覆盖了一部分要求，可以优先补一到两个高频能力点，再决定如何投递。' };
  return { title: '先补齐核心证据。', desc: '这份 JD 和当前作品集的交集偏少，建议先找出最接近的项目或调整目标岗位。' };
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
  if (!jdInput.value.trim() || jdInput.value === SAMPLE_JDS.product || jdInput.value === SAMPLE_JDS.ux || jdInput.value === SAMPLE_JDS.strategy) {
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
