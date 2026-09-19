import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppShell from "./components/AppShell";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import DefaultCanonical from "./components/DefaultCanonical";

const GTM_ID = "GTM-WP77FSW2";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Inxyme",
  description: "Inxyme - Online Learning Platform",
  icons: {
    icon: {
      rel: "icon",
      type: "image/png",
      url: "/images/only-final-logo-png.jpg",
    },
  },
  verification: {
    google: "CknxLEi-2fHtHDEyeKydZvqLUFbx5eRVDUNT7UM_ueo",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full bg-slate-50 dark:bg-slate-800 flex flex-col"
        suppressHydrationWarning
      >
        {/* Google Tag Manager */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
        {/* End Google Tag Manager */}

        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}

        <DefaultCanonical />
        <AuthProvider>
          <AppShell>
            <main className="flex-1">{children}</main>
          </AppShell>
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
