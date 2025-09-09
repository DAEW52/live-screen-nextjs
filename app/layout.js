import { Kanit } from "next/font/google";
import "./globals.css";

const kanit = Kanit({ 
  subsets: ["latin", "thai"],
  weight: ['300', '400', '700', '900'] 
});

export const metadata = {
  title: "THER Phuket • Live Screen System",
  description: "Live Screen System by THER Phuket",
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body className={kanit.className}>{children}</body>
    </html>
  );
}