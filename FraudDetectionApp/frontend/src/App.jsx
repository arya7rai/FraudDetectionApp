import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  ShieldCheck,
  LayoutDashboard,
  Activity,
  Clock3,
  FileBarChart2,
  Moon,
  Sun,
  Bell,
  LogOut,
} from "lucide-react";

import Dashboard from "./pages/Dashboard";
import Timeline from "./pages/Timeline";
import Report from "./pages/Report";
import LiveGraph from "./pages/LiveGraph";
import Login from "./pages/Login";

const emptyFormData = {
  amount: "",
  time_delta: "",
  num_prev_txn_24h: "",
  merchant_risk_score: "",
  device_trust_score: "",
  ip_risk_score: "",
  country_risk_score: "",
  card_age_days: "",
  customer_tenure_days: "",
  failed_login_attempts: "",
};

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  // AUTH
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("fg_user");
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogin = (userData) => {
    // RESET OLD USER DATA
    setSummary(null);
    setRecentTxns([]);
    setPredictionResult(null);
    setFormData(emptyFormData);

    localStorage.removeItem("fg_prediction");

    localStorage.setItem(
      "fg_user",
      JSON.stringify(userData)
    );

    setUser(userData);
  };

  const handleLogout = () => {
    // CLEAR STORAGE
    localStorage.removeItem("fg_user");
    localStorage.removeItem("fg_prediction");

    // RESET STATE
    setSummary(null);
    setRecentTxns([]);
    setPredictionResult(null);
    setFormData(emptyFormData);

    setUser(null);

    navigate("/login");
  };

  // DARK MODE
  const [dark, setDark] = useState(() => {
    const savedTheme =
      localStorage.getItem("fg_theme");

    return savedTheme
      ? JSON.parse(savedTheme)
      : true;
  });

  useEffect(() => {
    localStorage.setItem(
      "fg_theme",
      JSON.stringify(dark)
    );
  }, [dark]);

  // DATA
  const [summary, setSummary] = useState(null);

  const [recentTxns, setRecentTxns] =
    useState([]);

  const [formData, setFormData] =
    useState(emptyFormData);

  const [predictionResult, setPredictionResult] =
    useState(null);

  const [isLoading, setIsLoading] =
    useState(false);

  // TOAST
  const [toast, setToast] = useState({
    msg: "",
    type: "info",
  });

  const showToast = (
    msg,
    type = "info"
  ) => {
    setToast({ msg, type });

    setTimeout(() => {
      setToast({
        msg: "",
        type: "info",
      });
    }, 3500);
  };

  // LOAD USER DATA
  useEffect(() => {
    if (user?.username) {
      fetchDashboardData();
    }
  }, [user]);

  // FETCH USER-SPECIFIC DATA
  const fetchDashboardData = async () => {
    try {
      const sumRes = await fetch(
        `http://localhost:8001/api/summary/${user.username}`
      );

      const recRes = await fetch(
        `http://localhost:8001/api/recent/${user.username}?limit=50`
      );

      const summaryData =
        await sumRes.json();

      const recentData =
        await recRes.json();

      setSummary(summaryData);
      setRecentTxns(recentData);
    } catch (err) {
      console.log(err);
    }
  };

  // PREDICTION
  const handlePredict = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const payload = {
        username: user.username,

        ...Object.fromEntries(
          Object.entries(formData).map(
            ([k, v]) => [
              k,
              Number(v),
            ]
          )
        ),
      };

      const res = await fetch(
        "http://localhost:8001/api/predict",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      setPredictionResult(data);

      if (
        data.fraud_probability >= 80
      ) {
        showToast(
          "🚨 Critical Fraud Risk Detected",
          "error"
        );
      } else if (
        data.fraud_probability >= 50
      ) {
        showToast(
          "⚠️ Medium Fraud Risk Detected",
          "warning"
        );
      } else {
        showToast(
          "✅ Transaction Looks Safe",
          "success"
        );
      }

      fetchDashboardData();

    } catch (err) {
      showToast(
        "❌ AI Analysis Failed",
        "error"
      );
    }

    setIsLoading(false);
  };

  // LOGIN ROUTE
  if (!user) {
    return (
      <Routes>
        <Route
          path="*"
          element={
            <Login
              onLogin={handleLogin}
            />
          }
        />
      </Routes>
    );
  }

  // NAVIGATION ITEMS
  const navItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: LayoutDashboard,
    },
    {
      name: "Live",
      path: "/live",
      icon: Activity,
    },
    {
      name: "Timeline",
      path: "/timeline",
      icon: Clock3,
    },
    {
      name: "Report",
      path: "/report",
      icon: FileBarChart2,
    },
  ];

  return (
    <div
      className={`min-h-screen relative overflow-hidden transition-all duration-700 ${
        dark
          ? "bg-[#060816] text-white"
          : "bg-[#f4f7ff] text-black"
      }`}
    >
      {/* BACKGROUND */}
      <div className="absolute inset-0 overflow-hidden">

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
          className="absolute top-20 right-0 w-[450px] h-[450px] bg-pink-500/20 blur-[120px] rounded-full"
        />

        <motion.div
          animate={{
            x: [0, 20, 0],
            y: [0, -30, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 15,
          }}
          className="absolute bottom-0 left-1/3 w-[450px] h-[450px] bg-cyan-500/20 blur-[120px] rounded-full"
        />
      </div>

      {/* TOAST */}
      <AnimatePresence>
        {toast.msg && (
          <motion.div
            initial={{
              opacity: 0,
              y: -50,
              scale: 0.9,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: -50,
            }}
            className={`fixed top-6 right-6 px-6 py-4 rounded-2xl font-semibold z-50 shadow-2xl backdrop-blur-xl border ${
              toast.type === "error"
                ? "bg-red-500/20 border-red-500/40 text-red-200"
                : toast.type === "warning"
                ? "bg-yellow-500/20 border-yellow-500/40 text-yellow-100"
                : "bg-emerald-500/20 border-emerald-500/40 text-emerald-100"
            }`}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* NAVBAR */}
      <nav
        className={`sticky top-0 z-50 border-b backdrop-blur-2xl ${
          dark
            ? "bg-black/20 border-white/10"
            : "bg-white/70 border-gray-200"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* LOGO */}
          <motion.div
            whileHover={{
              scale: 1.03,
            }}
          >
            <Link
              to="/"
              className="flex items-center gap-3"
            >
              <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 shadow-lg">
                <ShieldCheck size={24} />
              </div>

              <div>
                <h1 className="text-2xl font-black">
                  Fraud
                  <span className="text-purple-400">
                    Guard
                  </span>
                </h1>

                <p
                  className={`text-xs ${
                    dark
                      ? "text-gray-400"
                      : "text-gray-500"
                  }`}
                >
                  AI Threat Intelligence
                </p>
              </div>
            </Link>
          </motion.div>

          {/* NAVIGATION */}
          <div className="hidden md:flex items-center gap-3">

            {navItems.map((item) => {
              const Icon = item.icon;

              const active =
                location.pathname ===
                item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-2xl transition-all duration-300 ${
                    active
                      ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg"
                      : dark
                      ? "hover:bg-white/10 text-gray-300"
                      : "hover:bg-purple-100 text-gray-700"
                  }`}
                >
                  <Icon size={18} />
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">

            <motion.button
              whileHover={{
                scale: 1.05,
              }}
              className={`p-3 rounded-2xl ${
                dark
                  ? "bg-white/10"
                  : "bg-white shadow-md"
              }`}
            >
              <Bell size={20} />
            </motion.button>

            <motion.button
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{
                scale: 0.95,
              }}
              onClick={() =>
                setDark(!dark)
              }
              className="p-3 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg"
            >
              {dark ? (
                <Sun size={20} />
              ) : (
                <Moon size={20} />
              )}
            </motion.button>

            {/* USER */}
            <div
              className={`hidden lg:flex items-center gap-3 px-4 py-2 rounded-2xl ${
                dark
                  ? "bg-white/10"
                  : "bg-white shadow-md"
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                {user?.username?.[0] || "A"}
              </div>

              <div>
                <p className="text-sm font-semibold">
                  {user?.username ||
                    "Admin"}
                </p>

                <p
                  className={`text-xs ${
                    dark
                      ? "text-gray-400"
                      : "text-gray-500"
                  }`}
                >
                  Security Analyst
                </p>
              </div>
            </div>

            {/* LOGOUT */}
            <motion.button
              whileHover={{
                scale: 1.03,
              }}
              whileTap={{
                scale: 0.95,
              }}
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-red-500/20 border border-red-500/30 text-red-300 hover:bg-red-500 hover:text-white transition-all duration-300"
            >
              <LogOut size={18} />

              <span className="hidden md:block">
                Logout
              </span>
            </motion.button>
          </div>
        </div>
      </nav>

      {/* MAIN */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">

        <Routes>

          <Route
            path="/"
            element={
              <Dashboard
                dark={dark}
                summary={summary}
                formData={formData}
                setFormData={
                  setFormData
                }
                handlePredict={
                  handlePredict
                }
                isLoading={
                  isLoading
                }
                predictionResult={
                  predictionResult
                }
              />
            }
          />

          <Route
            path="/live"
            element={
              <LiveGraph
                dark={dark}
                recentTxns={
                  recentTxns
                }
              />
            }
          />

          <Route
            path="/timeline"
            element={
              <Timeline
                dark={dark}
                recentTxns={
                  recentTxns
                }
              />
            }
          />

          <Route
            path="/report"
            element={
              <Report
                dark={dark}
                recentTxns={
                  recentTxns
                }
              />
            }
          />

        </Routes>
      </main>
    </div>
  );
}

export default App;