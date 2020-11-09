var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var currencies = [
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
], curMap = currencies.reduce(function (acc, currency) { return __spreadArrays(acc, currencies
    .filter(function (a) { return a != currency; })
    .map(function (b) {
    return currencies.indexOf(b) < currencies.indexOf(currency)
        ? b + currency
        : currency + b;
})); }, []), currencyMap = {}, mapE = {};
// console.log(curMap)
function setExchangeRate(firstCurrency, secondCurrency, exchangeRate) {
    var _a = [firstCurrency + secondCurrency, secondCurrency + firstCurrency], f = _a[0], l = _a[1];
    if (!currencyMap[f]) {
        currencyMap[f] = { _: exchangeRate };
        if (!mapE[secondCurrency])
            mapE[secondCurrency] = [];
        mapE[secondCurrency].push([currencyMap[f]]);
        for (var key in mapE[firstCurrency]) {
            var temp = [];
            for (var y in mapE[firstCurrency][key])
                temp[y] = mapE[firstCurrency][key][y];
            temp.push(currencyMap[f]);
            mapE[secondCurrency].push(temp);
        }
    }
    else
        currencyMap[f]._ = exchangeRate;
    if (!currencyMap[l])
        currencyMap[l] = { _: 1 / exchangeRate };
    else
        currencyMap[l]._ = 1 / exchangeRate;
}
function getExchangeRate(firstCurrency, secondCurrency) {
    var f = firstCurrency + secondCurrency, _ = 0;
    if (currencyMap[f])
        _ = currencyMap[f]._;
    else if (mapE[secondCurrency]) {
        for (var k in currencyMap) {
            if (k.indexOf(firstCurrency) == 0) {
                for (var r in mapE[secondCurrency]) {
                    if (mapE[secondCurrency][r][0] == currencyMap[k]) {
                        _ = 1;
                        for (var o in mapE[secondCurrency][r])
                            _ *= mapE[secondCurrency][r][o]._;
                        break;
                    }
                }
            }
        }
    }
    return _;
}
var a = 0, b = 5;
for (var i = 0; i < b; i++) {
    currencyMap = {};
    mapE = {};
    var d1 = new Date();
    // console.time();
    for (var i_1 = 0; i_1 < 100000; i_1++) {
        setExchangeRate("EUR", "USD", 1.25);
        setExchangeRate("USD", "AUD", 0.8);
        setExchangeRate("AUD", "SEK", 1);
        setExchangeRate("AUD", "NZD", 1.5);
        setExchangeRate("NZD", "SEK", 1);
    }
    // console.timeEnd();
    a += new Date().getTime() - d1.getTime();
}
console.log(a / b + "ms");
setExchangeRate("USD", "AUD", 0.9);
setExchangeRate("AUD", "SEK", 2.25);
console.log(getExchangeRate("EUR", "SEK"));
console.log("\n======================\n");
