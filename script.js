const numberAInput = document.getElementById('number-a');
const numberBInput = document.getElementById('number-b');
const message = document.getElementById('message');

const addButton = document.getElementById('add-btn');
const subtractButton = document.getElementById('subtract-btn');
const multiplyButton = document.getElementById('multiply-btn');
const divideButton = document.getElementById('divide-btn');
const clearButton = document.getElementById('clear-btn');

const initialMessage = '结果：请先输入数字。';

function getNumbers() {
  const firstText = numberAInput.value.trim();
  const secondText = numberBInput.value.trim();

  if (firstText === '' || secondText === '') {
    message.textContent = '提示：两个输入框都要填写。';
    return null;
  }

  const firstNumber = Number(firstText);
  const secondNumber = Number(secondText);

  if (Number.isNaN(firstNumber) || Number.isNaN(secondNumber)) {
    message.textContent = '提示：请输入有效的数字。';
    return null;
  }

  return { firstNumber, secondNumber };
}

function doAdd() {
  const numbers = getNumbers();
  if (!numbers) return;

  const result = numbers.firstNumber + numbers.secondNumber;
  message.textContent = `结果：${result}`;
}

addButton.addEventListener('click', doAdd);

subtractButton.addEventListener('click', () => {
  const numbers = getNumbers();
  if (!numbers) return;

  const result = numbers.firstNumber - numbers.secondNumber;
  message.textContent = `结果：${result}`;
});

multiplyButton.addEventListener('click', () => {
  const numbers = getNumbers();
  if (!numbers) return;

  const result = numbers.firstNumber * numbers.secondNumber;
  message.textContent = `结果：${result}`;
});

divideButton.addEventListener('click', () => {
  const numbers = getNumbers();
  if (!numbers) return;

  if (numbers.secondNumber === 0) {
    message.textContent = '提示：除数不能为 0。';
    return;
  }

  const result = numbers.firstNumber / numbers.secondNumber;
  message.textContent = `结果：${result}`;
});

clearButton.addEventListener('click', () => {
  numberAInput.value = '';
  numberBInput.value = '';
  message.textContent = initialMessage;
});

function runAddWhenPressEnter(event) {
  if (event.key === 'Enter') {
    doAdd();
  }
}

numberAInput.addEventListener('keydown', runAddWhenPressEnter);
numberBInput.addEventListener('keydown', runAddWhenPressEnter);
