import React from "react";
import { Check, AlertCircle } from "lucide-react";

const CustomCheckbox = ({
  checked,
  onChange,
  children,
  error,
  theme = "white", // "white" or "dark"
}) => {
  const isWhiteTheme = theme === "white";

  return (
    <div className="space-y-2">
      <label className="flex items-start gap-3 cursor-pointer">
        <div className="relative">
          <input
            type="checkbox"
            checked={checked}
            onChange={onChange}
            className={`peer h-5 w-5 cursor-pointer transition-all appearance-none rounded-md border hover:shadow-md ${
              isWhiteTheme
                ? "border-gray-300 bg-white checked:bg-blue-500 checked:border-blue-500 hover:border-blue-400"
                : "border-white/30 bg-white/10 checked:bg-yellow-400 checked:border-yellow-400 hover:border-yellow-400"
            }`}
          />
          <span
            className={`absolute left-1 top-0.5 pointer-events-none opacity-0 peer-checked:opacity-100 ${
              isWhiteTheme ? "text-white" : "text-black"
            }`}
          >
            <Check className="h-3 w-3" strokeWidth={3} />
          </span>
        </div>
        <span
          className={`text-sm leading-relaxed ${
            isWhiteTheme ? "text-gray-700" : "text-white"
          }`}
        >
          {children}
        </span>
      </label>
      {error && (
        <p
          className={`text-sm flex items-center gap-1 ml-8 ${
            isWhiteTheme ? "text-red-500" : "text-red-300"
          }`}
        >
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  );
};

export default CustomCheckbox;
