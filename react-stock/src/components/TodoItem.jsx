import { useState } from "react";
import "./css/TodoItem.css";
import { useContext } from "react";
import { StockDispatchContext } from "../App";

const TodoItem = ({ id, symbol, today, previousDay }) => {
  const todayPrice = today["4. close"];
  const previousPrice = previousDay["4. close"];
  const volume = today["5. volume"]
    .toString()
    .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");

  const { onDelete } = useContext(StockDispatchContext);

  const priceRate = () => {
    const price = Math.floor((todayPrice - previousPrice) * 100) / 100;
    const num = (todayPrice / previousPrice - 1) * 100;
    const rate = Math.round(num * 100) / 100;

    return [price, rate];
  };

  const [price, rate] = priceRate();

  const redOrBlue = () => {
    if (price > 0) {
      return "red";
    } else if (price < 0) {
      return "blue";
    } else {
      return;
    }
  };

  return (
    <div className="TodoItem">
      <div className="symbol">{symbol}</div>
      <div className="today-price">{todayPrice}</div>
      <div className={`price-rate ${redOrBlue()}`}>
        {`${rate}%`} {`(${price})`}
      </div>
      <div className="volume">{volume}</div>
      <div className="remove">
        <button
          onClick={() => {
            onDelete(id);
          }}
        >
          삭제
        </button>
      </div>
    </div>
  );
};

export default TodoItem;
