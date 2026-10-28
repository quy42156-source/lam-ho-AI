import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  LayoutDashboard, ShoppingCart, Package, Users, Brain, Settings,
  Bell, Search, ChevronDown, TrendingUp, TrendingDown, ArrowUpRight,
  LogOut, Eye, EyeOff, Star, Zap, BarChart3, AlertCircle,
  CheckCircle, Clock, X, Menu, ChevronRight, Filter, Download,
  RefreshCw, Sparkles, ShieldCheck, Target, DollarSign,
  MessageSquare, Calendar, PieChart, Activity,
  User, ShoppingBag, Plus, Minus, Trash2, Heart, MapPin, Send, Home, LogIn
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart as RPieChart, Pie, Cell, Legend, LineChart, Line
} from "recharts";
import { ProductImage, HeroArt, LoginArt, CategoryArt } from "./illustrations";

/* ─── Types ─── */
type Page = "dashboard" | "orders" | "products" | "customers" | "ai" | "settings";
type AuthView = "login" | "register";
type UserRole = "admin" | "staff" | "customer";
type CustPage = "home" | "catalog" | "orders" | "cart" | "ai" | "account";
interface Account { email: string; password: string; name: string; role: UserRole; }
interface CartItem { productId: string; qty: number; }
interface ChatMsg { role: "user" | "ai"; text: string; }

const accountStorageKey = "salesai.accounts";
const defaultAccounts: Account[] = [
  { email: "admin@gmail.com", password: "12345678", name: "Quản trị viên", role: "admin" },
  { email: "nhanvien@gmail.com", password: "12345678", name: "Nhân viên", role: "staff" },
];

function readRegisteredAccounts(): Account[] {
  try {
    const saved = JSON.parse(localStorage.getItem(accountStorageKey) || "[]") as Account[];
    return Array.isArray(saved)
      ? saved.filter(account => account.role === "customer" && typeof account.email === "string" && typeof account.password === "string" && typeof account.name === "string")
      : [];
  } catch {
    return [];
  }
}

/* ─── Mock data ─── */
const revenueData = [
  { month: "T1", revenue: 4200, target: 4000, orders: 82 },
  { month: "T2", revenue: 5800, target: 5000, orders: 110 },
  { month: "T3", revenue: 4900, target: 5500, orders: 95 },
  { month: "T4", revenue: 7200, target: 6000, orders: 138 },
  { month: "T5", revenue: 8100, target: 7000, orders: 156 },
  { month: "T6", revenue: 6900, target: 7500, orders: 132 },
  { month: "T7", revenue: 9400, target: 8000, orders: 178 },
  { month: "T8", revenue: 11200, target: 9500, orders: 214 },
  { month: "T9", revenue: 10800, target: 10000, orders: 207 },
];

const categoryData = [
  { name: "Điện thoại", value: 30, color: "#fbbf24" },
  { name: "Laptop", value: 20, color: "#0e8b9e" },
  { name: "Tablet", value: 14, color: "#f59e0b" },
  { name: "Âm thanh", value: 14, color: "#1aadc4" },
  { name: "Phụ kiện", value: 12, color: "#0a6472" },
  { name: "Thiết bị khác", value: 10, color: "#7c3aed" },
];

const orders = [
  { id: "#DH-2024001", customer: "Nguyễn Văn An", product: "iPhone 15 Pro Max", amount: 29900000, status: "Đã giao", date: "10/09/2026", avatar: "NA" },
  { id: "#DH-2024002", customer: "Trần Thị Bình", product: "MacBook Air M3", amount: 31500000, status: "Chờ xác nhận", date: "10/09/2026", avatar: "TB" },
  { id: "#DH-2024003", customer: "Lê Hoàng Cường", product: "Samsung Galaxy S24", amount: 22000000, status: "Đang vận chuyển", date: "09/09/2026", avatar: "LC" },
  { id: "#DH-2024004", customer: "Phạm Thị Dung", product: "iPad Pro 12.9\"", amount: 27000000, status: "Đã giao", date: "09/09/2026", avatar: "PD" },
  { id: "#DH-2024005", customer: "Hoàng Minh Đức", product: "AirPods Pro 2", amount: 6500000, status: "Đã hủy", date: "08/09/2026", avatar: "HD" },
  { id: "#DH-2024006", customer: "Vũ Thị Hương", product: "Apple Watch Ultra", amount: 19900000, status: "Đã giao", date: "08/09/2026", avatar: "VH" },
  { id: "#DH-2024007", customer: "Đặng Quốc Khánh", product: "Sony WH-1000XM5", amount: 8200000, status: "Chờ xác nhận", date: "07/09/2026", avatar: "DK" },
];
type SalesOrder = typeof orders[number] & { customerEmail?: string };

const products = [
  { id: "SP001", name: "iPhone 15 Pro Max 256GB", category: "Điện thoại", price: 29900000, stock: 47, sold: 312, rating: 4.9, trend: "+12%", img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=900&q=85" },
  { id: "SP002", name: "MacBook Air M3 16GB", category: "Laptop", price: 31500000, stock: 23, sold: 198, rating: 4.8, trend: "+8%", img: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=900&q=85" },
  { id: "SP003", name: "Samsung Galaxy S24 Ultra", category: "Điện thoại", price: 22000000, stock: 61, sold: 278, rating: 4.7, trend: "+15%", img: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=900&q=85" },
  { id: "SP004", name: "iPad Pro M4 12.9 inch", category: "Tablet", price: 27000000, stock: 34, sold: 156, rating: 4.8, trend: "+5%", img: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=900&q=85" },
  { id: "SP005", name: "AirPods Pro 2 USB-C", category: "Âm thanh", price: 6500000, stock: 128, sold: 534, rating: 4.9, trend: "+22%", img: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=900&q=85" },
  { id: "SP006", name: "Apple Watch Ultra 2", category: "Thiết bị khác", price: 19900000, stock: 18, sold: 89, rating: 4.7, trend: "+3%", img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&q=85" },
  { id: "SP007", name: "Sony WH-1000XM5", category: "Âm thanh", price: 8200000, stock: 52, sold: 213, rating: 4.8, trend: "+18%", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&q=85" },
  { id: "SP008", name: "Logitech MX Master 3S", category: "Phụ kiện", price: 2500000, stock: 96, sold: 342, rating: 4.8, trend: "+9%", img: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=900&q=85" },
  { id: "SP009", name: "Dell UltraSharp 27 inch 4K", category: "Phụ kiện", price: 12900000, stock: 27, sold: 121, rating: 4.7, trend: "+6%", img: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=900&q=85" },
  { id: "SP010", name: "Sony Alpha A7 IV", category: "Thiết bị khác", price: 62000000, stock: 9, sold: 37, rating: 4.9, trend: "+4%", img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=900&q=85" },
  { id: "SP011", name: "ASUS ROG Zephyrus G14", category: "Laptop", price: 42990000, stock: 14, sold: 76, rating: 4.9, trend: "+16%", img: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=900&q=85" },
  { id: "SP012", name: "Dell XPS 14 OLED", category: "Laptop", price: 38990000, stock: 19, sold: 94, rating: 4.8, trend: "+10%", img: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=900&q=85" },
  { id: "SP013", name: "Lenovo Legion 5 Gaming", category: "Laptop", price: 31990000, stock: 21, sold: 133, rating: 4.7, trend: "+14%", img: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=900&q=85" },
  { id: "SP014", name: "Microsoft Surface Laptop 7", category: "Laptop", price: 29990000, stock: 17, sold: 86, rating: 4.7, trend: "+8%", img: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=900&q=85" },
  { id: "SP015", name: "Google Pixel 9 Pro 256GB", category: "Điện thoại", price: 24990000, stock: 36, sold: 174, rating: 4.8, trend: "+11%", img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=900&q=85" },
  { id: "SP016", name: "Xiaomi 14 Ultra", category: "Điện thoại", price: 23990000, stock: 42, sold: 221, rating: 4.8, trend: "+13%", img: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=900&q=85" },
  { id: "SP017", name: "Samsung Galaxy Z Fold6", category: "Điện thoại", price: 41990000, stock: 16, sold: 71, rating: 4.8, trend: "+17%", img: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=900&q=85" },
  { id: "SP018", name: "OPPO Find X8 Pro", category: "Điện thoại", price: 27990000, stock: 25, sold: 119, rating: 4.7, trend: "+9%", img: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=900&q=85" },
  { id: "SP019", name: "Samsung Galaxy Tab S10 Ultra", category: "Tablet", price: 28990000, stock: 28, sold: 103, rating: 4.8, trend: "+9%", img: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=900&q=85" },
  { id: "SP020", name: "Lenovo Tab Extreme", category: "Tablet", price: 21990000, stock: 31, sold: 87, rating: 4.6, trend: "+6%", img: "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=900&q=85" },
  { id: "SP021", name: "Kindle Paperwhite 16GB", category: "Tablet", price: 4190000, stock: 43, sold: 157, rating: 4.8, trend: "+7%", img: "https://images.unsplash.com/photo-1592496001020-d31bd830651f?w=900&q=85" },
  { id: "SP022", name: "JBL Charge 5", category: "Âm thanh", price: 3590000, stock: 67, sold: 289, rating: 4.7, trend: "+13%", img: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=900&q=85" },
  { id: "SP023", name: "Bose QuietComfort Ultra", category: "Âm thanh", price: 10990000, stock: 29, sold: 141, rating: 4.8, trend: "+15%", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&q=85" },
  { id: "SP024", name: "Sony WF-1000XM5", category: "Âm thanh", price: 6490000, stock: 45, sold: 268, rating: 4.8, trend: "+12%", img: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=900&q=85" },
  { id: "SP025", name: "Marshall Emberton II", category: "Âm thanh", price: 4890000, stock: 38, sold: 189, rating: 4.7, trend: "+10%", img: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=900&q=85" },
  { id: "SP026", name: "Logitech MX Keys S", category: "Phụ kiện", price: 2290000, stock: 82, sold: 315, rating: 4.8, trend: "+10%", img: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=900&q=85" },
  { id: "SP027", name: "Razer BlackWidow V4", category: "Phụ kiện", price: 3990000, stock: 47, sold: 177, rating: 4.7, trend: "+11%", img: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=900&q=85" },
  { id: "SP028", name: "Logitech G Pro X Superlight 2", category: "Phụ kiện", price: 3490000, stock: 58, sold: 245, rating: 4.8, trend: "+18%", img: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=900&q=85" },
  { id: "SP029", name: "Elgato Stream Deck MK.2", category: "Phụ kiện", price: 3490000, stock: 22, sold: 93, rating: 4.7, trend: "+7%", img: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=900&q=85" },
  { id: "SP030", name: "Samsung Odyssey G7 32 inch", category: "Phụ kiện", price: 15990000, stock: 18, sold: 112, rating: 4.8, trend: "+13%", img: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=900&q=85" },
  { id: "SP031", name: "LG UltraGear 27GR83Q", category: "Phụ kiện", price: 11990000, stock: 26, sold: 84, rating: 4.7, trend: "+8%", img: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=900&q=85" },
  { id: "SP032", name: "TP-Link Archer AX73 Wi-Fi 6", category: "Thiết bị khác", price: 2790000, stock: 64, sold: 209, rating: 4.6, trend: "+9%", img: "https://images.unsplash.com/photo-1606904825846-647eb07b5be0?w=900&q=85" },
  { id: "SP033", name: "Synology DS224+ NAS", category: "Thiết bị khác", price: 8990000, stock: 12, sold: 41, rating: 4.8, trend: "+5%", img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=900&q=85" },
  { id: "SP034", name: "Canon EOS R8", category: "Thiết bị khác", price: 38990000, stock: 11, sold: 52, rating: 4.8, trend: "+6%", img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=900&q=85" },
  { id: "SP035", name: "DJI Mini 4 Pro", category: "Thiết bị khác", price: 21990000, stock: 8, sold: 35, rating: 4.9, trend: "+19%", img: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=900&q=85" },
  { id: "SP036", name: "PlayStation 5 Slim", category: "Thiết bị khác", price: 13990000, stock: 33, sold: 201, rating: 4.9, trend: "+21%", img: "https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=900&q=85" },
  { id: "SP037", name: "Nintendo Switch OLED", category: "Thiết bị khác", price: 8990000, stock: 27, sold: 166, rating: 4.8, trend: "+16%", img: "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=900&q=85" },
  { id: "SP038", name: "Anker 737 Power Bank 24000mAh", category: "Phụ kiện", price: 2690000, stock: 73, sold: 387, rating: 4.8, trend: "+20%", img: "https://images.unsplash.com/photo-1609592424853-0b7d9e0c2c1d?w=900&q=85" },
  { id: "SP039", name: "Apple MagSafe Charger", category: "Phụ kiện", price: 1190000, stock: 112, sold: 521, rating: 4.7, trend: "+23%", img: "https://images.unsplash.com/photo-1587033411391-5d9f7f4f6f6a?w=900&q=85" },
  { id: "SP040", name: "Belkin 3-in-1 MagSafe Charger", category: "Phụ kiện", price: 3290000, stock: 44, sold: 154, rating: 4.8, trend: "+14%", img: "https://images.unsplash.com/photo-1587033411391-5d9f7f4f6f6a?w=900&q=85" },
  { id: "SP041", name: "Shure MV7 USB Microphone", category: "Âm thanh", price: 6990000, stock: 17, sold: 68, rating: 4.9, trend: "+11%", img: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=900&q=85" },
];

const customers = [
  { id: "KH001", name: "Nguyễn Văn An", email: "an.nguyen@email.com", phone: "0912345678", orders: 28, spent: 142000000, tier: "VIP", joined: "01/2024", avatar: "NA" },
  { id: "KH002", name: "Trần Thị Bình", email: "binh.tran@email.com", phone: "0923456789", orders: 19, spent: 98500000, tier: "Gold", joined: "03/2024", avatar: "TB" },
  { id: "KH003", name: "Lê Hoàng Cường", email: "cuong.le@email.com", phone: "0934567890", orders: 14, spent: 67200000, tier: "Silver", joined: "05/2024", avatar: "LC" },
  { id: "KH004", name: "Phạm Thị Dung", email: "dung.pham@email.com", phone: "0945678901", orders: 32, spent: 187000000, tier: "VIP", joined: "12/2023", avatar: "PD" },
  { id: "KH005", name: "Hoàng Minh Đức", email: "duc.hoang@email.com", phone: "0956789012", orders: 8, spent: 34500000, tier: "Bronze", joined: "07/2024", avatar: "HD" },
  { id: "KH006", name: "Vũ Thị Hương", email: "huong.vu@email.com", phone: "0967890123", orders: 22, spent: 112000000, tier: "Gold", joined: "02/2024", avatar: "VH" },
];

const aiInsights = [
  { type: "warning", icon: AlertCircle, title: "Hàng tồn kho thấp", desc: "Apple Watch Ultra 2 chỉ còn 18 sản phẩm. Dự báo hết hàng trong 12 ngày nếu xu hướng hiện tại tiếp tục.", action: "Đặt thêm hàng" },
  { type: "success", icon: TrendingUp, title: "Cơ hội upsell", desc: "127 khách hàng mua AirPods trong 30 ngày qua có xu hướng mua thêm case bảo vệ. Tỷ lệ chuyển đổi dự kiến 34%.", action: "Tạo chiến dịch" },
  { type: "info", icon: Target, title: "Phân khúc khách hàng mới", desc: "AI phát hiện nhóm 89 khách hàng tiềm năng cao trong độ tuổi 25-35, thích sản phẩm cao cấp và mua online.", action: "Xem chi tiết" },
  { type: "warning", icon: DollarSign, title: "Định giá tối ưu", desc: "Phân tích cho thấy tăng giá Samsung Galaxy S24 thêm 5% sẽ không ảnh hưởng đáng kể đến doanh số nhưng tăng biên lợi nhuận 8%.", action: "Áp dụng" },
  { type: "success", icon: Star, title: "Sản phẩm xu hướng", desc: "MacBook Air M3 đang được tìm kiếm nhiều nhất trong tuần này, tăng 43% so với tuần trước. Đây là thời điểm tốt để quảng bá.", action: "Tạo banner" },
  { type: "info", icon: MessageSquare, title: "Phản hồi khách hàng", desc: "Phân tích 342 đánh giá mới nhất cho thấy 78% khách hàng hài lòng. Vấn đề chính là thời gian giao hàng (35 lần đề cập).", action: "Xem báo cáo" },
];

const aiChat = [
  { role: "ai", text: "Xin chào! Tôi là trợ lý AI SalesBot. Tôi có thể giúp bạn phân tích dữ liệu bán hàng, dự báo doanh thu, tối ưu kho hàng và nhiều hơn nữa. Bạn cần hỗ trợ gì hôm nay?" },
  { role: "user", text: "Cho tôi biết doanh thu tháng này so với tháng trước?" },
  { role: "ai", text: "📊 Tháng 9/2026: **10.8 tỷ đồng** (tính đến ngày 10/9)\n\nSo với T8/2026 (11.2 tỷ): giảm **3.6%** — nhưng đây là bình thường do mới đầu tháng.\n\nDự báo cuối tháng: **13.2 - 14.5 tỷ đồng** (tăng 17-29% so với T8), dựa trên lịch sử và các đơn hàng đang chờ xử lý.\n\n✅ Bạn đang đi đúng hướng để vượt mục tiêu tháng!" },
];

/* ─── Helpers ─── */
function fmt(n: number) {
  if (n >= 1e9) return (n / 1e9).toFixed(1) + " tỷ";
  if (n >= 1e6) return (n / 1e6).toFixed(1) + " tr";
  return n.toLocaleString("vi-VN") + " đ";
}

function readLocalRecords<T>(key: string): T[] {
  try {
    const records = JSON.parse(localStorage.getItem(key) || "[]") as T[];
    return Array.isArray(records) ? records : [];
  } catch {
    return [];
  }
}

const orderStorageKey = "salesai.orders.custom";

function isPendingOrderStatus(status: string) {
  return status === "Chờ xác nhận" || status === "Đang xử lý";
}

function getAllOrders(): SalesOrder[] {
  return [...readLocalRecords<SalesOrder>(orderStorageKey), ...orders];
}

function useSharedOrders() {
  const [allOrders, setAllOrders] = useState(getAllOrders);

  useEffect(() => {
    function syncOrders() {
      setAllOrders(getAllOrders());
    }
    window.addEventListener("storage", syncOrders);
    return () => window.removeEventListener("storage", syncOrders);
  }, []);

  function saveOrders(savedOrders: SalesOrder[]) {
    try {
      localStorage.setItem(orderStorageKey, JSON.stringify(savedOrders));
      setAllOrders([...savedOrders, ...orders]);
      return true;
    } catch {
      return false;
    }
  }

  function addOrder(order: SalesOrder) {
    return saveOrders([order, ...readLocalRecords<SalesOrder>(orderStorageKey)]);
  }

  function updatePendingOrder(id: string, status: string) {
    const savedOrders = readLocalRecords<SalesOrder>(orderStorageKey);
    if (!savedOrders.some(order => order.id === id && isPendingOrderStatus(order.status))) return false;
    return saveOrders(savedOrders.map(order => order.id === id ? { ...order, status } : order));
  }

  return { allOrders, addOrder, updatePendingOrder };
}

function statusColor(s: string) {
  if (s === "Đã giao") return "bg-emerald-500/20 text-emerald-400";
  if (s === "Đang giao" || s === "Đang vận chuyển") return "bg-blue-500/20 text-blue-400";
  if (isPendingOrderStatus(s)) return "bg-amber-500/20 text-amber-400";
  return "bg-red-500/20 text-red-400";
}

function tierColor(t: string) {
  if (t === "VIP") return "bg-yellow-400/20 text-yellow-400";
  if (t === "Gold") return "bg-amber-500/20 text-amber-500";
  if (t === "Silver") return "bg-slate-400/20 text-slate-400";
  return "bg-orange-700/20 text-orange-600";
}

function Avatar({ letters, size = "md" }: { letters: string; size?: "sm" | "md" | "lg" }) {
  const s = size === "sm" ? "w-8 h-8 text-xs" : size === "lg" ? "w-12 h-12 text-sm" : "w-10 h-10 text-xs";
  return (
    <div className={`${s} rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center font-bold text-cyan-900 shrink-0`}>
      {letters}
    </div>
  );
}

/* ─── AI answer engine ───
   Kho câu trả lời theo ý định, khớp tiếng Việt có/không dấu và dựa trên dữ liệu hiện có. */
function aiAnswer(question: string, role: UserRole, ctx: { name: string; myOrders: typeof orders }): string {
  const s = question.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[đĐ]/g, "d").toLowerCase().trim();
  const matches = (...patterns: RegExp[]) => patterns.some(pattern => pattern.test(s));
  const orderPool = role === "customer" ? ctx.myOrders : orders;

  if (!s || matches(/^(xin chao|chao|hello|hi|hey|alo)\b/)) {
    return role === "admin"
      ? "Xin chào! Tôi có thể phân tích doanh thu, đơn hàng, tồn kho, sản phẩm bán chạy và khách hàng VIP. Hãy hỏi theo kỳ hoặc theo sản phẩm cụ thể."
      : role === "staff"
        ? `Xin chào ${ctx.name}! Tôi có thể hỗ trợ tra cứu đơn hàng, xác nhận đơn, kiểm tra tồn kho và tìm thông tin khách hàng.`
        : `Xin chào ${ctx.name}! Tôi có thể tư vấn chọn sản phẩm, giá và tồn kho, hướng dẫn đặt hàng, tra cứu đơn, thanh toán, giao hàng, đổi trả và bảo hành.`;
  }

  if (matches(/cam on|thanks|thank you|thanks bot/)) return "Rất vui được hỗ trợ bạn! Nếu cần thêm thông tin về sản phẩm hoặc đơn hàng, cứ hỏi mình nhé. 😊";
  if (matches(/tam biet|hen gap lai|goodbye|bye\b/)) return "Tạm biệt! Chúc bạn mua sắm vui vẻ. Hẹn gặp lại bạn nhé! 👋";

  const foundOrder = orderPool.find(order => s.replace(/#/g, "").includes(order.id.replace("#", "").toLowerCase()));
  if (foundOrder) {
    return `🧾 Đơn hàng ${foundOrder.id}\nKhách hàng: ${foundOrder.customer}\nSản phẩm: ${foundOrder.product}\nGiá trị: ${fmt(foundOrder.amount)}\nTrạng thái: ${foundOrder.status}\nNgày đặt: ${foundOrder.date}`;
  }

  if (role === "customer" && matches(/don hang cua toi|don cua toi|lich su mua|don da dat|toi da mua|mua gi roi|cac don hang/)) {
    if (ctx.myOrders.length === 0) return "Bạn chưa có đơn hàng nào. Hãy chọn sản phẩm, thêm vào giỏ rồi bấm Đặt hàng. Sau đó đơn sẽ xuất hiện tại mục Đơn hàng của tôi.";
    return `Bạn có ${ctx.myOrders.length} đơn hàng:\n` + ctx.myOrders.map(order => `• ${order.id} — ${order.product} — ${order.status} — ${fmt(order.amount)}`).join("\n");
  }

  if (matches(/huy don|muon huy|cancel order/)) {
    if (role !== "customer") return "Để hủy đơn, hãy tra cứu mã đơn trong Quản lý đơn hàng. Chỉ đơn đang chờ xác nhận mới có thể được hủy.";
    const pending = ctx.myOrders.filter(order => isPendingOrderStatus(order.status));
    if (!pending.length) return "Hiện bạn không có đơn chờ xác nhận để hủy. Đơn đã được nhân viên xác nhận sẽ chuyển sang đang vận chuyển và không thể hủy tại đây.";
    return `Bạn có ${pending.length} đơn đang chờ xác nhận: ${pending.map(order => order.id).join(", ")}. Mở mục Đơn hàng của tôi và nhấn Hủy đơn ở đơn cần hủy.`;
  }

  if (matches(/trang thai don|don dang o dau|don den dau|khi nao nhan|bao gio nhan|tra cuu don|kiem tra don/)) {
    if (role !== "customer") return "Nhập mã đơn (ví dụ #DH-2024001) để xem khách hàng, sản phẩm, giá trị, ngày đặt và trạng thái.";
    if (!ctx.myOrders.length) return "Bạn chưa có đơn hàng để tra cứu. Sau khi đặt hàng, mã và trạng thái sẽ hiển thị trong mục Đơn hàng của tôi.";
    return "Đơn hàng gần nhất của bạn:\n" + ctx.myOrders.slice(0, 5).map(order => `• ${order.id} — ${order.status} — ${order.product}`).join("\n") + "\n\nBạn cũng có thể mở mục Đơn hàng của tôi để xem toàn bộ lịch sử.";
  }

  if (role === "admin" && matches(/doanh thu|revenue|bao cao ban hang|ket qua kinh doanh/)) {
  return "Hiện chatbot chưa xác minh được doanh thu thực tế từ nguồn dữ liệu đơn hàng. Các số liệu báo cáo có sẵn trong mã nguồn có thể là dữ liệu mẫu. Vui lòng kiểm tra dữ liệu đơn hàng thực tế trước khi sử dụng báo cáo.";
}

  if ((role === "admin" || role === "staff") && matches(/don hang|don moi|don cho xac nhan|don dang cho|don dang giao|don van chuyen/)) {
    const pending = orders.filter(order => isPendingOrderStatus(order.status));
    const shipping = orders.filter(order => order.status === "Đang vận chuyển" || order.status === "Đang giao");
    return `📦 Tổng quan đơn mẫu: ${orders.length} đơn.\nChờ xác nhận: ${pending.length}.\nĐang vận chuyển: ${shipping.length}.\n\nNhập mã đơn để tra cứu chi tiết.`;
  }

  if (role === "admin" && matches(/khach hang moi|tong so khach|bao nhieu khach|khach hang than thiet/)) {
    const vipCount = customers.filter(customer => customer.tier === "VIP").length;
    return `👥 Hệ thống có ${customers.length} khách hàng trong dữ liệu mẫu, trong đó ${vipCount} khách hạng VIP. Tổng chi tiêu ghi nhận: ${fmt(customers.reduce((sum, customer) => sum + customer.spent, 0))}.`;
  }

  if ((role === "admin" || role === "staff") && matches(/khach hang.*(vip|gold|top)|top.*khach|khach hang chi tieu cao/)) {
    const vipCustomers = customers.filter(customer => customer.tier === "VIP" || customer.tier === "Gold").sort((a, b) => b.spent - a.spent);
    return `👑 Khách hàng nổi bật (${vipCustomers.length}):\n` + vipCustomers.map(customer => `• ${customer.name} — ${fmt(customer.spent)} — ${customer.orders} đơn — ${customer.tier}`).join("\n");
  }

  if ((role === "admin" || role === "staff") && matches(/san pham ban chay|ban chay nhat|best seller|top san pham|san pham duoc mua nhieu/)) {
    return "🔥 Sản phẩm bán chạy theo dữ liệu mẫu:\n" + [...products].sort((a, b) => b.sold - a.sold).slice(0, 5).map((product, index) => `${index + 1}. ${product.name} — ${product.sold} đã bán — ${fmt(product.price)}`).join("\n");
  }

  if ((role === "admin" || role === "staff") && matches(/ton kho thap|sap het hang|can nhap hang|hang ton|san pham ton kho/)) {
    const lowStock = [...products].filter(product => product.stock < 40).sort((a, b) => a.stock - b.stock);
    if (!lowStock.length) return "Hiện không có sản phẩm nào dưới ngưỡng tồn kho cảnh báo. ✅";
    return `⚠️ ${lowStock.length} sản phẩm còn dưới 40 chiếc:\n` + lowStock.map(product => `• ${product.name}: còn ${product.stock}`).join("\n");
  }

  if (role === "admin" && matches(/muc tieu doanh thu|du bao doanh thu|so sanh thang|tang truong doanh thu/)) {
    const latest = revenueData[revenueData.length - 1];
    const percentage = ((latest.revenue / latest.target) * 100).toFixed(1);
    return `Tháng ${latest.month}, doanh thu mẫu đạt ${fmt(latest.revenue * 1e6)}, bằng ${percentage}% mục tiêu ${fmt(latest.target * 1e6)}. Đây là số liệu demo trong hệ thống.`;
  }

  const foundProduct = products.find(product => {
    const normalizedName = product.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[đĐ]/g, "d").toLowerCase();
    return normalizedName.split(/[\s"]+/).filter(word => word.length > 2).some(word => s.includes(word));
  });
  if (foundProduct) {
    return `📦 ${foundProduct.name}\n💰 Giá bán: ${fmt(foundProduct.price)}\n📦 Tồn kho: ${foundProduct.stock} sản phẩm\n⭐ Đánh giá: ${foundProduct.rating}/5\n${foundProduct.stock < 20 ? "⚠️ Số lượng còn ít, bạn nên đặt sớm." : "✅ Sản phẩm hiện còn hàng."}`;
  }

  if (matches(/goi y|tu van|nen mua|mua gi|chon.*(dien thoai|laptop|tablet)|tim.*san pham/)) {
    const category = ["Điện thoại", "Laptop", "Tablet", "Âm thanh", "Phụ kiện", "Thiết bị khác"].find(item => s.includes(item.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()));
    const candidates = products.filter(product => !category || product.category === category).sort((a, b) => b.sold - a.sold).slice(0, 5);
    return `🛍️ Một số gợi ý được quan tâm${category ? ` trong danh mục ${category}` : ""}:\n` + candidates.map(product => `• ${product.name} — ${fmt(product.price)} — đánh giá ${product.rating}/5`).join("\n") + "\n\nCho mình biết ngân sách hoặc nhu cầu (học tập, làm việc, chơi game, chụp ảnh) để gợi ý sát hơn nhé.";
  }

  if (matches(/dien thoai|smartphone|iphone|samsung galaxy|pixel/)) {
    const phones = products.filter(product => product.category === "Điện thoại").sort((a, b) => b.sold - a.sold).slice(0, 5);
    return "📱 Điện thoại đang có:\n" + phones.map(product => `• ${product.name} — ${fmt(product.price)} — còn ${product.stock}`).join("\n") + "\n\nBạn có thể hỏi tên máy để xem giá và tồn kho chi tiết.";
  }

  if (matches(/laptop|may tinh xach tay|notebook|macbook/)) {
    const laptops = products.filter(product => product.category === "Laptop").sort((a, b) => b.sold - a.sold).slice(0, 6);
    return "💻 Laptop đang có:\n" + laptops.map(product => `• ${product.name} — ${fmt(product.price)} — còn ${product.stock}`).join("\n") + "\n\nHãy cho biết bạn cần máy học tập, văn phòng, thiết kế hay chơi game để mình tư vấn phù hợp.";
  }

  if (matches(/tablet|may tinh bang|ipad/)) {
    const tablets = products.filter(product => product.category === "Tablet").sort((a, b) => b.sold - a.sold);
    return "📱 Máy tính bảng đang có:\n" + tablets.map(product => `• ${product.name} — ${fmt(product.price)} — còn ${product.stock}`).join("\n");
  }

  if (matches(/gia bao nhieu|gia tien|bao nhieu tien|price|cost/)) return "Bạn muốn hỏi giá sản phẩm nào? Gửi tên hoặc mã sản phẩm, ví dụ ‘MacBook Air M3 giá bao nhiêu?’ để mình tra giá và tồn kho.";
  if (matches(/doi tra|doi hang|tra hang|return/)) return "🔄 Chính sách đổi trả: hỗ trợ miễn phí trong 7 ngày nếu sản phẩm còn nguyên tem, hộp và phụ kiện. Hãy giữ hóa đơn/mã đơn và liên hệ nhân viên để được hướng dẫn.";
  if (matches(/hoan tien|bao lau nhan tien|refund|tra tien/)) return "💸 Khi yêu cầu hoàn tiền được duyệt và hàng hoàn đã được tiếp nhận, thời gian xử lý dự kiến 3–5 ngày làm việc. Thời gian tiền về tài khoản có thể phụ thuộc ngân hàng hoặc ví thanh toán.";
  if (matches(/van chuyen|giao hang|ship|phi ship|cuoc giao|don hang den/)) return "🚚 Thời gian giao dự kiến: 1–3 ngày trong nội thành, 3–5 ngày ở tỉnh khác. Miễn phí vận chuyển cho đơn từ 500.000đ. Đơn đã đặt có thể theo dõi trong mục Đơn hàng của tôi.";
  if (matches(/thanh toan|payment|tra gop|installment|quet the/)) return "💳 Hỗ trợ COD, chuyển khoản, ví điện tử Momo/ZaloPay và thẻ tín dụng/ghi nợ. Một số thẻ hỗ trợ trả góp 0%; điều kiện tùy ngân hàng và kỳ hạn.";
  if (matches(/cod|nhan hang moi tra|tra tien khi nhan/)) return "📦 Bạn có thể chọn thanh toán COD (trả tiền khi nhận hàng) nếu phương thức này khả dụng tại địa chỉ giao hàng. Vui lòng chuẩn bị đúng số tiền trên đơn.";
  if (matches(/bao hanh|warranty|sua chua|loi ky thuat|bao hanh bao lau/)) return "🛡️ Sản phẩm điện tử được bảo hành chính hãng 12 tháng. Nếu lỗi do nhà sản xuất trong 30 ngày đầu, hệ thống áp dụng chính sách 1 đổi 1. Hãy cung cấp mã đơn và mô tả lỗi cho nhân viên.";
  if (matches(/hang loi|san pham loi|khong len nguon|vo hop|thieu phu kien/)) return "Rất tiếc vì sự cố. Bạn vui lòng giữ nguyên sản phẩm, hộp và phụ kiện, chụp ảnh/video tình trạng, rồi gửi mã đơn cho nhân viên để được hướng dẫn đổi trả hoặc bảo hành.";
  if (matches(/dat hang|mua hang|checkout|them vao gio|gio hang/)) return "🛒 Cách đặt hàng: chọn sản phẩm → nhấn Thêm vào giỏ → mở Giỏ hàng để kiểm tra số lượng/tổng tiền → nhấn Đặt hàng. Đơn sẽ ở trạng thái Chờ xác nhận và xuất hiện trong Đơn hàng của tôi.";
  if (matches(/dang ky|tao tai khoan|mo tai khoan/)) return "Bạn có thể chọn Đăng ký ngay ở màn hình khách hàng, nhập họ tên, email và mật khẩu tối thiểu 8 ký tự. Tài khoản mới được tạo với quyền khách hàng.";
  if (matches(/dang nhap|quen mat khau|doi mat khau|password/)) return "Hãy đăng nhập bằng email đã đăng ký. Nếu quên mật khẩu, chức năng đặt lại chưa được kết nối trong bản demo; vui lòng liên hệ quản trị viên để được hỗ trợ.";
  if (matches(/khuyen mai|giam gia|ma giam|voucher|coupon/)) return "Ưu đãi thay đổi theo từng chương trình và hiện chưa có dữ liệu mã giảm giá trực tiếp trong hệ thống. Hãy kiểm tra thông báo tại cửa hàng hoặc hỏi nhân viên trước khi thanh toán.";
  if (matches(/hoa don|hoa don vat|vat|invoice/)) return "Để yêu cầu hóa đơn, hãy cung cấp mã đơn và thông tin xuất hóa đơn cho nhân viên sau khi đặt hàng. Bản demo hiện chưa tự phát hành hóa đơn điện tử.";
  if (matches(/cua hang o dau|dia chi cua hang|gio mo cua|hotline|so dien thoai cua hang/)) return "Thông tin địa chỉ, giờ mở cửa và hotline chưa được cấu hình trong bản demo. Bạn có thể gửi câu hỏi về đơn hàng hoặc liên hệ nhân viên quản trị để được hỗ trợ.";
  if (matches(/ai lam duoc gi|ban co the lam gi|tro giup|help|huong dan/)) return role === "customer"
    ? "Mình có thể tra giá/tồn kho, gợi ý sản phẩm, hướng dẫn đặt hàng, tra cứu mã đơn và giải đáp thanh toán, vận chuyển, đổi trả, hoàn tiền, bảo hành. Bạn có thể hỏi như: ‘MacBook Air M3 giá bao nhiêu?’ hoặc ‘Đơn #DH-123 đang ở đâu?’"
    : "Tôi có thể tra cứu đơn theo mã, tổng hợp trạng thái đơn, tìm sản phẩm bán chạy/tồn thấp và trả lời câu hỏi khách hàng. Admin còn có thể hỏi doanh thu hoặc khách VIP.";

  if (matches(/ton kho|het hang|con hang|so luong con|stock/)) {
    if (role === "customer") return "Bạn hãy nhập tên sản phẩm cụ thể (ví dụ ‘iPhone 15 Pro Max còn hàng không?’) để mình tra tồn kho chính xác.";
    const lowStock = [...products].sort((a, b) => a.stock - b.stock).filter(product => product.stock < 40);
    return lowStock.length ? `⚠️ Sản phẩm tồn thấp:\n${lowStock.map(product => `• ${product.name}: còn ${product.stock}`).join("\n")}` : "Hiện các sản phẩm đều trên ngưỡng cảnh báo tồn kho. ✅";
  }

  return role === "admin"
    ? "Tôi chưa khớp câu hỏi này. Bạn có thể hỏi về doanh thu, đơn hàng, tồn kho, sản phẩm bán chạy, khách VIP hoặc nhập mã đơn để tra cứu."
    : role === "staff"
      ? "Tôi chưa khớp câu hỏi này. Bạn có thể hỏi về đơn cần xác nhận, vận chuyển, tồn kho, sản phẩm bán chạy, khách VIP hoặc tra cứu theo mã đơn."
      : "Mình chưa hiểu rõ câu hỏi. Bạn có thể hỏi về tên/giá sản phẩm, tồn kho, gợi ý mua sắm, cách đặt hàng, mã đơn, vận chuyển, thanh toán, đổi trả hoặc bảo hành nhé.";
}

/* ─── Auth Pages ─── */
function CustomerAuthPage({ onAuthenticate, onStaffPortal }: {
  onAuthenticate: (email: string, password: string, name: string, register: boolean) => string | null;
  onStaffPortal: () => void;
}) {
  const [view, setView] = useState<AuthView>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    if (!email.trim() || !password) { setError("Vui lòng điền email và mật khẩu."); return; }
    if (view === "register" && !name.trim()) { setError("Vui lòng nhập họ và tên."); return; }
    if (view === "register" && password.length < 8) { setError("Mật khẩu cần có ít nhất 8 ký tự."); return; }
    const message = onAuthenticate(email.trim().toLowerCase(), password, name.trim(), view === "register");
    if (message) setError(message);
  }

  return (
    <div className="min-h-full bg-[#f3f5ef] text-[#123c39] lg:grid lg:grid-cols-[1.08fr_0.92fr]">
      <section className="relative hidden min-h-full flex-col overflow-hidden bg-[#073b39] p-10 text-white lg:flex xl:p-14">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(#b7d9ca 0.7px, transparent 0.7px)", backgroundSize: "22px 22px" }} />
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f2c94c] text-[#073b39]"><Zap size={20} fill="currentColor" /></div>
          <span style={{ fontFamily: "Outfit, sans-serif" }} className="text-xl font-bold">SalesAI Pro</span>
        </div>
        <div className="relative z-10 mt-auto max-w-xl pb-10 pt-16">
          <p className="mb-4 text-xs font-bold tracking-[0.18em] text-[#f2c94c]">CỬA HÀNG CÔNG NGHỆ</p>
          <h1 style={{ fontFamily: "Outfit, sans-serif" }} className="max-w-lg text-5xl font-bold leading-[1.08] xl:text-6xl">Thiết bị tốt.<br /><span className="text-[#f2c94c]">Ngày mới tốt hơn.</span></h1>
          <p className="mt-5 max-w-md text-base leading-7 text-[#d0e3dc]/75">Khám phá công nghệ phù hợp với nhịp sống của bạn, đặt hàng nhanh và theo dõi mọi đơn mua trong một nơi.</p>
          <div className="mt-10 grid max-w-lg grid-cols-[1.1fr_0.9fr] gap-3">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#e4ebe2] p-2">
              <ProductImage id="SP001" src={products[0].img} category={products[0].category} className="h-44 w-full rounded-xl object-cover" />
            </div>
            <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f2c94c]/15 text-[#f2c94c]"><ShieldCheck size={20} /></div>
              <div><p className="text-xs text-[#d0e3dc]/55">GỢI Ý HÔM NAY</p><p className="mt-1 text-sm font-semibold leading-5">{products[0].name}</p><p className="mt-2 text-sm font-bold text-[#f2c94c]">{fmt(products[0].price)}</p></div>
            </div>
          </div>
        </div>
        <p className="relative z-10 text-xs text-white/35">© 2026 SalesAI Pro</p>
      </section>

      <main className="flex min-h-full flex-col px-5 py-6 sm:px-10 lg:justify-center lg:px-12 xl:px-20">
        <header className="mb-12 flex items-center justify-between lg:mb-10">
          <div className="flex items-center gap-2.5 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f2c94c] text-[#073b39]"><Zap size={18} fill="currentColor" /></div>
            <span style={{ fontFamily: "Outfit, sans-serif" }} className="text-lg font-bold">SalesAI Pro</span>
          </div>
          <button onClick={onStaffPortal} className="ml-auto inline-flex items-center gap-2 rounded-full border border-[#123c39]/15 px-4 py-2 text-xs font-semibold text-[#315b55] transition hover:border-[#123c39]/35 hover:bg-white">
            <ShieldCheck size={14} /> Nhân viên / Admin
          </button>
        </header>

        <div className="mx-auto w-full max-w-md pb-8">
          <div className="mb-7">
            <p className="mb-2 text-xs font-bold tracking-[0.16em] text-[#99821f]">TÀI KHOẢN KHÁCH HÀNG</p>
            <h2 style={{ fontFamily: "Outfit, sans-serif" }} className="text-3xl font-bold text-[#123c39]">{view === "login" ? "Chào mừng trở lại" : "Tạo tài khoản mới"}</h2>
            <p className="mt-2 text-sm leading-6 text-[#67807a]">{view === "login" ? "Đăng nhập để tiếp tục mua sắm và theo dõi đơn hàng." : "Đăng ký để lưu thông tin và theo dõi đơn hàng của bạn."}</p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            {view === "register" && (
              <label className="block"><span className="mb-1.5 block text-xs font-semibold text-[#315b55]">Họ và tên</span><input autoComplete="name" required value={name} onChange={event => setName(event.target.value)} placeholder="Nguyễn Văn An" className="w-full rounded-xl border border-[#d6dfd6] bg-white px-4 py-3 text-sm text-[#123c39] outline-none transition placeholder:text-[#9aaca3] focus:border-[#0a6472] focus:ring-4 focus:ring-[#0a6472]/10" /></label>
            )}
            <label className="block"><span className="mb-1.5 block text-xs font-semibold text-[#315b55]">Email</span><input autoComplete="email" type="email" required value={email} onChange={event => setEmail(event.target.value)} placeholder="ban@example.com" className="w-full rounded-xl border border-[#d6dfd6] bg-white px-4 py-3 text-sm text-[#123c39] outline-none transition placeholder:text-[#9aaca3] focus:border-[#0a6472] focus:ring-4 focus:ring-[#0a6472]/10" /></label>
            <label className="block"><span className="mb-1.5 block text-xs font-semibold text-[#315b55]">Mật khẩu</span><span className="relative block"><input autoComplete={view === "login" ? "current-password" : "new-password"} type={showPassword ? "text" : "password"} minLength={view === "register" ? 8 : undefined} required value={password} onChange={event => setPassword(event.target.value)} placeholder={view === "register" ? "Tối thiểu 8 ký tự" : "Nhập mật khẩu"} className="w-full rounded-xl border border-[#d6dfd6] bg-white px-4 py-3 pr-12 text-sm text-[#123c39] outline-none transition placeholder:text-[#9aaca3] focus:border-[#0a6472] focus:ring-4 focus:ring-[#0a6472]/10" /><button type="button" aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"} onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#78918a] hover:text-[#123c39]">{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></span></label>
            {error && <div role="alert" className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"><AlertCircle size={15} className="shrink-0" />{error}</div>}
            <button type="submit" className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0a6472] px-4 py-3.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(10,100,114,0.18)] transition hover:bg-[#075763]">
              {view === "login" ? <><LogIn size={16} /> Đăng nhập</> : <><User size={16} /> Tạo tài khoản</>}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#67807a]">
            {view === "login" ? "Chưa có tài khoản? " : "Đã có tài khoản? "}
            <button onClick={() => { setView(view === "login" ? "register" : "login"); setError(""); }} className="font-bold text-[#0a6472] hover:text-[#073b39]">
              {view === "login" ? "Đăng ký ngay" : "Đăng nhập"}
            </button>
          </p>
        </div>
        <p className="mt-auto text-center text-xs text-[#9aaca3]">© 2026 SalesAI Pro</p>
      </main>
    </div>
  );
}

function AuthPage({ onAuthenticate, onCustomerPortal }: {
  onAuthenticate: (email: string, password: string, name: string, register: boolean) => string | null;
  onCustomerPortal: () => void;
}) {
  const [showPw, setShowPw] = useState(false);
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email || !pw) { setError("Vui lòng điền đầy đủ thông tin"); return; }
    const message = onAuthenticate(email.trim().toLowerCase(), pw, "", false);
    if (message) setError(message);
  }

  return (
    <div className="min-h-full bg-[#02171a] flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col w-1/2 bg-gradient-to-br from-[#03333a] via-[#064d58] to-[#0a6472] p-12 relative overflow-hidden">
        {/* decorative circles */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-yellow-400/5 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-yellow-400/8 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-yellow-400/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full border border-yellow-400/8" />

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-yellow-400 flex items-center justify-center">
            <Zap size={20} className="text-[#03333a]" fill="currentColor" />
          </div>
          <span style={{ fontFamily: "Outfit, sans-serif" }} className="text-xl font-bold text-white tracking-tight">SalesAI Pro</span>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/20 rounded-full px-4 py-1.5 text-yellow-400 text-sm font-medium mb-6 w-fit">
            <Brain size={14} />
            Được hỗ trợ bởi AI thế hệ mới
          </div>
          <h1 style={{ fontFamily: "Outfit, sans-serif" }} className="text-5xl font-bold text-white leading-tight mb-4">
            Quản lý bán hàng<br />
            <span className="text-yellow-400">thông minh hơn</span><br />
            với AI
          </h1>
          <p className="text-blue-200/70 text-lg leading-relaxed mb-10">
            Hệ thống phân tích dữ liệu thời gian thực, dự báo doanh thu và tối ưu hóa chiến lược kinh doanh của bạn.
          </p>

          <LoginArt className="w-full max-w-md mb-8 drop-shadow-2xl" />

          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: TrendingUp, label: "Tăng doanh thu", val: "32%" },
              { icon: Target, label: "Độ chính xác AI", val: "94.7%" },
              { icon: Users, label: "Doanh nghiệp tin dùng", val: "2,400+" },
              { icon: ShieldCheck, label: "Bảo mật dữ liệu", val: "SOC2" },
            ].map(({ icon: Icon, label, val }) => (
              <div key={label} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <Icon size={18} className="text-yellow-400 mb-2" />
                <div className="text-white font-bold text-lg">{val}</div>
                <div className="text-blue-200/60 text-xs">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-blue-200/40 text-sm relative z-10">© 2026 SalesAI Pro. All rights reserved.</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-yellow-400 flex items-center justify-center">
              <Zap size={18} className="text-[#03333a]" fill="currentColor" />
            </div>
            <span style={{ fontFamily: "Outfit, sans-serif" }} className="text-xl font-bold text-white">SalesAI Pro</span>
          </div>

          <div className="bg-[#03333a] border border-white/10 rounded-3xl p-8">
            <h2 style={{ fontFamily: "Outfit, sans-serif" }} className="text-2xl font-bold text-white mb-1">
              Đăng nhập quản trị
            </h2>
            <p className="text-blue-200/60 text-sm mb-6">
              Dành cho nhân viên và quản trị viên.
            </p>

            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="text-blue-200/70 text-xs font-medium mb-1.5 block">Email</label>
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="ban@example.com"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-yellow-400/60 focus:bg-white/8 transition-all"
                />
              </div>
              <div>
                <label className="text-blue-200/70 text-xs font-medium mb-1.5 block">Mật khẩu</label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"} value={pw} onChange={e => setPw(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-yellow-400/60 focus:bg-white/8 transition-all"
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors">
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2.5">
                  <AlertCircle size={14} className="text-red-400 shrink-0" />
                  <p className="text-red-400 text-xs">{error}</p>
                </div>
              )}

              <div className="flex justify-end">
                <button type="button" className="text-yellow-400 text-xs hover:text-yellow-300 transition-colors">Quên mật khẩu?</button>
              </div>

              <button
                type="submit"
                className="w-full bg-yellow-400 hover:bg-yellow-300 text-[#03333a] font-bold py-3 rounded-xl transition-all text-sm disabled:opacity-70 flex items-center justify-center gap-2"
              >
                Đăng nhập
              </button>
            </form>

            <button onClick={onCustomerPortal} className="mt-5 flex w-full items-center justify-center gap-2 text-blue-200/60 text-xs hover:text-white transition-colors">
              <ChevronRight size={14} className="rotate-180" /> Quay lại cổng khách hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Sidebar ─── */

const adminPages: Page[] = ["dashboard", "orders", "products", "customers", "ai", "settings"];
const staffPages: Page[] = ["dashboard", "orders", "products", "customers", "ai"];
function canAccess(role: UserRole, page: Page) {
  if (role === "admin") return adminPages.includes(page);
  if (role === "staff") return staffPages.includes(page);
  return false;
}
function roleLabel(role: UserRole) {
  return role === "admin" ? "Quản trị viên" : role === "staff" ? "Nhân viên" : "Khách hàng";
}

const navItems: { id: Page; label: string; icon: React.ElementType }[] = [
  { id: "dashboard", label: "Tổng quan", icon: LayoutDashboard },
  { id: "orders", label: "Đơn hàng", icon: ShoppingCart },
  { id: "products", label: "Sản phẩm", icon: Package },
  { id: "customers", label: "Khách hàng", icon: Users },
  { id: "ai", label: "AI Insights", icon: Brain },
  { id: "settings", label: "Cài đặt", icon: Settings },
];

function Sidebar({ page, onPage, collapsed, name, role, onLogout }: { page: Page; onPage: (p: Page) => void; collapsed: boolean; name: string; role: UserRole; onLogout: () => void }) {
  return (
    <aside className={`h-full bg-[#03333a] border-r border-white/8 flex flex-col transition-all duration-300 ${collapsed ? "w-16" : "w-60"} shrink-0`}>
      {/* Logo */}
      <div className={`flex items-center gap-3 p-4 border-b border-white/8 ${collapsed ? "justify-center" : ""}`}>
        <div className="w-9 h-9 rounded-xl bg-yellow-400 flex items-center justify-center shrink-0">
          <Zap size={18} className="text-[#03333a]" fill="currentColor" />
        </div>
        {!collapsed && <span style={{ fontFamily: "Outfit, sans-serif" }} className="text-lg font-bold text-white">SalesAI Pro</span>}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-hide">
        {navItems.filter(item => canAccess(role, item.id)).map(({ id, label, icon: Icon }) => {
          const active = page === id;
          return (
            <button
              key={id}
              onClick={() => onPage(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium ${
                active
                  ? "bg-yellow-400 text-[#03333a]"
                  : "text-blue-200/60 hover:bg-white/6 hover:text-white"
              } ${collapsed ? "justify-center" : ""}`}
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && <span>{label}</span>}
              {!collapsed && id === "ai" && <span className="ml-auto bg-yellow-400/20 text-yellow-400 text-xs px-1.5 py-0.5 rounded-full font-medium">NEW</span>}
            </button>
          );
        })}
      </nav>

      {/* User */}
      <div className={`p-3 border-t border-white/8 ${collapsed ? "flex flex-col items-center gap-2" : "space-y-2"}`}>
        {collapsed ? (
          <Avatar letters={name.slice(0, 2).toUpperCase()} size="sm" />
        ) : (
          <div className="flex items-center gap-3 px-2 py-2">
            <Avatar letters={name.slice(0, 2).toUpperCase()} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{name}</p>
              <p className="text-blue-200/50 text-xs">{roleLabel(role)}</p>
            </div>
          </div>
        )}
        <button onClick={onLogout} aria-label="Đăng xuất" title={collapsed ? "Đăng xuất" : undefined} className={`flex items-center gap-3 rounded-xl text-sm font-medium text-red-300 hover:bg-red-500/10 transition-colors ${collapsed ? "w-10 h-10 justify-center" : "w-full px-3 py-2"}`}>
          <LogOut size={16} />{!collapsed && <span>Đăng xuất</span>}
        </button>
      </div>
    </aside>
  );
}

/* ─── Stat Card ─── */
function StatCard({ icon: Icon, label, value, sub, trend, positive }: {
  icon: React.ElementType; label: string; value: string; sub: string; trend: string; positive: boolean;
}) {
  return (
    <div className="bg-[#03333a] border border-white/8 rounded-2xl p-5 flex flex-col gap-3 hover:border-yellow-400/20 transition-colors">
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 rounded-xl bg-yellow-400/10 flex items-center justify-center">
          <Icon size={18} className="text-yellow-400" />
        </div>
        <span className={`text-xs font-medium flex items-center gap-0.5 ${positive ? "text-emerald-400" : "text-red-400"}`}>
          {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {trend}
        </span>
      </div>
      <div>
        <p className="text-blue-200/60 text-xs mb-0.5">{label}</p>
        <p style={{ fontFamily: "Outfit, sans-serif" }} className="text-white text-2xl font-bold">{value}</p>
        <p className="text-blue-200/40 text-xs mt-1">{sub}</p>
      </div>
    </div>
  );
}

/* ─── Dashboard Page ─── */
function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={DollarSign} label="Doanh thu tháng" value="10.8 tỷ" sub="So với T8: -3.6%" trend="+17% dự kiến" positive />
        <StatCard icon={ShoppingCart} label="Đơn hàng" value="207" sub="Hôm nay: 14 đơn" trend="+8.4%" positive />
        <StatCard icon={Users} label="Khách hàng mới" value="89" sub="Tháng này" trend="+12.3%" positive />
        <StatCard icon={Package} label="Sản phẩm bán" value="1,580" sub="Còn tồn: 363 SP" trend="-2.1%" positive={false} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Revenue chart */}
        <div className="xl:col-span-2 bg-[#03333a] border border-white/8 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 style={{ fontFamily: "Outfit, sans-serif" }} className="text-white font-semibold">Doanh thu & Mục tiêu</h3>
              <p className="text-blue-200/50 text-xs">9 tháng gần nhất (triệu VND)</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-blue-200/50">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-yellow-400 inline-block" />Thực tế</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-blue-500/60 inline-block" />Mục tiêu</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#fbbf24" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="tgt" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3bddf6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3bddf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
  strokeDasharray="3 3"
  stroke="var(--chart-grid, rgba(255,255,255,0.12))"
/>
              <XAxis
  dataKey="month"
  tick={{ fill: "var(--chart-text, #93c5fd)", fontSize: 12, fontWeight: 500 }}
  axisLine={{ stroke: "var(--chart-axis, #64748b)" }}
  tickLine={false}
/>
<YAxis
  tick={{ fill: "var(--chart-text, #93c5fd)", fontSize: 12, fontWeight: 500 }}
  axisLine={false}
  tickLine={false}
/>
              <Tooltip
  contentStyle={{
    background: "var(--chart-tooltip-bg, #064d58)",
    border: "1px solid var(--chart-tooltip-border, rgba(255,255,255,0.2))",
    borderRadius: 12,
    color: "var(--chart-tooltip-text, #ffffff)",
    fontSize: 13,
  }}
  labelStyle={{ color: "var(--chart-tooltip-text, #ffffff)" }}
/>
              <Area type="monotone" dataKey="target" stroke="#3bddf6" strokeWidth={2} strokeDasharray="5 5" fill="url(#tgt)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category pie */}
        <div className="bg-[#03333a] border border-white/8 rounded-2xl p-5">
          <h3 style={{ fontFamily: "Outfit, sans-serif" }} className="text-white font-semibold mb-1">Theo danh mục</h3>
          <p className="text-blue-200/50 text-xs mb-3">Tỷ lệ doanh thu</p>
          <ResponsiveContainer width="100%" height={160}>
            <RPieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
                {categoryData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip
  contentStyle={{
    background: "var(--chart-tooltip-bg, #064d58)",
    border: "1px solid var(--chart-tooltip-border, rgba(255,255,255,0.2))",
    borderRadius: 12,
    color: "var(--chart-tooltip-text, #ffffff)",
    fontSize: 13,
  }}
  labelStyle={{ color: "var(--chart-tooltip-text, #ffffff)" }}
/>
            </RPieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-1">
            {categoryData.map(c => (
              <div key={c.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full inline-block" style={{ background: c.color }} />
                  <span className="text-slate-600 dark:text-blue-200/70">{c.name}</span>
                </span>
                <span className="text-slate-800 dark:text-white font-semibold">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI alert strip */}
      <div className="bg-gradient-to-r from-yellow-400/10 to-yellow-400/5 border border-yellow-400/20 rounded-2xl p-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-yellow-400/20 flex items-center justify-center shrink-0">
          <Brain size={18} className="text-yellow-400" />
        </div>
        <div className="flex-1">
          <p className="text-white text-sm font-medium">AI phát hiện: Doanh thu cuối tháng 9 dự kiến đạt 13.5 tỷ — vượt mục tiêu 35%</p>
          <p className="text-blue-200/50 text-xs">Dựa trên phân tích 6 yếu tố từ lịch sử 2 năm • Độ tin cậy 92%</p>
        </div>
        <button className="text-yellow-400 text-xs font-medium flex items-center gap-1 shrink-0 hover:text-yellow-300 transition-colors">
          Chi tiết <ChevronRight size={13} />
        </button>
      </div>

      {/* Recent orders */}
      <div className="bg-[#03333a] border border-white/8 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
          <h3 style={{ fontFamily: "Outfit, sans-serif" }} className="text-white font-semibold">Đơn hàng gần đây</h3>
          <button className="text-yellow-400 text-xs font-medium flex items-center gap-1 hover:text-yellow-300 transition-colors">
            Xem tất cả <ChevronRight size={13} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {["Mã đơn", "Khách hàng", "Sản phẩm", "Giá trị", "Trạng thái"].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-blue-200/50 text-xs font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map(o => (
                <tr key={o.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                  <td className="px-5 py-3 font-mono text-yellow-400 text-xs">{o.id}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <Avatar letters={o.avatar} size="sm" />
                      <span className="text-white text-xs">{o.customer}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-blue-200/70 text-xs">{o.product}</td>
                  <td className="px-5 py-3 text-white font-medium text-xs">{fmt(o.amount)}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex whitespace-nowrap px-2.5 py-1 rounded-full text-xs font-medium ${statusColor(o.status)}`}>{o.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ─── Orders Page ─── */
function OrdersPage({ allOrders, canConfirmOrders, onUpdateOrder }: {
  allOrders: SalesOrder[]; canConfirmOrders: boolean; onUpdateOrder: (id: string, status: string) => boolean;
}) {
  const [search, setSearch] = useState("");
  const savedOrderIds = new Set(readLocalRecords<SalesOrder>(orderStorageKey).map(order => order.id));
  const filtered = allOrders.filter(o => o.customer.toLowerCase().includes(search.toLowerCase()) || o.id.includes(search));
  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 style={{ fontFamily: "Outfit, sans-serif" }} className="text-2xl font-bold text-white">Quản lý đơn hàng</h2>
          <p className="text-blue-200/50 text-sm">{allOrders.length} đơn hàng tổng cộng</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-white/6 hover:bg-white/10 border border-white/10 text-white/70 px-3 py-2 rounded-xl text-sm transition-all">
            <Filter size={14} /> Lọc
          </button>
          <button className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-[#03333a] font-bold px-3 py-2 rounded-xl text-sm transition-all">
            <Download size={14} /> Xuất Excel
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Tất cả", val: allOrders.length, color: "text-white" },
          { label: "Đã giao", val: allOrders.filter(o => o.status === "Đã giao").length, color: "text-emerald-400" },
          { label: "Chờ xác nhận", val: allOrders.filter(o => isPendingOrderStatus(o.status)).length, color: "text-amber-400" },
          { label: "Đã hủy", val: allOrders.filter(o => o.status === "Đã hủy").length, color: "text-red-400" },
        ].map(s => (
          <div key={s.label} className="bg-[#03333a] border border-white/8 rounded-xl p-3 text-center">
            <p className={`text-2xl font-bold ${s.color}`} style={{ fontFamily: "Outfit, sans-serif" }}>{s.val}</p>
            <p className="text-blue-200/50 text-xs">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#03333a] border border-white/8 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/8 flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm đơn hàng..." className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-white text-sm placeholder-white/30 focus:outline-none focus:border-yellow-400/50 transition-colors" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {["Mã đơn", "Khách hàng", "Sản phẩm", "Giá trị", "Ngày đặt", "Trạng thái", "Hành động"].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-blue-200/50 text-xs font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-yellow-400 text-xs">{o.id}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <Avatar letters={o.avatar} size="sm" />
                      <span className="text-white text-xs">{o.customer}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-blue-200/70 text-xs">{o.product}</td>
                  <td className="px-5 py-3.5 text-white font-semibold text-xs">{fmt(o.amount)}</td>
                  <td className="px-5 py-3.5 text-blue-200/50 text-xs">{o.date}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex whitespace-nowrap px-2.5 py-1 rounded-full text-xs font-medium ${statusColor(o.status)}`}>{o.status}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    {canConfirmOrders && savedOrderIds.has(o.id) && isPendingOrderStatus(o.status) ? (
                      <button onClick={() => onUpdateOrder(o.id, "Đang vận chuyển")} aria-label={`Xác nhận đơn ${o.id}`} className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-emerald-400 px-3 py-2 text-xs font-bold text-[#073b39] shadow-sm transition hover:bg-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200 focus-visible:ring-offset-2 focus-visible:ring-offset-[#03333a]">
                        <CheckCircle size={15} strokeWidth={2.5} /> Xác nhận
                      </button>
                    ) : (
                      <span className="text-blue-200/30 text-xs">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ─── Products Page ─── */
function ProductsPage() {
  const [search, setSearch] = useState("");
  const [productList, setProductList] = useState(() => [...products, ...readLocalRecords<typeof products[number]>("salesai.products.custom")]);
  const [addOpen, setAddOpen] = useState(false);
  const [formError, setFormError] = useState("");
  const [draft, setDraft] = useState({ name: "", category: "Điện thoại", price: "", stock: "" });
  const filtered = productList.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  const categories = [...new Set(products.map(product => product.category))];

  
async function addProduct(e: React.FormEvent) {
  e.preventDefault();
  setFormError("");

  const newProduct = {
    id: `SP${Date.now()}`,
    name: draft.name.trim(),
    category: draft.category,
    price: Number(draft.price),
    stock: Number(draft.stock),
    sold: 0,
    rating: 5,
    trend: "0%",
    img: "",
  };

  try {
    const response = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProduct),
    });

    const responseText = await response.text();

let result: any;

try {
  result = JSON.parse(responseText);
} catch {
  console.error("API không trả về JSON hợp lệ:", {
    status: response.status,
    responseText,
  });

  throw new Error(
    `API trả về dữ liệu không hợp lệ (HTTP ${response.status}). ` +
    (responseText || "Phản hồi từ máy chủ đang trống.")
  );
}

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Không thể lưu sản phẩm.");
    }

    const savedProduct = result.data;

    const savedProducts = readLocalRecords<typeof products[number]>(
      "salesai.products.custom"
    );

    localStorage.setItem(
      "salesai.products.custom",
      JSON.stringify([savedProduct, ...savedProducts])
    );

    setProductList(current => [savedProduct, ...current]);
    setDraft({
      name: "",
      category: "Điện thoại",
      price: "",
      stock: "",
    });
    setAddOpen(false);
  } catch (error) {
    setFormError(
      error instanceof Error
        ? error.message
        : "Không thể lưu sản phẩm."
    );
  }
}


  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 style={{ fontFamily: "Outfit, sans-serif" }} className="text-2xl font-bold text-white">Quản lý sản phẩm</h2>
          <p className="text-blue-200/50 text-sm">{productList.length} sản phẩm trong kho</p>
        </div>
        <button onClick={() => { setFormError(""); setAddOpen(true); }} className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-[#03333a] font-bold px-4 py-2 rounded-xl text-sm transition-all">
          <Plus size={16} /> Thêm sản phẩm
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm sản phẩm..." className="w-full bg-[#03333a] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-white text-sm placeholder-white/30 focus:outline-none focus:border-yellow-400/50 transition-colors" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {filtered.map(p => (
          <div key={p.id} className="bg-[#03333a] border border-white/8 rounded-2xl p-5 hover:border-yellow-400/20 transition-colors">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 rounded-xl overflow-hidden border border-yellow-400/20 shrink-0">
                <ProductImage id={p.id} src={p.img} category={p.category} className="w-full h-full" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-white font-semibold text-sm">{p.name}</p>
                  <span className={`text-xs font-medium flex items-center gap-0.5 shrink-0 ${p.trend.startsWith("+") ? "text-emerald-400" : "text-red-400"}`}>
                    <TrendingUp size={11} /> {p.trend}
                  </span>
                </div>
                <p className="text-blue-200/50 text-xs mt-0.5 font-mono">{p.id} • {p.category}</p>
                <div className="flex items-center gap-4 mt-3">
                  <div>
                    <p className="text-blue-200/40 text-xs">Giá bán</p>
                    <p className="text-yellow-400 font-semibold text-sm">{fmt(p.price)}</p>
                  </div>
                  <div>
                    <p className="text-blue-200/40 text-xs">Tồn kho</p>
                    <p className={`font-semibold text-sm ${p.stock < 20 ? "text-red-400" : "text-white"}`}>{p.stock}</p>
                  </div>
                  <div>
                    <p className="text-blue-200/40 text-xs">Đã bán</p>
                    <p className="text-white font-semibold text-sm">{p.sold}</p>
                  </div>
                  <div>
                    <p className="text-blue-200/40 text-xs">Đánh giá</p>
                    <p className="text-white font-semibold text-sm flex items-center gap-0.5"><Star size={11} className="text-yellow-400" /> {p.rating}</p>
                  </div>
                </div>
                {p.stock < 20 && (
                  <div className="mt-2 flex items-center gap-1 text-red-400 text-xs">
                    <AlertCircle size={11} /> Hàng sắp hết, cần đặt thêm
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {addOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4">
          <div role="dialog" aria-modal="true" aria-labelledby="add-product-title" className="w-full max-w-lg bg-[#03333a] border border-white/10 rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <h3 id="add-product-title" className="text-white font-semibold">Thêm sản phẩm</h3>
              <button type="button" aria-label="Đóng" onClick={() => setAddOpen(false)} className="text-white/50 hover:text-white"><X size={18} /></button>
            </div>
            <form onSubmit={addProduct} className="p-5 space-y-4">
              <label className="block"><span className="block text-blue-200/70 text-xs mb-1.5">Tên sản phẩm</span><input required autoFocus value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-yellow-400/60" placeholder="Ví dụ: Điện thoại mới" /></label>
              <label className="block"><span className="block text-blue-200/70 text-xs mb-1.5">Danh mục</span><select value={draft.category} onChange={e => setDraft({ ...draft, category: e.target.value })} className="w-full bg-[#064d58] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-yellow-400/60">{categories.map(category => <option key={category}>{category}</option>)}</select></label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block"><span className="block text-blue-200/70 text-xs mb-1.5">Giá bán (đ)</span><input required type="number" min="1" step="1" value={draft.price} onChange={e => setDraft({ ...draft, price: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-yellow-400/60" placeholder="15000000" /></label>
                <label className="block"><span className="block text-blue-200/70 text-xs mb-1.5">Tồn kho</span><input required type="number" min="0" step="1" value={draft.stock} onChange={e => setDraft({ ...draft, stock: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-yellow-400/60" placeholder="10" /></label>
              </div>
              {formError && <p role="alert" className="text-red-300 text-xs">{formError}</p>}
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setAddOpen(false)} className="px-4 py-2.5 rounded-xl text-sm text-white/70 hover:bg-white/5">Hủy</button>
                <button type="submit" className="px-4 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-[#03333a] font-bold text-sm">Lưu sản phẩm</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Customers Page ─── */
function CustomersPage() {
  const [customerList, setCustomerList] = useState(() => [...customers, ...readLocalRecords<typeof customers[number]>("salesai.customers.custom")]);
  const [addOpen, setAddOpen] = useState(false);
  const [formError, setFormError] = useState("");
  const [draft, setDraft] = useState({ name: "", email: "", phone: "" });

  
async function addCustomer(e: React.FormEvent) {
  e.preventDefault();
  setFormError("");

  const customerName = draft.name.trim();

  const newCustomer = {
    id: `KH${Date.now()}`,
    name: customerName,
    email: draft.email.trim(),
    phone: draft.phone.trim(),
    orders: 0,
    spent: 0,
    tier: "Bronze",
    joined: new Date().toLocaleDateString("vi-VN", {
      month: "2-digit",
      year: "numeric",
    }),
    avatar: customerName
      .split(/\s+/)
      .map(part => part[0])
      .join("")
      .slice(-2)
      .toUpperCase(),
  };

  try {
    const response = await fetch("/api/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCustomer),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Không thể lưu khách hàng.");
    }

    const savedCustomer = result.data;

    const savedCustomers = readLocalRecords<typeof customers[number]>(
      "salesai.customers.custom"
    );

    localStorage.setItem(
      "salesai.customers.custom",
      JSON.stringify([savedCustomer, ...savedCustomers])
    );

    setCustomerList(current => [savedCustomer, ...current]);
    setDraft({ name: "", email: "", phone: "" });
    setAddOpen(false);
  } catch (error) {
    setFormError(
      error instanceof Error
        ? error.message
        : "Không thể lưu khách hàng."
    );
  }
}


  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 style={{ fontFamily: "Outfit, sans-serif" }} className="text-2xl font-bold text-white">Quản lý khách hàng</h2>
          <p className="text-blue-200/50 text-sm">{customerList.length} khách hàng</p>
        </div>
        <button onClick={() => { setFormError(""); setAddOpen(true); }} className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-[#03333a] font-bold px-4 py-2 rounded-xl text-sm transition-all">
          <Plus size={16} /> Thêm khách hàng
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Tổng khách", val: customerList.length, icon: Users },
          { label: "Khách VIP", val: customerList.filter(c => c.tier === "VIP").length, icon: Star },
          { label: "Tổng chi tiêu", val: fmt(customerList.reduce((a, c) => a + c.spent, 0)), icon: DollarSign },
        ].map(s => (
          <div key={s.label} className="bg-[#03333a] border border-white/8 rounded-xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-yellow-400/10 flex items-center justify-center">
              <s.icon size={16} className="text-yellow-400" />
            </div>
            <div>
              <p className="text-white font-bold text-lg" style={{ fontFamily: "Outfit, sans-serif" }}>{s.val}</p>
              <p className="text-blue-200/50 text-xs">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#03333a] border border-white/8 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8">
                {["Khách hàng", "Liên hệ", "Đơn hàng", "Tổng chi tiêu", "Hạng", "Tham gia"].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 text-blue-200/50 text-xs font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {customerList.map(c => (
                <tr key={c.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar letters={c.avatar} />
                      <div>
                        <p className="text-white font-medium text-sm">{c.name}</p>
                        <p className="text-blue-200/40 text-xs font-mono">{c.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-blue-200/70 text-xs">{c.email}</p>
                    <p className="text-blue-200/40 text-xs">{c.phone}</p>
                  </td>
                  <td className="px-5 py-4 text-white font-medium text-sm">{c.orders}</td>
                  <td className="px-5 py-4 text-yellow-400 font-semibold text-sm">{fmt(c.spent)}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${tierColor(c.tier)}`}>{c.tier}</span>
                  </td>
                  <td className="px-5 py-4 text-blue-200/50 text-xs">{c.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {addOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4">
          <div role="dialog" aria-modal="true" aria-labelledby="add-customer-title" className="w-full max-w-lg bg-[#03333a] border border-white/10 rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <h3 id="add-customer-title" className="text-white font-semibold">Thêm khách hàng</h3>
              <button type="button" aria-label="Đóng" onClick={() => setAddOpen(false)} className="text-white/50 hover:text-white"><X size={18} /></button>
            </div>
            <form onSubmit={addCustomer} className="p-5 space-y-4">
              <label className="block"><span className="block text-blue-200/70 text-xs mb-1.5">Họ và tên</span><input required autoFocus value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-yellow-400/60" placeholder="Nguyễn Văn An" /></label>
              <label className="block"><span className="block text-blue-200/70 text-xs mb-1.5">Email</span><input required type="email" value={draft.email} onChange={e => setDraft({ ...draft, email: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-yellow-400/60" placeholder="khach@example.com" /></label>
              <label className="block"><span className="block text-blue-200/70 text-xs mb-1.5">Số điện thoại</span><input required type="tel" value={draft.phone} onChange={e => setDraft({ ...draft, phone: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-yellow-400/60" placeholder="0912345678" /></label>
              {formError && <p role="alert" className="text-red-300 text-xs">{formError}</p>}
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setAddOpen(false)} className="px-4 py-2.5 rounded-xl text-sm text-white/70 hover:bg-white/5">Hủy</button>
                <button type="submit" className="px-4 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-[#03333a] font-bold text-sm">Lưu khách hàng</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
async function askGroqAI(
  message: string,
  role: UserRole,
  name: string,
  myOrders: typeof orders
): Promise<string> {
  try {
    const response = await fetch("/api/ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: message.trim(),
        role,
        name,
        myOrders,
        products,
      }),
    });

    const data = await response.json();

    if (!response.ok || data.success === false) {
      throw new Error(
        data.error || data.message || "Không thể kết nối AI"
      );
    }

    return data.answer || "AI không trả về câu trả lời.";
  } catch (error) {
    console.error("Lỗi gọi Groq AI:", error);

    return error instanceof Error
      ? `Không thể nhận câu trả lời từ AI: ${error.message}`
      : "Không thể kết nối với Groq AI. Hãy kiểm tra server.";
  }
}
/* ─── AI Page ─── */
function AIPage() {
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState(aiChat);
  const [loading, setLoading] = useState(false);
  const sendingRef = useRef(false);
  

async function sendMsg() {
  const question = chatInput.trim();

  if (!question || sendingRef.current) return;

  sendingRef.current = true;
  setLoading(true);

  setMessages(prev => [
    ...prev,
    {
      role: "user",
      text: question,
    },
  ]);

  setChatInput("");

  try {
    const answer = await askGroqAI(
      question,
      "admin",
      "Admin",
      orders
    );

    setMessages(prev => [
      ...prev,
      {
        role: "ai",
        text: answer,
      },
    ]);
  } catch (error) {
    console.error("Lỗi gọi AI:", error);

    setMessages(prev => [
      ...prev,
      {
        role: "ai",
        text: "Không thể nhận câu trả lời từ AI. Vui lòng thử lại.",
      },
    ]);
  } finally {
    sendingRef.current = false;
    setLoading(false);
  }
}


  return (
    <div className="p-6 space-y-5">
      <div>
        <h2 style={{ fontFamily: "Outfit, sans-serif" }} className="text-2xl font-bold text-white flex items-center gap-2">
          <Brain size={24} className="text-yellow-400" /> AI Insights
        </h2>
        <p className="text-blue-200/50 text-sm">Phân tích thông minh và đề xuất từ AI</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Insights */}
        <div className="space-y-3">
          <h3 className="text-white font-semibold text-sm">Phát hiện & Đề xuất</h3>
          <div className="space-y-3">
            {aiInsights.map((ins, i) => {
              
const colors = ({
  warning: {
    border: "border-amber-400/20",
    bg: "bg-amber-400/8",
    icon: "text-amber-400",
    iconBg: "bg-amber-400/15",
  },
  success: {
    border: "border-emerald-400/20",
    bg: "bg-emerald-400/8",
    icon: "text-emerald-400",
    iconBg: "bg-emerald-400/15",
  },
  info: {
    border: "border-blue-400/20",
    bg: "bg-blue-400/8",
    icon: "text-blue-400",
    iconBg: "bg-blue-400/15",
  },
} as const)[ins.type] ?? {
  border: "border-blue-400/20",
  bg: "bg-blue-400/8",
  icon: "text-blue-400",
  iconBg: "bg-blue-400/15",
};

              return (
                <div key={i} className={`${colors.bg} border ${colors.border} rounded-xl p-4 flex gap-3`}>
                  <div className={`w-8 h-8 rounded-lg ${colors.iconBg} flex items-center justify-center shrink-0`}>
                    <ins.icon size={15} className={colors.icon} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm">{ins.title}</p>
                    <p className="text-blue-200/60 text-xs mt-0.5 leading-relaxed">{ins.desc}</p>
                    <button className={`mt-2 text-xs font-medium ${colors.icon} flex items-center gap-1 hover:opacity-80 transition-opacity`}>
                      {ins.action} <ChevronRight size={11} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chat */}
        <div className="bg-[#03333a] border border-white/8 rounded-2xl flex flex-col" style={{ height: 520 }}>
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/8">
            <div className="w-8 h-8 rounded-xl bg-yellow-400/15 flex items-center justify-center">
              <Brain size={15} className="text-yellow-400" />
            </div>
            <div>
              <p className="text-white font-medium text-sm">SalesBot AI</p>
              <p className="text-emerald-400 text-xs flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />Đang hoạt động</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                  m.role === "user"
                    ? "bg-yellow-400 text-[#03333a] font-medium rounded-tr-sm"
                    : "bg-white/8 text-blue-100/90 border border-white/10 rounded-tl-sm"
                }`}>
                  {m.role === "user" ? (
  m.text
) : (
  <ReactMarkdown
    remarkPlugins={[remarkGfm]}
    components={{
      p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
      strong: ({ children }) => (
        <strong className="font-bold text-white">{children}</strong>
      ),
      ul: ({ children }) => (
        <ul className="list-disc pl-4 mb-2">{children}</ul>
      ),
      ol: ({ children }) => (
        <ol className="list-decimal pl-4 mb-2">{children}</ol>
      ),
      li: ({ children }) => <li className="mb-1">{children}</li>,
      table: ({ children }) => (
        <div className="overflow-x-auto my-2">
          <table className="w-full border-collapse text-left">{children}</table>
        </div>
      ),
      th: ({ children }) => (
        <th className="border border-white/20 px-2 py-1 font-bold text-white">
          {children}
        </th>
      ),
      td: ({ children }) => (
        <td className="border border-white/20 px-2 py-1">{children}</td>
      ),
    }}
  >
    {m.text.replace(/\\([*_`|])/g, "$1")}
  </ReactMarkdown>
)}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/8 border border-white/10 rounded-2xl rounded-tl-sm px-4 py-3 text-xs text-blue-200/60 flex items-center gap-2">
                  <RefreshCw size={11} className="animate-spin" /> AI đang phân tích...
                </div>
              </div>
            )}
          </div>

          <div className="p-3 border-t border-white/8 flex gap-2">
            <input
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMsg()}
              placeholder="Hỏi AI về dữ liệu bán hàng..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs placeholder-white/30 focus:outline-none focus:border-yellow-400/50 transition-colors"
            />
            <button onClick={sendMsg} className="bg-yellow-400 hover:bg-yellow-300 text-[#03333a] px-3 py-2 rounded-xl transition-all">
              <ArrowUpRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Settings Page ─── */
function SettingsPage({
  name,
  role,
  darkMode,
  onToggleTheme,
}: {
  name: string;
  role: UserRole;
  darkMode: boolean;
  onToggleTheme: () => void;
}) {
  const [notif, setNotif] = useState(true);
  const [aiAlerts, setAiAlerts] = useState(true);
 

  function Toggle({ val, set }: { val: boolean; set: (v: boolean) => void }) {
    return (
      <button onClick={() => set(!val)} className={`w-11 h-6 rounded-full relative transition-all ${val ? "bg-yellow-400" : "bg-white/15"}`}>
        <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${val ? "left-5.5" : "left-0.5"}`} style={{ left: val ? 22 : 2 }} />
      </button>
    );
  }

  return (
    <div className="p-6 space-y-5 max-w-2xl">
      <div>
        <h2 style={{ fontFamily: "Outfit, sans-serif" }} className="text-2xl font-bold text-white">Cài đặt</h2>
        <p className="text-blue-200/50 text-sm">Quản lý tài khoản và tùy chọn hệ thống</p>
      </div>

      <div className="bg-[#03333a] border border-white/8 rounded-2xl p-5">
        <h3 className="text-white font-semibold text-sm mb-4">Thông tin tài khoản</h3>
        <div className="flex items-center gap-4 mb-5">
          <Avatar letters={name.slice(0, 2).toUpperCase()} size="lg" />
          <div>
            <p className="text-white font-semibold">{name}</p>
            <p className="text-blue-200/50 text-sm">{roleLabel(role)} • SalesAI Pro</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Họ và tên", val: name },
            { label: "Email", val: "admin@salesai.vn" },
            { label: "Điện thoại", val: "0901234567" },
            { label: "Công ty", val: "SalesAI Pro Vietnam" },
          ].map(f => (
            <div key={f.label}>
              <label className="text-blue-200/50 text-xs block mb-1">{f.label}</label>
              <input defaultValue={f.val} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-yellow-400/50 transition-colors" />
            </div>
          ))}
        </div>
        <button className="mt-4 bg-yellow-400 hover:bg-yellow-300 text-[#03333a] font-bold px-4 py-2 rounded-xl text-sm transition-all">Lưu thay đổi</button>
      </div>

      <div className="bg-[#03333a] border border-white/8 rounded-2xl p-5 space-y-4">
        <div>
          <h3 className="text-white font-semibold text-sm">Phân quyền truy cập</h3>
          <p className="text-blue-200/50 text-xs mt-1">Quyền hiện tại: <span className="text-yellow-400 font-semibold">{roleLabel(role)}</span></p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[
            ["Tổng quan", canAccess(role, "dashboard")], ["Đơn hàng", canAccess(role, "orders")],
            ["Sản phẩm", canAccess(role, "products")], ["Khách hàng", canAccess(role, "customers")],
            ["AI Insights", canAccess(role, "ai")], ["Cài đặt", canAccess(role, "settings")],
          ].map(([label, enabled]) => (
            <div key={String(label)} className={`flex items-center gap-2 px-3 py-2 rounded-xl ${enabled ? "bg-emerald-500/10 text-emerald-300" : "bg-white/5 text-white/30"}`}>
              <ShieldCheck size={14} /> <span className="text-xs">{String(label)}</span>
              <span className="ml-auto text-[10px]">{enabled ? "Cho phép" : "Khóa"}</span>
            </div>
          ))}
        </div>
        {role === "admin" && <p className="text-blue-200/40 text-xs">Admin có toàn quyền. Nhân viên không được truy cập Cài đặt hệ thống; khách hàng chỉ sử dụng khu vực mua sắm.</p>}
      </div>

      <div className="bg-[#03333a] border border-white/8 rounded-2xl p-5 space-y-4">
        <h3 className="text-white font-semibold text-sm">Thông báo & AI</h3>
        {[
          { label: "Thông báo đơn hàng mới", sub: "Nhận thông báo khi có đơn hàng mới", val: notif, set: setNotif },
          { label: "Cảnh báo AI", sub: "AI tự động cảnh báo khi phát hiện bất thường", val: aiAlerts, set: setAiAlerts },
          { label: "Giao diện tối", sub: "Sử dụng giao diện nền tối", val: darkMode, set: () => onToggleTheme() },
        ].map(s => (
          <div key={s.label} className="flex items-center justify-between">
            <div>
              <p className="text-white text-sm font-medium">{s.label}</p>
              <p className="text-blue-200/50 text-xs">{s.sub}</p>
            </div>
            <Toggle val={s.val} set={s.set} />
          </div>
        ))}
      </div>

    </div>
  );
}

/* ─── Floating AI Chat Widget (dùng chung cho admin & khách hàng) ─── */
function AIChatWidget({ role, name, myOrders }: { role: UserRole; name: string; myOrders: typeof orders }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMsg[]>([
    { role: "ai", text: role === "admin" ? "Xin chào! Hỏi tôi bất cứ điều gì về doanh thu, tồn kho hay đơn hàng." : role === "staff" ? `Xin chào ${name}! Tôi hỗ trợ đơn hàng, tồn kho, sản phẩm và khách hàng.` : `Xin chào ${name}! Tôi có thể giúp bạn tra cứu đơn hàng, sản phẩm hoặc chính sách mua hàng.` },
  ]);
  const [loading, setLoading] = useState(false);

  async function send(text?: string) {
  const q = (text ?? input).trim();

  if (!q || loading) return;

  setMessages(prev => [
    ...prev,
    {
      role: "user",
      text: q,
    },
  ]);

  setInput("");
  setLoading(true);

  const answer = await askGroqAI(
    q,
    role,
    name,
    myOrders
  );

  setMessages(prev => [
    ...prev,
    {
      role: "ai",
      text: answer,
    },
  ]);

  setLoading(false);
}

  const quickAsks = role === "admin"
    ? ["Doanh thu tháng này?", "Sản phẩm sắp hết hàng?", "Khách hàng VIP"]
    : role === "staff"
      ? ["Sản phẩm sắp hết hàng?", "Đơn hàng mới?", "Khách hàng VIP"]
    : ["Đơn hàng của tôi", "Chính sách đổi trả", "Vận chuyển mất bao lâu?"];

  return (
    <>
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full bg-yellow-400 hover:bg-yellow-300 shadow-2xl shadow-black/40 flex items-center justify-center transition-all"
        aria-label="Trợ lý AI"
      >
        {open ? <X size={22} className="text-[#03333a]" /> : <Brain size={22} className="text-[#03333a]" />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-5 z-50 w-[340px] max-w-[90vw] h-[460px] bg-[#03333a] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/8 bg-[#064d58]">
            <div className="w-8 h-8 rounded-xl bg-yellow-400/15 flex items-center justify-center">
              <Brain size={15} className="text-yellow-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm">Trợ lý AI</p>
              <p className="text-emerald-400 text-xs flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />Đang hoạt động</p>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/40 hover:text-white"><X size={16} /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] px-3 py-2 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                  m.role === "user"
                    ? "bg-yellow-400 text-[#03333a] font-medium rounded-tr-sm"
                    : "bg-white/8 text-blue-100/90 border border-white/10 rounded-tl-sm"
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/8 border border-white/10 rounded-2xl rounded-tl-sm px-3.5 py-2.5 text-xs text-blue-200/60 flex items-center gap-2">
                  <RefreshCw size={11} className="animate-spin" /> Đang trả lời...
                </div>
              </div>
            )}
          </div>

          {messages.length < 3 && (
            <div className="px-3 pb-2 flex flex-wrap gap-1.5">
              {quickAsks.map(q => (
                <button key={q} onClick={() => send(q)} className="text-xs bg-white/5 hover:bg-white/10 border border-white/10 text-blue-200/70 px-2.5 py-1 rounded-full transition-colors">
                  {q}
                </button>
              ))}
            </div>
          )}

          <div className="p-3 border-t border-white/8 flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
              placeholder="Nhập câu hỏi..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs placeholder-white/30 focus:outline-none focus:border-yellow-400/50 transition-colors"
            />
            <button onClick={() => send()} className="bg-yellow-400 hover:bg-yellow-300 text-[#03333a] px-3 py-2 rounded-xl transition-all shrink-0">
              <Send size={14} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

/* ─── Customer: Sidebar ─── */
const custNavItems: { id: CustPage; label: string; icon: React.ElementType }[] = [
  { id: "home", label: "Trang chủ", icon: Home },
  { id: "catalog", label: "Sản phẩm", icon: ShoppingBag },
  { id: "orders", label: "Đơn hàng của tôi", icon: Package },
  { id: "cart", label: "Giỏ hàng", icon: ShoppingCart },
  { id: "ai", label: "Hỗ trợ AI", icon: Brain },
  { id: "account", label: "Tài khoản", icon: User },
];

function CustomerSidebar({ page, onPage, collapsed, name, cartCount, onLogout }: {
  page: CustPage; onPage: (p: CustPage) => void; collapsed: boolean; name: string; cartCount: number; onLogout: () => void;
}) {
  return (
    <aside className={`h-full bg-[#03333a] border-l border-white/8 flex flex-col transition-all duration-300 ${collapsed ? "w-16" : "w-60"} shrink-0`}>
      <div className={`flex items-center gap-3 p-4 border-b border-white/8 ${collapsed ? "justify-center" : ""}`}>
        <div className="w-9 h-9 rounded-xl bg-yellow-400 flex items-center justify-center shrink-0">
          <Zap size={18} className="text-[#03333a]" fill="currentColor" />
        </div>
        {!collapsed && <span style={{ fontFamily: "Outfit, sans-serif" }} className="text-lg font-bold text-white">SalesAI Pro</span>}
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-hide">
        {custNavItems.map(({ id, label, icon: Icon }) => {
          const active = page === id;
          return (
            <button
              key={id}
              onClick={() => onPage(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium relative ${
                active ? "bg-yellow-400 text-[#03333a]" : "text-blue-200/60 hover:bg-white/6 hover:text-white"
              } ${collapsed ? "justify-center" : ""}`}
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && <span>{label}</span>}
              {id === "cart" && cartCount > 0 && (
                <span className={`bg-red-500 text-white text-xs font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center ${collapsed ? "absolute -top-1 -right-1 w-4 h-4 text-[9px]" : "ml-auto"}`} style={collapsed ? {} : { minWidth: 18, height: 18 }}>
                  {cartCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className={`p-3 border-t border-white/8 ${collapsed ? "flex flex-col items-center gap-2" : "space-y-2"}`}>
        {collapsed ? (
          <Avatar letters={name.slice(0, 2).toUpperCase()} size="sm" />
        ) : (
          <div className="flex items-center gap-3 px-2 py-2">
            <Avatar letters={name.slice(0, 2).toUpperCase()} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{name}</p>
              <p className="text-blue-200/50 text-xs">Khách hàng</p>
            </div>
          </div>
        )}
        <button onClick={onLogout} aria-label="Đăng xuất" title={collapsed ? "Đăng xuất" : undefined} className={`flex items-center gap-3 rounded-xl text-sm font-medium text-red-300 hover:bg-red-500/10 transition-colors ${collapsed ? "w-10 h-10 justify-center" : "w-full px-3 py-2"}`}>
          <LogOut size={16} />{!collapsed && <span>Đăng xuất</span>}
        </button>
      </div>
    </aside>
  );
}

/* ─── Customer: Trang chủ ─── */
function CustomerHomePage({ name, onAddToCart, onNavigate }: {
  name: string; onAddToCart: (id: string) => void; onNavigate: (p: CustPage) => void;
}) {
  const featured = [...products].sort((x, y) => y.sold - x.sold).slice(0, 8);
  return (
    <div className="p-6 space-y-6">
      <div className="bg-gradient-to-br from-[#064d58] via-[#0a6472] to-[#03333a] border border-white/10 rounded-3xl p-8 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-yellow-400/10 blur-3xl" />
        <HeroArt className="hidden md:block absolute right-4 top-1/2 -translate-y-1/2 w-72 xl:w-96 opacity-95" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/20 rounded-full px-4 py-1.5 text-yellow-400 text-sm font-medium mb-4 w-fit">
            <Sparkles size={14} /> Ưu đãi dành cho bạn
          </div>
          <h1 style={{ fontFamily: "Outfit, sans-serif" }} className="text-3xl font-bold text-white mb-2">Chào mừng trở lại, {name.split(" ").pop()}!</h1>
          <p className="text-blue-200/70 mb-5 max-w-lg">Khám phá các sản phẩm công nghệ mới nhất, được AI gợi ý riêng cho bạn dựa trên lịch sử mua sắm.</p>
          <button onClick={() => onNavigate("catalog")} className="bg-yellow-400 hover:bg-yellow-300 text-[#03333a] font-bold px-5 py-2.5 rounded-xl text-sm transition-all flex items-center gap-2">
            Mua sắm ngay <ArrowUpRight size={15} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {categoryData.slice(0, 4).map(c => (
          <div key={c.name} className="bg-[#03333a] border border-white/8 rounded-2xl p-4 flex items-center gap-3 hover:border-yellow-400/20 transition-colors cursor-pointer" onClick={() => onNavigate("catalog")}>
            <CategoryArt name={c.name} color={c.color} className="w-12 h-12 shrink-0" />
            <div>
              <p className="text-white text-sm font-semibold">{c.name}</p>
              <p className="text-blue-200/50 text-xs">{products.filter(p => p.category === c.name).length} sản phẩm</p>
            </div>
          </div>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 style={{ fontFamily: "Outfit, sans-serif" }} className="text-white font-semibold text-lg">Sản phẩm nổi bật</h3>
          <button onClick={() => onNavigate("catalog")} className="text-yellow-400 text-xs font-medium flex items-center gap-1 hover:text-yellow-300 transition-colors">
            Xem tất cả <ChevronRight size={13} />
          </button>
        </div>
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {featured.map(p => (
            <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product: p, onAddToCart }: { product: typeof products[number]; onAddToCart: (id: string) => void }) {
  return (
    <div className="bg-[#03333a] border border-white/8 rounded-2xl p-4 hover:border-yellow-400/20 transition-colors flex flex-col">
      <div className="w-full aspect-square rounded-xl overflow-hidden border border-yellow-400/20 mb-3 relative">
        <ProductImage id={p.id} src={p.img} category={p.category} className="w-full h-full" />
        {p.trend.startsWith("+") && (
          <span className="absolute top-2 left-2 bg-yellow-400 text-[#03333a] text-[10px] font-bold px-2 py-0.5 rounded-full">Hot {p.trend}</span>
        )}
      </div>
      <p className="text-white font-semibold text-sm leading-snug line-clamp-2">{p.name}</p>
      <p className="text-blue-200/40 text-xs mt-1 flex items-center gap-1"><Star size={11} className="text-yellow-400" /> {p.rating} · Đã bán {p.sold}</p>
      <div className="flex items-center justify-between mt-3">
        <p className="text-yellow-400 font-bold text-sm">{fmt(p.price)}</p>
        {p.stock < 20 && <span className="text-red-400 text-xs">Sắp hết</span>}
      </div>
      <button
        onClick={() => onAddToCart(p.id)}
        className="mt-3 w-full bg-yellow-400 hover:bg-yellow-300 text-[#03333a] font-bold py-2 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5"
      >
        <ShoppingCart size={13} /> Thêm vào giỏ
      </button>
    </div>
  );
}

/* ─── Customer: Sản phẩm ─── */
function CustomerCatalogPage({ onAddToCart }: { onAddToCart: (id: string) => void }) {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("Tất cả");
  const cats = ["Tất cả", ...Array.from(new Set(products.map(p => p.category)))];
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) && (cat === "Tất cả" || p.category === cat));
  return (
    <div className="p-6 space-y-5">
      <div>
        <h2 style={{ fontFamily: "Outfit, sans-serif" }} className="text-2xl font-bold text-white">Sản phẩm</h2>
        <p className="text-blue-200/50 text-sm">{products.length} sản phẩm đang có sẵn</p>
      </div>
      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm sản phẩm..." className="w-full bg-[#03333a] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-white text-sm placeholder-white/30 focus:outline-none focus:border-yellow-400/50 transition-colors" />
      </div>
      <div className="flex flex-wrap gap-2">
        {cats.map(c => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              cat === c ? "bg-yellow-400 text-[#03333a]" : "bg-white/5 border border-white/10 text-blue-200/70 hover:text-white"
            }`}
          >
            {c}
          </button>
        ))}
      </div>
      {filtered.length === 0 && <p className="text-blue-200/50 text-sm">Không tìm thấy sản phẩm phù hợp.</p>}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {filtered.map(p => (
          <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} />
        ))}
      </div>
    </div>
  );
}

/* ─── Customer: Đơn hàng của tôi ─── */
function CustomerOrdersPage({ myOrders, onNavigate, onCancel }: {
  myOrders: SalesOrder[]; onNavigate: (p: CustPage) => void; onCancel: (id: string) => boolean;
}) {
  const savedOrderIds = new Set(readLocalRecords<SalesOrder>(orderStorageKey).map(order => order.id));
  return (
    <div className="p-6 space-y-5">
      <div>
        <h2 style={{ fontFamily: "Outfit, sans-serif" }} className="text-2xl font-bold text-white">Đơn hàng của tôi</h2>
        <p className="text-blue-200/50 text-sm">{myOrders.length} đơn hàng</p>
      </div>

      {myOrders.length === 0 ? (
        <div className="bg-[#03333a] border border-white/8 rounded-2xl p-10 flex flex-col items-center text-center gap-3">
          <Package size={32} className="text-blue-200/30" />
          <p className="text-white font-medium">Bạn chưa có đơn hàng nào</p>
          <p className="text-blue-200/50 text-sm">Hãy khám phá sản phẩm và đặt hàng đầu tiên của bạn.</p>
          <button onClick={() => onNavigate("catalog")} className="bg-yellow-400 hover:bg-yellow-300 text-[#03333a] font-bold px-4 py-2 rounded-xl text-sm transition-all mt-1">Mua sắm ngay</button>
        </div>
      ) : (
        <div className="space-y-3">
          {myOrders.map(o => (
            <div key={o.id} className="bg-[#03333a] border border-white/8 rounded-2xl p-4 flex flex-wrap items-center gap-3 sm:gap-4">
              <div className="w-11 h-11 rounded-xl bg-yellow-400/10 flex items-center justify-center shrink-0">
                <Package size={18} className="text-yellow-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-white font-medium text-sm truncate">{o.product}</p>
                </div>
                <p className="text-blue-200/40 text-xs font-mono mt-0.5">{o.id} · {o.date}</p>
              </div>
              <p className="text-yellow-400 font-semibold text-sm shrink-0">{fmt(o.amount)}</p>
              <span className={`inline-flex whitespace-nowrap px-2.5 py-1 rounded-full text-xs font-medium shrink-0 ${statusColor(o.status)}`}>{o.status}</span>
              {savedOrderIds.has(o.id) && isPendingOrderStatus(o.status) && (
                <button onClick={() => onCancel(o.id)} className="inline-flex items-center gap-1.5 text-red-300 hover:text-red-200 text-xs font-semibold shrink-0 whitespace-nowrap">
                  <X size={14} /> Hủy đơn
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Customer: Giỏ hàng ─── */
function CustomerCartPage({ cart, onUpdateQty, onRemove, onCheckout, onNavigate }: {
  cart: CartItem[];
  onUpdateQty: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
  onNavigate: (p: CustPage) => void;
}) {
  const rows = cart.map(i => ({ item: i, product: products.find(p => p.id === i.productId)! })).filter(r => r.product);
  const total = rows.reduce((sum, r) => sum + r.product.price * r.item.qty, 0);

  return (
    <div className="p-6 space-y-5">
      <div>
        <h2 style={{ fontFamily: "Outfit, sans-serif" }} className="text-2xl font-bold text-white">Giỏ hàng</h2>
        <p className="text-blue-200/50 text-sm">{rows.length} sản phẩm</p>
      </div>

      {rows.length === 0 ? (
        <div className="bg-[#03333a] border border-white/8 rounded-2xl p-10 flex flex-col items-center text-center gap-3">
          <ShoppingCart size={32} className="text-blue-200/30" />
          <p className="text-white font-medium">Giỏ hàng của bạn đang trống</p>
          <button onClick={() => onNavigate("catalog")} className="bg-yellow-400 hover:bg-yellow-300 text-[#03333a] font-bold px-4 py-2 rounded-xl text-sm transition-all mt-1">Tiếp tục mua sắm</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <div className="xl:col-span-2 space-y-3">
            {rows.map(({ item, product: p }) => (
              <div key={p.id} className="bg-[#03333a] border border-white/8 rounded-2xl p-4 flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden border border-yellow-400/20 shrink-0">
                  <ProductImage id={p.id} src={p.img} category={p.category} className="w-full h-full" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm truncate">{p.name}</p>
                  <p className="text-yellow-400 font-semibold text-sm mt-0.5">{fmt(p.price)}</p>
                </div>
                <div className="flex items-center gap-2 bg-white/5 rounded-xl p-1 shrink-0">
                  <button onClick={() => onUpdateQty(p.id, -1)} className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/70 transition-colors"><Minus size={13} /></button>
                  <span className="text-white text-sm w-5 text-center">{item.qty}</span>
                  <button onClick={() => onUpdateQty(p.id, 1)} className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/70 transition-colors"><Plus size={13} /></button>
                </div>
                <button onClick={() => onRemove(p.id)} className="text-red-400/70 hover:text-red-400 transition-colors shrink-0"><Trash2 size={16} /></button>
              </div>
            ))}
          </div>

          <div className="bg-[#03333a] border border-white/8 rounded-2xl p-5 h-fit space-y-4">
            <h3 className="text-white font-semibold text-sm">Tóm tắt đơn hàng</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-blue-200/60"><span>Tạm tính</span><span className="text-white">{fmt(total)}</span></div>
              <div className="flex justify-between text-blue-200/60"><span>Vận chuyển</span><span className="text-emerald-400">Miễn phí</span></div>
            </div>
            <div className="border-t border-white/10 pt-3 flex justify-between">
              <span className="text-white font-semibold">Tổng cộng</span>
              <span className="text-yellow-400 font-bold text-lg">{fmt(total)}</span>
            </div>
            <button onClick={onCheckout} className="w-full bg-yellow-400 hover:bg-yellow-300 text-[#03333a] font-bold py-3 rounded-xl text-sm transition-all">
              Đặt hàng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Customer: Hỗ trợ AI ─── */
function CustomerAIPage({ name, myOrders }: { name: string; myOrders: typeof orders }) {
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<ChatMsg[]>([
    { role: "ai", text: `Xin chào ${name}! Tôi là trợ lý AI hỗ trợ mua sắm. Bạn có thể hỏi tôi về đơn hàng, sản phẩm, giá cả, tồn kho hay chính sách mua hàng.` },
  ]);
  const [loading, setLoading] = useState(false);

  const sendingRef = useRef(false);

  async function sendMsg(text?: string) {
  const q = (text ?? chatInput).trim();

  if (!q || loading) return;

  setMessages(prev => [
    ...prev,
    { role: "user", text: q }
  ]);

  setChatInput("");
  setLoading(true);

  try {
    const response = await fetch("/api/ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: q,
        role: "customer",
        name,
        myOrders,
        products,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || "AI backend error");
    }

    setMessages(prev => [
      ...prev,
      {
        role: "ai",
        text:
          data.answer ||
          data.reply ||
          "AI chưa trả về câu trả lời.",
      },
    ]);
  } catch (error) {
    console.error("AI error:", error);

    setMessages(prev => [
      ...prev,
      {
        role: "ai",
        text: "❌ Không thể kết nối với AI server.",
      },
    ]);
  } finally {
    setLoading(false);
  }
}

  const faqs = [
    { label: "Chính sách đổi trả", icon: RefreshCw },
    { label: "Thời gian vận chuyển", icon: Package },
    { label: "Phương thức thanh toán", icon: DollarSign },
    { label: "Chính sách bảo hành", icon: ShieldCheck },
    { label: "Đơn hàng của tôi", icon: ShoppingCart },
  ];

  return (
    <div className="p-6 space-y-5">
      <div>
        <h2 style={{ fontFamily: "Outfit, sans-serif" }} className="text-2xl font-bold text-white flex items-center gap-2">
          <Brain size={24} className="text-yellow-400" /> Hỗ trợ AI
        </h2>
        <p className="text-blue-200/50 text-sm">Trợ lý AI sẵn sàng giải đáp mọi thắc mắc của bạn</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="space-y-2">
          <h3 className="text-white font-semibold text-sm mb-1">Câu hỏi thường gặp</h3>
          {faqs.map(f => (
            <button
              key={f.label}
              onClick={() => sendMsg(f.label)}
              className="w-full flex items-center gap-3 bg-[#03333a] border border-white/8 hover:border-yellow-400/30 rounded-xl p-3.5 text-left transition-colors"
            >
              <f.icon size={15} className="text-yellow-400 shrink-0" />
              <span className="text-white text-sm">{f.label}</span>
              <ChevronRight size={13} className="text-white/30 ml-auto shrink-0" />
            </button>
          ))}
        </div>

        <div className="xl:col-span-2 bg-[#03333a] border border-white/8 rounded-2xl flex flex-col" style={{ height: 520 }}>
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/8">
            <div className="w-8 h-8 rounded-xl bg-yellow-400/15 flex items-center justify-center">
              <Brain size={15} className="text-yellow-400" />
            </div>
            <div>
              <p className="text-white font-medium text-sm">Trợ lý mua sắm AI</p>
              <p className="text-emerald-400 text-xs flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />Đang hoạt động</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                  m.role === "user"
                    ? "bg-yellow-400 text-[#03333a] font-medium rounded-tr-sm"
                    : "bg-white/8 text-blue-100/90 border border-white/10 rounded-tl-sm"
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/8 border border-white/10 rounded-2xl rounded-tl-sm px-4 py-3 text-xs text-blue-200/60 flex items-center gap-2">
                  <RefreshCw size={11} className="animate-spin" /> AI đang trả lời...
                </div>
              </div>
            )}
          </div>

          <div className="p-3 border-t border-white/8 flex gap-2">
            <input
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMsg()}
              placeholder="Hỏi AI về sản phẩm, đơn hàng..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs placeholder-white/30 focus:outline-none focus:border-yellow-400/50 transition-colors"
            />
            <button onClick={() => sendMsg()} className="bg-yellow-400 hover:bg-yellow-300 text-[#03333a] px-3 py-2 rounded-xl transition-all">
              <ArrowUpRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Customer: Tài khoản ─── */
function CustomerAccountPage({ name }: { name: string }) {
  return (
    <div className="p-6 space-y-5 max-w-2xl">
      <div>
        <h2 style={{ fontFamily: "Outfit, sans-serif" }} className="text-2xl font-bold text-white">Tài khoản</h2>
        <p className="text-blue-200/50 text-sm">Quản lý thông tin cá nhân của bạn</p>
      </div>

      <div className="bg-[#03333a] border border-white/8 rounded-2xl p-5">
        <div className="flex items-center gap-4 mb-5">
          <Avatar letters={name.slice(0, 2).toUpperCase()} size="lg" />
          <div>
            <p className="text-white font-semibold">{name}</p>
            <p className="text-blue-200/50 text-sm">Khách hàng • SalesAI Pro</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Họ và tên", val: name, icon: User },
            { label: "Email", val: `${name.split(" ").pop()?.toLowerCase()}@email.com`, icon: MessageSquare },
            { label: "Điện thoại", val: "0912345678", icon: Send },
            { label: "Địa chỉ", val: "TP. Hồ Chí Minh, Việt Nam", icon: MapPin },
          ].map(f => (
            <div key={f.label}>
              <label className="text-blue-200/50 text-xs block mb-1">{f.label}</label>
              <input defaultValue={f.val} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-yellow-400/50 transition-colors" />
            </div>
          ))}
        </div>
        <button className="mt-4 bg-yellow-400 hover:bg-yellow-300 text-[#03333a] font-bold px-4 py-2 rounded-xl text-sm transition-all">Lưu thay đổi</button>
      </div>

    </div>
  );
}

/* ─── Admin Shell ─── */
function AdminShell({ name, onLogout }: { name: string; onLogout: () => void }) {
  const role: UserRole = "admin";

  const [darkMode, setDarkMode] = useState(() => {
    try {
      return localStorage.getItem("goshop-theme") !== "light";
    } catch {
      return true;
    }
  });

  function toggleTheme() {
    setDarkMode(current => {
      const next = !current;
      try {
        localStorage.setItem("goshop-theme", next ? "dark" : "light");
      } catch {
        // Vẫn cho phép đổi giao diện nếu trình duyệt không hỗ trợ lưu.
      }
      return next;
    });
  }

  const [page, setPage] = useState<Page>("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const { allOrders, updatePendingOrder } = useSharedOrders();

  const notifications = [
    { icon: ShoppingCart, text: "Đơn hàng #DH-2024008 mới từ Trần Văn E", time: "2 phút trước", type: "order" },
    { icon: Brain, text: "AI: Hàng tồn kho Apple Watch sắp hết", time: "15 phút trước", type: "ai" },
    { icon: CheckCircle, text: "Đơn hàng #DH-2024005 đã giao thành công", time: "1 giờ trước", type: "success" },
    { icon: AlertCircle, text: "Thanh toán đơn #DH-2024003 cần xác nhận", time: "2 giờ trước", type: "warning" },
  ];

  return (
    <div
  data-theme={darkMode ? "dark" : "light"}
  className={`h-full flex overflow-hidden ${
    darkMode ? "bg-[#02171a] text-white" : "bg-slate-100 text-slate-900"
  }`}
>
      <Sidebar page={page} onPage={setPage} collapsed={sidebarCollapsed} name={name} role={role} onLogout={onLogout} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="flex items-center gap-3 px-5 py-3 bg-[#03333a]/80 backdrop-blur border-b border-white/8 shrink-0">
          <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="text-white/50 hover:text-white transition-colors">
            <Menu size={18} />
          </button>
          <div className="flex-1 flex items-center gap-3">
            <div className="relative max-w-sm flex-1">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input placeholder="Tìm kiếm..." className="w-full bg-white/5 border border-white/8 rounded-xl pl-8 pr-3 py-1.5 text-white text-sm placeholder-white/30 focus:outline-none focus:border-yellow-400/40 transition-colors" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <button onClick={() => setNotifOpen(!notifOpen)} className="relative w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
                <Bell size={15} className="text-white/70" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-yellow-400 rounded-full" />
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-10 w-80 max-w-[calc(100vw-2rem)] bg-[#064d58] border border-white/10 rounded-2xl shadow-2xl z-[100]">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/8">
                    <p className="text-white font-semibold text-sm">Thông báo</p>
                    <button onClick={() => setNotifOpen(false)} className="text-white/40 hover:text-white"><X size={14} /></button>
                  </div>
                  <div className="py-1">
                    {notifications.map((n, i) => (
                      <div key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-white/5 transition-colors cursor-pointer">
                        <n.icon size={14} className="text-yellow-400 mt-0.5 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-xs leading-relaxed">{n.text}</p>
                          <p className="text-blue-200/40 text-xs mt-0.5">{n.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <Avatar letters={name.slice(0, 2).toUpperCase()} size="sm" />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {page === "dashboard" && <DashboardPage />}
          {page === "orders" && <OrdersPage allOrders={allOrders} canConfirmOrders={false} onUpdateOrder={updatePendingOrder} />}
          {page === "products" && <ProductsPage />}
          {page === "customers" && <CustomersPage />}
          {page === "ai" && <AIPage />}
          {page === "settings" && role === "admin" && (
  <SettingsPage
    name={name}
    role={role}
    darkMode={darkMode}
    onToggleTheme={toggleTheme}
  />
)}
        </main>
      </div>
      <AIChatWidget role={role} name={name} myOrders={orders} />
    </div>
  );
}

function StaffDashboardPage({ onNavigate, allOrders }: { onNavigate: (page: Page) => void; allOrders: typeof orders }) {
  const pendingOrders = allOrders.filter(order => isPendingOrderStatus(order.status) || order.status === "Đang vận chuyển" || order.status === "Đang giao");
  const lowStockProducts = products.filter(product => product.stock < 20);

  return (
    <div className="p-6 space-y-6">
      <div>
        <p className="text-emerald-300 text-xs font-semibold tracking-wider">TRUNG TÂM VẬN HÀNH</p>
        <h1 style={{ fontFamily: "Outfit, sans-serif" }} className="text-white text-2xl font-bold mt-1">Công việc cần xử lý</h1>
        <p className="text-blue-200/50 text-sm mt-1">Theo dõi đơn hàng, sản phẩm và hỗ trợ khách hàng trong ca làm việc.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Đơn cần xử lý", value: String(pendingOrders.length), icon: ShoppingCart, color: "text-amber-300" },
          { label: "Sản phẩm sắp hết", value: String(lowStockProducts.length), icon: Package, color: "text-red-300" },
          { label: "Khách hàng cần hỗ trợ", value: "6", icon: Users, color: "text-cyan-300" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-[#03333a] border border-white/8 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center"><Icon size={19} className={color} /></div>
            <div><p className="text-blue-200/50 text-xs">{label}</p><p className="text-white text-2xl font-bold mt-1">{value}</p></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <section className="bg-[#03333a] border border-white/8 rounded-2xl p-5">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div><h2 className="text-white font-semibold">Đơn hàng đang chờ</h2><p className="text-blue-200/40 text-xs mt-1">Ưu tiên cập nhật trạng thái giao hàng</p></div>
            <button onClick={() => onNavigate("orders")} className="text-emerald-300 text-xs font-semibold hover:text-emerald-200">Mở đơn hàng</button>
          </div>
          <div className="space-y-2">
            {pendingOrders.slice(0, 4).map(order => (
              <div key={order.id} className="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-400/10 flex items-center justify-center text-emerald-300"><ShoppingBag size={16} /></div>
                <div className="flex-1 min-w-0"><p className="text-white text-sm font-medium truncate">{order.id} · {order.customer}</p><p className="text-blue-200/40 text-xs mt-0.5 truncate">{order.product}</p></div>
                <span className={`text-xs shrink-0 whitespace-nowrap ${isPendingOrderStatus(order.status) ? "text-amber-300" : "text-blue-300"}`}>{order.status}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[#03333a] border border-white/8 rounded-2xl p-5">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div><h2 className="text-white font-semibold">Cần bổ sung tồn kho</h2><p className="text-blue-200/40 text-xs mt-1">Sản phẩm còn dưới 20 chiếc</p></div>
            <button onClick={() => onNavigate("products")} className="text-emerald-300 text-xs font-semibold hover:text-emerald-200">Mở kho hàng</button>
          </div>
          <div className="space-y-2">
            {lowStockProducts.slice(0, 4).map(product => (
              <div key={product.id} className="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-3">
                <div className="w-9 h-9 rounded-lg bg-red-400/10 flex items-center justify-center text-red-300"><AlertCircle size={16} /></div>
                <div className="flex-1 min-w-0"><p className="text-white text-sm font-medium truncate">{product.name}</p><p className="text-blue-200/40 text-xs mt-0.5">Mã {product.id}</p></div>
                <span className="text-red-300 text-xs shrink-0">Còn {product.stock}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="bg-emerald-400/5 border border-emerald-300/15 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><p className="text-white font-semibold">Cần hỗ trợ khách hàng?</p><p className="text-blue-200/50 text-sm mt-1">Tra cứu thông tin khách hàng và lịch sử mua hàng.</p></div>
        <button onClick={() => onNavigate("customers")} className="bg-emerald-300 hover:bg-emerald-200 text-[#03333a] font-bold px-4 py-2.5 rounded-xl text-sm">Danh sách khách hàng</button>
      </section>
    </div>
  );
}

function StaffShell({ name, onLogout }: { name: string; onLogout: () => void }) {
  const [page, setPage] = useState<Page>("dashboard");
  const { allOrders, updatePendingOrder } = useSharedOrders();

  return (
    <div className="h-full flex bg-[#02171a] text-white overflow-hidden">
      <aside className="w-60 bg-[#03333a] border-r border-white/8 flex flex-col shrink-0">
        <div className="flex items-center gap-3 p-4 border-b border-white/8">
          <div className="w-9 h-9 rounded-xl bg-emerald-300 flex items-center justify-center"><ShoppingBag size={18} className="text-[#03333a]" /></div>
          <div><p style={{ fontFamily: "Outfit, sans-serif" }} className="text-white font-bold">SalesAI Pro</p><p className="text-emerald-300 text-[10px] font-semibold tracking-wider">NHÂN VIÊN</p></div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.filter(item => canAccess("staff", item.id)).map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setPage(id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${page === id ? "bg-emerald-300 text-[#03333a]" : "text-blue-200/60 hover:bg-white/6 hover:text-white"}`}>
              <Icon size={18} />{label}
            </button>
          ))}
        </nav>
        <div className="border-t border-white/8 p-3">
          <div className="flex items-center gap-3 px-2 py-2 mb-2"><Avatar letters={name.slice(0, 2).toUpperCase()} size="sm" /><div className="min-w-0"><p className="text-white text-sm font-medium truncate">{name}</p><p className="text-emerald-300/70 text-xs">Nhân viên</p></div></div>
          <button onClick={onLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-red-300 hover:bg-red-500/10 text-sm"><LogOut size={15} />Đăng xuất</button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="flex items-center justify-between gap-4 px-6 py-4 bg-[#03333a]/80 border-b border-white/8 shrink-0">
          <div><p className="text-blue-200/40 text-xs">KHÔNG GIAN LÀM VIỆC</p><p className="text-white font-semibold mt-0.5">{navItems.find(item => item.id === page)?.label}</p></div>
          <div className="flex items-center gap-3"><span className="hidden sm:inline text-blue-200/50 text-sm">Xin chào, {name}</span><Avatar letters={name.slice(0, 2).toUpperCase()} size="sm" /></div>
        </header>
        <main className="flex-1 overflow-y-auto">
          {page === "dashboard" && <StaffDashboardPage onNavigate={setPage} allOrders={allOrders} />}
          {page === "orders" && <OrdersPage allOrders={allOrders} canConfirmOrders onUpdateOrder={updatePendingOrder} />}
          {page === "products" && <ProductsPage />}
          {page === "customers" && <CustomersPage />}
          {page === "ai" && <AIPage />}
        </main>
      </div>
      <AIChatWidget role="staff" name={name} myOrders={orders} />
    </div>
  );
}

/* ─── Customer Shell ─── */
function CustomerShell({ name, email, onLogout }: { name: string; email: string; onLogout: () => void }) {
  const [page, setPage] = useState<CustPage>("home");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const { allOrders, addOrder, updatePendingOrder } = useSharedOrders();
  const myOrders = allOrders.filter(order => order.customerEmail === email || (!order.customerEmail && order.customer === name));
  const [toast, setToast] = useState<string | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  }

  function addToCart(productId: string) {
    setCart(prev => {
      const existing = prev.find(i => i.productId === productId);
      if (existing) return prev.map(i => i.productId === productId ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { productId, qty: 1 }];
    });
    showToast("Đã thêm vào giỏ hàng 🛒");
  }

  function updateQty(productId: string, delta: number) {
    setCart(prev => prev.map(i => i.productId === productId ? { ...i, qty: i.qty + delta } : i).filter(i => i.qty > 0));
  }

  function removeFromCart(productId: string) {
    setCart(prev => prev.filter(i => i.productId !== productId));
  }

  
function cancelOrder(id: string): boolean {
  const success = updatePendingOrder(id, "Đã hủy");

  showToast(
    success
      ? "Đã hủy đơn hàng."
      : "Không thể hủy đơn hàng này."
  );

  return success;
}


  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  function checkout() {
    if (cart.length === 0) return;
    const total = cart.reduce((sum, i) => {
      const p = products.find(p => p.id === i.productId);
      return sum + (p ? p.price * i.qty : 0);
    }, 0);
    const productNames = cart.map(i => products.find(p => p.id === i.productId)?.name).filter(Boolean).join(", ");
    const newOrder = {
      id: `#DH-${Date.now()}`,
      customer: name,
      customerEmail: email,
      product: productNames,
      amount: total,
      status: "Chờ xác nhận",
      date: new Date().toLocaleDateString("vi-VN"),
      avatar: name.slice(0, 2).toUpperCase(),
    };
    if (!addOrder(newOrder)) {
      showToast("Không thể lưu đơn hàng. Vui lòng thử lại.");
      return;
    }
    setCart([]);
    setPage("orders");
    showToast("Đặt hàng thành công! 🎉");
  }

  return (
    <div className="h-full flex bg-[#02171a] text-white overflow-hidden">
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="flex items-center gap-3 px-5 py-3 bg-[#03333a]/80 backdrop-blur border-b border-white/8 shrink-0">
          <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="text-white/50 hover:text-white transition-colors">
            <Menu size={18} />
          </button>
          <div className="flex-1 flex items-center gap-3">
            <div className="relative max-w-sm flex-1">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input placeholder="Tìm sản phẩm..." className="w-full bg-white/5 border border-white/8 rounded-xl pl-8 pr-3 py-1.5 text-white text-sm placeholder-white/30 focus:outline-none focus:border-yellow-400/40 transition-colors" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage("cart")} className="relative w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
              <ShoppingCart size={15} className="text-white/70" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">{cartCount}</span>
              )}
            </button>
            <Avatar letters={name.slice(0, 2).toUpperCase()} size="sm" />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {page === "home" && <CustomerHomePage name={name} onAddToCart={addToCart} onNavigate={setPage} />}
          {page === "catalog" && <CustomerCatalogPage onAddToCart={addToCart} />}
          {page === "orders" && <CustomerOrdersPage myOrders={myOrders} onNavigate={setPage} onCancel={cancelOrder} />}
          {page === "cart" && (
            <CustomerCartPage cart={cart} onUpdateQty={updateQty} onRemove={removeFromCart} onCheckout={checkout} onNavigate={setPage} />
          )}
          {page === "ai" && <CustomerAIPage name={name} myOrders={myOrders} />}
          {page === "account" && <CustomerAccountPage name={name} />}
        </main>
      </div>
      <CustomerSidebar page={page} onPage={setPage} collapsed={sidebarCollapsed} name={name} cartCount={cartCount} onLogout={onLogout} />
      <AIChatWidget role="customer" name={name} myOrders={myOrders} />

      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[60] bg-[#064d58] border border-yellow-400/30 text-white text-sm px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2">
          <CheckCircle size={15} className="text-yellow-400" /> {toast}
        </div>
      )}
    </div>
  );
}

/* ─── Main App ─── */
export default function App() {
  const [user, setUser] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [role, setRole] = useState<UserRole>("customer");
  const [authPortal, setAuthPortal] = useState<"customer" | "staff">("customer");

  function handleAuthenticate(email: string, password: string, name: string, register: boolean): string | null {
    if (register) {
      const accounts = readRegisteredAccounts();
      if (authPortal !== "customer") return "Chỉ khách hàng có thể đăng ký tài khoản tại đây.";
      if ([...defaultAccounts, ...accounts].some(account => account.email === email)) return "Email này đã được đăng ký";
      const account: Account = { email, password, name, role: "customer" };
      try {
        localStorage.setItem(accountStorageKey, JSON.stringify([...accounts, account]));
      } catch {
        return "Không thể lưu tài khoản trên trình duyệt này";
      }
      setUser(account.name);
      setUserEmail(account.email);
      setRole(account.role);
      return null;
    }

    const account = [...defaultAccounts, ...readRegisteredAccounts()].find(item => item.email === email && item.password === password);
    if (!account) return "Email hoặc mật khẩu không chính xác";
    if (authPortal === "customer" && account.role !== "customer") return "Tài khoản này thuộc cổng nhân viên. Hãy chọn Nhân viên / Admin.";
    if (authPortal === "staff" && account.role === "customer") return "Tài khoản khách hàng không thể vào cổng quản trị.";
    setUser(account.name);
    setUserEmail(account.email);
    setRole(account.role);
    return null;
  }

  function handleLogout() {
    setUser(null);
    setUserEmail(null);
  }

  if (!user) {
    return authPortal === "customer"
      ? <CustomerAuthPage onAuthenticate={handleAuthenticate} onStaffPortal={() => setAuthPortal("staff")} />
      : <AuthPage onAuthenticate={handleAuthenticate} onCustomerPortal={() => setAuthPortal("customer")} />;
  }

  if (role === "admin") return <AdminShell name={user} onLogout={handleLogout} />;
  if (role === "staff") return <StaffShell name={user} onLogout={handleLogout} />;
  return <CustomerShell name={user} email={userEmail ?? ""} onLogout={handleLogout} />;
}
