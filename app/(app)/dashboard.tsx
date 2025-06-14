import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  TouchableWithoutFeedback,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "expo-router";
import { Button } from "@rneui/themed";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "@rneui/base";
import * as Animatable from "react-native-animatable";

export default function Dashboard() {
  const { logOut, fullName } = useAuth(); // Access fullName from useAuth
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuAnimation] = useState(new Animated.Value(0));
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString("vi-VN")
  );

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString("vi-VN"));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleMenu = () => {
    if (menuVisible) {
      Animated.timing(menuAnimation, {
        toValue: 0,
        duration: 200,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start(() => setMenuVisible(false));
    } else {
      setMenuVisible(true);
      Animated.timing(menuAnimation, {
        toValue: 1,
        duration: 200,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();
    }
  };

  const menuStyle = {
    opacity: menuAnimation,
    transform: [
      {
        scale: menuAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [0.95, 1],
        }),
      },
    ],
  };

  return (
    <TouchableWithoutFeedback onPress={() => menuVisible && toggleMenu()}>
      <LinearGradient
        colors={["#e0f7fa", "#b3e5fc", "#81d4fa"]}
        style={styles.container}
      >
        <Animatable.View
          animation="bounceInDown"
          duration={1500}
          style={styles.header}
        >
          <View style={styles.logoContainer}>
            <Image
              source={require("../../assets/images/snapedit.png")}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.subtitle}>Búng tay, check ngay! 🚀</Text>
            <Animatable.Text
              animation="fadeIn"
              duration={2000}
              style={styles.timeText}
            >
              {currentTime}
            </Animatable.Text>
          </View>
        </Animatable.View>

        <TouchableOpacity
          onPress={toggleMenu}
          style={styles.menuButton}
          activeOpacity={0.7}
        >
          <Ionicons name="menu" size={30} color="#fff" />
        </TouchableOpacity>

        {menuVisible && (
          <Animated.View style={[styles.menu, menuStyle]}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                router.push("/profile");
                toggleMenu();
              }}
              activeOpacity={0.7}
            >
              <Ionicons
                name="person-outline"
                size={20}
                color="#374151"
                style={styles.menuIcon}
              />
              <Text style={styles.menuItemText}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                router.push("/change-password");
                toggleMenu();
              }}
              activeOpacity={0.7}
            >
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#374151"
                style={styles.menuIcon}
              />
              <Text style={styles.menuItemText}>Đổi mật khẩu</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                logOut();
                toggleMenu();
              }}
              activeOpacity={0.7}
            >
              <Ionicons
                name="log-out-outline"
                size={20}
                color="#ef4444"
                style={styles.menuIcon}
              />
              <Text style={[styles.menuItemLast, styles.menuItemText]}>
                Đăng xuất
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        <View style={styles.content}>
          <Animatable.Text
            animation="fadeInUp"
            duration={1000}
            style={styles.welcomeText}
          >
            Xin chào, {fullName || "Nhân viên"}!
          </Animatable.Text>
          <Animatable.Text
            animation="fadeInUp"
            duration={1200}
            style={styles.tip}
          >
            Sẵn sàng quét mã QR để check-in khách! 📷
          </Animatable.Text>

          <Button
            title="Check In"
            onPress={() => router.push("/check-in")}
            containerStyle={styles.button}
            buttonStyle={[styles.buttonStyle, { backgroundColor: "#e87373" }]}
            titleStyle={styles.buttonTitle}
            icon={
              <Ionicons
                name="qr-code-outline"
                size={24}
                color="#fff"
                style={styles.buttonIcon}
              />
            }
            iconPosition="left"
          />
          <Button
            title="Lịch sử Check In"
            onPress={() => router.push("/checkin-history")}
            containerStyle={styles.button}
            buttonStyle={[styles.buttonStyle, { backgroundColor: "#586970" }]}
            titleStyle={styles.buttonTitle}
            icon={
              <Ionicons
                name="time-outline"
                size={24}
                color="#fff"
                style={styles.buttonIcon}
              />
            }
            iconPosition="left"
          />
        </View>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: "transparent",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
    overflow: "hidden",
  },
  logoContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 130,
    height: 130,
  },
  subtitle: {
    top: -10,
    fontSize: 16,
    color: "#00961f",
    textAlign: "center",
    fontWeight: "600",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  timeText: {
    fontSize: 22,
    color: "#1e3a8a",
    marginTop: 38,
    fontWeight: "700",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  menuButton: {
    padding: 5,
    position: "absolute",
    top: 60,
    backgroundColor: "#657786",
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
    zIndex: 1000,
    right: 20,
  },
  menu: {
    position: "absolute",
    top: 100,
    right: 20,
    backgroundColor: "rgba(255, 255, 255, 1)",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
    zIndex: 1000,
    paddingVertical: 5,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  menuItemLast: {
    borderBottomWidth: 0,
    borderBottomColor: "transparent",
  },
  menuIcon: {
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#374151",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 10,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  tip: {
    fontSize: 16,
    color: "#4B2995",
    textAlign: "center",
    marginBottom: 30,
    fontStyle: "italic",
  },
  button: {
    marginVertical: 15,
    width: "80%",
  },
  buttonStyle: {
    borderRadius: 12,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    elevation: 6,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginLeft: 10,
  },
  buttonIcon: {
    marginRight: 10,
  },
});
