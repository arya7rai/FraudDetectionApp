import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  ReferenceDot,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from "recharts";

import {
  ShieldCheck,
  AlertTriangle,
  Activity,
  Globe,
  Wifi,
  BrainCircuit,
} from "lucide-react";

export default function LiveGraph({ recentTxns }) {
  const areaData = [...recentTxns].reverse().map((txn, index) => ({
    time: txn.timestamp.split(" ")[1],
    amount: txn.amount,
    is_fraud: txn.is_fraud,
    risk:
      txn.is_fraud === 1
        ? "Critical"
        : txn.amount > 5000
        ? "Medium"
        : "Low",
    fullData: txn,
  }));

  const fraudCount = recentTxns.filter((t) => t.is_fraud).length;
  const safeCount = recentTxns.length - fraudCount;

  const pieData = [
    {
      name: "Secure",
      value: safeCount,
      color: "#10b981",
    },
    {
      name: "Threats",
      value: fraudCount,
      color: "#ef4444",
    },
  ];

  const riskData = [
    {
      name: "Low",
      value: safeCount,
    },
    {
      name: "Critical",
      value: fraudCount,
    },
  ];

  const latestFrauds = recentTxns
    .filter((t) => t.is_fraud)
    .slice(0, 5);

  const AreaTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;

      return (
        <div className="bg-[#111827] border border-red-500/30 p-4 rounded-2xl shadow-2xl text-white">
          <p className="text-sm text-purple-300">{data.time}</p>

          <h2 className="text-2xl font-black mt-1">
            ${data.amount.toFixed(2)}
          </h2>

          <div className="mt-2">
            {data.is_fraud ? (
              <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                🚨 FRAUD DETECTED
              </span>
            ) : (
              <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold">
                ✅ SAFE
              </span>
            )}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/10 backdrop-blur-xl p-8 shadow-2xl">

        <div className="absolute top-0 right-0 w-72 h-72 bg-purple-500/20 blur-3xl rounded-full"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

          <div>
            <div className="flex items-center gap-3 mb-3">

              <div className="h-3 w-3 rounded-full bg-green-400 animate-pulse"></div>

              <span className="uppercase tracking-[0.3em] text-sm text-green-300 font-bold">
                Live Monitoring Active
              </span>
            </div>

            <h1 className="text-4xl font-black text-white">
              Threat Intelligence Center
            </h1>

            <p className="text-purple-200 mt-3 max-w-2xl">
              Real-time AI-powered fraud analytics and behavioral anomaly detection system.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">

            <div className="bg-black/20 border border-white/10 rounded-2xl p-4">
              <p className="text-purple-300 text-sm">Detection Accuracy</p>
              <h2 className="text-3xl font-black text-white">98.7%</h2>
            </div>

            <div className="bg-black/20 border border-white/10 rounded-2xl p-4">
              <p className="text-purple-300 text-sm">Threat Level</p>
              <h2 className="text-3xl font-black text-red-400">HIGH</h2>
            </div>

          </div>
        </div>
      </div>

      {/* TOP METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        {[
          {
            title: "Transactions",
            value: recentTxns.length,
            icon: <Activity size={28} />,
            color: "from-cyan-500 to-blue-500",
          },
          {
            title: "Threat Incidents",
            value: fraudCount,
            icon: <AlertTriangle size={28} />,
            color: "from-red-500 to-pink-500",
          },
          {
            title: "Protected",
            value: safeCount,
            icon: <ShieldCheck size={28} />,
            color: "from-green-500 to-emerald-500",
          },
          {
            title: "AI Engine",
            value: "LIVE",
            icon: <BrainCircuit size={28} />,
            color: "from-purple-500 to-indigo-500",
          },
        ].map((item, index) => (
          <div
            key={index}
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/10 backdrop-blur-xl p-6 hover:scale-[1.02] transition-all duration-300 shadow-xl"
          >

            <div className={`absolute inset-0 opacity-10 bg-gradient-to-br ${item.color}`}></div>

            <div className="relative z-10 flex items-center justify-between">

              <div>
                <p className="text-purple-200 text-sm">
                  {item.title}
                </p>

                <h2 className="text-4xl font-black text-white mt-2">
                  {item.value}
                </h2>
              </div>

              <div className={`bg-gradient-to-br ${item.color} p-4 rounded-2xl text-white shadow-lg`}>
                {item.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MAIN CHARTS */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* AREA CHART */}
        <div className="xl:col-span-2 rounded-3xl border border-white/10 bg-white/10 backdrop-blur-xl p-6 shadow-2xl">

          <div className="flex items-center justify-between mb-6">

            <div>
              <h2 className="text-2xl font-bold text-white">
                Live Threat Timeline
              </h2>

              <p className="text-purple-200 text-sm mt-1">
                AI transaction monitoring stream
              </p>
            </div>

            <div className="flex items-center gap-2 bg-red-500/20 border border-red-500/30 px-4 py-2 rounded-full">
              <Wifi className="text-red-400" size={16} />
              <span className="text-red-300 text-xs font-bold">
                LIVE FEED
              </span>
            </div>
          </div>

          <div className="h-[400px]">

            <ResponsiveContainer width="100%" height="100%">

              <AreaChart data={areaData}>

                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.08)"
                />

                <XAxis
                  dataKey="time"
                  stroke="#c4b5fd"
                />

                <YAxis
                  stroke="#c4b5fd"
                />

                <RechartsTooltip content={<AreaTooltip />} />

                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#c084fc"
                  strokeWidth={4}
                  fill="url(#colorAmount)"
                />

                {areaData.map(
                  (entry, index) =>
                    entry.is_fraud && (
                      <ReferenceDot
                        key={index}
                        x={entry.time}
                        y={entry.amount}
                        r={7}
                        fill="#ef4444"
                        stroke="#fff"
                      />
                    ),
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SIDE PANEL */}
        <div className="space-y-6">

          {/* DONUT */}
          <div className="rounded-3xl border border-white/10 bg-white/10 backdrop-blur-xl p-6 shadow-2xl">

            <h2 className="text-xl font-bold text-white mb-6">
              System Security Ratio
            </h2>

            <div className="h-[280px] relative">

              <ResponsiveContainer width="100%" height="100%">

                <PieChart>

                  <Pie
                    data={pieData}
                    dataKey="value"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                  >

                    {pieData.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={entry.color}
                      />
                    ))}

                  </Pie>

                  <Legend />

                </PieChart>

              </ResponsiveContainer>

              <div className="absolute inset-0 flex flex-col items-center justify-center">

                <h2 className="text-4xl font-black text-white">
                  {recentTxns.length}
                </h2>

                <p className="text-purple-200 text-sm">
                  Total Records
                </p>
              </div>
            </div>
          </div>

          {/* THREAT FEED */}
          <div className="rounded-3xl border border-white/10 bg-white/10 backdrop-blur-xl p-6 shadow-2xl">

            <div className="flex items-center justify-between mb-5">

              <h2 className="text-xl font-bold text-white">
                Live Threat Feed
              </h2>

              <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse"></div>
            </div>

            <div className="space-y-4">

              {latestFrauds.length > 0 ? (
                latestFrauds.map((txn, index) => (
                  <div
                    key={index}
                    className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4"
                  >

                    <div className="flex items-center justify-between">

                      <span className="text-red-300 font-bold text-sm">
                        Suspicious Transaction
                      </span>

                      <span className="text-xs text-purple-300">
                        LIVE
                      </span>
                    </div>

                    <h2 className="text-white font-black text-xl mt-2">
                      ${txn.amount}
                    </h2>

                    <p className="text-purple-200 text-sm mt-1">
                      AI confidence score elevated
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center text-purple-300 py-10">
                  No active threats detected
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
