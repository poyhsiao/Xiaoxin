export default function SidebarApp() {
  const root = document.getElementById('root')!;
  root.innerHTML = `
    <div class="w-96 h-screen bg-white p-4">
      <h1 class="text-xl font-bold mb-4">小新書籤</h1>
      <input type="search" id="search-input" placeholder="搜尋書籤..." class="w-full p-2 border rounded mb-4" />
      <div id="bookmark-list">
        <!-- Bookmark list will be rendered here -->
      </div>
    </div>
  `;
}
