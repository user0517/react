import "./App.css";
import axios from "axios";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import { createContext, useState, useEffect, useRef } from "react";

export const StockDispatchContext = createContext();
export const StockStateContext = createContext();

function App() {
  const [stock, setStock] = useState([]);

  const idRef = useRef(0);

  const processStockData = (data, symbol) => {
    const timeSeries = data["Time Series (Daily)"];
    const today = Object.keys(timeSeries)[0];
    const previousDay = Object.keys(timeSeries)[1];
    const todayData = timeSeries[today];
    const previousData = timeSeries[previousDay];

    return {
      id: idRef.current++,
      symbol,
      today: todayData,
      previousDay: previousData,
    };
  };

  const fetchStockData = async () => {
    const API_key = `0UXZSDV1HVVDBKZD`;
    const symbol = ["MSFT"];
    const stockArr = [];

    for (const item of symbol) {
      try {
        const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${item}&apikey=${API_key}`;
        const { data } = await axios.get(url);
        const stockData = processStockData(data, item);
        stockArr.push(stockData);
      } catch (e) {
        console.log(e);
      }
    }

    setStock(stockArr);
  };

  const onSearchStock = async (keyWord) => {
    for (const item of stock) {
      if (keyWord === item.symbol) {
        return;
      }
    }

    const API_key = `0UXZSDV1HVVDBKZD`;

    try {
      const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${keyWord}&apikey=${API_key}`;
      const { data } = await axios.get(url);
      const stockData = processStockData(data, keyWord);
      setStock([...stock, stockData]);
    } catch (e) {
      console.log(e);
    }
  };

  const onDelete = (targetId) => {
    setStock(stock.filter((item) => item.id !== targetId));
  };

  useEffect(() => {
    fetchStockData();
  }, []);

  return (
    <StockDispatchContext.Provider value={{ onSearchStock, onDelete }}>
      <StockStateContext.Provider value={{ stock }}>
        <Routes>
          <Route path="/" element={<Home />}></Route>
        </Routes>
      </StockStateContext.Provider>
    </StockDispatchContext.Provider>
  );
}

export default App;
