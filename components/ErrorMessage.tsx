import { FC } from "react";
import { ExclamationCircleIcon } from "@heroicons/react/outline";

const ErrorMessage: FC<{ message: string | undefined }> = ({ message }) => {
  return (
    <p className="flex flex-row items-center p-1 gap-1 text-red-400 text-sm">
      <ExclamationCircleIcon className="h-4" />
      {message}
    </p>
  );
};

export default ErrorMessage;
