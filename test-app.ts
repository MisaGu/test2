var currencies: string[] = [
    "USD",
    "EUR",
    "JPY",
    "GBP",
    "AUD",
    "CAD",
    "CHF",
    "CNH",
    "SEK",
    "NZD",
  ],
  curMap = currencies.reduce(
    (acc, currency) => [
      ...acc,
      ...currencies
        .filter((a) => a != currency)
        .map((b) =>
          currencies.indexOf(b) < currencies.indexOf(currency)
            ? b + currency
            : currency + b
        ),
    ],
    []
  ),
  currencyMap = {},
  mapE = {};

// console.log(curMap)

function setExchangeRate(
  firstCurrency: string,
  secondCurrency: string,
  exchangeRate: number
): void {
  let [f, l] = [firstCurrency + secondCurrency, secondCurrency + firstCurrency];

  if (!currencyMap[f]) {
    currencyMap[f] = { _: exchangeRate };

    if (!mapE[secondCurrency]) mapE[secondCurrency] = [];
    mapE[secondCurrency].push([currencyMap[f]]);

    for (let key in mapE[firstCurrency]) {
      const temp = [];
      for (let y in mapE[firstCurrency][key])
        temp[y] = mapE[firstCurrency][key][y];
      temp.push(currencyMap[f]);
      mapE[secondCurrency].push(temp);
    }
  } else currencyMap[f]._ = exchangeRate;

  if (!currencyMap[l]) currencyMap[l] = { _: 1 / exchangeRate };
  else currencyMap[l]._ = 1 / exchangeRate;
}

function getExchangeRate(
  firstCurrency: string,
  secondCurrency: string
): number {
  let f = firstCurrency + secondCurrency,
    _ = 0;

  if (currencyMap[f]) _ = currencyMap[f]._;
  else if (mapE[secondCurrency]) {
    for (let k in currencyMap) {
      if (k.indexOf(firstCurrency) == 0) {
        for (let r in mapE[secondCurrency]) {
          if (mapE[secondCurrency][r][0] == currencyMap[k]) {
            _ = 1;
            for (let o in mapE[secondCurrency][r])
              _ *= mapE[secondCurrency][r][o]._;
            break;
          }
        }
      }
    }
  }
  return _;
}

let a = 0,
  b = 5;
for (let i = 0; i < b; i++) {
  currencyMap = {};
  mapE = {};
  let d1 = new Date();
  // console.time();
  for (let i = 0; i < 100000; i++) {
    setExchangeRate("EUR", "USD", 1.25);
    setExchangeRate("USD", "AUD", 0.8);
    setExchangeRate("AUD", "SEK", 1);
    setExchangeRate("AUD", "NZD", 1.5);
    setExchangeRate("NZD", "SEK", 1);
  }
  // console.timeEnd();
  a += new Date().getTime() - d1.getTime();
}
console.log(`${a / b}ms`);
setExchangeRate("USD", "AUD", 0.9);
setExchangeRate("AUD", "SEK", 2.25);

console.log(getExchangeRate("EUR", "SEK"))

console.log("\n======================\n");
