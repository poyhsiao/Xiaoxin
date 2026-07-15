export default function PopupApp() {
  const root = document.getElementById('root')!;
  root.innerHTML = `
    <div class="w-80 p-4">
      <h1 class="text-lg font-bold mb-4">小新書籤</h1>
      <input type="url" id="url-input" placeholder="輸入 URL..." class="w-full p-2 border rounded mb-2" />
      <button id="save-btn" class="w-full bg-blue-500 text-white p-2 rounded disabled:opacity-50">儲存書籤</button>
    </div>
  `;

  const input = document.getElementById('url-input') as HTMLInputElement;
  const btn = document.getElementById('save-btn') as HTMLButtonElement;

  btn.addEventListener('click', () => {
    if (!input.value) return;
    btn.textContent = '儲存中...';
    setTimeout(() => {
      btn.textContent = '儲存書籤';
      input.value = '';
    }, 1000);
  });
}
