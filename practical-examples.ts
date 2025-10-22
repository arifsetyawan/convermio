/**
 * Practical Usage Examples
 * Real-world scenarios for the Currency Pair Calculator
 */

import {
  CurrencyPairCalculator,
  CurrencyPair,
  FixedCurrency
} from './currency-calculator';

const calculator = new CurrencyPairCalculator();

console.log("╔════════════════════════════════════════════════════╗");
console.log("║        Practical Usage Examples                    ║");
console.log("╚════════════════════════════════════════════════════╝\n");

// ============================================================
// Scenario 1: International Business Payment
// ============================================================
console.log("📌 Scenario 1: International Business Payment");
console.log("─────────────────────────────────────────────────────");
console.log("You need to pay a European supplier 50,000 EUR.");
console.log("Current USD/EUR rate: 0.85\n");

const businessPayment: CurrencyPair = {
  base: "USD",
  counter: "EUR",
  rate: 0.85
};

const payment = calculator.calculate({
  pair: businessPayment,
  fixedCurrency: FixedCurrency.COUNTER,
  fixedAmount: 50000
});

console.log(`Required USD: ${payment.baseAmount.toLocaleString()}`);
console.log(`Payment: ${payment.counterAmount.toLocaleString()} EUR`);
console.log(`Total cost: $${payment.baseAmount.toLocaleString()}\n\n`);

// ============================================================
// Scenario 2: Cryptocurrency Investment Portfolio
// ============================================================
console.log("📌 Scenario 2: Cryptocurrency Investment Portfolio");
console.log("─────────────────────────────────────────────────────");
console.log("You want to diversify $10,000 across crypto assets.\n");

const cryptoRates = [
  { pair: { base: "BTC", counter: "USD", rate: 67000 }, allocation: 5000 },
  { pair: { base: "ETH", counter: "USD", rate: 3200 }, allocation: 3000 },
  { pair: { base: "SOL", counter: "USD", rate: 145 }, allocation: 2000 }
];

console.log("Portfolio Breakdown:");
console.log("─────────────────────────────────────────────────────");

let totalInvested = 0;
cryptoRates.forEach(({ pair, allocation }) => {
  const result = calculator.calculate({
    pair,
    fixedCurrency: FixedCurrency.COUNTER,
    fixedAmount: allocation
  });
  
  console.log(`${pair.base}: ${result.baseAmount.toFixed(8)} (${allocation.toLocaleString()} USD)`);
  totalInvested += allocation;
});

console.log(`\nTotal Portfolio Value: $${totalInvested.toLocaleString()}\n\n`);

// ============================================================
// Scenario 3: Travel Budget Planning
// ============================================================
console.log("📌 Scenario 3: Travel Budget Planning");
console.log("─────────────────────────────────────────────────────");
console.log("Planning a 2-week trip to Japan with a $3,000 budget.\n");

const travelPair: CurrencyPair = {
  base: "USD",
  counter: "JPY",
  rate: 148.5
};

const travelBudget = calculator.calculate({
  pair: travelPair,
  fixedCurrency: FixedCurrency.BASE,
  fixedAmount: 3000
});

const dailyBudget = travelBudget.counterAmount / 14;

console.log(`Total Budget: ${travelBudget.baseAmount.toLocaleString()} USD`);
console.log(`Available in JPY: ¥${travelBudget.counterAmount.toLocaleString()}`);
console.log(`Daily Budget: ¥${dailyBudget.toFixed(0)}`);
console.log(`Per meal budget (~3/day): ¥${(dailyBudget / 3).toFixed(0)}\n\n`);

// ============================================================
// Scenario 4: E-commerce Multi-Currency Pricing
// ============================================================
console.log("📌 Scenario 4: E-commerce Multi-Currency Pricing");
console.log("─────────────────────────────────────────────────────");
console.log("Setting prices for products in multiple currencies.\n");

const productPricesUSD = [19.99, 49.99, 99.99, 199.99];

const targetCurrencies = [
  { base: "USD", counter: "EUR", rate: 0.92 },
  { base: "USD", counter: "GBP", rate: 0.79 },
  { base: "USD", counter: "CAD", rate: 1.35 },
  { base: "USD", counter: "AUD", rate: 1.52 }
];

console.log("Product Pricing Matrix:");
console.log("─────────────────────────────────────────────────────");
console.log("USD".padEnd(12) + targetCurrencies.map(c => c.counter.padEnd(12)).join(""));
console.log("─────────────────────────────────────────────────────");

productPricesUSD.forEach(priceUSD => {
  let row = `$${priceUSD.toFixed(2)}`.padEnd(12);
  
  targetCurrencies.forEach(pair => {
    const result = calculator.calculate({
      pair,
      fixedCurrency: FixedCurrency.BASE,
      fixedAmount: priceUSD
    });
    
    let symbol = '';
    switch(pair.counter) {
      case 'EUR': symbol = '€'; break;
      case 'GBP': symbol = '£'; break;
      case 'CAD': symbol = 'C$'; break;
      case 'AUD': symbol = 'A$'; break;
    }
    
    row += `${symbol}${result.counterAmount.toFixed(2)}`.padEnd(12);
  });
  
  console.log(row);
});
console.log("\n");

// ============================================================
// Scenario 5: Forex Trading Analysis
// ============================================================
console.log("📌 Scenario 5: Forex Trading Analysis");
console.log("─────────────────────────────────────────────────────");
console.log("Analyzing potential trades with different position sizes.\n");

const forexPair: CurrencyPair = {
  base: "EUR",
  counter: "USD",
  rate: 1.085
};

const positionSizes = [1000, 5000, 10000, 50000, 100000]; // Standard forex lot sizes

console.log("EUR/USD @ 1.085");
console.log("─────────────────────────────────────────────────────");
console.log("Position (EUR)  | USD Equivalent | Pip Value*");
console.log("─────────────────────────────────────────────────────");

positionSizes.forEach(size => {
  const result = calculator.calculate({
    pair: forexPair,
    fixedCurrency: FixedCurrency.BASE,
    fixedAmount: size
  });
  
  // In forex, 1 pip = 0.0001 for most pairs
  const pipValue = size * 0.0001 * forexPair.rate;
  
  console.log(
    `€${size.toLocaleString().padStart(7)}     | ` +
    `$${result.counterAmount.toLocaleString().padStart(11)} | ` +
    `$${pipValue.toFixed(2)}`
  );
});
console.log("* Pip value = position size × 0.0001 × rate\n\n");

// ============================================================
// Scenario 6: Salary Comparison Across Countries
// ============================================================
console.log("📌 Scenario 6: Salary Comparison Across Countries");
console.log("─────────────────────────────────────────────────────");
console.log("Comparing a $100,000 USD salary offer across regions.\n");

const baseSalary = 100000;
const salaryComparisons = [
  { base: "USD", counter: "EUR", rate: 0.92, location: "Germany" },
  { base: "USD", counter: "GBP", rate: 0.79, location: "UK" },
  { base: "USD", counter: "SGD", rate: 1.35, location: "Singapore" },
  { base: "USD", counter: "CHF", rate: 0.88, location: "Switzerland" }
];

console.log("Annual Salary Equivalents:");
console.log("─────────────────────────────────────────────────────");

salaryComparisons.forEach(({ base, counter, rate, location }) => {
  const result = calculator.calculate({
    pair: { base, counter, rate },
    fixedCurrency: FixedCurrency.BASE,
    fixedAmount: baseSalary
  });
  
  console.log(`${location.padEnd(15)}: ${result.counterAmount.toLocaleString()} ${counter} (USD equivalent)`);
});
console.log("\n");

// ============================================================
// Scenario 7: DCA (Dollar Cost Averaging) Bitcoin Strategy
// ============================================================
console.log("📌 Scenario 7: DCA Bitcoin Investment Strategy");
console.log("─────────────────────────────────────────────────────");
console.log("Investing $500/month in Bitcoin over 6 months.\n");

const monthlyInvestment = 500;
const btcPrices = [45000, 48000, 52000, 49000, 51000, 54000]; // Simulated monthly prices

let totalInvestedBTC = 0;
let totalSpent = 0;

console.log("Month | BTC Price | Investment | BTC Acquired | Total BTC");
console.log("─────────────────────────────────────────────────────────────");

btcPrices.forEach((price, index) => {
  const result = calculator.calculate({
    pair: { base: "BTC", counter: "USD", rate: price },
    fixedCurrency: FixedCurrency.COUNTER,
    fixedAmount: monthlyInvestment
  });
  
  totalInvestedBTC += result.baseAmount;
  totalSpent += monthlyInvestment;
  
  console.log(
    `  ${(index + 1)}   | $${price.toLocaleString().padStart(7)} | ` +
    `$${monthlyInvestment.toLocaleString().padStart(5)} | ` +
    `${result.baseAmount.toFixed(8)} | ` +
    `${totalInvestedBTC.toFixed(8)}`
  );
});

const finalPrice = btcPrices[btcPrices.length - 1];
const currentValue = totalInvestedBTC * finalPrice;
const profit = currentValue - totalSpent;
const profitPercent = (profit / totalSpent) * 100;

console.log("─────────────────────────────────────────────────────────────");
console.log(`Total Invested: $${totalSpent.toLocaleString()}`);
console.log(`Total BTC: ${totalInvestedBTC.toFixed(8)}`);
console.log(`Current Value: $${currentValue.toLocaleString()}`);
console.log(`Profit/Loss: $${profit.toFixed(2)} (${profitPercent.toFixed(2)}%)`);
console.log(`Average Cost: $${(totalSpent / totalInvestedBTC).toFixed(2)}/BTC\n\n`);

// ============================================================
// Scenario 8: Currency Arbitrage Opportunity Check
// ============================================================
console.log("📌 Scenario 8: Currency Arbitrage Opportunity");
console.log("─────────────────────────────────────────────────────");
console.log("Checking for triangular arbitrage: USD → EUR → GBP → USD\n");

// Step 1: USD to EUR
const step1 = calculator.calculate({
  pair: { base: "USD", counter: "EUR", rate: 0.85 },
  fixedCurrency: FixedCurrency.BASE,
  fixedAmount: 10000
});

// Step 2: EUR to GBP
const step2 = calculator.calculate({
  pair: { base: "EUR", counter: "GBP", rate: 0.86 },
  fixedCurrency: FixedCurrency.BASE,
  fixedAmount: step1.counterAmount
});

// Step 3: GBP to USD
const step3 = calculator.calculate({
  pair: { base: "GBP", counter: "USD", rate: 1.27 },
  fixedCurrency: FixedCurrency.BASE,
  fixedAmount: step2.counterAmount
});

console.log(`1. Start:      $${step1.baseAmount.toLocaleString()} USD`);
console.log(`2. USD → EUR:  €${step1.counterAmount.toLocaleString()} EUR`);
console.log(`3. EUR → GBP:  £${step2.counterAmount.toLocaleString()} GBP`);
console.log(`4. GBP → USD:  $${step3.counterAmount.toLocaleString()} USD`);
console.log("─────────────────────────────────────────────────────");

const arbitrageProfit = step3.counterAmount - step1.baseAmount;
const arbitragePercent = (arbitrageProfit / step1.baseAmount) * 100;

if (arbitrageProfit > 0) {
  console.log(`✓ Arbitrage Opportunity: +$${arbitrageProfit.toFixed(2)} (${arbitragePercent.toFixed(2)}%)`);
} else {
  console.log(`✗ No Arbitrage: -$${Math.abs(arbitrageProfit).toFixed(2)} (${arbitragePercent.toFixed(2)}%)`);
}
console.log("\n");

console.log("╔════════════════════════════════════════════════════╗");
console.log("║            Examples Complete!                      ║");
console.log("╚════════════════════════════════════════════════════╝");
