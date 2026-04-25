// Simple password-only authentication system
// No email, no username, just password

const DEFAULT_ADMIN_PASSWORD = "admin123"; // Fallback password

const getStoredPassword = (): string => {
  try {
    const stored = localStorage.getItem("adminAuth");
    if (stored) {
      const credentials = JSON.parse(stored);
      return credentials.password || DEFAULT_ADMIN_PASSWORD;
    }
  } catch (error) {
    console.error('Error reading stored password:', error);
  }
  return DEFAULT_ADMIN_PASSWORD;
};

export const simpleLogin = (password: string): boolean => {
  const storedPassword = getStoredPassword();
  return password === storedPassword;
};

export const checkAuth = (): boolean => {
  return sessionStorage.getItem('adminAuthenticated') === 'true';
};

export const setAuth = (password: string): boolean => {
  const isValid = simpleLogin(password);
  if (isValid) {
    sessionStorage.setItem('adminAuthenticated', 'true');
    sessionStorage.setItem('loginTime', Date.now().toString());
  }
  return isValid;
};

export const clearAuth = (): void => {
  sessionStorage.removeItem('adminAuthenticated');
  sessionStorage.removeItem('loginTime');
};

export const validateCurrentPassword = (password: string): boolean => {
  return simpleLogin(password);
};

export const getCurrentPassword = (): string => {
  return getStoredPassword();
};
