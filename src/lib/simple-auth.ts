// Simple password-only authentication system
// No email, no username, just password

const ADMIN_PASSWORD = "admin123"; // Change this to your desired password

export const simpleLogin = (password: string): boolean => {
  return password === ADMIN_PASSWORD;
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
