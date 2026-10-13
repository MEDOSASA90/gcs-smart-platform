import React from "react";

export const metadata = {
  title: "منصة GCS الذكية المركزية — لوحة التحكم والجدول التفاعلي",
  description: "المنصة المركزية لمراقبة وتحليل وتوزيع عمليات بوابة التعاقدات العامة المصرية"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body style={{ background: "#0f172a", color: "#f8fafc", fontFamily: "Segoe UI, Tahoma, sans-serif", margin: 0 }}>
        {children}
      </body>
    </html>
  );
}
