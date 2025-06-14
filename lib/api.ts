import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Định nghĩa baseURL cho API check-in
const api = axios.create({
  baseURL: "http://192.168.1.113:8080", // Điều chỉnh baseURL cho service check-in
  headers: {
    "Content-Type": "application/json",
  },
});

// Thêm interceptor để tự động gắn token vào header
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Hàm check-in vé
export const checkinTicket = async (
  ticketCode: string,
  customerName: string,
  token: string | null
) => {
  try {
    const response = await api.post("/checkin/ticket", {
      ticketCode,
      customerName,
    });
    return response.data;
  } catch (error: any) {
    console.error(
      "Check-in ticket error:",
      error.message,
      error.response?.data
    );
    throw new Error(error.response?.data?.message || "Check-in failed");
  }
};

// Hàm lấy tất cả log check-in
export const getAllCheckinLogs = async () => {
  try {
    const response = await api.get("/checkin/logs");
    return response.data;
  } catch (error: any) {
    console.error(
      "Get check-in logs error:",
      error.message,
      error.response?.data
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch check-in logs"
    );
  }
};

// Hàm lấy log check-in theo ticketCode
export const getCheckinLogsByTicketCode = async (ticketCode: string) => {
  try {
    const response = await api.get(`/checkin/logs/${ticketCode}`);
    return response.data;
  } catch (error: any) {
    console.error(
      "Get check-in logs by ticket error:",
      error.message,
      error.response?.data
    );
    throw new Error(
      error.response?.data?.message ||
        "Failed to fetch check-in logs for ticket"
    );
  }
};

// Hàm lấy danh sách vé của người dùng (giả định đã có từ trước, giữ nguyên nếu bạn đã có)
export const getMyTickets = async () => {
  try {
    const response = await api.get("/checkin/tickets"); // Điều chỉnh endpoint nếu cần
    return response.data;
  } catch (error: any) {
    console.error("Get my tickets error:", error.message, error.response?.data);
    throw error;
  }
};

// Fetch ticket information by code
export const getTicketByCode = async (
  ticketCode: string,
  token: string | null
) => {
  const uuidRegex =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  if (!uuidRegex.test(ticketCode)) {
    throw new Error("Mã vé không đúng định dạng UUID.");
  }
  try {
    const response = await api.get(`/tickets/${ticketCode}`);
    return response.data;
  } catch (error: any) {
    console.error(
      "Get ticket by code error:",
      error.message,
      error.response?.data,
      error.response?.status
    );
    if (error.response?.status === 400) {
      throw new Error("Mã vé không hợp lệ.");
    } else if (error.response?.status === 401) {
      throw new Error("Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.");
    } else if (error.response?.status === 403) {
      throw new Error("Bạn không có quyền truy cập thông tin vé này.");
    } else if (error.response?.status === 404) {
      throw new Error("Không tìm thấy vé với mã này.");
    }
    throw new Error(
      error.response?.data?.message || "Không thể lấy thông tin vé."
    );
  }
};

export default api;
