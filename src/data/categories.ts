// =============================================================
// CATEGORIES DATA
// This file defines all vendor categories for the directory.
// To add a new category, just add a new object to the array.
// =============================================================

export interface Category {
  slug: string;          // URL-friendly name (e.g., "security-systems")
  name: string;          // Display name (e.g., "Security Systems")
  description: string;   // Short description for category pages
  icon: string;          // Emoji icon (simple and universal)
  vendorCount: number;   // Number of vendors in this category
}

export const categories: Category[] = [
  {
    slug: 'management-software',
    name: 'Management Software',
    description: 'Facility management platforms, tenant portals, online rental systems, and automation tools to run your storage business efficiently.',
    icon: '💻',
    vendorCount: 12,
  },
  {
    slug: 'security-systems',
    name: 'Security & Access Control',
    description: 'Surveillance cameras, smart gate access, keypad entry systems, alarm monitoring, and security consulting for storage facilities.',
    icon: '🔒',
    vendorCount: 15,
  },
  {
    slug: 'construction-building',
    name: 'Construction & Building',
    description: 'Unit builders, roll-up door manufacturers, portable storage units, metal building suppliers, and general contractors specializing in storage.',
    icon: '🏗️',
    vendorCount: 18,
  },
  {
    slug: 'climate-control-hvac',
    name: 'Climate Control & HVAC',
    description: 'Heating, ventilation, air conditioning, dehumidifiers, and climate monitoring systems designed for storage environments.',
    icon: '🌡️',
    vendorCount: 8,
  },
  {
    slug: 'insurance',
    name: 'Insurance & Risk Management',
    description: 'Tenant insurance programs, facility liability coverage, property insurance, and risk management consulting for storage operators.',
    icon: '🛡️',
    vendorCount: 10,
  },
  {
    slug: 'marketing-web',
    name: 'Marketing & Web Services',
    description: 'SEO agencies, website builders, pay-per-click management, reputation management, and digital marketing tailored for self-storage.',
    icon: '📢',
    vendorCount: 14,
  },
  {
    slug: 'payment-processing',
    name: 'Payment Processing',
    description: 'Credit card processing, ACH payments, autopay systems, kiosk payment solutions, and billing platforms for storage facilities.',
    icon: '💳',
    vendorCount: 7,
  },
  {
    slug: 'doors-hardware',
    name: 'Doors, Locks & Hardware',
    description: 'Roll-up doors, swing doors, disc locks, smart locks, latches, and specialty hardware for storage units.',
    icon: '🚪',
    vendorCount: 11,
  },
  {
    slug: 'moving-supplies',
    name: 'Moving & Packing Supplies',
    description: 'Boxes, tape, bubble wrap, furniture covers, dollies, and retail merchandise programs for your front office.',
    icon: '📦',
    vendorCount: 9,
  },
  {
    slug: 'consulting-brokerage',
    name: 'Consulting & Brokerage',
    description: 'Feasibility studies, facility valuations, buying/selling brokerage, management consulting, and investment advisory.',
    icon: '📊',
    vendorCount: 6,
  },
  {
    slug: 'cleaning-maintenance',
    name: 'Cleaning & Maintenance',
    description: 'Facility cleaning services, pest control, landscaping, parking lot maintenance, and property upkeep for storage sites.',
    icon: '🧹',
    vendorCount: 8,
  },
  {
    slug: 'signage-lighting',
    name: 'Signage & Lighting',
    description: 'LED signs, monument signs, interior wayfinding, parking lot lighting, unit lighting, and branding solutions.',
    icon: '💡',
    vendorCount: 7,
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
