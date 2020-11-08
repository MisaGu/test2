var currencies: string[] = [
  'USD',
  'EUR',
  'JPY',
  'GBP',
  'AUD',
  'CAD',
  'CHF',
  'CNH',
  'SEK',
  'NZD',
], curMap = currencies.reduce((acc, currency) => [
  ...acc,
  ...currencies.filter(a => a != currency).map(b =>
    currencies.indexOf(b) < currencies.indexOf(currency) ?
      b + currency :
      currency + b
  )], []),
  currencyMap = {};

// console.log(curMap)

function setExchangeRate(
  firstCurrency: string,
  secondCurrency: string,
  exchangeRate: number
): void {
  currencyMap[firstCurrency + secondCurrency] = exchangeRate;
  currencyMap[secondCurrency + firstCurrency] = 1 / exchangeRate;
}

function getExchangeRate(
  firstCurrency: string,
  secondCurrency: string
): number {

  let keys = Object.keys(currencyMap);
  if (keys.length) {
    function s(a, _kk) {
      let kk = _kk || keys.filter(el => el.indexOf(a) == 0);
      let result = [];
      if (keys.indexOf(a + secondCurrency) != -1) result.push(a + secondCurrency);
      else {
        kk.forEach(k => {
          result.push(...s(k.slice(-3)))
        })
      }
      return result
    }

    let r = s(firstCurrency);
    console.log(r)
  }
  return 0;
}

let a = 0, b = 5;
for (let i = 0; i < b; i++) {
  currencyMap = {};
  let d1 = new Date();
  // console.time()
  for (let i = 0; i < 10000; i++) {
    setExchangeRate("EUR", "USD", 1.25);
    setExchangeRate("USD", "AUD", 1.25);
    setExchangeRate("EUR", "SEK", 1.25);
    setExchangeRate("EUR", "USD", 1.25);
    setExchangeRate("NZD", "AUD", 1.25);
  }
  // console.timeEnd()
  a += (new Date()).getTime() - d1.getTime()
}
// console.log(`${a / b}ms`)
// console.log(JSON.stringify(currencyMap, null, 2));

getExchangeRate("EUR", "AUD");
