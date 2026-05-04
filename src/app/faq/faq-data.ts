export interface FAQItem {
  question: string;
  answer: string;
}

export const faqs: FAQItem[] = [
  {
    question: 'What is StorageOwnerAdvisor?',
    answer:
      'StorageOwnerAdvisor is a free online directory designed specifically for the self-storage industry. We connect storage facility owners and operators with vetted vendors and service providers across categories like management software, security systems, construction, insurance, marketing, and more.',
  },
  {
    question: 'How do I find vendors for my storage facility?',
    answer:
      "You can browse our vendor directory by category from the homepage, or use the search functionality to find specific types of vendors. Each listing includes the vendor's description, contact information, website link, and the categories they serve. You can reach out to vendors directly through their listed contact details.",
  },
  {
    question: 'How do vendors get listed?',
    answer:
      'Vendors can submit their business information through our Submit a Vendor page. After submission, our team reviews the listing for accuracy and relevance to the self-storage industry. Approved listings appear in the directory, typically within a few business days.',
  },
  {
    question: "What's the difference between free and premium listings?",
    answer:
      'Free listings include your basic business information, description, contact details, and category placement. Premium listings offer enhanced visibility with featured placement, priority positioning in search results, a premium badge, and an enhanced company profile. Visit our Premium page for more details.',
  },
  {
    question: 'How do I claim my business listing?',
    answer:
      'If your business is already listed in our directory, you can claim it by clicking the "Claim This Listing" button on your vendor profile page. You will need to verify your identity and your role at the company. Once verified, you can update your listing information and manage your profile.',
  },
  {
    question: 'Is the information on this site accurate?',
    answer:
      'We do our best to maintain accurate and up-to-date information in our directory. However, we rely on vendors to provide and update their own information. We recommend verifying details directly with vendors before making business decisions. If you notice any inaccuracies, please let us know through our contact page.',
  },
  {
    question: 'How do I contact a vendor?',
    answer:
      "Each vendor listing includes their contact information, which may include a website URL, email address, and phone number. Simply visit the vendor's listing page and use the provided contact details to reach out to them directly. StorageOwnerAdvisor is not involved in transactions between you and vendors.",
  },
  {
    question: 'How do I report incorrect information?',
    answer:
      'If you find incorrect or outdated information in our directory, please contact us through our contact page or email us at support@storageowneradvisor.com. Include the vendor name and the specific information that needs to be corrected, and we will review and update it promptly.',
  },
  {
    question: 'Is StorageOwnerAdvisor free to use?',
    answer:
      'Yes, StorageOwnerAdvisor is completely free for storage facility owners and operators to browse and use. There is no cost to search the directory, view vendor listings, or contact vendors. We also offer free basic listings for vendors. Premium listing options are available for vendors who want enhanced visibility.',
  },

  // ---------- Industry FAQs ----------

  {
    question: 'What is a typical occupancy rate for a self-storage facility?',
    answer:
      'Occupancy at U.S. self-storage facilities varies by market, facility age, and operator quality. The major institutional REITs (Public Storage, Extra Space Storage, CubeSmart, Life Storage) consistently report portfolio occupancy in the high 80s to low 90s percent range, while independent operators often run a few points below that. Newly opened facilities typically take 18 to 36 months to reach stabilized occupancy. Most lenders consider a facility stabilized once it has held above 80 percent occupancy for three consecutive months. Sustained occupancy below 70 percent usually indicates a marketing, pricing, or unit mix problem rather than a soft market.',
  },
  {
    question: 'How profitable is a typical self-storage facility?',
    answer:
      'Self-storage is known for strong operating margins compared to most other commercial real estate categories. A well-run, stabilized facility typically operates at a 60 to 70 percent operating margin (revenue minus operating expenses, before debt service). Net operating income depends heavily on occupancy, ancillary revenue (tenant insurance or protection plans, late fees, retail), and how efficiently the property is managed. Operators in growing markets running modern technology and active revenue management generally outperform older facilities relying on legacy software and static rate cards.',
  },
  {
    question: 'What management software do most self-storage facilities use?',
    answer:
      'The most widely used self-storage management platforms in the United States include Storable (which now owns SiteLink and storEDGE), Easy Storage Solutions, Yardi Breeze for self-storage, and Stora. Larger institutional operators often use Yardi or proprietary systems, while independent operators tend to choose between Storable and Easy Storage Solutions. The right choice depends on facility size, budget, integration needs, and whether you want built-in online rentals, dynamic pricing, and automated tenant communication. See our management software directory for a full comparison of features and pricing.',
  },
  {
    question: 'Do self-storage facility owners need insurance, and what types?',
    answer:
      'Yes. Most self-storage operators carry several layers of coverage: commercial property insurance for buildings and improvements, general liability insurance for slip-and-fall and similar claims, business interruption insurance, and umbrella coverage for catastrophic events. Many operators also offer or require tenant insurance or a tenant protection plan, which covers a tenant’s belongings rather than the facility itself. Coverage limits should reflect current replacement costs, not the original purchase price of the property. Most lenders require specific insurance minimums as a condition of financing.',
  },
  {
    question: 'How are self-storage unit prices typically set?',
    answer:
      'Storage unit pricing is driven primarily by local market rates for similar unit sizes, current occupancy at the facility, and competitor prices within a few miles. Modern operators use dynamic pricing software, which adjusts rates daily or weekly based on real-time availability and demand. Static rate cards (set once and rarely updated) leave money on the table and tend to underperform dynamic pricing by several percentage points of revenue. Climate-controlled units typically command a 25 to 50 percent premium over standard drive-up units of the same size.',
  },
  {
    question: 'What KPIs should self-storage facility owners track?',
    answer:
      'The most important operational metrics for a self-storage facility are physical occupancy (the percentage of units occupied), economic occupancy (the percentage of potential rent actually collected), revenue per available square foot (RevPAF), average rate per occupied unit, move-in and move-out counts, delinquency rate, and tenant insurance or protection plan attach rate. Tracking these monthly highlights problems early and shows where to focus management attention. At the financial level, net operating income (NOI) and cap rate-derived facility value are the high-level numbers every owner should know cold.',
  },
];
