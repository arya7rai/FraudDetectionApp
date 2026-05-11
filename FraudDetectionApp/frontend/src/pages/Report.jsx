export default function Report({ recentTxns }) {
  // Filter out only the fraudulent transactions
  const fraudTxns = recentTxns.filter((t) => t.is_fraud);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-purple-100 opacity-0 animate-fade-in-up">
      {/* Header section with pulsating alert icon */}
      <div className="mb-6 pb-4 border-b border-purple-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-red-700 flex items-center">
            <span className="mr-2 animate-pulse">🚨</span>
            Detailed Fraud Report
          </h2>
          <p className="text-purple-600 mt-1">
            Showing {fraudTxns.length} recently flagged incidents.
          </p>
        </div>

        {/* Tactile Export Button */}
        <button
          onClick={() =>
            window.open("http://localhost:8001/api/export_data", "_blank")
          }
          className="bg-red-100 hover:bg-red-200 text-red-700 font-bold py-2 px-6 rounded-lg transition-all duration-200 active:scale-95 hover:shadow-md flex items-center"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            ></path>
          </svg>
          Export Red Flags
        </button>
      </div>

      {/* Grid of Fraud Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fraudTxns.map((txn, index) => {
          // Dynamic waterfall delay
          const delay = Math.min(0.1 + index * 0.1, 1.5);

          return (
            <div
              key={txn.id}
              className="border-l-4 border-red-500 bg-red-50 p-5 rounded-r-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-md opacity-0 animate-fade-in-up"
              style={{ animationDelay: `${delay}s` }}
            >
              <div className="flex justify-between items-center">
                <span className="font-bold text-red-900 bg-red-100 px-2 py-1 rounded text-xs tracking-wider">
                  INCIDENT #{txn.id}
                </span>
                <span className="text-red-500 text-sm font-medium">
                  {txn.timestamp}
                </span>
              </div>
              <p className="text-3xl font-black text-red-700 my-3">
                ${txn.amount.toFixed(2)}
              </p>
              <p className="text-sm text-red-800">
                Triggered via:{" "}
                <strong className="uppercase">{txn.prediction_source}</strong>
              </p>

              <div className="mt-4 text-xs text-red-700 bg-red-200/50 p-2 rounded flex items-start">
                <span className="mr-1">⚠️</span>
                Requires immediate manual review. Do not process fulfillment.
              </div>
            </div>
          );
        })}

        {/* Empty State: If no fraud is detected, show a smooth, reassuring message */}
        {fraudTxns.length === 0 && (
          <div
            className="col-span-1 md:col-span-2 text-center p-10 bg-green-50 rounded-xl border border-green-200 opacity-0 animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            <span className="text-5xl mb-4 block animate-bounce">🎉</span>
            <h3 className="text-2xl text-green-800 font-bold">System Secure</h3>
            <p className="text-green-600 font-medium mt-2">
              No recent fraudulent transactions to report. Your environment is
              clean!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
