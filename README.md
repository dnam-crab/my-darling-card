# Invitation Card Base

Thiệp mời tương tác xây bằng React, TypeScript và Vite. Người nhận chọn ngày, giờ và món ăn; lựa chọn cuối có thể gửi về Google Sheets thông qua Google Apps Script.

## Yêu cầu

- Node.js `20.19+` hoặc `22.12+`.
- npm.
- Google Sheet và một Web App Apps Script nếu muốn nhận dữ liệu.

## Cài đặt và chạy local

```bash
npm install
Copy-Item .env.example .env   # PowerShell
npm run dev
```

Mở URL Vite in ra trong terminal, thường là `http://localhost:5173`.

Các lệnh chính:

```bash
npm run build    # type-check và tạo bản production trong dist/
npm run preview  # xem thử bản production local
```

## Cấu hình gửi lựa chọn

Tạo `.env` ở thư mục gốc và đặt URL Web App:

```env
VITE_RESPONSE_ENDPOINT=https://script.google.com/macros/s/<DEPLOYMENT_ID>/exec
```

Trong Google Apps Script, mở file `google-apps-script/Code.gs`, dán code vào dự án gắn với Google Sheet, rồi chọn **Deploy → New deployment → Web app**. Cho phép ứng dụng được truy cập theo phạm vi phù hợp, sao chép URL `/exec` vào `.env`, sau đó khởi động lại Vite. Sheet sẽ tự tạo tab `Responses` và các cột thời gian gửi, ngày, giờ, món ăn.

## Cấu trúc chính

- `src/components/`: các màn hình thiệp, lịch, món ăn và trang xác nhận.
- `src/effects/`: hiệu ứng tan rã bằng canvas/html2canvas.
- `src/services/`: gửi dữ liệu lựa chọn.
- `src/styles.css`: giao diện và animation.
- `assets/images/`: background và sticker.
- `assets/clips/`: video hiệu ứng.
- `google-apps-script/Code.gs`: endpoint ghi dữ liệu vào Google Sheets.

## Build và triển khai

Chạy `npm run build`, sau đó triển khai toàn bộ thư mục `dist/` lên GitHub Pages, Netlify, Vercel hoặc static host khác. Biến `VITE_RESPONSE_ENDPOINT` phải được cấu hình trong môi trường build của dịch vụ triển khai; không commit `.env` hoặc URL cấu hình riêng vào Git.
