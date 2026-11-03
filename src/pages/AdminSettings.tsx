import { usePortalPreferences } from '../context/portalPreferences';

export function AdminSettings() {
  const { compactList, setCompactList } = usePortalPreferences();

  return (
    <div style={{ padding: '1rem', background: '#fff', border: '1px solid var(--border)', borderRadius: '8px' }}>
      <h2 style={{ marginTop: 0 }}>Settings</h2>
      <label style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center' }}>
        <input
          type="checkbox"
          checked={compactList}
          onChange={(event) => setCompactList(event.target.checked)}
        />
        Compact list
      </label>
    </div>
  );
}
