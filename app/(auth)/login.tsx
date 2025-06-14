import React, { useState, useMemo } from "react";
import {
  Alert,
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import api from "../../lib/api";
import { Button, Input } from "@rneui/themed";
import { Link, useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });
  const [serverError, setServerError] = useState("");
  const { signIn } = useAuth();
  const router = useRouter();

  // Tối ưu hóa gradient colors
  const gradientColors = useMemo(
    (): [string, string] => ["#e0f7fa", "#b3e5fc"],
    []
  );

  const validateForm = () => {
    const newErrors = {
      username: "",
      password: "",
    };
    let hasErrors = false;

    if (!username.trim()) {
      newErrors.username = "Vui lòng nhập Tên đăng nhập của bạn";
      hasErrors = true;
    }
    if (!password.trim()) {
      newErrors.password = "Vui lòng nhập Mật khẩu của bạn";
      hasErrors = true;
    }

    setErrors(newErrors);
    return !hasErrors;
  };

  const handleSignIn = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setServerError("");
    try {
      const response = await api.post("auth/login", {
        username: username.trim(), // Trim để đảm bảo dữ liệu sạch
        password: password.trim(),
      });
      const token = response.data.token;
      if (!token || typeof token !== "string") {
        throw new Error("Token không hợp lệ từ phản hồi API");
      }
      console.log("Token từ API /login:", token);
      await signIn(token);
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Lỗi đăng nhập:", error);
      setServerError("Tên đăng nhập hoặc mật khẩu không đúng");
      Alert.alert(
        "Lỗi",
        error.message || error.response?.data?.message || "Đăng nhập thất bại"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <LinearGradient colors={gradientColors} style={styles.container}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#0277bd" />
        </Pressable>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Đăng nhập</Text>

          <Text style={styles.label}>Username</Text>
          <Input
            placeholder="Tên đăng nhập"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            inputContainerStyle={styles.inputContainer}
            inputStyle={styles.input}
            placeholderTextColor="#999"
            errorMessage={errors.username}
            errorStyle={styles.errorText}
          />

          <View>
            <Text style={styles.label}>Mật khẩu</Text>
            <Input
              placeholder="Mật khẩu"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              rightIcon={
                <Pressable onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#999"
                  />
                </Pressable>
              }
              inputContainerStyle={styles.inputContainer}
              inputStyle={styles.input}
              placeholderTextColor="#999"
              errorMessage={errors.password}
              errorStyle={styles.errorText}
            />
            {serverError ? (
              <Text style={styles.serverErrorText}>{serverError}</Text>
            ) : null}
          </View>

          <Button
            title={
              loading ? (
                <View style={styles.buttonContent}>
                  <ActivityIndicator size="small" color="#fff" />
                  <Text style={styles.signInButtonText}>Đang đăng nhập...</Text>
                </View>
              ) : (
                "Đăng nhập"
              )
            }
            onPress={handleSignIn}
            disabled={loading}
            buttonStyle={styles.signInButton}
            titleStyle={styles.signInButtonText}
            containerStyle={styles.buttonContainer}
            disabledStyle={styles.disabledButton}
          />
          <Link href="/forgot-password">
            <Text style={styles.forgotPasswordLink}>Quên mật khẩu?</Text>
          </Link>
        </View>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  formContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 30,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
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
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 10,
  },
  serverErrorText: {
    fontSize: 14,
    color: "#d32f2f",
    textAlign: "center",
  },
  errorText: {
    fontSize: 12,
    color: "#d32f2f",
    marginTop: 2,
    marginBottom: 8,
  },
  label: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  inputContainer: {
    height: 45,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 30,
    paddingHorizontal: 10,
    marginBottom: 5,
    backgroundColor: "#fff",
  },
  input: {
    fontSize: 16,
    color: "#333",
    paddingLeft: 0,
    paddingRight: 0,
  },
  forgotPasswordLink: {
    fontSize: 14,
    color: "#0277bd",
    textAlign: "center",
    marginTop: 5,
    marginBottom: 15,
  },
  signInButton: {
    backgroundColor: "#000",
    borderRadius: 30,
    paddingVertical: 15,
  },
  signInButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  buttonContainer: {
    marginVertical: 20,
  },
  disabledButton: {
    backgroundColor: "#666",
    opacity: 0.7,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  linkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 5,
  },
  linkText: {
    fontSize: 14,
    color: "#666",
  },
  link: {
    fontSize: 14,
    color: "#0277bd",
  },
  underlineLink: {
    textDecorationLine: "underline",
  },
});
