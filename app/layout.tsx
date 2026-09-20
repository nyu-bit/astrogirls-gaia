import type { Metadata } from "next";
import { Great_Vibes, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-great-vibes",
});

export const metadata: Metadata = {
  title: "AstroGirls | Astronomía y Ciencia de Datos",
  description:
    "Exploración tridimensional de una muestra astronómica de Gaia DR3.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${plusJakarta.variable} ${greatVibes.variable}`}>
      <body>{children}</body>
    </html>
  );
}
