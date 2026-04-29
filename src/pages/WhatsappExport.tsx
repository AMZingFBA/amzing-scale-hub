// Redirect immediately to the static HTML file, before React renders anything.
if (typeof window !== 'undefined' && !window.location.pathname.endsWith('.html')) {
  window.location.replace('/whatsapp-export.html');
}

const WhatsappExport = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0b141a', color: '#e9edef' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>💬</div>
        <p>Chargement...</p>
      </div>
    </div>
  );
};

export default WhatsappExport;
