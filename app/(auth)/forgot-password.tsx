import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
  ActivityIndicator,
} from "react-native";
import api from "../../lib/api";
import { Button, Input } from "@rneui/themed";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: Nhập email/username, 2: Nhập OTP, 3: Nhập mật khẩu mới
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState(""); // Lỗi cho email/username
  const [otpError, setOtpError] = useState(""); // Lỗi cho OTP
  const [newPasswordError, setNewPasswordError] = useState(""); // Lỗi cho mật khẩu mới
  const [isLoading, setIsLoading] = useState(false); // Trạng thái loading cho các nút
  const [showPassword, setShowPassword] = useState(false); // Trạng thái hiển thị mật khẩu
  const router = useRouter();

  const validateEmailOrUsername = () => {
    const trimmedInput = emailOrUsername.trim();
    if (!trimmedInput) {
      setEmailError("Vui lòng nhập thông tin tài khoản");
      return false;
    }
    // Kiểm tra định dạng email nếu người dùng nhập email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (trimmedInput.includes("@") && !emailRegex.test(trimmedInput)) {
      setEmailError("Email không hợp lệ");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validateOtp = () => {
    if (!otp.trim()) {
      setOtpError("Vui lòng nhập Mã OTP");
      return false;
    }
    // Kiểm tra OTP phải là số và có độ dài tối thiểu (ví dụ: 6 ký tự)
    const otpRegex = /^\d{6}$/;
    if (!otpRegex.test(otp)) {
      setOtpError("Mã OTP phải là số và có 6 chữ số");
      return false;
    }
    setOtpError("");
    return true;
  };

  const validateNewPassword = () => {
    if (!newPassword.trim()) {
      setNewPasswordError("Vui lòng nhập Mật khẩu mới");
      return false;
    }
    // Kiểm tra độ dài tối thiểu của mật khẩu (ví dụ: 6 ký tự)
    if (newPassword.length < 6) {
      setNewPasswordError("Mật khẩu mới phải có ít nhất 6 ký tự");
      return false;
    }
    setNewPasswordError("");
    return true;
  };

  const handleForgotPasswordStep1 = async () => {
    setIsLoading(true);
    if (!validateEmailOrUsername()) {
      setIsLoading(false);
      return;
    }

    try {
      const startTime = Date.now();
      const response = await api.post(
        "auth/forgot-password",
        { emailOrUsername: emailOrUsername.trim() },
        { timeout: 5000 } // Timeout 5 giây
      );
      console.log(`Thời gian phản hồi API: ${Date.now() - startTime}ms`);
      setMessage(
        response.data === "OTP sent successfully"
          ? "Mã OTP đã được gửi thành công"
          : response.data || "Mã OTP đã được gửi"
      );
      setError("");
      setStep(2);
    } catch (err: any) {
      const errorMessage =
        err.code === "ECONNABORTED"
          ? "Yêu cầu mất quá nhiều thời gian. Vui lòng thử lại sau."
          : err.response?.data ===
            "User not found with the provided email or username"
          ? "Không tìm thấy người dùng với email hoặc tên đăng nhập đã cung cấp"
          : err.response?.data || "Gửi OTP thất bại";
      setError(errorMessage);
      setMessage("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    // Validate input
    const isValid = validateOtp();
    if (!isValid) {
      return; // Stop nếu validation thất bại
    }

    setIsLoading(true); // Bật loading
    try {
      const response = await api.post("auth/verify-otp", {
        emailOrUsername: emailOrUsername.trim(), // Trim để đảm bảo nhất quán
        otp: otp.trim(),
      });
      // Dịch thông báo thành công từ API
      const successMessage =
        response.data === "OTP verified successfully"
          ? "Xác minh OTP thành công"
          : response.data || "Mã OTP đã được xác minh";
      setMessage(successMessage);
      setError("");
      setStep(3); // Chuyển sang bước nhập mật khẩu mới
    } catch (err: any) {
      // Dịch lỗi từ API sang tiếng Việt
      const errorMessage =
        err.response?.data === "Invalid OTP"
          ? "Mã OTP không hợp lệ"
          : err.response?.data || "Xác minh OTP thất bại";
      setError(errorMessage);
      setMessage("");
    } finally {
      setIsLoading(false); // Tắt loading
    }
  };

  const handleResetPassword = async () => {
    // Validate input
    const isValid = validateNewPassword();
    if (!isValid) {
      return; // Stop nếu validation thất bại
    }

    setIsLoading(true); // Bật loading
    try {
      const response = await api.post("auth/reset-password", {
        emailOrUsername: emailOrUsername.trim(), // Trim để đảm bảo nhất quán
        newPassword: newPassword.trim(),
      });
      // Dịch thông báo thành công từ API
      const successMessage =
        response.data === "Password reset successfully"
          ? "Đặt lại mật khẩu thành công"
          : response.data || "Mật khẩu đã được đặt lại";
      setMessage(successMessage);
      setError("");
      setTimeout(() => {
        router.push("/(auth)/login"); // Chuyển về màn hình đăng nhập sau khi thành công
      }, 2000);
    } catch (err: any) {
      // Dịch lỗi từ API sang tiếng Việt
      const errorMessage =
        err.response?.data === "Password too weak"
          ? "Mật khẩu quá yếu"
          : err.response?.data || "Đặt lại mật khẩu thất bại";
      setError(errorMessage);
      setMessage("");
    } finally {
      setIsLoading(false); // Tắt loading
    }
  };

  const handleBack = () => {
    if (step === 1) {
      router.push("/(auth)/login"); // Quay lại màn hình đăng nhập nếu đang ở bước 1
    } else {
      setStep(step - 1); // Quay lại bước trước đó
      setMessage("");
      setError("");
      setEmailError("");
      setOtpError("");
      setNewPasswordError("");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <LinearGradient colors={["#e0f7fa", "#b3e5fc"]} style={styles.container}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#0277bd" />
        </Pressable>

        <View style={styles.formContainer}>
          <Text style={styles.title}>Quên mật khẩu</Text>

          <Text style={styles.description}>
            Vui lòng nhập thông tin để đặt lại mật khẩu.
          </Text>

          {step === 1 && (
            <>
              <Text style={styles.label}>Tên đăng nhập hoặc Email</Text>
              <Input
                placeholder=" Nhập tên đăng nhập hoặc email"
                value={emailOrUsername}
                onChangeText={(text) => setEmailOrUsername(text.trim())} // Trim ngay khi nhập
                autoCapitalize="none"
                inputContainerStyle={styles.inputContainer}
                inputStyle={styles.input}
                placeholderTextColor="#999"
                errorMessage={emailError}
                errorStyle={styles.errorText}
              />
              {message ? (
                <Text style={styles.successMessage}>{message}</Text>
              ) : null}
              {error ? <Text style={styles.errorMessage}>{error}</Text> : null}
              <Button
                title={
                  isLoading ? (
                    <View style={styles.buttonContent}>
                      <ActivityIndicator size="small" color="#fff" />
                      <Text style={styles.actionButtonText}>Đang gửi...</Text>
                    </View>
                  ) : (
                    "Gửi OTP"
                  )
                }
                onPress={handleForgotPasswordStep1}
                buttonStyle={styles.actionButton}
                titleStyle={styles.actionButtonText}
                containerStyle={styles.buttonContainer}
                disabled={isLoading}
                disabledStyle={styles.disabledButton}
              />
            </>
          )}

          {step === 2 && (
            <>
              <Text style={styles.label}>Mã OTP</Text>
              <Input
                placeholder="Mã OTP"
                value={otp}
                onChangeText={setOtp}
                keyboardType="numeric"
                inputContainerStyle={styles.inputContainer}
                inputStyle={styles.input}
                placeholderTextColor="#999"
                errorMessage={otpError}
                errorStyle={styles.errorText}
              />
              {message ? (
                <Text style={styles.successMessage}>{message}</Text>
              ) : null}
              {error ? <Text style={styles.errorMessage}>{error}</Text> : null}
              <Button
                title={
                  isLoading ? (
                    <View style={styles.buttonContent}>
                      <ActivityIndicator size="small" color="#fff" />
                      <Text style={styles.actionButtonText}>
                        Đang xác nhận...
                      </Text>
                    </View>
                  ) : (
                    "Xác nhận OTP"
                  )
                }
                onPress={handleVerifyOtp}
                buttonStyle={styles.actionButton}
                titleStyle={styles.actionButtonText}
                containerStyle={styles.buttonContainer}
                disabled={isLoading}
                disabledStyle={styles.disabledButton}
              />
            </>
          )}

          {step === 3 && (
            <>
              <Text style={styles.label}>
                Mật khẩu mới <Text style={styles.required}>*</Text>
              </Text>
              <Input
                placeholder="Mật khẩu mới"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={!showPassword} // Điều khiển trạng thái hiển thị
                inputContainerStyle={styles.inputContainer}
                inputStyle={styles.input}
                placeholderTextColor="#999"
                errorMessage={newPasswordError}
                errorStyle={styles.errorText}
                rightIcon={
                  <Pressable onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons
                      name={showPassword ? "eye-off" : "eye"}
                      size={24}
                      color="#666"
                    />
                  </Pressable>
                }
              />
              {message ? (
                <Text style={styles.successMessage}>{message}</Text>
              ) : null}
              {error ? <Text style={styles.errorMessage}>{error}</Text> : null}
              <Button
                title={
                  isLoading ? (
                    <View style={styles.buttonContent}>
                      <ActivityIndicator size="small" color="#fff" />
                      <Text style={styles.actionButtonText}>
                        Đang đặt lại...
                      </Text>
                    </View>
                  ) : (
                    "Đặt lại mật khẩu"
                  )
                }
                onPress={handleResetPassword}
                buttonStyle={styles.actionButton}
                titleStyle={styles.actionButtonText}
                containerStyle={styles.buttonContainer}
                disabled={isLoading}
                disabledStyle={styles.disabledButton}
              />
            </>
          )}
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
  formContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 30,
    width: "90%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 24,
  },
  label: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  required: {
    color: "#d32f2f", // Màu đỏ cho dấu *
    fontSize: 16,
  },
  inputContainer: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 18,
    paddingHorizontal: 10,
    marginBottom: 5,
    backgroundColor: "#fff",
  },
  input: {
    fontSize: 16,
    color: "#333",
  },
  errorText: {
    fontSize: 12,
    color: "#d32f2f",
    marginTop: 2,
    marginBottom: 8,
  },
  successMessage: {
    color: "green",
    textAlign: "center",
    marginBottom: 10,
    fontSize: 14,
  },
  errorMessage: {
    color: "#d32f2f",
    textAlign: "center",
    marginBottom: 10,
    fontSize: 14,
  },
  actionButton: {
    backgroundColor: "#000",
    borderRadius: 30,
    paddingVertical: 15,
  },
  actionButtonText: {
    paddingLeft: 10,
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  buttonContainer: {
    marginVertical: 10,
  },
  disabledButton: {
    backgroundColor: "#666", // Màu xám khi nút bị disable
    opacity: 0.7,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
