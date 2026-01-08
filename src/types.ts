export interface Anime {
    id: number;
    mal_id: number;
    title: string;
    title_english?: string;
    image: string;
    bannerImage?: string;
    rating: number;
    genres: string[];
    synopsis: string;
    studio: string;
    episodes: number;
    year: number;
    trailerUrl?: string;
}

export interface ChatMessage {
    role: "user" | "assistant";
    content: string;
}

export interface Quote {
    text: string;
    character: string;
    anime: string;
}
