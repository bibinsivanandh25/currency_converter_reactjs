import { FaExchangeAlt } from "react-icons/fa";
import { Country_List } from "../constants/countries";
import { useCallback, useEffect, useState } from "react";
import "./currencyConverter.css";

const CurrencyConverter = () => {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("GBP");
  const [exchangeRate, setExchangeRate] = useState(0);
  const [loading, setLoading] = useState(false);
  const [exchangeIcon, setExchangeIcon] = useState(false);
  const [exchange, setExchange] = useState(false);

  const list = Object.keys(Country_List).map((code) => (
    <option key={code} value={code}>
      {code}
    </option>
  ));

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handleFromCurrencyChange = (e) => {
    setFromCurrency(e.target.value);
  };

  const handleToCurrencyChange = (e) => {
    setToCurrency(e.target.value);
  };

  const getExchangeRate = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://v6.exchangerate-api.com/v6/a5c609a73dfd1ee0a099ee3c/latest/${fromCurrency}`
      );
      const result = await response.json();
      const exchangeRate = result.conversion_rates[toCurrency];
      console.log(exchangeRate);
      setExchangeRate(exchangeRate);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching exchange rate:", error);
      setExchangeRate(null);
    }
    setLoading(false);
  }, [fromCurrency, toCurrency]);

  const handleExchangeClick = (e) => {
    e.preventDefault();
    getExchangeRate();
    setExchange(true);
  };

  const handleReverseClick = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setExchangeIcon(true);
  };

  useEffect(() => {
    getExchangeRate();
  }, [getExchangeRate]);

  useEffect(() => {
    if (exchangeIcon) {
      const timer = setTimeout(() => {
        setExchangeIcon(false);
      }, 1000);

      //? reset rotate
      return () => clearTimeout(timer);
    }
  }, [exchangeIcon]);

  return (
    <main className="container">
      <h2>Currency Converter</h2>
      <form>
        <div className="amount">
          <p>Amount</p>
          <input type="text" value={amount} onChange={handleAmountChange} />
        </div>
        <div className="convert-box">
          <div className="from">
            <p>From</p>
            <div className="select-input">
              <img
                src={`https://flagcdn.com/48x36/${Country_List[
                  fromCurrency
                ].toLowerCase()}.png`}
                alt={fromCurrency}
              />
              <select value={fromCurrency} onChange={handleFromCurrencyChange}>
                {list}
              </select>
            </div>
          </div>
          <div className="reverse">
            <FaExchangeAlt
              onClick={handleReverseClick}
              className={exchangeIcon ? "rotateIcon" : ""}
            />
          </div>
          <div className="to">
            <p>To</p>
            <div className="select-input">
              <img
                src={`https://flagcdn.com/48x36/${Country_List[
                  toCurrency
                ].toLowerCase()}.png`}
                alt={toCurrency}
              />
              <select value={toCurrency} onChange={handleToCurrencyChange}>
                {list}
              </select>
            </div>
          </div>
          {exchange ? (
            <div className="result">
              {loading
                ? "Getting exchange rate..."
                : `${amount} ${fromCurrency} = ${(
                    amount * exchangeRate
                  ).toFixed(2)} ${toCurrency}`}
            </div>
          ) : (
            <div className="result" />
          )}
          <button onClick={handleExchangeClick}>Exchange</button>
        </div>
      </form>
    </main>
  );
};

export default CurrencyConverter;
