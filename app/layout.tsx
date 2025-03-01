import type {Metadata} from "next";
import {Inter} from "next/font/google";
import {SpeedInsights} from "@vercel/speed-insights/next"
import {ClerkProvider} from "@clerk/nextjs";
import {Toaster} from "@/components/ui/toaster"
import "./globals.css";
import '@stream-io/video-react-sdk/dist/css/styles.css';


const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
  title: "Meeting App",
  description: "Modern video calling app",
  icons: {
    icon: '/icons/logo.svg',
  }
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <ClerkProvider
      appearance={{
        layout: {
          logoImageUrl: '/icons/yoom-logo.svg',
          socialButtonsVariant: 'iconButton',
        },
        variables: {
          colorText: '#fff',
          colorPrimary: '#0e78f9',
          colorBackground: '#1c1f2e',
          colorInputBackground: '#252a41',
          colorInputText: '#fff',
        }
      }}
    >
      <body className={`${inter.className} bg-dark-2`}>
      {children}
      <SpeedInsights/>
      <Toaster/>
      </body>
    </ClerkProvider>
    </html>
  );
}
