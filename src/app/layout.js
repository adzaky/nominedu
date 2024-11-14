import "./globals.css";
import { Sora } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";

const sora = Sora({ subsets: ["latin"] });

export const metadata = {
  title: "Nominees Educourse",
  description: "Nominees Educourse",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${sora.className} antialiased`}>
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
