import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div style={{ padding: '4rem', textAlign: 'center' }}>
      <h2>Not found</h2>
      <p style={{ margin: '1rem 0 2rem 0', color: '#64748b' }}>The page you requested does not exist.</p>
      <Link to="/" className="btn" style={{ textDecoration: 'none' }}>Return Home</Link>
    </div>
  );
}
