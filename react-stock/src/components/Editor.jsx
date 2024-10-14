import { useContext, useState, useRef } from "react";
import "./css/Editor.css";
import { StockDispatchContext } from "../App";

const Editor = () => {
  const { onSearchStock } = useContext(StockDispatchContext);

  const [keyWord, setKeyWord] = useState("");

  const inputRef = useRef();

  const onChangeKeyWord = (e) => {
    setKeyWord(e.target.value);
  };

  const onClickSearch = () => {
    if (keyWord === "") {
      inputRef.current.focus();
      return;
    }
    onSearchStock(keyWord);
    setKeyWord("");
  };

  const onKeyDown = (e) => {
    if (e.keyCode === 13) {
      onClickSearch();
    }
  };

  return (
    <div className="Editor">
      <input
        type="text"
        ref={inputRef}
        value={keyWord}
        onKeyDown={onKeyDown}
        onChange={onChangeKeyWord}
      />
      <button onClick={onClickSearch}>추가</button>
    </div>
  );
};

export default Editor;
