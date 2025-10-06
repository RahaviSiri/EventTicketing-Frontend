import React, { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import colors from "../constants/colors";
import { AppContext } from "../context/AppContext";

const ChangePassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email; // get email from previous page
  const { token, userServiceURL } = useContext(AppContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("❌ Passwords do not match!");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${userServiceURL}/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email, newPassword: password }),
      });

      if (response.ok) {
        setMessage("✅ Password changed successfully.");
        setTimeout(() => navigate("/home"), 1000);
      } else {
        setMessage("❌ Failed to change password. Try again.");
      }
    } catch (error) {
      console.error(error);
      setMessage("⚠️ Something went wrong. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative flex items-center justify-center h-screen w-full bg-cover bg-center"
      style={{
        backgroundImage: `url('/Event_2.jpg')`,
      }}
    >

      {/* Glassmorphism content box */}
      <div className="relative bg-white/80 backdrop-blur-md shadow-2xl rounded-3xl p-8 sm:p-10 w-[90%] sm:w-[400px] z-10 transition-all duration-300 hover:shadow-3xl">
        <h2
          className="text-2xl sm:text-3xl font-semibold text-center mb-6"
          style={{ color: colors.primary }}
        >
          Change Password
        </h2>

        <form onSubmit={handleSubmit}>
          {/* New password */}
          <label className="block mb-2 font-medium text-gray-700 text-sm sm:text-base">
            New Password:
          </label>
          <input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border rounded-lg px-3 py-2 sm:py-3 mb-4 focus:outline-none focus:ring-2 transition-all"
            style={{
              borderColor: colors.primary,
              outlineColor: colors.primary,
            }}
          />

          {/* Confirm password */}
          <label className="block mb-2 font-medium text-gray-700 text-sm sm:text-base">
            Confirm Password:
          </label>
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full border rounded-lg px-3 py-2 sm:py-3 mb-4 focus:outline-none focus:ring-2 transition-all"
            style={{
              borderColor: colors.primary,
              outlineColor: colors.primary,
            }}
          />

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 sm:py-3 text-white font-medium rounded-lg shadow-md hover:opacity-90 transition-all duration-300 disabled:opacity-70"
            style={{
              backgroundColor: loading ? "#ccc" : colors.primary,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>

        {message && (
          <p
            className={`mt-4 text-center font-medium text-sm sm:text-base ${
              message.startsWith("✅")
                ? "text-green-600"
                : message.startsWith("❌")
                ? "text-red-600"
                : "text-yellow-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ChangePassword;
