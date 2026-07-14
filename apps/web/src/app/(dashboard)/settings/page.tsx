export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">設定</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">個人資訊</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">名稱</label>
            <input type="text" className="w-full max-w-md p-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" className="w-full max-w-md p-2 border rounded" disabled />
          </div>
          <button className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90">
            儲存
          </button>
        </div>
      </div>
    </div>
  );
}
