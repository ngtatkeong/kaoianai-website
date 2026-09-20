/**
 * WhatsApp integration configuration and smart URL generator.
 *
 * For Desktop: routes directly to https://web.whatsapp.com/send?phone=...
 * to open WhatsApp Web immediately and bypass intermediate landing screens.
 * For Mobile: routes to https://api.whatsapp.com/send?phone=...
 * to trigger the native WhatsApp mobile app.
 */

export const WHATSAPP_NUMBER = '93893043'
export const WHATSAPP_FULL_NUMBER = '6593893043'
export const WHATSAPP_DISPLAY = '+65 9389 3043'

export const DEFAULT_WHATSAPP_MESSAGE =
  'Hi KaoinAI, I have an enquiry about your AI Data Governance platform.'

/**
 * Generates the optimal WhatsApp URL based on client device.
 * On desktop computers, directly targets WhatsApp Web (web.whatsapp.com).
 * On mobile devices, targets the WhatsApp app protocol/API (api.whatsapp.com).
 */
export function getWhatsAppUrl(customMessage?: string): string {
  const message = encodeURIComponent(customMessage || DEFAULT_WHATSAPP_MESSAGE)

  if (typeof window !== 'undefined') {
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) || (window.innerWidth < 768 && navigator.maxTouchPoints > 0)

    if (isMobile) {
      return `https://api.whatsapp.com/send?phone=${WHATSAPP_FULL_NUMBER}&text=${message}`
    }
  }

  // Desktop default: directly opens WhatsApp Web
  return `https://web.whatsapp.com/send?phone=${WHATSAPP_FULL_NUMBER}&text=${message}`
}
