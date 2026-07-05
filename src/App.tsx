import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppLayout from './layouts/AppLayout';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Draw from './pages/Draw';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Pagine senza AppLayout */}
          <Route path="/" element={<Landing />} />

          {/* Pagine con AppLayout (sidebar, navbar, modali) */}
          <Route path="/home" element={<AppLayout><Home /></AppLayout>} />
          <Route path="/draw" element={<AppLayout><Draw /></AppLayout>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App; 