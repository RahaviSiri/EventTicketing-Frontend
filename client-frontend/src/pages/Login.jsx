import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import colors from '../constants/colors';

const Login = () => {
    const { setToken, userServiceURL } = useContext(AppContext);
    const [state, setState] = useState("Login");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const SignUpFormData = { name, email, password };
        const LoginFormData = { email, password };

        const url = state === "Login"
            ? `${userServiceURL}/login`
            : `${userServiceURL}/register`;

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(state === "Login" ? LoginFormData : SignUpFormData)
            });

            if (!response.ok) throw new Error("Failed to authenticate");

            const data = await response.json();
            setToken(data.token);
            localStorage.setItem("EventToken", data.token);
            setEmail(""); setPassword(""); setName("");
            navigate('/home');
        } catch (error) {
            console.error("Error during login or registration:", error);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center px-4 relative bg-cover bg-center"
            style={{ backgroundImage: "url('/BackroundImage_1.jpg')" }}
        >
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative max-w-md w-full backdrop-blur-xl shadow-2xl rounded-3xl p-8 sm:p-10 z-10"
            >
                {/* Header */}
                <h2 style={{ color: colors.primary }} className="text-2xl sm:text-3xl font-bold mb-6 text-center">
                    {state === "Login" ? "Welcome Back!" : "Create Your Account"}
                </h2>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {state === "Sign Up" && (
                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none transition"
                            style={{ boxShadow: `0 0 0 2px ${colors.primary}`, outline: "none" }}
                        />
                    )}

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none transition"
                        style={{ boxShadow: `0 0 0 2px ${colors.primary}`, outline: "none" }}
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none transition"
                        style={{ boxShadow: `0 0 0 2px ${colors.primary}`, outline: "none" }}
                    />

                    <button
                        type="submit"
                        style={{ backgroundColor: colors.primary }}
                        className="w-full text-white font-semibold py-3 rounded-xl text-lg transition-all shadow-md hover:shadow-lg"
                    >
                        {state === "Login" ? "Continue" : "Sign Up"}
                    </button>
                </form>

                {/* Divider */}
                {state === "Login" && (
                    <div className="flex items-center my-6">
                        <hr className="flex-grow border-t" />
                        <span className="mx-4 text-sm font-extrabold">
                            Forgot Password?{" "}
                            <Link className="text-blue-600 underline" to="/verify-email">
                                Click Here
                            </Link>
                        </span>
                        <hr className="flex-grow border-t" />
                    </div>
                )}

                {/* Toggle Login / Sign Up */}
                <p className="mt-6 text-sm text-center">
                    {state === "Login" ? (
                        <>
                            <span className='font-extrabold text-white'>Don't have an account?{" "}</span>
                            <button
                                onClick={() => setState("Sign Up")}
                                className="hover:underline font-extrabold"
                            >
                                Sign Up Here
                            </button>
                        </>
                    ) : (
                        <>
                            <span className='text-white font-extrabold'>Already have an account?{" "}</span>
                            <button
                                onClick={() => setState("Login")}
                                className=" font-medium hover:underline"
                            >
                                Login Here
                            </button>
                        </>
                    )}
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
