import {
  ShieldAlert,
  ShieldCheck,
  Clock3,
  Activity,
  BrainCircuit,
  Wifi,
} from "lucide-react";

export default function Timeline({ recentTxns }) {
  return (
    <div className="space-y-8">

      {/* HERO HEADER */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/10 backdrop-blur-xl p-8 shadow-2xl">

        {/* Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/20 blur-3xl rounded-full"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

          <div>

            <div className="flex items-center gap-3 mb-3">

              <div className="h-3 w-3 rounded-full bg-green-400 animate-pulse"></div>

              <span className="uppercase tracking-[0.3em] text-sm text-green-300 font-bold">
                Investigation Timeline Active
              </span>
            </div>

            <h1 className="text-4xl font-black text-white">
              Threat Activity Timeline
            </h1>

            <p className="text-purple-200 mt-3 max-w-2xl">
              Real-time forensic monitoring of transaction behavior and AI fraud intelligence events.
            </p>

          </div>

          <div className="grid grid-cols-2 gap-4">

            <div className="bg-black/20 border border-white/10 rounded-2xl p-4">
              <p className="text-purple-300 text-sm">
                Total Events
              </p>

              <h2 className="text-3xl font-black text-white">
                {recentTxns.length}
              </h2>
            </div>

            <div className="bg-black/20 border border-white/10 rounded-2xl p-4">
              <p className="text-purple-300 text-sm">
                Threat Status
              </p>

              <h2 className="text-3xl font-black text-red-400">
                ACTIVE
              </h2>
            </div>

          </div>
        </div>
      </div>

      {/* LIVE STATUS BAR */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        {[
          {
            title: "AI Engine",
            value: "ONLINE",
            icon: <BrainCircuit size={24} />,
            color: "from-purple-500 to-indigo-500",
          },
          {
            title: "Threat Feed",
            value: "LIVE",
            icon: <Wifi size={24} />,
            color: "from-red-500 to-pink-500",
          },
          {
            title: "Transactions",
            value: recentTxns.length,
            icon: <Activity size={24} />,
            color: "from-cyan-500 to-blue-500",
          },
          {
            title: "System Time",
            value: new Date().toLocaleTimeString(),
            icon: <Clock3 size={24} />,
            color: "from-green-500 to-emerald-500",
          },
        ].map((item, index) => (
          <div
            key={index}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/10 backdrop-blur-xl p-5 shadow-xl hover:scale-[1.02] transition-all duration-300"
          >

            <div className={`absolute inset-0 opacity-10 bg-gradient-to-br ${item.color}`}></div>

            <div className="relative z-10 flex items-center justify-between">

              <div>
                <p className="text-purple-200 text-sm">
                  {item.title}
                </p>

                <h2 className="text-2xl font-black text-white mt-2">
                  {item.value}
                </h2>
              </div>

              <div className={`bg-gradient-to-br ${item.color} p-3 rounded-2xl text-white`}>
                {item.icon}
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* TIMELINE */}
      <div className="relative rounded-3xl border border-white/10 bg-white/10 backdrop-blur-xl p-8 shadow-2xl overflow-hidden">

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-500/10 blur-3xl rounded-full"></div>

        <div className="relative z-10">

          <div className="flex items-center justify-between mb-10">

            <div>
              <h2 className="text-3xl font-black text-white">
                Security Investigation Stream
              </h2>

              <p className="text-purple-200 mt-2">
                AI-generated fraud analysis event chain
              </p>
            </div>

            <div className="flex items-center gap-2 bg-red-500/20 border border-red-500/30 px-4 py-2 rounded-full">

              <div className="h-2 w-2 rounded-full bg-red-400 animate-pulse"></div>

              <span className="text-red-300 text-xs font-bold tracking-wider">
                LIVE EVENTS
              </span>
            </div>
          </div>

          {/* MAIN TIMELINE */}
          <div className="relative border-l border-purple-500/30 ml-4 space-y-8">

            {recentTxns.map((txn, index) => {

              const riskLevel =
                txn.is_fraud
                  ? "Critical"
                  : txn.amount > 5000
                  ? "Medium"
                  : "Low";

              return (
                <div
                  key={txn.id}
                  className="relative pl-10 group"
                >

                  {/* NODE */}
                  <div
                    className={`absolute -left-[13px] top-4 h-6 w-6 rounded-full border-4 border-[#0f172a] shadow-xl transition-all duration-300 group-hover:scale-125 ${
                      txn.is_fraud
                        ? "bg-red-500 animate-pulse"
                        : "bg-green-500"
                    }`}
                  ></div>

                  {/* CARD */}
                  <div
                    className={`relative overflow-hidden rounded-3xl border backdrop-blur-xl p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
                      txn.is_fraud
                        ? "bg-red-500/10 border-red-500/20"
                        : "bg-white/5 border-white/10"
                    }`}
                  >

                    {/* Glow */}
                    <div
                      className={`absolute inset-0 opacity-10 ${
                        txn.is_fraud
                          ? "bg-red-500"
                          : "bg-purple-500"
                      }`}
                    ></div>

                    <div className="relative z-10">

                      {/* TOP */}
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                        <div className="flex items-center gap-4">

                          <div
                            className={`p-4 rounded-2xl ${
                              txn.is_fraud
                                ? "bg-red-500/20 text-red-300"
                                : "bg-green-500/20 text-green-300"
                            }`}
                          >

                            {txn.is_fraud ? (
                              <ShieldAlert size={30} />
                            ) : (
                              <ShieldCheck size={30} />
                            )}

                          </div>

                          <div>

                            <h2 className="text-2xl font-black text-white">
                              ${txn.amount.toFixed(2)}
                            </h2>

                            <p className="text-purple-200 text-sm mt-1">
                              Transaction ID #{txn.id}
                            </p>

                          </div>
                        </div>

                        <div className="flex flex-wrap gap-3">

                          <span
                            className={`px-4 py-2 rounded-full text-xs font-bold tracking-wider ${
                              txn.is_fraud
                                ? "bg-red-500 text-white animate-pulse"
                                : "bg-green-500 text-white"
                            }`}
                          >
                            {txn.is_fraud
                              ? "THREAT DETECTED"
                              : "SECURE"}
                          </span>

                          <span
                            className={`px-4 py-2 rounded-full text-xs font-bold ${
                              riskLevel === "Critical"
                                ? "bg-red-500/20 text-red-300"
                                : riskLevel === "Medium"
                                ? "bg-yellow-500/20 text-yellow-300"
                                : "bg-green-500/20 text-green-300"
                            }`}
                          >
                            {riskLevel} Risk
                          </span>

                        </div>
                      </div>

                      {/* DETAILS */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">

                        <div className="bg-black/20 border border-white/10 rounded-2xl p-4">

                          <p className="text-purple-300 text-xs uppercase tracking-wider">
                            Timestamp
                          </p>

                          <h3 className="text-white font-bold mt-2">
                            {txn.timestamp}
                          </h3>
                        </div>

                        <div className="bg-black/20 border border-white/10 rounded-2xl p-4">

                          <p className="text-purple-300 text-xs uppercase tracking-wider">
                            AI Source
                          </p>

                          <h3 className="text-white font-bold mt-2">
                            {txn.prediction_source}
                          </h3>
                        </div>

                        <div className="bg-black/20 border border-white/10 rounded-2xl p-4">

                          <p className="text-purple-300 text-xs uppercase tracking-wider">
                            Security Status
                          </p>

                          <h3
                            className={`font-bold mt-2 ${
                              txn.is_fraud
                                ? "text-red-300"
                                : "text-green-300"
                            }`}
                          >
                            {txn.is_fraud
                              ? "Threat Activity Detected"
                              : "Protected Transaction"}
                          </h3>
                        </div>

                      </div>

                    </div>
                  </div>
                </div>
              );
            })}

            {/* EMPTY */}
            {recentTxns.length === 0 && (
              <div className="text-center py-20">

                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">

                  <Activity size={40} className="text-purple-300" />

                </div>

                <h2 className="text-3xl font-black text-white">
                  Awaiting Threat Data
                </h2>

                <p className="text-purple-200 mt-3">
                  Run AI fraud analysis to generate investigation timeline events.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
