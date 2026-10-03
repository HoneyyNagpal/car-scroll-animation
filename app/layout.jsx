import "./globals.css";

export const metadata = {
  title: "Scroll Car Animation",
  description: "Scroll-driven hero animation built with Next.js, Tailwind and GSAP.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
