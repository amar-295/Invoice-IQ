import Link from "next/link";
import PriceChart from "@/components/landing/PriceChart";
import Image from "next/image";

const steps = [
  {
    n: 1,
    title: "Scan Your Bill",
    desc: "Just take a photo of your supplier bill with your phone camera.",
    icon: "photo_camera",
    color: "text-primary",
  },
  {
    n: 2,
    title: "AI Checks Prices",
    desc: "Our AI automatically finds the best rates from different wholesalers.",
    icon: "search_check",
    color: "text-primary",
  },
  {
    n: 3,
    title: "You Save Money",
    desc: "See exactly where you are overpaying and increase your daily profit.",
    icon: "payments",
    color: "text-emerald-500",
  },
];

const footerLinks = [
  {
    heading: "Product",
    links: ["Seller Portal", "AI Insights", "API Access", "Enterprise"],
  },
  { heading: "Company", links: ["About Us", "Careers", "Security", "Legal"] },
  { heading: "Connect", links: ["Twitter", "LinkedIn", "GitHub"] },
];

export default function LandingPage() {
  return (
    <div className="font-outfit text-slate-900 dark:text-slate-100">
      {/* ── HERO ── */}
      <section className="relative pt-28 pb-16 px-6  overflow-hidden bg-[#f6f6f8] dark:bg-[#101622]">
        <div className="max-w-7xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            NEW: AI-POWERED PROCUREMENT INSIGHTS
          </div>

          <h1 className="font-space-grotesk text-5xl md:text-7xl font-black tracking-tight mb-6 bg-clip-text text-transparent bg-linear-to-b from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
            Stop Losing Money to High Prices &amp; Grow Your Profit
          </h1>

          <p className="max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">
            Scan your bills, track your suppliers, and see exactly where you can
            save money. No more manual calculations.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-4 bg-primary text-white font-bold rounded-xl shadow-xl shadow-primary/30 text-lg hover:-translate-y-0.5 transition-all"
            >
              Start Free Trial
            </Link>
            <button className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-slate-100 font-bold rounded-xl text-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
              Book a Demo
            </button>
          </div>

          {/* Dashboard mockup */}
          <div className="relative max-w-5xl mx-auto rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden bg-white dark:bg-slate-900">
            <div className="h-10 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center px-4 gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400/40" />
                <div className="w-3 h-3 rounded-full bg-amber-400/40" />
                <div className="w-3 h-3 rounded-full bg-emerald-400/40" />
              </div>
            </div>
            <div className="relative h-135 w-full hidden md:block">
              <Image
                src="/HeroSectionDarkMode.png"
                alt="Hero Section Image"
                fill
                className="object-cover hidden dark:flex object-top"
                sizes="(max-width: 768px) 100vw, 80vw"
                priority
              />
              <Image
                src="/HeroSectionLightMode.png"
                alt="Hero Section Image"
                fill
                className="object-cover flex dark:hidden object-top"
                sizes="(max-width: 768px) 100vw, 80vw"
                priority
              />
            </div>
            <div className="relative h-135 w-full block md:hidden">
              <Image
                src="/MobileHeroSectionDarkMode.png"
                alt="Hero Section Image"
                fill
                className="object-cover hidden dark:flex object-top"
                sizes="(max-width: 768px) 100vw, 80vw"
                priority
              />
              <Image
                src="/MobileHeroSectionLightMode.png"
                alt="Hero Section Image"
                fill
                className="object-cover flex dark:hidden object-top"
                sizes="(max-width: 768px) 100vw, 80vw"
                priority
              />
            </div>
          </div>
        </div>

        {/* Background blobs */}
        <div className="absolute top-0 -z-10 left-1/2 -translate-x-1/2 w-full h-full opacity-30 dark:opacity-10 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary blur-[120px] rounded-full" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-400 blur-[120px] rounded-full" />
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 bg-white dark:bg-slate-900/50 text-slate-900 dark:text-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-16 items-center">
            {/* Steps */}
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center justify-center p-2 rounded-lg bg-primary/10 text-primary">
                <span className="material-symbols-outlined">how_to_reg</span>
              </div>
              <h2 className="font-space-grotesk text-4xl font-bold tracking-tight">
                How it Works in 3 Simple Steps
              </h2>
              <div className="space-y-8 mt-8">
                {steps.map(({ n, title, desc, icon, color }) => (
                  <div key={n} className="flex gap-4 items-start">
                    <div className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0">
                      {n}
                    </div>
                    <div>
                      <h3 className="font-space-grotesk text-xl font-bold">
                        {title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400">
                        {desc}
                      </p>
                      <span
                        className={`material-symbols-outlined ${color} mt-2 block`}
                      >
                        {icon}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Alert cards */}
            <div className="flex-1 w-full space-y-4">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
                <div className="p-3 bg-red-100 text-red-600 rounded-full">
                  <span className="material-symbols-outlined">trending_up</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-500">
                    Price Hike Alert
                  </p>
                  <p className="font-space-grotesk text-lg font-bold dark:text-slate-100">
                    Milk price increased by ₹2
                  </p>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
                <div className="p-3 bg-emerald-100 text-emerald-600 rounded-full">
                  <span className="material-symbols-outlined">savings</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-500">
                    Extra Profit Found
                  </p>
                  <p className="text-lg font-bold text-emerald-600">
                    Save ₹450 on Oil today
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICE HISTORY (client component) ── */}
      <section className="py-24 bg-[#f6f6f8] dark:bg-[#101622]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-space-grotesk text-4xl font-bold tracking-tight mb-4">
              Track Price Trends Over Time
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
              See price history for every item and every supplier — predict
              spikes and negotiate better.
            </p>
          </div>
          <PriceChart />
        </div>
      </section>

      {/* ── COMPARE SUPPLIERS ── */}
      <section className="py-24 bg-white dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row-reverse gap-16 items-center">
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center justify-center p-2 rounded-lg bg-primary/10 text-primary">
                <span className="material-symbols-outlined">
                  compare_arrows
                </span>
              </div>
              <h2 className="font-space-grotesk text-4xl font-bold tracking-tight">
                Compare Wholesale Rates
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                Instantly see who gives you the best deal. Switch suppliers with
                confidence and never overpay again.
              </p>
            </div>

            {/* Supplier table */}
            <div className="flex-1 relative">
              <div className="glass-card rounded-2xl p-6 shadow-2xl relative z-10">
                <table className="w-full text-left text-sm text-slate-700 dark:text-slate-200">
                  <thead className="border-b border-slate-100 dark:border-slate-800">
                    <tr>
                      <th className="py-3 font-bold">Supplier</th>
                      <th className="py-3 font-bold">Your Price</th>
                      <th className="py-3 font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-50 dark:border-slate-800/50">
                      <td className="py-4">Local Mandi</td>
                      <td className="py-4 font-mono text-emerald-500">
                        ₹42/unit
                      </td>
                      <td className="py-4">
                        <span className="text-emerald-500 font-bold">
                          Best Price
                        </span>
                      </td>
                    </tr>
                    <tr className="border-b border-slate-50 dark:border-slate-800/50">
                      <td className="py-4">City Wholesalers</td>
                      <td className="py-4 font-mono text-amber-500">
                        ₹45/unit
                      </td>
                      <td className="py-4">
                        <span className="text-red-500 font-bold">
                          Overpaying
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-4">SwiftSupply Co.</td>
                      <td className="py-4 font-mono text-red-500">₹64/unit</td>
                      <td className="py-4">
                        <div className="flex text-amber-400">
                          <span
                            className="material-symbols-outlined"
                            style={{ fontSize: "16px" }}
                          >
                            star
                          </span>
                          <span
                            className="material-symbols-outlined"
                            style={{ fontSize: "16px" }}
                          >
                            star
                          </span>
                          <span
                            className="material-symbols-outlined"
                            style={{ fontSize: "16px" }}
                          >
                            star_half
                          </span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="absolute -bottom-10 -right-10 w-full h-full bg-primary/5 rounded-2xl -z-10 rotate-3 border border-primary/10" />
            </div>
          </div>
        </div>
      </section>

      {/* ── AI INSIGHTS ── */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 text-primary font-bold">
                <span className="material-symbols-outlined">psychology</span>
                <span>Powered by Llama 3 &amp; GPT-4o</span>
              </div>
              <h2 className="font-space-grotesk text-5xl font-bold leading-tight">
                Your Personal Profit Assistant
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                Our smart assistant looks at your bills and tells you exactly
                where you can save. It&apos;s like having a business manager in
                your pocket.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                  <h4 className="font-space-grotesk font-bold mb-2">
                    Inventory Prediction
                  </h4>
                  <p className="text-sm text-slate-400">
                    Know what to stock before you run out, based on your
                    purchase patterns.
                  </p>
                </div>
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                  <h4 className="font-space-grotesk font-bold mb-2">
                    Cost Optimization
                  </h4>
                  <p className="text-sm text-slate-400">
                    Automatically surface the cheapest option for every item you
                    buy.
                  </p>
                </div>
              </div>
            </div>

            {/* AI Chat mockup */}
            <div className="bg-primary/20 p-2 rounded-3xl border border-primary/30 backdrop-blur-sm">
              <div className="bg-slate-900 rounded-2xl p-8 space-y-6">
                <div className="flex items-center gap-4 border-b border-white/10 pb-6">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">
                      auto_awesome
                    </span>
                  </div>
                  <div>
                    <h4 className="font-space-grotesk font-bold">
                      AI Assistant
                    </h4>
                    <span className="text-xs text-emerald-400 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />{" "}
                      Online
                    </span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-white/5 p-4 rounded-xl rounded-tl-none mr-12 text-sm text-slate-300">
                    I found that City Wholesalers is charging you ₹3 more for
                    Rice than the local Mandi. Want me to mark them as
                    &apos;Expensive&apos;?
                  </div>
                  <div className="bg-primary p-4 rounded-xl rounded-tr-none ml-12 text-sm text-white text-right font-medium">
                    Yes, also alert me when Cooking Oil prices drop below ₹150.
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl rounded-tl-none mr-12 text-sm text-slate-300 italic">
                    Done! I&apos;ll notify you when Oil prices drop. Currently
                    tracking 3 suppliers for the best rate.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(19,91,236,0.15),transparent)]" />
      </section>

      {/* ── CTA ── */}
      <section className="py-24 bg-[#f6f6f8] dark:bg-[#101622] text-slate-900 dark:text-slate-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-space-grotesk text-4xl font-bold mb-6">
            Start Making More Profit Today
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg mb-10">
            Join hundreds of Kirana shop owners who are using Invoice IQ to grow
            their business.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              className="w-full sm:w-auto px-10 py-5 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/30 text-lg hover:scale-105 transition-all"
            >
              Try it Now
            </Link>
            <button className="w-full sm:w-auto px-10 py-5 bg-transparent border-2 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-bold rounded-2xl text-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
              Talk to Sales
            </button>
          </div>
          <p className="mt-6 text-sm text-slate-500">
            No credit card required. Cancel anytime.
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-white dark:bg-[#101622] text-slate-900 dark:text-slate-100 border-t border-slate-200 dark:border-slate-800 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-primary p-1 rounded text-white">
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: "18px" }}
                  >
                    account_balance_wallet
                  </span>
                </div>
                <h2 className="font-space-grotesk text-lg font-bold tracking-tight">
                  Invoice IQ
                </h2>
              </div>
              <p className="text-slate-500 text-sm max-w-xs leading-relaxed">
                The simplest way for Indian retail shops to track bills and grow
                profits. Made for Kirana store owners.
              </p>
            </div>

            {footerLinks.map(({ heading, links }) => (
              <div key={heading}>
                <h4 className="font-space-grotesk font-bold mb-6">{heading}</h4>
                <ul className="space-y-4 text-sm text-slate-500">
                  {links.map((item) => (
                    <li key={item}>
                      <Link
                        href="#"
                        className="hover:text-primary transition-colors"
                      >
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-16 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-400">
            <p>© 2026 Invoice IQ Inc. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-slate-600 transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-slate-600 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
