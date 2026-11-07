# TraLoi.md — Câu hỏi bổ sung Buổi 9

## Câu 1. Giá trị dẫn xuất

`errors` và `valid` là kết quả **suy ra** từ `name`, `phone`, `address` (và giỏ hàng), nên tính lại ngay trong mỗi lần render thì lúc nào cũng khớp với dữ liệu hiện tại, không thể bị lệch.
Nếu lưu bằng `useState` riêng thì mỗi lần gọi `setName`, `setPhone`, `setAddress`... ta phải nhớ cập nhật luôn `errors` và `valid`. Chỉ cần quên một chỗ là lỗi đỏ hiện sai, hoặc nút "Xác nhận đặt hàng" sáng/mờ không đúng với nội dung form. Ngoài ra còn dễ bị dữ liệu cũ (stale) vì `useState` cập nhật bất đồng bộ.

## Câu 2. Thứ tự gọi

Nếu `clear()` chạy **trước** `await createOrder(...)` thì khi mất mạng giỏ đã bị xoá sạch (cả trong store lẫn AsyncStorage) mà đơn hàng chưa hề được tạo trên server. Người dùng vừa gặp báo lỗi vừa mất toàn bộ hàng đã chọn, phải chọn lại từ đầu.
Đặt `clear()` ngay **sau** `await createOrder(...)` là đúng vì dòng đó chỉ chạy khi `createOrder` thành công (server đã nhận đơn). Nếu `createOrder` ném lỗi, code nhảy thẳng xuống `catch`, bỏ qua `clear()`, nên giỏ còn nguyên và người dùng bấm thử lại được.

## Câu 3. PUT hay PATCH

`PUT /users/1` với `{ name, phone }` sẽ **thay toàn bộ** object, nên user đó trong `db.json` chỉ còn `id`, `name`, `phone`; mất `email` và `password` nên không đăng nhập lại được nữa.
Bài này chọn `PATCH` vì nó chỉ ghi đè các trường được gửi (`name`, `phone`), các trường còn lại giữ nguyên. Form chỉ sửa một phần hồ sơ nên PATCH an toàn hơn.

## Câu 4. Cập nhật lạc quan

Nếu bỏ đoạn hoàn lại `read: false` trong `catch` thì khi mất mạng: giao diện đã đổi sang "đã đọc" (nền trắng, mất chấm đỏ) nhưng server vẫn là `read: false` vì `PATCH` thất bại. Người dùng tưởng đã đọc, nhưng lần sau mở lại màn (hoặc từ máy khác) thông báo lại quay về chưa đọc, giao diện và dữ liệu thật bị lệch nhau, gây khó hiểu.

- **Nên dùng cách này:** thao tác nhẹ, rủi ro thấp, nếu sai cũng dễ hoàn lại, ví dụ đánh dấu đã đọc thông báo, bấm thả tim thêm vào yêu thích.
- **Không nên dùng:** thanh toán / đặt hàng. Phải chắc chắn server đã nhận đơn rồi mới báo "Đặt hàng thành công" và xoá giỏ, vì báo thành công giả sẽ khiến người dùng tưởng đã mua trong khi đơn không tồn tại.

## Câu 5. Code bổ sung — bộ lọc trạng thái ở màn Đơn hàng

Code nằm trong `src/screens/OrdersScreen.tsx` (các đoạn có comment `CÂU HỎI BỔ SUNG 5`).

```tsx
// 1) Kiểu + danh sách lựa chọn
type StatusFilter = "all" | OrderStatus;
const FILTERS: { key: StatusFilter; label: string }[] = [
  { key: "all", label: "Tất cả" },
  { key: "pending", label: "Chờ xác nhận" },
  { key: "shipping", label: "Đang giao" },
  { key: "completed", label: "Hoàn tất" },
  { key: "cancelled", label: "Đã huỷ" },
];

// 2) State lưu trạng thái đang lọc
const [status, setStatus] = useState<StatusFilter>("all");

// 3) MỘT chỗ sửa trong dữ liệu truyền cho FlatList
const visibleOrders = orders.filter((o) => status === "all" || o.status === status);
<FlatList data={visibleOrders} ... />

// 4) Hàng nút lọc phía trên FlatList
{FILTERS.map((f) => (
  <Pressable key={f.key} onPress={() => setStatus(f.key)} style={[styles.chip, status === f.key && styles.chipActive]}>
    <Text>{f.label}</Text>
  </Pressable>
))}
```
