
import type { Metadata } from "next";
import "./globals.css";
import Headers from "@/components/organisms/header";
import Footer from "@/components/organisms/footer";
import ReduxProvider from "@/providers/ReduxProvider";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";


export const metadata: Metadata = {
  title: "Digital Freight Office",
  description: "Official Website - Digital Freight Office",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased font-sans bg-gray-100">
        {/* Header */}
       {/* <Header/> */}
        <AppRouterCacheProvider>
<Headers/>
        {/* Main Content */}
        <main className="min-h-screen"><ReduxProvider>{children}</ReduxProvider></main>
        <Footer/>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
