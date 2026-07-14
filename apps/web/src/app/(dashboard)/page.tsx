import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">儀表板</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/organizations" className="p-6 bg-white rounded-lg shadow hover:shadow-md transition">
          <h2 className="text-xl font-semibold mb-2">組織</h2>
          <p className="text-gray-600">管理您的組織和團隊</p>
        </Link>
        <Link href="/bookmarks" className="p-6 bg-white rounded-lg shadow hover:shadow-md transition">
          <h2 className="text-xl font-semibold mb-2">書籤</h2>
          <p className="text-gray-600">瀏覽和管理您的書籤</p>
        </Link>
        <Link href="/settings" className="p-6 bg-white rounded-lg shadow hover:shadow-md transition">
          <h2 className="text-xl font-semibold mb-2">設定</h2>
          <p className="text-gray-600">個人化和偏好設定</p>
        </Link>
      </div>
    </div>
  );
}
