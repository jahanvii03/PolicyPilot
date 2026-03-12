import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import type { LoginCredentials } from "../types";


export  function useLogin() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const loginUser = async ({ username, password }: LoginCredentials) => {
    setError("");
    setIsLoading(true);
// const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/auth/login` || "";
const API_URL="https://hrpoc-fqbvc9g7gtdrb9be.southindia-01.azurewebsites.net/api/auth/login"

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || "Login failed");
      }

      const { access_token, user } = result;

      login(access_token, user);

      return { success: true, user };
    } catch (err: any) {
      const message = err.message || "Something went wrong";
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    loginUser,
    isLoading,
    error,
    setError,
  };
}