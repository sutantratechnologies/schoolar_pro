'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  HelpCircle,
  Mail,
  Building2,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: 'Are there any application or verification fees on BidyaGo?',
    answer: 'None. BidyaGo is 100% free for students worldwide. We never charge for searching, comparing, tracking, or matching with verified scholarships. Official scholarships like MEXT, Australia Awards, and Chevening also charge $0 application fees.',
  },
  {
    question: 'How do I submit my MEXT Japan application from Nepal?',
    answer: 'The Embassy Recommendation route requires physical submission of your dossier (Field of Study plan, certified TU transcripts, Dean’s recommendation letter, medical form) directly at the Embassy of Japan in Panipokhari, Kathmandu prior to the deadline.',
  },
  {
    question: 'Can I apply for multiple government scholarships simultaneously?',
    answer: 'Yes! You can apply for MEXT Japan, Australia Awards, and Chevening UK simultaneously. Each scholarship runs independent selection timelines and screening committees.',
  },
  {
    question: 'Where can I get my academic transcripts certified in Kathmandu?',
    answer: 'Tribhuvan University (TU) transcripts can be attested at the TU Examination Controller Office in Balkhu, followed by the Verification Section of the Ministry of Education, Science and Technology (MoEST) in Sanothimi, Bhaktapur.',
  },
];

export default function HelpAndSupportPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl">
      {/* Header */}
      <div>
        <span className="text-xs font-semibold text-[#4b37df] uppercase tracking-wider block">
          Student Resources
        </span>
        <h1 className="text-2xl sm:text-3xl font-light text-slate-900 tracking-tight">
          Help & Support
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Guidance on international scholarship applications, embassy requirements, and document attestation.
        </p>
      </div>

      {/* Official Help Contacts Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#4b37df] flex items-center justify-center">
            <Mail className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-slate-900">BidyaGo Student Advisory</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Need guidance verifying an international university grant or calculating eligibility?
          </p>
          <a
            href="mailto:support@bidyago.com"
            className="text-xs font-semibold text-[#4b37df] hover:underline inline-flex items-center gap-1"
          >
            <span>support@bidyago.com</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-slate-900">Official Embassies in Nepal</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Direct directories for the Embassy of Japan (Panipokhari), DFAT Australia (Bansbari), and British Council (Lainchaur).
          </p>
          <Link
            href="/destinations"
            className="text-xs font-semibold text-emerald-600 hover:underline inline-flex items-center gap-1"
          >
            <span>View Embassy Portals</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
        <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
          <HelpCircle className="w-4 h-4 text-[#4b37df]" />
          <span>Frequently Asked Questions</span>
        </h3>

        <div className="space-y-3">
          {FAQS.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className="rounded-2xl border border-slate-200/80 bg-slate-50/50 overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(i)}
                  className="w-full p-4 text-left flex items-center justify-between gap-3 text-xs font-semibold text-slate-900 cursor-pointer hover:bg-slate-100/50 transition-colors"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#4b37df]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-white">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
