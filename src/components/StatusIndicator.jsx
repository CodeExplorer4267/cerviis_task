import { memo } from "react";

function StatusIndicator({ loading, error, lastSynced, syncCount }) {
  const formatTime = (date) =>
    date
      ? date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      : "—";

  return (
    <div className="status-indicator">
      <div className="status-indicator__dot-group">
        <span
          className={`status-dot ${error ? "error" : loading ? "loading" : "live"}`}
        />
        <span className="status-text">
          {error ? "Error" : loading ? "Syncing…" : "Live"}
        </span>
      </div>
      <div className="status-indicator__meta">
        <span>Last sync: {formatTime(lastSynced)}</span>
        <span className="divider">|</span>
        <span>Total syncs: {syncCount}</span>
      </div>
    </div>
  );
}

export default memo(StatusIndicator);
