import React, { useState } from 'react';
import { UserRole, User, ProfileType } from './types';
import LoginScreen from './components/auth/LoginScreen';
import SuperAdminPanel from './views/SuperAdminPanel';
import VerifierPanel from './views/VerifierPanel';
import UserApp from './views/UserApp';
import { USERS } from './data';

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole>(UserRole.GUEST);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleLogin = (pin: string) => {
    // 1. Roles de Sistema
    if (pin === '000000') {
      setRole(UserRole.ADMIN);
      return;
    } 
    
    if (pin === '111111') {
      setRole(UserRole.VERIFIER);
      setCurrentUser({
        id: 'ver1',
        nickname: 'Agente 01',
        profileType: ProfileType.SINGLE,
        publicPhoto: '',
        gallery: [],
        description: '',
        location: '',
        trustScore: 100,
        verificationLevel: 'Alta Confianza',
        isPremium: true,
        status: 'Active',
        joinedDate: '2023-01-01'
      } as User);
      return;
    }

    // 2. Buscar Usuario (Simulación de DB)
    let foundUser: User | undefined;

    // Mapeo de PINS para Demo
    if (pin === '222222') foundUser = USERS.find(u => u.id === 'u1'); // Elena (Activa)
    else if (pin === '333333') foundUser = USERS.find(u => u.id === 'u3'); // NuevoUser (Pendiente)
    else if (pin === '444444') foundUser = USERS.find(u => u.id === 'u4'); // Velvet (Negocio)

    // 3. Validación de Estados
    if (foundUser) {
        if (foundUser.status === 'Suspended') {
            alert('⛔ CUENTA SUSPENDIDA\nContacta con administración para más detalles.');
            return;
        }

        if (foundUser.status === 'Pending') {
            alert('⏳ VERIFICACIÓN PENDIENTE\nTu perfil está siendo revisado por nuestro equipo de seguridad. Te notificaremos cuando seas aprobado.');
            return;
        }

        // Login Exitoso
        setCurrentUser(foundUser);
        setRole(UserRole.USER);
        return;
    }

    alert('PIN inválido o usuario no encontrado.');
  };

  const handleLogout = () => {
    setRole(UserRole.GUEST);
    setCurrentUser(null);
  };

  if (role === UserRole.GUEST) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  if (role === UserRole.ADMIN) {
    return <SuperAdminPanel onLogout={handleLogout} />;
  }

  if (role === UserRole.VERIFIER) {
    return <VerifierPanel user={currentUser} onLogout={handleLogout} />;
  }

  if (role === UserRole.USER && currentUser) {
    return <UserApp user={currentUser} onLogout={handleLogout} />;
  }

  return <div>Error de estado</div>;
};

export default App;