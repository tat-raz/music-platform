import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Home } from './pages/Home/Home';
import { Library } from './pages/Library/Library';
import { Store } from './pages/Store/Store';
import { Register } from './pages/Register/Register';
import { SignIn } from './pages/SignIn/SignIn';


const App: React.FC = () => {
    return (
        <AuthProvider >
            <Router>
                <Routes>
                    <Route path="/" element={<Navigate to="/home" />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/library" element={<Library />} />
                    <Route path="/store" element={<Store />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/signin" element={<SignIn />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;
