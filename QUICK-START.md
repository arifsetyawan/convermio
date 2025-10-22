# Quick Start Guide

## Installation & Setup

```bash
# 1. Install dependencies
npm install

# 2. Build the TypeScript files
npm run build

# 3. Run examples to see the calculator in action
npm run demo

# 4. Run tests
npm run test
```

## Instant Usage

### Basic Example - Copy & Paste Ready

```typescript
import { CurrencyPairCalculator, FixedCurrency } from './currency-calculator';

const calculator = new CurrencyPairCalculator();

// Example: Convert 100 USD to EUR at rate 0.85
const result = calculator.calculate({
  pair: { base: "USD", counter: "EUR", rate: 0.85 },
  fixedCurrency: FixedCurrency.BASE,
  fixedAmount: 100
});

console.log(`${result.baseAmount} ${result.baseCurrency} = ${result.counterAmount} ${result.counterCurrency}`);
// Output: 100 USD = 85 EUR
```

## Understanding the Key Components

### 1. Currency Pair
```typescript
{
  base: "USD",      // First currency
  counter: "EUR",   // Second currency
  rate: 0.85        // 1 USD = 0.85 EUR
}
```

### 2. Fixed Currency
Choose which amount you know:
- `FixedCurrency.BASE` - You know the base amount, calculate counter
- `FixedCurrency.COUNTER` - You know the counter amount, calculate base

### 3. Common Scenarios

#### "I have X, how much will I get?"
```typescript
// I have 100 USD, how many EUR will I get?
calculator.calculate({
  pair: { base: "USD", counter: "EUR", rate: 0.85 },
  fixedCurrency: FixedCurrency.BASE,  // USD is fixed
  fixedAmount: 100
});
```

#### "I want Y, how much do I need?"
```typescript
// I want 100 EUR, how many USD do I need?
calculator.calculate({
  pair: { base: "USD", counter: "EUR", rate: 0.85 },
  fixedCurrency: FixedCurrency.COUNTER,  // EUR is fixed
  fixedAmount: 100
});
```

## Rate Examples

### Rate < 1 (Base worth LESS than Counter)
```typescript
// 1 USD = 0.85 EUR (USD is weaker)
{ base: "USD", counter: "EUR", rate: 0.85 }

// Result: 100 USD → 85 EUR
```

### Rate > 1 (Base worth MORE than Counter)
```typescript
// 1 USD = 110 JPY (USD is stronger)
{ base: "USD", counter: "JPY", rate: 110 }

// Result: 100 USD → 11,000 JPY
```

### Rate = 1 (Equal value)
```typescript
// 1 USD = 1 USDC (Equal value)
{ base: "USD", counter: "USDC", rate: 1.0 }

// Result: 100 USD → 100 USDC
```

## Common Use Cases

### 1. Travel Money
```typescript
// Converting for vacation
const travelMoney = calculator.calculate({
  pair: { base: "USD", counter: "THB", rate: 35.5 },
  fixedCurrency: FixedCurrency.BASE,
  fixedAmount: 500  // $500 for trip
});
```

### 2. Cryptocurrency Purchase
```typescript
// Buying Bitcoin
const btcPurchase = calculator.calculate({
  pair: { base: "BTC", counter: "USD", rate: 67000 },
  fixedCurrency: FixedCurrency.COUNTER,
  fixedAmount: 1000  // Want to buy $1000 worth
});
```

### 3. Business Invoice
```typescript
// Euro invoice to USD
const invoice = calculator.calculate({
  pair: { base: "EUR", counter: "USD", rate: 1.08 },
  fixedCurrency: FixedCurrency.BASE,
  fixedAmount: 50000  // 50,000 EUR invoice
});
```

## Pro Tips

### Tip 1: Swapping Pairs
```typescript
// Have EUR/USD but need USD/EUR?
const result = calculator.calculateWithInvertedPair({
  pair: { base: "EUR", counter: "USD", rate: 1.18 },
  fixedCurrency: FixedCurrency.BASE,
  fixedAmount: 100
});
// Automatically converts to USD/EUR with inverted rate
```

### Tip 2: Multiple Conversions
```typescript
// Convert multiple amounts at once
const amounts = [10, 50, 100, 500];
const results = calculator.calculateBatch(
  { base: "USD", counter: "EUR", rate: 0.85 },
  FixedCurrency.BASE,
  amounts
);
```

### Tip 3: Quick Calculations
```typescript
// How much EUR for 1000 USD?
const eur = calculator.findResultingCounterAmount(
  { base: "USD", counter: "EUR", rate: 0.85 },
  1000
);

// How much USD needed for 1000 EUR?
const usd = calculator.findRequiredBaseAmount(
  { base: "USD", counter: "EUR", rate: 0.85 },
  1000
);
```

## Troubleshooting

### Wrong results?
- ✓ Check your rate is correct (1 BASE = X COUNTER)
- ✓ Verify which currency is base vs counter
- ✓ Confirm which amount is fixed

### Rate confusion?
- If 1 USD = 0.85 EUR, use: `{ base: "USD", counter: "EUR", rate: 0.85 }`
- If 1 EUR = 1.18 USD, use: `{ base: "EUR", counter: "USD", rate: 1.18 }`

## Files Included

- `currency-calculator.ts` - Main calculator class
- `currency-calculator.test.ts` - Comprehensive tests
- `practical-examples.ts` - 8 real-world scenarios
- `README.md` - Full documentation
- `QUICK-START.md` - This file
- `package.json` - NPM configuration
- `tsconfig.json` - TypeScript configuration

## Need Help?

Check the README.md for comprehensive documentation or run the practical examples:

```bash
npm run build
npx tsc practical-examples.ts --lib es2015 --module commonjs
node practical-examples.js
```

Happy calculating! 🚀
