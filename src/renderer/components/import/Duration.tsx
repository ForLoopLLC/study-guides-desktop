const getHumanReadableDuration = (
  startTime: number,
  stopTime: number,
): string | null => {
  if (startTime && stopTime) {
    const durationMs = stopTime - startTime;
    const durationSeconds = durationMs / 1000;

    const days = Math.floor(durationSeconds / (3600 * 24));
    const hours = Math.floor((durationSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((durationSeconds % 3600) / 60);
    const seconds = Math.floor(durationSeconds % 60);

    let durationString = '';

    if (days > 0) {
      durationString += `${days} day${days > 1 ? 's' : ''} `;
    }
    if (hours > 0) {
      durationString += `${hours} hour${hours > 1 ? 's' : ''} `;
    }
    if (minutes > 0) {
      durationString += `${minutes} minute${minutes > 1 ? 's' : ''} `;
    }
    if (seconds > 0 || durationString === '') {
      durationString += `${seconds} second${seconds > 1 ? 's' : ''}`;
    }

    return durationString.trim(); // Remove any extra spaces at the end
  }
  return null;
};

interface DurationProps {
  startTime: number | null;
  stopTime: number | null;
  title: string;
}

const Duration: React.FC<DurationProps> = ({ startTime, stopTime, title }) => {
  return (
    <div>
      {startTime && (
        <section className="mt-4 text-sm text-slate-500 p-2">
          <p>{title}</p>
          <span className="mr-4">
            Started: {new Date(startTime).toLocaleTimeString()}
          </span>
          {stopTime && (
            <div>
              <span className="mr-4">
                Finished: {new Date(stopTime).toLocaleTimeString()}
              </span>
              <span className="mr-4">
                Duration: {getHumanReadableDuration(startTime, stopTime)}
              </span>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default Duration;
