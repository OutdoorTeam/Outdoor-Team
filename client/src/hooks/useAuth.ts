import * as React from 'react';

interface AuthUser {
  id: number;
  email: string;
  name: string;
  isAdmin: boolean;
}

export function useAuth() {
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Para el demo, simulamos que hay un usuario logueado
    // En producción esto vendría de un contexto de autenticación real
    const checkAuth = async () => {
      try {
        // Simulamos verificar si es admin basado en el email
        const demoUser: AuthUser = {
          id: 1,
          email: 'admin@outdoorteam.com',
          name: 'Admin Usuario',
          isAdmin: true // Cambiar a true para probar vista de admin
        };
        
        // Para usuarios normales, usar:
        // demoUser.isAdmin = false;
        // demoUser.email = 'demo@outdoorteam.com';
        // demoUser.name = 'Usuario Demo';
        
        setUser(demoUser);
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return { user, loading };
}
