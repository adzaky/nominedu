import "./globals.css";
import { Sora } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";

const sora = Sora({ subsets: ["latin"] });

export const metadata = {
  title: "Nomination Intern MSIB 7 | Educourse.id",
  description: "Nomination Intern MSIB 7 | Educourse.id",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider dynamic>
      <html lang="en">
        <body className={`${sora.className} antialiased`}>
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
