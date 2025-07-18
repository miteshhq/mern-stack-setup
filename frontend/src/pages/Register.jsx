import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Lock,
  RotateCcw,
  UserCheck,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { authAPI } from "../services/api";

// Import reusable components
import FormInput from "../components/ui/FormInput";
import CustomCheckbox from "../components/ui/CustomCheckbox";
import { CONFIG } from "../constants";

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
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

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 4) {
      newErrors.username = "Username must be at least 4 characters";
    }

    if (!formData.name.trim()) newErrors.name = "Full name is required";

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+?[\d\s-()]{10,}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else {
      const hasLetter = /[a-zA-Z]/.test(formData.password);
      const hasDigit = /\d/.test(formData.password);
      const hasSpecial = /[@#$%^&*]/.test(formData.password);
      const validLength = formData.password.length >= 6;
      const validChars = /^[A-Za-z\d@#$%^&*]+$/.test(formData.password);

      if (!(hasLetter && hasDigit && hasSpecial && validLength && validChars)) {
        newErrors.password =
          "Password must be atleast 6 characters with letters, numbers, and special characters (@#$%^&*)";
      }
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!acceptTerms)
      newErrors.terms = "Please accept the terms and conditions";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const response = await authAPI.register({
        name: formData.name,
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });

      setSuccessMessage("Registration successful! Redirecting...");

      // Login user and redirect
      if (response.data.token) {
        login({
          ...response.data,
          rememberMe: true,
        });
        setTimeout(() => {
          navigate("/user/dashboard", { replace: true });
        }, 1000);
      }
    } catch (error) {
      setErrors({
        submit: error.response?.data?.message || "Registration failed",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      username: "",
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    });
    setAcceptTerms(false);
    setErrors({});
    setSuccessMessage("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-500 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserCheck className="w-10 h-10 text-blue-900" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            {CONFIG.systemName}
          </h1>
          <p className="text-blue-200">Join Our Community</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 shadow-2xl border border-white/20 overflow-y-auto md:max-h-none md:overflow-visible">
          {/* Messages */}
          {successMessage && (
            <div className="mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg flex items-center gap-2 text-green-100">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <span className="text-xs">{successMessage}</span>
            </div>
          )}

          {errors.submit && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-100">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span className="text-xs">{errors.submit}</span>
            </div>
          )}

          <div className="space-y-3">
            {/* Two column layout for desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <FormInput
                icon={User}
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Username"
                error={errors.username}
                theme="dark"
              />

              <FormInput
                icon={User}
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Full Name"
                error={errors.name}
                theme="dark"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <FormInput
                icon={Mail}
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email Address"
                error={errors.email}
                theme="dark"
              />

              <FormInput
                icon={Phone}
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Phone Number"
                error={errors.phone}
                theme="dark"
              />
            </div>

            {/* Password Requirements */}
            <div className="text-xs text-red-300 bg-red-900/20 p-2 rounded text-center">
              Password: 6+ chars, letters + numbers + special chars
              (@,#,$,%,^,&,*)
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <FormInput
                icon={Lock}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                error={errors.password}
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
                theme="dark"
              />

              <FormInput
                icon={Lock}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm Password"
                error={errors.confirmPassword}
                showPassword={showConfirmPassword}
                onTogglePassword={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                theme="dark"
              />
            </div>

            {/* Terms and Conditions */}
            <CustomCheckbox
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              error={errors.terms}
              theme="dark"
            >
              I agree to the{" "}
              <a href="#" className="text-yellow-400 hover:underline">
                Terms
              </a>{" "}
              and{" "}
              <a href="#" className="text-yellow-400 hover:underline">
                Privacy Policy
              </a>
            </CustomCheckbox>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 px-4 py-2.5 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
              <button
                type="button"
                disabled={isLoading}
                onClick={handleSubmit}
                className="flex-1 px-4 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-blue-900 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Registering...
                  </>
                ) : (
                  <>
                    <UserCheck className="w-4 h-4" />
                    Register
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-4">
          <p className="text-blue-200 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-yellow-400 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
