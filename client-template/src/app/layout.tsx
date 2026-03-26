import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { getAuthUser } from "@/services/auth.service";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CRM Base Template",
  description: "Minimalist, scalable CRM template",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getAuthUser();

  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider initialUser={user}>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
