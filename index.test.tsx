import React from 'react';
import ReactDOM from 'react-dom/client';

// Simple test to verify React is working
const TestApp = () => {
  return (
    <div style={{ 
      background: '#ff0000', 
      color: 'white', 
      padding: '50px', 
      fontSize: '30px',
      minHeight: '100vh'
    }}>
      <h1>🔴 REACT IS WORKING! 🔴</h1>
      <p>If you see this RED screen, React is mounted correctly.</p>
      <p>Testing API connection...</p>
      <button onClick={() => {
        fetch('https://3001-i0cpklycmklcu6n1lnlbc-de59bda9.sandbox.novita.ai/api/health')
          .then(r => r.json())
          .then(d => alert('API Working: ' + JSON.stringify(d)))
          .catch(e => alert('API Error: ' + e));
      }}>
        Test API
      </button>
    </div>
  );
};

const rootElement = document.getElementById('root');
if (!rootElement) {
  document.body.innerHTML = '<h1 style="color:yellow;background:black;padding:50px">ERROR: Root element not found!</h1>';
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(<TestApp />);
