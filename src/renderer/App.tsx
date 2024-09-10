import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'tailwindcss/tailwind.css';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import { Channels } from '../types';
import { Questions, Tags, Users } from './pages/database';

const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleNavigation = (route: any) => {
      navigate(route);
    };
    const removeListener = window.electron.ipcRenderer.on(
      'navigate',
      handleNavigation,
    );

    return () => {
      removeListener();
    };
  }, [navigate]);

  return (
    <Routes>
      <Route path="/users" element={<Users />} />
      <Route path="/tags" element={<Tags />} />
      <Route path="/questions" element={<Questions />} />
    </Routes>
  );
};

export default App;
