// import React, { useState } from "react";
// import {
//   Alert,
//   View,
//   Text,
//   StyleSheet,
//   Pressable,
//   ScrollView,
//   StatusBar,
// } from "react-native";
// import api from "../../lib/api";
// import { Button, Input, CheckBox } from "@rneui/themed";
// import { Link, useRouter } from "expo-router";
// import { LinearGradient } from "expo-linear-gradient";
// import { Ionicons } from "@expo/vector-icons";

// export default function SignUp() {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [fullName, setFullName] = useState("");
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [email, setEmail] = useState("");
//   const [gender, setGender] = useState("MALE");
//   const [role, setRole] = useState("ADMIN_MOBILE");
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [errors, setErrors] = useState({
//     username: "",
//     password: "",
//     fullName: "",
//     phoneNumber: "",
//     email: "",
//   });
//   const router = useRouter();

//   // Kiểm tra sự tồn tại của username
//   const checkUsername = async (value: any) => {
//     console.log(`Kiểm tra username: ${value}`);
//     if (!value.trim() || value.length < 3) {
//       setErrors((prev) => ({
//         ...prev,
//         username: "Tên đăng nhập phải có ít nhất 3 ký tự",
//       }));
//       return false;
//     }
//     try {
//       const response = await api.get(`/auth/check-username?username=${value}`);
//       console.log(`Phản hồi check-username:`, response.data);
//       if (response.data.exists) {
//         setErrors((prev) => ({
//           ...prev,
//           username: "Tên đăng nhập đã tồn tại",
//         }));
//         return true;
//       } else {
//         setErrors((prev) => ({ ...prev, username: "" }));
//         return false;
//       }
//     } catch (error: any) {
//       console.error("Lỗi kiểm tra username:", error.response || error.message);
//       setErrors((prev) => ({
//         ...prev,
//         username: "Lỗi kiểm tra tên đăng nhập",
//       }));
//       return false;
//     }
//   };

//   // Kiểm tra sự tồn tại của phoneNumber
//   const checkPhoneNumber = async (value: any) => {
//     console.log(`Kiểm tra phoneNumber: ${value}`);
//     if (!value.trim() || !/^\d{10,11}$/.test(value)) {
//       setErrors((prev) => ({
//         ...prev,
//         phoneNumber: "Số điện thoại phải có 10-11 chữ số",
//       }));
//       return false;
//     }
//     try {
//       const response = await api.get(`/auth/check-phone?phoneNumber=${value}`);
//       console.log(`Phản hồi check-phone:`, response.data);
//       if (response.data.exists) {
//         setErrors((prev) => ({
//           ...prev,
//           phoneNumber: "Số điện thoại đã được sử dụng",
//         }));
//         return true;
//       } else {
//         setErrors((prev) => ({ ...prev, phoneNumber: "" }));
//         return false;
//       }
//     } catch (error: any) {
//       console.error(
//         "Lỗi kiểm tra số điện thoại:",
//         error.response || error.message
//       );
//       setErrors((prev) => ({
//         ...prev,
//         phoneNumber: "Lỗi kiểm tra số điện thoại",
//       }));
//       return false;
//     }
//   };

//   // Kiểm tra sự tồn tại của email
//   const checkEmail = async (value: any) => {
//     console.log(`Kiểm tra email: ${value}`);
//     if (!value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
//       setErrors((prev) => ({ ...prev, email: "Email không đúng định dạng" }));
//       return false;
//     }
//     try {
//       const response = await api.get(`/auth/check-email?email=${value}`);
//       console.log(`Phản hồi check-email:`, response.data);
//       if (response.data.exists) {
//         setErrors((prev) => ({ ...prev, email: "Email đã được sử dụng" }));
//         return true;
//       } else {
//         setErrors((prev) => ({ ...prev, email: "" }));
//         return false;
//       }
//     } catch (error: any) {
//       console.error("Lỗi kiểm tra email:", error.response || error.message);
//       setErrors((prev) => ({ ...prev, email: "Lỗi kiểm tra email" }));
//       return false;
//     }
//   };

//   const validateForm = async () => {
//     const newErrors = {
//       username: "",
//       password: "",
//       fullName: "",
//       phoneNumber: "",
//       email: "",
//     };
//     let hasErrors = false;

//     // Kiểm tra trường trống
//     if (!username.trim()) {
//       newErrors.username = "Vui lòng nhập Tên đăng nhập";
//       hasErrors = true;
//     }
//     if (!password.trim()) {
//       newErrors.password = "Vui lòng nhập Mật khẩu";
//       hasErrors = true;
//     }
//     if (!fullName.trim()) {
//       newErrors.fullName = "Vui lòng nhập Họ tên";
//       hasErrors = true;
//     }
//     if (!phoneNumber.trim()) {
//       newErrors.phoneNumber = "Vui lòng nhập Số điện thoại";
//       hasErrors = true;
//     }
//     if (!email.trim()) {
//       newErrors.email = "Vui lòng nhập Email";
//       hasErrors = true;
//     }

//     // Kiểm tra định dạng
//     if (username.trim() && username.length < 3) {
//       newErrors.username = "Tên đăng nhập phải có ít nhất 3 ký tự";
//       hasErrors = true;
//     }
//     if (password.trim() && password.length < 6) {
//       newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
//       hasErrors = true;
//     }
//     if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//       newErrors.email = "Email không đúng định dạng";
//       hasErrors = true;
//     }
//     if (phoneNumber.trim() && !/^\d{10,11}$/.test(phoneNumber)) {
//       newErrors.phoneNumber = "Số điện thoại phải có 10-11 chữ số";
//       hasErrors = true;
//     }

//     // Kiểm tra sự tồn tại
//     if (username.trim() && !newErrors.username) {
//       const usernameExists = await checkUsername(username);
//       if (usernameExists) {
//         newErrors.username = "Tên đăng nhập đã tồn tại";
//         hasErrors = true;
//       }
//     }
//     if (phoneNumber.trim() && !newErrors.phoneNumber) {
//       const phoneExists = await checkPhoneNumber(phoneNumber);
//       if (phoneExists) {
//         newErrors.phoneNumber = "Số điện thoại đã được sử dụng";
//         hasErrors = true;
//       }
//     }
//     if (email.trim() && !newErrors.email) {
//       const emailExists = await checkEmail(email);
//       if (emailExists) {
//         newErrors.email = "Email đã được sử dụng";
//         hasErrors = true;
//       }
//     }

//     setErrors(newErrors);
//     console.log("Kết quả validateForm:", { hasErrors, errors: newErrors });
//     return !hasErrors;
//   };

//   const handleSignUp = async () => {
//     console.log("Bắt đầu handleSignUp");
//     const isValid = await validateForm();
//     console.log("Kết quả xác thực form:", isValid, "Lỗi:", errors);
//     if (!isValid) {
//       console.log("Xác thực thất bại, dừng lại");
//       Alert.alert("Lỗi", "Vui lòng kiểm tra lại thông tin.");
//       return;
//     }

//     setLoading(true);
//     console.log("Gửi yêu cầu đăng ký đến auth/register với dữ liệu:", {
//       username,
//       password,
//       fullName,
//       phoneNumber,
//       email,
//       gender,
//       role,
//     });
//     try {
//       const response = await api.post("auth/register", {
//         username,
//         password,
//         fullName,
//         phoneNumber,
//         email,
//         gender,
//         role,
//       });
//       console.log("Phản hồi API:", response.status, response.data);
//       if (
//         response.status === 201 ||
//         response.data?.message?.includes("created")
//       ) {
//         Alert.alert("Thành công", "Đăng ký thành công! Vui lòng đăng nhập.");
//         console.log("Đang điều hướng đến /(auth)/login");
//         router.push("/(auth)/login");
//       } else {
//         throw new Error("Phản hồi không mong đợi từ server");
//       }
//     } catch (error: any) {
//       console.error("Lỗi đăng ký:", error.response || error.message);
//       const newErrors = { ...errors };
//       if (error.response?.data === "Email already exists") {
//         newErrors.email = "Email đã được sử dụng";
//       } else if (error.response?.data === "Username already exists") {
//         newErrors.username = "Tên đăng nhập đã tồn tại";
//       } else if (error.response?.data === "Phone number already exists") {
//         newErrors.phoneNumber = "Số điện thoại đã được sử dụng";
//       } else {
//         newErrors.email = error.response?.data?.message || "Đăng ký thất bại";
//       }
//       setErrors(newErrors);
//       Alert.alert("Lỗi", "Vui lòng kiểm tra lại thông tin.");
//     } finally {
//       setLoading(false);
//       console.log("Kết thúc handleSignUp");
//     }
//   };

//   const handleBack = () => {
//     router.back();
//   };

//   return (
//     <LinearGradient colors={["#e0f7fa", "#b3e5fc"]} style={styles.container}>
//       <StatusBar hidden={true} />
//       <ScrollView contentContainerStyle={styles.scrollContainer}>
//         <View style={styles.formContainer}>
//           <Pressable onPress={handleBack} style={styles.backButton}>
//             <Ionicons name="arrow-back" size={28} color="#0277bd" />
//           </Pressable>

//           <Text style={styles.title}>Đăng ký</Text>

//           <Text style={styles.label}>Tên đăng nhập</Text>
//           <Input
//             placeholder="Tên đăng nhập"
//             value={username}
//             onChangeText={setUsername}
//             autoCapitalize="none"
//             inputContainerStyle={styles.inputContainer}
//             inputStyle={styles.input}
//             placeholderTextColor="#999"
//             errorMessage={errors.username}
//             errorStyle={styles.errorText}
//             onBlur={() => checkUsername(username)}
//           />

//           <Text style={styles.label}>Mật khẩu</Text>
//           <Input
//             placeholder="Mật khẩu"
//             value={password}
//             onChangeText={setPassword}
//             secureTextEntry={!showPassword}
//             rightIcon={
//               <Pressable onPress={() => setShowPassword(!showPassword)}>
//                 <Ionicons
//                   name={showPassword ? "eye-off-outline" : "eye-outline"}
//                   size={18}
//                   color="#999"
//                 />
//               </Pressable>
//             }
//             inputContainerStyle={styles.inputContainer}
//             inputStyle={styles.input}
//             placeholderTextColor="#999"
//             errorMessage={errors.password}
//             errorStyle={styles.errorText}
//           />

//           <Text style={styles.label}>Họ tên</Text>
//           <Input
//             placeholder="Họ tên"
//             value={fullName}
//             onChangeText={setFullName}
//             inputContainerStyle={styles.inputContainer}
//             inputStyle={styles.input}
//             placeholderTextColor="#999"
//             errorMessage={errors.fullName}
//             errorStyle={styles.errorText}
//           />

//           <Text style={styles.label}>Số điện thoại</Text>
//           <Input
//             placeholder="Số điện thoại"
//             value={phoneNumber}
//             onChangeText={setPhoneNumber}
//             keyboardType="numeric"
//             inputContainerStyle={styles.inputContainer}
//             inputStyle={styles.input}
//             placeholderTextColor="#999"
//             errorMessage={errors.phoneNumber}
//             errorStyle={styles.errorText}
//             onBlur={() => checkPhoneNumber(phoneNumber)}
//           />

//           <Text style={styles.label}>Email</Text>
//           <Input
//             placeholder="Email"
//             value={email}
//             onChangeText={setEmail}
//             autoCapitalize="none"
//             inputContainerStyle={styles.inputContainer}
//             inputStyle={styles.input}
//             placeholderTextColor="#999"
//             errorMessage={errors.email}
//             errorStyle={styles.errorText}
//             onBlur={() => checkEmail(email)}
//           />

//           <Text style={styles.label}>Giới tính</Text>
//           <View style={styles.checkboxContainer}>
//             <CheckBox
//               title="Nam"
//               checked={gender === "MALE"}
//               onPress={() => setGender("MALE")}
//               containerStyle={styles.checkbox}
//               textStyle={styles.checkboxText}
//               checkedColor="#0277bd"
//             />
//             <CheckBox
//               title="Nữ"
//               checked={gender === "FEMALE"}
//               onPress={() => setGender("FEMALE")}
//               containerStyle={styles.checkbox}
//               textStyle={styles.checkboxText}
//               checkedColor="#0277bd"
//             />
//           </View>

//           <Text style={styles.label}>Vai trò</Text>
//           <View style={styles.checkboxContainer}>
//             <CheckBox
//               title="Admin Mobile"
//               checked={role === "ADMIN_MOBILE"}
//               onPress={() => setRole("ADMIN_MOBILE")}
//               containerStyle={styles.checkbox}
//               textStyle={styles.checkboxText}
//               checkedColor="#0277bd"
//             />
//           </View>

//           <Button
//             title="Đăng ký"
//             onPress={handleSignUp}
//             disabled={loading}
//             buttonStyle={styles.signUpButton}
//             titleStyle={styles.signUpButtonText}
//             containerStyle={styles.buttonContainer}
//           />

//           <View style={styles.linkContainer}>
//             <Text style={styles.linkText}>Đã có tài khoản? </Text>
//             <Link href="/(auth)/login">
//               <Text style={styles.link}>Đăng nhập</Text>
//             </Link>
//           </View>
//         </View>
//       </ScrollView>
//     </LinearGradient>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   scrollContainer: {
//     flexGrow: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     paddingVertical: 20,
//   },
//   formContainer: {
//     backgroundColor: "#fff",
//     borderRadius: 15,
//     padding: 20,
//     width: "90%",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.2,
//     shadowRadius: 5,
//     elevation: 5,
//     position: "relative",
//   },
//   backButton: {
//     position: "absolute",
//     top: 15,
//     left: 15,
//     zIndex: 1,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#333",
//     textAlign: "center",
//     marginBottom: 20,
//   },
//   label: {
//     fontSize: 14,
//     color: "#333",
//     marginBottom: 5,
//   },
//   inputContainer: {
//     borderWidth: 1,
//     borderColor: "#ddd",
//     borderRadius: 8,
//     height: 40,
//     backgroundColor: "#fff",
//     paddingHorizontal: 10,
//   },
//   input: {
//     fontSize: 14,
//     color: "#333",
//   },
//   errorText: {
//     fontSize: 12,
//     color: "#d32f2f",
//     marginTop: 2,
//     marginBottom: 8,
//   },
//   checkboxContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 15,
//   },
//   checkbox: {
//     backgroundColor: "transparent",
//     borderWidth: 0,
//     padding: 0,
//     margin: 0,
//   },
//   checkboxText: {
//     fontSize: 14,
//     color: "#333",
//     fontWeight: "normal",
//   },
//   signUpButton: {
//     backgroundColor: "#000",
//     borderRadius: 25,
//     paddingVertical: 12,
//   },
//   signUpButtonText: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#fff",
//   },
//   buttonContainer: {
//     marginVertical: 15,
//   },
//   link: {
//     fontSize: 14,
//     color: "#0277bd",
//     textDecorationLine: "underline",
//     textAlign: "center",
//     marginVertical: 10,
//   },
//   linkContainer: {
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     marginVertical: 5,
//   },
//   linkText: {
//     fontSize: 14,
//     color: "#666",
//   },
// });
