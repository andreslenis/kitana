import React, { useState } from 'react';
import { UserRole, User } from './types';
import LoginScreen from './components/auth/LoginScreen';
import SuperAdminPanel from './views/SuperAdminPanel';
import VerifierPanel from './views/VerifierPanel';
import ModeratorPanel from './views/ModeratorPanel';
import UserApp from './views/UserApp';
import BusinessLanding from './views/BusinessLanding';
import LandingPage from './views/LandingPage';
import { api } from './services/api';

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole>(UserRole.GUEST);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Navigation State for Guest Users
  const [guestView, setGuestView] = useState<'landing' | 'login' | 'business'>('landing');

  // Local state for users to support new registrations in this session
  const [allUsers, setAllUsers] = useState<User[]>([]);

  // Load initial users
  React.useEffect(() => {
      api.users.getAll().then(setAllUsers);
  }, []);

  const handleRegister = async (newUser: User) => {
      setIsLoading(true);
      await api.auth.register(newUser);
      const updatedUsers = await api.users.getAll();
      setAllUsers(updatedUsers);
      setIsLoading(false);
      // Automatically login after register for MVP smoothness
      setCurrentUser(newUser);
      setRole(UserRole.USER);
  };

  const handleLogin = async (pin: string) => {
    setIsLoading(true);
    try {
        const response = await api.auth.login(pin);
        
        if (response.success) {
            if (response.user) setCurrentUser(response.user);
            setRole(response.role);
        } else {
            alert(response.error || 'Error de autenticación');
        }
    } catch (error) {
        alert('Error de conexión con el servidor.');
    } finally {
        setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setRole(UserRole.GUEST);
    setCurrentUser(null);
    setGuestView('login'); // Redirect to Login Screen specifically
  };

  if (isLoading && role === UserRole.GUEST) {
      return (
          <div className="min-h-screen bg-black flex flex-col items-center justify-center text-amber-500">
              <div className="w-12 h-12 border-4 border-amber-900 border-t-amber-500 rounded-full animate-spin mb-4"></div>
              <p className="text-xs tracking-widest uppercase">Conectando segura...</p>
          </div>
      );
  }

  // --- GUEST ROUTING ---
  if (role === UserRole.GUEST) {
    if (guestView === 'landing') {
        return (
            <LandingPage 
                onUserEnter={() => setGuestView('login')} 
                onBusinessEnter={() => setGuestView('business')} 
            />
        );
    }
    
    if (guestView === 'business') {
        return (
            <BusinessLanding 
                onBack={() => setGuestView('landing')} 
                onRegister={() => setGuestView('login')} 
            />
        );
    }

    // Default to Login Screen
    return (
        <LoginScreen 
            onLogin={handleLogin} 
            onRegister={handleRegister} 
            onBack={() => setGuestView('landing')} // New prop to go back
        />
    );
  }

  // --- AUTHENTICATED VIEWS ---

  if (role === UserRole.ADMIN) {
    return <SuperAdminPanel onLogout={handleLogout} />;
  }

  if (role === UserRole.VERIFIER) {
    return <VerifierPanel user={currentUser} onLogout={handleLogout} />;
  }

  if (role === UserRole.MODERATOR) {
      return <ModeratorPanel onLogout={handleLogout} />;
  }

  if (role === UserRole.USER && currentUser) {
    return <UserApp user={currentUser} allUsers={allUsers} onLogout={handleLogout} />;
  }

  return <div>Error de estado crítico</div>;
};

export default App;