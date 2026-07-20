import React, { useState } from 'react';

interface AccountSettingsProps {
  userId: string;
  onExportData?: () => Promise<void>;
  onDeleteAccount?: () => Promise<void>;
}

export function AccountSettings({ userId, onExportData, onDeleteAccount }: AccountSettingsProps) {
  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      await onExportData?.();
      showMessage('success', '資料匯出請求已提交，稍後會發送至您的 Email');
    } catch {
      showMessage('error', '匯出失敗，請稍後再試');
    } finally {
      setExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== '刪除帳戶') {
      showMessage('error', '請輸入「刪除帳戶」確認');
      return;
    }
    setDeleting(true);
    try {
      await onDeleteAccount?.();
      showMessage('success', '帳戶刪除請求已提交，14 天內可取消');
    } catch {
      showMessage('error', '刪除失敗，請稍後再試');
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="space-y-6">
      {message && (
        <div className={`p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <h2 className="text-xl font-semibold">帳戶管理</h2>

      {/* Export Data */}
      <div className="space-y-3 border-b pb-4">
        <h3 className="text-sm font-medium text-gray-500 uppercase">資料管理</h3>
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">匯出書籤資料</div>
              <div className="text-sm text-gray-500">
                以 JSON 格式匯出所有書籤、元資料和標籤
              </div>
            </div>
            <button
              onClick={handleExport}
              disabled={exporting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {exporting ? '處理中...' : '匯出'}
            </button>
          </div>
        </div>
      </div>

      {/* Delete Account */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-500 uppercase">危險區域</h3>
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-red-700">刪除帳戶</div>
              <div className="text-sm text-red-600">
                永久刪除您的帳戶和所有資料。14 天內可透過 Email 恢復。
              </div>
            </div>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              刪除帳戶
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-red-600 mb-2">確認刪除帳戶</h3>
            <p className="text-sm text-gray-600 mb-4">
              此操作無法撤銷。您的所有資料將在 14 天後永久刪除。
            </p>
            <p className="text-sm mb-2">請輸入「<strong>刪除帳戶</strong>」確認：</p>
            <input
              type="text"
              value={deleteConfirmation}
              onChange={e => setDeleteConfirmation(e.target.value)}
              placeholder="刪除帳戶"
              className="w-full px-3 py-2 border rounded-lg mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeleteConfirmation('');
                }}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleting || deleteConfirmation !== '刪除帳戶'}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? '刪除中...' : '確認刪除'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AccountSettings;
