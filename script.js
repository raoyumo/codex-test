const title = document.getElementById('page-title');
const button = document.getElementById('change-title-btn');

button.addEventListener('click', () => {
  title.textContent = '我成功用上 Codex 了';
});
