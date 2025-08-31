import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const { setToken, userServiceURL } = useContext(AppContext)
    const [state, setState] = useState("Login");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const SignUpFormData = {
            name: name,
            email: email,
            password: password
        };
        const LoginFormData = {
            email: email,
            password: password
        };

        const url = state === "Login"
                ? `${userServiceURL}/login`
                : `${userServiceURL}/register`;

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(state === "Login" ? LoginFormData : SignUpFormData)
            });

            if (!response.ok) {
                throw new Error(response.body);
            }

            const data = await response.json();
            console.log(`${state} successful:`, data);
            setToken(data.token); 
            localStorage.setItem("EventToken", data.token); 
            setEmail("");
            setPassword("");
            setName("");
            navigate('/');
        } catch (error) {
            console.error("Error during login or registration:", error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="max-w-md w-full bg-white shadow-lg rounded-2xl p-8">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                    {state === "Login" ? "Welcome! What's your email?" : "Create your account"}
                </h2>

                {/* Manual Email Login or Sign Up */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {state === "Sign Up" && (
                        <>
                            <input
                                type="text"
                                name="name"
                                placeholder="Enter Your Name"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </>
                    )}

                    <input
                        type="email"
                        name="username"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <button
                        type="submit"
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-md"
                    >
                        {state === "Login" ? "Continue" : "Sign Up"}
                    </button>
                </form>

                {/* Divider */}
                <div className="flex items-center my-6">
                    <hr className="flex-grow border-t" />
                    <span className="mx-4 text-gray-400 text-sm">Or {state == "Sign Up" ? "Sign Up " : "Sign In"} with</span>
                    <hr className="flex-grow border-t" />
                </div>

                {/* OAuth Buttons */}
                <div className="flex justify-between space-x-4">
                    <a
                        href="http://localhost:8080/oauth2/authorization/google"
                        className="flex-1 border px-4 py-2 rounded-md flex items-center justify-center hover:bg-gray-100"
                    >
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png"
                            alt="Google"
                            className="h-5"
                        />
                    </a>
                </div>

                {/* Toggle Login / Sign Up */}
                <p className="mt-6 text-sm text-center text-gray-500">
                    {state === "Login" ? (
                        <>
                            Don't have an account?{" "}
                            <button
                                onClick={() => setState("Sign Up")}
                                className="text-blue-500 hover:underline"
                            >
                                Sign Up Here
                            </button>
                        </>
                    ) : (
                        <>
                            Already have an account?{" "}
                            <button
                                onClick={() => setState("Login")}
                                className="text-blue-500 hover:underline"
                            >
                                Login Here
                            </button>
                        </>
                    )}
                </p>
            </div>
        </div>
    );
};

export default Login;
