import "./css/List.css";
import TodoItem from "./TodoItem";
import { useContext } from "react";
import { StockStateContext } from "../App";

const List = () => {
  const { stock } = useContext(StockStateContext);

  return (
    <div className="List">
      <section className="listMenu">
        <div className="menu-symbol">종목</div>
        <div className="menu-todayPrice">종가</div>
        <div className="menu-rate">등락율</div>
        <div className="menu-volume">거래량</div>
        <div className="menu-remove">삭제</div>
      </section>
      <section className="todoItem-container">
        {stock.map((item) => {
          return <TodoItem key={item.id} {...item} />;
        })}
      </section>
    </div>
  );
};

export default List;
