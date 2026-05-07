/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react';
import axios from '../config/axios.js';

const UserContext = createContext(null);

export function UserProvider({ children }) {
    const [ user, setUser ] = useState(() => {
        const stored = localStorage.getItem('user');
        return stored ? JSON.parse(stored) : null;
    });
    const [ booting, setBooting ] = useState(Boolean(localStorage.getItem('token')));

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            setBooting(false);
            return;
        }

        axios.get('/users/profile')
            .then(res => {
                setUser(res.data.user);
                localStorage.setItem('user', JSON.stringify(res.data.user));
            })
            .catch(() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setUser(null);
            })
            .finally(() => setBooting(false));
    }, []);

    const saveUser = nextUser => {
        setUser(nextUser);

        if (nextUser) {
            localStorage.setItem('user', JSON.stringify(nextUser));
        } else {
            localStorage.removeItem('user');
        }
    };

    return (
        <UserContext.Provider value={{ user, setUser: saveUser, booting }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);

    if (!context) {
        throw new Error('useUser must be used inside UserProvider');
    }

    return context;
}
