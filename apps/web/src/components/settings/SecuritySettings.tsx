import React, { useState } from 'react';

interface Session {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

interface SecuritySettingsProps {
  sessions?: Session[];
  twoFactorEnabled?: boolean;
  onEnable2FA?: () => Promise<void>;
  onRevokeSession?: (sessionId: string) => Promise<void>;
  onRevokeAllSessions?: () => Promise<void>;
}

export function SecuritySettings({
  sessions = [],
  twoFactorEnabled = false,
  onEnable2FA,
  onRevokeSession,
  onRevokeAllSessions,
}: SecuritySettingsProps) {
  const [twoFAEnabled, setTwoFAEnabled] = useState(twoFactorEnabled);
  const [showQRModal, setShowQRModal] = useState(false);
  const [revoking, setRevoking] = useState<string | null>(null);

  const handleEnable2FA = async () => {
    await onEnable2FA?.();
    setShowQRModal(true);
  };

  const handleRevokeSession = async (sessionId: string) => {
    setRevoking(sessionId);
    try {
      await onRevokeSession?.(sessionId);
    } finally {
      setRevoking(null);
    }
  };

  const handleRevokeAll = async () => {
    if (!confirm('確定要撤銷所有其他會話嗎？這將使所有設備需要重新登入。')) return;
    await onRevokeAllSessions?.();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">安全設定</h2>

      {/* 2FA Section */}
      <div className="space-y-3 border-b pb-4">
        <h3 className="text-sm font-medium text-gray-500 uppercase">兩步驟驗證</h3>
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <div className="font-medium">兩步驟驗證 (2FA)</div>
            <div className="text-sm text-gray-500">
              {twoFAEnabled ? '已啟用 - 您的帳戶更加安全' : '尚未啟用'}
            </div>
          </div>
          <button
            onClick={handleEnable2FA}
            className={`px-4 py-2 rounded-lg ${
              twoFAEnabled
                ? 'bg-gray-200 text-gray-700'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {twoFAEnabled ? '已啟用' : '啟用'}
          </button>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-500 uppercase">活躍會話</h3>
          {sessions.length > 1 && (
            <button
              onClick={handleRevokeAll}
              className="text-sm text-red-600 hover:text-red-700"
            >
              撤銷所有其他
            </button>
          )}
        </div>

        {sessions.length === 0 ? (
          <div className="text-gray-500 text-sm">載入中...</div>
        ) : (
          <div className="space-y-2">
            {sessions.map(session => (
              <div
                key={session.id}
                className={`flex items-center justify-between p-4 rounded-lg ${
                  session.isCurrent ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{session.device}</span>
                    {session.isCurrent && (
                      <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded">
                        當前
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    {session.location} · 最後活躍 {session.lastActive}
                  </div>
                </div>
                {!session.isCurrent && (
                  <button
                    onClick={() => handleRevokeSession(session.id)}
                    disabled={revoking === session.id}
                    className="text-sm text-red-600 hover:text-red-700 disabled:opacity-50"
                  >
                    {revoking === session.id ? '撤銷中...' : '撤銷'}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2FA QR Modal */}
      {showQRModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">設定兩步驟驗證</h3>
            <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-gray-400">QR Code</span>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              請使用驗證器 App 掃描上方 QR Code，然後輸入顯示的驗證碼。
            </p>
            <input
              type="text"
              placeholder="輸入驗證碼"
              className="w-full px-3 py-2 border rounded-lg mb-4"
              maxLength={6}
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowQRModal(false)}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={() => {
                  setTwoFAEnabled(true);
                  setShowQRModal(false);
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                確認
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SecuritySettings;
