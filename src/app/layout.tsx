import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Inventario App - RMT Soluciones",
  description: "Gestor profesional de inventario de materiales para proyectos de construcción, constructoras y ferreterías. Optimiza tu gestión de materiales con RMT Soluciones.",
  keywords: ["inventario", "construcción", "materiales", "gestión", "proyectos", "RMT Soluciones"],
  authors: [{ name: "RMT Soluciones" }],
  creator: "RMT Soluciones",
  publisher: "RMT Soluciones",
  metadataBase: new URL("https://inventario-app-lilac.vercel.app"),
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  
  // Open Graph / Facebook
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://inventario-app-lilac.vercel.app",
    siteName: "Inventario App - RMT Soluciones",
    title: "Inventario App - Gestión Profesional de Materiales de Construcción",
    description: "Sistema completo de gestión de inventario para proyectos de construcción. Optimiza tu control de materiales con RMT Soluciones.",
    images: [
      {
        url: "/fondo-rmt.png",
        width: 1200,
        height: 630,
        alt: "Inventario App - RMT Soluciones - Gestión Profesional de Materiales de Construcción",
      },
    ],
  },
  
  // Twitter
  twitter: {
    card: "summary_large_image",
    site: "@rmtsoluciones",
    creator: "@rmtsoluciones",
    title: "Inventario App - Gestión Profesional de Materiales de Construcción",
    description: "Sistema completo de gestión de inventario para proyectos de construcción. Optimiza tu control de materiales con RMT Soluciones.",
    images: ["/fondo-rmt.png"],
  },
  
  // Additional meta tags
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  
  // Verification
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
  
  // Icons
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  
  // Manifest
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1e3a8a", // Blue-900 color from your design
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        {/* Additional meta tags for better social sharing */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#1e3a8a" />
        <meta name="msapplication-TileColor" content="#1e3a8a" />
        
        {/* LinkedIn specific */}
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/png" />
        
        {/* WhatsApp specific */}
        <meta property="og:image:alt" content="Inventario App - RMT Soluciones - Gestión Profesional de Materiales de Construcción" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
