export const THEMES = [
    "friendship",
    "dystopian future",
    "high school life",
    "summer festival",
    "lost pet",
    "time travel",
    "samurai honor",
    "space exploration",
    "ghost story",
    "cooking competition",
    "family reunion",
    "haunted house",
    "sports rivalry",
    "first love",
    "robot companion",
    "dream world",
    "mystery in the city",
    "music band journey",
    "village legend",
    "magical forest",
    "everyday commute",
    "traveling abroad",
    "unexpected visitor",
    "new beginning",
    "stormy night",
    "childhood memory",
    "science experiment gone wrong",
    "café romance",
    "lost in translation",
    "festival fireworks"
];

export function getRandomThemes(count = 4) {

    const shuffled = [...THEMES].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);

}
