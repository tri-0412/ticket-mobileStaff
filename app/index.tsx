import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { Button, Image } from "@rneui/themed";

export default function Home() {
  const opacity = useSharedValue(0);
  const router = useRouter();

  // Giá trị động cho hiệu ứng nút
  const buttonScale = useSharedValue(1);
  const buttonBgColor = useSharedValue("#602121"); // Màu nền mặc định cho nút

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 1000 }); // Fade-in trong 1 giây
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }],
      backgroundColor: buttonBgColor.value,
    };
  });

  const handleButtonPressIn = () => {
    buttonScale.value = withTiming(0.95, { duration: 150 });
    buttonBgColor.value = withTiming("#451616", { duration: 150 }); // Màu tối hơn khi nhấn
  };

  const handleButtonPressOut = () => {
    buttonScale.value = withTiming(1, { duration: 150 });
    buttonBgColor.value = withTiming("#602121", { duration: 150 }); // Trở về màu ban đầu
  };

  return (
    <LinearGradient colors={["#e0f7fa", "#b3e5fc"]} style={styles.container}>
      <Animated.View style={[styles.innerContainer, animatedStyle]}>
        <Image
          source={require("../assets/images/logo.png")}
          resizeMode="contain"
          style={styles.logo}
        />
        <Text style={styles.title}>
          Quản lý công việc dễ dàng hơn bao giờ hết!
        </Text>
        <Text style={styles.description}>Vui lòng đăng nhập để tiếp tục.</Text>
        <Button
          title="Đăng nhập"
          onPress={() => router.push("/(auth)/login")}
          onPressIn={handleButtonPressIn}
          onPressOut={handleButtonPressOut}
          buttonStyle={[styles.button, buttonAnimatedStyle]}
          titleStyle={styles.buttonText}
          containerStyle={styles.buttonContainer}
        />
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  innerContainer: {
    alignItems: "center",
    width: "100%",
    maxWidth: 400, // Giới hạn chiều rộng tối đa cho giao diện đẹp hơn
  },
  logo: {
    width: 150, // Giảm kích thước logo để cân đối hơn
    height: 150,
    marginBottom: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#0288d1",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 24,
  },
  buttonContainer: {
    width: "60%", // Điều chỉnh kích thước nút hợp lý
    marginTop: 20,
  },
  button: {
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#0288d1",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
});
