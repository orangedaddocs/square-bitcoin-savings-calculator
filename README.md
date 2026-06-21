# Square Bitcoin Savings Calculator

[![Square Bitcoin Savings Calculator walkthrough](public/square-bitcoin-walkthrough-preview.gif)](https://orangedaddocs.github.io/square-bitcoin-savings-calculator/square-bitcoin-walkthrough.mp4)

[Watch the full walkthrough video](https://orangedaddocs.github.io/square-bitcoin-savings-calculator/square-bitcoin-walkthrough.mp4)

A simple calculator for onboarding Square merchants to Bitcoin Payments.

When you walk into a Square merchant, the first question is usually: "What would this actually save me?" This app lets you enter a real ticket size, choose repeat visits or repeat customers, and show the merchant the fee difference between card payments and Bitcoin Payments.

If they want to learn more, they can scan the QR code and read a short plain-English explanation of how Bitcoin Payments work, why the fee savings matter, and what the tradeoffs are.

Live app: https://orangedaddocs.github.io/square-bitcoin-savings-calculator/

## Square resources

A few official Square links worth keeping close:

- [Accept Bitcoin with Square](https://squareup.com/us/en/bitcoin)
- [How to turn on Bitcoin Payments](https://squareup.com/us/en/square-university/invoices-gift-cards-banking/accept-bitcoin-payments-with-square-a-step-by-step-guide)
- [Getting Started with Square Bitcoin](https://squareup.com/us/en/the-bottom-line/inside-square/getting-started-with-bitcoin-on-square)
- [Square card processing fees](https://squareup.com/us/en/payments/our-fees)

## Contribute

This is v1.1, built in public by a vibe-coding dad who wants merchants to see the numbers fast.

## Release notes

### v1.1 - Repeat Customers Update

- Added a repeat-customers calculator for estimating savings by people paying with Bitcoin per day, week, or month.
- Kept the original repeat-visits calculator intact for the first tab.
- Improved the mobile flow so the calculator, savings result, and QR handoff are easier to scan.
- Thanks for the feedback to the pleb on Stacker News. 🏃‍♂️

Please use it and fork it for your own local merchant onboarding. It is free software, just like it should be.

**Contributions are especially welcome if you are a developer, you know somebody at Square, or you have walked a merchant through turning this on:**

- screenshots or walkthroughs showing how to turn Bitcoin Payments on in Square
- short videos merchants can watch
- clearer FAQ answers
- better onboarding copy
- design and mobile usability improvements

Questions or ideas: orangedaddocs@proton.me

## License

MIT.

## Development

```sh
npm install
npm run dev
```

Useful commands:

```sh
npm test -- --run
npm run qr
npm run pdf
npm run build
```

Built with 🧡 for the ₿ community.
