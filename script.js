const title = document.getElementById('page-title');
const changeTitleButton = document.getElementById('change-title-btn');
const introText = document.getElementById('intro-text');
const introInput = document.getElementById('intro-input');
const updateIntroButton = document.getElementById('update-intro-btn');

changeTitleButton.addEventListener('click', () => {
  title.textContent = '我成功用上 Codex 了';
});

updateIntroButton.addEventListener('click', () => {
  introText.textContent = introInput.value;
});
