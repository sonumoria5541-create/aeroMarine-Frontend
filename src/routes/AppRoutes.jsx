import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MobileShell } from '../components/layout/MobileShell';
import { ProtectedRoute } from './ProtectedRoute';
import { AdminRoute } from './AdminRoute';

// Core Mobile Pages
import { HomePage } from '../pages/public/HomePage';
import { AboutPage } from '../pages/public/AboutPage';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { IncomePage } from '../pages/dashboard/IncomePage';
import { WheelPage } from '../pages/dashboard/WheelPage';
import { TeamPage } from '../pages/dashboard/TeamPage';
import { SharePage } from '../pages/dashboard/SharePage';
import { ProfilePage } from '../pages/dashboard/ProfilePage';
import { RechargePage } from '../pages/dashboard/RechargePage';
import { WithdrawPage } from '../pages/dashboard/WithdrawPage';
import { BankCardPage } from '../pages/dashboard/BankCardPage';
import { RecordsPage } from '../pages/dashboard/RecordsPage';
import { SecurityPage } from '../pages/dashboard/SecurityPage';
import { MessagesPage } from '../pages/dashboard/MessagesPage';
import { AdminPage } from '../pages/admin/AdminPage';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MobileShell />}>
        {/* Core Nav & Public Pages */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Reference App Path Aliases */}
        <Route path="/pages/home/home" element={<HomePage />} />
        <Route path="/pages/index/index" element={<HomePage />} />
        <Route path="/pages/about/about" element={<AboutPage />} />
        <Route path="/pages/login/login" element={<LoginPage />} />
        <Route path="/pages/register/register" element={<RegisterPage />} />

        {/* Protected Dashboard Pages */}
        <Route
          path="/income"
          element={
            <ProtectedRoute>
              <IncomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pages/purchase/purchase"
          element={
            <ProtectedRoute>
              <IncomePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/task"
          element={
            <ProtectedRoute>
              <WheelPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pages/task/task"
          element={
            <ProtectedRoute>
              <WheelPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/team"
          element={
            <ProtectedRoute>
              <TeamPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pages/team/team"
          element={
            <ProtectedRoute>
              <TeamPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/share"
          element={
            <ProtectedRoute>
              <SharePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pages/share/share"
          element={
            <ProtectedRoute>
              <SharePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pages/my/my"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recharge"
          element={
            <ProtectedRoute>
              <RechargePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pages/recharge/recharge"
          element={
            <ProtectedRoute>
              <RechargePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/withdraw"
          element={
            <ProtectedRoute>
              <WithdrawPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pages/withdraw/withdraw"
          element={
            <ProtectedRoute>
              <WithdrawPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/bank"
          element={
            <ProtectedRoute>
              <BankCardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pages/bank/bank"
          element={
            <ProtectedRoute>
              <BankCardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profit"
          element={
            <ProtectedRoute>
              <RecordsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pages/profit/profit"
          element={
            <ProtectedRoute>
              <RecordsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/pass"
          element={
            <ProtectedRoute>
              <SecurityPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pages/pass/pass"
          element={
            <ProtectedRoute>
              <SecurityPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <MessagesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pages/messages/messages"
          element={
            <ProtectedRoute>
              <MessagesPage />
            </ProtectedRoute>
          }
        />

        {/* Admin Route */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          }
        />
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
