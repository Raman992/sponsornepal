import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "SponsorNepal - Connect with Nepali Creators",
    template: "%s | SponsorNepal",
  },
  description: "The premier marketplace connecting Nepali creators with brands for meaningful sponsorships and influencer campaigns.",
  keywords: ["Nepal", "creators", "influencers", "sponsorships", "brands", "marketing"],
  authors: [{ name: "SponsorNepal" }],
  creator: "SponsorNepal",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://sponsornepal.com",
    siteName: "SponsorNepal",
    title: "SponsorNepal - Connect with Nepali Creators",
    description: "The premier marketplace connecting Nepali creators with brands for meaningful sponsorships and influencer campaigns.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SponsorNepal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SponsorNepal - Connect with Nepali Creators",
    description: "The premier marketplace connecting Nepali creators with brands for meaningful sponsorships and influencer campaigns.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} min-h-screen bg-background font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}