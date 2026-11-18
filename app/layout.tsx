import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { ScrollBadge } from "@/components/anim"; // Import ScrollBadge
import { asset } from "@/lib/asset";

export const metadata: Metadata = {
  title: "The Nora Edit",
  description: "Ideas. Culture. Perspective.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Adobe Typekit kit (ivypresto-display) — supplied by the client TEST. */}
        <link rel="stylesheet" href="https://use.typekit.net/jig5bsz.css" />
        {/* Google fonts used elsewhere in the Figma (Inter / Arapey / Caveat). */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Arapey:ital@0;1&family=Caveat&family=Inter:wght@300;400;700&display=swap"
          rel="stylesheet"
        />
        <link href="https://fonts.googleapis.com/css2?family=Libre+Franklin:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet"></link>

        <link
          rel="icon"
          href={asset("/assets/favicon/favicon.ico")}
          sizes="any"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href={asset("/assets/favicon/favicon-32x32.png")}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href={asset("/assets/favicon/favicon-16x16.png")}
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href={asset("/assets/favicon/apple-touch-icon.png")}
        />
        <link
          rel="manifest"
          href={asset("/assets/favicon/site.webmanifest")}
        />

        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-6WZLLZY8N2"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-6WZLLZY8N2');
          `}
        </Script>
      </head>
      <body className="canvas">
        {children}
        <Footer />
        {/* Add ScrollBadge here to make it globally visible and sticky */}
        <ScrollBadge
          size={150}
          asterisk={asset("/assets/icon-asterisk.svg")}
        />
      </body>
    </html>
  );
}
