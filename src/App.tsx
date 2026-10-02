import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardOverview } from './pages/DashboardOverview';
import { PosBilling } from './pages/PosBilling';
import { CustomerMenu } from './pages/CustomerMenu';
import { KitchenDisplay } from './pages/KitchenDisplay';
import { BillHistory } from './pages/BillHistory';
import { SalesDashboard } from './pages/SalesDashboard';
import { InventoryManager } from './pages/InventoryManager';
import { Login } from './pages/Login';
import { QuickBillModal } from './components/QuickBillModal';
import { ReceiptModal } from './components/ReceiptModal';
import { MenuItem, Order } from './types';
import { api } from './services/api';

export function App() {
  const [currentRoute, setCurrentRoute] = useState<string>('/');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [isQuickBillOpen, setIsQuickBillOpen] = useState<boolean>(false);
  const [quickBillMenuItems, setQuickBillMenuItems] = useState<MenuItem[]>([]);
  
  // Shared Receipt Modal
  const [selectedBillForReceipt, setSelectedBillForReceipt] = useState<Order | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState<boolean>(false);

  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/pos') setCurrentRoute('/pos');
    else if (path === '/menu') setCurrentRoute('/menu');
    else if (path === '/kitchen') setCurrentRoute('/kitchen');
    else if (path === '/sales') setCurrentRoute('/sales');
    else if (path === '/bill-history') setCurrentRoute('/bill-history');
    else if (path === '/inventory') setCurrentRoute('/inventory');
    else if (path === '/login') setCurrentRoute('/login');
    else setCurrentRoute('/');

    loadQuickBillData();
  }, []);

  const loadQuickBillData = async () => {
    try {
      const items = await api.getMenuItems();
      setQuickBillMenuItems(items.filter(i => i.quickBillKey !== null && i.quickBillKey !== undefined));
    } catch (err) {
      console.error('Quick bill data fetch error:', err);
    }
  };

  const handleNavigate = (route: string) => {
    setCurrentRoute(route);
    window.history.pushState(null, '', route);
  };

  const handleLoginSuccess = (token: string) => {
    setIsAuthenticated(true);
    handleNavigate('/');
  };

  const handleLogout = () => {
    localStorage.removeItem('kovai_pos_token');
    setIsAuthenticated(false);
    handleNavigate('/login');
  };

  const handleOpenBillDetail = (order: Order) => {
    setSelectedBillForReceipt(order);
    setIsReceiptOpen(true);
  };

  // Standalone Public Digital Menu
  if (currentRoute === '/menu') {
    return (
      <div className="min-h-screen bg-charcoal-950 flex flex-col font-sans">
        <Navbar
          currentRoute={currentRoute}
          onNavigate={handleNavigate}
          onOpenQuickBill={() => setIsQuickBillOpen(true)}
          onLogout={handleLogout}
        />
        <CustomerMenu />
      </div>
    );
  }

  // Standalone Login Screen
  if (currentRoute === '/login' || !isAuthenticated) {
    return (
      <Login onLoginSuccess={handleLoginSuccess} />
    );
  }

  // Main Restaurant POS Workstation Layout
  return (
    <div className="h-screen bg-charcoal-950 flex flex-col overflow-hidden font-sans">
      <Navbar
        currentRoute={currentRoute}
        onNavigate={handleNavigate}
        onOpenQuickBill={() => setIsQuickBillOpen(true)}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          currentRoute={currentRoute}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />

        <main className="flex-1 overflow-y-auto bg-charcoal-950">
          {currentRoute === '/' && (
            <DashboardOverview
              onNavigate={handleNavigate}
              onOpenBillDetail={handleOpenBillDetail}
            />
          )}
          {currentRoute === '/pos' && <PosBilling />}
          {currentRoute === '/kitchen' && <KitchenDisplay />}
          {currentRoute === '/bill-history' && <BillHistory />}
          {currentRoute === '/sales' && <SalesDashboard />}
          {currentRoute === '/inventory' && <InventoryManager />}
        </main>
      </div>

      {/* Global Quick Bill Drawer Modal */}
      <QuickBillModal
        isOpen={isQuickBillOpen}
        onClose={() => setIsQuickBillOpen(false)}
        quickBillItems={quickBillMenuItems}
        onAddItem={() => {
          handleNavigate('/pos');
          setIsQuickBillOpen(false);
        }}
      />

      {/* Global Bill Detail Thermal Receipt Modal */}
      <ReceiptModal
        order={selectedBillForReceipt}
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
      />
    </div>
  );
}

export default App;
