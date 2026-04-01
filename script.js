const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');

const themeToggleButton = document.getElementById('theme-toggle');

const historyList = document.getElementById('history-list');
const clearHistoryButton = document.getElementById('clear-history');

// Store the most recent calculation strings (up to 10 items).
let calculationHistory = [];

// Keys used to store data in the browser's localStorage.
const THEME_STORAGE_KEY = 'yumo_calculator_theme';
const HISTORY_STORAGE_KEY = 'yumo_calculator_history';

// Theme toggle logic:
// We switch a CSS class on <body> and update button text so beginners
// can clearly see which mode is active.
function updateThemeToggleLabel() {
  if (document.body.classList.contains('dark-theme')) {
    themeToggleButton.textContent = '☀️ Light';
  } else {
    themeToggleButton.textContent = '🌙 Dark';
  }
}

// Save the currently selected theme in localStorage.
function saveThemeToStorage() {
  const currentTheme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
  localStorage.setItem(THEME_STORAGE_KEY, currentTheme);
}

// Restore the saved theme from localStorage when page loads.
function loadThemeFromStorage() {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
  } else {
    document.body.classList.remove('dark-theme');
  }

  updateThemeToggleLabel();
}

// When user clicks the theme button, instantly switch page colors.
themeToggleButton.addEventListener('click', () => {
  document.body.classList.toggle('dark-theme');
  updateThemeToggleLabel();
  saveThemeToStorage();
});


// Render the history array to the history list in the page.
function renderHistory() {
  historyList.innerHTML = '';

  if (calculationHistory.length === 0) {
    historyList.innerHTML = '<li class="history-empty">No calculations yet.</li>';
    return;
  }

  calculationHistory.forEach((entry) => {
    const item = document.createElement('li');
    item.textContent = entry;
    historyList.appendChild(item);
  });
}

// Save history array to localStorage.
function saveHistoryToStorage() {
  localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(calculationHistory));
}

// Load history array from localStorage.
function loadHistoryFromStorage() {
  const savedHistoryText = localStorage.getItem(HISTORY_STORAGE_KEY);
  if (!savedHistoryText) return;

  let parsedHistory = [];
  try {
    parsedHistory = JSON.parse(savedHistoryText);
  } catch {
    // If saved data is invalid, fall back to an empty history.
    parsedHistory = [];
  }

  // Only accept arrays, and keep at most 10 recent entries.
  if (Array.isArray(parsedHistory)) {
    calculationHistory = parsedHistory.slice(0, 10);
  }
}

// Save one completed calculation to history.
function addToHistory(entry) {
  // Add newest entry to the top.
  calculationHistory.unshift(entry);

  // Keep only the most recent 10 entries.
  if (calculationHistory.length > 10) {
    calculationHistory = calculationHistory.slice(0, 10);
  }

  renderHistory();
  saveHistoryToStorage();
}

// Clear all saved history entries.
clearHistoryButton.addEventListener('click', () => {
  calculationHistory = [];
  renderHistory();
  saveHistoryToStorage();
});

// Restore saved theme and history when the page first loads.
loadThemeFromStorage();
loadHistoryFromStorage();
renderHistory();

// These variables store the current number, previous number, and chosen operator.
let currentInput = '0';
let firstNumber = null;
let operator = null;
let shouldStartNewNumber = false;

// Update what is shown in the display area.
function updateDisplay() {
  display.textContent = currentInput;
}

// Reset everything back to the starting state.
function clearCalculator() {
  currentInput = '0';
  firstNumber = null;
  operator = null;
  shouldStartNewNumber = false;
  updateDisplay();
}

// Run a math operation using two numbers and an operator symbol.
function calculate(a, b, selectedOperator) {
  if (selectedOperator === '+') return a + b;
  if (selectedOperator === '-') return a - b;
  if (selectedOperator === '*') return a * b;
  if (selectedOperator === '/') return b === 0 ? 'Error' : a / b;
  return b;
}

// Handle number and decimal button clicks.
function handleNumberInput(value) {
  // If we are starting a fresh number after an operator, begin with this value.
  if (shouldStartNewNumber) {
    currentInput = value === '.' ? '0.' : value;
    shouldStartNewNumber = false;
    updateDisplay();
    return;
  }

  // Only allow one decimal point in a number (prevents 1.2.3).
  if (value === '.') {
    if (currentInput.includes('.')) {
      return;
    }
    currentInput += '.';
    updateDisplay();
    return;
  }

  // Regular number input behavior.
  currentInput = currentInput === '0' ? value : currentInput + value;
  updateDisplay();
}

// Handle backspace button click to delete one character.
function handleBackspace() {
  // If next input should start a new number, keep display at 0.
  if (shouldStartNewNumber) {
    currentInput = '0';
    shouldStartNewNumber = false;
    updateDisplay();
    return;
  }

  // After an Error, backspace should reset to 0.
  if (currentInput === 'Error') {
    currentInput = '0';
    updateDisplay();
    return;
  }

  // Remove the last character. If only one is left, show 0.
  if (currentInput.length <= 1) {
    currentInput = '0';
  } else {
    currentInput = currentInput.slice(0, -1);
  }

  updateDisplay();
}

// Handle operator button clicks (+, -, *, /).
function handleOperator(value) {
  const inputNumber = Number(currentInput);

  if (firstNumber === null) {
    firstNumber = inputNumber;
  } else if (operator !== null) {
    const result = calculate(firstNumber, inputNumber, operator);
    currentInput = String(result);
    firstNumber = result === 'Error' ? null : result;
    updateDisplay();
  }

  operator = value;
  shouldStartNewNumber = true;
}

// Handle equals button click (=) to finish the calculation.
function handleEquals() {
  if (operator === null || firstNumber === null) return;

  const secondNumber = Number(currentInput);
  const expressionText = `${firstNumber} ${operator} ${secondNumber}`;
  const result = calculate(firstNumber, secondNumber, operator);

  // Save each completed equation to history (example: 12 + 3 = 15).
  addToHistory(`${expressionText} = ${result}`);

  currentInput = String(result);
  firstNumber = result === 'Error' ? null : result;
  operator = null;
  shouldStartNewNumber = true;
  updateDisplay();
}

// Route all input values (from mouse clicks or keyboard keys)
// into the same calculator behavior.
function processInput(value) {
  if (value === 'C') {
    clearCalculator();
  } else if (value === 'backspace') {
    handleBackspace();
  } else if (value === '=') {
    handleEquals();
  } else if (['+', '-', '*', '/'].includes(value)) {
    handleOperator(value);
  } else {
    handleNumberInput(value);
  }
}

// Convert keyboard keys to calculator actions.
// Returning null means "ignore this key".
function mapKeyboardKeyToInput(key, code) {
  // 0-9 should enter numbers.
  if (/^[0-9]$/.test(key)) return key;

  // Support main keyboard and numpad operators.
  if (['+', '-', '*', '/'].includes(key)) return key;
  if (code === 'NumpadAdd') return '+';
  if (code === 'NumpadSubtract') return '-';
  if (code === 'NumpadMultiply') return '*';
  if (code === 'NumpadDivide') return '/';

  // Decimal point from keyboard or numpad.
  if (key === '.' || code === 'NumpadDecimal') return '.';

  // Enter should behave like equals.
  if (key === 'Enter' || code === 'NumpadEnter') return '=';

  // Backspace should delete one character.
  if (key === 'Backspace') return 'backspace';

  // Escape should clear everything.
  if (key === 'Escape') return 'C';

  return null;
}

// Add a short pressed animation class, then remove it.
function animateButtonPress(button) {
  if (!button) return;

  button.classList.add('is-pressed');
  setTimeout(() => {
    button.classList.remove('is-pressed');
  }, 120);
}

// Find and animate the button that matches a calculator input value.
function animateMatchingButton(inputValue) {
  const matchingButton = document.querySelector(`[data-value="${inputValue}"]`);
  animateButtonPress(matchingButton);
}

// Listen to calculator buttons and process each button value.
buttons.forEach((button) => {
  button.addEventListener('click', () => {
    // Show the pressed animation for mouse clicks.
    animateButtonPress(button);
    processInput(button.dataset.value);
  });
});

// Keyboard support for the webpage.
// This works without extra setup: when the page is focused, key presses
// are translated into calculator actions via mapKeyboardKeyToInput().
document.addEventListener('keydown', (event) => {
  const mappedInput = mapKeyboardKeyToInput(event.key, event.code);

  // Ignore keys that are not part of calculator controls.
  if (!mappedInput) {
    return;
  }

  // Prevent default browser behavior for handled keys
  // (for example: Backspace navigating browser history).
  event.preventDefault();

  // Highlight the matching button when keyboard input is used.
  animateMatchingButton(mappedInput);

  // Run the same logic as clicking a calculator button.
  processInput(mappedInput);
});
