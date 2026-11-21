// Analytics boundary only. Production tracking is intentionally disabled.
export const ANALYTICS_CONFIG = Object.freeze({
  analytics_enabled: false,
  analytics_endpoint: '',
  analytics_schema_version: '1.0',
  consent_required: true,
  debug_mode: false
});

const BLOCKED_KEYS = new Set(['jd', 'full_jd', 'email', 'phone', 'mobile', 'wechat', 'contact']);

function safePayload(payload) {
  return Object.fromEntries(Object.entries(payload || {}).filter(([key]) => !BLOCKED_KEYS.has(String(key).toLowerCase())));
}

export function trackEvent(eventName, payload = {}) {
  if (!ANALYTICS_CONFIG.analytics_enabled || !ANALYTICS_CONFIG.analytics_endpoint) return false;
  const body = JSON.stringify({
    event_name: String(eventName),
    schema_version: ANALYTICS_CONFIG.analytics_schema_version,
    payload: safePayload(payload)
  });
  if (ANALYTICS_CONFIG.debug_mode) console.info('[analytics disabled in this build]', body);
  return false;
}
