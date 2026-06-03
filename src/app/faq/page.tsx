"use client";

import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { useState } from "react";
import { FaChevronDown, FaQuestionCircle } from "react-icons/fa";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  title: string;
  items: FAQItem[];
}

export default function FAQPage() {
  const faqData: FAQCategory[] = [
    {
      title: "Orders & Shipping",
      items: [
        {
          question: "Do you ship live plants safely?",
          answer: "Yes! We have specially designed, eco-friendly breathable packaging that keeps the plant secure and well-ventilated during transport. We guarantee that your plants will arrive in healthy condition."
        },
        {
          question: "How long does shipping take?",
          answer: "Orders are processed within 1-2 business days. Shipping usually takes 3-5 business days depending on your location. We provide tracking details once the order leaves our Kolkata nursery."
        },
        {
          question: "What is your return policy?",
          answer: "Live plants cannot be returned, but if your plant arrives damaged or unhealthy, send us a photo within 48 hours of delivery at gogreen.nursery20@gmail.com and we will send a free replacement."
        }
      ]
    },
    {
      title: "Plant Care",
      items: [
        {
          question: "How often should I water my indoor plants?",
          answer: "Most indoor plants prefer their soil to dry out slightly between waterings. A good rule of thumb is to water when the top 1-2 inches of soil feels dry. Overwatering is the most common cause of plant issues!"
        },
        {
          question: "What light conditions do my plants need?",
          answer: "Different plants have different needs. Monstera and Fiddle Leaf Fig prefer bright, indirect light. Snake Plants and ZZ Plants can tolerate lower light levels. Check each product detail page for specific guidelines."
        },
        {
          question: "Are your plants pet-friendly?",
          answer: "Some plants (like the Peace Lily and Monstera) are toxic to cats and dogs if ingested. Others (like Ferns and Palms) are completely safe. We indicate toxicities on each product detail page."
        }
      ]
    },
    {
      title: "Payments & Accounts",
      items: [
        {
          question: "What payment methods do you accept?",
          answer: "We support major credit/debit cards, Netbanking, UPI, and wallets via our secure Razorpay integration. If Razorpay is not fully configured, our site defaults to a simulated/mock checkout for easy ordering."
        },
        {
          question: "Do I need an account to place an order?",
          answer: "Yes, creating an account helps you track your order status, view your full order history, and manage your shipping address details."
        }
      ]
    }
  ];

  const [activeCategory, setActiveCategory] = useState(0);
  const [openIndexes, setOpenIndexes] = useState<Record<string, boolean>>({ "0-0": true });

  const toggleAccordion = (catIdx: number, itemIdx: number) => {
    const key = `${catIdx}-${itemIdx}`;
    setOpenIndexes((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-brand-hero min-h-screen pt-28 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-secondary italic mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-text-dark/70 text-lg">
              Find quick answers to common questions about our products, live plant shipping, and plant care.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex justify-center flex-wrap gap-3 mb-10">
            {faqData.map((category, idx) => (
              <button
                key={idx}
                onClick={() => setActiveCategory(idx)}
                className={`px-6 py-3 rounded-full font-bold text-sm transition-all shadow-sm ${
                  activeCategory === idx 
                    ? "bg-brand-secondary text-white scale-105" 
                    : "bg-white text-brand-secondary hover:bg-brand-hero hover:scale-102 border border-brand/5"
                }`}
              >
                {category.title}
              </button>
            ))}
          </div>

          {/* Accordion Questions */}
          <div className="space-y-4 bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-brand/5">
            <h2 className="text-2xl font-serif font-bold text-brand-secondary mb-6 flex items-center gap-2">
              <span className="text-xl"><FaQuestionCircle /></span>
              {faqData[activeCategory].title}
            </h2>
            
            <div className="space-y-4">
              {faqData[activeCategory].items.map((item, idx) => {
                const key = `${activeCategory}-${idx}`;
                const isOpen = !!openIndexes[key];
                return (
                  <div 
                    key={idx}
                    className="border-b border-brand/5 last:border-0 pb-4 last:pb-0"
                  >
                    <button
                      onClick={() => toggleAccordion(activeCategory, idx)}
                      className="w-full flex items-center justify-between text-left font-bold text-lg text-text-dark hover:text-brand-secondary transition-colors py-3"
                    >
                      <span>{item.question}</span>
                      <span className={`text-brand-secondary transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
                        <FaChevronDown />
                      </span>
                    </button>
                    
                    {/* Collapsible Answer */}
                    <div 
                      className={`overflow-hidden transition-all duration-300 ${
                        isOpen ? "max-h-60 mt-2" : "max-h-0"
                      }`}
                    >
                      <p className="text-text-dark/70 text-sm leading-relaxed whitespace-pre-wrap pl-1 pb-2">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-12 text-center bg-brand-secondary text-white p-8 rounded-3xl shadow-lg">
            <h3 className="text-xl font-bold mb-2">Still have questions?</h3>
            <p className="text-white/80 text-sm mb-6 max-w-md mx-auto">
              Our support team is always here to help you select the best plants and troubleshoot care issues.
            </p>
            <a 
              href="/contact" 
              className="inline-block bg-white text-brand-secondary px-6 py-3 rounded-xl font-bold hover:bg-brand-hero transition-colors shadow-md"
            >
              Contact Support
            </a>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
