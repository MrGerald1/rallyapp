// Twitter conversion tracking utilities
declare global {
  interface Window {
    twq: (action: string, eventId: string, params?: any) => void
  }
}

export const TWITTER_EVENT_ID = "tw-qbzk5-qbzk7"

export interface TwitterConversionParams {
  value?: number
  currency?: string
  contents?: Array<{
    content_type?: string
    content_id?: string
    content_name?: string
    content_price?: number
    num_items?: number
    content_group_id?: string
  }>
  status?: "started" | "completed"
  conversion_id?: string
  email_address?: string
  phone_number?: string
}

export const trackTwitterConversion = (params: TwitterConversionParams = {}) => {
  if (typeof window !== "undefined" && window.twq) {
    try {
      console.log("🐦 TWITTER TRACKING - About to fire event:", TWITTER_EVENT_ID, params)

      window.twq("event", TWITTER_EVENT_ID, {
        value: params.value || null,
        currency: params.currency || null,
        contents: params.contents || [],
        status: params.status || null,
        conversion_id: params.conversion_id || null,
        email_address: params.email_address || null,
        phone_number: params.phone_number || null,
      })

      console.log("✅ TWITTER EVENT FIRED SUCCESSFULLY")
      console.log("📊 What Twitter will see:")
      console.log("   - Event ID:", TWITTER_EVENT_ID)
      console.log("   - Content ID:", params.contents?.[0]?.content_id || "none")
      console.log("   - Status:", params.status || "none")
      console.log("   - Conversion ID:", params.conversion_id || "none")
    } catch (error) {
      console.error("❌ TWITTER TRACKING FAILED:", error)
    }
  } else {
    console.warn("⚠️ Twitter pixel not loaded yet or window.twq not available")
  }
}

// SPECIFIC TRACKING FUNCTIONS - Each one corresponds to a user action
export const trackBlueprintPageView = () => {
  console.log("📄 Tracking: Blueprint page viewed")
  trackTwitterConversion({
    contents: [
      {
        content_type: "page_view",
        content_id: "blueprint-landing",
        content_name: "26-Day Blueprint Landing Page",
        content_group_id: "blueprint",
      },
    ],
  })
}

export const trackBlueprintCTAClick = (location: string) => {
  console.log(`🔘 Tracking: CTA clicked in ${location}`)
  trackTwitterConversion({
    status: "started",
    contents: [
      {
        content_type: "cta_click",
        content_id: `blueprint-cta-${location}`,
        content_name: `Blueprint CTA - ${location}`,
        content_group_id: "blueprint",
      },
    ],
    conversion_id: `cta-${location}-${Date.now()}`,
  })
}

export const trackBlueprintFormViewed = () => {
  console.log("👀 Tracking: Enrollment form came into view")
  trackTwitterConversion({
    contents: [
      {
        content_type: "form_view",
        content_id: "blueprint-form",
        content_name: "26-Day Blueprint Form",
        content_group_id: "blueprint",
      },
    ],
  })
}

export const trackBlueprintFormLoaded = () => {
  console.log("📋 Tracking: Google Form iframe loaded")
  trackTwitterConversion({
    status: "started",
    contents: [
      {
        content_type: "form_load",
        content_id: "blueprint-google-form",
        content_name: "26-Day Blueprint Google Form",
        content_group_id: "blueprint",
      },
    ],
  })
}

export const trackBlueprintVideoEngagement = () => {
  console.log("🎥 Tracking: Video engagement")
  trackTwitterConversion({
    contents: [
      {
        content_type: "video",
        content_id: "blueprint-explainer",
        content_name: "26-Day Blueprint Video",
        content_group_id: "blueprint",
      },
    ],
  })
}

export const trackBlueprintSignupStarted = () => {
  console.log("🚀 Tracking: Signup process started (scroll to form)")
  trackTwitterConversion({
    status: "started",
    contents: [
      {
        content_type: "signup",
        content_id: "blueprint-enrollment",
        content_name: "26-Day Blueprint",
        content_group_id: "blueprint",
      },
    ],
    conversion_id: `blueprint-signup-${Date.now()}`,
  })
}
