import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import colors from "../constants/colors";
import { AppContext } from "../context/AppContext";

const EmailVerify = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { token, userServiceURL } = useContext(AppContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${userServiceURL}/verify-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessage("✅ Email verified successfully.");
        setTimeout(() => {
          navigate("/change-password", { state: { email } });
        }, 1000);
      } else {
        setMessage("❌ Email not found. Try again.");
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
        backgroundImage: `url('/BackroundImage_4.jpg')`,
      }}
    >

      {/* Content Card */}
      <div className="relative bg-white/70 backdrop-blur-md shadow-2xl rounded-3xl p-8 sm:p-10 w-[90%] sm:w-[400px] z-10 transition-all duration-300 hover:shadow-3xl">
        <h2
          className="text-2xl sm:text-3xl font-semibold text-center mb-6"
          style={{ color: colors.primary }}
        >
          Forgot Password
        </h2>

        <form onSubmit={handleSubmit}>
          <label className="block mb-2 font-medium text-gray-700 text-sm sm:text-base">
            Enter your email:
          </label>
          <input
            type="email"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border rounded-lg px-3 py-2 sm:py-3 mb-4 focus:outline-none focus:ring-2 transition-all"
            style={{
              borderColor: colors.primary,
              outlineColor: colors.primary,
            }}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 sm:py-3 text-white font-medium rounded-lg shadow-md hover:opacity-90 transition-all duration-300 disabled:opacity-70"
            style={{
              backgroundColor: loading ? "#ccc" : colors.primary,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Verifying..." : "Verify Email"}
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

export default EmailVerify;
