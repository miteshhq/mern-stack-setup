import React, { useState } from "react";
import {
  User,
  Lock,
  RotateCcw,
  LogIn,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { authAPI } from "../services/api";

// Import reusable components
import FormInput from "../components/ui/FormInput";
import CustomCheckbox from "../components/ui/CustomCheckbox";
import { CONFIG } from "../constants";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get redirect path from location state
  const from = location.state?.from?.pathname || "/";

  const [formData, setFormData] = useState({
    userInput: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.userInput.trim()) {
      newErrors.userInput = "Username or Email is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Prevent multiple submissions
    if (isLoading) {
      return;
    }

    if (!validateForm()) return;

    setIsLoading(true);
    setSuccessMessage("");
    setErrors({});

    try {
      const response = await authAPI.login({
        userInput: formData.userInput,
        password: formData.password,
        rememberMe: rememberMe,
      });

      setSuccessMessage("Login successful! Redirecting...");

      // Login user and redirect
      if (response.data.token) login(response.data);

      setTimeout(() => {
        navigate(from, { replace: true });
      }, 1000);
    } catch (error) {
      setErrors({
        submit:
          error.response?.data?.message ||
          "Invalid credentials. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      userInput: "",
      password: "",
    });
    setRememberMe(false);
    setErrors({});
    setSuccessMessage("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-10 h-10 text-blue-900" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            {CONFIG.systemName}
          </h1>
          <p className="text-blue-200">Welcome Back</p>
        </div>

        {/* Login Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20">
          {successMessage && (
            <div className="mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg flex items-center gap-2 text-green-100">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">{successMessage}</span>
            </div>
          )}

          {errors.submit && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-100">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">{errors.submit}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username or Email */}
            <FormInput
              icon={User}
              name="userInput"
              value={formData.userInput}
              onChange={handleInputChange}
              placeholder="Enter Username or Email"
              error={errors.userInput}
              autoComplete="username"
              theme="dark"
            />

            {/* Password */}
            <FormInput
              icon={Lock}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter Password"
              error={errors.password}
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
              autoComplete="current-password"
              theme="dark"
            />

            {/* Remember Me */}
            <div className="flex items-center">
              <CustomCheckbox
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                theme="dark"
              >
                Remember me
              </CustomCheckbox>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-blue-900 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-blue-200 text-sm">
            Don't have an account?{" "}
            <Link to="/register" className="text-yellow-400 hover:underline">
              Register Now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
