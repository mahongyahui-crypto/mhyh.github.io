import {
  ANALYSIS_SCHEMA_VERSION,
  createAnalysisRequest
} from './analysis-contract.js';
import {
  DEGREE_RANK,
  ANALYSIS_AS_OF,
  getUiExperienceMonths,
  MATCH_DIMENSIONS,
  MATCH_WEIGHTS,
  PROJECT_EVIDENCE,
  RESUME_PROFILE
} from '../data/match-profile.js';

const STATUS_LABELS = Object.freeze({
  supported: '有资料支持',
  unmet: '明确不满足',
  pending: '待核实'
});

const PROFESSIONAL_TERMS = Object.freeze([
  'ui', 'ux', '用户体验', '界面设计', '视觉设计', 'figma', 'sketch', 'adobe xd',
  '交互设计', '交互', '高保真', '原型', '组件库', '设计系统', '设计规范', 'tokens',
  '数据看板', '数据可视化', 'ai辅助', 'ai工具', '前端开发', 'javascript', 'typescript', 'react', 'vue',
  'blender', 'three.js', '3d', '三维', '建模', '角色建模', '贴图', '游戏原画', '原画',
  '用户研究', 'a/b测试', 'ab测试', 'ab test', 'java', 'spring boot', 'mysql', 'sql', 'python', 'node.js', '后端开发'
]);
const PROJECT_TERMS = Object.freeze([
  'erp', 'saas', 'b端', '企业版', '门店版', '后台', '管理系统', 'pc', 'app', '移动端',
  '小程序', '商城', 'crm', 'im', '回收', '连锁', '库存', '订单', '工作台'
]);
const RESPONSIBILITY_TERMS = Object.freeze([
  '需求分析', '需求评审', '用户研究', '用户访谈', '业务流程', '流程梳理', '信息架构',
  '开发沟通', '研发沟通', '开发验收', '验收', '交付', '上线', '协作', '负责', '主导',
  '设计规范', '组件库', '异常场景', '迭代', '产品设计', '产品经理', '团队管理', '带人'
]);
const INDUSTRY_TERMS = Object.freeze([
  '餐饮', '零售', '门店', '连锁', '电商', '私域', '商城', '企业服务', 'saas', 'erp',
  'crm', '二手', '3c', '回收', '循环经济', '金融', '教育', '医疗', '制造业', '工业', '物流'
]);
const GENERIC_REQUIREMENT_TERMS = new Set(['负责', '主导', '设计师', '设计', '工作', '经验', '要求']);
const SPECIFIC_RESPONSIBILITY_TERMS = Object.freeze(RESPONSIBILITY_TERMS.filter((term) => !GENERIC_REQUIREMENT_TERMS.has(term)));
const CONSTRAINT_RE = /学历|本科|大专|硕士|博士|年(?:相关)?(?:工作)?经验|年以上|年限|\d+(?:\.\d+)?\s*年[^，,；;。！？!?]{0,20}(?:经验|任职|工作)|全职|兼职|实习|远程|remote|居家办公|工作地点|出差|驻场|外派|到岗|入职|薪资|薪酬|月薪|年薪|产品经理经验/i;
const PRIORITY_RE = /优先|加分|更佳|最好|可选|优先考虑/i;
const HARD_RE = /必须|必备|硬性|强制|不可缺少|全日制本科及以上|本科及以上|至少|不少于/i;
const QUALIFIER_RE = /熟练|精通|高级|专家|深入|独立主导|独立负责|主导|完整负责|全流程/i;
const UNKNOWN_TECHNICAL_RE = /\bjava\b|spring\s*boot|\bmysql\b|\bsql\b|\bpython\b|node\.js|后端开发|数据库|编程语言|技术栈|框架/i;

function normalize(value) {
  return String(value || '').toLowerCase().replace(/[\s\n\r·•/、，。！？：；（）()\-—_]+/g, '');
}

function unique(items) {
  return [...new Set(items.filter(Boolean))];
}

function hasAny(text, terms) {
  const normalized = normalize(text);
  return terms.some((term) => normalized.includes(normalize(term)));
}

function stableHash(value) {
  let hash = 2166136261;
  for (const char of String(value)) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}

function extractYears(text) {
  const matches = [...String(text || '').matchAll(/(?:至少|不少于|具备|拥有)?\s*(\d+(?:\.\d+)?)\s*(?:年及以上|年以上|年相关工作经验|年相关经验|年工作经验|年经验|年\+?|\+年?)/gi)];
  return matches.length ? Math.max(...matches.map((match) => Number(match[1])).filter(Number.isFinite)) : 0;
}

function isUiExperienceContext(text) {
  const hasUiContext = /ui\s*\/?\s*ux|ui\s*设计|用户体验|界面设计|交互设计|视觉设计|产品设计/i.test(text);
  const hasOtherDiscipline = /产品经理|游戏|原画|3d|三维|建模|贴图|前端|后端|开发|算法|测试/i.test(text);
  return hasUiContext && !hasOtherDiscipline;
}

function hasSpecificExperienceContext(text) {
  return /b\s*端|企业版|门店版|saas|erp|管理经验|团队管理|figma|java|spring\s*boot|mysql|sql|python/i.test(text);
}

function lineSegments(jd) {
  const source = String(jd || '').replace(/\r/g, '');
  const segments = [];
  let offset = 0;
  for (const line of source.split('\n')) {
    const lineStart = offset;
    offset += line.length + 1;
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;
    const lineLeading = line.indexOf(trimmedLine);
    const pieces = trimmedLine.split(/[。；;！？!?]+|[,，]+/).map((piece) => piece.trim()).filter(Boolean);
    let pieceOffset = lineStart + lineLeading;
    for (const piece of pieces) {
      const pieceStart = source.indexOf(piece, pieceOffset);
      const start = pieceStart >= 0 ? pieceStart : pieceOffset;
      segments.push({ text: piece, start, end: start + piece.length });
      pieceOffset = start + piece.length;
    }
  }
  return segments;
}

function explodeConstraint(segment) {
  const source = segment.text;
  const extracted = [];
  const removalRanges = [];
  const degreeMatches = [...source.matchAll(/(?:全日制)?(?:本科|大专|硕士|博士)(?:及以上|以上)?/gi)];
  degreeMatches.forEach((match) => extracted.push({
    text: match[0].trim(),
    start: segment.start + match.index,
    end: segment.start + match.index + match[0].length,
    source_text: source
  }));

  const yearMatches = [...source.matchAll(/(?:至少|不少于|具备|拥有)?\s*\d+(?:\.\d+)?\s*(?:年及以上|年以上|年相关工作经验|年相关经验|年工作经验|年经验|年\+?|\+年?)/gi)];
  yearMatches.forEach((match) => {
    const phrase = match[0].trim();
    const context = source.match(/(?:产品经理|UI(?:\s*\/\s*UX)?\s*设计?|用户体验|界面设计|交互设计|视觉设计|产品设计|游戏原画|原画|前端|后端|开发|B\s*端|企业版|门店版|SaaS|ERP|团队管理|管理)[^，,；;。！？!?]*?(?:经验|任职|岗位|工作)/i)?.[0]?.trim() || '';
    if (context) {
      const contextIndex = source.indexOf(context, match.index + match[0].length);
      if (contextIndex >= 0) removalRanges.push({ index: contextIndex, length: context.length });
    }
    extracted.push({
      text: `${phrase}${context ? ` ${context}` : ''}`,
      start: segment.start + match.index,
      end: segment.start + match.index + match[0].length,
      source_text: source
    });
  });

  let remainder = source;
  [...degreeMatches, ...yearMatches, ...removalRanges].sort((a, b) => b.index - a.index).forEach((match) => {
    const length = typeof match[0] === 'string' ? match[0].length : match.length;
    remainder = `${remainder.slice(0, match.index)} ${remainder.slice(match.index + length)}`;
  });
  const rest = remainder.replace(/[：:]/g, ' ').replace(/\s+/g, ' ').trim();
  if (rest && rest.length > 1 && !/^(?:ui\s*\/?\s*ux|设计经验|相关工作经验|工作经验)$/i.test(rest)) {
    extracted.push({ text: rest, start: segment.start, end: segment.end, source_text: source });
  }
  return extracted.length ? extracted : [segment];
}

function splitCompoundRequirement(clause) {
  const source = clause.text.trim();
  const technicalCandidates = [
    ['Java', /\bjava\b/i],
    ['Spring Boot', /spring\s*boot/i],
    ['MySQL', /\bmysql\b/i],
    ['SQL', /\bsql\b/i],
    ['Python', /\bpython\b/i]
  ].filter(([, pattern]) => pattern.test(source));
  if (technicalCandidates.length >= 2) {
    const qualifier = source.match(/必须|必备|熟练|精通|掌握|熟悉/)?.[0] || '';
    return technicalCandidates.map(([label]) => ({
      text: `${qualifier}${label}`,
      start: clause.start,
      end: clause.end,
      source_text: source
    }));
  }
  const candidates = [
    ['用户研究', /用户研究/i],
    ['原型设计', /原型(?:设计)?/i],
    ['视觉设计', /视觉(?:设计)?/i],
    ['A/B 测试', /a\s*\/\s*b\s*测试|ab\s*测试|a\s*\/\s*b\s*test/i]
  ].filter(([, pattern]) => pattern.test(source));
  if (candidates.length < 2) return [clause];
  const qualifier = source.match(/熟练|精通|熟悉|高级|深入/)?.[0] || '';
  const suffix = /经验|能力|技能/.test(source) ? '经验' : '';
  return candidates.map(([label]) => ({
    text: `${qualifier}${label}${suffix}`,
    start: clause.start,
    end: clause.end,
    source_text: source
  }));
}

function detectDimension(text) {
  if (CONSTRAINT_RE.test(text)) return 'constraint';
  if (hasAny(text, RESPONSIBILITY_TERMS)) return 'responsibility';
  if (hasAny(text, PROJECT_TERMS)) return 'project';
  if (hasAny(text, INDUSTRY_TERMS)) return 'industry';
  if (hasAny(text, PROFESSIONAL_TERMS)) return 'professional';
  if (UNKNOWN_TECHNICAL_RE.test(text)) return 'professional';
  return '';
}

function hasUsefulRequirementSignal(text) {
  if (/^[\d\s.、:：()（）-]*(?:学历|经验|年限|要求|工作)$/.test(String(text || '').trim())) return false;
  return CONSTRAINT_RE.test(text)
    || PRIORITY_RE.test(text)
    || hasAny(text, PROFESSIONAL_TERMS)
    || hasAny(text, PROJECT_TERMS)
    || hasAny(text, SPECIFIC_RESPONSIBILITY_TERMS)
    || hasAny(text, INDUSTRY_TERMS)
    || UNKNOWN_TECHNICAL_RE.test(text);
}

function isPriority(text) {
  return PRIORITY_RE.test(text);
}

function isHardRequirement(text, dimension) {
  if (isPriority(text)) return false;
  if (HARD_RE.test(text)) return true;
  return dimension === 'constraint' && /本科|大专|硕士|博士|年限|年以上|全职|产品经理经验/i.test(text);
}

function canonicalKey(text, dimension) {
  const normalized = normalize(text);
  if (/figma/.test(normalized)) return `${dimension}|figma`;
  if (/ui|ux|用户体验|界面设计/.test(normalized)) return `${dimension}|uiux`;
  if (/组件库|设计系统|设计规范|tokens/.test(normalized)) return `${dimension}|designsystem`;
  if (/erp|saas|b端|企业版|门店版/.test(normalized)) return `${dimension}|enterprise-product`;
  if (/需求分析|需求评审|业务流程|流程梳理|信息架构/.test(normalized)) return `${dimension}|discovery-flow`;
  if (/产品经理经验/.test(normalized)) return `${dimension}|formal-product-manager`;
  if (/本科|大专|硕士|博士/.test(normalized)) return `${dimension}|degree`;
  if (/年经验|年以上|年限/.test(normalized)) {
    const years = extractYears(text);
    const context = /b端|企业版|门店版|saas|erp/.test(normalized) ? 'specific' : isUiExperienceContext(text) ? 'ui' : 'general';
    return `${dimension}|years|${years}|${context}`;
  }
  return `${dimension}|${normalized.slice(0, 80)}`;
}

function requirementLabel(text, dimension) {
  if (dimension === 'constraint') {
    if (/本科|大专|硕士|博士/.test(text)) return `学历条件：${text}`;
    if (/产品经理经验/.test(text)) return `正式产品经理经验：${text}`;
    if (extractYears(text)) return `相关经验：${text}`;
    if (/地点|成都|北京|上海|深圳|广州|杭州|远程|remote|居家办公/i.test(text)) return `工作地点：${text}`;
    if (/全职|兼职|实习/.test(text)) return `合作形式：${text}`;
    if (/出差|驻场|外派/.test(text)) return `出差 / 驻场：${text}`;
    if (/到岗|入职/.test(text)) return `到岗时间：${text}`;
    if (/薪资|薪酬|月薪|年薪/.test(text)) return `薪资条件：${text}`;
  }
  if (dimension === 'industry') return `行业 / 赛道：${text}`;
  return text.length > 90 ? `${text.slice(0, 87)}…` : text;
}

function searchTerms(text, dimension) {
  const groups = {
    professional: PROFESSIONAL_TERMS,
    project: PROJECT_TERMS,
    responsibility: RESPONSIBILITY_TERMS,
    industry: INDUSTRY_TERMS
  };
  const terms = (groups[dimension] || []).filter((term) => !GENERIC_REQUIREMENT_TERMS.has(term) && hasAny(text, [term]));
  if (/ui\s*\/\s*ux|用户体验|界面设计/i.test(text)) terms.push('UI 设计');
  if (/产品经理/i.test(text)) terms.push('产品经理');
  return unique(terms.length ? terms : [text]);
}

function verificationCriteria(text, dimension) {
  if (dimension === 'constraint') {
    if (/本科|大专|硕士|博士/.test(text)) return '核对学历层级、是否为全日制及 JD 的最低要求。';
    if (/产品经理经验/.test(text)) return '核对正式产品经理岗位、任职时间与实际职责，不能用 UI 设计经历替代。';
    if (extractYears(text)) return '核对相关经验的起止时间、岗位职责范围和可提供的项目材料。';
    if (/出差|驻场|外派|到岗|入职|薪资|薪酬/.test(text)) return '当前资料未结构化记录该条件，需要由候选人与 HR 直接确认。';
  }
  if (/熟练|精通|高级|专家|深入/.test(text)) return '需要补充工具熟练程度、复杂任务案例与可核验交付结果。';
  if (/独立主导|独立负责|主导/.test(text)) return '核对个人实际责任边界，区分独立主导、共同负责和参与。';
  return `核对与“${requirementLabel(text, dimension)}”直接对应的项目、职责和交付结果。`;
}

function parseRequirements(jd) {
  const requirements = [];
  for (const segment of lineSegments(jd)) {
    for (const exploded of explodeConstraint(segment)) for (const clause of splitCompoundRequirement(exploded)) {
      const text = clause.text.trim();
      if (text.length < 2 || !hasUsefulRequirementSignal(text)) continue;
      const dimension = detectDimension(text);
      if (!dimension) continue;
      const priority = isPriority(text);
      const key = canonicalKey(text, dimension);
      const existing = requirements.find((item) => item.semantic_key === `${key}|${priority ? 'priority' : 'core'}`);
      if (existing) {
        existing.source_texts = unique([...existing.source_texts, clause.source_text || text]);
        existing.parse_confidence = existing.parse_confidence === 'high' ? 'high' : 'medium';
        existing.is_hard_requirement ||= isHardRequirement(text, dimension);
        continue;
      }
      const sourceText = clause.source_text || text;
      requirements.push({
        requirement_id: `req-${stableHash(`${key}|${priority ? 'priority' : 'core'}`)}`,
        original_text: text,
        source_span: { start: clause.start, end: clause.end },
        source_text: sourceText,
        source_texts: [sourceText],
        normalized_requirement: requirementLabel(text, dimension),
        semantic_key: `${key}|${priority ? 'priority' : 'core'}`,
        dimension,
        requirement_type: priority ? 'priority' : dimension === 'constraint' ? 'constraint' : dimension,
        is_hard_requirement: isHardRequirement(text, dimension),
        verification_criteria: verificationCriteria(text, dimension),
        parse_confidence: hasAny(text, [...PROFESSIONAL_TERMS, ...PROJECT_TERMS, ...RESPONSIBILITY_TERMS, ...INDUSTRY_TERMS]) ? 'high' : 'low',
        needs_review: Boolean(QUALIFIER_RE.test(text) || /模糊|相关|熟悉/.test(text)),
        priority,
        search_terms: searchTerms(text, dimension)
      });
    }
  }
  const warnings = [];
  if (requirements.length === 0) warnings.push('未识别到足够的岗位要求；不生成综合百分比。');
  if (requirements.length < 2 && requirements.length > 0) warnings.push('有效要求过少，当前结论仅供参考。');
  return { requirements, warnings };
}

function evidenceRecord(id, projectName, content, extra = {}) {
  return {
    project_id: `profile.${id}`,
    evidence_id: `evidence.profile.${id}`,
    project_name: projectName,
    personal_role: '候选人资料库记录',
    work_content: content,
    supported_skills: [],
    supported_responsibilities: [],
    project_status: '资料库信息',
    confirmed_result: content,
    fact_confirmation_status: 'confirmed_by_candidate',
    evidence_source: '本人已确认履历资料',
    verification_status: 'not_independently_verified',
    portfolio_status: 'not_applicable',
    portfolio_reference: null,
    visibility: 'public_summary',
    updated_at: '2026-11-19',
    ...extra
  };
}

function profileEvidenceFor(requirement) {
  const text = requirement.original_text;
  if (/本科|大专|硕士|博士/.test(text)) return [evidenceRecord('degree', '教育背景', RESUME_PROFILE.degreeLabel, { supported_skills: ['学历'] })];
  if (/产品经理经验|产品经理/.test(text)) return [evidenceRecord('formal-product-manager', '正式岗位经历', `正式岗位均为 ${RESUME_PROFILE.formalRoles.join('、')}；正式产品经理任职年限为 ${RESUME_PROFILE.formalProductManagerYears} 年。`, { supported_responsibilities: ['正式岗位核验'] })];
  if (extractYears(text) && isUiExperienceContext(text)) return [evidenceRecord('ui-years', '职业经历概览', `${RESUME_PROFILE.uiYearsDisplay}（起点 ${RESUME_PROFILE.uiStartDate}，按 ${RESUME_PROFILE.analysisDate} 计算）`, { supported_skills: ['UI 设计经验'] })];
  if (/全职|兼职|实习/.test(text)) return [evidenceRecord('employment', '求职方向', `当前求职方向：${RESUME_PROFILE.employment}`, { supported_responsibilities: ['合作形式'] })];
  if (/成都|远程|remote|工作地点|居家办公/i.test(text)) return [evidenceRecord('location', '求职地点意向', `资料记录：${RESUME_PROFILE.locations.join(' / ')}`, { supported_responsibilities: ['地点条件'] })];
  if (/出差|驻场|外派|到岗|入职|薪资|薪酬/.test(text)) return [evidenceRecord('unstructured-constraint', '资料库待确认信息', '当前资料库未结构化记录该任职条件。')];
  return [];
}

function projectText(record) {
  return [record.project_name, record.personal_role, record.work_content, ...(record.supported_skills || []), ...(record.supported_responsibilities || []), ...(record.industry_terms || []), ...(record.project_terms || [])].join('｜');
}

function matchingProjects(requirement) {
  if (requirement.dimension === 'constraint') return [];
  const records = PROJECT_EVIDENCE.filter((record) => hasAny(projectText(record), requirement.search_terms));
  if (/产品经理/.test(requirement.original_text)) return [];
  return records;
}

function strongEvidenceIsPresent(requirement, records) {
  const text = requirement.original_text;
  if (/熟练|精通|高级|专家|深入/.test(text)) return false;
  if (/独立主导|独立负责|主导|完整负责|全流程/.test(text)) {
    return records.some((record) => /独立主导|独立负责|主导|完整负责|全流程/.test(`${record.personal_role} ${record.supported_responsibilities.join(' ')}`));
  }
  return true;
}

function statusResult(requirement, status, explanation, records = []) {
  return {
    ...requirement,
    status,
    status_label: STATUS_LABELS[status],
    explanation,
    evidence: unique(records),
    source_evidence: unique(records).map((record) => `${record.project_name}：${record.work_content}`)
  };
}

function evaluateConstraint(requirement) {
  const text = requirement.original_text;
  const profileEvidence = profileEvidenceFor(requirement);
  if (/本科|大专|硕士|博士/.test(text)) {
    const required = Object.keys(DEGREE_RANK).find((degree) => text.includes(degree) && degree !== '高中') || '本科';
    const supported = RESUME_PROFILE.degree && DEGREE_RANK[RESUME_PROFILE.degree] >= DEGREE_RANK[required];
    return statusResult(requirement, supported ? 'supported' : 'unmet', supported ? `学历资料为${RESUME_PROFILE.degreeLabel}，达到“${required}”要求。` : `学历资料为${RESUME_PROFILE.degreeLabel}，低于 JD 提出的“${required}”要求。`, profileEvidence);
  }
  if (/产品经理经验|产品经理/.test(text)) {
    const years = extractYears(text) || 1;
    const supported = RESUME_PROFILE.formalProductManagerYears >= years;
    return statusResult(requirement, supported ? 'supported' : 'unmet', supported ? `正式产品经理任职年限达到 ${years} 年。` : `两段正式岗位均为 UI 设计师，正式产品经理任职年限为 ${RESUME_PROFILE.formalProductManagerYears} 年；不能用 UI 设计经历替代。`, profileEvidence);
  }
  const years = extractYears(text);
  if (years) {
    if (hasSpecificExperienceContext(text) && !isUiExperienceContext(text)) {
      return statusResult(requirement, 'pending', `${RESUME_PROFILE.uiYearsDisplay}仅说明 UI 设计经验，不能直接替代“${text}”要求的其他岗位或领域经验。`);
    }
    if (!isUiExperienceContext(text)) {
      return statusResult(requirement, 'pending', `${RESUME_PROFILE.uiYearsDisplay}仅说明 UI 设计经验，不能直接替代“${text}”要求的指定技能或其他岗位经验。`, profileEvidence);
    }
    const currentMonths = getUiExperienceMonths(ANALYSIS_AS_OF);
    const requiredMonths = Math.ceil(years * 12);
    if (currentMonths >= requiredMonths) return statusResult(requirement, 'supported', `${RESUME_PROFILE.uiYearsDisplay}（截至 ${ANALYSIS_AS_OF} 已累计约 ${currentMonths} 个月），达到 JD 提出的至少 ${years} 年要求。`, profileEvidence);
    return statusResult(requirement, 'unmet', `UI 设计经验起点为 ${RESUME_PROFILE.uiStartDate}，截至 ${ANALYSIS_AS_OF} 尚未达到 JD 提出的至少 ${years} 年要求；当前资料口径为 ${RESUME_PROFILE.uiYearsDisplay}。`, profileEvidence);
  }
  if (/全职/.test(text)) return statusResult(requirement, RESUME_PROFILE.employment === '全职' ? 'supported' : 'pending', `资料记录的求职方向为${RESUME_PROFILE.employment}。`, profileEvidence);
  if (/兼职|实习/.test(text)) return statusResult(requirement, 'pending', '当前资料记录的求职方向为全职，是否接受该合作形式需要直接确认。', profileEvidence);
  if (/成都|远程|remote|工作地点|居家办公/i.test(text)) {
    const supported = RESUME_PROFILE.locations.some((location) => hasAny(text, [location]));
    return statusResult(requirement, supported ? 'supported' : 'pending', supported ? `资料记录的地点意向包含${RESUME_PROFILE.locations.join(' / ')}。` : `JD 地点未与资料记录的${RESUME_PROFILE.locations.join(' / ')}直接重合，需要确认。`, profileEvidence);
  }
  if (/出差|驻场|外派|到岗|入职|薪资|薪酬/.test(text)) return statusResult(requirement, 'pending', '当前资料库没有结构化记录该任职条件，不能推断为满足或不满足。', profileEvidence);
  return statusResult(requirement, 'pending', '任职条件表达不够具体，需要与 HR 直接核对。', profileEvidence);
}

function evaluateRequirement(requirement) {
  if (requirement.dimension === 'constraint') return evaluateConstraint(requirement);
  const records = matchingProjects(requirement);
  if (!records.length) return statusResult(requirement, 'pending', '当前已确认履历资料未记录足以对应此要求的项目证据，不能把未记录当成不具备。');
  if (!strongEvidenceIsPresent(requirement, records)) {
    return statusResult(requirement, 'pending', `已有相关项目方向，但当前资料不足以完整证明“${requirement.original_text}”中的深度或责任边界。`, records);
  }
  const projectNames = unique(records.map((record) => record.project_name)).join('、');
  return statusResult(requirement, 'supported', `由${projectNames}等真实经历提供对应资料；具体职责仍以逐项证据为准。`, records);
}

function buildDimension(definition, requirements) {
  const applicable = requirements.filter((requirement) => !requirement.priority && requirement.dimension === definition.key);
  const supported = applicable.filter((requirement) => requirement.status === 'supported');
  const unmet = applicable.filter((requirement) => requirement.status === 'unmet');
  const pending = applicable.filter((requirement) => requirement.status === 'pending');
  const score = applicable.length ? Math.round((supported.length / applicable.length) * 100) : null;
  const evidence = unique(applicable.flatMap((requirement) => requirement.evidence));
  return {
    ...definition,
    score,
    applicable: applicable.length > 0,
    applicableCount: applicable.length,
    mentioned: applicable,
    matched: supported,
    unmet: unmet.map((requirement) => `${requirement.normalized_requirement}：${requirement.explanation}`),
    unknown: pending.map((requirement) => `${requirement.normalized_requirement}：${requirement.explanation}`),
    highlights: supported.map((requirement) => `${requirement.normalized_requirement}：${requirement.explanation}`),
    matchedItems: supported.map((requirement) => requirement.normalized_requirement),
    unmetItems: unmet.map((requirement) => requirement.normalized_requirement),
    unknownItems: pending.map((requirement) => requirement.normalized_requirement),
    needsConfirmation: pending.length > 0,
    jd: applicable.length ? `识别到 ${applicable.length} 项必备要求：支持 ${supported.length} 项，待核实 ${pending.length} 项，明确不满足 ${unmet.length} 项。` : 'JD 未识别到该维度的适用必备要求；不补造分数。',
    resume: evidence.length ? evidence.map((record) => `${record.project_name}：${record.work_content}`) : ['当前资料库没有该维度的直接证据。'],
    note: applicable.length ? '只按有明确 JD 原文的必备要求计算；待核实不自动计入支持。' : '该维度不适用，不参与综合支持率。'
  };
}

function requirementInterviewQuestion(requirement) {
  if (requirement.dimension === 'constraint' && /学历|本科|大专|硕士|博士/.test(requirement.original_text)) return '请确认学历最低要求是否为硬性条件，以及是否接受全日制大专。';
  if (requirement.dimension === 'constraint' && /产品经理/.test(requirement.original_text)) return '请核对岗位要求的是正式产品经理任职，还是允许有产品设计与需求分析经历的 UI 设计师。';
  if (requirement.dimension === 'constraint' && extractYears(requirement.original_text)) return `请核对相关经验起止时间及岗位职责，确认是否按至少 ${extractYears(requirement.original_text)} 年计算。`;
  if (/熟练|精通|高级|专家/.test(requirement.original_text)) return `请让候选人展示与“${requirement.normalized_requirement}”对应的复杂项目或交付结果。`;
  if (/独立主导|独立负责|主导/.test(requirement.original_text)) return `请核对“${requirement.normalized_requirement}”中的个人责任边界，区分共同负责与独立主导。`;
  return `请核对“${requirement.normalized_requirement}”对应的项目、职责和交付结果。`;
}

function buildRatios(dimensions) {
  const applicable = dimensions.filter((dimension) => dimension.applicable);
  const totalWeight = applicable.reduce((sum, dimension) => sum + dimension.weight, 0);
  if (!totalWeight) return { supported: null, pending: null, unmet: null, total: null };
  const calculate = (key) => applicable.reduce((sum, dimension) => {
    const count = dimension[key === 'supported' ? 'matched' : key === 'pending' ? 'unknown' : 'unmet'].length;
    return sum + (count / dimension.applicableCount) * dimension.weight;
  }, 0);
  const supported = Math.round((calculate('supported') / totalWeight) * 100);
  const pending = Math.round((calculate('pending') / totalWeight) * 100);
  return { supported, pending, unmet: Math.max(0, 100 - supported - pending), total: 100 };
}

export function analyzeJobDescription(jd) {
  const request = createAnalysisRequest(jd, { mode: 'local' });
  const parsed = parseRequirements(request.jd);
  const evaluatedRequirements = parsed.requirements.map(evaluateRequirement);
  const dimensions = MATCH_DIMENSIONS.map((definition) => buildDimension(definition, evaluatedRequirements));
  const applicableDimensions = dimensions.filter((dimension) => dimension.applicable);
  const totalWeight = applicableDimensions.reduce((sum, dimension) => sum + dimension.weight, 0);
  const score = totalWeight
    ? Math.round(applicableDimensions.reduce((sum, dimension) => sum + (dimension.score || 0) * dimension.weight, 0) / totalWeight)
    : null;
  const mandatory = evaluatedRequirements.filter((requirement) => !requirement.priority);
  const hardUnmet = mandatory.filter((requirement) => requirement.is_hard_requirement && requirement.status === 'unmet');
  const hardPending = mandatory.filter((requirement) => requirement.is_hard_requirement && requirement.status === 'pending');
  const evidenceRecords = unique(evaluatedRequirements.flatMap((requirement) => requirement.evidence));
  const supported = mandatory.filter((requirement) => requirement.status === 'supported');
  const pending = mandatory.filter((requirement) => requirement.status === 'pending');
  const unmet = mandatory.filter((requirement) => requirement.status === 'unmet');
  const priorities = evaluatedRequirements.filter((requirement) => requirement.priority);
  const gateReasons = hardUnmet.map((requirement) => `硬性条件不满足：${requirement.normalized_requirement}。${requirement.explanation}`);
  const dataGaps = unique([...pending, ...hardPending].map((requirement) => `${requirement.normalized_requirement}：${requirement.explanation}`));
  const requirements = evaluatedRequirements;
  return {
    schemaVersion: ANALYSIS_SCHEMA_VERSION,
    mode: 'local',
    requirements,
    dimensions,
    score,
    baseScore: score,
    blocked: hardUnmet.length > 0,
    hardGates: {
      items: mandatory.filter((requirement) => requirement.is_hard_requirement),
      unmet: hardUnmet,
      pending: hardPending,
      hasUnmet: hardUnmet.length > 0
    },
    gateReasons,
    ratios: buildRatios(dimensions),
    matchedItems: supported.map((requirement) => requirement.normalized_requirement),
    unmetItems: unmet.map((requirement) => requirement.normalized_requirement),
    unknownItems: pending.map((requirement) => requirement.normalized_requirement),
    bonusItems: priorities.filter((requirement) => requirement.status === 'supported').map((requirement) => requirement.normalized_requirement),
    bonusPendingItems: priorities.filter((requirement) => requirement.status === 'pending').map((requirement) => requirement.normalized_requirement),
    matchedCount: supported.length,
    highlights: supported.slice(0, 8).map((requirement) => `${requirement.normalized_requirement}：${requirement.explanation}`),
    risks: unique([...gateReasons, ...dataGaps, ...unmet.map((requirement) => `${requirement.normalized_requirement}：${requirement.explanation}`)]).slice(0, 8),
    dataGaps: dataGaps.slice(0, 8),
    evidenceRecords,
    evidence: evidenceRecords.map((record) => `${record.project_name}：${record.work_content}`),
    interviewQuestions: unique([...pending, ...unmet, ...hardPending].map(requirementInterviewQuestion)).slice(0, 6),
    warnings: parsed.warnings,
    validRequirementCount: mandatory.length,
    priorityCount: priorities.length
  };
}

export class LocalRuleParser {
  parse(jd) {
    return analyzeJobDescription(jd);
  }
}

export { MATCH_DIMENSIONS, MATCH_WEIGHTS };
