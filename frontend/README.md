# for later frontend side logout handling

const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      // Call backend logout endpoint
      await authAPI.logout();
      // Call context logout to clear local state
      logout();
      // Redirect to login page
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
      // Even if backend logout fails, clear local state
      logout();
      window.location.href = "/login";
    } finally {
      setIsLoggingOut(false);
    }
  };

# for login handling 

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
        userId: formData.userId,
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

# for login and register handling

const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const response = await authAPI.register(formData);

      if (response.data.requiresVerification) {
        setRegistrationEmail(response.data.email);
        setStep(2);
      } else {
        // Direct registration success
        setSuccessMessage("Registration successful!");
        if (response.data.token) {
          login({
            ...response.data,
            rememberMe: true,
          });
          setTimeout(() => {
            window.location.href = "/user/play";
          }, 1000);
        }
      }
    } catch (error) {
      setErrors({
        submit: error.response?.data?.message || "Registration failed",
      });
    } finally {
      setIsLoading(false);
    }
  };

# for later updating user functionliaty handling

const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setUpdateLoading(true);
    try {
      const updateData = {
        name: formData.name,
        mobile: formData.mobile,
        country: formData.country,
      };

      // Add password fields if changing password
      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      const response = await profileAPI.updateProfile(updateData);

      // Only update user if response contains user data
      if (response.data && response.data.user) {
        updateUser(response.data.user);
      } else {
        // If no user data in response, refresh user data
        await refreshUserData();
      }

      setMessage({ type: "success", text: "Profile updated successfully!" });
      setIsEditing(false);

      // Clear password fields and update form data with new user data
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        // Update other fields with the new data
        name: response.data?.user?.name || prev.name,
        mobile: response.data?.user?.mobile || prev.mobile,
        country: response.data?.user?.country || prev.country,
      }));
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to update profile",
      });
      // DON'T reset form data on error - let user keep their changes
    } finally {
      setUpdateLoading(false);
    }
  };
