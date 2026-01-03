import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import viteCompression from "vite-plugin-compression";

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
    viteCompression({
      algorithm: "gzip", // 默认就是 gzip
      ext: ".gz",
      threshold: 10240, // 只有超过 10KB 的文件才压缩
      deleteOriginFile: false, // 不要删除源文件，否则老浏览器会打不开
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: isSsrBuild
          ? undefined
          : {
              "vendor-three": ["three"],
              "vendor-react-three-fiber": ["@react-three/fiber"],
              "vendor-react-three-drei": ["@react-three/drei"],
            },
      },
    },
  },
}));
