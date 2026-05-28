'use client';

import { useState } from 'react';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import {
  faqs,
  faqCategoryMeta,
  faqCategoryOrder,
  type FAQItem,
} from './faq-data';

function FAQAccordionItem({ item, id }: { item: FAQItem; id: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = `${id}-panel`;

  return (
    <div className="border border-gray-200 rounded-lg bg-white">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 transition-colors rounded-lg"
      >
        <span className="text-lg font-semibold text-gray-900 pr-4">
          {item.question}
        </span>
        <span
          aria-hidden="true"
          className="flex-shrink-0 text-2xl text-gray-400 font-light leading-none"
        >
          {isOpen ? '−' : '+'}
        </span>
      </button>
      <div
        id={panelId}
        role="region"
        className={`grid transition-all duration-200 ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-6 pb-5">
            <div className="text-gray-600 leading-relaxed">{item.answer}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageHero
        title="Self-Storage FAQ"
        subtitle="Answers to common questions about StorageOwnerAdvisor, self-storage operations, and the vendors that serve the industry."
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* On-page anchor nav */}
        <nav
          aria-label="FAQ sections"
          className="mb-10 bg-white border border-gray-200 rounded-lg p-5"
        >
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Jump to a section
          </p>
          <ul className="flex flex-wrap gap-3">
            {faqCategoryOrder.map((cat) => {
              const meta = faqCategoryMeta[cat];
              return (
                <li key={cat}>
                  <a
                    href={`#${meta.id}`}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    {meta.heading}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {faqCategoryOrder.map((cat) => {
          const meta = faqCategoryMeta[cat];
          const items = faqs.filter((f) => f.category === cat);
          if (items.length === 0) return null;

          return (
            <section key={cat} id={meta.id} className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {meta.heading}
              </h2>
              <p className="text-gray-600 mb-6">{meta.intro}</p>
              <div className="space-y-4">
                {items.map((faq, index) => (
                  <FAQAccordionItem
                    key={`${cat}-${index}`}
                    item={faq}
                    id={`faq-${cat}-${index}`}
                  />
                ))}
              </div>
            </section>
          );
        })}

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
