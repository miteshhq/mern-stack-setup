import React from "react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

const FormInput = ({
  icon: Icon,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  error,
  showPassword,
  onTogglePassword,
  readOnly = false,
  label,
  theme = "white", // "white" or "dark"
  ...props
}) => {
  const isWhiteTheme = theme === "white";

  return (
    <div className="space-y-2">
      {label && (
        <label
          className={`block text-sm font-medium ${
            isWhiteTheme ? "text-gray-700" : "text-white"
          }`}
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={
            showPassword !== undefined
              ? showPassword
                ? "text"
                : "password"
              : type
          }
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          readOnly={readOnly}
          className={`w-full px-4 py-3 pl-12 ${
            type === "password" || showPassword !== undefined ? "pr-12" : ""
          } ${
            isWhiteTheme
              ? `bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-500 
                 focus:ring-blue-500 focus:border-transparent hover:border-gray-300
                 ${readOnly ? "cursor-not-allowed opacity-75 bg-gray-100" : ""}
                 ${error ? "border-red-300 bg-red-50" : ""}`
              : `bg-white/10 border border-white/20 text-white placeholder-white/60 
                 focus:ring-yellow-400 focus:border-transparent hover:border-white/30
                 ${readOnly ? "cursor-not-allowed opacity-75" : ""}`
          } rounded-xl focus:outline-none focus:ring-2 transition-all duration-200`}
          {...props}
        />
        <Icon
          className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
            isWhiteTheme ? "text-blue-500" : "text-yellow-400"
          }`}
        />
        {onTogglePassword && (
          <button
            type="button"
            onClick={onTogglePassword}
            className={`absolute right-4 top-1/2 transform -translate-y-1/2 transition-colors ${
              isWhiteTheme
                ? "text-blue-500 hover:text-blue-600"
                : "text-yellow-400 hover:text-yellow-300"
            }`}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        )}
      </div>
      {error && (
        <p
          className={`text-sm flex items-center gap-1 ${
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

export default FormInput;
