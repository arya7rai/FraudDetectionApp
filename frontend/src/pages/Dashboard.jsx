import { motion } from "framer-motion";
import {
  AlertTriangle,
  ShieldCheck,
  Activity,
  DollarSign,
  Radar,
  Cpu,
} from "lucide-react";

export default function Dashboard({
  dark,
  summary,
  formData,
  setFormData,
  handlePredict,
  isLoading,
  predictionResult,
}) {
  const cards = [
    {
      title: "Total Transactions",
      value: summary?.total_transactions || 0,
      icon: Activity,
      color: "from-cyan-500 to-blue-500",
    },
    {
      title: "Fraud Detected",
      value: summary?.fraud_transactions || 0,
      icon: AlertTriangle,
      color: "from-red-500 to-pink-500",
    },
    {
      title: "Fraud Rate",
      value: `${summary?.fraud_rate || 0}%`,
      icon: Radar,
      color: "from-yellow-400 to-orange-500",
    },
    {
      title: "Average Amount",
      value: `$${summary?.avg_amount || 0}`,
      icon: DollarSign,
      color: "from-purple-500 to-indigo-500",
    },
  ];

  return (
    <div className="space-y-8">

      {/* HERO */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative overflow-hidden rounded-3xl p-8 border backdrop-blur-xl ${
          dark
            ? "bg-white/10 border-white/10 text-white"
            : "bg-white/70 border-gray-200 text-black"
        }`}
      >
        <div className="absolute top-0 right-0 w-72 h-72 bg-purple-500/20 blur-3xl rounded-full"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              AI Fraud Detection Dashboard
            </h1>

            <p
              className={`text-sm ${
                dark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Real-time transaction monitoring and intelligent fraud analysis
            </p>
          </div>

          <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg">
            <ShieldCheck size={24} />
            <div>
              <p className="text-xs opacity-80">System Status</p>
              <h3 className="font-semibold">Protected</h3>
            </div>
          </div>
        </div>
      </motion.div>

      {/* SUMMARY CARDS */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {cards.map((card, i) => {
            const Icon = card.icon;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{
                  scale: 1.03,
                  y: -5,
                }}
                className={`relative overflow-hidden rounded-3xl p-6 border backdrop-blur-xl shadow-xl ${
                  dark
                    ? "bg-white/10 border-white/10 text-white"
                    : "bg-white/80 border-gray-200 text-black"
                }`}
              >
                <div
                  className={`absolute top-0 right-0 w-28 h-28 bg-gradient-to-br ${card.color} opacity-20 blur-2xl rounded-full`}
                ></div>

                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <p
                      className={`text-sm ${
                        dark ? "text-gray-300" : "text-gray-500"
                      }`}
                    >
                      {card.title}
                    </p>

                    <h2 className="text-3xl font-bold mt-2">
                      {card.value}
                    </h2>
                  </div>

                  <div
                    className={`p-4 rounded-2xl bg-gradient-to-r ${card.color} text-white shadow-lg`}
                  >
                    <Icon size={28} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

        {/* FORM SECTION */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`xl:col-span-2 rounded-3xl p-8 border backdrop-blur-xl shadow-xl ${
            dark
              ? "bg-white/10 border-white/10 text-white"
              : "bg-white/80 border-gray-200 text-black"
          }`}
        >
          <div className="flex items-center gap-3 mb-6">
            <Cpu className="text-purple-500" size={28} />
            <div>
              <h2 className="text-2xl font-bold">
                Transaction Analyzer
              </h2>
              <p
                className={`text-sm ${
                  dark ? "text-gray-300" : "text-gray-500"
                }`}
              >
                Enter transaction data for AI fraud prediction
              </p>
            </div>
          </div>

          <form
            onSubmit={handlePredict}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {Object.keys(formData).map((key, index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.03 }}
              >
                <label className="text-sm capitalize mb-2 block opacity-80">
                  {key.replaceAll("_", " ")}
                </label>

                <input
                  type="number"
                  placeholder={`Enter ${key}`}
                  value={formData[key]}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [key]: e.target.value,
                    })
                  }
                  className={`w-full p-4 rounded-2xl border outline-none transition-all duration-300 ${
                    dark
                      ? "bg-black/20 border-white/10 text-white focus:border-purple-500"
                      : "bg-gray-100 border-gray-200 text-black focus:border-purple-500"
                  } focus:ring-2 focus:ring-purple-500/30`}
                />
              </motion.div>
            ))}

            <button
              className="md:col-span-2 mt-4 bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 hover:scale-[1.02] transition-all duration-300 text-white p-4 rounded-2xl font-semibold shadow-lg"
              disabled={isLoading}
            >
              {isLoading
                ? "Analyzing Transaction..."
                : "Run AI Fraud Prediction"}
            </button>
          </form>
        </motion.div>

        {/* AI RESULT PANEL */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`rounded-3xl p-8 border backdrop-blur-xl shadow-xl flex flex-col justify-between ${
            dark
              ? "bg-white/10 border-white/10 text-white"
              : "bg-white/80 border-gray-200 text-black"
          }`}
        >
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Radar className="text-pink-500" size={28} />
              <div>
                <h2 className="text-2xl font-bold">
                  AI Risk Analysis
                </h2>
                <p
                  className={`text-sm ${
                    dark ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  Real-time fraud intelligence
                </p>
              </div>
            </div>

            {predictionResult ? (
              <>
                <div className="flex items-center justify-center my-8">
                  <div className="relative w-48 h-48 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 p-1 shadow-2xl">
                    <div
                      className={`w-full h-full rounded-full flex flex-col items-center justify-center ${
                        dark ? "bg-[#0f172a]" : "bg-white"
                      }`}
                    >
                      <h1 className="text-5xl font-bold">
                        {predictionResult.fraud_probability}%
                      </h1>

                      <p className="mt-2 text-sm opacity-70">
                        Fraud Risk
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mt-6">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
                    <span>Threat Level</span>

                    <span className="px-3 py-1 rounded-full bg-red-500 text-white text-sm">
                      High Risk
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20">
                    <p className="font-semibold mb-2">
                      AI Explanation
                    </p>

                    <ul className="space-y-2 text-sm opacity-80">
                      <li>• Unusual transaction amount detected</li>
                      <li>• Device trust score is low</li>
                      <li>• Merchant risk score is elevated</li>
                      <li>• Multiple failed login attempts</li>
                    </ul>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-16 text-center">
                <Radar
                  size={80}
                  className="text-purple-500 opacity-70 mb-6"
                />

                <h3 className="text-xl font-semibold mb-2">
                  No Analysis Yet
                </h3>

                <p
                  className={`text-sm ${
                    dark ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  Run a transaction prediction to view AI risk
                  analysis and fraud insights.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
