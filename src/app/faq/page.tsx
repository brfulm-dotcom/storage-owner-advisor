'use client';

import { useState } from 'react';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import { faqs, type FAQItem } from './faq-data';

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
      <PageHero
        title="Frequently Asked Questions"
        subtitle="Find answers to common questions about StorageOwnerAdvisor and our vendor directory."
      />

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
