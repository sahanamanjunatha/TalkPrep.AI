import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          if (token === 'mock-jwt-token-for-demo-purposes') {
            const savedUser = localStorage.getItem('user');
            if (savedUser) {
              setUser(JSON.parse(savedUser));
            } else {
              setUser({
                id: 'mock-user-id-12345',
                name: 'John Candidate',
                email: 'user@talkprep.ai',
                role: 'user',
                targetRole: 'Software Engineer',
                experienceLevel: 'Intermediate'
              });
            }
          } else {
            const res = await api.get('/auth/profile');
            if (res.data.success) {
              setUser(res.data.user);
            } else {
              logout();
            }
          }
        } catch (err) {
          console.error("Profile check failed:", err.message);
          // Fallback to local storage user during demo if api fails
          const savedUser = localStorage.getItem('user');
          if (savedUser) {
            try {
              setUser(JSON.parse(savedUser));
            } catch (e) {
              logout();
            }
          } else {
            logout();
          }
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    // Frontend-only mock login for demo purposes
    const isMockAdmin = email === 'admin@talkprep.ai';
    const isMockUser = email === 'user@talkprep.ai';
    const storedPassword = localStorage.getItem('mock_password_' + email);
    const expectedPassword = storedPassword || 'password123';

    if (password !== expectedPassword) {
      return { success: false, message: 'Incorrect email or password. Please try again.' };
    }

    // Extract name from personal email
    let displayName = 'John Candidate';
    if (email) {
      if (isMockAdmin) {
        displayName = 'System Admin';
      } else {
        const parts = email.split('@');
        if (parts.length > 0) {
          const rawName = parts[0];
          displayName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
        }
      }
    }

    const mockUserObj = {
      id: isMockAdmin ? 'mock-admin-id-12345' : 'mock-user-id-12345',
      name: displayName,
      email: email || 'user@talkprep.ai',
      role: isMockAdmin ? 'admin' : 'user',
      targetRole: isMockAdmin ? 'Lead Architect' : 'Software Engineer',
      experienceLevel: isMockAdmin ? 'Advanced' : 'Intermediate',
      skills: ['JavaScript', 'React', 'Node.js'],
      avatar: '',
      bio: 'Passionate software engineer practicing mock interviews.',
      github: 'https://github.com',
      linkedin: 'https://linkedin.com'
    };

    localStorage.setItem('token', 'mock-jwt-token-for-demo-purposes');
    localStorage.setItem('user', JSON.stringify(mockUserObj));
    setToken('mock-jwt-token-for-demo-purposes');
    setUser(mockUserObj);
    return { success: true };
  };

  const register = async (name, email, password, targetRole, experienceLevel) => {
    // Frontend-only mock register for demo purposes
    const mockUserObj = {
      id: 'mock-user-id-' + Math.random().toString(36).substring(2, 11),
      name: name || 'John Candidate',
      email: email || 'user@talkprep.ai',
      role: 'user',
      targetRole: targetRole || 'Software Engineer',
      experienceLevel: experienceLevel || 'Intermediate',
      skills: [],
      avatar: '',
      bio: '',
      github: '',
      linkedin: ''
    };

    localStorage.setItem('token', 'mock-jwt-token-for-demo-purposes');
    localStorage.setItem('user', JSON.stringify(mockUserObj));
    localStorage.setItem('mock_password_' + email, password);
    setToken('mock-jwt-token-for-demo-purposes');
    setUser(mockUserObj);
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await api.put('/auth/profile', profileData);
      if (res.data.success) {
        setUser(res.data.user);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        return { success: true };
      }
    } catch (error) {
      // Fallback for demo purposes
      const updatedUser = { ...user, ...profileData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return { success: true };
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
