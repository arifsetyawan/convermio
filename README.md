# Currency Pair Amount Calculator

[![CI](https://github.com/arifsetyawan/convermio/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/arifsetyawan/convermio/actions/workflows/ci.yml)
[![Security](https://github.com/arifsetyawan/convermio/actions/workflows/security.yml/badge.svg?branch=main)](https://github.com/arifsetyawan/convermio/actions/workflows/security.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

A comprehensive TypeScript program for calculating currency pair amounts with support for different base/counter arrangements, fixed/counter positions, and varying exchange rates.

## Features

- ✅ **Flexible Calculations**: Calculate amounts with either base or counter currency fixed
- ✅ **Rate Analysis**: Handles rates below 1, equal to 1, and above 1
- ✅ **Pair Inversion**: Automatically invert currency pairs (e.g., EUR/USD ↔ USD/EUR)
- ✅ **Batch Processing**: Calculate multiple amounts at once
- ✅ **High Precision**: Support for cryptocurrencies and small decimal amounts
- ✅ **Type Safety**: Full TypeScript support with interfaces and enums

## Core Concepts

### Currency Pair Structure

A currency pair consists of:
- **Base Currency**: The first currency in the pair (e.g., USD in USD/EUR)
- **Counter Currency**: The second currency in the pair (e.g., EUR in USD/EUR)
- **Rate**: How much counter currency equals 1 unit of base currency

### Exchange Rate Positions

#### Rate < 1
When the rate is less than 1, each unit of base currency is worth **less** than one unit of counter currency.

```
Example: USD/EUR = 0.85
1 USD = 0.85 EUR
100 USD = 85 EUR
```

#### Rate = 1
When the rate equals 1, base and counter currencies have **equal** value.

```
Example: USD/USDC = 1.0
1 USD = 1 USDC
100 USD = 100 USDC
```

#### Rate > 1
When the rate is greater than 1, each unit of base currency is worth **more** than one unit of counter currency.

```
Example: USD/JPY = 110
1 USD = 110 JPY
100 USD = 11,000 JPY
```

### Fixed vs Counter Currency

- **Fixed Currency**: The currency amount you know and want to convert from
- **Counter Currency**: The currency amount you want to calculate

## Installation

```bash
# No external dependencies required
npm install --save-dev typescript
npm install --save-dev @types/node
```

## Usage Examples

### Basic Usage

```typescript
import { CurrencyPairCalculator, CurrencyPair, FixedCurrency } from './currency-calculator';

const calculator = new CurrencyPairCalculator();

// Define a currency pair
const pair: CurrencyPair = {
  base: "USD",
  counter: "EUR",
  rate: 0.85  // 1 USD = 0.85 EUR
};

// Calculate with fixed base amount
const result = calculator.calculate({
  pair,
  fixedCurrency: FixedCurrency.BASE,
  fixedAmount: 100
});

console.log(result);
// {
//   baseCurrency: "USD",
//   baseAmount: 100,
//   counterCurrency: "EUR",
//   counterAmount: 85,
//   rate: 0.85,
//   exchangeDescription: "100.00 USD = 85.00 EUR at rate 0.85"
// }
```

### Calculate with Fixed Counter Amount

```typescript
const pair: CurrencyPair = {
  base: "GBP",
  counter: "USD",
  rate: 1.25
};

// I want to get 500 USD, how many GBP do I need?
const result = calculator.calculate({
  pair,
  fixedCurrency: FixedCurrency.COUNTER,
  fixedAmount: 500
});

console.log(`You need ${result.baseAmount} ${result.baseCurrency}`);
// "You need 400 GBP"
```

### Invert Currency Pairs

```typescript
// You have EUR/USD rate but need USD/EUR
const eurUsdPair: CurrencyPair = {
  base: "EUR",
  counter: "USD",
  rate: 1.18
};

const result = calculator.calculateWithInvertedPair({
  pair: eurUsdPair,
  fixedCurrency: FixedCurrency.BASE,
  fixedAmount: 100
});

// Automatically converts to USD/EUR with rate ≈ 0.847
```

### Batch Calculations

```typescript
const pair: CurrencyPair = {
  base: "BTC",
  counter: "USD",
  rate: 45000
};

const amounts = [0.1, 0.5, 1, 2, 5];
const results = calculator.calculateBatch(pair, FixedCurrency.BASE, amounts);

results.forEach(r => {
  console.log(`${r.baseAmount} BTC = ${r.counterAmount} USD`);
});
```

### Find Required Amounts

```typescript
const pair: CurrencyPair = {
  base: "EUR",
  counter: "GBP",
  rate: 0.86
};

// How much EUR do I need to get 1000 GBP?
const requiredEur = calculator.findRequiredBaseAmount(pair, 1000);
console.log(`${requiredEur} EUR`);  // 1162.79 EUR

// If I have 500 EUR, how much GBP will I get?
const resultingGbp = calculator.findResultingCounterAmount(pair, 500);
console.log(`${resultingGbp} GBP`);  // 430 GBP
```

### Cryptocurrency Example

```typescript
// High precision for crypto
const btcPair: CurrencyPair = {
  base: "BTC",
  counter: "USD",
  rate: 67345.89
};

const result = calculator.calculate({
  pair: btcPair,
  fixedCurrency: FixedCurrency.COUNTER,
  fixedAmount: 1000  // I want to buy $1000 worth of BTC
});

console.log(`You can buy ${result.baseAmount} BTC`);
// "You can buy 0.01485123 BTC"
```

## API Reference

### CurrencyPairCalculator

#### `calculate(input: CalculationInput): CalculationResult`
Main calculation method that computes the amount based on the fixed currency.

#### `calculateWithInvertedPair(input: CalculationInput): CalculationResult`
Inverts the currency pair and performs the calculation.

#### `calculateBatch(pair: CurrencyPair, fixedCurrency: FixedCurrency, amounts: number[]): CalculationResult[]`
Performs calculations for multiple amounts at once.

#### `findRequiredBaseAmount(pair: CurrencyPair, targetCounterAmount: number): number`
Finds how much base currency is needed to get a specific counter amount.

#### `findResultingCounterAmount(pair: CurrencyPair, baseAmount: number): number`
Finds how much counter currency results from a specific base amount.

#### `analyzeRate(rate: number): RateAnalysis`
Analyzes whether the rate is below, at, or above 1.

#### `formatResult(result: CalculationResult): string`
Formats the calculation result for display.

### Types and Interfaces

```typescript
enum FixedCurrency {
  BASE = 'BASE',
  COUNTER = 'COUNTER'
}

interface CurrencyPair {
  base: string;
  counter: string;
  rate: number;
}

interface CalculationInput {
  pair: CurrencyPair;
  fixedCurrency: FixedCurrency;
  fixedAmount: number;
}

interface CalculationResult {
  baseCurrency: string;
  baseAmount: number;
  counterCurrency: string;
  counterAmount: number;
  rate: number;
  exchangeDescription: string;
}
```

## Calculation Formulas

### Base Amount is Fixed
```
counterAmount = baseAmount × rate
```

### Counter Amount is Fixed
```
baseAmount = counterAmount ÷ rate
```

### Inverted Rate
```
invertedRate = 1 ÷ originalRate
```

## Running the Examples

```bash
# Compile TypeScript
npx tsc currency-calculator.ts --lib es2015 --module commonjs

# Run examples
node currency-calculator.js
```

## Running Tests

```bash
# Compile and run tests
npx tsc currency-calculator.test.ts --lib es2015 --module commonjs
node currency-calculator.test.js
```

## Common Use Cases

### 1. Foreign Exchange Trading
```typescript
// EUR/USD trading
const pair = { base: "EUR", counter: "USD", rate: 1.08 };
const result = calculator.calculate({
  pair,
  fixedCurrency: FixedCurrency.BASE,
  fixedAmount: 10000  // Trading 10,000 EUR
});
```

### 2. Travel Money Exchange
```typescript
// Converting for a trip
const pair = { base: "USD", counter: "THB", rate: 35.5 };
const result = calculator.calculate({
  pair,
  fixedCurrency: FixedCurrency.BASE,
  fixedAmount: 500  // Converting $500 for trip
});
```

### 3. Cryptocurrency Trading
```typescript
// Buying Bitcoin
const pair = { base: "BTC", counter: "USDT", rate: 45000 };
const result = calculator.calculate({
  pair,
  fixedCurrency: FixedCurrency.COUNTER,
  fixedAmount: 1000  // Buying $1000 worth
});
```

### 4. E-commerce Multi-Currency
```typescript
// Product pricing in different currencies
const products = [29.99, 49.99, 99.99];
const pair = { base: "USD", counter: "EUR", rate: 0.92 };
const prices = calculator.calculateBatch(pair, FixedCurrency.BASE, products);
```

## Key Features Explained

### Precision Handling
The calculator maintains 8 decimal places of precision, suitable for both traditional currencies and cryptocurrencies.

### Rate Position Analysis
Automatically determines if your base currency is stronger (rate > 1), weaker (rate < 1), or equal (rate = 1) to the counter currency.

### Bidirectional Calculation
Calculate in either direction:
- Base → Counter: "I have X base, how much counter do I get?"
- Counter → Base: "I want Y counter, how much base do I need?"

## License

MIT

## Contributing

Feel free to submit issues and enhancement requests!
