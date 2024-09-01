import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/index.scss";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title:
    "JoJo’s Bizarre Adventure Character Guessing Game | Up to Part 6: Stone Ocean",
  description:
    "Test your knowledge of JoJo’s Bizarre Adventure characters with our interactive guessing game! Enter character names from Parts 1-6 and get instant feedback with color-coded hints. Perfect for fans who want to challenge themselves without spoilers beyond Part 6: Stone Ocean. Play now and see if you can guess the character correctly!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
