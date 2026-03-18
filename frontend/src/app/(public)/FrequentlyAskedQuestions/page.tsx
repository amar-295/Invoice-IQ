import Link from "next/link";

const faqGroups = [
  {
    title: "General",
    items: [
      {
        question: "What is Invoice IQ?",
        answer:
          "Invoice IQ is an AI-powered purchase and invoice intelligence platform that helps you record, organize, and analyze purchases from multiple suppliers in one place.",
      },
      {
        question: "Who can use Invoice IQ?",
        answer:
          "Invoice IQ is useful for small businesses, distributors, shop owners, and individuals who need better visibility into purchase spending and supplier pricing.",
      },
      {
        question: "Why not use spreadsheets for this?",
        answer:
          "Spreadsheets require manual updates and often miss trends. Invoice IQ automates structuring, tracks price movement, and highlights actionable insights without extra effort.",
      },
    ],
  },
  {
    title: "Data Entry and AI",
    items: [
      {
        question: "How can I add purchase data?",
        answer:
          "You can add data using manual entry, by uploading invoice photos for OCR extraction, or by describing purchases in natural language for AI-based structuring.",
      },
      {
        question: "How accurate is OCR extraction?",
        answer:
          "OCR works best with clear, well-lit invoice images. You can always review and edit extracted values before saving them to keep records accurate.",
      },
      {
        question: "Can non-technical users use the AI prompt input?",
        answer:
          "Yes. The prompt interface is designed for plain language, so users can describe purchases normally and let AI convert the text into structured fields.",
      },
    ],
  },
  {
    title: "Insights and Analytics",
    items: [
      {
        question: "What kind of analytics does Invoice IQ provide?",
        answer:
          "You get metrics such as total spending, monthly trends, supplier activity, product-wise history, and alerts for unusual pricing changes.",
      },
      {
        question: "How does price change tracking work?",
        answer:
          "Invoice IQ compares current and historical purchase records for each supplier-product pair to detect increases and decreases over time.",
      },
      {
        question: "Can I compare suppliers before reordering?",
        answer:
          "Yes. You can review supplier-wise rates and historical trends to choose better vendors and avoid overpaying.",
      },
    ],
  },
  {
    title: "Security and Platform",
    items: [
      {
        question: "Where is my data stored?",
        answer:
          "Your purchase and invoice data is stored in MongoDB, allowing scalable and fast access as your records grow.",
      },
      {
        question: "Is Invoice IQ built for growth?",
        answer:
          "Yes. The platform uses a modern SaaS architecture with modular backend services, AI processing layers, and flexible storage design.",
      },
      {
        question: "Where should I start after signup?",
        answer:
          "Start by adding a few recent invoices, then explore supplier pages and analytics dashboards to identify quick savings opportunities.",
      },
    ],
  },
];

export default function FrequentlyAskedQuestionsPage() {
  return (
    <main className="font-outfit text-slate-900 dark:text-slate-100 bg-[#f6f7fb] dark:bg-[#0f172a] min-h-screen">
      <section className="px-6 pt-32 pb-14">
        <div className="max-w-5xl mx-auto text-center">
          <p className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-xs font-semibold text-primary">
            HELP CENTER
          </p>
          <h1 className="mt-6 font-space-grotesk text-4xl md:text-6xl font-black tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="mt-5 max-w-3xl mx-auto text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Find answers about features, data entry methods, analytics, and how
            Invoice IQ helps you make smarter supplier decisions.
          </p>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="max-w-5xl mx-auto space-y-8">
          {faqGroups.map((group) => (
            <article
              key={group.title}
              className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 md:p-8"
            >
              <h2 className="font-space-grotesk text-2xl md:text-3xl font-bold tracking-tight">
                {group.title}
              </h2>
              <div className="mt-5 space-y-4">
                {group.items.map((item) => (
                  <details
                    key={item.question}
                    className="group rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-4 open:bg-white dark:open:bg-slate-800"
                  >
                    <summary className="cursor-pointer list-none font-semibold flex items-start justify-between gap-4">
                      <span>{item.question}</span>
                      <span className="material-symbols-outlined text-primary transition-transform group-open:rotate-45">
                        add
                      </span>
                    </summary>
                    <p className="mt-3 text-sm md:text-base leading-relaxed text-slate-600 dark:text-slate-300">
                      {item.answer}
                    </p>
                  </details>
                ))}
              </div>
            </article>
          ))}

          <div className="rounded-2xl bg-slate-900 text-white p-8 text-center">
            <h3 className="font-space-grotesk text-2xl font-bold">
              Need a quick product walkthrough?
            </h3>
            <p className="mt-3 text-slate-300">
              Explore our Services page to understand how data capture, OCR, AI,
              and analytics work together.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/Services"
                className="w-full sm:w-auto rounded-xl bg-primary px-7 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                View Services
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto rounded-xl border border-white/20 bg-white/10 px-7 py-3 font-semibold text-white transition hover:bg-white/15"
              >
                Try Invoice IQ
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
