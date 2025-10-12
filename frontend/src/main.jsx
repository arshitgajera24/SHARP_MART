import { createRoot } from 'react-dom/client'
import './index.css'
import {BrowserRouter} from "react-router-dom";
import App from './App.jsx'
import 'aos/dist/aos.css';
import StoreContextProvider from './context/StoreContext.jsx';
import {ToastContainer} from "react-toastify";

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <StoreContextProvider>
      <App />
      <ToastContainer
              bodyClassName="toastBody"
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick={false}
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
              />
    </StoreContextProvider>
  </BrowserRouter>
)
