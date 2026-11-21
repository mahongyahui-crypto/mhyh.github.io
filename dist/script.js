import { CASE_LIBRARY } from './data/projects.js';
import { BONUS_CATALOG, CITY_TERMS, DEGREE_RANK, EXPERIENCE_CATALOG, INDUSTRY_CATALOG, REQUIRED_SKILL_CATALOG, RESUME_PROFILE, SKILLS } from './data/match-profile.js';
import { initHeroLens } from './modules/hero-lens.js?v=motion-restore-20261121-1';
import { initExperience } from './modules/experience.js?v=experience-hover-20261117-1';
import { initReveal } from './modules/reveal.js';
import { analyzeJobDescription } from './modules/job-fit-engine.js?v=match-engine-v3-20261119-1';
import { trackEvent } from './modules/analytics.js?v=analytics-contract-20261119-1';

const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];


const jdInput = $('#jdInput');
const analyzeBtn = $('#analyzeBtn');
const analyzeButtonLabel = $('#analyzeButtonLabel');
const jdError = $('#jdError');
const matchResult = $('#matchResult');
const scoreRing = $('#scoreRing');
const scoreValue = $('#scoreValue');
const scoreTitle = $('#scoreTitle');
const scoreDesc = $('#scoreDesc');
const scoreStatus = $('#scoreStatus');
const scoreCompare = $('#scoreCompare');
const radarChart = $('#radarChart');
const dimensionCards = $('#dimensionCards');
const matchedSkills = $('#matchedSkills');
const gapSkills = $('#gapSkills');
const unknownSkills = $('#unknownSkills');
const bonusSkills = $('#bonusSkills');
const evidenceList = $('#evidenceList');
const evidenceAllList = $('#evidenceAllList');
const evidenceDetails = $('#evidenceDetails');
const evidenceCount = $('#evidenceCount');
const gapExtraDetails = $('#gapExtraDetails');
const gapExtraCount = $('#gapExtraCount');
const jdTrace = $('#jdTrace');
const resumeTrace = $('#resumeTrace');
const jdTraceCount = $('#jdTraceCount');
const resumeTraceCount = $('#resumeTraceCount');
const resultTip = $('#resultTip');
const resultRisk = $('#resultRisk');
const hardGateSummary = $('#hardGateSummary');
const hardGateList = $('#hardGateList');
const interviewQuestions = $('#interviewQuestions');
let lastAnalyzedJD = '';


function normalize(value) {
  return String(value || '').toLowerCase().replace(/[\s\n\r·•/、，。！？：；（）()\-]+/g, '');
}

function escapeHTML(value) {
  return String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
}

function containsAny(text, terms) {
  const normalized = normalize(text);
  return terms.some((term) => normalized.includes(normalize(term)));
}

function termContext(text, terms) {
  const raw = String(text || '').toLowerCase();
  for (const term of terms) {
    const needle = String(term).toLowerCase();
    const index = raw.indexOf(needle);
    if (index >= 0) return raw.slice(Math.max(0, index - 26), Math.min(raw.length, index + needle.length + 28));
  }
  return '';
}

function isBonusTerm(jd, terms) {
  return Boolean(termContext(jd, terms) && /优先考虑|优先|加分|最好|可选/.test(termContext(jd, terms)));
}

function extractMinimumYears(jd) {
  const matches = [
    ...jd.matchAll(/(?:至少|不少于|相关经验|工作经验|经验要求|拥有|具备)[^\n。；;]{0,20}?([\d.]+)\s*(?:年以上|年经验|年|\+年?)/gi),
    ...jd.matchAll(/([\d.]+)\s*(?:年以上|\+年?)/gi)
  ];
  return matches.length ? Math.max(...matches.map((match) => Number(match[1])).filter(Number.isFinite)) : 0;
}

function weightedCoverage(items, matched) {
  const total = items.reduce((sum, item) => sum + (item.weight || 1), 0);
  const hit = matched.reduce((sum, item) => sum + (item.weight || 1), 0);
  return total ? Math.round((hit / total) * 100) : 0;
}

function dimensionTone(score) {
  return score >= 80 ? 'high' : score >= 60 ? 'mid' : score >= 40 ? 'caution' : 'reject';
}

function dimensionStatus(dimension) {
  if (dimension.unmet?.length) return dimension.key === 'hard' || dimension.key === 'basic' ? '存在硬缺口' : '存在缺口';
  if (dimension.unknown?.length) return '待核验';
  if (!dimension.mentioned?.length) return dimension.key === 'bonus' ? '未识别（不扣分）' : '未识别';
  if (dimension.key === 'bonus') return dimension.score >= 80 ? '加分项命中' : '部分命中';
  return dimension.score >= 80 ? '较强命中' : dimension.score >= 60 ? '部分命中' : '命中较少';
}

function dimensionSignal(dimension) {
  return dimension.unmet?.[0] || dimension.unknown?.[0] || dimension.highlights?.[0] || dimension.note || '当前没有可比对的明确要点';
}

function getRequiredSkillDimension(jd) {
  const mentioned = REQUIRED_SKILL_CATALOG.filter((skill) => containsAny(jd, skill.terms));
  const core = mentioned.filter((skill) => !isBonusTerm(jd, skill.terms));
  const bonusMentioned = mentioned.filter((skill) => isBonusTerm(jd, skill.terms));
  const matched = core.filter((skill) => skill.resume);
  const missing = core.filter((skill) => !skill.resume);
  const score = core.length ? Math.max(0, weightedCoverage(core, matched) - missing.length * 8) : 0;
  return {
    score,
    mentioned: core,
    matched,
    unmet: missing.map((skill) => `必备技能缺口：${skill.label}`),
    unknown: core.length ? [] : ['JD 未识别到明确的必备技能'],
    highlights: matched.map((skill) => `${skill.label}：${skill.evidence}`),
    matchedItems: matched.map((skill) => skill.label),
    unmetItems: missing.map((skill) => skill.label),
    needsConfirmation: !core.length,
    jd: core.length ? `识别到必备技能：${core.map((skill) => skill.label).join('、')}。${bonusMentioned.length ? `另有加分技能：${bonusMentioned.map((skill) => skill.label).join('、')}。` : ''}必备技能按资料中明确写到掌握或使用过的内容计分。` : 'JD 未识别到明确的必备技能；不把未提及当作命中，建议 HR 直接核对 JD 原文。',
    resume: matched.length ? matched.map((skill) => skill.evidence) : ['当前简历与作品集资料库没有对应的必备技能证据。']
  };
}

function getExperienceDimension(jd) {
  const mentioned = EXPERIENCE_CATALOG.filter((item) => containsAny(jd, item.terms) && !isBonusTerm(jd, item.terms));
  const requiredYears = extractMinimumYears(jd);
  const yearItem = requiredYears ? { label: `${requiredYears} 年以上相关经验`, weight: 4, resume: RESUME_PROFILE.years >= requiredYears, evidence: `资料库记录：${RESUME_PROFILE.years} 年+ UI / UX 设计经验` } : null;
  const items = yearItem ? [yearItem, ...mentioned] : mentioned;
  const matched = items.filter((item) => item.resume);
  const missing = items.filter((item) => !item.resume);
  return {
    score: items.length ? weightedCoverage(items, matched) : 0,
    mentioned: items,
    matched,
    unmet: missing.map((item) => `项目 / 岗位经验缺口：${item.label}`),
    unknown: items.length ? [] : ['JD 未识别到明确的岗位职责或项目类型'],
    highlights: matched.map((item) => `${item.label}：${item.evidence}`),
    matchedItems: matched.map((item) => item.label),
    unmetItems: missing.map((item) => item.label),
    needsConfirmation: !items.length,
    jd: items.length ? `按岗位职责、项目类型${requiredYears ? `和 ${requiredYears} 年以上年限` : ''}比对，不只看岗位 title；已命中项与缺口均保留在明细中。` : 'JD 未识别到明确的岗位职责、项目类型或年限条件。',
    resume: matched.length ? matched.map((item) => item.evidence) : ['当前简历与作品集资料库没有对应的项目 / 岗位经验证据。']
  };
}

function getIndustryDimension(jd) {
  const mentioned = INDUSTRY_CATALOG.filter((item) => containsAny(jd, item.terms) && !isBonusTerm(jd, item.terms));
  const score = mentioned.length ? Math.round(mentioned.reduce((sum, item) => sum + item.matchScore, 0) / mentioned.length) : 0;
  const matched = mentioned.filter((item) => item.matchScore > 0);
  const crossIndustry = mentioned.filter((item) => item.matchScore === 0);
  return {
    score,
    mentioned,
    matched,
    unmet: crossIndustry.map((item) => `行业背景缺口：${item.label}`),
    unknown: mentioned.length ? [] : ['JD 未识别到明确的行业或赛道'],
    highlights: matched.map((item) => `${item.label}：${item.evidence}${item.matchScore === 100 ? '（同赛道）' : '（相关业务）'}`),
    matchedItems: matched.map((item) => item.label),
    unmetItems: crossIndustry.map((item) => item.label),
    needsConfirmation: !mentioned.length,
    jd: mentioned.length ? `按同赛道 > 相关业务 > 跨行业比对；当前识别到：${mentioned.map((item) => item.label).join('、')}。` : 'JD 未识别到明确的行业或赛道要求，不凭岗位名称猜行业。',
    resume: mentioned.length ? mentioned.map((item) => item.evidence) : ['当前资料库已整理的行业证据：企业服务、零售 / 门店、二手 3C / 回收。']
  };
}

function degreeFromText(jd) {
  return Object.keys(DEGREE_RANK).filter((degree) => jd.includes(degree)).sort((a, b) => DEGREE_RANK[b] - DEGREE_RANK[a])[0] || '';
}

function basicRequirement(label, status, evidence, kind = 'core', resume = null) {
  return { label, status, evidence, kind, resume };
}

function getBasicDimension(jd) {
  const core = [];
  const optional = [];
  const requiredYears = extractMinimumYears(jd);
  if (requiredYears) {
    const item = basicRequirement(`${requiredYears} 年以上工作经验`, RESUME_PROFILE.years >= requiredYears ? 'matched' : 'unmet', `资料库记录：${RESUME_PROFILE.years} 年+ UI / UX 设计经验`, 'core', RESUME_PROFILE.years >= requiredYears);
    (isBonusTerm(jd, [`${requiredYears}年`, '工作经验', '相关经验']) ? optional : core).push({ ...item, kind: isBonusTerm(jd, [`${requiredYears}年`, '工作经验', '相关经验']) ? 'bonus' : 'core' });
  }
  const degree = degreeFromText(jd);
  if (degree) {
    const status = RESUME_PROFILE.degree ? (DEGREE_RANK[RESUME_PROFILE.degree] >= DEGREE_RANK[degree] ? 'matched' : 'unmet') : 'unknown';
    const item = basicRequirement(`${degree}及以上学历`, status, RESUME_PROFILE.degree ? `资料库学历：${RESUME_PROFILE.degree}` : '简历资料库暂未结构化记录学历', 'core', RESUME_PROFILE.degree ? status === 'matched' : null);
    (isBonusTerm(jd, [degree, '学历']) ? optional : core).push({ ...item, kind: isBonusTerm(jd, [degree, '学历']) ? 'bonus' : 'core' });
  }
  const cities = CITY_TERMS.filter((city) => jd.includes(city));
  const remote = /远程|remote|居家办公/i.test(jd);
  if (cities.length || remote) {
    const locationMatch = cities.some((city) => RESUME_PROFILE.locations.includes(city)) || (remote && RESUME_PROFILE.locations.includes('远程'));
    const label = cities.length ? `工作地点：${cities.join(' / ')}${remote ? ' / 远程' : ''}` : '工作地点：远程';
    const item = basicRequirement(label, locationMatch ? 'matched' : 'unmet', `资料库意向：${RESUME_PROFILE.locations.join(' / ')}`, 'core', locationMatch);
    (isBonusTerm(jd, cities.length ? cities : ['远程']) ? optional : core).push({ ...item, kind: isBonusTerm(jd, cities.length ? cities : ['远程']) ? 'bonus' : 'core' });
  }
  if (/全职|兼职|实习/.test(jd)) {
    const isFullTime = /全职/.test(jd);
    core.push(basicRequirement(`合作形式：${isFullTime ? '全职' : '兼职 / 实习'}`, isFullTime && RESUME_PROFILE.employment === '全职' ? 'matched' : 'unmet', `资料库求职方向：${RESUME_PROFILE.employment}`, 'core', isFullTime && RESUME_PROFILE.employment === '全职'));
  }
  if (/出差|驻场|长期外派|外派/.test(jd)) core.push(basicRequirement('出差 / 驻场要求', RESUME_PROFILE.travel === null ? 'unknown' : RESUME_PROFILE.travel ? 'matched' : 'unmet', '资料库暂未记录明确的出差接受范围', 'core', RESUME_PROFILE.travel));
  if (/到岗|入职|立即入职|可到岗/.test(jd)) core.push(basicRequirement('到岗时间', RESUME_PROFILE.availability ? 'matched' : 'unknown', RESUME_PROFILE.availability || '资料库暂未记录可到岗日期', 'core', Boolean(RESUME_PROFILE.availability)));
  if (/薪资|薪酬|月薪|年薪|\d+\s*[kK]|\d+\s*万\/年/.test(jd)) core.push(basicRequirement('薪资范围', RESUME_PROFILE.salary ? 'matched' : 'unknown', RESUME_PROFILE.salary || '简历资料库暂未提供期望薪资范围', 'core', Boolean(RESUME_PROFILE.salary)));
  const mentioned = [...core, ...optional];
  const matched = core.filter((item) => item.status === 'matched');
  const unmet = core.filter((item) => item.status === 'unmet');
  const unknown = core.filter((item) => item.status === 'unknown');
  return {
    score: core.length ? Math.round((matched.length / core.length) * 100) : 0,
    mentioned,
    items: core,
    optional,
    matched,
    highlights: matched.map((item) => `${item.label}：${item.evidence}`),
    matchedItems: matched.map((item) => item.label),
    unmetItems: unmet.map((item) => item.label),
    unknownItems: unknown.map((item) => item.label),
    unmet: unmet.map((item) => `基础门槛缺口：${item.label}`),
    unknown: unknown.map((item) => `基础门槛待核验：${item.label}`),
    needsConfirmation: !core.length || unknown.length > 0,
    jd: core.length ? `识别了 JD 中的年限、学历、地点、合作形式、出差、到岗或薪资条件，并按资料库逐项比对；资料缺失只标记待核验。` : 'JD 未识别到明确的学历、年限、地点、到岗或合作形式门槛。',
    resume: mentioned.length ? mentioned.map((item) => item.evidence) : ['当前简历资料库暂未结构化记录基础门槛信息。']
  };
}

function getBonusDimension(jd, basic) {
  const catalogItems = BONUS_CATALOG.filter((item) => containsAny(jd, item.terms) && isBonusTerm(jd, item.terms));
  const basicItems = (basic.optional || []).map((item) => ({ label: item.label, resume: item.resume, evidence: item.evidence, weight: 1 }));
  const items = [...new Map([...catalogItems, ...basicItems].map((item) => [item.label, item])).values()];
  const matched = items.filter((item) => item.resume === true);
  const unknown = items.filter((item) => item.resume === null || typeof item.resume === 'undefined');
  return {
    score: items.length ? weightedCoverage(items, matched) : 100,
    mentioned: items,
    matched,
    unmet: [],
    unknown: unknown.map((item) => `加分项待核验：${item.label}`),
    highlights: matched.map((item) => `${item.label}：${item.evidence}`),
    matchedItems: matched.map((item) => item.label),
    unmetItems: [],
    needsConfirmation: false,
    note: items.length ? '加分项命中越多越有利；未命中不扣分。' : 'JD 未识别到明确加分项；此项按中性处理，不扣分。',
    jd: items.length ? `识别到明确标注为“优先 / 加分”的条件：${items.map((item) => item.label).join('、')}；没有把普通任职要求误判为加分项。` : 'JD 未识别到明确的优先或加分条件；未识别不扣分。',
    resume: matched.length ? matched.map((item) => item.evidence) : ['当前资料库暂无明确加分项命中。']
  };
}

function getMatchResult(jd, gateEnabled) {
  const hard = getRequiredSkillDimension(jd);
  const experience = getExperienceDimension(jd);
  const industry = getIndustryDimension(jd);
  const basic = getBasicDimension(jd);
  const bonus = getBonusDimension(jd, basic);
  const dimensions = [
    { key: 'hard', label: '必备技能匹配', shortLabel: '必备技能', weight: 30, ...hard },
    { key: 'experience', label: '项目 / 岗位经验匹配', shortLabel: '项目经验', weight: 25, ...experience },
    { key: 'industry', label: '行业背景匹配', shortLabel: '行业背景', weight: 15, ...industry },
    { key: 'basic', label: '基础门槛匹配', shortLabel: '基础门槛', weight: 20, ...basic },
    { key: 'bonus', label: '附加加分项匹配', shortLabel: '附加加分', weight: 10, ...bonus }
  ];
  const baseScore = Math.round(dimensions.reduce((sum, dimension) => sum + dimension.score * dimension.weight, 0) / 100);
  const gateReasons = [
    ...hard.unmetItems.map((item) => `缺少必备技能：${item}`),
    ...basic.unmetItems.map((item) => `基础门槛不满足：${item}`)
  ];
  const blocked = Boolean(gateEnabled && gateReasons.length);
  const score = blocked ? Math.min(59, baseScore) : baseScore;
  const unique = (items) => [...new Set(items.filter(Boolean))];
  const matchedItems = unique(dimensions.flatMap((dimension) => dimension.matchedItems || []));
  const unmetItems = unique(dimensions.flatMap((dimension) => dimension.unmetItems || []));
  const unknownItems = unique(dimensions.flatMap((dimension) => dimension.unknownItems || dimension.unknown || []));
  const bonusItems = unique(bonus.matchedItems);
  const evidence = unique(dimensions.flatMap((dimension) => dimension.resume || [])).slice(0, 12);
  return {
    dimensions,
    baseScore,
    score,
    blocked,
    gateReasons,
    matchedItems,
    unmetItems,
    unknownItems,
    bonusItems,
    matchedCount: matchedItems.length,
    highlights: unique(dimensions.flatMap((dimension) => dimension.highlights || [])).slice(0, 8),
    risks: unique([...gateReasons, ...unmetItems, ...unknownItems]).slice(0, 8),
    dataGaps: unknownItems.slice(0, 6),
    evidence
  };
}

function resultLevel(score) {
  if (score >= 80) return { label: '优先邀约', tone: 'high' };
  if (score >= 60) return { label: '可沟通评估', tone: 'mid' };
  if (score >= 40) return { label: '谨慎考虑', tone: 'caution' };
  return { label: '初筛不推荐', tone: 'reject' };
}

function resultCopy(result) {
  const topGap = result.unmetItems[0] || result.dataGaps[0];
  if (result.blocked) return { title: '存在硬性门槛缺口。', desc: `初筛分数已按门槛规则标记；优先核对${topGap || '红色缺口'}，不把它解释成完整能力评价。` };
  if (result.score >= 80) return { title: '优先邀约。', desc: topGap ? `核心条件交集较多，但仍需核对${topGap}。` : '当前没有识别到明确的硬性缺口，可优先查看对应项目证据。' };
  if (result.score >= 60) return { title: '可沟通评估。', desc: `已命中部分核心条件，优先核对${topGap || '项目经验和基础门槛'}。` };
  if (result.score >= 40) return { title: '谨慎考虑。', desc: `当前存在明显缺口，优先核对${topGap || '必备技能与基础门槛'}。` };
  return { title: '初筛不推荐。', desc: `当前核心条件命中较少，优先核对${topGap || '必备技能、项目经验和基础门槛'}。` };
}

/* Legacy scoring implementation retained for reference but disabled.
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

function dimensionTone(score) {
  return score >= 80 ? 'high' : score >= 60 ? 'mid' : 'low';
}

function dimensionStatus(dimension) {
  if (dimension.key === 'stability') {
    if (dimension.score >= 80) return '风险较低';
    if (dimension.score >= 60) return '需要核验';
    return '风险偏高';
  }
  if (dimension.key === 'constraints' && dimension.needsConfirmation) return '待确认';
  if (dimension.key === 'hard' && dimension.missingRequired?.length) return '有硬技能缺口';
  if (dimension.key === 'hard' && !dimension.mentioned?.length) return '待明确';
  if (dimension.needsConfirmation) return '待确认';
  return dimension.score >= 80 ? '较强匹配' : dimension.score >= 60 ? '部分匹配' : '需要补证据';
}

function dimensionSignal(dimension) {
  if (dimension.key === 'stability') return dimension.risks[0] || '连续同赛道经历，风险暂低';
  return dimension.risks[0] || dimension.highlights[0] || '当前没有可比对的明确要点';
}

function getHardSkillDimension(jd) {
  const mentioned = HARD_SKILL_CATALOG.filter((skill) => containsAny(jd, skill.terms));
  const matched = mentioned.filter((skill) => skill.resume);
  const missing = mentioned.filter((skill) => !skill.resume);
  const required = mentioned.filter((skill) => isRequiredTerm(jd, skill.terms));
  const missingRequired = mentioned.filter((skill) => !skill.resume && isRequiredTerm(jd, skill.terms));
  const requiredCoverage = required.length ? (required.filter((skill) => skill.resume).length / required.length) * 100 : 100;
  const overallCoverage = mentioned.length ? (matched.length / mentioned.length) * 100 : 0;
  const score = mentioned.length ? Math.max(0, Math.round(requiredCoverage * .65 + overallCoverage * .35 - missingRequired.length * 8)) : 48;
  return {
    score,
    confidence: mentioned.length ? (missingRequired.length ? 76 : 88) : 35,
    matched,
    mentioned,
    required,
    missing,
    missingRequired,
    highlights: matched.map((skill) => `${skill.label}：${skill.evidence}`),
    risks: [...missingRequired.map((skill) => `必填硬技能缺口：${skill.label}`), ...missing.filter((skill) => !missingRequired.includes(skill)).map((skill) => `待补充技能证据：${skill.label}`)],
    needsConfirmation: !mentioned.length,
    jd: mentioned.length ? `识别到 ${mentioned.map((skill) => skill.label).join('、')}；${missingRequired.length ? `其中 ${missingRequired.map((skill) => skill.label).join('、')} 未在资料库中出现。` : '当前资料库均有对应证据。'}` : 'JD 暂未识别到可核验的工具或技术栈，不把“未提及”当作匹配，当前按资料不足计分。',
    resume: matched.length ? matched.map((skill) => skill.evidence) : ['当前简历与作品集资料库没有对应硬技能证据。']
  };
}

function getExperienceDimension(jd) {
  const requiredYears = extractMinimumYears(jd);
  const yearsScore = requiredYears ? Math.min(100, Math.round((RESUME_PROFILE.years / requiredYears) * 100)) : 65;
  const businessHits = [...new Set(RESUME_PROFILE.tracks.filter((term) => containsAny(jd, [term])))];
  const industryMentioned = containsAny(jd, ['b端', 'saas', 'erp', '后台', '企业版', '连锁', '门店', '企业服务', 'to b', 'c端', '消费者']);
  const cToCOnly = containsAny(jd, ['c端', '消费者', '消费互联网']) && !containsAny(jd, ['b端', 'saas', 'erp', '后台', '企业版', '连锁', '门店']);
  const industryScore = cToCOnly ? 45 : industryMentioned ? Math.min(94, 64 + Math.min(4, businessHits.length) * 8) : 62;
  const roleMentioned = containsAny(jd, ['产品设计', 'ui设计', 'ux', '交互设计', '设计师', '视觉设计']);
  const roleScore = roleMentioned ? 92 : 58;
  const projectMentioned = containsAny(jd, ['库存', '采购', '销售', '订单', '维修', '回收', '循环经济', 'crm', '商城', '小程序']);
  const projectScore = projectMentioned ? 88 : 58;
  const score = Math.min(100, Math.round(yearsScore * .35 + industryScore * .3 + roleScore * .2 + projectScore * .15));
  const risks = requiredYears && RESUME_PROFILE.years < requiredYears ? [`年限门槛：JD 要求 ${requiredYears} 年，资料库记录为 5 年+`] : [];
  const evidenceSignals = [requiredYears, industryMentioned, roleMentioned, projectMentioned].filter(Boolean).length;
  return {
    score,
    confidence: Math.min(90, 45 + evidenceSignals * 12),
    requiredYears,
    yearsMismatch: Boolean(requiredYears && RESUME_PROFILE.years < requiredYears),
    highlights: ['5 年+ UI / UX 设计经验', industryMentioned ? `业务方向：${businessHits.slice(0, 4).join('、') || 'B 端 / 企业服务'}` : '覆盖 App、PC、后台和小程序项目'],
    risks,
    needsConfirmation: evidenceSignals < 3,
    jd: requiredYears ? `JD 提到至少 ${requiredYears} 年相关经验；同时检查了岗位类型、行业和项目业务是否对齐。` : 'JD 未写明明确年限门槛，按岗位类型、行业和项目业务做匹配。',
    resume: ['5 年+ UI / UX 设计经验', '企业连锁版、CRM、私域商城 0-1', 'ERP 50+ 项需求与复杂业务流程']
  };
}

function getSoftDimension(jd) {
  const mentioned = SOFT_SKILL_CATALOG.filter((skill) => containsAny(jd, skill.terms));
  const matched = mentioned.filter((skill) => skill.resume !== false);
  const missing = mentioned.filter((skill) => skill.resume === false);
  const coverage = mentioned.length ? matched.length / mentioned.length : 0;
  const evidenceLevel = matched.length ? matched.reduce((sum, skill) => sum + (skill.evidenceLevel || .55), 0) / matched.length : 0;
  const score = mentioned.length ? Math.min(82, Math.round(coverage * 70 + evidenceLevel * 30)) : 52;
  return {
    score,
    confidence: mentioned.length ? 68 : 40,
    highlights: matched.map((skill) => `${skill.label}：${skill.evidence}`),
    risks: missing.map((skill) => `需要补充事实案例：${skill.label}`),
    needsConfirmation: missing.length > 0 || evidenceLevel < .75,
    jd: mentioned.length ? `从 JD 中识别到 ${mentioned.map((skill) => skill.label).join('、')} 等行为要求；公开资料只能提供方向性证据，未把自我描述直接当作充分证明。` : 'JD 暂未出现明确软性要求，不把通用能力描述直接当作匹配，当前按资料不足计分。',
    resume: matched.length ? matched.map((skill) => skill.evidence) : ['公开资料中已记录需求拆解、评审、协作与验收经验。']
  };
}

function getConstraintDimension(jd) {
  const checks = [];
  const risks = [];
  const highlights = [];
  const unknowns = [];
  if (containsAny(jd, ['成都', '远程', 'remote', '异地', '北京', '上海', '深圳', '广州', '杭州'])) {
    const locationMatch = containsAny(jd, ['成都', '远程', 'remote']);
    checks.push(locationMatch ? 100 : 45);
    if (locationMatch) highlights.push('地点：成都 / Remote 与资料库意向一致');
    else risks.push('工作地点需要确认：资料库意向为成都 / Remote');
  }
  if (/(薪资|薪酬|月薪|年薪|\d+\s*[kK]|\d+\s*万\/年)/.test(jd)) {
    checks.push(RESUME_PROFILE.salary ? 100 : 50);
    if (!RESUME_PROFILE.salary) unknowns.push('薪资：简历资料库暂未提供期望范围');
  }
  if (/出差|驻场|长期外派/.test(jd)) {
    checks.push(50);
    unknowns.push('出差 / 驻场：当前资料库未记录明确接受范围');
  }
  if (/到岗|入职|立即入职|可到岗/.test(jd)) {
    checks.push(50);
    unknowns.push('到岗时间：当前资料库未提供可到岗日期');
  }
  if (/全职|兼职|实习/.test(jd)) {
    const fullTime = /全职/.test(jd);
    checks.push(fullTime ? 100 : 50);
    if (fullTime) highlights.push('合作形式：全职方向一致');
    else risks.push('合作形式：JD 偏兼职 / 实习，与当前全职方向不一致');
  }
  if (!checks.length) risks.push('JD 未提供薪资、地点、到岗或出差等可比条件，约束匹配无法直接判断');
  const score = checks.length ? Math.round(checks.reduce((sum, value) => sum + value, 0) / checks.length) : 50;
  return {
    score,
    confidence: checks.length ? (unknowns.length ? 45 : 85) : 35,
    highlights,
    risks: [...risks, ...unknowns],
    needsConfirmation: unknowns.length > 0 || !checks.length,
    jd: checks.length ? '识别了 JD 中的地点、薪资、出差、到岗或合作形式，并与资料库逐项比对；缺失资料按待确认处理。' : 'JD 暂未出现明确的地点、薪资、出差或到岗约束，不把未知条件算作匹配。',
    resume: ['所在地：成都', '求职方向：全职 UI / 产品设计', '期望薪资与可到岗时间：资料库暂未记录']
  };
}

function getStabilityDimension(jd) {
  const positiveSignals = [
    RESUME_PROFILE.years >= 5,
    RESUME_PROFILE.stabilityEvidence.some((item) => item.includes('连续')),
    RESUME_PROFILE.stabilityEvidence.some((item) => item.includes('交付'))
  ].filter(Boolean).length;
  let score = 50 + positiveSignals * 6;
  const risks = ['待核验：平均在职时长、离职原因与空窗期未在公开资料中展开'];
  if (/应届|校招|实习生/.test(jd)) {
    score = 42;
    risks.unshift('岗位偏应届 / 校招，与当前 5 年+ 经验方向不完全一致');
  }
  if (/稳定|长期发展|长期任职/.test(jd)) score = Math.min(100, score + 5);
  return {
    score,
    confidence: 42,
    highlights: RESUME_PROFILE.stabilityEvidence,
    risks,
    needsConfirmation: true,
    jd: '这一维度是风险观察，不是能力淘汰项；连续赛道和交付记录是正向信号，但因缺少完整任职时间线，分数保守处理。',
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
    { key: 'hard', label: '硬技能匹配', shortLabel: '硬技能', weight: 30, ...hard },
    { key: 'experience', label: '经验履历匹配', shortLabel: '经验履历', weight: 25, ...experience },
    { key: 'soft', label: '软性要求匹配', shortLabel: '软性要求', weight: 15, ...soft },
    { key: 'constraints', label: '期望与约束', shortLabel: '期望 / 约束', weight: 15, ...constraints },
    { key: 'stability', label: '稳定性与风险', shortLabel: '稳定风险', weight: 15, ...stability }
  ];
  const baseScore = Math.round(dimensions.reduce((sum, dimension) => sum + dimension.score * dimension.weight, 0) / 100);
  const confidence = Math.round(dimensions.reduce((sum, dimension) => sum + (dimension.confidence || 50) * dimension.weight, 0) / 100);
  const gateReasons = [];
  if (hard.missingRequired.length) gateReasons.push(`缺少必填硬技能：${hard.missingRequired.map((skill) => skill.label).join('、')}`);
  if (experience.yearsMismatch) gateReasons.push(`年限未达到 JD 要求：${experience.requiredYears} 年`);
  const blocked = Boolean(gateEnabled && gateReasons.length);
  const score = blocked ? Math.min(59, baseScore) : baseScore;
  const highlights = [...new Set(dimensions.flatMap((dimension) => dimension.highlights))].slice(0, 7);
  const risks = [...new Set([...gateReasons, ...dimensions.flatMap((dimension) => dimension.risks)])].slice(0, 7);
  const dataGaps = [...new Set(dimensions.filter((dimension) => dimension.needsConfirmation).flatMap((dimension) => dimension.risks))].slice(0, 5);
  const matchedEvidence = SKILLS.filter((skill) => containsAny(jd, skill.keywords)).flatMap((skill) => skill.evidence);
  const evidence = [...new Set([...matchedEvidence, ...dimensions.flatMap((dimension) => dimension.resume)])].slice(0, 10);
  return { dimensions, baseScore, score, blocked, gateReasons, highlights, risks, evidence, confidence, dataGaps };
}

function resultCopy(score, blocked, confidence) {
  if (blocked) return { title: '硬性门槛未通过。', desc: '综合分已按门槛规则封顶；这不是能力总评，先确认缺失技能或年限是否可以补充。' };
  if (confidence < 60) return { title: '证据不足，暂不下结论。', desc: '当前分数只反映已提供资料；薪资、到岗、任职时间线或行为案例仍有缺口，不能直接等同于岗位匹配。' };
  if (score >= 80 && confidence >= 75) return { title: '项目证据有清晰交集。', desc: '当前 JD 与简历 / 作品集资料库有较多重合，但仍应逐项核对硬技能、业务深度和可验证结果。' };
  if (score >= 80) return { title: '方向匹配，但证据不完整。', desc: '已有部分能力交集，但资料完整度不足以支持“高度匹配”，建议先补齐关键事实。' };
  if (score >= 60) return { title: '有清晰的能力交集。', desc: '当前资料覆盖了部分岗位要求，建议优先核验最接近项目中的业务深度、实际责任和交付结果。' };
  if (score >= 40) return { title: '有基础，但需要补证据。', desc: '当前资料只覆盖部分要求，建议先核验关键技能、业务场景和硬性条件，再判断是否进入下一轮。' };
  return { title: '当前交集偏少。', desc: '这份 JD 与公开资料的交集有限，建议先核验核心硬技能与业务经验，再判断是否继续推进。' };
}
*/

// V3 rendering helpers. The legacy implementation above remains inert; all new
// reports come from the isolated deterministic engine in job-fit-engine.js.
function dimensionToneV3(score) {
  if (score === null || typeof score === 'undefined') return 'pending';
  return score >= 80 ? 'high' : score >= 60 ? 'mid' : score >= 40 ? 'caution' : 'reject';
}

function dimensionStatusV3(dimension) {
  if (!dimension.applicable) return '未识别（不参与）';
  if (dimension.unmet?.length) return '明确不满足';
  if (dimension.unknown?.length) return '待核实';
  return dimension.score >= 80 ? '较强支持' : dimension.score >= 60 ? '部分支持' : '支持较少';
}

function dimensionSignalV3(dimension) {
  return dimension.unmet?.[0] || dimension.unknown?.[0] || dimension.highlights?.[0] || dimension.note || '当前没有可比对的明确要点';
}

function resultLevelV3(score) {
  if (score === null || typeof score === 'undefined') return { label: '暂无足够结论', tone: 'uncertain' };
  if (score >= 80) return { label: '优先沟通', tone: 'high' };
  if (score >= 60) return { label: '可沟通评估', tone: 'mid' };
  if (score >= 40) return { label: '谨慎核验', tone: 'caution' };
  return { label: '当前交集偏少', tone: 'reject' };
}

function resultCopyV3(result) {
  const topGap = result.unmetItems[0] || result.unknownItems[0];
  if (result.score === null) return { title: '暂不生成综合百分比。', desc: '当前 JD 没有足够的有效必备要求，先补充岗位职责、技能或任职条件原文。' };
  if (result.blocked) return { title: '存在书面硬性条件不满足。', desc: `综合支持率仍只反映已识别要求，不能替代门槛判断；优先核对${topGap || '硬性条件'}。` };
  if (result.score >= 80) return { title: '真实经历有较清晰交集。', desc: topGap ? `当前资料覆盖了较多显性要求，但仍需核对${topGap}。` : '当前已识别的必备要求均有资料支持，仍建议查看逐项证据。' };
  if (result.score >= 60) return { title: '存在可沟通的能力交集。', desc: `当前资料覆盖部分显性要求，建议优先核对${topGap || '项目深度和任职条件'}。` };
  if (result.score >= 40) return { title: '有部分交集，需要补证据。', desc: `当前支持率有限，建议先核对${topGap || '核心技能和项目责任边界'}。` };
  return { title: '当前资料交集偏少。', desc: `当前已确认履历支持有限，优先核对${topGap || '岗位核心要求'}；未记录不等于不会。` };
}

function getV3MatchResult(jd) {
  return analyzeJobDescription(jd);
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
    return `<text x="${point[0]}" y="${point[1]}" text-anchor="${anchor}">${escapeHTML(dimension.shortLabel || dimension.label)}</text>`;
  }).join('');
  const data = dimensions.map((dimension, index) => radarPoint(cx, cy, radius, index, total, dimension.score ?? 0)).join(' ');
  const dots = dimensions.map((dimension, index) => {
    const point = radarPoint(cx, cy, radius, index, total, dimension.score ?? 0).split(',');
    return dimension.score === null ? '' : `<circle cx="${point[0]}" cy="${point[1]}" r="3.5" />`;
  }).join('');
  return `<g class="radar-grid">${grid}</g><g class="radar-axes">${axes}</g><polygon class="radar-data" points="${data}" />${dots}<g class="radar-labels">${labels}</g>`;
}

function renderDimensionCards(dimensions) {
  return dimensions.map((dimension) => {
    const level = dimensionToneV3(dimension.score);
    const contribution = dimension.applicable && dimension.score !== null ? (dimension.score * dimension.weight / 100).toFixed(1).replace('.0', '') : '—';
    const pendingClass = dimension.unknown?.length || !dimension.applicable ? ' dimension-pending' : '';
    const score = dimension.score === null ? '—' : dimension.score;
    const width = dimension.score === null ? 0 : dimension.score;
    return `<article class="dimension-card dimension-${level}${pendingClass}"><div class="dimension-card-top"><b>${escapeHTML(dimension.label)}</b><span>权重 ${dimension.weight}%</span></div><div class="dimension-score-row"><strong>${score}</strong><em>${escapeHTML(dimensionStatusV3(dimension))}</em></div><div class="dimension-bar"><i style="width:${width}%"></i></div><p>${escapeHTML(dimensionSignalV3(dimension))}</p><small class="dimension-contribution">计入总分 ${contribution} 分</small></article>`;
  }).join('');
}

function renderTrace(result) {
  jdTrace.innerHTML = result.dimensions.map((dimension) => {
    const score = dimension.score === null ? '不适用' : `${dimension.score} / 100`;
    return `<div class="trace-row"><b>${escapeHTML(dimension.label)}</b><span><strong>${score}</strong> · 有效权重 ${dimension.applicable ? `${dimension.weight}%（按适用维度归一化）` : '不参与'}<br />${escapeHTML(dimension.jd)}</span></div>`;
  }).join('');
  resumeTrace.innerHTML = result.requirements.length
    ? result.requirements.map((requirement) => {
      const evidenceMarkup = requirement.evidence?.length
        ? requirement.evidence.map((record) => `<div class="trace-evidence"><b>${escapeHTML(record.project_name)}</b><span>${escapeHTML(record.personal_role)}。${escapeHTML(record.work_content)}</span>${record.portfolio_status === 'linked' && record.portfolio_reference ? `<button class="evidence-portfolio-trigger" type="button" data-project="${escapeHTML(record.portfolio_reference)}">查看相关作品 ↗</button>` : ''}</div>`).join('')
        : '<span class="trace-empty">当前没有可直接关联的项目证据；不把未记录视为不具备。</span>';
      const sourceText = requirement.source_text || requirement.source_texts?.[0] || requirement.original_text;
      return `<details class="trace-requirement trace-status-${escapeHTML(requirement.status)}"><summary><span class="trace-requirement-head"><b>${escapeHTML(requirement.normalized_requirement || requirement.original_text)}</b><span>${escapeHTML(requirement.status_label)}${requirement.priority ? ' · 优先条件' : ''}</span></span><small class="trace-source">JD原文：${escapeHTML(sourceText)}</small></summary><div class="trace-requirement-body"><p>${escapeHTML(requirement.explanation)}</p><small>核验口径：${escapeHTML(requirement.verification_criteria)}</small><div class="trace-evidence-list">${evidenceMarkup}</div></div></details>`;
    }).join('')
    : '<p class="trace-empty">没有足够的有效 JD 要求可供逐项对照。</p>';
  jdTraceCount.textContent = `${result.dimensions.length} 项`;
  resumeTraceCount.textContent = `${result.evidenceRecords.length} 条证据`;
}

function evidenceCardMarkup(record) {
  return `<article class="evidence-item"><div class="evidence-item-head"><b>${escapeHTML(record.project_name)}</b><span>${escapeHTML(record.project_status)}</span></div><p>${escapeHTML(record.work_content)}</p><small>${escapeHTML(record.personal_role)}</small>${record.portfolio_status === 'linked' && record.portfolio_reference ? `<button class="evidence-portfolio-trigger" type="button" data-project="${escapeHTML(record.portfolio_reference)}">查看相关作品 ↗</button>` : '<span class="evidence-no-link">作品尚未单独关联</span>'}</article>`;
}

function renderEvidenceCards(records) {
  return records.length
    ? records.map(evidenceCardMarkup).join('')
    : '<span class="gap-item">当前没有与 JD 直接对应的项目证据</span>';
}

function animateNumber(target, value) {
  if (value === null || typeof value === 'undefined') {
    target.textContent = '—';
    return;
  }
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

function renderMatchResult(jd, shouldScroll = true) {
  const result = getV3MatchResult(jd);
  const copy = resultCopyV3(result);
  matchResult.classList.remove('is-hidden', 'is-ready');
  if (analyzeButtonLabel) analyzeButtonLabel.textContent = '重新匹配';
  if (jdError) {
    jdError.hidden = true;
    jdInput.removeAttribute('aria-invalid');
  }
  const level = resultLevelV3(result.score);
  const scoreTone = result.blocked ? 'reject' : level.tone;
  scoreRing.className = `score-ring score-${scoreTone}${result.blocked ? ' is-blocked' : ''}`;
  scoreRing.style.setProperty('--score-angle', `${(result.score ?? 0) * 3.6}deg`);
  animateNumber(scoreValue, result.score);
  scoreTitle.textContent = copy.title;
  scoreDesc.textContent = copy.desc;
  const resultStatus = result.blocked ? '硬性条件需单独核验' : level.label;
  scoreStatus.textContent = resultStatus;
  scoreStatus.className = `score-status is-${scoreTone}${result.blocked ? ' is-blocked' : ''}`;
  const scoreMeta = `支持 ${result.ratios.supported ?? '—'}% · 待核实 ${result.ratios.pending ?? '—'}% · 明确不满足 ${result.ratios.unmet ?? '—'}%`;
  scoreCompare.textContent = result.score === null
    ? `有效必备要求 ${result.validRequirementCount} 项 · 未生成综合百分比`
    : `五维有效权重归一化 · ${scoreMeta}`;
  radarChart.innerHTML = renderRadar(result.dimensions);
  dimensionCards.innerHTML = renderDimensionCards(result.dimensions);
  matchedSkills.innerHTML = result.matchedItems.length ? result.matchedItems.map((item) => `<span class="skill-chip">✅ ${escapeHTML(item)}</span>`).join('') : '<span class="gap-item">暂无命中项</span>';
  gapSkills.innerHTML = result.unmetItems.map((item) => `<span class="gap-item">❌ ${escapeHTML(item)}</span>`).join('') || '<span class="gap-item">未识别到明确缺口</span>';
  unknownSkills.innerHTML = result.unknownItems.map((item) => `<span class="gap-item is-unknown">⚠ ${escapeHTML(item)}</span>`).join('') || '<span class="gap-item is-unknown">暂无待补充条件</span>';
  const bonusItems = [...result.bonusItems.map((item) => `已支持：${item}`), ...result.bonusPendingItems.map((item) => `待核实：${item}`)];
  bonusSkills.innerHTML = bonusItems.length ? bonusItems.map((item) => `<span class="skill-chip bonus-chip">➕ ${escapeHTML(item)}</span>`).join('') : '<span class="gap-item bonus-empty">未识别到优先条件（不扣分）</span>';
  const evidenceRecords = result.evidenceRecords || [];
  const previewRecords = evidenceRecords.slice(0, 3);
  evidenceList.innerHTML = renderEvidenceCards(previewRecords);
  if (evidenceAllList && evidenceDetails) {
    evidenceAllList.innerHTML = renderEvidenceCards(evidenceRecords);
    const extraEvidenceCount = Math.max(0, evidenceRecords.length - previewRecords.length);
    evidenceDetails.hidden = extraEvidenceCount === 0;
    if (evidenceCount) evidenceCount.textContent = extraEvidenceCount ? `还有 ${extraEvidenceCount} 条` : '';
  }
  if (gapExtraDetails) {
    const extraCount = result.matchedItems.length + bonusItems.length;
    gapExtraDetails.hidden = extraCount === 0;
    if (gapExtraCount) gapExtraCount.textContent = extraCount ? `${extraCount} 项` : '';
  }
  if (hardGateSummary && hardGateList) {
    const hardItems = result.hardGates.items;
    hardGateSummary.hidden = hardItems.length === 0;
    hardGateList.innerHTML = hardItems.map((requirement) => `<div class="hard-gate-item is-${escapeHTML(requirement.status)}"><b>${escapeHTML(requirement.status_label)}</b><span>${escapeHTML(requirement.normalized_requirement)}</span><p>${escapeHTML(requirement.explanation)}</p></div>`).join('');
  }
  renderTrace(result);
  $$('.result-trace > details').forEach((details) => {
    details.open = false;
  });
  resultRisk.textContent = result.risks[0] || '未识别到明确风险；仍需结合项目深度与面试信息判断。';
  resultTip.textContent = result.blocked
    ? result.gateReasons[0]
    : result.unmetItems[0]
      ? `优先核对：${result.unmetItems[0]}。`
      : result.dataGaps[0]
        ? `优先补充：${result.dataGaps[0]}。`
        : result.score === null
          ? '有效要求过少，暂不生成综合百分比。'
          : '当前没有识别到明确的待补充条件；最终仍需结合项目深度和面试信息判断。';
  if (interviewQuestions) {
    interviewQuestions.innerHTML = result.interviewQuestions.length
      ? result.interviewQuestions.map((question) => `<li>${escapeHTML(question)}</li>`).join('')
      : '';
  }
  lastAnalyzedJD = jd;
  trackEvent('jd_analysis_complete', { page_id: 'portfolio', section_id: 'match', valid_requirement_count: result.validRequirementCount, score_available: result.score !== null });
  window.requestAnimationFrame(() => matchResult.classList.add('is-ready'));
  if (shouldScroll) matchResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function analyzeJD() {
  const jd = jdInput.value.trim();
  if (!jd) {
    if (jdError) {
      jdError.textContent = '请先粘贴岗位描述，再开始匹配。';
      jdError.hidden = false;
      jdInput.setAttribute('aria-invalid', 'true');
    }
    showToast('先粘贴一段 JD，再来分析匹配度。');
    jdInput.focus();
    return;
  }
  if (jdError) {
    jdError.hidden = true;
    jdInput.removeAttribute('aria-invalid');
  }
  trackEvent('jd_analysis_start', { page_id: 'portfolio', section_id: 'match' });
  try {
    renderMatchResult(jd);
  } catch (error) {
    trackEvent('jd_analysis_error', { page_id: 'portfolio', section_id: 'match', error_type: error?.name || 'unknown' });
    if (jdError) {
      jdError.textContent = '本地分析暂时失败，请检查 JD 文本后重试。';
      jdError.hidden = false;
      jdInput.setAttribute('aria-invalid', 'true');
    }
    showToast('本地分析暂时失败，请稍后重试。');
    console.error(error);
  }
}

jdInput.addEventListener('input', () => {
  if (!jdError?.hidden) {
    jdError.hidden = true;
    jdInput.removeAttribute('aria-invalid');
  }
});

function showToast(message) {
  const toast = $('#toast');
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove('show'), 2600);
}

const contactFlipCard = $('#contactFlipCard');
const contactFront = $('#contactFront');
const contactBack = $('#contactBack');
const contactToggle = $('#contactToggle');
const contactBackButton = $('#contactBackButton');
const contactCopies = $$('.contact-copy');
const contactQrTrigger = $('#contactQrTrigger');
const contactQrDialog = $('#contactQrDialog');
const contactQrDialogClose = $('#contactQrDialogClose');
const contactDialog = $('#contactDialog');
const contactDialogClose = $('#contactDialogClose');
let contactFlipped = false;
let contactFocusFrame = 0;
let contactDialogReturnTarget = null;

const setContactFlipped = (flipped, { moveFocus = true } = {}) => {
  if (!contactFlipCard || !contactFront || !contactBack || !contactToggle) return;
  contactFlipped = Boolean(flipped);
  contactFlipCard.dataset.flipped = String(contactFlipped);
  contactFlipCard.classList.toggle('is-flipped', contactFlipped);
  contactToggle.setAttribute('aria-expanded', String(contactFlipped));
  contactFront.setAttribute('aria-hidden', String(contactFlipped));
  contactBack.setAttribute('aria-hidden', String(!contactFlipped));
  contactFront.inert = contactFlipped;
  contactBack.inert = !contactFlipped;
  if (!contactFlipped && contactQrDialog?.open) contactQrDialog.close();

  if (!moveFocus) return;
  window.cancelAnimationFrame(contactFocusFrame);
  contactFocusFrame = window.requestAnimationFrame(() => {
    const nextTarget = contactFlipped ? contactBackButton : contactToggle;
    nextTarget?.focus({ preventScroll: true });
  });
};

contactToggle?.addEventListener('click', () => setContactFlipped(true));
contactBackButton?.addEventListener('click', () => setContactFlipped(false));
const openContactDialog = (trigger = null) => {
  if (!contactDialog) return;
  contactDialogReturnTarget = trigger || document.activeElement;
  if (typeof contactDialog.showModal === 'function' && !contactDialog.open) contactDialog.showModal();
  else contactDialog.setAttribute('open', '');
  navContact?.setAttribute('aria-expanded', 'true');
  window.requestAnimationFrame(() => contactDialogClose?.focus({ preventScroll: true }));
};
const closeContactDialog = () => {
  if (!contactDialog) return;
  if (typeof contactDialog.close === 'function' && contactDialog.open) contactDialog.close();
  else contactDialog.removeAttribute('open');
  navContact?.setAttribute('aria-expanded', 'false');
  contactDialogReturnTarget?.focus?.({ preventScroll: true });
  contactDialogReturnTarget = null;
};
contactDialogClose?.addEventListener('click', closeContactDialog);
contactDialog?.addEventListener('click', (event) => {
  if (event.target === contactDialog) closeContactDialog();
});
contactDialog?.addEventListener('close', () => {
  navContact?.setAttribute('aria-expanded', 'false');
  contactDialogReturnTarget?.focus?.({ preventScroll: true });
  contactDialogReturnTarget = null;
});
document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  if (contactDialog?.open) {
    event.preventDefault();
    closeContactDialog();
    return;
  }
  if (!contactFlipped) return;
  event.preventDefault();
  setContactFlipped(false);
});

const fallbackCopy = (text) => {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  let copied = false;
  try { copied = document.execCommand('copy'); } catch { copied = false; }
  textarea.remove();
  return copied;
};

const copyContactValue = async (button, labelNode) => {
  const value = button?.dataset.copyValue || '';
  if (!value) return;
  let copied = false;
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      copied = true;
    } else {
      copied = fallbackCopy(value);
    }
  } catch {
    copied = fallbackCopy(value);
  }
  if (labelNode) {
    labelNode.textContent = copied ? '已复制' : '复制失败';
    window.setTimeout(() => { labelNode.textContent = button.dataset.copyLabel || '复制联系方式'; }, 1800);
  }
  showToast(copied ? '联系方式已复制' : '复制失败，请手动选择。');
};

contactCopies.forEach((button) => {
  button.addEventListener('click', () => copyContactValue(button, $('.contact-copy-label', button)));
});

contactQrTrigger?.addEventListener('click', () => {
  if (!contactQrDialog) return;
  if (typeof contactQrDialog.showModal === 'function') contactQrDialog.showModal();
  else contactQrDialog.setAttribute('open', '');
  window.requestAnimationFrame(() => contactQrDialogClose?.focus({ preventScroll: true }));
});
contactQrDialogClose?.addEventListener('click', () => contactQrDialog?.close());
contactQrDialog?.addEventListener('click', (event) => {
  if (event.target === contactQrDialog) contactQrDialog.close();
});

analyzeBtn.addEventListener('click', analyzeJD);

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

evidenceList?.addEventListener('click', (event) => {
  const trigger = event.target.closest('.evidence-portfolio-trigger');
  if (!trigger) return;
  event.preventDefault();
  event.stopPropagation();
  openProjectCase(trigger.dataset.project);
});

resumeTrace?.addEventListener('click', (event) => {
  const trigger = event.target.closest('.evidence-portfolio-trigger');
  if (!trigger) return;
  event.preventDefault();
  event.stopPropagation();
  openProjectCase(trigger.dataset.project);
});

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
const toggleNav = () => {
  const isOpen = nav.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
};
let suppressNextNavClick = false;
navToggle.addEventListener('pointerup', () => {
  suppressNextNavClick = true;
  toggleNav();
  window.setTimeout(() => { suppressNextNavClick = false; }, 0);
}, { passive: true });
navToggle.addEventListener('click', () => {
  if (suppressNextNavClick) return;
  toggleNav();
});
const navLinks = $$('.nav a[href^="#"]');
const navContact = $('.nav-contact');
const navItems = [...navLinks, ...(navContact ? [navContact] : [])];
const navSections = navItems
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);
const setActiveNav = (id) => {
  navItems.forEach((link) => {
    const active = link.getAttribute('href') === `#${id}`;
    link.classList.toggle('is-active', active);
    if (active) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
};
const contactTitle = $('#contact-title');
const closeMobileNav = () => {
  nav.classList.remove('is-open');
  navToggle.setAttribute('aria-expanded', 'false');
};
const scrollToContact = ({ behavior = 'smooth', updateHistory = true } = {}) => {
  if (!contactTitle) return;
  if (updateHistory && window.location.hash !== '#contact') {
    window.history.pushState({ section: 'contact' }, '', '#contact');
  }
  setActiveNav('contact');
  closeMobileNav();
  window.requestAnimationFrame(() => {
    const rect = contactTitle.getBoundingClientRect();
    const targetTop = Math.max(0, window.scrollY + rect.top - (window.innerHeight - rect.height) / 2);
    window.scrollTo({ top: targetTop, behavior });
  });
};
const scrollToTop = (event) => {
  event.preventDefault();
  setActiveNav('home');
  closeMobileNav();
  if (window.location.hash !== '#home') {
    window.history.replaceState({ section: 'home' }, '', '#home');
  }
  window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
};
navLinks.forEach((link) => link.addEventListener('click', () => {
  setActiveNav(link.getAttribute('href').slice(1));
  closeMobileNav();
}));
$$('a[href="#contact"]').forEach((link) => link.addEventListener('click', (event) => {
  event.preventDefault();
  scrollToContact();
}));
$$('.contact-footer a, a[href="#top"]').forEach((link) => link.addEventListener('click', scrollToTop));
const getInitialNavId = () => {
  const hashId = window.location.hash.slice(1);
  if (hashId && navItems.some((link) => link.getAttribute('href') === `#${hashId}`)) return hashId;

  const focusLine = window.innerHeight * .45;
  const visibleSections = navSections
    .map((section) => ({ section, rect: section.getBoundingClientRect() }))
    .filter(({ rect }) => rect.top <= focusLine && rect.bottom >= focusLine)
    .sort((a, b) => Math.abs(a.rect.top - focusLine) - Math.abs(b.rect.top - focusLine));
  return visibleSections[0]?.section.id || 'home';
};
setActiveNav(getInitialNavId());
let activeNavFrame = 0;
const updateActiveNavFromScroll = () => {
  activeNavFrame = 0;
  if (!navSections.length) return;

  const hashId = window.location.hash.slice(1);
  const hashSection = navSections.find((section) => section.id === hashId);
  if (hashSection) {
    const hashRect = hashSection.getBoundingClientRect();
    if (hashRect.bottom > 0 && hashRect.top < window.innerHeight) {
      setActiveNav(hashSection.id);
      return;
    }
  }

  const atDocumentEnd = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
  if (atDocumentEnd) {
    setActiveNav(navSections[navSections.length - 1].id);
    return;
  }

  const focusLine = window.scrollY + window.innerHeight * .45;
  const candidates = navSections
    .map((section) => ({ section, rect: section.getBoundingClientRect() }))
    .filter(({ rect }) => rect.top + window.scrollY <= focusLine && rect.bottom + window.scrollY >= focusLine)
    .sort((a, b) => Math.abs((a.rect.top + window.scrollY) - focusLine) - Math.abs((b.rect.top + window.scrollY) - focusLine));
  const current = candidates[0]?.section;
  if (current) setActiveNav(current.id);
};
const scheduleActiveNavUpdate = () => {
  if (activeNavFrame) return;
  activeNavFrame = window.requestAnimationFrame(updateActiveNavFromScroll);
};
window.addEventListener('hashchange', () => {
  setActiveNav(getInitialNavId());
  scheduleActiveNavUpdate();
}, { passive: true });
window.addEventListener('popstate', () => {
  setActiveNav(getInitialNavId());
  if (window.location.hash === '#contact') scrollToContact({ behavior: 'auto', updateHistory: false });
  scheduleActiveNavUpdate();
}, { passive: true });
window.addEventListener('scroll', scheduleActiveNavUpdate, { passive: true });
window.addEventListener('resize', scheduleActiveNavUpdate, { passive: true });
scheduleActiveNavUpdate();

initHeroLens();
initExperience();
initReveal();
if (window.location.hash === '#contact') {
  scrollToContact({ behavior: 'auto', updateHistory: false });
  window.addEventListener('load', () => {
    window.setTimeout(() => {
      if (window.location.hash === '#contact') scrollToContact({ behavior: 'auto', updateHistory: false });
    }, 160);
  }, { once: true });
}
