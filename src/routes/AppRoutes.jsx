import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useUser } from '../context/UserContext.jsx';
import Login from '../screens/Login.jsx';
import Register from '../screens/Register.jsx';
import Home from '../screens/Home.jsx';
import Project from '../screens/Project.jsx';

function ProtectedRoute({ children }) {
    const { user, booting } = useUser();

    if (booting) {
        return <div className="grid min-h-screen place-items-center bg-stone-100 text-stone-600">Loading workspace...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/"
                    element={(
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    )}
                />
                <Route
                    path="/project/:projectId"
                    element={(
                        <ProtectedRoute>
                            <Project />
                        </ProtectedRoute>
                    )}
                />
            </Routes>
        </BrowserRouter>
    );
}
