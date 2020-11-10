const trackExchangeRate2 = new (function () {
  /**
   * @param {object} currHashMap: 2D object that contains currency pairs exchange rate
   * @param {object} currExchangeChainsList: 4D object that contains possible currencies exchange chains(ex.: USD -> AUD; USD -> EUR -> AUD)
   */
  var currencyHashMap = {};

  /**
   * @param {string} firstCurrency: Currency to exchange from
   * @param {string} secondCurrency: Currency to exchange to
   * @param {number} exchangeRate: Exchange rate from `firstCurrency` to `secondCurrency`
   */
  this.setExchangeRate = function (
    firstCurrency: string,
    secondCurrency: string,
    exchangeRate: number
  ): void {
    currencyHashMap[firstCurrency + secondCurrency] = exchangeRate;
    currencyHashMap[secondCurrency + firstCurrency] = 1 / exchangeRate;
  };

  /**
   * Find and return  exchange currency rate
   * @param {string} firstCurrency: Currency to exchange from
   * @param {string} secondCurrency: Currency to exchange to
   * @returns {number)} 0 if exchange chain not exist, else return calculated exchange rate of the shortest exchange chain available
   */
  this.getExchangeRate = function (
    firstCurrency: string,
    secondCurrency: string
  ): number {
    let result = 0;

    function gen(cc, map) {
      let res = 1;
      for (let c in map) {
        if (c.indexOf(cc) == 0) {
          res *= map[c];
          let a = c.substr(3);
          delete map[c];

          console.log(res, c, cc, map)
          if (a != secondCurrency) res *= gen(a, map);
          else break;
        }
      }
      return res;
    }
    result = gen(firstCurrency, currencyHashMap)

    return result;
  };

  this.getCurrencyHashMap = function () {
    return currencyHashMap;
  };

  this.clearData = function () {
    currencyHashMap = {};
  };
})();


for (let i = 0; i < 1; i++) {
  trackExchangeRate2.setExchangeRate("EUR", "USD", 1.25);
  trackExchangeRate2.setExchangeRate("USD", "AUD", 0.8);
  // trackExchangeRate2.setExchangeRate("AUD", "SEK", 1);
  // trackExchangeRate2.setExchangeRate("AUD", "NZD", 1.5);
  // trackExchangeRate2.setExchangeRate("NZD", "SEK", 1);
  // trackExchangeRate2.setExchangeRate("USD", "SEK", 1);
}
// trackExchangeRate2.setExchangeRate("USD", "AUD", 0.9);
// trackExchangeRate2.setExchangeRate("AUD", "SEK", 2.25);


console.log(trackExchangeRate2.getExchangeRate("EUR", "AUD"));
// trackExchangeRate2.getExchangeRate("USD", "AUD");

console.log("\n==========================\n");