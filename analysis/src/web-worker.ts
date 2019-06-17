import * as workerTimers from 'worker-timers';
import Measurement from './measure';

const intervalInput = document.getElementById('interval') as HTMLInputElement;
const workDurationInput = document.getElementById('work-duration') as HTMLInputElement;

const measurement = new Measurement(() => {
  let intervalId: number | null = null;
  return {
    start: (callback) => {
      const interval = parseInt(intervalInput.value);
      const workDuration = parseInt(workDurationInput.value);
      console.log('Starting measurement', { interval, workDuration });
      intervalId = workerTimers.setInterval(function () {
        const runUntil = performance.now() + workDuration;
        while (performance.now() < runUntil) {
          callback();
        }
      }, interval);
    },
    stop: function () {
      if (intervalId !== null) {
        workerTimers.clearInterval(intervalId);
        intervalId = null;
      }
    }
  }
});