function formatMilliseconds(ms) {
  const sec_num = Math.floor(ms / 1000);
  let hours = Math.floor(sec_num / 3600);
  let minutes = Math.floor((sec_num - hours * 3600) / 60);
  let seconds = sec_num - hours * 3600 - minutes * 60;

  if (hours < 10) {
    hours = "0" + hours;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  return hours + ":" + minutes + ":" + seconds;
}

function measure(methodName, methodFunction) {
  const originalDocumentTitle = document.title;
  let cleanupFunction = null;
  let dataPoints = [];

  function handleVisibilityChange() {
    if (document.hidden) {
      document.title =
        originalDocumentTitle + " - Recording background execution...";
      startRecording();
    } else {
      document.title = originalDocumentTitle;
      stopRecording();
    }
  }

  function startRecording() {
    dataPoints = [];
    cleanupFunction = methodFunction(tick);
  }

  function stopRecording() {
    if (cleanupFunction) {
      cleanupFunction();
      cleanupFunction = null;
    }
    if (dataPoints.length > 0) {
      const first = dataPoints[0];
      const last = dataPoints[dataPoints.length - 1];
      const totalDurationMs = last.date.getTime() - first.date.getTime();
      console.log(
        "Recording finished after " + formatMilliseconds(totalDurationMs)
      );
      console.table(
        dataPoints.map(p => {
          p.date = p.date.toISOString();
          return p;
        })
      );
    } else {
      console.log(
        "Recording finished but there were no data points measured. Make sure your method function invokes the callback function"
      );
    }
  }

  function tick() {
    const now = new Date();
    const timeSinceLastTick =
      dataPoints.length > 0
        ? now.getTime() - dataPoints[dataPoints.length - 1].date.getTime()
        : 0;
    const timeSinceFirstTick =
      dataPoints.length > 0 ? now.getTime() - dataPoints[0].date.getTime() : 0;
    dataPoints.push({
      date: now,
      timeSinceLastTick: formatMilliseconds(timeSinceLastTick),
      timeSinceFirstTick: formatMilliseconds(timeSinceFirstTick)
    });
  }

  document.addEventListener("visibilitychange", handleVisibilityChange, false);
}
