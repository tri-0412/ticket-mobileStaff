# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started
1. Clone dự án về :

   ```bash
   git clone https://github.com/tri-0412/ticket-mobileStaff.git
   cd ticket-mobileStaff
    ```

2. Install dependencies

   ```bash
   npm install --legacy-peer-deps
   ```

3. Start the app

   ```bash
    npx expo start --port 3002
   ```



🧾 HƯỚNG DẪN SỬ DỤNG ỨNG DỤNG CHO NHÂN VIÊN (STAFF)
1. Đăng nhập
- Mở ứng dụng di động.

- Nhập Tài khoản và Mật khẩu được ban tổ chức cấp.

- Sau khi đăng nhập, bạn sẽ thấy danh sách sự kiện được phân công.

2. Check-in vé
- Chọn sự kiện cần check-in.

- Nhấn vào nút “Check-in”.

- Màn hình camera sẽ xuất hiện → Đưa mã QR của khách hàng (trong app khách) vào khung camera.

- Hệ thống sẽ tự động quét mã và hiển thị trạng thái check-in:

   ✅ Thành công: Mã hợp lệ và chưa được sử dụng.

   ⚠️ Thất bại: Mã không hợp lệ hoặc đã được sử dụng.

3. Xem lịch sử check-in
- Sau mỗi lần quét thành công, bạn có thể:

- Bấm nút “Quay lại”.

- Vào mục “Lịch sử check-in” để xem các vé đã check-in.

💡 Lưu ý:
- Luôn đảm bảo camera điện thoại hoạt động tốt và có đủ ánh sáng khi check-in.

- Nếu không quét được mã, kiểm tra lại kết nối mạng hoặc thử lại với thiết bị khác.
