/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { API_BASE } from '../services/config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const storedUser = localStorage.getItem('user');
            const token = localStorage.getItem('token');
            if (storedUser && token) {
                const parsed = JSON.parse(storedUser);
                // axios.defaults.headers.common['Authorization'] is handled by interceptor in api.js
                return parsed;
            }
        } catch (e) {
            console.error("Failed to parse user", e);
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        }
        return null;
    });
    const [loading] = useState(false);

    const login = async (email, password) => {
        const response = await axios.post(`${API_BASE}/auth/login`, { email, password });
        const { token, ...userData } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        // axios.defaults.headers.common['Authorization'] is handled by interceptor in api.js
        setUser(userData);
        return userData;
    };

    const register = async (userData) => {
        const response = await axios.post(`${API_BASE}/auth/register`, userData);
        const { token, ...data } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(data));
        // axios.defaults.headers.common['Authorization'] is handled by interceptor in api.js
        setUser(data);
        return data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // delete axios.defaults.headers.common['Authorization']; // Handled by interceptor logic (token removal)
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
