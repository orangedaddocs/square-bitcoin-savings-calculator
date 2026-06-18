import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeDollarSign,
  Bitcoin,
  Check,
  CircleDollarSign,
  ExternalLink,
  QrCode,
  ReceiptText,
  ShieldCheck
} from "lucide-react";
import {
  BITCOIN_TRANSACTION_CAP,
  calculateFees,
  calculateHorizonSavings,
  formatMoney,
  formatVisits
} from "./calculator";
import { articleParagraphs, resourceLinks } from "./content";
import {
  FEEDBACK_EMAIL,
  GITHUB_REPO_URL,
  QR_IMAGE_PATH
} from "./links";
import "./styles.css";

type Route = "calculator" | "why-bitcoin";
type Panel = "numbers" | "qr";
type PurchaseMode = "repeat" | "single";

const frequencyPresets = [
  { label: "Monthly", visits: 1 },
  { label: "Weekly", visits: 4.33 },
  { label: "2x/week", visits: 8.66 },
  { label: "Daily", visits: 22 }
];

function getRoute(): Route {
  return window.location.hash === "#/why-bitcoin" ? "why-bitcoin" : "calculator";
}

function navigate(route: Route) {
  window.location.hash = route === "calculator" ? "#/" : "#/why-bitcoin";
}

export default function App() {
  const [route, setRoute] = useState<Route>(getRoute);

  useEffect(() => {
    const handleHashChange = () => setRoute(getRoute());
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [route]);

  return (
    <div className="shell">
      <header className="topbar" aria-label="Primary">
        <button className="brand" onClick={() => navigate("calculator")}>
          <span className="brand-mark">₿</span>
          <span>
            <strong>Square Bitcoin</strong>
            <small>Savings calculator</small>
          </span>
        </button>
        <nav className="nav-pills" aria-label="Pages">
          <button
            className={route === "calculator" ? "active" : ""}
            onClick={() => navigate("calculator")}
          >
            Calculator
          </button>
          <button
            className={route === "why-bitcoin" ? "active" : ""}
            onClick={() => navigate("why-bitcoin")}
          >
            Why Bitcoin?
          </button>
        </nav>
      </header>
      {route === "why-bitcoin" ? <ArticlePage /> : <CalculatorPage />}
      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <span>v1.0. Feedback welcome.</span>
      <a href={GITHUB_REPO_URL} target="_blank" rel="noreferrer">
        GitHub repo
      </a>
      <a href={`mailto:${FEEDBACK_EMAIL}`}>{FEEDBACK_EMAIL}</a>
    </footer>
  );
}

function CalculatorPage() {
  const [ticketInput, setTicketInput] = useState("10");
  const [visitsPerMonth, setVisitsPerMonth] = useState(8.66);
  const [panel, setPanel] = useState<Panel>("numbers");
  const [purchaseMode, setPurchaseMode] = useState<PurchaseMode>("repeat");
  const ticket = Number(ticketInput);
  const fees = useMemo(() => calculateFees(ticket), [ticket]);
  const horizon = useMemo(
    () => calculateHorizonSavings(ticket, visitsPerMonth),
    [ticket, visitsPerMonth]
  );

  return (
    <main className="calculator-grid">
      <section className="workspace" aria-label="Savings calculator">
        <div className="input-panel">
          <div className="mode-tabs" role="tablist" aria-label="Purchase type">
            <button
              role="tab"
              aria-selected={purchaseMode === "repeat"}
              className={purchaseMode === "repeat" ? "active" : ""}
              onClick={() => setPurchaseMode("repeat")}
            >
              Repeat visits
            </button>
            <button
              role="tab"
              aria-selected={purchaseMode === "single"}
              className={purchaseMode === "single" ? "active" : ""}
              onClick={() => setPurchaseMode("single")}
            >
              One purchase
            </button>
          </div>

          <label className="amount-label" htmlFor="ticket">
            Order total
            {purchaseMode === "single" ? (
              <span>Bitcoin Payments are currently capped at $600 per transaction.</span>
            ) : null}
          </label>
          <div className="amount-control">
            <span>$</span>
            <input
              id="ticket"
              inputMode="decimal"
              min="0"
              max={BITCOIN_TRANSACTION_CAP}
              value={ticketInput}
              onChange={(event) => setTicketInput(event.target.value)}
              aria-describedby="ticket-note"
            />
          </div>
          <p id="ticket-note" className="field-note">
            {ticket > BITCOIN_TRANSACTION_CAP
              ? `Using ${formatMoney(BITCOIN_TRANSACTION_CAP)} for Bitcoin math.`
              : "Try a coffee, burrito, a beer, whatever."}
          </p>

          {purchaseMode === "repeat" ? (
            <>
              <div className="frequency-head">
                <label htmlFor="frequency">Customer visits</label>
                <span>{formatVisits(visitsPerMonth)} / month</span>
              </div>
              <div className="preset-grid" aria-label="Frequency presets">
                {frequencyPresets.map((preset) => (
                  <button
                    key={preset.label}
                    className={Math.abs(visitsPerMonth - preset.visits) < 0.01 ? "active" : ""}
                    onClick={() => setVisitsPerMonth(preset.visits)}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
              <input
                id="frequency"
                className="frequency-range"
                type="range"
                min="0"
                max="30"
                step="0.25"
                value={visitsPerMonth}
                onChange={(event) => setVisitsPerMonth(Number(event.target.value))}
              />
            </>
          ) : (
            <div className="single-note">
              Good for a bag of beans, a farmers market sale, or any one order at the counter.
            </div>
          )}
        </div>

        <div className="panel-toggle" role="tablist" aria-label="Calculator panel">
          <button
            role="tab"
            aria-selected={panel === "numbers"}
            className={panel === "numbers" ? "active" : ""}
            onClick={() => setPanel("numbers")}
          >
            <ReceiptText size={18} /> Numbers
          </button>
          <button
            role="tab"
            aria-selected={panel === "qr"}
            className={panel === "qr" ? "active" : ""}
            onClick={() => setPanel("qr")}
          >
            <QrCode size={18} /> QR
          </button>
        </div>

        {panel === "numbers" ? (
          purchaseMode === "repeat" ? (
            <SavingsResults fees={fees} horizon={horizon} />
          ) : (
            <SinglePurchaseResults fees={fees} />
          )
        ) : (
          <QrPanel />
        )}
      </section>

      <section className="hero-copy" aria-labelledby="calculator-title">
        <p className="eyebrow">Accept Bitcoin on Square</p>
        <h1 id="calculator-title">
          Here's what you save when you turn on bitcoin payments.
        </h1>
        <p className="lede">
          The customer pays a small transaction fee and you pay nothing in 2026.
        </p>
        <div className="proof-row" aria-label="Payment facts">
          <span>
            <Check size={16} /> 0% in 2026
          </span>
          <span>
            <BadgeDollarSign size={16} /> 1% in 2027
          </span>
          <span>
            <ShieldCheck size={16} /> No chargebacks
          </span>
        </div>
      </section>
    </main>
  );
}

function SinglePurchaseResults({ fees }: { fees: ReturnType<typeof calculateFees> }) {
  return (
    <section className="results" aria-label="Single purchase savings">
      <div className="big-number">
        <span>This purchase saves</span>
        <strong>{formatMoney(fees.saveNow)}</strong>
        <p>
          On one {formatMoney(fees.ticket)} order in 2026, the card fee is{" "}
          {formatMoney(fees.cardFee)} and the Bitcoin fee is {formatMoney(fees.bitcoinFeeNow)}.
        </p>
      </div>

      <div className="metric-grid">
        <Metric
          icon={<CircleDollarSign size={18} />}
          label="Card fee"
          value={formatMoney(fees.cardFee)}
          note="2.6% + 15¢"
        />
        <Metric
          icon={<Bitcoin size={18} />}
          label="Bitcoin fee - 2026"
          value={formatMoney(fees.bitcoinFeeNow)}
          note={`Save ${formatMoney(fees.saveNow)} today`}
        />
        <Metric
          icon={<Bitcoin size={18} />}
          label="Bitcoin fee - 2027"
          value={formatMoney(fees.bitcoinFeeLater)}
          note={`Save ${formatMoney(fees.saveLater)} later`}
        />
      </div>
    </section>
  );
}

function SavingsResults({
  fees,
  horizon
}: {
  fees: ReturnType<typeof calculateFees>;
  horizon: ReturnType<typeof calculateHorizonSavings>;
}) {
  return (
    <section className="results" aria-label="Savings results">
      <div className="big-number">
        <span>Over the next 18 months</span>
        <strong>{formatMoney(horizon.totalSavings)}</strong>
        <p>
          Based on {formatVisits(horizon.totalVisits)} similar visits at{" "}
          {formatMoney(fees.ticket)} each.
        </p>
      </div>

      <div className="metric-grid">
        <Metric
          icon={<CircleDollarSign size={18} />}
          label="Card fee"
          value={formatMoney(fees.cardFee)}
          note="2.6% + 15¢"
        />
        <Metric
          icon={<Bitcoin size={18} />}
          label="Bitcoin fee - 2026"
          value={formatMoney(fees.bitcoinFeeNow)}
          note={`Save ${formatMoney(fees.saveNow)} today`}
        />
        <Metric
          icon={<Bitcoin size={18} />}
          label="Bitcoin fee - 2027"
          value={formatMoney(fees.bitcoinFeeLater)}
          note={`Save ${formatMoney(fees.saveLater)} later`}
        />
      </div>
    </section>
  );
}

function Metric({
  icon,
  label,
  value,
  note
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  note: string;
}) {
  return (
    <article className="metric">
      <div className="metric-icon">{icon}</div>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{note}</small>
    </article>
  );
}

function QrPanel() {
  const isLocal = window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost";

  return (
    <section className="qr-panel" aria-label="Read more QR code">
      <div className="qr-card">
        <div className="qr-frame">
          <img src={QR_IMAGE_PATH} alt="QR code for Why Turn On Bitcoin" />
        </div>
      </div>
      <div className="qr-copy">
        <p className="eyebrow">Merchant read</p>
        <h2>Why Turn On Bitcoin?</h2>
        <p>
          A 2-minute page with the plain-English fee case, practical benefits, FAQ,
          and Square resources.
        </p>
        {isLocal ? (
          <p className="qr-note">
            Phone scans need a public URL. Localhost only works on the computer
            running the app.
          </p>
        ) : null}
        <button className="text-link" onClick={() => navigate("why-bitcoin")}>
          Open the page <ArrowRight size={17} />
        </button>
      </div>
    </section>
  );
}

function ArticlePage() {
  const commonQuestions = [
    {
      question: "Can it go straight to cash?",
      answer:
        "Yes. Square says sellers can receive Bitcoin Payments as USD in their Square balance, so a merchant can accept Bitcoin without holding bitcoin. If they want to hold bitcoin, that is a separate choice in their Square settings."
    },
    {
      question: "Does this replace cards?",
      answer:
        "No. It adds another payment option alongside cards, cash, and everything else that already works. The point is not to make every customer switch. The point is to give customers who already use Bitcoin a lower-fee way to pay."
    },
    {
      question: "What happens after 2026?",
      answer:
        "Square lists Bitcoin Payments at 0% through 2026, then a flat 1% starting in 2027. That is still lower than the standard in-person card fee of 2.6% plus 15 cents, especially on smaller tickets."
    },
    {
      question: "How does tax work?",
      answer:
        "Sales are still business income. Square says settling Bitcoin Payments to USD should not create a capital gain or loss at payment time because the bitcoin is converted right away. If a merchant chooses to hold bitcoin instead, that can create tax events later."
    },
    {
      question: "Isn't bitcoin for criminals?",
      answer:
        "Criminals use every payment method, especially dollars. Chainalysis estimates illicit activity is less than 1% of overall crypto transaction volume, and bitcoin is only one part of crypto. Bitcoin transactions are also public, which gives investigators a trail that cash does not."
    },
    {
      question: "Is bitcoin bad for the environment?",
      answer:
        "Bitcoin uses electricity, so the fair question is where that electricity comes from and what it would otherwise be used for. Some mining uses wasted or renewable energy; some does not. For a merchant, this tool is focused on a narrower decision: whether a lower-fee payment option is worth turning on."
    },
    {
      question: "Is bitcoin a Trump thing?",
      answer:
        "No. If we are being honest, politics has not always helped Bitcoin's reputation. But Bitcoin itself is not a party, a campaign, or a politician. It is a payment network and a form of money. Customers who pay with it usually believe it is a better way to save and spend."
    }
  ];

  return (
    <main className="article-page">
      <article className="article-shell">
        <header className="article-header">
          <p className="eyebrow">2-minute merchant read</p>
          <h1>Why Turn On Bitcoin?</h1>
          <p>
            A simple lower-fee payment option for Square sellers who want to keep
            more of each sale.
          </p>
        </header>

        <div className="article-body">
          {articleParagraphs.map((paragraph, paragraphIndex) => (
            <p key={paragraphIndex}>
              {paragraph.map((segment, segmentIndex) =>
                typeof segment === "string" ? (
                  segment
                ) : (
                  <strong key={segmentIndex}>{segment.text}</strong>
                )
              )}
            </p>
          ))}
        </div>

        <section
          id="common-questions"
          className="faq-strip"
          aria-labelledby="faq-title"
        >
          <h2 id="faq-title">Common Questions About Bitcoin</h2>
          {commonQuestions.map((item) => (
            <details key={item.question} className="faq-item">
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </section>
      </article>

      <aside className="resource-panel" aria-labelledby="resources-title">
        <div className="resource-heading">
          <h2 id="resources-title">Resources</h2>
        </div>
        <div className="resource-list">
          {resourceLinks.map((link) => (
            <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
              <span>
                <strong>{link.title}</strong>
                <small>{link.description}</small>
              </span>
              <ExternalLink size={16} />
            </a>
          ))}
        </div>
      </aside>
    </main>
  );
}
