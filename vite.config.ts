import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
    // Fix: Property 'cwd' does not exist on type 'Process'.
    // Casting process to any allows us to call cwd() in environments where the global Process type is incomplete.
    const env = loadEnv(mode, (process as any).cwd(), "");

    return {
        plugins: [react()],
        define: {
            // Cho phép code sử dụng process.env.API_KEY từ cả .env (local) và GitHub Secrets (deploy)
            "process.env.VITE_GEMINI_API_KEY": JSON.stringify(
                env.VITE_GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY
            ),
        },
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
    };
});
