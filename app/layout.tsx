import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AstroGirls | Astronomía y Ciencia de Datos",
  description:
    "Exploración tridimensional de una muestra astronómica de Gaia DR3.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={plusJakarta.variable}>
      <body>{children}</body>
    </html>
  );
}
