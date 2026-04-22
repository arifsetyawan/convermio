import {
  CurrencyPairCalculator,
  CurrencyPair,
  FixedCurrency
} from './currency-calculator';

describe('CurrencyPairCalculator', () => {
  let calculator: CurrencyPairCalculator;

  beforeEach(() => {
    calculator = new CurrencyPairCalculator();
  });

  describe('calculate', () => {
    describe('when rate is less than 1', () => {
      const pair: CurrencyPair = { base: 'USD', counter: 'EUR', rate: 0.85 };

      it('should calculate counter amount from fixed base amount', () => {
        const result = calculator.calculate({
          pair,
          fixedCurrency: FixedCurrency.BASE,
          fixedAmount: 100
        });

        expect(result.baseAmount).toBe(100);
        expect(result.counterAmount).toBe(85);
        expect(result.baseCurrency).toBe('USD');
        expect(result.counterCurrency).toBe('EUR');
        expect(result.rate).toBe(0.85);
      });

      it('should calculate base amount from fixed counter amount', () => {
        const result = calculator.calculate({
          pair,
          fixedCurrency: FixedCurrency.COUNTER,
          fixedAmount: 85
        });

        expect(result.baseAmount).toBe(100);
        expect(result.counterAmount).toBe(85);
      });
    });

    describe('when rate is greater than 1', () => {
      const pair: CurrencyPair = { base: 'USD', counter: 'JPY', rate: 110 };

      it('should calculate counter amount from fixed base amount', () => {
        const result = calculator.calculate({
          pair,
          fixedCurrency: FixedCurrency.BASE,
          fixedAmount: 100
        });

        expect(result.baseAmount).toBe(100);
        expect(result.counterAmount).toBe(11000);
      });

      it('should calculate base amount from fixed counter amount', () => {
        const result = calculator.calculate({
          pair,
          fixedCurrency: FixedCurrency.COUNTER,
          fixedAmount: 11000
        });

        expect(result.baseAmount).toBe(100);
        expect(result.counterAmount).toBe(11000);
      });
    });

    describe('when rate equals 1', () => {
      const pair: CurrencyPair = { base: 'USD', counter: 'USDC', rate: 1.0 };

      it('should return equal amounts for base and counter', () => {
        const result = calculator.calculate({
          pair,
          fixedCurrency: FixedCurrency.BASE,
          fixedAmount: 250
        });

        expect(result.baseAmount).toBe(250);
        expect(result.counterAmount).toBe(250);
      });
    });

    describe('with decimal amounts', () => {
      it('should handle small amounts with precision', () => {
        const pair: CurrencyPair = { base: 'BTC', counter: 'USD', rate: 45000 };

        const result = calculator.calculate({
          pair,
          fixedCurrency: FixedCurrency.BASE,
          fixedAmount: 0.001
        });

        expect(result.baseAmount).toBe(0.001);
        expect(result.counterAmount).toBe(45);
      });

      it('should handle very small rates', () => {
        const pair: CurrencyPair = { base: 'BTC', counter: 'SAT', rate: 0.00000001 };

        const result = calculator.calculate({
          pair,
          fixedCurrency: FixedCurrency.BASE,
          fixedAmount: 1
        });

        expect(result.counterAmount).toBe(0.00000001);
      });

      it('should handle complex decimal rates', () => {
        const pair: CurrencyPair = { base: 'ETH', counter: 'USD', rate: 2345.67 };

        const result = calculator.calculate({
          pair,
          fixedCurrency: FixedCurrency.BASE,
          fixedAmount: 3.5
        });

        expect(result.counterAmount).toBeCloseTo(8209.845, 3);
      });
    });

    describe('rounding behavior', () => {
      it('should round to 8 decimal places', () => {
        const pair: CurrencyPair = { base: 'BTC', counter: 'USD', rate: 45000.123456789 };

        const result = calculator.calculate({
          pair,
          fixedCurrency: FixedCurrency.BASE,
          fixedAmount: 0.00000001
        });

        const decimalPlaces = result.counterAmount.toString().split('.')[1]?.length || 0;
        expect(decimalPlaces).toBeLessThanOrEqual(8);
      });
    });

    describe('exchange description', () => {
      it('should generate correct exchange description', () => {
        const pair: CurrencyPair = { base: 'USD', counter: 'EUR', rate: 0.85 };

        const result = calculator.calculate({
          pair,
          fixedCurrency: FixedCurrency.BASE,
          fixedAmount: 100
        });

        expect(result.exchangeDescription).toMatch(/100\.00 USD = 85\.00 EUR at rate 0\.85/);
      });
    });
  });

  describe('calculateWithInvertedPair', () => {
    it('should invert the currency pair and calculate correctly', () => {
      const pair: CurrencyPair = { base: 'EUR', counter: 'USD', rate: 1.18 };

      const result = calculator.calculateWithInvertedPair({
        pair,
        fixedCurrency: FixedCurrency.BASE,
        fixedAmount: 100
      });

      expect(result.baseCurrency).toBe('USD');
      expect(result.counterCurrency).toBe('EUR');
      expect(result.rate).toBeCloseTo(1 / 1.18, 6);
    });

    it('should swap fixed currency when inverting', () => {
      const pair: CurrencyPair = { base: 'EUR', counter: 'USD', rate: 1.18 };

      const result = calculator.calculateWithInvertedPair({
        pair,
        fixedCurrency: FixedCurrency.BASE,
        fixedAmount: 100
      });

      // Original was EUR/USD with BASE fixed
      // Inverted becomes USD/EUR with COUNTER fixed
      expect(result.counterAmount).toBe(100);
    });
  });

  describe('calculateBatch', () => {
    it('should calculate multiple amounts correctly', () => {
      const pair: CurrencyPair = { base: 'GBP', counter: 'USD', rate: 1.25 };
      const amounts = [10, 100, 1000];

      const results = calculator.calculateBatch(pair, FixedCurrency.BASE, amounts);

      expect(results).toHaveLength(3);
      expect(results[0].counterAmount).toBe(12.5);
      expect(results[1].counterAmount).toBe(125);
      expect(results[2].counterAmount).toBe(1250);
    });

    it('should handle empty amounts array', () => {
      const pair: CurrencyPair = { base: 'GBP', counter: 'USD', rate: 1.25 };

      const results = calculator.calculateBatch(pair, FixedCurrency.BASE, []);

      expect(results).toHaveLength(0);
    });

    it('should maintain consistency across batch', () => {
      const pair: CurrencyPair = { base: 'GBP', counter: 'USD', rate: 1.25 };
      const amounts = [100, 200, 300];

      const results = calculator.calculateBatch(pair, FixedCurrency.BASE, amounts);

      results.forEach((result, i) => {
        expect(result.baseAmount).toBe(amounts[i]);
        expect(result.rate).toBe(1.25);
      });
    });
  });

  describe('findRequiredBaseAmount', () => {
    it('should calculate required base amount for target counter amount', () => {
      const pair: CurrencyPair = { base: 'EUR', counter: 'GBP', rate: 0.86 };

      const requiredBase = calculator.findRequiredBaseAmount(pair, 860);

      expect(requiredBase).toBe(1000);
    });

    it('should handle decimal target amounts', () => {
      const pair: CurrencyPair = { base: 'USD', counter: 'EUR', rate: 0.85 };

      const requiredBase = calculator.findRequiredBaseAmount(pair, 42.5);

      expect(requiredBase).toBe(50);
    });

    it('should return precise results with 8 decimal places', () => {
      const pair: CurrencyPair = { base: 'BTC', counter: 'USD', rate: 45000 };

      const requiredBase = calculator.findRequiredBaseAmount(pair, 1);

      expect(requiredBase).toBeCloseTo(0.00002222, 8);
    });
  });

  describe('findResultingCounterAmount', () => {
    it('should calculate resulting counter amount from base amount', () => {
      const pair: CurrencyPair = { base: 'EUR', counter: 'GBP', rate: 0.86 };

      const resultingCounter = calculator.findResultingCounterAmount(pair, 1000);

      expect(resultingCounter).toBe(860);
    });

    it('should handle decimal base amounts', () => {
      const pair: CurrencyPair = { base: 'USD', counter: 'EUR', rate: 0.85 };

      const resultingCounter = calculator.findResultingCounterAmount(pair, 50.5);

      expect(resultingCounter).toBeCloseTo(42.925, 3);
    });
  });

  describe('analyzeRate', () => {
    it('should identify rate below 1', () => {
      const analysis = calculator.analyzeRate(0.85);

      expect(analysis.position).toBe('below');
      expect(analysis.description).toContain('below 1');
      expect(analysis.description).toContain('0.85');
    });

    it('should identify rate equal to 1', () => {
      const analysis = calculator.analyzeRate(1);

      expect(analysis.position).toBe('at');
      expect(analysis.description).toContain('exactly 1');
    });

    it('should identify rate above 1', () => {
      const analysis = calculator.analyzeRate(110);

      expect(analysis.position).toBe('above');
      expect(analysis.description).toContain('above 1');
      expect(analysis.description).toContain('110');
    });
  });

  describe('formatResult', () => {
    it('should format result as readable string', () => {
      const pair: CurrencyPair = { base: 'USD', counter: 'EUR', rate: 0.85 };

      const result = calculator.calculate({
        pair,
        fixedCurrency: FixedCurrency.BASE,
        fixedAmount: 100
      });

      const formatted = calculator.formatResult(result);

      expect(formatted).toContain('USD/EUR');
      expect(formatted).toContain('0.85');
      expect(formatted).toContain('100.00000000 USD');
      expect(formatted).toContain('85.00000000 EUR');
    });
  });

  describe('calculation symmetry', () => {
    it('should produce symmetric results for forward and backward calculations', () => {
      const pair: CurrencyPair = { base: 'AUD', counter: 'CAD', rate: 0.92 };

      const forward = calculator.calculate({
        pair,
        fixedCurrency: FixedCurrency.BASE,
        fixedAmount: 500
      });

      const backward = calculator.calculate({
        pair,
        fixedCurrency: FixedCurrency.COUNTER,
        fixedAmount: forward.counterAmount
      });

      expect(forward.baseAmount).toBeCloseTo(backward.baseAmount, 6);
      expect(forward.counterAmount).toBeCloseTo(backward.counterAmount, 6);
    });
  });

  describe('edge cases', () => {
    it('should handle zero amount', () => {
      const pair: CurrencyPair = { base: 'USD', counter: 'EUR', rate: 0.85 };

      const result = calculator.calculate({
        pair,
        fixedCurrency: FixedCurrency.BASE,
        fixedAmount: 0
      });

      expect(result.baseAmount).toBe(0);
      expect(result.counterAmount).toBe(0);
    });

    it('should handle very large amounts', () => {
      const pair: CurrencyPair = { base: 'USD', counter: 'EUR', rate: 0.85 };

      const result = calculator.calculate({
        pair,
        fixedCurrency: FixedCurrency.BASE,
        fixedAmount: 1000000000
      });

      expect(result.baseAmount).toBe(1000000000);
      expect(result.counterAmount).toBe(850000000);
    });

    it('should handle very large rates', () => {
      const pair: CurrencyPair = { base: 'USD', counter: 'VND', rate: 23000 };

      const result = calculator.calculate({
        pair,
        fixedCurrency: FixedCurrency.BASE,
        fixedAmount: 100
      });

      expect(result.counterAmount).toBe(2300000);
    });
  });
});
