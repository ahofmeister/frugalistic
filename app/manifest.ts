import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Frugalistic",
    short_name: "Frugalistic",
    description: "The best way to stay on top of your finances",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#121117",
    theme_color: "#121117",
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
    shortcuts: [
      {
        icons: [],
        name: "New Transaction",
        url: "/transactions/new",
      },
    ],
  };
}
