import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/ui/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Movie Recommendations",
  description: "Find the best movies to watch",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}

        {/* Footer */}
          <footer className="bg-gray-100 text-center py-4 border-t">
            <p className="text-sm text-gray-600">
              View the project on{' '}
              <a
                href="https://github.com/1cookspe/Most-Similar-Movies"
                target="_blank"
                className="text-blue-600 hover:underline"
              >
                GitHub
              </a>
            </p>
          </footer>
      </body>
    </html>
  );
}
