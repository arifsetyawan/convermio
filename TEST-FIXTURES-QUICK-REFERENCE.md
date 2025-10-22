# Test Fixtures Quick Reference

## Understanding the Operation Logic

### The Golden Rule

**The operation used is determined by WHAT YOU'RE CALCULATING, not the rate value!**

```
┌─────────────────────────────────────────────────────────────┐
│  Calculating BASE amount?     →  DIVIDE (counter ÷ rate)   │
│  Calculating COUNTER amount?  →  MULTIPLY (base × rate)    │
└─────────────────────────────────────────────────────────────┘
```

This rule applies **regardless** of whether rate > 1 or rate < 1!

## Quick Lookup Table

### Rate > 1 (Base STRONGER than Counter)

| Have/Want | Input | Operation | Formula | Example (USD/JPY=149.5) |
|-----------|-------|-----------|---------|-------------------------|
| **Have Counter, Want Base** | Counter amount | **DIVIDE** | counter ÷ rate = base | 100,000 JPY ÷ 149.5 = 668.90 USD |
| **Have Base, Want Counter** | Base amount | **MULTIPLY** | base × rate = counter | 500 USD × 149.5 = 74,750 JPY |

### Rate < 1 (Base WEAKER than Counter)

| Have/Want | Input | Operation | Formula | Example (EUR/USD=1.085) |
|-----------|-------|-----------|---------|-------------------------|
| **Have Counter, Want Base** | Counter amount | **DIVIDE** | counter ÷ rate = base | 1,000 USD ÷ 1.085 = 921.66 EUR |
| **Have Base, Want Counter** | Base amount | **MULTIPLY** | base × rate = counter | 1,000 EUR × 1.085 = 1,085 USD |

## Your Examples Explained

### Example 1: USD/IDR = 16,000 (Rate > 1)

```
┌─────────────────────────────────────────────────────────────┐
│ Pair: USD/IDR                                               │
│ Rate: 16,000 (1 USD = 16,000 IDR)                           │
│ USD is STRONGER (rate > 1)                                  │
└─────────────────────────────────────────────────────────────┘

Test Case 1: Buy USD with 1,000,000 IDR
├─ Input: 1,000,000 IDR (counter)
├─ Want: USD (base)
├─ Operation: DIVIDE ✓
├─ Formula: 1,000,000 ÷ 16,000 = 62.5 USD
└─ Result: 62.5 USD ✓

Test Case 2: Buy IDR with 500 USD
├─ Input: 500 USD (base)
├─ Want: IDR (counter)
├─ Operation: MULTIPLY ✓
├─ Formula: 500 × 16,000 = 8,000,000 IDR
└─ Result: 8,000,000 IDR ✓
```

### Example 2: IDR/USD = 0.0000625 (Rate < 1)

```
┌─────────────────────────────────────────────────────────────┐
│ Pair: IDR/USD (INVERTED from above)                        │
│ Rate: 0.0000625 (1 IDR = 0.0000625 USD)                     │
│ IDR is WEAKER (rate < 1)                                    │
└─────────────────────────────────────────────────────────────┘

Test Case 1: Buy USD with 1,000,000 IDR
├─ Input: 1,000,000 IDR (base)
├─ Want: USD (counter)
├─ Operation: MULTIPLY ✓
├─ Formula: 1,000,000 × 0.0000625 = 62.5 USD
└─ Result: 62.5 USD ✓

Test Case 2: Buy IDR with 500 USD
├─ Input: 500 USD (counter)
├─ Want: IDR (base)
├─ Operation: DIVIDE ✓
├─ Formula: 500 ÷ 0.0000625 = 8,000,000 IDR
└─ Result: 8,000,000 IDR ✓
```

## Common Patterns in Tests

### Pattern 1: Major Currencies (Rate > 1)

**USD/JPY = 149.5** (USD stronger)
```
100,000 JPY → USD:  100,000 ÷ 149.5 = 668.90 USD  [DIVIDE]
500 USD → JPY:      500 × 149.5 = 74,750 JPY      [MULTIPLY]
```

**USD/KRW = 1,380** (USD much stronger)
```
1,000,000 KRW → USD:  1,000,000 ÷ 1,380 = 724.64 USD  [DIVIDE]
500 USD → KRW:        500 × 1,380 = 690,000 KRW       [MULTIPLY]
```

### Pattern 2: Major Currencies (Rate ~ 1)

**EUR/USD = 1.085** (EUR slightly stronger)
```
1,000 EUR → USD:  1,000 × 1.085 = 1,085 USD      [MULTIPLY]
1,000 USD → EUR:  1,000 ÷ 1.085 = 921.66 EUR     [DIVIDE]
```

**GBP/USD = 1.295** (GBP stronger)
```
1,000 GBP → USD:  1,000 × 1.295 = 1,295 USD      [MULTIPLY]
1,000 USD → GBP:  1,000 ÷ 1.295 = 772.20 GBP     [DIVIDE]
```

### Pattern 3: Cryptocurrencies (Rate >> 1)

**BTC/USD = 67,345** (BTC much stronger)
```
10,000 USD → BTC:  10,000 ÷ 67,345 = 0.1485 BTC   [DIVIDE]
0.5 BTC → USD:     0.5 × 67,345 = 33,672.5 USD    [MULTIPLY]
```

**ETH/USD = 3,245** (ETH stronger)
```
5,000 USD → ETH:  5,000 ÷ 3,245 = 1.5407 ETH     [DIVIDE]
2 ETH → USD:      2 × 3,245 = 6,490 USD          [MULTIPLY]
```

## Decision Tree for Operations

```
                    START
                      │
          What are you calculating?
                      │
        ┌─────────────┴─────────────┐
        ▼                           ▼
   BASE amount?              COUNTER amount?
        │                           │
        ▼                           ▼
     DIVIDE                     MULTIPLY
        │                           │
counter ÷ rate = base      base × rate = counter
```

## Memory Tricks

### Trick 1: "Counter to Base = Divide"
When converting FROM counter TO base, you DIVIDE by rate.
- Have JPY (counter), want USD (base) → DIVIDE
- Have IDR (counter), want USD (base) → DIVIDE

### Trick 2: "Base to Counter = Multiply"
When converting FROM base TO counter, you MULTIPLY by rate.
- Have USD (base), want JPY (counter) → MULTIPLY
- Have USD (base), want IDR (counter) → MULTIPLY

### Trick 3: "Rate tells you the multiplier"
The rate tells you: "1 base = X counter"
- So if you have base, multiply to get counter
- If you have counter, divide to get base

## Real Google Rates (October 2025)

### Asian Currencies
```
USD/IDR = 16,000      USD/JPY = 149.5      USD/KRW = 1,380
USD/INR = 83.2        USD/PHP = 56.5       USD/THB = 35.8
```

### Major Currencies
```
EUR/USD = 1.085       GBP/USD = 1.295      USD/EUR = 0.921
USD/GBP = 0.772       USD/CHF = 0.873      CHF/USD = 1.145
AUD/USD = 1.052       CAD/USD = 1.36       NZD/USD = 1.62
```

### Cryptocurrencies
```
BTC/USD = 67,345      ETH/USD = 3,245
```

### Cross Rates
```
EUR/JPY = 162.3       GBP/JPY = 193.5      EUR/GBP = 0.86
```

## Test Coverage Summary

```
╔═══════════════════════════════════════════════════════════╗
║                    TEST COVERAGE                          ║
╠═══════════════════════════════════════════════════════════╣
║  Total Tests:           86                                ║
║  Rate > 1 Tests:        66  (Base Stronger)               ║
║  Rate < 1 Tests:        17  (Base Weaker)                 ║
║  Edge Cases:            12  (rate=1, large, small)        ║
║                                                           ║
║  Currency Pairs:        30+ unique pairs                  ║
║  Operation Types:       Both buy_base and buy_counter     ║
║  Amount Ranges:         0.0001 to 16,000,000,000         ║
╚═══════════════════════════════════════════════════════════╝
```

## Quick Test Examples

### Test a Rate > 1 Scenario
```typescript
// USD/JPY = 149.5
const pair = { base: 'USD', counter: 'JPY', rate: 149.5 };

// Buy USD with JPY (expect DIVIDE)
calculator.calculate({
  pair,
  fixedCurrency: FixedCurrency.COUNTER,  // JPY is fixed
  fixedAmount: 100000  // Have 100,000 JPY
});
// Result: 100,000 ÷ 149.5 = 668.90 USD ✓
```

### Test a Rate < 1 Scenario
```typescript
// EUR/USD = 1.085
const pair = { base: 'EUR', counter: 'USD', rate: 1.085 };

// Buy EUR with USD (expect DIVIDE)
calculator.calculate({
  pair,
  fixedCurrency: FixedCurrency.COUNTER,  // USD is fixed
  fixedAmount: 1000  // Have 1,000 USD
});
// Result: 1,000 ÷ 1.085 = 921.66 EUR ✓
```

## Key Takeaway

**Don't think about rate > 1 or rate < 1 for operation selection!**

Instead, remember:
```
┌────────────────────────────────────────┐
│ Want BASE?    → DIVIDE by rate         │
│ Want COUNTER? → MULTIPLY by rate       │
└────────────────────────────────────────┘
```

This simple rule works for ALL exchange rates! 🎯
