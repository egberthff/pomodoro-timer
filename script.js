// === CONFIGURATION ===
const DEFAULT_FOCUS_TIME = 25 * 60;
const DEFAULT_BREAK_TIME = 5 * 60;

// === STATE ===
let timeLeft = DEFAULT_FOCUS_TIME;
let timerInterval = null;
let isRunning = false;
let isBreakMode = false;

// === ELEMENTS ===
const timeDisplay = document.getElementById('time');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const breakBtn = document.getElementById('breakBtn');
const statusText = document.getElementById('statusText');

// === AUDIO ===
const beep = new Audio('https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg');

// === HELPER FUNCTIONS ===
const formatTime = seconds => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};
// === SET THE TIMER DISPLAY === 
const updateDisplay = () => (timeDisplay.textContent = formatTime(timeLeft));

const setButtonState = (states = {}) => {
  startBtn.disabled = states.start ?? startBtn.disabled;
  pauseBtn.disabled = states.pause ?? pauseBtn.disabled;
  resetBtn.disabled = states.reset ?? resetBtn.disabled;
  breakBtn.disabled = states.break ?? breakBtn.disabled;
};

// === CORE TIMER LOGIC ===
function startTimer() {
  if (isRunning) return;
  isRunning = true;

  statusText.textContent = isBreakMode ? 'Break Time — Relax!' : 'Stay Focused!';
  setButtonState({ start: true, pause: false, reset: false, break: false });

  timerInterval = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      updateDisplay();
      return;
    }

    // Timer finished
    clearInterval(timerInterval);
    isRunning = false;
    beep.play();

    if (isBreakMode) {
      // End of break → go back to focus mode
      statusText.textContent = "Break's over! Let's focus again!";
      isBreakMode = false;
      timeLeft = DEFAULT_FOCUS_TIME;
      setButtonState({ start: false, pause: true, reset: false, break: false });
    } else {
      //Break time automatically triggered if the main time countdoen reaches 0  
      // End of focus → start break
      statusText.textContent = "Time's up! Take a short break!";
      isBreakMode = true;
      timeLeft = DEFAULT_BREAK_TIME;
      setTimeout(() => startTimer(), 3000); // 3s delay before auto-start break
    }

    updateDisplay();
  }, 1000);
}

// === PAUSE THE TIMER ===
function pauseTimer() {
  if (!isRunning) return;
  isRunning = false;
  clearInterval(timerInterval);
  statusText.textContent = 'Paused...';
  setButtonState({ start: false, pause: true, reset: false, break: true });
}

// === RESET THE TIMER ===
function resetTimer() {
  clearInterval(timerInterval);
  isRunning = false;
  isBreakMode = false;
  timeLeft = DEFAULT_FOCUS_TIME;
  updateDisplay();
  statusText.textContent = 'Focus Time';
  setButtonState({ start: false, pause: true, reset: true, break: true });
}

// === TRIGGER MANUALLY THE BREAK TIME - in cases break time is necessary
function triggerBreak() {
  if (isRunning) clearInterval(timerInterval);

  isBreakMode = true;
  isRunning = false;
  timeLeft = DEFAULT_BREAK_TIME;
  updateDisplay();
  statusText.textContent = 'Break Time — Chill Out!';
  startTimer();
}

// === INITIALIZE ===
updateDisplay();
setButtonState({ start: false, pause: true, reset: true, break: true });

// === EVENT LISTENERS ===
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);
breakBtn.addEventListener('click', triggerBreak);
