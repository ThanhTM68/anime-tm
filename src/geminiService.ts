import { GoogleGenAI } from "@google/genai";
import { Anime } from "./types";

// Helper to map Jikan API response to our Anime type
const mapJikanToAnime = (item: any): Anime => ({
    id: item.mal_id,
    mal_id: item.mal_id,
    title: item.title,
    title_english: item.title_english,
    image: item.images.jpg.large_image_url,
    bannerImage: item.images.jpg.large_image_url,
    rating: item.score || 0,
    genres: item.genres?.map((g: any) => g.name) || [],
    synopsis: item.synopsis || "Không có thông tin tóm tắt.",
    studio: item.studios?.[0]?.name || "Unknown Studio",
    episodes: item.episodes || 0,
    year: item.year || item.aired?.prop?.from?.year || 0,
    trailerUrl: item.trailer?.url,
});

export async function fetchRandomBackground(): Promise<string> {
    try {
        const res = await fetch("https://nekos.best/api/v2/neko");
        const data = await res.json();
        return data.results[0].url;
    } catch (e) {
        return "https://4kwallpapers.com/images/walls/thumbs_3t/25003.jpg";
    }
}

export async function fetchAnimeFromJikan(query: string): Promise<Anime[]> {
    try {
        const response = await fetch(
            `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(
                query
            )}&limit=12`
        );
        const json = await response.json();
        return json.data.map(mapJikanToAnime);
    } catch (error) {
        return [];
    }
}

export async function fetchAnimeWithFilters(
    genreIds: number[],
    page: number = 1
): Promise<{ data: Anime[]; pagination: any }> {
    try {
        const genresParam =
            genreIds.length > 0 ? `&genres=${genreIds.join(",")}` : "";
        const response = await fetch(
            `https://api.jikan.moe/v4/anime?order_by=popularity&sort=desc&page=${page}&limit=20${genresParam}`
        );
        const json = await response.json();
        return {
            data: json.data.map(mapJikanToAnime),
            pagination: json.pagination,
        };
    } catch (error) {
        return { data: [], pagination: {} };
    }
}

export async function fetchCurrentSeason(
    page: number = 1,
    limit: number = 20
): Promise<{ data: Anime[]; pagination: any }> {
    try {
        const response = await fetch(
            `https://api.jikan.moe/v4/seasons/now?page=${page}&limit=${limit}`
        );
        const json = await response.json();
        return {
            data: json.data.map(mapJikanToAnime),
            pagination: json.pagination,
        };
    } catch (error) {
        return { data: [], pagination: {} };
    }
}

/**
 * FETCH LEADERBOARD DATA BY TYPE
 */
export async function fetchLeaderboardData(
    type: "week" | "season" | "year" | "upcoming" | "all"
): Promise<Anime[]> {
    try {
        let url = "";
        switch (type) {
            case "week":
                url =
                    "https://api.jikan.moe/v4/top/anime?filter=airing&limit=25";
                break;
            case "season":
                url = "https://api.jikan.moe/v4/seasons/now?limit=25";
                break;
            case "upcoming":
                url =
                    "https://api.jikan.moe/v4/top/anime?filter=upcoming&limit=25";
                break;
            case "year":
                url = "https://api.jikan.moe/v4/seasons/upcoming?limit=25";
                break;
            default:
                url = "https://api.jikan.moe/v4/top/anime?limit=25";
        }
        const response = await fetch(url);
        const json = await response.json();
        return json.data.map(mapJikanToAnime);
    } catch (error) {
        console.error("Leaderboard Error:", error);
        return [];
    }
}

export async function fetchTopAnimeExtended(
    filter: string = "",
    count: number = 40
): Promise<Anime[]> {
    try {
        const filterParam = filter ? `&filter=${filter}` : "";
        const res1 = await fetch(
            `https://api.jikan.moe/v4/top/anime?limit=25&page=1${filterParam}`
        );
        const json1 = await res1.json();
        let data = json1.data.map(mapJikanToAnime);

        if (count > 25) {
            const res2 = await fetch(
                `https://api.jikan.moe/v4/top/anime?limit=25&page=2${filterParam}`
            );
            const json2 = await res2.json();
            const data2 = json2.data.map(mapJikanToAnime).slice(0, count - 25);
            data = [...data, ...data2];
        }

        return data;
    } catch (error) {
        return [];
    }
}

export async function fetchTopAnime(
    limit: number = 25,
    page: number = 1
): Promise<Anime[]> {
    try {
        const response = await fetch(
            `https://api.jikan.moe/v4/top/anime?limit=${limit}&page=${page}`
        );
        const json = await response.json();
        return json.data.map(mapJikanToAnime);
    } catch (error) {
        return [];
    }
}

export async function analyzeAnime(animeTitle: string): Promise<string> {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Phân tích chuyên sâu (tiếng Việt): ${animeTitle}`,
            config: {
                systemInstruction:
                    "Bạn là Sensei AI, phân tích anime với góc nhìn nghệ thuật và triết lý. Trả lời ngắn gọn, súc tích.",
            },
        });
        return response.text || "Dữ liệu đang được phân tích...";
    } catch (error) {
        console.error("Gemini Analysis Error:", error);
        return "Lỗi kết nối Neural Net.";
    }
}

export async function getAnimeRecommendations(prompt: string): Promise<string> {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
            config: {
                systemInstruction:
                    "Sensei-AI trả lời bằng tiếng Việt, phong cách Cyberpunk, am hiểu anime sâu sắc.",
            },
        });
        return response.text || "Sensei đang bận một chút...";
    } catch (error) {
        console.error("Gemini Recommendation Error:", error);
        return "Đường truyền không ổn định.";
    }
}
