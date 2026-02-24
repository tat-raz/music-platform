export interface Track {
    id: number;
    title: string;
    artist: string;
    previewUrl: string;
}

export interface Category {
    name: string;
    icon: string;
    songs: Track[];
}

const preview = "/audio/demo.mp3";

export const musicCategories: Category[] = [
    {
        name: "Rock",
        icon: "🎸",
        songs: [
            { id: 1, title: "Bohemian Rhapsody", artist: "Queen", previewUrl: preview },
            { id: 2, title: "Stairway to Heaven", artist: "Led Zeppelin", previewUrl: preview },
            { id: 3, title: "Hotel California", artist: "Eagles", previewUrl: preview }
        ]
    },
    {
        name: "Pop",
        icon: "🎤",
        songs: [
            { id: 4, title: "Shape of You", artist: "Ed Sheeran", previewUrl: preview },
            { id: 5, title: "Blinding Lights", artist: "The Weeknd", previewUrl: preview },
            { id: 6, title: "Levitating", artist: "Dua Lipa", previewUrl: preview }
        ]
    },
    {
        name: "Hip-Hop",
        icon: "🎧",
        songs: [
            { id: 7, title: "Sicko Mode", artist: "Travis Scott", previewUrl: preview },
            { id: 8, title: "God's Plan", artist: "Drake", previewUrl: preview },
            { id: 9, title: "Old Town Road", artist: "Lil Nas X", previewUrl: preview }
        ]
    },
    {
        name: "Funk",
        icon: "🎷",
        songs: [
            { id: 10, title: "Uptown Funk", artist: "Mark Ronson ft. Bruno Mars", previewUrl: preview },
            { id: 11, title: "Superstition", artist: "Stevie Wonder", previewUrl: preview },
            { id: 12, title: "Get Lucky", artist: "Daft Punk", previewUrl: preview }
        ]
    },
    {
        name: "Jazz",
        icon: "🎺",
        songs: [
            { id: 13, title: "Take Five", artist: "Dave Brubeck", previewUrl: preview },
            { id: 14, title: "So What", artist: "Miles Davis", previewUrl: preview },
            { id: 15, title: "Blue in Green", artist: "Bill Evans", previewUrl: preview }
        ]
    }
];
