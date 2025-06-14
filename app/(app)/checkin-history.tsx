import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Pressable,
  RefreshControl,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { getAllCheckinLogs } from "@/lib/api";

interface CheckinLog {
  id?: number;
  userId: number;
  userName: string;
  ticketCode: string;
  ticketType: string;
  eventName: string;
  customerName?: string;
  status: string;
  checkinTime: string;
}

const CheckinHistoryScreen = () => {
  const [logs, setLogs] = useState<CheckinLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [filteredLogs, setFilteredLogs] = useState<CheckinLog[]>([]);
  const [searchCode, setSearchCode] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const data = await getAllCheckinLogs();
      console.log("Dữ liệu từ API:", data); // Thêm log để kiểm tra
      setLogs(data);
      setFilteredLogs(data);
    } catch (error: any) {
      alert(error.message || "Không thể tải lịch sử check-in.");
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchLogs();
    setRefreshing(false);
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderLog = ({ item }: { item: CheckinLog }) => (
    <View style={styles.logCard}>
      <View style={styles.logInfo}>
        <Text style={styles.logTitle}>🎟️ Mã vé: {item.ticketCode}</Text>

        <View style={styles.logDetail}>
          <Ionicons name="calendar-outline" size={16} color="#666" />
          <Text style={styles.logDetailText}>
            Sự kiện: {item.eventName || "Không xác định"}
          </Text>
        </View>
        <View style={styles.logDetail}>
          <Ionicons name="ticket-outline" size={16} color="#666" />
          <Text style={styles.logDetailText}>
            Loại vé: {item.ticketType || "Không xác định"}
          </Text>
        </View>

        <View style={styles.logDetail}>
          <Ionicons name="person-outline" size={16} color="#666" />
          <Text style={styles.logDetailText}>
            Khách hàng: {item.customerName || "Không xác định"}
          </Text>
        </View>

        <View style={styles.logDetail}>
          <Ionicons
            name="checkmark-circle-outline"
            size={16}
            color={item.status === "used" ? "#2ecc71" : "#e74c3c"}
          />
          <Text
            style={[
              styles.logDetailText,
              {
                fontWeight: "600",
                color: item.status === "used" ? "#2ecc71" : "#e74c3c",
              },
            ]}
          >
            Trạng thái: {item.status === "used" ? "Thành công" : "Thất bại"}
          </Text>
        </View>

        <View style={styles.logDetail}>
          <Ionicons name="time-outline" size={16} color="#666" />
          <Text style={styles.logDetailText}>
            Thời gian: {formatDateTime(item.checkinTime)}
          </Text>
        </View>

        <View style={styles.logDetail}>
          <Ionicons name="person-circle-outline" size={16} color="#666" />
          <Text style={styles.logDetailText}>Nhân viên: {item.userName}</Text>
        </View>
      </View>
    </View>
  );

  const handleSearch = (text: string) => {
    setSearchCode(text);
    const filtered = logs.filter((log) =>
      log.ticketCode.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredLogs(filtered);
  };

  return (
    <LinearGradient colors={["#f5e7ff", "#dcfce7"]} style={styles.container}>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#333" />
      </Pressable>

      <Text style={styles.title}>Lịch Sử Check In</Text>

      <View style={styles.searchContainer}>
        <Ionicons
          name="search-outline"
          size={20}
          color="#666"
          style={styles.searchIcon}
        />
        <TextInput
          placeholder="Tìm theo mã vé"
          placeholderTextColor="#666"
          value={searchCode}
          onChangeText={handleSearch}
          style={styles.searchInput}
        />
      </View>

      {isLoading ? (
        <ActivityIndicator
          size="large"
          color="#6c63ff"
          style={{ marginTop: 20 }}
        />
      ) : logs.length === 0 ? (
        <Text style={styles.noLogs}>Không có lịch sử check-in.</Text>
      ) : (
        <FlatList
          data={filteredLogs}
          keyExtractor={(item) => item.id?.toString() || item.ticketCode} // Thêm keyExtractor
          renderItem={renderLog}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  backButton: {
    position: "absolute",
    top: 60,
    left: 20,
    zIndex: 1,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 5,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 60,
    marginBottom: 20,
    color: "#4B2995",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginBottom: 12,
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    color: "#222",
  },
  logCard: {
    backgroundColor: "#ffffffee",
    borderRadius: 12,
    marginBottom: 15,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  logInfo: {
    flex: 1,
  },
  logTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4B2995",
    marginBottom: 10,
  },
  logDetail: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  logDetailText: {
    fontSize: 14,
    color: "#333",
    marginLeft: 8,
  },
  noLogs: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginTop: 30,
  },
});

export default CheckinHistoryScreen;
