import { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { db, User } from '@/lib/database';

export default function Settings() {
  const [users, setUsers] = useState<User[]>([]);
  useEffect(() => {
    db.users.toArray().then(setUsers);
  }, []);
  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-4">Settings</h2>
      <ul className="space-y-2">
        {users.map(user => (
          <li key={user.id} className="p-2 border rounded">
            <strong>{user.name}</strong> — {user.email} ({user.role})
          </li>
        ))}
      </ul>
    </Layout>
  );
}
