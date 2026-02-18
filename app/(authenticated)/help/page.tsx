'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import { HelpCircle, FileText, Upload, MessageSquare, Zap, Shield } from 'lucide-react';
import Link from 'next/link';

export default function HelpPage() {
  const faqItems = [
    {
      question: 'What file formats are supported?',
      answer:
        'TARS AI currently supports PDF files. You can upload any PDF up to 50MB in size. The content will be indexed and made searchable within your chat.',
      icon: FileText,
    },
    {
      question: 'How many PDFs can I upload?',
      answer:
        'The Free plan allows 2 PDFs per month, while the Pro plan allows 10 PDFs per month. The limit resets on the first day of each month.',
      icon: Upload,
    },
    {
      question: 'How accurate are the AI responses?',
      answer:
        'Our AI reads and understands your PDF content using advanced language models. Response accuracy depends on the document quality and query clarity. Always verify important information with the original document.',
      icon: Zap,
    },
    {
      question: 'Is my data secure?',
      answer:
        'Yes! Your PDFs are encrypted and stored securely on our servers. We use industry-standard security practices. Your data is never shared with third parties unless you explicitly authorize it.',
      icon: Shield,
    },
    {
      question: 'Can I delete my data?',
      answer:
        'You can delete individual chats anytime. You can also export or permanently delete all your data from the settings page. Deleted data cannot be recovered.',
      icon: FileText,
    },
    {
      question: 'How do I upgrade to Pro?',
      answer:
        'Visit the Pricing page from your dashboard to view Pro features and pricing. Click the "Upgrade" button to get started. You can cancel anytime.',
      icon: Zap,
    },
  ];

  return (
    <div className="w-full min-h-full bg-[#0a0a0a] px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-10 lg:py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 sm:mb-10 md:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <HelpCircle className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-cyan-400" />
            Help Center
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-400">
            Find answers to common questions about TARS AI
          </p>
        </div>

        {/* Quick Start Guide */}
        <Card className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-cyan-500/30 p-4 sm:p-6 md:p-8 mb-8 sm:mb-10 md:mb-12 rounded-lg sm:rounded-xl">
          <h2 className="text-lg sm:text-2xl md:text-3xl font-semibold text-white mb-4 sm:mb-6">Quick Start Guide</h2>
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
            <div className="flex gap-3 sm:gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 sm:h-10 sm:w-10 rounded-md bg-cyan-500/30 text-cyan-400 text-xs sm:text-sm font-semibold">
                  1
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm sm:text-base mb-1 sm:mb-2">Upload a PDF</h3>
                <p className="text-xs sm:text-sm text-gray-400">
                  Click the + button and select a PDF file (up to 50MB)
                </p>
              </div>
            </div>

            <div className="flex gap-3 sm:gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 sm:h-10 sm:w-10 rounded-md bg-cyan-500/30 text-cyan-400 text-xs sm:text-sm font-semibold">
                  2
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm sm:text-base mb-1 sm:mb-2">Wait for Processing</h3>
                <p className="text-xs sm:text-sm text-gray-400">
                  AI indexes your document (usually under 30 seconds)
                </p>
              </div>
            </div>

            <div className="flex gap-3 sm:gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 sm:h-10 sm:w-10 rounded-md bg-cyan-500/30 text-cyan-400 text-xs sm:text-sm font-semibold">
                  3
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm sm:text-base mb-1 sm:mb-2">Ask Questions</h3>
                <p className="text-xs sm:text-sm text-gray-400">
                  Type your questions and get instant answers
                </p>
              </div>
            </div>

            <div className="flex gap-3 sm:gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 sm:h-10 sm:w-10 rounded-md bg-cyan-500/30 text-cyan-400 text-xs sm:text-sm font-semibold">
                  4
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm sm:text-base mb-1 sm:mb-2">Save Chats</h3>
                <p className="text-xs sm:text-sm text-gray-400">
                  Your conversation history is saved automatically
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* FAQ Section */}
        <div className="mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-lg sm:text-2xl md:text-3xl font-semibold text-white mb-4 sm:mb-6">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="space-y-2 sm:space-y-3">
            {faqItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-[#141414] border-gray-800 rounded-lg border data-[state=open]:border-cyan-500/30 px-3 sm:px-4 md:px-6"
                >
                  <AccordionTrigger className="py-3 sm:py-4 hover:no-underline">
                    <div className="flex items-center gap-2 sm:gap-3 text-left">
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 flex-shrink-0" />
                      <span className="text-xs sm:text-sm md:text-base text-white font-medium">{item.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-gray-400 pb-3 sm:pb-4">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>

        {/* Tips & Tricks */}
        <Card className="bg-[#141414] border-gray-800 p-4 sm:p-6 md:p-8 mb-8 sm:mb-10 md:mb-12 rounded-lg sm:rounded-xl">
          <h2 className="text-lg sm:text-2xl md:text-3xl font-semibold text-white mb-4 sm:mb-6">Tips & Tricks</h2>
          <div className="space-y-3 sm:space-y-4">
            <div>
              <h3 className="font-semibold text-cyan-400 mb-1 sm:mb-2 text-sm sm:text-base">📄 Use descriptive questions</h3>
              <p className="text-xs sm:text-sm text-gray-400">
                Instead of "What's this about?", try "What are the key findings mentioned in chapter 3?"
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-cyan-400 mb-1 sm:mb-2 text-sm sm:text-base">🎯 Ask follow-up questions</h3>
              <p className="text-xs sm:text-sm text-gray-400">
                The AI remembers your conversation context, so you can ask clarifying questions naturally.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-cyan-400 mb-1 sm:mb-2 text-sm sm:text-base">📋 Extract structured data</h3>
              <p className="text-xs sm:text-sm text-gray-400">
                Ask for summaries, bullet points, or specific information extraction from your documents.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-cyan-400 mb-1 sm:mb-2 text-sm sm:text-base">🔍 Reference specific pages</h3>
              <p className="text-xs sm:text-sm text-gray-400">
                Mention page numbers in your questions for more precise answers.
              </p>
            </div>
          </div>
        </Card>

        {/* Support Section */}
        <Card className="bg-[#141414] border-gray-800 p-4 sm:p-6 md:p-8 rounded-lg sm:rounded-xl">
          <h2 className="text-lg sm:text-2xl md:text-3xl font-semibold text-white mb-2 sm:mb-3 md:mb-4">Still need help?</h2>
          <p className="text-xs sm:text-sm md:text-base text-gray-400 mb-4 sm:mb-6">
            Can't find what you're looking for? We're here to help.
          </p>
          <Link
            href="/contact"
            className="inline-block px-4 sm:px-6 py-2 sm:py-3 bg-cyan-500 hover:bg-cyan-600 text-black font-semibold rounded-lg transition-colors text-xs sm:text-sm md:text-base"
          >
            Contact Support
          </Link>
        </Card>
      </div>
    </div>
  );
}
