const num1Input = document.getElementById('num1');
const num2Input = document.getElementById('num2');
const resultText = document.getElementById('result');

const addButton = document.getElementById('add-btn');
const subButton = document.getElementById('sub-btn');
const mulButton = document.getElementById('mul-btn');
const divButton = document.getElementById('div-btn');

function getNumbers() {
  const n1 = parseFloat(num1Input.value);
  const n2 = parseFloat(num2Input.value);

  if (Number.isNaN(n1) || Number.isNaN(n2)) {
    resultText.textContent = '结果：请输入有效数字';
    return null;
  }

  return { n1, n2 };
}

addButton.addEventListener('click', () => {
  const numbers = getNumbers();
  if (!numbers) return;
  resultText.textContent = `结果：${numbers.n1 + numbers.n2}`;
});

subButton.addEventListener('click', () => {
  const numbers = getNumbers();
  if (!numbers) return;
  resultText.textContent = `结果：${numbers.n1 - numbers.n2}`;
});

mulButton.addEventListener('click', () => {
  const numbers = getNumbers();
  if (!numbers) return;
  resultText.textContent = `结果：${numbers.n1 * numbers.n2}`;
});

divButton.addEventListener('click', () => {
  const numbers = getNumbers();
  if (!numbers) return;

  if (numbers.n2 === 0) {
    resultText.textContent = '结果：除数不能是 0';
    return;
  }

  resultText.textContent = `结果：${numbers.n1 / numbers.n2}`;
});
