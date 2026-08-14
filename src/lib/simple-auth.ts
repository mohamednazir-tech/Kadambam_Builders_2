import { supabase } from "./supabase";
import SHA256 from "crypto-js/sha256";

export const setAuth = async (password: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from("admin_config")
    .select("password_hash")
    .eq("id", 1)
    .single();

  if (error || !data) {
    console.error(error);
    return false;
  }

  const hash = SHA256(password).toString();

  if (hash === data.password_hash) {
    sessionStorage.setItem("adminAuthenticated", "true");
    return true;
  }

  return false;
};

export const checkAuth = () => {
  return sessionStorage.getItem("adminAuthenticated") === "true";
};

export const clearAuth = () => {
  sessionStorage.removeItem("adminAuthenticated");
};
export const validateCurrentPassword = async (
  password: string
): Promise<boolean> => {
  const { data, error } = await supabase
    .from("admin_config")
    .select("password_hash")
    .eq("id", 1)
    .single();

  if (error || !data) {
    return false;
  }

  return SHA256(password).toString() === data.password_hash;
};