import React, { useState } from "react";
import {
  Alert,
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  StatusBar,
} from "react-native";
import api from "../../lib/api";
import { Button, Input } from "@rneui/themed";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [errors, setErrors] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const router = useRouter();

  const validateForm = () => {
    const newErrors = {
      oldPassword: "",
      newPassword: "",
    };
    let hasErrors = false;

    // Kiểm tra trường trống
    if (!oldPassword.trim()) {
      newErrors.oldPassword = "Vui lòng nhập mật khẩu cũ";
      hasErrors = true;
    }
    if (!newPassword.trim()) {
      newErrors.newPassword = "Vui lòng nhập mật khẩu mới";
      hasErrors = true;
    }

    // Kiểm tra độ dài mật khẩu mới
    if (newPassword.trim() && newPassword.length < 6) {
      newErrors.newPassword = "Mật khẩu mới phải có ít nhất 6 ký tự";
      hasErrors = true;
    }

    setErrors(newErrors);
    console.log("Kết quả validateForm:", { hasErrors, errors: newErrors });
    return !hasErrors;
  };

  const handleChangePassword = async () => {
    console.log("Bắt đầu handleChangePassword");
    const isValid = validateForm();
    console.log("Kết quả xác thực form:", isValid, "Lỗi:", errors);
    if (!isValid) {
      console.log("Xác thực thất bại, dừng lại");
      Alert.alert("Lỗi", "Vui lòng kiểm tra lại thông tin.");
      return;
    }

    setLoading(true);
    console.log("Gửi yêu cầu đến auth/change-password với dữ liệu:", {
      oldPassword,
      newPassword,
    });
    try {
      const response = await api.post("auth/change-password", {
        oldPassword,
        newPassword,
      });
      console.log("Phản hồi API:", response.status, response.data);
      Alert.alert("Thành công", response.data || "Đổi mật khẩu thành công!");
      router.back(); // Quay lại màn hình trước đó
    } catch (error: any) {
      console.error("Lỗi đổi mật khẩu:", error.response || error.message);
      const newErrors = { ...errors };
      let errorMessage = "Đổi mật khẩu thất bại";
      if (error.response?.data === "Old password is incorrect") {
        newErrors.oldPassword = "Mật khẩu cũ không chính xác";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      setErrors(newErrors);
      Alert.alert("Lỗi", errorMessage);
    } finally {
      setLoading(false);
      console.log("Kết thúc handleChangePassword");
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <LinearGradient colors={["#e0f7fa", "#b3e5fc"]} style={styles.container}>
      <Pressable onPress={handleBack} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#0277BD" />
      </Pressable>
      <StatusBar hidden={true} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Đổi mật khẩu</Text>

          <Text style={styles.label}>Mật khẩu cũ</Text>
          <Input
            placeholder="Mật khẩu cũ"
            value={oldPassword}
            onChangeText={setOldPassword}
            secureTextEntry={!showOldPassword}
            rightIcon={
              <Pressable onPress={() => setShowOldPassword(!showOldPassword)}>
                <Ionicons
                  name={showOldPassword ? "eye-off-outline" : "eye-outline"}
                  size={18}
                  color="#999"
                />
              </Pressable>
            }
            inputContainerStyle={styles.inputContainer}
            inputStyle={styles.input}
            placeholderTextColor="#999"
            errorMessage={errors.oldPassword}
            errorStyle={styles.errorText}
          />

          <Text style={styles.label}>Mật khẩu mới</Text>
          <Input
            placeholder="Mật khẩu mới"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry={!showNewPassword}
            rightIcon={
              <Pressable onPress={() => setShowNewPassword(!showNewPassword)}>
                <Ionicons
                  name={showNewPassword ? "eye-off-outline" : "eye-outline"}
                  size={18}
                  color="#999"
                />
              </Pressable>
            }
            inputContainerStyle={styles.inputContainer}
            inputStyle={styles.input}
            placeholderTextColor="#999"
            errorMessage={errors.newPassword}
            errorStyle={styles.errorText}
          />

          <Button
            title="Đổi mật khẩu"
            onPress={handleChangePassword}
            disabled={loading}
            buttonStyle={styles.changePasswordButton}
            titleStyle={styles.changePasswordButtonText}
            containerStyle={styles.buttonContainer}
          />
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
    backgroundColor: "#fff", // White background for contrast
    borderRadius: 50, // Circular shape
    padding: 8, // Padding to make the button larger and easier to tap
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000", // Optional: subtle shadow for depth
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3, // For Android shadow
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  label: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    fontWeight: "500",
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 18,
    height: 40,
    backgroundColor: "#fff",

    paddingHorizontal: 10,
  },
  input: {
    fontSize: 14,
    color: "#333",
  },
  errorText: {
    fontSize: 12,
    color: "#d32f2f",
    marginTop: 2,
    marginBottom: 8,
  },
  changePasswordButton: {
    backgroundColor: "#000",
    borderRadius: 25,
    paddingVertical: 12,
  },
  changePasswordButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  buttonContainer: {
    marginVertical: 15,
  },
});
