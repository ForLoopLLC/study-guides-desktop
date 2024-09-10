import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'tailwindcss/tailwind.css';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import { Questions, Tags, Users } from './pages/database';
import { Home } from './pages';
import { useAppContext } from './contexts/AppContext';

const App = () => {
  const navigate = useNavigate();
  const appContext = useAppContext();

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
      appContext.setEnvironment(newEnv);
    };
    const removeListener = window.electron.ipcRenderer.on(
      'env-update',
      handleEnvUpdate,
    );
    return () => {
      removeListener();
    };
  }, []);

  return (
    <Routes>
      <Route path="/users" element={<Users />} />
      <Route path="/tags" element={<Tags />} />
      <Route path="/questions" element={<Questions />} />
      <Route path="*" element={<Home />} />
    </Routes>
  );
};

export default App;
