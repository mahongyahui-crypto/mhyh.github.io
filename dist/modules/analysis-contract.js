// Future analysis adapters share this contract. The local site never calls a remote model.
export const ANALYSIS_SCHEMA_VERSION = '3.0';

export const DEFAULT_ANALYSIS_CONFIG = Object.freeze({
  mode: 'local',
  remote_endpoint: '',
  model_version: '',
  timeout_ms: 8000,
  fallback_to_local: true
});

export function createAnalysisRequest(jd, options = {}) {
  return {
    schema_version: ANALYSIS_SCHEMA_VERSION,
    mode: options.mode || DEFAULT_ANALYSIS_CONFIG.mode,
    model_version: options.model_version || DEFAULT_ANALYSIS_CONFIG.model_version,
    jd: String(jd || '')
  };
}

export class RemoteAIParser {
  constructor(config = {}) {
    this.config = { ...DEFAULT_ANALYSIS_CONFIG, ...config, mode: 'remote' };
  }

  async parse() {
    throw new Error('RemoteAIParser 尚未配置服务端接口；当前继续使用本地规则分析。');
  }
}
