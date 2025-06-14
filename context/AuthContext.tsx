import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import api from "@/lib/api";

interface AuthContextType {
  token: string | null;
  fullName: string | null;
  isLoading: boolean;
  signIn: (newToken: string) => Promise<void>;
  logOut: () => Promise<void>;
  updateFullName: (fullName: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        const storedFullName = await AsyncStorage.getItem("fullName");
        setToken(storedToken);
        setFullName(storedFullName);
        console.log("Loaded from AsyncStorage:", {
          token: storedToken,
          fullName: storedFullName,
        });
      } catch (error) {
        console.error("Failed to load auth data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadAuthData();
  }, []);

  const signIn = async (newToken: string) => {
    try {
      // Store the token
      await AsyncStorage.setItem("token", newToken);
      setToken(newToken);

      // Set the token in the API headers (assuming your api utility supports this)
      api.defaults.headers.Authorization = `Bearer ${newToken}`;

      // Fetch profile data immediately after login
      const response = await api.get("auth/profile");
      const { fullName } = response.data;
      if (fullName) {
        await AsyncStorage.setItem("fullName", fullName);
        setFullName(fullName);
        console.log("FullName set after login:", fullName);
      }
    } catch (error) {
      console.error("Failed to sign in or fetch profile:", error);
      throw error; // Rethrow to handle in the login component
    }
  };

  const logOut = async () => {
    try {
      await AsyncStorage.multiRemove(["token", "fullName"]);
      setToken(null);
      setFullName(null);
      router.push("/login");
      console.log("Logged out, cleared token and fullName");
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  const updateFullName = async (newFullName: string) => {
    try {
      await AsyncStorage.setItem("fullName", newFullName);
      setFullName(newFullName);
      console.log("FullName updated:", newFullName);
    } catch (error) {
      console.error("Failed to update fullName:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ token, fullName, isLoading, signIn, logOut, updateFullName }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
