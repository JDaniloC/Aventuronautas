import { TableData } from "./Models";

import React from "react";

export default function RadioTable({ question }: TableData) {
  return (
    <>
      {question.options.map((option, index) => (
        <label key={option}>
          <input type="checkbox" name={question.id} value={index} />
          <span />
          <p> {option} </p>
        </label>
      ))}
    </>
  );
}
