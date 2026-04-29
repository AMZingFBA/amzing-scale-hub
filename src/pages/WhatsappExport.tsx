import { useEffect } from 'react';

const WhatsappExport = () => {
  useEffect(() => {
    window.location.replace('/whatsapp-export.html');
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>💬</div>
        <p style={{ color: '#666' }}>Chargement...</p>
      </div>
    </div>
  );
};

export default WhatsappExport;
