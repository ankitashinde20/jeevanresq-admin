import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './state/AuthContext.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { DashboardLayout } from './components/layout/DashboardLayout.jsx';
import { DashboardPage } from './pages/DashboardPage.jsx';
import { SosPage } from './pages/SosPage.jsx';
import { MissingPage } from './pages/MissingPage.jsx';
import { ResourcesPage } from './pages/ResourcesPage.jsx';
import { CallsPage } from './pages/CallsPage.jsx';
import { TeamsPage } from './pages/TeamsPage.jsx';
import { CampsPage } from './pages/CampsPage.jsx';
import { PeoplePage } from './pages/PeoplePage.jsx';
import { RationPage } from './pages/RationPage.jsx';
import { MapPage } from './pages/MapPage.jsx';
import { AnalyticsPage } from './pages/AnalyticsPage.jsx';
import { NotificationsPage } from './pages/NotificationsPage.jsx';

export function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />} />
      <Route path="/" element={isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" />}>
        <Route index element={<DashboardPage />} />
        <Route path="sos" element={<SosPage />} />
        <Route path="missing" element={<MissingPage />} />
        <Route path="resources" element={<ResourcesPage />} />
        <Route path="calls" element={<CallsPage />} />
        <Route path="teams" element={<TeamsPage />} />
        <Route path="camps" element={<CampsPage />} />
        <Route path="people" element={<PeoplePage />} />
        <Route path="ration" element={<RationPage />} />
        <Route path="map" element={<MapPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

