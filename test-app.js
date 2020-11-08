var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var currencies = [
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
], curMap = currencies.reduce(function (acc, currency) { return __spreadArrays(acc, currencies.filter(function (a) { return a != currency; }).map(function (b) {
    return currencies.indexOf(b) < currencies.indexOf(currency) ?
        b + currency :
        currency + b;
})); }, []), currencyMap = {};
// console.log(curMap)
function setExchangeRate(firstCurrency, secondCurrency, exchangeRate) {
    currencyMap[firstCurrency + secondCurrency] = exchangeRate;
    currencyMap[secondCurrency + firstCurrency] = 1 / exchangeRate;
}
function getExchangeRate(firstCurrency, secondCurrency) {
    var keys = Object.keys(currencyMap);
    if (keys.length) {
        function s(a, _kk) {
            var kk = _kk || keys.filter(function (el) { return el.indexOf(a) == 0; });
            var result = [];
            if (keys.indexOf(a + secondCurrency) != -1)
                result.push(a + secondCurrency);
            else {
                kk.forEach(function (k) {
                    result.push.apply(result, s(k.slice(-3)));
                });
            }
            return result;
        }
        var r = s(firstCurrency);
        console.log(r);
    }
    return 0;
}
var a = 0, b = 5;
for (var i = 0; i < b; i++) {
    currencyMap = {};
    var d1 = new Date();
    // console.time()
    for (var i_1 = 0; i_1 < 10000; i_1++) {
        setExchangeRate("EUR", "USD", 1.25);
        setExchangeRate("USD", "AUD", 1.25);
        setExchangeRate("EUR", "SEK", 1.25);
        setExchangeRate("EUR", "USD", 1.25);
        setExchangeRate("NZD", "AUD", 1.25);
    }
    // console.timeEnd()
    a += (new Date()).getTime() - d1.getTime();
}
// console.log(`${a / b}ms`)
// console.log(JSON.stringify(currencyMap, null, 2));
getExchangeRate("EUR", "AUD");
