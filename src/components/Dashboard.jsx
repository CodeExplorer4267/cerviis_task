import { useAutoFetch } from "../hooks/useAutoFetch";
import CountdownBar from "./CountdownBar";
import StatusIndicator from "./StatusIndicator";
import DataTable from "./DataTable";

const API_URL = "https://jsonplaceholder.typicode.com/posts";

export default function Dashboard() {
  const {
    data,
    loading,
    error,
    secondsLeft,
    lastSynced,
    syncCount,
    refresh,
    syncInterval,
  } = useAutoFetch(API_URL);

  return (
    <div className="dashboard">
      <header className="dashboard__header">
        <div className="dashboard__title-group">
          <h1 className="dashboard__title">Real-Time Dashboard</h1>
          <p className="dashboard__subtitle">
            Auto-syncing data from JSONPlaceholder every {syncInterval}s
          </p>
        </div>
        <button
          className="refresh-btn"
          onClick={refresh}
          disabled={loading}
          aria-label="Refresh data now"
        >
          <svg viewBox="0 0 24 24" className={`refresh-icon ${loading ? "spin" : ""}`}>
            <path d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
          </svg>
          Refresh Now
        </button>
      </header>

      <CountdownBar secondsLeft={secondsLeft} syncInterval={syncInterval} />

      <StatusIndicator
        loading={loading}
        error={error}
        lastSynced={lastSynced}
        syncCount={syncCount}
      />

      {error && (
        <div className="error-banner">
          <span>⚠ Failed to fetch data: {error}</span>
          <button onClick={refresh}>Retry</button>
        </div>
      )}

      <DataTable data={data} loading={loading} />
    </div>
  );
}
