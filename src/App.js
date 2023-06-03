import React from "react";
import { Block } from "./Block";
import "./index.scss";

function App() {
  const [fromCurrency, setFromCurrency] = React.useState("RUB");
  const [toCurrency, setToCurrency] = React.useState("USD");
  const [fromPrice, setFromPrice] = React.useState(0);
  const [toPrice, setToPrice] = React.useState(1);

  // const [rates, setRates] = React.useState({});
  const ratesRef = React.useRef({});

  React.useEffect(() => {
    fetch("https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json")
      .then((res) => res.json())
      .then((json) => {
        ratesRef.current = json.reduce((acc, data) => {
          acc[data.cc] = data.rate;
          return acc;
        }, {});

        onChangeToPrice(1);
      })
      // setRates(
      //   json.reduce((acc, data) => {
      //     acc[data.cc] = data.rate;
      //     return acc;
      //   }, {})
      // );

      .catch((err) => {
        console.warn(err);
        alert("Не удалось получить информацию");
      });
  }, []);

  const onChangeFromPrice = (value) => {
    const price = value * ratesRef.current[fromCurrency];

    const result = price / ratesRef.current[toCurrency];

    setToPrice(result.toFixed(3));
    setFromPrice(value);
  };

  const onChangeToPrice = (value) => {
    const result =
      (ratesRef.current[toCurrency] / ratesRef.current[fromCurrency]) * value;
    setFromPrice(result.toFixed(3));
    setToPrice(value);
  };

  // const onChangeFromCurrency = (cur) => {
  //   setFromCurrency(cur);
  //   onChangeFromPrice(fromPrice);
  // };

  React.useEffect(() => {
    onChangeFromPrice(fromPrice);
  }, [fromCurrency]);

  React.useEffect(() => {
    onChangeToPrice(toPrice);
  }, [toCurrency]);

  return (
    <div className="App">
      <Block
        value={fromPrice}
        currency={fromCurrency}
        onChangeCurrency={setFromCurrency}
        onChangeValue={onChangeFromPrice}
      />
      <Block
        value={toPrice}
        currency={toCurrency}
        onChangeCurrency={setToCurrency}
        onChangeValue={onChangeToPrice}
      />
    </div>
  );
}

export default App;
