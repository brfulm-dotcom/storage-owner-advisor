'use client';

import { useState } from 'react';
import Link from 'next/link';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'What is StorageOwnerAdvisor?',
    answer:
      'StorageOwnerAdvisor is a free online directory designed specifically for the self-storage industry. We connect storage facility owners and operators with vetted vendors and service providers across categories like management software, security systems, construction, insurance, marketing, and more.',
  },
  {
    question: 'How do I find vendors for my storage facility?',
    answer:
      'You can browse our vendor directory by category from the homepage, or use the search functionality to find specific types of vendors. Each listing includes the vendor\'s description, contact information, website link, and the categories they serve. You can reach out to vendors directly through their listed contact details.',
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
      'Each vendor listing includes their contact information, which may include a website URL, email address, and phone number. Simply visit the vendor\'s listing page and use the provided contact details to reach out to them directly. StorageOwnerAdvisor is not involved in transactions between you and vendors.',
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
];

function FAQAccordionItem({ item }: { item: FAQItem }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 transition-colors rounded-lg"
      >
        <span className="text-lg font-semibold text-gray-900 pr-4">
          {item.question}
        </span>
        <span className="flex-shrink-0 text-2xl text-gray-400 font-light leading-none">
          {isOpen ? '\u2212' : '+'}
        </span>
      </button>
      {isOpen && (
        <div className="px-6 pb-5">
          <p className="text-gray-600 leading-relaxed">{item.answer}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600">
            Find answers to common questions about StorageOwnerAdvisor and our
            vendor directory.
          </p>
        </div>
      </div>

      {/* FAQ List */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FAQAccordionItem key={index} item={faq} />
          ))}
        </div>

        {/* Still have questions */}
        <div className="mt-16 bg-white rounded-lg border border-gray-200 shadow-sm p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Still have questions?
          </h2>
          <p className="text-gray-600 mb-6">
            We are happy to help. Reach out to our team and we will get back to
            you as soon as possible.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
