import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Pressable,
  ScrollView,
  StatusBar,
} from "react-native";
import api from "../../lib/api";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useAuth } from "../../context/AuthContext"; // Import useAuth

interface ProfileData {
  username: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  gender: string;
  role: string;
}

export default function Profile() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const router = useRouter();
  const { updateFullName } = useAuth(); // Use the auth context

  const opacity = useSharedValue(0);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("auth/profile");
        setProfile(response.data);
        setError("");
        // Update fullName in AuthContext
        await updateFullName(response.data.fullName);
        opacity.value = withTiming(1, { duration: 1000 });
      } catch (err: any) {
        setError(err.response?.data || "Không thể lấy thông tin hồ sơ");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [updateFullName]); // Add updateFullName to dependency array

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <LinearGradient colors={["#e0f7fa", "#b3e5fc"]} style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#0288d1" />
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={["#e0f7fa", "#b3e5fc"]} style={styles.container}>
      <Pressable onPress={handleBack} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#0277BD" />
      </Pressable>
      <StatusBar hidden={true} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Hồ sơ người dùng</Text>
          {error && error.trim() !== "" ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : null}
          {profile ? (
            <Animated.View style={[styles.profileCard, animatedStyle]}>
              <View style={styles.avatarContainer}>
                <Ionicons
                  name="person-circle-outline"
                  size={80}
                  color="#0288d1"
                />
              </View>
              <View style={styles.profileItem}>
                <Ionicons
                  name="person"
                  size={20}
                  color="#0288d1"
                  style={styles.icon}
                />
                <Text style={styles.label}>Tên đăng nhập: </Text>
                <Text style={styles.value}>{profile.username}</Text>
              </View>
              <View style={styles.profileItem}>
                <Ionicons
                  name="person-outline"
                  size={20}
                  color="#0288d1"
                  style={styles.icon}
                />
                <Text style={styles.label}>Họ tên: </Text>
                <Text style={styles.value}>{profile.fullName}</Text>
              </View>
              <View style={styles.profileItem}>
                <Ionicons
                  name="call-outline"
                  size={20}
                  color="#0288d1"
                  style={styles.icon}
                />
                <Text style={styles.label}>Số điện thoại: </Text>
                <Text style={styles.value}>{profile.phoneNumber}</Text>
              </View>
              <View style={styles.profileItem}>
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color="#0288d1"
                  style={styles.icon}
                />
                <Text style={styles.label}>Email: </Text>
                <Text style={styles.value}>{profile.email}</Text>
              </View>
              <View style={styles.profileItem}>
                <Ionicons
                  name="male-female-outline"
                  size={20}
                  color="#0288d1"
                  style={styles.icon}
                />
                <Text style={styles.label}>Giới tính: </Text>
                <Text style={styles.value}>
                  {profile.gender === "MALE" ? "Nam" : "Nữ"}
                </Text>
              </View>
              <View style={styles.profileItem}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={20}
                  color="#0288d1"
                  style={styles.icon}
                />
                <Text style={styles.label}>Vai trò: </Text>
                <Text style={styles.value}>{profile.role}</Text>
              </View>
            </Animated.View>
          ) : null}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    width: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    position: "relative",
  },
  backButton: {
    top: 60,
    left: 20,
    position: "absolute",
    zIndex: 1,
    backgroundColor: "#fff",
    borderRadius: 50,
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 15,
    fontSize: 14,
  },
  profileCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  icon: {
    marginRight: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#555",
    marginRight: 5,
  },
  value: {
    fontSize: 14,
    color: "#333",
    flex: 1,
  },
});
