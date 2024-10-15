import "./App.css";
import axios from "axios";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import { createContext, useState, useEffect, useRef, useReducer } from "react";

export const StockDispatchContext = createContext();
export const StockStateContext = createContext();

const API_key = `0UXZSDV1HVVDBKZD`;
let globalStockId = 0;

const fetchStockData = async () => {
  const symbol = ["MSFT"];
  const stockArr = [];

  console.log("useEffect fetch");

  for (const item of symbol) {
    try {
      const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${item}&apikey=${API_key}`;
      const { data } = await axios.get(url);
      const stockData = addStockState(data, item);
      stockArr.push(stockData);
    } catch (e) {
      console.log(e);
    }
  }

  return stockArr;
};

const addStockState = (data, symbol) => {
  const timeSeries = data["Time Series (Daily)"];
  const today = Object.keys(timeSeries)[0];
  const previousDay = Object.keys(timeSeries)[1];
  const todayData = timeSeries[today];
  const previousData = timeSeries[previousDay];

  return {
    id: globalStockId++,
    symbol,
    today: todayData,
    previousDay: previousData,
  };
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SEARCH":
      return [...state, action.data];
    case "DELETE":
      return state.filter((item) => item.id !== action.data);
    default:
      break;
  }
};

function App() {
  const [stock, dispatch] = useReducer(reducer, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      const stockArr = await fetchStockData();
      stockArr.forEach((item) => {
        dispatch({ type: "SEARCH", data: item });
      });
    };
    fetchInitialData();
  }, []);

  const onSearchStock = async (keyWord) => {
    for (const item of stock) {
      if (keyWord === item.symbol) {
        return;
      }
    }
    try {
      const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${keyWord}&apikey=${API_key}`;
      const { data } = await axios.get(url);
      const stockData = addStockState(data, keyWord);
      dispatch({
        type: "SEARCH",
        data: stockData,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const onDelete = (targetId) => {
    dispatch({
      type: "DELETE",
      data: targetId,
    });
  };

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
