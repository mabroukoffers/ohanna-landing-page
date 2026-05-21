import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import WaveDivider from "@/components/ui/wave-divider";

const FAQ_CATEGORIES = [
  {
    category: "ORDERS & PAYMENTS",
    items: [
      { q: "What payment methods do you accept?", a: "We accept all major credit/debit cards (Visa, Mastercard), PayPal, Fawry, and cash on delivery within Egypt." },
      { q: "Can I change or cancel my order?", a: "Orders can be modified or cancelled within 2 hours of placement. Contact us immediately at support@ohanna.store." },
      { q: "Is my payment information secure?", a: "All payments are processed by Stripe. We never store your card details." },
    ],
  },
  {
    category: "SHIPPING & DELIVERY",
    items: [
      { q: "How long does delivery take within Egypt?", a: "Standard delivery within Cairo/Giza takes 2–3 business days. Other governorates take 4–6 business days." },
      { q: "Do you ship internationally?", a: "Yes, we ship to Saudi Arabia, UAE, Kuwait, Qatar, Bahrain, and Jordan. International orders take 7–14 business days." },
      { q: "How much does shipping cost?", a: "Free shipping on orders above EGP 1,500 within Egypt. Standard shipping costs EGP 50–80 depending on governorate." },
    ],
  },
  {
    category: "RETURNS & EXCHANGES",
    items: [
      { q: "What is your return policy?", a: "We accept returns within 14 days of delivery for unworn, unwashed items with original tags attached." },
      { q: "How do I initiate a return?", a: "Email returns@ohanna.store with your order ID and reason for return. We'll guide you through the process." },
      { q: "Do you offer exchanges?", a: "Yes! We exchange for different sizes or colors within 14 days. Availability depends on current stock." },
    ],
  },
];

function FAQItem({ item }: { item: { q: string; a: string } }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#1B1B1B]/8 dark:border-[#FDF8EF]/8 last:border-0">
      <button onClick={() => setOpen(!open)} className="w-full text-left py-4 flex items-center justify-between gap-4 hover:text-[#C89D29] transition-colors group section-heading" aria-expanded={open}>
        <span className="font-semibold text-sm leading-snug">{item.q}</span>
        {open ? <ChevronUp className="h-4 w-4 shrink-0 text-[#C89D29]" /> : <ChevronDown className="h-4 w-4 shrink-0 section-faint group-hover:text-[#C89D29] transition-colors" />}
      </button>
      {open && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="pb-4 text-sm section-muted leading-relaxed overflow-hidden">
          {item.a}
        </motion.div>
      )}
    </div>
  );
}

export default function FAQPage() {
  return (
    <div className="min-h-screen section-paper flex flex-col">
      <Navbar />

      {/* ── HEADER ── */}
      <section className="py-16 section-sand">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-6xl font-black hieroglyph-font mb-4 section-heading">
            FREQUENTLY ASKED <span className="text-[#C89D29]">QUESTIONS</span>
          </h1>
        </div>
      </section>

      {/* Wave: Header → Content */}
      <WaveDivider from="sand" to="paper" variant={3} />

      {/* ── FAQ CONTENT ── */}
      <main className="flex-1 py-12 section-paper">
        <div className="container mx-auto px-4 max-w-3xl space-y-10">
          {FAQ_CATEGORIES.map((cat, i) => (
            <div key={i}>
              <h2 className="font-black hieroglyph-font text-xs text-[#C89D29] tracking-widest mb-4">{cat.category}</h2>
              <div className="ohanna-card p-4">
                {cat.items.map((item, j) => (
                  <FAQItem key={j} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Wave: Content → Footer */}
      <WaveDivider from="paper" to="ink" variant={5} />

      <Footer />
    </div>
  );
}
