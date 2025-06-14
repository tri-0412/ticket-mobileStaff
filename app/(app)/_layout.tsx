import { Stack, Redirect } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { Text } from "react-native";

export default function AppLayout() {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!token) {
    return <Redirect href="/" />; // Điều hướng về trang Home thay vì /(auth)/login
  }

  return (
    <Stack>
      <Stack.Screen
        name="dashboard"
        options={{ title: "Dashboard", headerShown: false }}
      />
      <Stack.Screen
        name="check-in"
        options={{ title: "Check In", headerShown: false }}
      />
      <Stack.Screen
        name="checkin-history"
        options={{ title: "Check In History", headerShown: false }}
      />
      <Stack.Screen
        name="profile"
        options={{ title: "Profile", headerShown: false }}
      />
      <Stack.Screen
        name="change-password"
        options={{ title: "Change Password", headerShown: false }}
      />
    </Stack>
  );
}
