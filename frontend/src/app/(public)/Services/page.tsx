import Link from "next/link";

const serviceCards = [
  {
    title: "Manual Purchase Entry",
    description:
      "Add invoices in seconds with a clean form for supplier, product, quantity, and price details.",
    icon: "edit_document",
  },
  {
    title: "Invoice Photo OCR",
    description:
      "Upload bill photos and let OCR extract line items automatically into structured purchase records.",
    icon: "document_scanner",
  },
  {
    title: "AI Natural Language Input",
    description:
      "Type purchase details in plain language and AI converts them into normalized database entries.",
    icon: "auto_awesome",
  },
  {
    title: "Supplier Intelligence",
    description:
      "Track supplier activity, compare rates, and identify who consistently gives the best value.",
    icon: "storefront",
  },
  {
    title: "Price Change Detection",
    description:
      "Instantly detect product-level price increases and decreases using historical purchase comparisons.",
    icon: "monitoring",
  },
  {
    title: "Analytics Dashboard",
    description:
      "Monitor monthly spend, purchase trends, active suppliers, and product history in one view.",
    icon: "analytics",
  },
];

const flowSteps = [
  {
    title: "Capture Purchase Data",
    description:
      "Record transactions through manual entry, photo upload, or AI prompts based on what is easiest in the moment.",
  },
  {
    title: "Normalize and Organize",
    description:
      "Invoice IQ structures every purchase by supplier and product so your data is searchable and clean.",
  },
  {
    title: "Analyze and Act",
    description:
      "Use trend charts and pricing insights to reduce costs, negotiate better, and avoid overpaying.",
  },
];

const highlights = [
  "Complete supplier-wise and product-wise purchase history",
  "Monthly spending trends and purchase behavior tracking",
  "Price alerts for unusual increases and high-risk suppliers",
  "Scalable architecture with AI, OCR, and MongoDB",
];

export default function ServicesPage() {
  return (
    <main className="font-outfit text-slate-900 dark:text-slate-100 bg-[#f6f7fb] dark:bg-[#0f172a] min-h-screen">
      <section className="relative overflow-hidden px-6 pt-32 pb-20">
        <div className="max-w-6xl mx-auto text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-xs font-semibold tracking-wide text-primary">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            AI-POWERED PURCHASE INTELLIGENCE
          </p>

          <h1 className="mt-6 font-space-grotesk text-4xl md:text-6xl font-black leading-tight tracking-tight">
            Services Built for Smart Invoice and Purchase Management
          </h1>

          <p className="mt-6 max-w-3xl mx-auto text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Invoice IQ transforms invoices into actionable insights. Capture
            purchase data quickly, store it in a structured system, and use
            analytics to track suppliers, detect price changes, and make better
            buying decisions.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              className="w-full sm:w-auto rounded-xl bg-primary px-7 py-3 text-white font-semibold shadow-lg shadow-primary/20 transition hover:-translate-y-0.5"
            >
              Get Started
            </Link>
            <Link
              href="/FrequentlyAskedQuestions"
              className="w-full sm:w-auto rounded-xl border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/60 px-7 py-3 font-semibold transition hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Read FAQs
            </Link>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0 -z-10 opacity-30 dark:opacity-25">
          <div className="absolute left-[8%] top-[14%] h-64 w-64 rounded-full bg-blue-400 blur-3xl" />
          <div className="absolute right-[10%] bottom-[8%] h-72 w-72 rounded-full bg-cyan-300 blur-3xl" />
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10 flex items-end justify-between gap-4">
            <h2 className="font-space-grotesk text-3xl md:text-4xl font-bold tracking-tight">
              What We Offer
            </h2>
            <p className="text-sm md:text-base text-slate-500 dark:text-slate-400">
              Everything you need from invoice to insight
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {serviceCards.map((service) => (
              <article
                key={service.title}
                className="rounded-2xl border border-slate-200/80 dark:border-slate-700/70 bg-white/90 dark:bg-slate-900/70 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <span className="material-symbols-outlined text-primary">
                  {service.icon}
                </span>
                <h3 className="mt-4 font-space-grotesk text-xl font-bold">
                  {service.title}
                </h3>
                <p className="mt-2 text-sm md:text-base leading-relaxed text-slate-600 dark:text-slate-300">
                  {service.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-8 md:p-12 shadow-sm">
          <h2 className="font-space-grotesk text-3xl md:text-4xl font-bold tracking-tight">
            How Invoice IQ Works
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {flowSteps.map((step, index) => (
              <div
                key={step.title}
                className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-5"
              >
                <p className="text-xs font-semibold tracking-wider text-primary">
                  STEP {index + 1}
                </p>
                <h3 className="mt-2 font-space-grotesk text-xl font-bold">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-start">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-7 md:p-8">
            <h2 className="font-space-grotesk text-3xl font-bold tracking-tight">
              Why Teams Choose Invoice IQ
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-300 leading-relaxed">
              From local shops to growing businesses, Invoice IQ centralizes
              every purchase touchpoint so decisions are based on facts, not
              guesswork.
            </p>
            <ul className="mt-6 space-y-3">
              {highlights.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-sm md:text-base text-slate-700 dark:text-slate-200"
                >
                  <span
                    className="material-symbols-outlined text-stable"
                    style={{ fontSize: "18px" }}
                  >
                    check_circle
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-linear-to-br from-primary/10 to-cyan-400/10 dark:from-primary/20 dark:to-cyan-600/20 p-7 md:p-8">
            <h3 className="font-space-grotesk text-2xl font-bold tracking-tight">
              Tech That Powers the Platform
            </h3>
            <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg bg-white/80 dark:bg-slate-900/70 p-3">
                OCR Extraction Engine
              </div>
              <div className="rounded-lg bg-white/80 dark:bg-slate-900/70 p-3">
                AI Data Structuring
              </div>
              <div className="rounded-lg bg-white/80 dark:bg-slate-900/70 p-3">
                MongoDB Storage
              </div>
              <div className="rounded-lg bg-white/80 dark:bg-slate-900/70 p-3">
                Trend Analytics Layer
              </div>
            </div>
            <p className="mt-5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Designed with modern SaaS architecture for performance,
              scalability, and reliable growth as your data increases.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="max-w-5xl mx-auto rounded-3xl bg-slate-900 text-white p-8 md:p-12 text-center">
          <h2 className="font-space-grotesk text-3xl md:text-4xl font-bold">
            Move From Manual Records to Intelligent Purchasing
          </h2>
          <p className="mt-4 max-w-3xl mx-auto text-slate-300 leading-relaxed">
            Stop relying on scattered bills and memory-based tracking. Start
            using structured data, live analytics, and AI suggestions to improve
            every purchase.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              className="w-full sm:w-auto rounded-xl bg-primary px-8 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Start Using Invoice IQ
            </Link>
            <Link
              href="/FrequentlyAskedQuestions"
              className="w-full sm:w-auto rounded-xl border border-white/20 bg-white/10 px-8 py-3 font-semibold text-white transition hover:bg-white/15"
            >
              See Frequently Asked Questions
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
