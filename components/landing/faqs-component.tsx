'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import Link from 'next/link'

export default function FAQs() {
    const faqItems = [
        {
            id: 'item-1',
            question: 'How does TARS AI work?',
            answer:
                'Upload any PDF and start asking questions. TARS AI reads, analyzes, and understands your document, then gives accurate, context-aware answers instantly — just like chatting with a human expert.',
        },
        {
            id: 'item-2',
            question: 'Is my data and PDF secure?',
            answer:
                'Yes. All files are encrypted, processed securely, and never used to train any models. Your documents remain private and are deleted automatically unless you save them.',
        },
        {
            id: 'item-3',
            question: 'What types of PDFs can I upload?',
            answer:
                'You can upload research papers, legal documents, assignments, contracts, reports, eBooks, manuals, and more. TARS AI handles both text-based and scanned PDFs.',
        },
        {
            id: 'item-4',
            question: 'Is there a free plan available?',
            answer:
                'Yes, TARS AI offers a free plan where you can chat with one PDF per day with limited questions. It’s perfect for testing the experience before upgrading.',
        },
        {
            id: 'item-5',
            question: 'What do I get with the Pro plan?',
            answer:
                'Pro gives you unlimited PDFs, unlimited questions, document summaries, faster responses, saved chats, and priority support — ideal for students, researchers, and professionals.',
        },
        {
            id: 'item-6',
            question: 'Can I use TARS AI for my team or organization?',
            answer:
                'Absolutely. Our Enterprise plan includes team workspaces, admin controls, custom PDF limits, private deployments, and integration options like API or SSO.',
        },
    ];


    return (
   <section className="bg-black py-16 md:py-24">
      {/* CHANGE: Added mobile-first padding 'px-6' */}
      <div className="mx-auto max-w-5xl px-6 md:px-6">
        <div className="">
          <Accordion
            type="single"
            collapsible
           
            className="bg-black rounded-lg w-full px-4 md:px-8 py-3"
          >
            {faqItems.map((item) => (
              <AccordionItem
                key={item.id}
                value={item.id}
                /* CHANGE: Clarified border style and removed the last border. 
                  Kept 'border-dotted' as you had it.
                */
                className="border-b border-dotted border-zinc-700 last:border-b-0"
              >
                <AccordionTrigger
                  
                  className="cursor-pointer py-4 text-left text-sm font-medium hover:no-underline md:text-base"
                >
             
                  {item.question}
                </AccordionTrigger>
                <AccordionContent>
              
                  <p className="pb-4 text-sm text-muted-foreground md:text-base">
                    {item.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

        
          <p className="mt-6 text-center text-sm text-muted-foreground md:text-base">
            Can't find what you're looking for? Contact us{" "}
            <Link
              href="#"
              className="font-medium text-primary hover:underline"
            >
              customer support team
            </Link>
          </p>
        </div>
      </div>
    </section>
    )
}