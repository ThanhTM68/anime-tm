
import { GoogleGenAI, Type } from "@google/genai";
import { Anime } from './types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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
  episodes: item.episodes || 12,
  year: item.year || item.aired?.prop?.from?.year || 0,
  trailerUrl: item.trailer?.url
});

const LINK_BUILDER_SYSTEM_PROMPT = `Bạn là một AI kỹ thuật chuyên xây dựng liên kết xem anime Vietsub.
KHÔNG crawl website, KHÔNG dùng iframe, KHÔNG nhúng video.
Mục tiêu duy nhất: Tạo LINK CHUYỂN HƯỚNG hợp lệ sang ani4u.org.

QUY TẮC BẮT BUỘC:
1. LINK AN TOÀN NHẤT = LINK TÌM KIẾM ANI4U.
2. lowercase, bỏ dấu tiếng Việt, bỏ ký tự đặc biệt, khoảng trắng -> "-", không có "--".
3. Chỉ sinh JSON kết quả.`;

export async function getSmartLink(anime: Anime, episode?: number): Promise<any> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Tạo link cho: ${anime.title} (English: ${anime.title_english || 'N/A'}), Episode: ${episode || 'Full'}`,
      config: {
        systemInstruction: LINK_BUILDER_SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            strategy: { type: Type.STRING },
            url: { type: Type.STRING },
            confidence: { type: Type.STRING }
          }
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    return null;
  }
}

export async function fetchAnimeFromJikan(query: string): Promise<Anime[]> {
  try {
    const response = await fetch(`https://api.jikan.moe/v4/anime?q=${query}&limit=12`);
    const json = await response.json();
    return json.data.map(mapJikanToAnime);
  } catch (error) { return []; }
}

export async function fetchCurrentSeason(limit: number = 15): Promise<Anime[]> {
  try {
    const response = await fetch(`https://api.jikan.moe/v4/seasons/now?limit=${limit}`);
    const json = await response.json();
    return json.data.map(mapJikanToAnime);
  } catch (error) { return []; }
}

export async function fetchRecentEpisodes(limit: number = 20): Promise<Anime[]> {
  try {
    const response = await fetch(`https://api.jikan.moe/v4/anime?status=airing&order_by=popularity&sort=desc&limit=${limit}`);
    const json = await response.json();
    return json.data.map(mapJikanToAnime);
  } catch (error) { return []; }
}

export async function fetchTopAnime(limit: number = 25, page: number = 1): Promise<Anime[]> {
  try {
    const response = await fetch(`https://api.jikan.moe/v4/top/anime?limit=${limit}&page=${page}`);
    const json = await response.json();
    return json.data.map(mapJikanToAnime);
  } catch (error) { return []; }
}

export async function analyzeAnime(animeTitle: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Phân tích chuyên sâu (tiếng Việt): ${animeTitle}`,
      config: {
        systemInstruction: "Bạn là Sensei AI, phân tích anime với góc nhìn nghệ thuật và triết lý. Trả lời ngắn gọn, súc tích.",
      }
    });
    return response.text || "Dữ liệu đang được phân tích...";
  } catch (error) {
    return "Lỗi kết nối Neural Net.";
  }
}

export async function getAnimeRecommendations(prompt: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "Sensei-AI trả lời bằng tiếng Việt, phong cách Cyberpunk, am hiểu anime sâu sắc.",
      }
    });
    return response.text || "Sensei đang bận một chút...";
  } catch (error) {
    return "Đường truyền không ổn định.";
  }
}
