# Currency Pair Calculator - Visual Concepts

## 1. Currency Pair Structure

```
┌─────────────────────────────────────────┐
│         CURRENCY PAIR                   │
│                                         │
│  BASE Currency  /  COUNTER Currency     │
│      USD        /       EUR             │
│                                         │
│  Rate: 0.85                             │
│  (1 USD = 0.85 EUR)                     │
└─────────────────────────────────────────┘
```

## 2. Rate Positions Relative to 1

```
        RATE < 1                RATE = 1               RATE > 1
   ─────────────────       ─────────────────      ─────────────────
   Base WEAKER than         Base EQUAL to         Base STRONGER than
      Counter                 Counter                  Counter
   
   Example:                 Example:               Example:
   USD/EUR = 0.85          USD/USDC = 1.0         USD/JPY = 110
   
   100 USD → 85 EUR        100 USD → 100 USDC     100 USD → 11,000 JPY
   
   ↓ Loss of value         ↔ Same value           ↑ Gain in value
```

## 3. Calculation Flow - Fixed Base

```
╔═══════════════════════════════════════════════════════════════╗
║                    FIXED BASE CALCULATION                      ║
╚═══════════════════════════════════════════════════════════════╝

Input:
┌──────────────┐
│ Base Amount  │  = 100 USD (FIXED/KNOWN)
└──────────────┘
       │
       │  Multiply by Rate (0.85)
       ▼
┌──────────────┐
│Counter Amount│  = 100 × 0.85 = 85 EUR (CALCULATED)
└──────────────┘

Formula: COUNTER = BASE × RATE
```

## 4. Calculation Flow - Fixed Counter

```
╔═══════════════════════════════════════════════════════════════╗
║                  FIXED COUNTER CALCULATION                     ║
╚═══════════════════════════════════════════════════════════════╝

Input:
┌──────────────┐
│Counter Amount│  = 85 EUR (FIXED/KNOWN)
└──────────────┘
       │
       │  Divide by Rate (0.85)
       ▼
┌──────────────┐
│ Base Amount  │  = 85 ÷ 0.85 = 100 USD (CALCULATED)
└──────────────┘

Formula: BASE = COUNTER ÷ RATE
```

## 5. Real-World Scenario Flow

```
╔═════════════════════════════════════════════════════════════════╗
║              TRAVEL MONEY EXCHANGE SCENARIO                     ║
╚═════════════════════════════════════════════════════════════════╝

Situation: Going to Japan, need spending money

┌─────────────────┐
│  Have: $500 USD │ (Base - What you have)
└─────────────────┘
        │
        │  Exchange at rate: 1 USD = 148.5 JPY
        │
        ▼
┌──────────────────┐
│  Get: 74,250 JPY │ (Counter - What you get)
└──────────────────┘

Pair Configuration:
  base: "USD"
  counter: "JPY"
  rate: 148.5
  fixedCurrency: BASE (because you know your USD amount)
  fixedAmount: 500
```

## 6. Inverted Pair Concept

```
╔═══════════════════════════════════════════════════════════════╗
║                    PAIR INVERSION                             ║
╚═══════════════════════════════════════════════════════════════╝

Original Pair:                Inverted Pair:
┌──────────────┐             ┌──────────────┐
│   EUR/USD    │    ═══>     │   USD/EUR    │
│  Rate: 1.18  │             │ Rate: 0.847  │
└──────────────┘             └──────────────┘

1 EUR = 1.18 USD              1 USD = 0.847 EUR

Inversion Formula: New Rate = 1 ÷ Original Rate
                   0.847 = 1 ÷ 1.18
```

## 7. Component Relationships

```
┌─────────────────────────────────────────────────────────────┐
│                    CALCULATION INPUT                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐                                           │
│  │ Currency Pair│                                           │
│  ├──────────────┤                                           │
│  │ • Base       │ ─────────┐                                │
│  │ • Counter    │          │                                │
│  │ • Rate       │          │                                │
│  └──────────────┘          │                                │
│                            │                                │
│  ┌──────────────┐          │      ┌────────────────┐       │
│  │Fixed Currency│ ─────────┼─────>│   CALCULATOR   │       │
│  ├──────────────┤          │      └────────────────┘       │
│  │ BASE or      │          │              │                │
│  │ COUNTER      │          │              │                │
│  └──────────────┘          │              ▼                │
│                            │      ┌────────────────┐       │
│  ┌──────────────┐          │      │     RESULT     │       │
│  │Fixed Amount  │ ─────────┘      ├────────────────┤       │
│  ├──────────────┤                 │ • Base Amount  │       │
│  │ Numeric Value│                 │ • Counter Amt  │       │
│  └──────────────┘                 │ • Description  │       │
│                                    └────────────────┘       │
└─────────────────────────────────────────────────────────────┘
```

## 8. Decision Tree: Which Currency is Fixed?

```
                    START
                      │
                      ▼
        ┌─────────────────────────┐
        │ What do you know?       │
        └─────────────────────────┘
                  │
        ┌─────────┴─────────┐
        ▼                   ▼
┌──────────────┐    ┌──────────────┐
│ I know how   │    │ I know how   │
│ much BASE I  │    │ much COUNTER │
│ have/need    │    │ I want       │
└──────────────┘    └──────────────┘
        │                   │
        ▼                   ▼
  FixedCurrency          FixedCurrency
  = BASE                 = COUNTER
        │                   │
        ▼                   ▼
  Calculate              Calculate
  COUNTER               BASE
  Amount                Amount

Examples:
┌─────────────────────────────────────────────┐
│ "I have $100, how much EUR?" → Fixed BASE   │
│ "I want €100, how much USD?" → Fixed COUNTER│
└─────────────────────────────────────────────┘
```

## 9. Batch Processing Visualization

```
╔═══════════════════════════════════════════════════════════════╗
║                    BATCH CALCULATION                          ║
╚═══════════════════════════════════════════════════════════════╝

Input: Multiple amounts with same pair

Amounts: [10, 50, 100, 500]
Pair: USD/EUR @ 0.85

Process:
┌────────┐   ┌────────┐   ┌────────┐   ┌────────┐
│ 10 USD │   │ 50 USD │   │100 USD │   │500 USD │
└────────┘   └────────┘   └────────┘   └────────┘
    │            │            │            │
    │ ×0.85      │ ×0.85      │ ×0.85      │ ×0.85
    ▼            ▼            ▼            ▼
┌────────┐   ┌────────┐   ┌────────┐   ┌────────┐
│ 8.5EUR │   │ 42.5EUR│   │ 85 EUR │   │425 EUR │
└────────┘   └────────┘   └────────┘   └────────┘

Result: Array of 4 calculation results
```

## 10. Use Case Matrix

```
┌────────────────────────────────────────────────────────────────┐
│                    USE CASE SELECTION                          │
├────────────────┬───────────────┬────────────────┬──────────────┤
│   Scenario     │  Fixed        │  Example       │   Rate Type  │
├────────────────┼───────────────┼────────────────┼──────────────┤
│ Travel         │ BASE          │ Have $500      │ Usually > 1  │
│                │               │ Need JPY       │ for USD      │
├────────────────┼───────────────┼────────────────┼──────────────┤
│ Crypto Buy     │ COUNTER       │ Want $1000     │ Usually > 1  │
│                │               │ worth of BTC   │              │
├────────────────┼───────────────┼────────────────┼──────────────┤
│ Invoice        │ BASE          │ Bill 5000 EUR  │ Varies       │
│ Payment        │               │ Need USD       │              │
├────────────────┼───────────────┼────────────────┼──────────────┤
│ Salary         │ BASE          │ Earn 80k USD   │ Varies       │
│ Conversion     │               │ Worth in EUR?  │              │
├────────────────┼───────────────┼────────────────┼──────────────┤
│ Budget         │ COUNTER       │ Need 1000 EUR  │ Varies       │
│ Planning       │               │ How much USD?  │              │
└────────────────┴───────────────┴────────────────┴──────────────┘
```

## 11. Rate Analysis Spectrum

```
           0.0                    1.0                   ∞
            │─────────────────────│─────────────────────│
            │                     │                     │
        RATE < 1              RATE = 1             RATE > 1
            │                     │                     │
    ┌───────▼────────┐    ┌──────▼─────┐    ┌─────────▼────────┐
    │ Base Weaker    │    │ Equal      │    │ Base Stronger    │
    │                │    │ Value      │    │                  │
    │ USD/EUR = 0.85 │    │ USD/USDC   │    │ USD/JPY = 110    │
    │                │    │ = 1.0      │    │                  │
    │ Lose value     │    │ No change  │    │ Gain value       │
    └────────────────┘    └────────────┘    └──────────────────┘

    Examples:             Examples:          Examples:
    • USD → EUR          • USD → USDC       • USD → JPY
    • GBP → USD          • Stablecoin       • EUR → JPY
    • EUR → CHF          pairs              • USD → INR
```

## 12. Complete Workflow Example

```
╔═══════════════════════════════════════════════════════════════╗
║         COMPLETE CALCULATION WORKFLOW                         ║
╚═══════════════════════════════════════════════════════════════╝

Scenario: Buying a product priced in EUR with USD

Step 1: Define Inputs
┌────────────────────────────────────┐
│ Product Price: 250 EUR             │
│ Exchange Rate: 1 USD = 0.85 EUR    │
│ Question: How much USD needed?     │
└────────────────────────────────────┘
                │
                ▼
Step 2: Configure Pair
┌────────────────────────────────────┐
│ Base: USD (what you have)          │
│ Counter: EUR (what you need)       │
│ Rate: 0.85                          │
│ Fixed: COUNTER (you know 250 EUR)  │
│ Amount: 250                         │
└────────────────────────────────────┘
                │
                ▼
Step 3: Calculate
┌────────────────────────────────────┐
│ BASE = COUNTER ÷ RATE               │
│ BASE = 250 ÷ 0.85                   │
│ BASE = 294.12 USD                   │
└────────────────────────────────────┘
                │
                ▼
Step 4: Result
┌────────────────────────────────────┐
│ You need $294.12 USD                │
│ to purchase 250 EUR worth of goods  │
└────────────────────────────────────┘
```

---

These visual concepts help understand the relationships between currency pairs,
rates, and calculations in the Currency Pair Amount Calculator.
