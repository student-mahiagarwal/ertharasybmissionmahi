import { UserProvider } from './context/UserContext.jsx';
import AppRoutes from './routes/AppRoutes.jsx';

export default function App() {
    return (
        <UserProvider>
            <AppRoutes />
        </UserProvider>
    );
}
