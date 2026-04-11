import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import type { Identity } from "@icp-sdk/core/agent";

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  identity: Identity | null;
  principal: string | null;
  login: () => Promise<void>;
  logout: () => void;
}

export function useAuth(): AuthState {
  const { identity, login, clear, isLoggingIn, isLoginSuccess } =
    useInternetIdentity();

  const isLoading = isLoggingIn;
  // Authenticated either after successful login OR when identity is loaded from storage
  const isAuthenticated = (isLoginSuccess || !!identity) && !!identity;
  const principal = identity ? identity.getPrincipal().toString() : null;

  const handleLogin = async () => {
    await login();
  };

  const handleLogout = () => {
    clear();
  };

  return {
    isAuthenticated,
    isLoading,
    identity: identity ?? null,
    principal,
    login: handleLogin,
    logout: handleLogout,
  };
}
