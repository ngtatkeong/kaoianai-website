/**
 * KaoinAI Analytics Tracking Client
 * Provides typed event tracking for Google Analytics 4 (gtag), PostHog, Plausible, and custom webhooks.
 */

declare global {
  interface Window {
    gtag?: (command: string, action: string, params?: Record<string, any>) => void;
    posthog?: {
      capture: (eventName: string, properties?: Record<string, any>) => void;
    };
    plausible?: (eventName: string, options?: { props?: Record<string, any> }) => void;
  }
}

export type EventPayloads = {
  click_cta: {
    location: 'navbar' | 'hero' | 'pricing' | 'footer' | 'sticky_banner' | 'roi_calculator' | string;
    label: string;
  };
  calculate_roi: {
    team_size: number;
    db_records_millions: number;
    estimated_annual_savings_usd: number;
    compliance_risk_score: string;
  };
  submit_lead: {
    email: string;
    source: string;
    reference_id?: string;
  };
  faq_toggle: {
    question: string;
    action: 'expand' | 'collapse';
  };
  explore_feature: {
    feature_name: string;
  };
  click_whatsapp: {
    number?: string;
    location: string;
  };
  submit_contact: {
    name: string;
    email: string;
    inquiry_type: string;
    reference_id?: string;
  };
  click_announcement: {
    label: string;
  };
  download_lead_magnet: {
    email: string;
    company?: string;
    reference_id?: string;
  };
  open_lead_magnet_modal: {
    source: string;
  };
  copy_demo_sql: {
    scenario: string;
  };
  switch_demo_scenario: {
    scenario: string;
  };
  try_custom_query_demo: {
    query: string;
  };
  click_security_whitepaper: {
    location: string;
  };
  click_case_study_cta: {
    location: string;
  };
  click_comparison_cta: {
    location: string;
  };
  audit_select_option: {
    question_id: number;
    points: number;
  };
  audit_completed: {
    final_score: number;
  };
  audit_restart: Record<string, never>;
};

export function trackEvent<K extends keyof EventPayloads>(
  eventName: K,
  properties: EventPayloads[K]
) {
  // Console debug in development
  if (import.meta.env.DEV) {
    console.log(`📊 [Analytics Event]: ${eventName}`, properties);
  }

  // 1. Google Analytics 4 (gtag.js)
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', eventName, properties);
  }

  // 2. PostHog
  if (typeof window !== 'undefined' && window.posthog?.capture) {
    window.posthog.capture(eventName, properties);
  }

  // 3. Plausible Analytics
  if (typeof window !== 'undefined' && typeof window.plausible === 'function') {
    window.plausible(eventName, { props: properties });
  }
}
