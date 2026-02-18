import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Provider from "@/components/shared/Provider";
import { Toaster } from 'sonner'

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],

});

const playfir = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TARS AI",
  description: "Smart solutions to long pdf",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <ClerkProvider>
      <Provider>
        <html lang="en">
          <body
            className={` dark bg-black  ${playfir.variable} ${inter.className}`}>
            {children}
            <Toaster />
          </body>
        </html>
      </Provider>
    </ClerkProvider>

  );
}
