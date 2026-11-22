import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../common/Navbar';
import { Footer } from '../common/Footer';
import { DemoBanner } from '../common/DemoBanner';

export const AppLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-maritime-bg">
      <DemoBanner />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
