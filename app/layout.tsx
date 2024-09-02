import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MenuNav from "@/components/MenuNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lista de compras",
  description: "Um aplicativo pra facilitar suas compras semanais",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body
        className={`${inter.className} flex flex-col min-h-screen bg-gray-200`}
      >
        <Header />
        <MenuNav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
