import React from "react";

const PaginationButton: React.FC<{
  children: React.ReactNode;
  condition: boolean;
  handleClick: Function;
}> = ({ children, condition, handleClick }) => {
  return (
    <button
      className={`${
        condition ? "bg-slate-800 hover:text-orange-400" : "bg-slate-500"
      } text-white p-2 rounded-md  transition-[color] duration-200 ease-in`}
      onClick={() => handleClick()}
      disabled={!condition}
    >
      {children}
    </button>
  );
};

export default PaginationButton;
