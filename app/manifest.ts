import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Frugalistic",
    short_name: "Frugalistic",
    description: "The best way to stay on top of your finances",
    start_url: "/",
    display: "standalone",
    background_color: "#14121F",
    theme_color: "#14121F",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
