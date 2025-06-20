// utils/auth.js
export const getAdminToken = () => {
  try {
    const raw = localStorage.getItem("adminData");
    return JSON.parse(raw)?.token || null;
  } catch {
    return null;
  }
};
