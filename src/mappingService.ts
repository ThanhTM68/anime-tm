import { Anime } from "./types";

/**
 * CHUẨN HÓA SLUG CHO ANI4U.ORG
 * Quy tắc: lowercase, bỏ dấu tiếng Việt, bỏ ký tự đặc biệt, space -> dash, không lặp dash
 */
export function slugifyAni4u(text: string): string {
    if (!text) return "";
    return text
        .toString()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Xóa dấu tiếng Việt
        .replace(/[đĐ]/g, "d")
        .replace(/([^0-9a-z-\s])/g, "") // Xóa ký tự đặc biệt (giữ lại dash và space để xử lý sau)
        .replace(/\s+/g, "-") // Thay khoảng trắng bằng -
        .replace(/-+/g, "-") // Xóa - lặp lại
        .trim()
        .replace(/^-+|-+$/g, ""); // Xóa dash ở đầu và cuối
}

export interface LinkResult {
    strategy: "watch" | "anime" | "search";
    titleUsed: "romaji" | "english";
    confidence: "high" | "medium" | "low";
    url: string;
}

/**
 * GENERATOR LIÊN KẾT CHO ANI4U
 * Cấu trúc yêu cầu: https://ani4u.org/xem-anime/{slug}
 * Ưu tiên tiêu đề Romaji (anime.title) vì các trang anime VN thường dùng tên gốc để tạo slug.
 */
export function generateAni4uLink(
    anime: Anime,
    episode?: number | null
): LinkResult {
    // Ưu tiên Romaji (anime.title) cho Ani4u thay vì English
    const title = anime.title || anime.title_english;
    const slug = slugifyAni4u(title);
    const isMovie = anime.genres.includes("Movie") || anime.episodes === 1;

    // Trường hợp xem tập cụ thể
    if (episode && episode > 0 && !isMovie) {
        return {
            strategy: "watch",
            titleUsed: "romaji",
            confidence: "medium",
            url: `https://ani4u.org/xem-anime/${slug}-tap-${episode}`,
        };
    }

    // Trường hợp xem trang phim chung (link chuyển tiếp chính xác như user yêu cầu)
    // Ví dụ: https://ani4u.org/xem-anime/yuusha-party-ni-kawaii-ko-ga-ita-node-kokuhaku-shitemita
    if (slug.length > 2) {
        return {
            strategy: "anime",
            titleUsed: "romaji",
            confidence: "high",
            url: `https://ani4u.org/xem-anime/${slug}`,
        };
    }

    // Fallback an toàn nhất
    return {
        strategy: "search",
        titleUsed: "romaji",
        confidence: "high",
        url: `https://ani4u.org/tim-kiem/?keyword=${encodeURIComponent(title)}`,
    };
}

/**
 * URL ANIMEVIETSUB (Dữ liệu dự phòng)
 */
export function getAnimeVietSubUrl(anime: Anime, episode?: number): string {
    const slug = slugifyAni4u(anime.title);
    const directUrl = `https://animevietsub.show/phim/${slug}-a${anime.mal_id}/`;

    if (episode) return `${directUrl}tap-${episode}.html`;
    return `https://animevietsub.show/tim-kiem/${encodeURIComponent(
        anime.title
    )}/`;
}

/**
 * Trả về link trailer từ YouTube hoặc từ dữ liệu Jikan
 */
export function getTrailerUrl(anime: Anime): string {
    return (
        anime.trailerUrl ||
        `https://www.youtube.com/results?search_query=${encodeURIComponent(
            anime.title + " trailer"
        )}`
    );
}
