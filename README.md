# GoShip / LogiFlow — Sales Management with AI

Ứng dụng quản lý bán hàng tích hợp AI sử dụng Groq, Supabase và React.

## Công nghệ

- Frontend: React, TypeScript, Vite, Tailwind CSS
- Backend: Node.js, Express, TypeScript
- AI: Groq API
- Database: Supabase

## Cài đặt

### 1. Backend

Tại thư mục gốc dự án:

```bash
npm install
```

Cấu hình các biến môi trường trong file `.env` theo mẫu `.env.example`.

### 2. Frontend

```bash
cd "Nhóm 1 Quản lí bán hàng"
npm install
npm run dev
```

Mở địa chỉ local mà Vite hiển thị trên terminal.

## Khởi động backend

Mở terminal riêng tại thư mục gốc:

```bash
npm run server
```

Backend chạy tại `http://localhost:3000`.

Kiểm tra trạng thái:

```bash
curl http://localhost:3000/api/health
```

## Build frontend

Tại thư mục gốc:

```bash
cd "Nhóm 1 Quản lí bán hàng"
npm run build
```

## Bảo mật

- Không commit file `.env`.
- Không công khai API key hoặc Supabase secret.
- Không đưa `node_modules/` và `dist/` lên GitHub.
- Mỗi người dùng cần tự cấu hình thông tin môi trường hợp lệ.
