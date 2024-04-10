import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "~/app/_components/ThemeProvider";
import "~/styles/globals.css";

import { Inter } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";

import { NavBar } from "./_features/Navbar/Navbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Create T3 App",
  description: "Generated by create-t3-app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  charset: "utf-8",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // TODO: remove the suppressHydrationWarning without getting an error in console
    // https://www.notion.so/1f5c86dc33474d30a8bdd73dce1050a8?v=ef49c77b2d64443ea9b274d259cda534&p=4b1c483e6ef5468999fbc9797bcd20e6&pm=s
    <html lang="he" dir="rtl" suppressHydrationWarning>
      <body className={`font-sans ${inter.variable}`}>
        <ClerkProvider>
          <TRPCReactProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <NavBar />
              <main>{children}</main>
            </ThemeProvider>
          </TRPCReactProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
