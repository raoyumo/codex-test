const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');

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
  const result = calculate(firstNumber, secondNumber, operator);

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

// Listen to calculator buttons and process each button value.
buttons.forEach((button) => {
  button.addEventListener('click', () => {
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

  // Run the same logic as clicking a calculator button.
  processInput(mappedInput);
});
