import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LandingOverview } from './pages/LandingOverview';
import { DashboardOverview } from './pages/DashboardOverview';
import { LiveSensors } from './pages/LiveSensors';
import { IntelligentControl } from './pages/IntelligentControl';
import { AiAnalytics } from './pages/AiAnalytics';
import { SystemArchitecture } from './pages/SystemArchitecture';
import { AlertHistory } from './pages/AlertHistory';
import { ValidationRoadmap } from './pages/ValidationRoadmap';
import { Login } from './pages/Login';
import { QuickBillModal } from './components/QuickBillModal'; // Quick Load Shift modal
import { ReceiptModal } from './components/ReceiptModal';     // Energy Audit Report modal

export function App() {
  const [currentRoute, setCurrentRoute] = useState<string>('/');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [isQuickControlOpen, setIsQuickControlOpen] = useState<boolean>(false);
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (['/dashboard', '/sensors', '/controls', '/analytics', '/demand-response', '/alerts', '/architecture', '/roadmap', '/login'].includes(path)) {
        setCurrentRoute(path);
      } else {
        setCurrentRoute('/');
      }
    };

    handlePopState();
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = (route: string) => {
    setCurrentRoute(route);
    window.history.pushState(null, '', route);
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    handleNavigate('/dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('smart_building_token');
    setIsAuthenticated(false);
    handleNavigate('/login');
  };

  // Standalone Login Screen
  if (currentRoute === '/login' || !isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="h-screen bg-slate-950 flex flex-col overflow-hidden font-sans">
      {/* Header Bar */}
      <Navbar
        currentRoute={currentRoute}
        onNavigate={handleNavigate}
        onOpenQuickBill={() => setIsQuickControlOpen(true)}
        onLogout={handleLogout}
      />

      {/* Body Workstation Layout */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          currentRoute={currentRoute}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />

        <main className="flex-1 overflow-y-auto bg-slate-950">
          {currentRoute === '/' && <LandingOverview onNavigate={handleNavigate} />}
          {currentRoute === '/dashboard' && (
            <DashboardOverview
              onNavigate={handleNavigate}
              onOpenReportDetail={() => setIsReportOpen(true)}
            />
          )}
          {currentRoute === '/sensors' && <LiveSensors />}
          {currentRoute === '/controls' && <IntelligentControl />}
          {currentRoute === '/analytics' && <AiAnalytics />}
          {currentRoute === '/demand-response' && <ValidationRoadmap onNavigate={handleNavigate} />}
          {currentRoute === '/alerts' && <AlertHistory />}
          {currentRoute === '/architecture' && <SystemArchitecture />}
          {currentRoute === '/roadmap' && <ValidationRoadmap onNavigate={handleNavigate} />}
        </main>
      </div>

      {/* Global Quick Control / Load Shift Modal */}
      <QuickBillModal
        isOpen={isQuickControlOpen}
        onClose={() => setIsQuickControlOpen(false)}
        onSuccess={() => handleNavigate('/dashboard')}
      />

      {/* Global Energy Audit Report Modal */}
      <ReceiptModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
      />
    </div>
  );
}

export default App;
