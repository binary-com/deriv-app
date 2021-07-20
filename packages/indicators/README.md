# `@deriv/indicators`

**In this document**

-   [Simple Moving Average](#simple-moving-average)
-   [Exponential Moving Average (EMA)](<#exponential-moving-average-(EMA)>)
-   [Bollinger Band (BB)](<#bollinger-band-(BB)>)
-   [Relative Strength Index (RSI)](<#relative-strength-index-(RSI)>)
-   [Moving Average Convergence Divergence (MACD)](<#moving-average-convergence-divergence-(MACD)>)
-   [Usage](#usage)
    -   Indicators](#Indicators)

## Simple Moving Average

A simple moving average (SMA) is an arithmetic moving average calculated by adding the closing price of the security for a number of time periods and then dividing this total by the number of time periods.

-   [SMA @ Investopedia](http://www.investopedia.com/terms/s/sma.asp)
-   [What is the Simple Moving Average?](http://tradingsim.com/blog/simple-moving-average/)
-   [Moving Averages - Simple and Exponential](http://stockcharts.com/school/doku.php?id=chart_school:technical_indicators:moving_averages)

### Calculate a single value, from an array of numbers:

Input array of numbers:

```js
const data = [1, 10, 100, 1000, 10000];
const result = simpleMovingAverage(data, { periods: 3 });
```

### Calculate a single value from an array of candles:

```js
const data = [{ close: 1 }, { close: 2 }, { close: 3 }];
const result = simpleMovingAverage(data, { periods: 3, field: 'close' });
```

### Calculate an array of values from an array of numbers:

```
const data = [1, 2, 3, ...];
const result = simpleMovingAverageArray(data, { periods: 10 });
```

## Exponential Moving Average (EMA)

The 12- and 26-day EMAs are the most popular short-term averages, and they are used to create indicators like the moving average convergence divergence (MACD) and the percentage price oscillator (PPO). In general, the 50- and 200-day EMAs are used as signals of long-term trends.

-   [Moving Average @ Wikipedia](https://en.wikipedia.org/wiki/Moving_average)
-   [EMA @ Investopedia](http://www.investopedia.com/terms/e/ema.asp)

## Bollinger Band (BB)

Bollinger Bands® are volatility bands placed above and below a moving average. Volatility is based on the standard deviation, which changes as volatility increases and decreases. The bands automatically widen when volatility increases and narrow when volatility decreases.

-   [BB @ Investopedia](http://www.investopedia.com/terms/b/bollingerbands.asp)

### Calculate a single value, from an array of numbers:

Input array of numbers:

```
const data = [1, 10, 100, 1000, 10000];
const result = bollingerBands(data, { periods: 3 });
```

Returned value is an array of three items:

```
[middleValue, upperValue, lowerValue]
```

### Calculate a single value from an array of candles:

```
const data = [
    { close: 1 },
    { close: 2 },
    { close: 3 },
];
const result = bollingerBands(data, { periods: 3, field: 'close' });
```

### Calculate an array of values from an array of numbers:

```
const data = [1, 2, 3, ...];
const result = bollingerBandsArray(data, { periods: 10 });
```

## Relative Strength Index (RSI)

Relative Strength Index (RSI) is a momentum oscillator that measures the speed and change of price movements. RSI oscillates between zero and 100.

-   [RSI @ Investopedia](http://www.investopedia.com/terms/r/rsi.asp)
-   [RSI @ StockCharts](http://stockcharts.com/school/doku.php?id=chart_school:technical_indicators:relative_strength_index_rsi)

## Moving Average Convergence Divergence (MACD)

Moving average convergence divergence (MACD) is a trend-following momentum indicator that shows the relationship between two moving averages of prices. The MACD is calculated by subtracting the 26-day exponential moving average (EMA) from the 12-day EMA. A nine-day EMA of the MACD, called the "signal line", is then plotted on top of the MACD, functioning as a trigger for buy and sell signals.

-   [MACD @ Investopedia](http://www.investopedia.com/terms/m/macd.asp)

## Usage

### Indicators

```js
import { simpleMovingAverage } '@deriv/indicators'
```
