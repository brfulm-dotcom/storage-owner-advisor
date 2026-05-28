import type { ReactNode } from 'react';
import Link from 'next/link';

export type FAQCategory = 'platform' | 'vendors' | 'industry';

export interface FAQItem {
  question: string;
  answer: ReactNode;
  answerText: string;
  category: FAQCategory;
}

const link = (href: string, text: string) => (
  <Link href={href} className="text-blue-600 hover:underline">
    {text}
  </Link>
);

export const faqCategoryMeta: Record<
  FAQCategory,
  { id: string; heading: string; intro: string }
> = {
  platform: {
    id: 'about-storageowneradvisor',
    heading: 'About StorageOwnerAdvisor',
    intro:
      'How the directory works, what it costs, and how to get help if something looks wrong.',
  },
  vendors: {
    id: 'for-vendors',
    heading: 'For Vendors (Listings & Profiles)',
    intro:
      'Getting listed, claiming a business, and the difference between free and premium profiles.',
  },
  industry: {
    id: 'self-storage-industry',
    heading: 'Self-Storage Industry & Operations',
    intro:
      'Benchmarks, financials, and operating practices for owners and operators of self-storage facilities.',
  },
};

export const faqCategoryOrder: FAQCategory[] = ['platform', 'vendors', 'industry'];

export const faqs: FAQItem[] = [
  // -------------------- Platform --------------------

  {
    category: 'platform',
    question: 'What is StorageOwnerAdvisor?',
    answer: (
      <>
        StorageOwnerAdvisor is a free online directory designed specifically for
        the self-storage industry. We connect storage facility owners and
        operators with vetted vendors and service providers across categories
        like {link('/category/management-software', 'management software')},{' '}
        {link('/category/security-systems', 'security systems')},{' '}
        {link('/category/construction-building', 'construction')},{' '}
        {link('/category/insurance', 'insurance')},{' '}
        {link('/category/marketing-web', 'marketing')}, and more.
      </>
    ),
    answerText:
      'StorageOwnerAdvisor is a free online directory designed specifically for the self-storage industry. We connect storage facility owners and operators with vetted vendors and service providers across categories like management software, security systems, construction, insurance, marketing, and more.',
  },
  {
    category: 'platform',
    question: 'How do I find vendors for my storage facility?',
    answer: (
      <>
        You can browse our vendor directory by category from the homepage, or
        use the {link('/search', 'search functionality')} to find specific types
        of vendors. Each listing includes the vendor&apos;s description, contact
        information, website link, and the categories they serve. You can reach
        out to vendors directly through their listed contact details.
      </>
    ),
    answerText:
      "You can browse our vendor directory by category from the homepage, or use the search functionality to find specific types of vendors. Each listing includes the vendor's description, contact information, website link, and the categories they serve. You can reach out to vendors directly through their listed contact details.",
  },
  {
    category: 'platform',
    question: 'Is StorageOwnerAdvisor free to use?',
    answer: (
      <>
        Yes, StorageOwnerAdvisor is completely free for storage facility owners
        and operators to browse and use. There is no cost to search the
        directory, view vendor listings, or contact vendors. We also offer free
        basic listings for vendors.{' '}
        {link('/premium', 'Premium listing options')} are available for vendors
        who want enhanced visibility.
      </>
    ),
    answerText:
      'Yes, StorageOwnerAdvisor is completely free for storage facility owners and operators to browse and use. There is no cost to search the directory, view vendor listings, or contact vendors. We also offer free basic listings for vendors. Premium listing options are available for vendors who want enhanced visibility.',
  },
  {
    category: 'platform',
    question: 'How do I contact a vendor?',
    answer: (
      <>
        Each vendor listing includes their contact information, which may
        include a website URL, email address, and phone number. Simply visit
        the vendor&apos;s listing page and use the provided contact details to
        reach out to them directly. StorageOwnerAdvisor is not involved in
        transactions between you and vendors.
      </>
    ),
    answerText:
      "Each vendor listing includes their contact information, which may include a website URL, email address, and phone number. Simply visit the vendor's listing page and use the provided contact details to reach out to them directly. StorageOwnerAdvisor is not involved in transactions between you and vendors.",
  },
  {
    category: 'platform',
    question: 'Is the information on this site accurate?',
    answer: (
      <>
        We do our best to maintain accurate and up-to-date information in our
        directory. However, we rely on vendors to provide and update their own
        information. We recommend verifying details directly with vendors
        before making business decisions. If you notice any inaccuracies,
        please let us know through our {link('/contact', 'contact page')}.
      </>
    ),
    answerText:
      'We do our best to maintain accurate and up-to-date information in our directory. However, we rely on vendors to provide and update their own information. We recommend verifying details directly with vendors before making business decisions. If you notice any inaccuracies, please let us know through our contact page.',
  },
  {
    category: 'platform',
    question: 'How do I report incorrect information?',
    answer: (
      <>
        If you find incorrect or outdated information in our directory, please
        {' '}{link('/contact', 'contact us')} or email us at
        support@storageowneradvisor.com. Include the vendor name and the
        specific information that needs to be corrected, and we will review and
        update it promptly.
      </>
    ),
    answerText:
      'If you find incorrect or outdated information in our directory, please contact us or email us at support@storageowneradvisor.com. Include the vendor name and the specific information that needs to be corrected, and we will review and update it promptly.',
  },

  // -------------------- For Vendors --------------------

  {
    category: 'vendors',
    question: 'How do vendors get listed?',
    answer: (
      <>
        Vendors can submit their business information through our{' '}
        {link('/submit', 'Submit a Vendor page')}. After submission, our team
        reviews the listing for accuracy and relevance to the self-storage
        industry. Approved listings appear in the directory, typically within a
        few business days.
      </>
    ),
    answerText:
      'Vendors can submit their business information through our Submit a Vendor page. After submission, our team reviews the listing for accuracy and relevance to the self-storage industry. Approved listings appear in the directory, typically within a few business days.',
  },
  {
    category: 'vendors',
    question: "What's the difference between free and premium listings?",
    answer: (
      <>
        Free listings include your basic business information, description,
        contact details, and category placement. Premium listings offer
        enhanced visibility with featured placement, priority positioning in
        search results, a premium badge, and an enhanced company profile. Visit
        our {link('/premium', 'Premium page')} for more details.
      </>
    ),
    answerText:
      'Free listings include your basic business information, description, contact details, and category placement. Premium listings offer enhanced visibility with featured placement, priority positioning in search results, a premium badge, and an enhanced company profile. Visit our Premium page for more details.',
  },
  {
    category: 'vendors',
    question: 'How do I claim my business listing?',
    answer: (
      <>
        If your business is already listed in our directory, you can claim it
        by clicking the &ldquo;Claim This Listing&rdquo; button on your vendor
        profile page. You will need to verify your identity and your role at
        the company. Once verified, you can update your listing information and
        manage your profile.
      </>
    ),
    answerText:
      'If your business is already listed in our directory, you can claim it by clicking the "Claim This Listing" button on your vendor profile page. You will need to verify your identity and your role at the company. Once verified, you can update your listing information and manage your profile.',
  },

  // -------------------- Industry --------------------

  {
    category: 'industry',
    question: 'What is a typical occupancy rate for a self-storage facility?',
    answer: (
      <>
        Occupancy at U.S. self-storage facilities varies by market, facility
        age, and operator quality. The major institutional REITs (Public
        Storage, Extra Space Storage, CubeSmart, Life Storage) consistently
        report portfolio occupancy in the high 80s to low 90s percent range,
        while independent operators often run a few points below that. Newly
        opened facilities typically take 18 to 36 months to reach stabilized
        occupancy. Most lenders consider a facility stabilized once it has held
        above 80 percent occupancy for three consecutive months. Sustained
        occupancy below 70 percent usually indicates a marketing, pricing, or
        unit mix problem rather than a soft market.
      </>
    ),
    answerText:
      'Occupancy at U.S. self-storage facilities varies by market, facility age, and operator quality. The major institutional REITs (Public Storage, Extra Space Storage, CubeSmart, Life Storage) consistently report portfolio occupancy in the high 80s to low 90s percent range, while independent operators often run a few points below that. Newly opened facilities typically take 18 to 36 months to reach stabilized occupancy. Most lenders consider a facility stabilized once it has held above 80 percent occupancy for three consecutive months. Sustained occupancy below 70 percent usually indicates a marketing, pricing, or unit mix problem rather than a soft market.',
  },
  {
    category: 'industry',
    question: 'How profitable is a typical self-storage facility?',
    answer:
      'Self-storage is known for strong operating margins compared to most other commercial real estate categories. A well-run, stabilized facility typically operates at a 60 to 70 percent operating margin (revenue minus operating expenses, before debt service). Net operating income depends heavily on occupancy, ancillary revenue (tenant insurance or protection plans, late fees, retail), and how efficiently the property is managed. Operators in growing markets running modern technology and active revenue management generally outperform older facilities relying on legacy software and static rate cards.',
    answerText:
      'Self-storage is known for strong operating margins compared to most other commercial real estate categories. A well-run, stabilized facility typically operates at a 60 to 70 percent operating margin (revenue minus operating expenses, before debt service). Net operating income depends heavily on occupancy, ancillary revenue (tenant insurance or protection plans, late fees, retail), and how efficiently the property is managed. Operators in growing markets running modern technology and active revenue management generally outperform older facilities relying on legacy software and static rate cards.',
  },
  {
    category: 'industry',
    question: 'How much does it cost to build a self-storage facility?',
    answer: (
      <>
        Construction cost for a new self-storage facility in the United States
        typically runs $25 to $70 per square foot for single-story drive-up,
        $42 to $90 per square foot for single-story climate-controlled, and $85
        to $150+ per square foot for multi-story climate-controlled in urban
        infill markets. Total project cost including land, sitework, soft
        costs, and contingency commonly lands at $5 million to $15 million for
        a midsize 60,000 to 80,000 net rentable square foot facility. The unit
        mix, market wage rates, and whether the building uses a pre-engineered
        metal system or full conventional construction drive most of the
        variation. See our{' '}
        {link('/category/construction-building', 'construction directory')} for
        builders and developers serving the self-storage industry.
      </>
    ),
    answerText:
      'Construction cost for a new self-storage facility in the United States typically runs $25 to $70 per square foot for single-story drive-up, $42 to $90 per square foot for single-story climate-controlled, and $85 to $150+ per square foot for multi-story climate-controlled in urban infill markets. Total project cost including land, sitework, soft costs, and contingency commonly lands at $5 million to $15 million for a midsize 60,000 to 80,000 net rentable square foot facility. The unit mix, market wage rates, and whether the building uses a pre-engineered metal system or full conventional construction drive most of the variation.',
  },
  {
    category: 'industry',
    question: 'How long does it take to build a self-storage facility?',
    answer:
      'From land acquisition to certificate of occupancy, most self-storage projects run 14 to 24 months. Entitlements and permitting alone can take 6 to 12 months depending on the municipality. Once permits are in hand, vertical construction for a single-story drive-up facility is usually 5 to 7 months, and a multi-story climate-controlled building is closer to 9 to 14 months. After opening, lease-up to stabilized occupancy typically takes another 18 to 36 months.',
    answerText:
      'From land acquisition to certificate of occupancy, most self-storage projects run 14 to 24 months. Entitlements and permitting alone can take 6 to 12 months depending on the municipality. Once permits are in hand, vertical construction for a single-story drive-up facility is usually 5 to 7 months, and a multi-story climate-controlled building is closer to 9 to 14 months. After opening, lease-up to stabilized occupancy typically takes another 18 to 36 months.',
  },
  {
    category: 'industry',
    question: 'What is a typical cap rate for self-storage?',
    answer: (
      <>
        Stabilized self-storage facility cap rates have generally ranged from
        the high 5s to the mid 7s percent over the past several years, with
        institutional Class A assets in primary markets transacting at the low
        end and older, single-story facilities in tertiary markets at the high
        end. Cap rates expanded notably alongside the broader interest rate
        cycle that began in 2022. Always pair a cap rate with the underlying
        NOI methodology, since trailing 12-month NOI and forward-looking
        proforma NOI can differ materially at a facility still in lease-up.
        Brokers and advisors listed in our{' '}
        {link('/category/consulting-brokerage', 'consulting and brokerage')}{' '}
        directory can help benchmark a specific market.
      </>
    ),
    answerText:
      'Stabilized self-storage facility cap rates have generally ranged from the high 5s to the mid 7s percent over the past several years, with institutional Class A assets in primary markets transacting at the low end and older, single-story facilities in tertiary markets at the high end. Cap rates expanded notably alongside the broader interest rate cycle that began in 2022. Always pair a cap rate with the underlying NOI methodology, since trailing 12-month NOI and forward-looking proforma NOI can differ materially at a facility still in lease-up.',
  },
  {
    category: 'industry',
    question: 'What management software do most self-storage facilities use?',
    answer: (
      <>
        The most widely used self-storage management platforms in the United
        States include Storable (which now owns SiteLink and storEDGE), Easy
        Storage Solutions, Yardi Breeze for self-storage, and Stora. Larger
        institutional operators often use Yardi or proprietary systems, while
        independent operators tend to choose between Storable and Easy Storage
        Solutions. The right choice depends on facility size, budget,
        integration needs, and whether you want built-in online rentals,
        dynamic pricing, and automated tenant communication. See our{' '}
        {link('/category/management-software', 'management software directory')}{' '}
        for a full comparison of features and pricing.
      </>
    ),
    answerText:
      'The most widely used self-storage management platforms in the United States include Storable (which now owns SiteLink and storEDGE), Easy Storage Solutions, Yardi Breeze for self-storage, and Stora. Larger institutional operators often use Yardi or proprietary systems, while independent operators tend to choose between Storable and Easy Storage Solutions. The right choice depends on facility size, budget, integration needs, and whether you want built-in online rentals, dynamic pricing, and automated tenant communication.',
  },
  {
    category: 'industry',
    question: 'Should I use dynamic pricing software at my self-storage facility?',
    answer:
      'Yes for most facilities above roughly 300 units. Dynamic pricing engines (offered by Storable, Yardi, and standalone tools) adjust street rates and existing customer rate increases based on real-time occupancy, demand, and competitor pricing. Operators who switch from static rate cards to disciplined dynamic pricing typically see 4 to 10 percent revenue lift in the first 12 months. The gain comes mainly from raising rates faster on tight unit sizes and from systematic existing customer rate increases (ECRIs) rather than from headline street rate changes.',
    answerText:
      'Yes for most facilities above roughly 300 units. Dynamic pricing engines (offered by Storable, Yardi, and standalone tools) adjust street rates and existing customer rate increases based on real-time occupancy, demand, and competitor pricing. Operators who switch from static rate cards to disciplined dynamic pricing typically see 4 to 10 percent revenue lift in the first 12 months. The gain comes mainly from raising rates faster on tight unit sizes and from systematic existing customer rate increases (ECRIs) rather than from headline street rate changes.',
  },
  {
    category: 'industry',
    question: 'How are self-storage unit prices typically set?',
    answer:
      'Storage unit pricing is driven primarily by local market rates for similar unit sizes, current occupancy at the facility, and competitor prices within a few miles. Modern operators use dynamic pricing software, which adjusts rates daily or weekly based on real-time availability and demand. Static rate cards (set once and rarely updated) leave money on the table and tend to underperform dynamic pricing by several percentage points of revenue. Climate-controlled units typically command a 25 to 50 percent premium over standard drive-up units of the same size.',
    answerText:
      'Storage unit pricing is driven primarily by local market rates for similar unit sizes, current occupancy at the facility, and competitor prices within a few miles. Modern operators use dynamic pricing software, which adjusts rates daily or weekly based on real-time availability and demand. Static rate cards (set once and rarely updated) leave money on the table and tend to underperform dynamic pricing by several percentage points of revenue. Climate-controlled units typically command a 25 to 50 percent premium over standard drive-up units of the same size.',
  },
  {
    category: 'industry',
    question: 'What is the difference between climate-controlled and drive-up storage?',
    answer: (
      <>
        Drive-up units are exterior-access spaces a tenant can pull a vehicle
        right up to, typically housed in single-story metal buildings without
        temperature regulation. Climate-controlled units are interior-access
        spaces kept within a regulated temperature range (commonly 55 to 80
        degrees Fahrenheit) and often humidity range as well. Climate control
        protects belongings sensitive to heat, cold, or moisture (electronics,
        wood furniture, documents, leather, artwork) and typically commands a
        25 to 50 percent rate premium over a drive-up unit of the same size.
        Equipment vendors are listed in our{' '}
        {link('/category/climate-control-hvac', 'climate control and HVAC')}{' '}
        directory.
      </>
    ),
    answerText:
      'Drive-up units are exterior-access spaces a tenant can pull a vehicle right up to, typically housed in single-story metal buildings without temperature regulation. Climate-controlled units are interior-access spaces kept within a regulated temperature range (commonly 55 to 80 degrees Fahrenheit) and often humidity range as well. Climate control protects belongings sensitive to heat, cold, or moisture (electronics, wood furniture, documents, leather, artwork) and typically commands a 25 to 50 percent rate premium over a drive-up unit of the same size.',
  },
  {
    category: 'industry',
    question: 'Do self-storage facility owners need insurance, and what types?',
    answer: (
      <>
        Yes. Most self-storage operators carry several layers of coverage:
        commercial property insurance for buildings and improvements, general
        liability insurance for slip-and-fall and similar claims, business
        interruption insurance, and umbrella coverage for catastrophic events.
        Many operators also offer or require tenant insurance or a tenant
        protection plan, which covers a tenant&apos;s belongings rather than
        the facility itself. Coverage limits should reflect current replacement
        costs, not the original purchase price of the property. Most lenders
        require specific insurance minimums as a condition of financing.
        Carriers and brokers are listed in our{' '}
        {link('/category/insurance', 'insurance directory')}.
      </>
    ),
    answerText:
      "Yes. Most self-storage operators carry several layers of coverage: commercial property insurance for buildings and improvements, general liability insurance for slip-and-fall and similar claims, business interruption insurance, and umbrella coverage for catastrophic events. Many operators also offer or require tenant insurance or a tenant protection plan, which covers a tenant's belongings rather than the facility itself. Coverage limits should reflect current replacement costs, not the original purchase price of the property. Most lenders require specific insurance minimums as a condition of financing.",
  },
  {
    category: 'industry',
    question: 'What is a self-storage tenant protection plan?',
    answer:
      "A tenant protection plan is a facility-offered alternative to traditional tenant insurance that covers the value of stored goods up to a stated limit (commonly $2,000 to $10,000) for a monthly fee added to the tenant's rent. Unlike third-party insurance, the protection plan is administered by the facility (or its program partner) and produces meaningful ancillary revenue. Attach rates of 60 to 80 percent on new move-ins are common at well-run facilities and can lift net operating income by several percentage points.",
    answerText:
      "A tenant protection plan is a facility-offered alternative to traditional tenant insurance that covers the value of stored goods up to a stated limit (commonly $2,000 to $10,000) for a monthly fee added to the tenant's rent. Unlike third-party insurance, the protection plan is administered by the facility (or its program partner) and produces meaningful ancillary revenue. Attach rates of 60 to 80 percent on new move-ins are common at well-run facilities and can lift net operating income by several percentage points.",
  },
  {
    category: 'industry',
    question: 'How do auctions work for delinquent self-storage units?',
    answer:
      'When a tenant falls behind on rent (usually 30 to 90 days depending on state lien law), the facility follows a statutory process: written notice, certified mail, public notice of sale, and finally a public auction. Most states now permit online auctions through platforms like StorageTreasures and StorageAuctions. The facility recovers unpaid rent, late fees, and auction costs from the proceeds; any surplus is generally owed back to the tenant. State self-storage lien laws vary significantly, so operators should follow their own state statute exactly and document each step.',
    answerText:
      'When a tenant falls behind on rent (usually 30 to 90 days depending on state lien law), the facility follows a statutory process: written notice, certified mail, public notice of sale, and finally a public auction. Most states now permit online auctions through platforms like StorageTreasures and StorageAuctions. The facility recovers unpaid rent, late fees, and auction costs from the proceeds; any surplus is generally owed back to the tenant. State self-storage lien laws vary significantly, so operators should follow their own state statute exactly and document each step.',
  },
  {
    category: 'industry',
    question: 'What security features should a self-storage facility have?',
    answer: (
      <>
        Industry-standard security for a modern self-storage facility includes
        perimeter fencing, gated access with individual tenant PIN or app-based
        credentials, 24/7 HD video surveillance with sufficient retention
        (commonly 30 to 90 days), well-lit drive aisles, motion-triggered
        hallway lighting in climate-controlled buildings, and individual door
        alarms on premium product. Smart-entry systems (Nok&euml;, Janus,
        OpenTech) are increasingly standard on new builds and turning into a
        competitive expectation in primary markets. Vendors are listed in our{' '}
        {link('/category/security-systems', 'security and access control')}{' '}
        directory.
      </>
    ),
    answerText:
      'Industry-standard security for a modern self-storage facility includes perimeter fencing, gated access with individual tenant PIN or app-based credentials, 24/7 HD video surveillance with sufficient retention (commonly 30 to 90 days), well-lit drive aisles, motion-triggered hallway lighting in climate-controlled buildings, and individual door alarms on premium product. Smart-entry systems (Nokë, Janus, OpenTech) are increasingly standard on new builds and turning into a competitive expectation in primary markets.',
  },
  {
    category: 'industry',
    question: 'How do self-storage facilities attract new tenants?',
    answer: (
      <>
        The dominant move-in channels for U.S. self-storage are Google Search
        and Google Maps (organic and paid), aggregator sites like SpareFoot,
        direct phone calls driven by signage and reputation, and referrals.
        Online reviews on Google Business Profile are now one of the strongest
        local ranking factors. Facilities that invest in conversion-optimized
        websites with real-time online rentals, active reputation management,
        and disciplined paid search routinely outperform peers with the same
        physical location and unit mix. Agencies and tools are listed in our{' '}
        {link('/category/marketing-web', 'marketing and web services')}{' '}
        directory.
      </>
    ),
    answerText:
      'The dominant move-in channels for U.S. self-storage are Google Search and Google Maps (organic and paid), aggregator sites like SpareFoot, direct phone calls driven by signage and reputation, and referrals. Online reviews on Google Business Profile are now one of the strongest local ranking factors. Facilities that invest in conversion-optimized websites with real-time online rentals, active reputation management, and disciplined paid search routinely outperform peers with the same physical location and unit mix.',
  },
  {
    category: 'industry',
    question: 'Do self-storage facilities need an SEO and marketing strategy?',
    answer:
      'Yes. The majority of self-storage rentals begin with a search on Google or Google Maps, and the facilities that appear in the local 3-pack capture the bulk of clicks and calls. A working strategy combines an optimized Google Business Profile, a fast mobile-friendly facility website with structured data, local citation consistency, review generation, and targeted paid search for high-intent keywords like "storage near me" and city-and-unit-size queries. Operators relying purely on signage and walk-ins generally lease up slower and at lower rates than competitors investing in digital.',
    answerText:
      'Yes. The majority of self-storage rentals begin with a search on Google or Google Maps, and the facilities that appear in the local 3-pack capture the bulk of clicks and calls. A working strategy combines an optimized Google Business Profile, a fast mobile-friendly facility website with structured data, local citation consistency, review generation, and targeted paid search for high-intent keywords like "storage near me" and city-and-unit-size queries. Operators relying purely on signage and walk-ins generally lease up slower and at lower rates than competitors investing in digital.',
  },
  {
    category: 'industry',
    question: 'What KPIs should self-storage facility owners track?',
    answer:
      'The most important operational metrics for a self-storage facility are physical occupancy (the percentage of units occupied), economic occupancy (the percentage of potential rent actually collected), revenue per available square foot (RevPAF), average rate per occupied unit, move-in and move-out counts, delinquency rate, and tenant insurance or protection plan attach rate. Tracking these monthly highlights problems early and shows where to focus management attention. At the financial level, net operating income (NOI) and cap rate-derived facility value are the high-level numbers every owner should know cold.',
    answerText:
      'The most important operational metrics for a self-storage facility are physical occupancy (the percentage of units occupied), economic occupancy (the percentage of potential rent actually collected), revenue per available square foot (RevPAF), average rate per occupied unit, move-in and move-out counts, delinquency rate, and tenant insurance or protection plan attach rate. Tracking these monthly highlights problems early and shows where to focus management attention. At the financial level, net operating income (NOI) and cap rate-derived facility value are the high-level numbers every owner should know cold.',
  },
];
