import { useEffect } from 'react';

const CRM = () => {
  useEffect(() => {
    window.location.replace('/crm.html');
  }, []);
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0b141a' }}>
      <div style={{ textAlign: 'center', color: '#8696a0' }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>💬</div>
        <p>Chargement du CRM…</p>
      </div>
    </div>
  );
};

export default CRM;
