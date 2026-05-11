import type { Metadata, Viewport } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-sans-kr",
});

export const metadata: Metadata = {
  title: "여권사진 촬영 가이드",
  description:
    "외교부 기준에 맞는 무보정 여권사진을 촬영할 수 있도록 실시간으로 안내하는 웹앱입니다. 사진 편집 없이 촬영 조건만 검증합니다.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${notoSansKR.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-gray-50 font-sans text-gray-900">
        {children}
      </body>
    </html>
  );
}
