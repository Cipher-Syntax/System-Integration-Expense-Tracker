import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout, Dashboard, Login, Register, NotFound, ForgotPassword, Expenses, Budgets, Reports, Settings, PasswordResetConfirm } from './pages';
import { ProtectedRoute } from './components';

const App = () => {
    const Logout = () => {
        return <Navigate to="/login"></Navigate>
    }

    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path='/login' element={<Login></Login>}></Route>
                    <Route path='/register' element={<Register></Register>}></Route>
                    <Route path='/logout' element={<Logout></Logout>}></Route>
                    <Route path='*' element={<NotFound></NotFound>}></Route>
                    <Route path='/forgot-password' element={<ForgotPassword></ForgotPassword>}></Route>
                    <Route path='api/reset-password/:uid/:token' element={<PasswordResetConfirm></PasswordResetConfirm>}></Route>

                    <Route element={<Layout></Layout>}>
                        <Route path='/' element={
                            <ProtectedRoute>
                                <Dashboard></Dashboard>
                            </ProtectedRoute>
                        }>
                        </Route>
                        <Route path='/expenses' element={<Expenses></Expenses>}></Route>
                        <Route path='/budgets' element={<Budgets></Budgets>}></Route>
                        <Route path='/reports' element={<Reports></Reports>}></Route>
                        <Route path='/settings' element={<Settings></Settings>}></Route>
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App