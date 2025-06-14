import { Stack, Redirect } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { Text } from "react-native";
import { usePathname } from "expo-router";

export default function AuthLayout() {
  const { token, isLoading } = useAuth();
  const pathname = usePathname();

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  // Nếu người dùng đã đăng nhập và đang ở trang Home ("/"), điều hướng đến dashboard
  if (token && pathname === "/") {
    return <Redirect href="/dashboard" />;
  }

  // Nếu người dùng đã đăng nhập và đang ở nhóm (auth), điều hướng đến dashboard
  if (token && pathname.startsWith("/(auth)")) {
    return <Redirect href="/dashboard" />;
  }

  return (
    <Stack>
      <Stack.Screen
        name="login"
        options={{
          headerShown: false, // Disable the default navigation header for SignIn screen
        }}
      />
      <Stack.Screen
        name="forgot-password"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
