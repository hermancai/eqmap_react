import React from "react";
import { ExclamationCircleIcon } from "@heroicons/react/outline";

const SearchErrorMessage: React.FC<{ message: string }> = ({ message }) => {
  console.log(message);
  let text: string;
  switch (message) {
    case "ZERO_RESULTS":
      text = "The location could not be found.";
      break;
    default:
      text = message;
  }

  return (
    <p className="flex flex-row items-center p-1 gap-1 text-red-400">
      <ExclamationCircleIcon className="h-5" />
      {text}
    </p>
  );
};

export default SearchErrorMessage;
