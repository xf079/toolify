import ReactDOM from 'react-dom/client';
import App from './App';
import '@/design/index.less'

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);

// Use contextBridge
if(window.ipcRenderer){
  window.ipcRenderer.on('main-process-message', (_event, message) => {
    console.log(message);
  });
}
