var trackExchangeRate = new (function () {
    /**
    * @param {object} currHashMap: 2D object that contains currency pairs exchange rate
    * @param {object} currExchangeChainsList: 4D object that contains possible currencies exchange chains(ex.: USD -> AUD; USD -> EUR -> AUD)
    */
    var currencyHashMap = {}, currencyExchangeChainsList = {};
    /**
     * Generate exchange chains for provided currency pair
     * @param {string} firstCurrency: Currency to exchange from
     * @param {string} secondCurrency: Currency to exchange to
     */
    function generateExchangeChains(firstCurrency, secondCurrency) {
        /**  Calculate hashes */
        var _a = [firstCurrency + secondCurrency, secondCurrency + firstCurrency], f = _a[0], l = _a[1];
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
        for (var key in currencyExchangeChainsList[firstCurrency]) {
            var temp = [];
            for (var y in currencyExchangeChainsList[firstCurrency][key])
                temp[y] = currencyExchangeChainsList[firstCurrency][key][y];
            temp.push(currencyHashMap[f]);
            currencyExchangeChainsList[secondCurrency].push(temp);
        }
    }
    /**
     * @param {string} firstCurrency: Currency to exchange from
     * @param {string} secondCurrency: Currency to exchange to
     * @param {number} exchangeRate: Exchange rate from `firstCurrency` to `secondCurrency`
     */
    this.setExchangeRate = function (firstCurrency, secondCurrency, exchangeRate) {
        /**  Calculate hashes */
        var _a = [firstCurrency + secondCurrency, secondCurrency + firstCurrency], f = _a[0], l = _a[1];
        /** If hash not exist add it to `currHashMap` and calculate chains */
        if (!currencyHashMap[f]) {
            currencyHashMap[f] = { _: exchangeRate };
            generateExchangeChains(firstCurrency, secondCurrency);
        }
        /** If hash exist update it value */
        else
            currencyHashMap[f]._ = exchangeRate;
        /**
         * Add|Update the reversed hash:
         *
         * Ex.
         * Call setExchangeRate(EUR, USD, 1.25):
         * original hash: EURUSD: 1.25
         * reverted hash: USDEUR: 0.8
         */
        if (!currencyHashMap[l]) {
            currencyHashMap[l] = { _: 1 / exchangeRate };
            generateExchangeChains(secondCurrency, firstCurrency); // reverted chaining NOT WORK
        }
        else
            currencyHashMap[l]._ = 1 / exchangeRate;
    };
    /**
     * Find and return  exchange currency rate
     * @param {string} firstCurrency: Currency to exchange from
     * @param {string} secondCurrency: Currency to exchange to
     * @returns {number)} 0 if exchange chain not exist, else return calculated exchange rate of the shortest exchange chain available
     */
    this.getExchangeRate = function (firstCurrency, secondCurrency) {
        var f = firstCurrency + secondCurrency;
        var result = 0;
        /** First check if pair can be considered as hash, and return */
        if (currencyHashMap[f])
            result = currencyHashMap[f]._;
        /** Looking for the exchange chain to meet requirements */
        else if (currencyExchangeChainsList[secondCurrency]) {
            var chain = void 0;
            for (var k in currencyHashMap) {
                if (k.indexOf(firstCurrency) == 0) {
                    for (var r in currencyExchangeChainsList[secondCurrency]) {
                        if (currencyExchangeChainsList[secondCurrency][r][0] == currencyHashMap[k]) {
                            // Overwrite founded chain if shorter chain found 
                            if (!chain || chain.length > currencyExchangeChainsList[secondCurrency][r].length) {
                                chain = currencyExchangeChainsList[secondCurrency][r];
                            }
                        }
                    }
                }
            }
            // If chain has been found calculate it exchange rate value
            if (chain) {
                result = 1;
                for (var o in chain)
                    result *= chain[o]._;
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
});
trackExchangeRate.setExchangeRate("EUR", "USD", 1.25);
trackExchangeRate.setExchangeRate("USD", "AUD", 2);
// trackExchangeRate.setExchangeRate("AUD", "SEK", 1);
// trackExchangeRate.setExchangeRate("AUD", "NZD", 1.5);
// trackExchangeRate.setExchangeRate("NZD", "SEK", 1);
// trackExchangeRate.setExchangeRate("USD", "SEK", 1.5);
console.log(JSON.stringify(trackExchangeRate.getCurrencyExchangeChainsList(), null, 2));
console.log(trackExchangeRate.getExchangeRate("EUR", "AUD"));
console.log(trackExchangeRate.getExchangeRate("AUD", "EUR"));
console.log("\n==========================\n");
