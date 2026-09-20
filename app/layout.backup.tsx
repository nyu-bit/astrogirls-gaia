import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AstroGirls | Astronomía y Ciencia de Datos",
  description: "Exploración tridimensional de una muestra astronómica de Gaia DR3.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
