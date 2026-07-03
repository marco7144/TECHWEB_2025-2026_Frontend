import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Landing from './pages/Landing';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Pagine senza AppLayout */}
          <Route path="/" element={<Landing />} />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App; 