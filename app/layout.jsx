import { Poppins } from "next/font/google";
import ChatWidget from "@/components/ChatWidget";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-sans`}>
        {children}
        <ChatWidget/>
      </body>
    </html>
  );
}
