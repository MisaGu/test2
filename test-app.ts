const trackExchangeRate = new (function () {
  /**
   * @param {object} currHashMap: 2D object that contains currency pairs exchange rate
   * @param {object} currExchangeChainsList: 4D object that contains possible currencies exchange chains(ex.: USD -> AUD; USD -> EUR -> AUD)
   */
  var currencyHashMap = {},
    currencyExchangeChainsList = {};

  /**
   * Generate exchange chains for provided currency pair
   * @param {string} firstCurrency: Currency to exchange from
   * @param {string} secondCurrency: Currency to exchange to
   */
  function generateExchangeChains(
    firstCurrency: string,
    secondCurrency: string
  ) {
    /**  Calculate hashes */
    const [f, l] = [
      firstCurrency + secondCurrency,
      secondCurrency + firstCurrency,
    ];

    /** If chains list doesn't have `secondCurrency` currency as a key, add it */
    if (!currencyExchangeChainsList[secondCurrency])
      currencyExchangeChainsList[secondCurrency] = [];
    /** Add link to the hash of newly added currency pair in `currHashMap` */
    currencyExchangeChainsList[secondCurrency].push([currencyHashMap[f]]);

    /**
     * Check if any chains end on `firstCurrency` exist,
     * if so, copy that chain list to chain list for `secondCurrency`
     *
     * Ex.
     * Call setExchangeRate(EUR, USD, exRate):
     * {
     *  USD: [[ #EURUSD ]]
     * }
     * Call setExchangeRate(USD, AUD, exRate):
     * {
     *  USD: [[ #EURUSD ]]
     *  AUD: [[ #USDAUD ], [ #EURUSD, #USDAUD ]],
     * }
     */
    for (let key in currencyExchangeChainsList[firstCurrency]) {
      const temp = [];
      for (let y in currencyExchangeChainsList[firstCurrency][key])
        temp[y] = currencyExchangeChainsList[firstCurrency][key][y];
      temp.push(currencyHashMap[f]);
      currencyExchangeChainsList[secondCurrency].push(temp);

      const reversedTemp = [];
      let lastKey = null;
      for (let p = temp.length - 1; p >= 0; p--) {
        reversedTemp.push(
          currencyHashMap[(temp[+p + 1] || { k: secondCurrency }).k + temp[p].k]
        );
        lastKey = temp[p].k;
      }
      currencyExchangeChainsList[lastKey].push(reversedTemp);
    }
  }

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
    /**  Calculate hashes */
    const [f, l] = [
      firstCurrency + secondCurrency,
      secondCurrency + firstCurrency,
    ];
    const [_f, _l] = [currencyHashMap[f], currencyHashMap[l]];

    /** If hash not exist add it to `currHashMap` and calculate chains */
    if (!_f) {
      currencyHashMap[f] = { _: exchangeRate, k: firstCurrency };
    } else currencyHashMap[f]._ = exchangeRate;
    /** If hash exist update it value */

    /**
     * Add|Update the reversed hash:
     *
     * Ex.
     * Call setExchangeRate(EUR, USD, 1.25):
     * original hash: EURUSD: 1.25
     * reverted hash: USDEUR: 0.8
     */
    if (!_l) {
      currencyHashMap[l] = { _: 1 / exchangeRate, k: secondCurrency };
    } else currencyHashMap[l]._ = 1 / exchangeRate;

    if (!_f) generateExchangeChains(firstCurrency, secondCurrency);
    if (!_l) generateExchangeChains(secondCurrency, firstCurrency);
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
    const f = firstCurrency + secondCurrency,
      cc = currencyExchangeChainsList[secondCurrency];
    let result = 0;

    /** First check if pair can be considered as hash, and return */
    if (currencyHashMap[f]) result = currencyHashMap[f]._;
    /** Looking for the exchange chain to meet requirements */ else if (cc) {
      let chain = null;
      let keys = Object.keys(currencyHashMap);
      for (let k = 0; k < keys.length; k++) {
        if (keys[k].indexOf(firstCurrency) == 0) {
          for (let r = 0; r < cc.length; r++) {
            // Overwrite founded chain if shorter chain found
            if (
              cc[r][0] == currencyHashMap[k] &&
              (!chain || chain.length > cc[r].length)
            ) {
              chain = cc[r];
            }
          }
        }
      }

      // If chain has been found calculate it exchange rate value
      if (chain) {
        result = 1;
        for (let o in chain) result *= chain[o]._;
      }
    }
    return result;
  };

  this.getCurrencyHashMap = function () {
    return currencyHashMap;
  };

  this.getCurrencyExchangeChainsList = function () {
    return currencyExchangeChainsList;
  };

  this.clearData = function () {
    currencyHashMap = {};
    currencyExchangeChainsList = {};
  };
})();
