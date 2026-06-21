export const resourceLinks = [
  {
    title: "Here's how you turn it on",
    description: "Square's 3-minute step-by-step guide to enabling Bitcoin Payments.",
    href: "https://squareup.com/us/en/square-university/invoices-gift-cards-banking/accept-bitcoin-payments-with-square-a-step-by-step-guide"
  },
  {
    title: "Accept Bitcoin with Square",
    description: "Square's product page for Bitcoin Payments.",
    href: "https://squareup.com/us/en/bitcoin"
  },
  {
    title: "Getting Started with Square Bitcoin",
    description: "Square's setup overview for turning Bitcoin Payments on.",
    href: "https://squareup.com/us/en/the-bottom-line/inside-square/getting-started-with-bitcoin-on-square"
  },
  {
    title: "Square Bitcoin ebook",
    description: "A deeper merchant-facing resource from Square.",
    href: "https://squareup.com/us/en/the-bottom-line/managing-your-finances/square-bitcoin-ebook"
  },
  {
    title: "Pink Owl Coffee case study",
    description: "A real Square merchant story.",
    href: "https://squareup.com/us/en/the-bottom-line/case-studies/pink-owl-coffee"
  },
  {
    title: "Doctor's Island Brewing Co. case study",
    description: "Another Square merchant story.",
    href: "https://squareup.com/us/en/the-bottom-line/case-studies/doctors-island-brewing-co"
  },
  {
    title: "Square card processing fees",
    description: "Square's current public card fee page.",
    href: "https://squareup.com/us/en/payments/our-fees"
  }
];

export type ArticleSegment =
  | string
  | { text: string; strong: true }
  | { text: string; accent: true };

export const articleParagraphs: ArticleSegment[][] = [
  [
    "Every card sale you take has a fee built into it: 2.6% plus 15 cents, every time. Bitcoin Payments run inside the Square setup you already have, and they cost you nothing through 2026, then a flat 1% after that. On a $5 coffee, that is 28 cents to the card networks versus nothing today. ",
    {
      text: "A regular who buys that coffee every day adds up to about $67 over the next 12 full months.",
      strong: true
    },
    " ",
    {
      text: "And where the math gets really interesting: if ",
      strong: true
    },
    {
      text: "seven people a day",
      accent: true
    },
    {
      text: " come in for a burrito and a coffee and spend ",
      strong: true
    },
    {
      text: "$13 each",
      accent: true
    },
    {
      text: ", the owner saves more than ",
      strong: true
    },
    {
      text: "$1,000 a year in fees",
      accent: true
    },
    {
      text: ".",
      strong: true
    },
    " Customers who use bitcoin are happy to accept the small fee that they pay on their end. It's a win-win."
  ],
  [
    "Fees are only half of it. A Bitcoin payment is final the moment it clears. There is no chargeback to fight weeks later, no reversal, no back-office time spent on a dispute. The money settles in seconds and it is yours. The honest trade is that refunds work differently: when you refund a Bitcoin sale, Square issues the customer a gift card for the dollar amount rather than reversing the original payment. For most counter sales that is a fair deal - fewer surprises coming back at you, and a clean way to make a refund when you need one."
  ],
  [
    "The calculator on this site puts real numbers on it. Type in a ticket - a coffee, a burrito, a beer tab - set how often a regular comes in, and you will see the card fee, the Bitcoin fee, and what the gap adds up to over repeat visits. It is not a forecast for your whole business. It is one concrete example: one customer, one habit, and the fees attached to it. Then you multiply by the regulars you already know by name."
  ],
  [
    {
      text: "Turning this on does not change anything else you do.",
      strong: true
    },
    " You keep taking cards, cash, and every payment type that already works. Most customers will ignore it, but some will be curious, and some already pay with Bitcoin and will be glad to see it - they just need a Lightning wallet like Cash App to do it. For now it works for in-person sales in the US, outside New York."
  ],
  [
    "The simplest way to think about it is not as a bet on what every customer will do. It is a small operational upgrade. Start with one real ticket, look at the card fee, then look at the Bitcoin fee. Then picture a regular or two choosing the cheaper option, day after day, and decide whether it is worth the few minutes it takes to switch on."
  ]
];
