import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    define: {
        // Chuyển đổi biến môi trường API_KEY để sử dụng được trong code
        "process.env.API_KEY": JSON.stringify(process.env.API_KEY),
    },
    // Cực kỳ quan trọng cho GitHub Pages: base phải là '/[tên-repo]/'
    base: "/anime-tm/",
    build: {
        outDir: "dist",
        sourcemap: false,
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: [
                        "react",
                        "react-dom",
                        "lucide-react",
                        "@google/genai",
                    ],
                },
            },
        },
    },
});
