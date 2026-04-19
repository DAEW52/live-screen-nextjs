import { Space_Grotesk, Kanit } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-space' 
});

const kanit = Kanit({
  subsets: ["thai", "latin"],
  weight: ['300', '400', '500', '600', '700'], // เพิ่ม 600, 700 ถ้ามีใช้ตัวหนา
  variable: '--font-kanit'
});

export default function RootLayout({ children }) {
  return (
    <html lang="th" suppressHydrationWarning> 
      {/* แนะนำให้ใส่ที่ <html> ด้วยเพื่อครอบคลุมถึง Extension ที่แก้ Tag html ครับ */}
      <body 
        className={`${spaceGrotesk.variable} ${kanit.variable}`} 
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}