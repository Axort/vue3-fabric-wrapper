import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import dts from "vite-plugin-dts";

export default defineConfig(({ mode }) => {
  const isLib = mode === "lib";

  return {
    plugins: [
      vue(),
      ...(isLib
        ? [
            dts({
              insertTypesEntry: true,
              exclude: ["src/dev/**", "src/examples/**"],
            }),
          ]
        : []),
    ],
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
      },
    },
    ...(isLib
      ? {
          build: {
            lib: {
              entry: resolve(__dirname, "src/index.ts"),
              name: "Vue3FabricWrapper",
              fileName: (format) =>
                `index.${format === "es" ? "esm" : format}.js`,
            },
            rollupOptions: {
              external: ["vue", "fabric"],
              output: {
                globals: {
                  vue: "Vue",
                  fabric: "fabric",
                },
              },
            },
          },
        }
      : {
          server: {
            port: 3000,
          },
        }),
  };
});
