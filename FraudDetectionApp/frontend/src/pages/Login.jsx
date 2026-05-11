import { useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Lock,
  User,
  Eye,
  EyeOff,
} from "lucide-react";

export default function Login({ onLogin }) {

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [isRegisterMode, setIsRegisterMode] =
    useState(false);

  const [error, setError] = useState("");

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);

    setError("");

    try {

      const endpoint = isRegisterMode
        ? "register"
        : "login";

      const res = await fetch(
        `http://localhost:8001/api/${endpoint}`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.detail || "Request failed"
        );
      }

      // REGISTER SUCCESS
      if (isRegisterMode) {

        alert(
          "Registration successful. Please login."
        );

        setIsRegisterMode(false);

        setLoading(false);

        return;
      }

      // LOGIN SUCCESS
      localStorage.setItem(
        "fg_user",
        JSON.stringify({
          username: form.username,
        })
      );

      onLogin({
        username: form.username,
      });

    } catch (err) {

      setError(err.message);

    } finally {

      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#060816] flex items-center justify-center px-6">

      {/* BACKGROUND */}
      <motion.div
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 12,
        }}
        className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-500/20 blur-[120px] rounded-full"
      />

      <motion.div
        animate={{
          x: [0, -40, 0],
          y: [0, 50, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 10,
        }}
        className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-pink-500/20 blur-[120px] rounded-full"
      />

      {/* LOGIN CARD */}
      <motion.div
        initial={{
          opacity: 0,
          y: 40,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.7,
        }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="backdrop-blur-2xl bg-white/10 border border-white/10 rounded-[32px] p-8 shadow-2xl">

          {/* LOGO */}
          <div className="flex flex-col items-center text-center mb-8">

            <div className="p-5 rounded-3xl bg-gradient-to-r from-purple-600 to-pink-500 shadow-2xl mb-5">
              <ShieldCheck
                size={40}
                className="text-white"
              />
            </div>

            <h1 className="text-4xl font-black text-white">
              Fraud
              <span className="text-purple-400">
                Guard
              </span>
            </h1>

            <p className="text-gray-400 mt-3 text-sm">
              {isRegisterMode
                ? "Create a secure account"
                : "AI-Powered Fraud Detection Platform"}
            </p>
          </div>

          {/* ERROR */}
          {error && (
            <div className="mb-4 p-3 rounded-2xl bg-red-500/20 border border-red-500/30 text-red-200 text-sm">
              {error}
            </div>
          )}

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* USERNAME */}
            <div>
              <label className="text-sm text-gray-300 block mb-2">
                Username
              </label>

              <div className="relative">
                <User
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  required
                  placeholder="Enter your username"
                  value={form.username}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      username: e.target.value,
                    })
                  }
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 border border-white/10 text-white placeholder:text-gray-400 outline-none focus:border-purple-500 transition-all duration-300"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-sm text-gray-300 block mb-2">
                Password
              </label>

              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  required
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      password: e.target.value,
                    })
                  }
                  className="w-full pl-12 pr-14 py-4 rounded-2xl bg-white/10 border border-white/10 text-white placeholder:text-gray-400 outline-none focus:border-purple-500 transition-all duration-300"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <motion.button
              whileHover={{
                scale: 1.02,
              }}
              whileTap={{
                scale: 0.98,
              }}
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 text-white font-bold shadow-2xl"
            >
              {loading
                ? "Please wait..."
                : isRegisterMode
                ? "Create Account"
                : "Secure Login"}
            </motion.button>
          </form>

          {/* TOGGLE */}
          <div className="mt-6 text-center">

            <button
              onClick={() =>
                setIsRegisterMode(
                  !isRegisterMode
                )
              }
              className="text-purple-300 hover:text-purple-200 transition-all duration-300"
            >
              {isRegisterMode
                ? "Already have an account? Login"
                : "New user? Create account"}
            </button>
          </div>

          {/* FOOTER */}
          <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-sm text-gray-400">

            <span>
              Fraud Intelligence System
            </span>

            <span className="text-green-400">
              ● Protected
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}