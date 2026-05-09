import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Home } from './pages/Home/Home';
import { Library } from './pages/Library/Library';
import { Store } from './pages/Store/Store';
import { Register } from './pages/Register/Register';
import { SignIn } from './pages/SignIn/SignIn';
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute';
import { AdminRoute } from './components/AdminRoute/AdminRoute';
import { AdminDashboard } from './pages/AdminDashboard/AdminDashboard';
import { UserDetails } from './pages/UserDetails/UserDetails';


const App: React.FC = () => {
    return (
        <AuthProvider >
            <Router>
                <Routes>
                    <Route 
                        path="/" 
                        element={
                            <Home />
                        }
                    />
                    <Route 
                        path="/home" 
                        element={
                            <Home />
                        }
                    />
                    <Route 
                        path="/library" 
                        element={
                            <ProtectedRoute>
                                <Library />
                            </ProtectedRoute>
                        } 
                    />
                    <Route
                        path="/store" 
                        element={
                            <ProtectedRoute>
                                <Store />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/register" 
                        element={
                            <Register />
                        } 
                    />
                    <Route 
                        path="/signin" 
                        element={
                            <SignIn />
                        } 
                    />
                    <Route
                        path="/admin"
                        element={
                            <AdminRoute>
                                <AdminDashboard />
                            </AdminRoute>
                        }
                    />
                    <Route
                        path="/admin/users/:id"
                        element={
                            <AdminRoute>
                            <UserDetails />
                            </AdminRoute>
                        }
                    />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;
