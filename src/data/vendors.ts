// =============================================================
// VENDORS DATA
// This is your vendor database. Each vendor is an object.
// To add a vendor: copy an existing entry, change the values.
// The "featured" flag makes them show on the homepage.
// The "tier" controls how they display (free, premium, featured).
// =============================================================

export interface Vendor {
  slug: string;              // URL-friendly name
  name: string;              // Company name
  categorySlug: string;      // Must match a category slug
  shortDescription: string;  // One-liner (shown in listings)
  fullDescription: string;   // Detailed description (shown on vendor page)
  website: string;           // Vendor's website URL
  phone?: string;            // Optional phone number
  email?: string;            // Optional contact email
  logo?: string;             // Path to logo image
  features: string[];        // Key features/benefits
  pricing?: string;          // Pricing info (e.g., "Starting at $49/mo")
  rating: number;            // 1-5 star rating
  reviewCount: number;       // Number of reviews
  featured: boolean;         // Show on homepage?
  tier: 'free' | 'premium' | 'featured';  // Listing tier
  affiliateUrl?: string;     // Affiliate link (for monetization)
  yearFounded?: number;      // When the company was founded
  headquarters?: string;     // Location
}

export const vendors: Vendor[] = [
  // ---- MANAGEMENT SOFTWARE ----
  {
    slug: 'storelink-pro',
    name: 'SiteLink Web Edition',
    categorySlug: 'management-software',
    shortDescription: 'Industry-leading facility management software with cloud-based operations, tenant management, and integrated payment processing.',
    fullDescription: 'SiteLink Web Edition is the most widely-used self-storage management platform in the industry. It provides comprehensive tools for managing tenants, units, payments, and reporting — all from a cloud-based dashboard accessible anywhere. Features include automated billing, move-in/move-out workflows, real-time occupancy tracking, and integrations with leading access control and payment systems. Trusted by over 48,000 facilities worldwide.',
    website: 'https://www.sitelink.com',
    features: ['Cloud-based management', 'Automated billing & payments', 'Real-time occupancy reports', 'API integrations', 'Multi-facility support', 'Tenant portal'],
    pricing: 'Contact for pricing',
    rating: 4.6,
    reviewCount: 234,
    featured: true,
    tier: 'featured',
    yearFounded: 1996,
    headquarters: 'Raleigh, NC',
  },
  {
    slug: 'storedge',
    name: 'storEDGE',
    categorySlug: 'management-software',
    shortDescription: 'All-in-one management platform with built-in website, online rentals, and marketing tools designed for modern storage operators.',
    fullDescription: 'storEDGE combines facility management software with a built-in website builder, online rental engine, and marketing tools. It is designed for storage operators who want a single platform to manage operations and attract new tenants. Features include automated rate management, tenant communication tools, and integrations with major access control providers.',
    website: 'https://www.storedge.com',
    features: ['Built-in website builder', 'Online rental engine', 'Automated rate management', 'Marketing tools', 'Tenant communication', 'Access control integration'],
    pricing: 'Starting at $99/mo',
    rating: 4.4,
    reviewCount: 187,
    featured: true,
    tier: 'premium',
    yearFounded: 2012,
    headquarters: 'Scottsdale, AZ',
  },
  {
    slug: 'storeganise',
    name: 'Storeganise',
    categorySlug: 'management-software',
    shortDescription: 'Modern cloud-native storage management with a focus on automation, self-service, and international multi-currency support.',
    fullDescription: 'Storeganise is a modern, cloud-native self-storage management platform built for operators who value automation and self-service. It features a clean tenant portal, automated invoicing, smart access control integrations, and support for multiple currencies and languages — making it ideal for operators in international markets.',
    website: 'https://storeganise.com',
    features: ['Cloud-native platform', 'Self-service tenant portal', 'Multi-currency support', 'Automated invoicing', 'Smart access control', 'International support'],
    pricing: 'Starting at $79/mo',
    rating: 4.3,
    reviewCount: 98,
    featured: false,
    tier: 'premium',
    yearFounded: 2017,
    headquarters: 'London, UK',
  },
{
    slug: 'storable',
    name: 'Storable',
    categorySlug: 'management-software',
    shortDescription: 'Unified platform combining facility management, website building, and access control under one roof for storage operators of all sizes.',
    fullDescription: 'Storable is a unified technology platform for the self-storage industry, formed by bringing together leading brands like storEDGE, SpareFoot, and Unit Trac. The platform provides facility management software, website creation, online marketing, tenant insurance, and access control integration — all connected through a single ecosystem. Storable serves operators of all sizes, from single-facility independents to large REITs.',
    website: 'https://www.storable.com',
    features: ['Unified management platform', 'Website builder', 'Online marketing tools', 'Tenant insurance integration', 'Access control connections', 'Multi-facility dashboard'],
    pricing: 'Contact for pricing',
    rating: 4.4,
    reviewCount: 156,
    featured: true,
    tier: 'featured',
    yearFounded: 2019,
    headquarters: 'Austin, TX',
  },
  {
    slug: 'cubby-self-storage',
    name: 'Cubby',
    categorySlug: 'management-software',
    shortDescription: 'Modern cloud-based management platform focused on simplicity, self-service rentals, and automation for independent operators.',
    fullDescription: 'Cubby is a modern self-storage management platform designed to simplify operations for independent storage operators. Built cloud-native from the ground up, Cubby emphasizes ease of use with intuitive dashboards, self-service online rentals, automated billing, and smart tenant communication. The platform integrates with popular access control systems and payment processors.',
    website: 'https://www.cubbyselfstorage.com',
    features: ['Cloud-native platform', 'Self-service online rentals', 'Automated billing', 'Smart tenant communication', 'Access control integration', 'Intuitive dashboard'],
    pricing: 'Starting at $69/mo',
    rating: 4.2,
    reviewCount: 67,
    featured: false,
    tier: 'free',
    yearFounded: 2020,
    headquarters: 'San Francisco, CA',
  },
  {
    slug: 'stora',
    name: 'Stora',
    categorySlug: 'management-software',
    shortDescription: 'End-to-end management platform with online booking, payments, and automated facility operations for self-storage businesses.',
    fullDescription: 'Stora is an end-to-end self-storage management platform that enables fully automated facility operations. It features online booking and payments, automated move-in workflows, dynamic pricing tools, and a customer portal. Stora integrates with smart lock providers for contactless access and provides detailed analytics to help operators optimize revenue and occupancy.',
    website: 'https://www.stora.co',
    features: ['Online booking & payments', 'Automated move-in workflows', 'Dynamic pricing', 'Customer portal', 'Smart lock integration', 'Revenue analytics'],
    pricing: 'Starting at $89/mo',
    rating: 4.3,
    reviewCount: 82,
    featured: false,
    tier: 'premium',
    yearFounded: 2018,
    headquarters: 'Edinburgh, UK',
  },
  {
    slug: '6storage',
    name: '6Storage',
    categorySlug: 'management-software',
    shortDescription: 'Affordable cloud-based management software with built-in CRM, invoicing, and online reservations for small to mid-size facilities.',
    fullDescription: '6Storage is an affordable cloud-based self-storage management solution targeting small to mid-size operators. It provides unit management, tenant CRM, automated invoicing, online reservations, and basic reporting. The platform is known for its straightforward setup process and responsive customer support, making it a solid choice for operators who want functionality without complexity.',
    website: 'https://www.6storage.com',
    features: ['Unit management', 'Tenant CRM', 'Automated invoicing', 'Online reservations', 'Reporting dashboard', 'Quick setup'],
    pricing: 'Starting at $49/mo',
    rating: 4.1,
    reviewCount: 54,
    featured: false,
    tier: 'free',
    yearFounded: 2016,
    headquarters: 'Wilmington, DE',
  },
  {
    slug: 'tenant-inc',
    name: 'Tenant Inc.',
    categorySlug: 'management-software',
    shortDescription: 'Next-generation cloud platform with AI-powered revenue management, contactless rentals, and enterprise-grade reporting.',
    fullDescription: 'Tenant Inc. is a next-generation self-storage management platform built on modern cloud infrastructure. It features AI-powered revenue management that dynamically adjusts pricing, fully contactless rental workflows, and enterprise-grade reporting and analytics. The platform is designed for operators who want cutting-edge technology and is particularly popular with mid-size to large portfolios.',
    website: 'https://www.tenantinc.com',
    features: ['AI-powered revenue management', 'Contactless rentals', 'Enterprise reporting', 'Dynamic pricing', 'Cloud infrastructure', 'Portfolio analytics'],
    pricing: 'Contact for pricing',
    rating: 4.3,
    reviewCount: 73,
    featured: false,
    tier: 'premium',
    yearFounded: 2017,
    headquarters: 'Newport Beach, CA',
  },
  {
    slug: 'unit-trac',
    name: 'Unit Trac',
    categorySlug: 'management-software',
    shortDescription: 'Simple, affordable management software built for small operators who want core features without the complexity of enterprise platforms.',
    fullDescription: 'Unit Trac (now part of the Storable family) is a simple, affordable self-storage management platform built specifically for small operators. It covers the essential features — unit tracking, tenant management, billing, and basic reporting — without the complexity or cost of enterprise platforms. Unit Trac is ideal for single-facility operators who want to digitize their operations without a steep learning curve.',
    website: 'https://www.unittrac.com',
    features: ['Simple unit tracking', 'Tenant management', 'Automated billing', 'Basic reporting', 'Easy setup', 'Affordable for small operators'],
    pricing: 'Starting at $29/mo',
    rating: 4.0,
    reviewCount: 112,
    featured: false,
    tier: 'free',
    yearFounded: 2010,
    headquarters: 'Austin, TX',
  },
  {
    slug: 'storage-commander',
    name: 'Storage Commander',
    categorySlug: 'management-software',
    shortDescription: 'Feature-rich desktop and cloud management software with powerful reporting, auction management, and lien processing tools.',
    fullDescription: 'Storage Commander is a feature-rich self-storage management platform available in both desktop and cloud versions. Known for its powerful reporting engine and comprehensive feature set, it includes auction management, lien processing, automated late fees, tenant insurance, and detailed financial reporting. Storage Commander is popular with operators who need advanced operational tools and customizable workflows.',
    website: 'https://www.storagecommander.com',
    features: ['Desktop & cloud versions', 'Advanced reporting', 'Auction management', 'Lien processing', 'Automated late fees', 'Tenant insurance integration'],
    pricing: 'Starting at $75/mo',
    rating: 4.2,
    reviewCount: 143,
    featured: false,
    tier: 'premium',
    yearFounded: 2004,
    headquarters: 'Murrieta, CA',
  },
  {
    slug: 'innago-storage',
    name: 'Innago',
    categorySlug: 'management-software',
    shortDescription: 'Free property management platform that supports self-storage units with online rent collection, lease management, and tenant screening.',
    fullDescription: 'Innago is a free property management platform that supports self-storage facilities alongside traditional rental properties. It offers online rent collection, lease management, tenant screening, and maintenance request tracking. While not exclusively built for self-storage, its zero-cost model makes it attractive for small operators who also manage other property types and want a single platform.',
    website: 'https://www.innago.com',
    features: ['Free to use', 'Online rent collection', 'Lease management', 'Tenant screening', 'Maintenance tracking', 'Multi-property support'],
    pricing: 'Free (transaction fees apply)',
    rating: 4.1,
    reviewCount: 89,
    featured: false,
    tier: 'free',
    yearFounded: 2017,
    headquarters: 'Cincinnati, OH',
  },
  {
    slug: 'swivl-storage',
    name: 'Swivl',
    categorySlug: 'management-software',
    shortDescription: 'Mobile-first management platform that lets operators run their storage business entirely from a smartphone.',
    fullDescription: 'Swivl is a mobile-first self-storage management platform designed to let operators run their entire business from a smartphone. It features mobile move-ins, digital lease signing, payment processing, and push notifications for tenant communication. Swivl is built for operators who are often on-site and want to manage everything without being tied to a desktop computer.',
    website: 'https://www.swivlstorage.com',
    features: ['Mobile-first design', 'Digital lease signing', 'Mobile move-ins', 'Push notifications', 'Payment processing', 'On-the-go management'],
    pricing: 'Starting at $59/mo',
    rating: 4.0,
    reviewCount: 45,
    featured: false,
    tier: 'free',
    yearFounded: 2019,
    headquarters: 'Boca Raton, FL',
  },
  {
    slug: 'opentech-alliance',
    name: 'OpenTech Alliance',
    categorySlug: 'management-software',
    shortDescription: 'Technology solutions including self-service kiosks (INSOMNIAC), call center services, and online rental tools for self-storage.',
    fullDescription: 'OpenTech Alliance provides technology solutions for the self-storage industry, best known for their INSOMNIAC self-service kiosks that enable 24/7 unmanned rentals. They also offer call center services, online rental platforms, and tenant communication tools. OpenTech solutions integrate with all major management software platforms and are designed to reduce staffing costs while improving the tenant experience.',
    website: 'https://www.opentechalliance.com',
    features: ['INSOMNIAC self-service kiosks', '24/7 unmanned rentals', 'Call center services', 'Online rental platform', 'Management software integration', 'Tenant communication tools'],
    pricing: 'Contact for pricing',
    rating: 4.4,
    reviewCount: 128,
    featured: true,
    tier: 'premium',
    yearFounded: 2002,
    headquarters: 'Phoenix, AZ',
  },
  {
    slug: 'yardi-breeze-storage',
    name: 'Yardi Breeze (Self Storage)',
    categorySlug: 'management-software',
    shortDescription: 'Enterprise-grade property management platform with a self-storage module offering accounting, operations, and marketing in one system.',
    fullDescription: 'Yardi Breeze is the simplified version of Yardi\'s enterprise property management platform, offering a dedicated self-storage module. It provides accounting, operations management, online leasing, and marketing tools in a single system. Backed by Yardi\'s decades of real estate technology experience, it is a strong fit for operators who also manage other property types or want enterprise-grade financial reporting.',
    website: 'https://www.yardibreeze.com',
    features: ['Enterprise-grade accounting', 'Self-storage operations module', 'Online leasing', 'Marketing tools', 'Multi-property support', 'Financial reporting'],
    pricing: 'Starting at $1/unit/mo',
    rating: 4.2,
    reviewCount: 97,
    featured: false,
    tier: 'premium',
    yearFounded: 1984,
    headquarters: 'Santa Barbara, CA',
  },
  // ---- SECURITY SYSTEMS ----
  {
    slug: 'pti-security',
    name: 'PTI Security Systems',
    categorySlug: 'security-systems',
    shortDescription: 'Premier access control and security solutions including keypads, smart locks, and facility monitoring built specifically for self-storage.',
    fullDescription: 'PTI Security Systems has been the self-storage industry\'s leading access control provider for over 40 years. Their product line includes keypads, smart locks, Bluetooth-enabled access, elevator controls, and integrated alarm monitoring. PTI systems work with all major management software platforms and provide real-time access logs and tenant activity tracking.',
    website: 'https://www.ptisecurity.com',
    features: ['Keypads & gate access', 'Bluetooth smart locks', 'Elevator controls', 'Real-time access logs', 'Alarm monitoring', 'Software integrations'],
    pricing: 'Contact for pricing',
    rating: 4.7,
    reviewCount: 312,
    featured: true,
    tier: 'featured',
    yearFounded: 1981,
    headquarters: 'Columbia, SC',
  },
  {
    slug: 'noke-smart-entry',
    name: 'Noke Smart Entry',
    categorySlug: 'security-systems',
    shortDescription: 'Bluetooth-powered smart lock and access control system that lets tenants access units via smartphone — no keys or codes needed.',
    fullDescription: 'Noke Smart Entry by Janus International provides a fully wireless, Bluetooth-powered access control solution for self-storage facilities. Tenants use their smartphones to unlock gates, doors, and individual units. The system eliminates lost keys and forgotten codes, reduces overlock situations, and provides detailed access activity logs for facility managers.',
    website: 'https://www.nokesmartentry.com',
    features: ['Smartphone access', 'No keys or codes', 'Wireless installation', 'Activity tracking', 'Overlock management', 'Works with major PMS'],
    pricing: 'Contact for pricing',
    rating: 4.5,
    reviewCount: 189,
    featured: true,
    tier: 'premium',
    yearFounded: 2014,
    headquarters: 'Temple, GA',
  },

  // ---- CONSTRUCTION & BUILDING ----
  {
    slug: 'janus-international',
    name: 'Janus International',
    categorySlug: 'construction-building',
    shortDescription: 'The world\'s largest manufacturer of roll-up steel doors and self-storage building components, serving over 100,000 facilities.',
    fullDescription: 'Janus International is the global leader in manufacturing roll-up steel doors, hallway systems, relocatable storage units, and building components for the self-storage industry. They serve over 100,000 facilities and offer complete turn-key building solutions from design to installation. Their product line includes their flagship Janus steel doors, R-100 relocatable units, and Noke Smart Entry access control.',
    website: 'https://www.janusintl.com',
    features: ['Roll-up steel doors', 'Relocatable storage units', 'Hallway systems', 'Turn-key building solutions', 'Custom design services', 'Industry-leading warranty'],
    pricing: 'Contact for quote',
    rating: 4.6,
    reviewCount: 276,
    featured: true,
    tier: 'featured',
    yearFounded: 2002,
    headquarters: 'Temple, GA',
  },
  {
    slug: 'trachte-building',
    name: 'Trachte Building Systems',
    categorySlug: 'construction-building',
    shortDescription: 'Premium steel building manufacturer specializing in multi-story and single-story self-storage facilities with custom engineering.',
    fullDescription: 'Trachte Building Systems designs and manufactures premium steel self-storage buildings, specializing in both single-story and multi-story facilities. Their engineering team provides custom designs tailored to each site\'s specific requirements, local building codes, and operator preferences. Trachte buildings are known for their durability, clean aesthetics, and efficient use of space.',
    website: 'https://www.trachte.com',
    features: ['Custom steel buildings', 'Multi-story specialists', 'Engineering & design', 'Code compliance', 'Climate-control ready', 'Fast construction timelines'],
    pricing: 'Custom quotes',
    rating: 4.5,
    reviewCount: 143,
    featured: false,
    tier: 'premium',
    yearFounded: 1976,
    headquarters: 'Sun Prairie, WI',
  },

  // ---- INSURANCE ----
  {
    slug: 'bader-company',
    name: 'Bader Company',
    categorySlug: 'insurance',
    shortDescription: 'Specializes exclusively in self-storage tenant insurance programs, offering easy-to-implement plans that generate facility revenue.',
    fullDescription: 'Bader Company has specialized in self-storage tenant insurance for over 40 years. Their programs are designed to be easy for operators to implement and generate ancillary revenue through commission sharing. Plans cover tenant belongings against fire, theft, water damage, and other perils. Bader handles all claims processing, reducing the administrative burden on facility staff.',
    website: 'https://www.badercompany.com',
    features: ['Tenant insurance programs', 'Revenue sharing for operators', 'Claims processing included', 'Easy implementation', 'Multiple coverage tiers', '40+ years industry experience'],
    pricing: 'Revenue-sharing model',
    rating: 4.4,
    reviewCount: 167,
    featured: true,
    tier: 'premium',
    yearFounded: 1979,
    headquarters: 'Baton Rouge, LA',
  },

  // ---- MARKETING & WEB ----
  {
    slug: 'g5-marketing',
    name: 'G5 Search Marketing',
    categorySlug: 'marketing-web',
    shortDescription: 'Digital marketing agency specializing in self-storage SEO, PPC advertising, and website design to fill your empty units.',
    fullDescription: 'G5 is a digital marketing platform and agency that specializes in the self-storage industry. They provide SEO, pay-per-click advertising, website design, and reputation management services specifically tailored for storage operators. Their data-driven approach uses AI and predictive analytics to optimize marketing spend and maximize occupancy rates.',
    website: 'https://www.getg5.com',
    features: ['Storage-specific SEO', 'PPC management', 'Website design', 'Reputation management', 'Predictive analytics', 'Performance reporting'],
    pricing: 'Starting at $500/mo',
    rating: 4.3,
    reviewCount: 145,
    featured: true,
    tier: 'premium',
    yearFounded: 2005,
    headquarters: 'Bend, OR',
  },

  // ---- PAYMENT PROCESSING ----
  {
    slug: 'easy-storage-solutions',
    name: 'Easy Storage Solutions',
    categorySlug: 'payment-processing',
    shortDescription: 'Affordable management software with built-in payment processing designed for small to mid-size storage operators.',
    fullDescription: 'Easy Storage Solutions provides an affordable, easy-to-use management platform with integrated payment processing. Designed for small to mid-size operators, it includes online rentals, automated billing, tenant communication, and basic website functionality. Their straightforward pricing and minimal setup requirements make it a popular choice for independent operators.',
    website: 'https://www.easystoragesolutions.com',
    features: ['Integrated payments', 'Online rentals', 'Automated billing', 'Tenant communication', 'Basic website included', 'Affordable pricing'],
    pricing: 'Starting at $40/mo',
    rating: 4.2,
    reviewCount: 203,
    featured: false,
    tier: 'free',
    yearFounded: 2009,
    headquarters: 'Columbia, MO',
  },

  // ---- DOORS & HARDWARE ----
  {
    slug: 'dbci-doors',
    name: 'DBCI (a Janus company)',
    categorySlug: 'doors-hardware',
    shortDescription: 'Leading manufacturer of self-storage doors, hallway systems, and building components with nationwide installation services.',
    fullDescription: 'DBCI, now part of Janus International, is one of the leading manufacturers of self-storage roll-up doors, swing doors, hallway partition systems, and related building components. With manufacturing facilities across the US, they offer fast lead times and nationwide installation services. Their product line covers everything from standard mini-storage doors to commercial-grade high-wind-rated units.',
    website: 'https://www.dbci.com',
    features: ['Roll-up doors', 'Swing doors', 'Hallway systems', 'High-wind rated options', 'Nationwide installation', 'Fast lead times'],
    pricing: 'Contact for pricing',
    rating: 4.4,
    reviewCount: 198,
    featured: false,
    tier: 'premium',
    yearFounded: 1982,
    headquarters: 'Suwanee, GA',
  },

  // ---- MOVING SUPPLIES ----
  {
    slug: 'supply-side-usa',
    name: 'Supply Side USA',
    categorySlug: 'moving-supplies',
    shortDescription: 'Wholesale moving and packing supplies including boxes, tape, covers, and retail display programs for storage facility front offices.',
    fullDescription: 'Supply Side USA provides wholesale moving and packing supplies to self-storage facilities across the country. Their product line includes boxes, tape, bubble wrap, mattress covers, furniture pads, and locks. They also offer retail display programs and merchandising solutions to help operators maximize ancillary retail revenue from their front office.',
    website: 'https://www.supplysideusa.com',
    features: ['Wholesale pricing', 'Complete supply line', 'Retail display programs', 'Drop shipping', 'Custom branding options', 'Merchandising support'],
    pricing: 'Wholesale pricing (contact)',
    rating: 4.1,
    reviewCount: 87,
    featured: false,
    tier: 'free',
    yearFounded: 2001,
    headquarters: 'Las Vegas, NV',
  },

  // ---- CONSULTING ----
  {
    slug: 'argus-selfstorage',
    name: 'Argus Self Storage Advisors',
    categorySlug: 'consulting-brokerage',
    shortDescription: 'National network of self-storage real estate brokers and consultants specializing in buying, selling, and valuing storage facilities.',
    fullDescription: 'Argus Self Storage Advisors is a national network of experienced self-storage real estate professionals who specialize in the buying, selling, and valuation of storage facilities. Their advisors have deep knowledge of local markets and provide feasibility studies, market analyses, and brokerage services for operators looking to expand, sell, or invest in self-storage properties.',
    website: 'https://www.argus-selfstorage.com',
    features: ['Facility brokerage', 'Market analysis', 'Feasibility studies', 'Valuations', 'National network', 'Local market expertise'],
    pricing: 'Commission-based',
    rating: 4.5,
    reviewCount: 76,
    featured: false,
    tier: 'free',
    yearFounded: 1994,
    headquarters: 'Denver, CO',
  },
];

// Helper functions
export function getVendorBySlug(slug: string): Vendor | undefined {
  return vendors.find((v) => v.slug === slug);
}

export function getVendorsByCategory(categorySlug: string): Vendor[] {
  return vendors.filter((v) => v.categorySlug === categorySlug);
}

export function getFeaturedVendors(): Vendor[] {
  return vendors.filter((v) => v.featured);
}

export function searchVendors(query: string): Vendor[] {
  const lower = query.toLowerCase();
  return vendors.filter(
    (v) =>
      v.name.toLowerCase().includes(lower) ||
      v.shortDescription.toLowerCase().includes(lower) ||
      v.features.some((f) => f.toLowerCase().includes(lower))
  );
}
