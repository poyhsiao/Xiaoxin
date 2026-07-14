export default function Sidebar() {
  return (
    <div className="w-96 h-screen bg-white p-4">
      <h1 className="text-xl font-bold mb-4">小新書籤</h1>
      <input
        type="search"
        placeholder="搜尋書籤..."
        className="w-full p-2 border rounded mb-4"
      />
      <div id="bookmark-list">
        {/* Bookmark list will be rendered here */}
      </div>
    </div>
  );
}
