import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import type { BarcodeScanningResult } from "expo-camera";
import { useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

// Hàm định dạng thời gian từ ISO sang dạng dễ đọc
const formatDateTime = (isoString: string): string => {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) {
      return "Không có";
    }
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  } catch (error) {
    return "Không có";
  }
};

// Hàm hiển thị thông tin dưới dạng nhãn và giá trị
const InfoRow = ({
  label,
  value,
  color = "#333",
}: {
  label: string;
  value: string;
  color?: string;
}) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={[styles.infoValue, { color }]}>{value}</Text>
  </View>
);

export default function CheckInScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState<any>({});
  const [isSuccess, setIsSuccess] = useState(true);
  const scannedRef = useRef(false);
  const router = useRouter();

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  const handleBarCodeScanned = async (result: BarcodeScanningResult) => {
    if (scannedRef.current) return;
    scannedRef.current = true;
    setScanned(true);

    try {
      console.log("✅ QR raw data:", result.data);

      const parsedData = JSON.parse(result.data);
      const token = await AsyncStorage.getItem("token");

      const response = await axios.post(
        "http://192.168.1.113:8080/checkin/ticket",
        parsedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ API Response:", response.data);

      // Xử lý dữ liệu API
      const data =
        typeof response.data === "string"
          ? JSON.parse(response.data)
          : response.data;

      const ticketCode = data.ticketCode ?? "Không có";
      const customerName = data.customerName ?? "Không có";
      const checkinTime = formatDateTime(data.checkinTime ?? "Không có");
      const status = data.status ?? "Thành công";
      const message = data.message ?? "Check-in thành công";

      // Check if it's a success or "ticket already used" case
      const isFullDetailCase = status.toLowerCase() === "used";

      setModalData({
        ticketCode,
        customerName,
        checkinTime,
        status: status.toUpperCase(),
        message,
      });
      setIsSuccess(isFullDetailCase);
      setModalVisible(true);
    } catch (error: any) {
      console.log("❌ QR decode or check-in error:", error);

      let errorData: any = {};
      if (error?.response?.data) {
        errorData =
          typeof error.response.data === "string"
            ? JSON.parse(error.response.data)
            : error.response.data;

        const ticketCode = errorData.ticketCode ?? "Không có";
        const checkinTime = formatDateTime(errorData.checkinTime ?? "Không có");
        const status = errorData.status ?? "Thất bại";
        const message = errorData.message
          ? errorData.message.split(":")[0].trim()
          : "Lỗi không xác định";

        // Check if it's a "ticket already used" case
        const isTicketUsed =
          message.includes("Vé đã được sử dụng") ||
          status.toLowerCase() === "used";

        if (isTicketUsed) {
          setModalData({
            ticketCode,
            checkinTime,
            status: status.toUpperCase(),
            message,
          });
          setIsSuccess(true); // Treat "ticket already used" as a success for display purposes
        } else {
          setModalData({
            status: status.toUpperCase() || "THẤT BẠI",
            message,
          });
          setIsSuccess(false);
        }
      } else {
        setModalData({
          status: "THẤT BẠI",
          message: "Mã QR không hợp lệ. Vui lòng thử lại.",
        });
        setIsSuccess(false);
      }
      setModalVisible(true);
    }
  };

  // Function to handle modal close and reset scanning
  const handleModalClose = () => {
    setModalVisible(false);
    setScanned(false);
    scannedRef.current = false;
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Đang kiểm tra quyền camera...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Không có quyền truy cập camera</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      />
      <View style={styles.frameOverlay}>
        <Text style={styles.frameText}>Quét mã QR tại đây</Text>
        <View style={styles.frameContainer}>
          <View style={[styles.frameCorner, styles.topLeft]} />
          <View style={[styles.frameCorner, styles.topRight]} />
          <View style={[styles.frameCorner, styles.bottomLeft]} />
          <View style={[styles.frameCorner, styles.bottomRight]} />
        </View>
      </View>

      {/* Modal cải tiến */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleModalClose}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContainer,
              isSuccess ? styles.successModal : styles.errorModal,
            ]}
          >
            <Ionicons
              name={isSuccess ? "checkmark-circle" : "close-circle"}
              size={70}
              color={isSuccess ? "#28a745" : "#dc3545"}
              style={styles.modalIcon}
            />
            <Text
              style={[
                styles.modalTitle,
                isSuccess ? styles.successTitle : styles.errorTitle,
              ]}
            >
              {isSuccess ? "Thành công" : "Thất bại"}
            </Text>

            {/* Hiển thị thông tin dưới dạng nhãn và giá trị */}
            <ScrollView style={styles.modalDetailContainer}>
              {isSuccess ? (
                <>
                  <InfoRow label="Mã vé:" value={modalData.ticketCode} />
                  {modalData.customerName && (
                    <InfoRow
                      label="Khách hàng:"
                      value={modalData.customerName}
                    />
                  )}
                  <InfoRow
                    label="Thời gian check in:"
                    value={modalData.checkinTime}
                  />
                  <InfoRow
                    label="Trạng thái:"
                    value={modalData.status}
                    color={isSuccess ? "#28a745" : "#dc3545"}
                  />
                  <InfoRow label="Thông báo:" value={modalData.message} />
                </>
              ) : (
                <>
                  <InfoRow
                    label="Trạng thái:"
                    value={modalData.status}
                    color="#dc3545"
                  />
                  <InfoRow label="Thông báo:" value={modalData.message} />
                </>
              )}
            </ScrollView>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleModalClose}
            >
              <Text style={styles.modalButtonText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => router.back()}
      >
        <Ionicons name="close-outline" size={28} color="#ccc" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
  },
  frameOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  frameText: {
    marginBottom: 20,
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  frameContainer: {
    width: 260,
    height: 260,
    position: "relative",
  },
  frameCorner: {
    position: "absolute",
    width: 30,
    height: 30,
    borderColor: "#fff",
    borderWidth: 5,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopLeftRadius: 10,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopRightRadius: 10,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomLeftRadius: 10,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomRightRadius: 10,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  closeButton: {
    position: "absolute",
    zIndex: 1,
    top: 60,
    left: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    width: 44,
    height: 44,
    borderRadius: 50,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContainer: {
    width: 350,
    padding: 25,
    borderRadius: 15,
    backgroundColor: "#fff",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 15,
  },
  successModal: {
    borderColor: "#28a745",
    borderWidth: 2,
    backgroundColor: "#f0fdf4",
  },
  errorModal: {
    borderColor: "#dc3545",
    borderWidth: 2,
    backgroundColor: "#fef2f2",
  },
  modalIcon: {
    marginBottom: 15,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  modalTitle: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },
  successTitle: {
    color: "#28a745",
  },
  errorTitle: {
    color: "#dc3545",
  },
  modalDetailContainer: {
    width: "100%",
    maxHeight: 275,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#444",
    flex: 1,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "400",
    color: "#333",
    flex: 2,
    textAlign: "right",
  },
  modalButton: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  loadingText: {
    flex: 1,
    textAlign: "center",
    color: "#333",
    fontSize: 18,
  },
  errorText: {
    flex: 1,
    textAlign: "center",
    color: "#ff0000",
    fontSize: 18,
  },
});
