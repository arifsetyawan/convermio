/**
 * Currency Pair Amount Calculator
 * Handles calculations with different base/counter arrangements,
 * fixed/counter positions, and exchange rates
 */

/**
 * Represents which currency in the pair has a fixed amount
 */
enum FixedCurrency {
  BASE = 'BASE',
  COUNTER = 'COUNTER'
}

/**
 * Currency pair configuration
 */
interface CurrencyPair {
  base: string;      // e.g., "USD"
  counter: string;   // e.g., "EUR"
  rate: number;      // Exchange rate (how much counter currency = 1 base currency)
}

/**
 * Calculation input parameters
 */
interface CalculationInput {
  pair: CurrencyPair;
  fixedCurrency: FixedCurrency;
  fixedAmount: number;
}

/**
 * Calculation result
 */
interface CalculationResult {
  baseCurrency: string;
  baseAmount: number;
  counterCurrency: string;
  counterAmount: number;
  rate: number;
  exchangeDescription: string;
}

/**
 * Currency Pair Amount Calculator Class
 */
class CurrencyPairCalculator {
  
  /**
   * Calculate the counter amount when base amount is fixed
   * Formula: counterAmount = baseAmount × rate
   */
  private calculateFromBase(baseAmount: number, rate: number): number {
    return baseAmount * rate;
  }

  /**
   * Calculate the base amount when counter amount is fixed
   * Formula: baseAmount = counterAmount / rate
   */
  private calculateFromCounter(counterAmount: number, rate: number): number {
    return counterAmount / rate;
  }

  /**
   * Main calculation method
   */
  calculate(input: CalculationInput): CalculationResult {
    const { pair, fixedCurrency, fixedAmount } = input;
    
    let baseAmount: number;
    let counterAmount: number;

    if (fixedCurrency === FixedCurrency.BASE) {
      // Base currency amount is fixed, calculate counter
      baseAmount = fixedAmount;
      counterAmount = this.calculateFromBase(baseAmount, pair.rate);
    } else {
      // Counter currency amount is fixed, calculate base
      counterAmount = fixedAmount;
      baseAmount = this.calculateFromCounter(counterAmount, pair.rate);
    }

    return {
      baseCurrency: pair.base,
      baseAmount: this.roundToDecimals(baseAmount, 8),
      counterCurrency: pair.counter,
      counterAmount: this.roundToDecimals(counterAmount, 8),
      rate: pair.rate,
      exchangeDescription: this.generateExchangeDescription(pair, baseAmount, counterAmount)
    };
  }

  /**
   * Calculate with inverted rate (swap base and counter)
   * This is useful when you have EUR/USD rate but need USD/EUR
   */
  calculateWithInvertedPair(input: CalculationInput): CalculationResult {
    const invertedPair: CurrencyPair = {
      base: input.pair.counter,
      counter: input.pair.base,
      rate: 1 / input.pair.rate
    };

    const invertedFixed = input.fixedCurrency === FixedCurrency.BASE 
      ? FixedCurrency.COUNTER 
      : FixedCurrency.BASE;

    return this.calculate({
      pair: invertedPair,
      fixedCurrency: invertedFixed,
      fixedAmount: input.fixedAmount
    });
  }

  /**
   * Batch calculation for multiple amounts
   */
  calculateBatch(
    pair: CurrencyPair, 
    fixedCurrency: FixedCurrency, 
    amounts: number[]
  ): CalculationResult[] {
    return amounts.map(amount => 
      this.calculate({ pair, fixedCurrency, fixedAmount: amount })
    );
  }

  /**
   * Find the required base amount to get a specific counter amount
   */
  findRequiredBaseAmount(pair: CurrencyPair, targetCounterAmount: number): number {
    return this.roundToDecimals(targetCounterAmount / pair.rate, 8);
  }

  /**
   * Find the resulting counter amount from a specific base amount
   */
  findResultingCounterAmount(pair: CurrencyPair, baseAmount: number): number {
    return this.roundToDecimals(baseAmount * pair.rate, 8);
  }

  /**
   * Analyze rate position relative to 1
   */
  analyzeRate(rate: number): {
    position: 'below' | 'at' | 'above';
    description: string;
  } {
    if (rate < 1) {
      return {
        position: 'below',
        description: `Rate is below 1 (${rate}). Each base unit is worth less than 1 counter unit.`
      };
    } else if (rate === 1) {
      return {
        position: 'at',
        description: `Rate is exactly 1. Base and counter currencies have equal value.`
      };
    } else {
      return {
        position: 'above',
        description: `Rate is above 1 (${rate}). Each base unit is worth more than 1 counter unit.`
      };
    }
  }

  /**
   * Generate human-readable exchange description
   */
  private generateExchangeDescription(
    pair: CurrencyPair, 
    baseAmount: number, 
    counterAmount: number
  ): string {
    return `${baseAmount.toFixed(2)} ${pair.base} = ${counterAmount.toFixed(2)} ${pair.counter} at rate ${pair.rate}`;
  }

  /**
   * Round to specified decimal places
   */
  private roundToDecimals(value: number, decimals: number): number {
    return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
  }

  /**
   * Format result for display
   */
  formatResult(result: CalculationResult): string {
    const rateAnalysis = this.analyzeRate(result.rate);
    
    return `
═══════════════════════════════════════
  Currency Pair Calculation Result
═══════════════════════════════════════
Pair: ${result.baseCurrency}/${result.counterCurrency}
Rate: ${result.rate}
${rateAnalysis.description}
───────────────────────────────────────
Base:    ${result.baseAmount.toFixed(8)} ${result.baseCurrency}
Counter: ${result.counterAmount.toFixed(8)} ${result.counterCurrency}
───────────────────────────────────────
${result.exchangeDescription}
═══════════════════════════════════════
    `.trim();
  }
}

/**
 * Example usage and demonstrations
 */
function runExamples() {
  const calculator = new CurrencyPairCalculator();

  console.log("╔════════════════════════════════════════════════════╗");
  console.log("║   Currency Pair Amount Calculator - Examples      ║");
  console.log("╚════════════════════════════════════════════════════╝\n");

  // Example 1: Rate < 1 (USD/EUR with rate 0.85)
  console.log("📊 Example 1: Rate < 1 (Base worth less than Counter)");
  console.log("─────────────────────────────────────────────────────");
  const pair1: CurrencyPair = {
    base: "USD",
    counter: "EUR",
    rate: 0.85  // 1 USD = 0.85 EUR
  };

  // Calculate with fixed base amount
  const result1a = calculator.calculate({
    pair: pair1,
    fixedCurrency: FixedCurrency.BASE,
    fixedAmount: 100
  });
  console.log(calculator.formatResult(result1a));
  console.log();

  // Calculate with fixed counter amount
  const result1b = calculator.calculate({
    pair: pair1,
    fixedCurrency: FixedCurrency.COUNTER,
    fixedAmount: 100
  });
  console.log(calculator.formatResult(result1b));
  console.log("\n");

  // Example 2: Rate > 1 (USD/JPY with rate 110)
  console.log("📊 Example 2: Rate > 1 (Base worth more than Counter)");
  console.log("─────────────────────────────────────────────────────");
  const pair2: CurrencyPair = {
    base: "USD",
    counter: "JPY",
    rate: 110  // 1 USD = 110 JPY
  };

  const result2a = calculator.calculate({
    pair: pair2,
    fixedCurrency: FixedCurrency.BASE,
    fixedAmount: 50
  });
  console.log(calculator.formatResult(result2a));
  console.log();

  const result2b = calculator.calculate({
    pair: pair2,
    fixedCurrency: FixedCurrency.COUNTER,
    fixedAmount: 5500
  });
  console.log(calculator.formatResult(result2b));
  console.log("\n");

  // Example 3: Inverted pair calculation
  console.log("📊 Example 3: Inverted Pair Calculation");
  console.log("─────────────────────────────────────────────────────");
  console.log("Original: EUR/USD rate 1.18");
  const pair3: CurrencyPair = {
    base: "EUR",
    counter: "USD",
    rate: 1.18
  };
  
  const result3 = calculator.calculate({
    pair: pair3,
    fixedCurrency: FixedCurrency.BASE,
    fixedAmount: 100
  });
  console.log(calculator.formatResult(result3));
  console.log();

  console.log("Inverted: USD/EUR (calculated automatically)");
  const result3inv = calculator.calculateWithInvertedPair({
    pair: pair3,
    fixedCurrency: FixedCurrency.BASE,
    fixedAmount: 118
  });
  console.log(calculator.formatResult(result3inv));
  console.log("\n");

  // Example 4: Batch calculation
  console.log("📊 Example 4: Batch Calculation");
  console.log("─────────────────────────────────────────────────────");
  const pair4: CurrencyPair = {
    base: "GBP",
    counter: "USD",
    rate: 1.25
  };

  const amounts = [10, 50, 100, 500, 1000];
  const batchResults = calculator.calculateBatch(pair4, FixedCurrency.BASE, amounts);
  
  console.log(`Pair: ${pair4.base}/${pair4.counter} at rate ${pair4.rate}\n`);
  console.log("Base (GBP) | Counter (USD)");
  console.log("─────────────────────────");
  batchResults.forEach(result => {
    console.log(`${result.baseAmount.toFixed(2).padStart(10)} | ${result.counterAmount.toFixed(2)}`);
  });
  console.log("\n");

  // Example 5: Finding required amounts
  console.log("📊 Example 5: Finding Required Amounts");
  console.log("─────────────────────────────────────────────────────");
  const pair5: CurrencyPair = {
    base: "EUR",
    counter: "GBP",
    rate: 0.86
  };

  const targetCounter = 1000;
  const requiredBase = calculator.findRequiredBaseAmount(pair5, targetCounter);
  console.log(`To get ${targetCounter} ${pair5.counter}, you need ${requiredBase.toFixed(2)} ${pair5.base}`);

  const givenBase = 500;
  const resultingCounter = calculator.findResultingCounterAmount(pair5, givenBase);
  console.log(`With ${givenBase} ${pair5.base}, you will get ${resultingCounter.toFixed(2)} ${pair5.counter}`);
  console.log();
}

// Run examples
runExamples();

// Export for use in other modules
export {
  CurrencyPairCalculator,
  CurrencyPair,
  FixedCurrency,
  CalculationInput,
  CalculationResult
};
