import {
  CurrencyPairCalculator,
  CurrencyPair,
  FixedCurrency
} from './currency-calculator';

interface RateTestFixture {
  id: string;
  description: string;
  pair: CurrencyPair;
  operation: 'buy_base' | 'buy_counter';
  inputAmount: number;
  expectedOutput: number;
  tolerance: number;
}

const calculator = new CurrencyPairCalculator();

function runFixtureTest(fixture: RateTestFixture) {
  const fixedCurrency = fixture.operation === 'buy_base'
    ? FixedCurrency.COUNTER
    : FixedCurrency.BASE;

  const result = calculator.calculate({
    pair: fixture.pair,
    fixedCurrency,
    fixedAmount: fixture.inputAmount
  });

  const actualOutput = fixture.operation === 'buy_base'
    ? result.baseAmount
    : result.counterAmount;

  expect(Math.abs(actualOutput - fixture.expectedOutput)).toBeLessThanOrEqual(fixture.tolerance);
}

describe('Real Exchange Rate Fixtures', () => {
  describe('Rate > 1 (Base Stronger)', () => {
    const fixtures: RateTestFixture[] = [
      {
        id: 'USDIDR-001',
        description: 'USD/IDR: Buy USD with 1,000,000 IDR',
        pair: { base: 'USD', counter: 'IDR', rate: 16000 },
        operation: 'buy_base',
        inputAmount: 1000000,
        expectedOutput: 62.5,
        tolerance: 0.01
      },
      {
        id: 'USDIDR-002',
        description: 'USD/IDR: Buy IDR with 500 USD',
        pair: { base: 'USD', counter: 'IDR', rate: 16000 },
        operation: 'buy_counter',
        inputAmount: 500,
        expectedOutput: 8000000,
        tolerance: 0.01
      },
      {
        id: 'USDJPY-001',
        description: 'USD/JPY: Buy USD with 100,000 JPY',
        pair: { base: 'USD', counter: 'JPY', rate: 149.5 },
        operation: 'buy_base',
        inputAmount: 100000,
        expectedOutput: 668.90,
        tolerance: 0.01
      },
      {
        id: 'USDJPY-002',
        description: 'USD/JPY: Buy JPY with 500 USD',
        pair: { base: 'USD', counter: 'JPY', rate: 149.5 },
        operation: 'buy_counter',
        inputAmount: 500,
        expectedOutput: 74750,
        tolerance: 0.01
      },
      {
        id: 'USDKRW-001',
        description: 'USD/KRW: Buy USD with 1,000,000 KRW',
        pair: { base: 'USD', counter: 'KRW', rate: 1380 },
        operation: 'buy_base',
        inputAmount: 1000000,
        expectedOutput: 724.64,
        tolerance: 0.01
      },
      {
        id: 'USDINR-001',
        description: 'USD/INR: Buy USD with 50,000 INR',
        pair: { base: 'USD', counter: 'INR', rate: 83.2 },
        operation: 'buy_base',
        inputAmount: 50000,
        expectedOutput: 600.96153846,
        tolerance: 0.1
      },
      {
        id: 'BTCUSD-001',
        description: 'BTC/USD: Buy BTC with 10,000 USD',
        pair: { base: 'BTC', counter: 'USD', rate: 67345 },
        operation: 'buy_base',
        inputAmount: 10000,
        expectedOutput: 0.1485,
        tolerance: 0.0001
      },
      {
        id: 'ETHUSD-001',
        description: 'ETH/USD: Buy ETH with 5,000 USD',
        pair: { base: 'ETH', counter: 'USD', rate: 3245 },
        operation: 'buy_base',
        inputAmount: 5000,
        expectedOutput: 1.54083205,
        tolerance: 0.001
      }
    ];

    fixtures.forEach(fixture => {
      it(fixture.description, () => {
        runFixtureTest(fixture);
      });
    });
  });

  describe('Rate < 1 (Base Weaker)', () => {
    const fixtures: RateTestFixture[] = [
      {
        id: 'IDRUSD-001',
        description: 'IDR/USD: Buy USD with 1,000,000 IDR',
        pair: { base: 'IDR', counter: 'USD', rate: 0.0000625 },
        operation: 'buy_counter',
        inputAmount: 1000000,
        expectedOutput: 62.5,
        tolerance: 0.01
      },
      {
        id: 'IDRUSD-002',
        description: 'IDR/USD: Buy IDR with 500 USD',
        pair: { base: 'IDR', counter: 'USD', rate: 0.0000625 },
        operation: 'buy_base',
        inputAmount: 500,
        expectedOutput: 8000000,
        tolerance: 0.01
      },
      {
        id: 'EURUSD-001',
        description: 'EUR/USD: Buy USD with 1,000 EUR',
        pair: { base: 'EUR', counter: 'USD', rate: 1.085 },
        operation: 'buy_counter',
        inputAmount: 1000,
        expectedOutput: 1085,
        tolerance: 0.01
      },
      {
        id: 'GBPUSD-001',
        description: 'GBP/USD: Buy USD with 1,000 GBP',
        pair: { base: 'GBP', counter: 'USD', rate: 1.295 },
        operation: 'buy_counter',
        inputAmount: 1000,
        expectedOutput: 1295,
        tolerance: 0.01
      },
      {
        id: 'USDEUR-001',
        description: 'USD/EUR: Buy EUR with 1,000 USD',
        pair: { base: 'USD', counter: 'EUR', rate: 0.921 },
        operation: 'buy_counter',
        inputAmount: 1000,
        expectedOutput: 921,
        tolerance: 0.01
      },
      {
        id: 'EURGBP-001',
        description: 'EUR/GBP: Buy GBP with 1,000 EUR',
        pair: { base: 'EUR', counter: 'GBP', rate: 0.86 },
        operation: 'buy_counter',
        inputAmount: 1000,
        expectedOutput: 860,
        tolerance: 0.01
      }
    ];

    fixtures.forEach(fixture => {
      it(fixture.description, () => {
        runFixtureTest(fixture);
      });
    });
  });

  describe('Edge Cases', () => {
    const fixtures: RateTestFixture[] = [
      {
        id: 'EDGE-001',
        description: 'USD/USDC: Buy USDC with 1,000 USD (rate = 1)',
        pair: { base: 'USD', counter: 'USDC', rate: 1.0 },
        operation: 'buy_counter',
        inputAmount: 1000,
        expectedOutput: 1000,
        tolerance: 0.01
      },
      {
        id: 'EDGE-002',
        description: 'USD/IDR: Buy IDR with 1,000,000 USD (large amount)',
        pair: { base: 'USD', counter: 'IDR', rate: 16000 },
        operation: 'buy_counter',
        inputAmount: 1000000,
        expectedOutput: 16000000000,
        tolerance: 100
      },
      {
        id: 'EDGE-003',
        description: 'BTC/USD: Buy BTC with 10 USD (small amount)',
        pair: { base: 'BTC', counter: 'USD', rate: 67345 },
        operation: 'buy_base',
        inputAmount: 10,
        expectedOutput: 0.00014851,
        tolerance: 0.0000001
      }
    ];

    fixtures.forEach(fixture => {
      it(fixture.description, () => {
        runFixtureTest(fixture);
      });
    });
  });
});
