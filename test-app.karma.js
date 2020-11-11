// I did not provide tests for functions arguments types as I expect them always to be correct.

describe('Test trackExchangeRate app', function () {
  var fillHashMap = function () {
    trackExchangeRate.setExchangeRate("EUR", "USD", 1.25);
    trackExchangeRate.setExchangeRate("USD", "AUD", 0.8);
    trackExchangeRate.setExchangeRate("AUD", "SEK", 1);
    trackExchangeRate.setExchangeRate("AUD", "NZD", 1.5);
    trackExchangeRate.setExchangeRate("NZD", "SEK", 1);
    trackExchangeRate.setExchangeRate("USD", "SEK", 1.5);
  };

  beforeEach(function () {
    trackExchangeRate.clearData();
  });

  it('Should exist', function () {
    expect(trackExchangeRate).not.toBe(undefined);
  });

  describe("When setExchangeRate called", function () {
    beforeEach(function () {
      trackExchangeRate.setExchangeRate("EUR", "USD", 1.25);
    });

    it('Should add currencies pair exchange rate in the hash map, if it doesn`t exist before', function () {
      var hashMap = trackExchangeRate.getCurrencyHashMap();
      expect(hashMap['EURUSD']._).toBe(1.25);
    });

    it('Should update currencies pair exchange rate in the hash map if it already exist', function () {
      trackExchangeRate.setExchangeRate("EUR", "USD", 1);
      var hashMap = trackExchangeRate.getCurrencyHashMap();
      expect(hashMap['EURUSD']._).toBe(1);
      expect(hashMap['EURUSD']._).not.toBe(1.25, 'failure mean setExchangeRate doesn`t update currency pair change rate');
    });

    it('Should withstand thousands calls that would Add|Update currencies pair exchange rate in hash map', function () {
      for (var i = 0; i < 100000; i++) fillHashMap();

      var hashMap = trackExchangeRate.getCurrencyHashMap();
      expect(Object.keys(hashMap).length).toBe(12); // 6 original pair + 6 reverted pairs
    });
  });

  describe("When getExchangeRate called", function () {
    beforeEach(function () {
      trackExchangeRate.setExchangeRate("EUR", "USD", 1.25);
    });

    it('Should return exchange rate for the requested currencies if one exist, or else return 0', function () {
      expect(trackExchangeRate.getExchangeRate("EUR", "USD")).toBe(1.25);
      expect(trackExchangeRate.getExchangeRate("EUR", "AUD")).toBe(0);
    });

    describe("When have trackExchangeRate filled with data from calling fillHashMap()", function () {
      beforeEach(function () {
        fillHashMap();
      });

      it('Should find chain EUR -> USD -> AUD for getExchangeRate("EUR", "AUD")', function () {
        expect(trackExchangeRate.getExchangeRate("EUR", "AUD")).toBe(1); // EUR -> USD -> AUD
      });

      it('Should find chain AUD -> USD -> EUR for getExchangeRate("AUD", "EUR")', function () {
        expect(trackExchangeRate.getExchangeRate("AUD", "EUR")).toBe(1); // EUR -> USD -> AUD
      });
    });
  });
});