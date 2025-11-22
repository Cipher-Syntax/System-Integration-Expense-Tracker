import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout, Dashboard, Login, Register, NotFound, ForgotPassword, Expenses, Budgets, Reports, Notification, Settings, PasswordResetConfirm } from './pages';
import { ProtectedRoute } from './components';

const App = () => {
    const Logout = () => <Navigate to="/login" />;

    return (
        <BrowserRouter>
            <Routes>
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route path='/logout' element={<Logout />} />
                <Route path='/forgot-password' element={<ForgotPassword />} />
                <Route path='api/reset-password/:uid/:token' element={<PasswordResetConfirm />} />
                <Route path='*' element={<NotFound />} />

                <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                    <Route path='/home' element={<Dashboard />} />
                    <Route path='/expenses' element={<Expenses />} />
                    <Route path='/budgets' element={<Budgets />} />
                    <Route path='/reports' element={<Reports />} />
                    <Route path='/notifications' element={<Notification />} />
                    <Route path='/settings' element={<Settings />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App;
