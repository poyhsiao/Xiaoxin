'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

interface Organization {
  id: string;
  name: string;
  slug: string;
  description?: string;
  visibility: string;
}

export default function OrganizationsPage() {
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/organizations').then(res => {
      setOrgs(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div>載入中...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">組織</h1>
        <button className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90">
          建立組織
        </button>
      </div>
      {orgs.length === 0 ? (
        <p className="text-gray-500">還沒有組織，建立一個開始吧！</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orgs.map(org => (
            <div key={org.id} className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold">{org.name}</h3>
              <p className="text-sm text-gray-500">{org.description || '無描述'}</p>
              <span className="inline-block mt-2 text-xs bg-gray-100 px-2 py-1 rounded">
                {org.visibility === 'PUBLIC' ? '公開' : org.visibility === 'INVITE_ONLY' ? '邀請制' : '私人'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
