import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { WalletContextProvider } from './components/WalletContextProvider'

createRoot(document.getElementById("root")!).render(
  <WalletContextProvider>
    <App />
  </WalletContextProvider>
);
