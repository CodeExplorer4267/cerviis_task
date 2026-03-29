import { memo } from "react";

function CountdownBar({ secondsLeft, syncInterval }) {
  const progress = ((syncInterval - secondsLeft) / syncInterval) * 100;
  const isUrgent = secondsLeft <= 10;

  return (
    <div className="countdown-bar">
      <div className="countdown-bar__track">
        <div
          className="countdown-bar__fill"
          style={{ width: `${progress}%` }}
          data-urgent={isUrgent || undefined}
        />
      </div>
      <span className={`countdown-bar__label${isUrgent ? " urgent" : ""}`}>
        Next update in <strong>{secondsLeft}s</strong>
      </span>
    </div>
  );
}

export default memo(CountdownBar);
