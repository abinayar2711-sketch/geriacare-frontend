/**
 * Elder care crisis detection.
 *
 * Posts containing elder abuse, neglect, or self-harm language are held
 * for human review before going public.
 */

const PATTERNS: RegExp[] = [
  // Elder abuse indicators
  /\b(hitting|hurting|abusing|beating|slapping|pushing)\s+(my|the|her|his|him|them)\b/i,
  /\b(elder\s+abuse|senior\s+abuse|old\s+age\s+abuse)\b/i,
  /\b(neglect|neglecting|abandoning|abandoned|left\s+(alone|to\s+die))\b/i,
  // Self-harm in elderly context
  /\b(kill|hurt|harm|end)(ing)?\s+(myself|my ?self)\b/i,
  /\bsuicid(e|al)\b/i,
  /\bwant\s+to\s+die\b/i,
  /\bno\s+(reason|point)\s+(to|in)\s+(live|living|go on)\b/i,
  /\bend\s+(it|my life)\b/i,
  /\bself[- ]harm/i,
  // Severe neglect signs
  /\b(bedso?res?|pressure\s+sores?)\b/i,
  /\bnot\s+(eating|feeding|giving\s+(food|water|medicine))\b/i,
  /\buntreated\s+(wound|injury|infection|pain)\b/i,
  /\bcan'?t\s+(go on|take it anymore|cope)\b/i,
];

export function detectCrisis(text: string): boolean {
  return PATTERNS.some((p) => p.test(text));
}

/** Elder helplines — India focused with international fallback */
export const HELPLINES = [
  {
    region: "India",
    name: "Elder Helpline (HelpAge India)",
    contact: "1800-180-1253",
    hours: "Toll-free",
  },
  {
    region: "India",
    name: "Tele-MANAS (Govt. of India)",
    contact: "14416 / 1-800-891-4416",
    hours: "24×7, 20 languages",
  },
  {
    region: "India",
    name: "Vandrevala Foundation",
    contact: "+91 99996 66555",
    hours: "24×7",
  },
  {
    region: "India",
    name: "Jeevandayee (Maharashtra)",
    contact: "104",
    hours: "24×7",
  },
  {
    region: "International",
    name: "Find a helpline",
    contact: "https://findahelpline.com",
    hours: "directory by country",
  },
];
