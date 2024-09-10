import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'tailwindcss/tailwind.css';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import { Channels } from '../types';
import { Questions, Tags, Users } from './pages/database';

const App = () => {
  const navigate = useNavigate();
  const [environment, setEnvironment] = useState<string>('development');

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

  useEffect(() => {
    const handleEnvUpdate = (newEnv: any) => {
      setEnvironment(newEnv);
    };
    const removeListener = window.electron.ipcRenderer.on(
      'env-update',
      handleEnvUpdate,
    );
    return () => {
      removeListener();
    };
  }, []);

  useEffect(() => {
    console.log('Environment:', environment);
  }, [environment]);

  return (
    <Routes>
      <Route path="/users" element={<Users />} />
      <Route path="/tags" element={<Tags />} />
      <Route path="/questions" element={<Questions />} />
    </Routes>
  );
};

export default App;
