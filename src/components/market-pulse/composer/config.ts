import type { ComposerState } from "@/components/market-pulse/composer/types";

export const previewMetrics = {
  views: "12.4K",
  likes: "3.6K",
};

export const fixedStoryCta = {
  title: "What if you invested before the pump?",
  buttonLabel: "Calculate Your Regret",
};

export const categoryOptions = ["Crypto", "Stocks", "Memes", "Macro", "People", "Tech", "DeFi"];

export const badgeOptions = [
  "Breaking",
  "Trending",
  "Most Talked",
  "Funniest",
  "Biggest Moves",
  "Weirdest",
];

export const editorEmojiOptions = ["😀", "😂", "😭", "🔥", "🚀", "🐋", "💀", "📈", "📉", "💸"];

export const defaultHeroImageSrc = `data:image/svg+xml;utf8,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#8f7cff" />
        <stop offset="36%" stop-color="#4d39c3" />
        <stop offset="100%" stop-color="#11122e" />
      </linearGradient>
      <radialGradient id="glowA" cx="0%" cy="0%" r="90%">
        <stop offset="0%" stop-color="rgba(255,255,255,0.78)" />
        <stop offset="100%" stop-color="rgba(255,255,255,0)" />
      </radialGradient>
      <radialGradient id="glowB" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="rgba(255,255,255,0.2)" />
        <stop offset="100%" stop-color="rgba(255,255,255,0)" />
      </radialGradient>
    </defs>
    <rect width="1200" height="900" fill="url(#bg)" />
    <circle cx="180" cy="180" r="280" fill="url(#glowA)" opacity="0.42" />
    <circle cx="930" cy="220" r="170" fill="url(#glowB)" opacity="0.8" />
    <circle cx="760" cy="530" r="54" fill="rgba(255,255,255,0.14)" />
    <circle cx="1020" cy="314" r="14" fill="rgba(255,255,255,0.84)" />
    <circle cx="952" cy="406" r="9" fill="rgba(255,255,255,0.7)" />
  </svg>
`)}`;

export const initialBodyHtml = `
  <p>The first screenshots spread before the US session fully opened.</p>
  <p>Bitcoin was already leaning into resistance, so the rumor acted like a catalyst instead of the whole explanation.</p>
  <blockquote>The move accelerated because traders were crowded and the feed wanted a story.</blockquote>
`.trim();

export const initialComposerState: ComposerState = {
  title: "Bitcoin jumps after mysterious whale chatter hits the timeline",
  slug: "bitcoin-jumps-after-mysterious-whale-chatter-hits-the-timeline",
  excerpt: "One big wallet, one loud rumor, and the entire feed forgets how to act.",
  category: "Crypto",
  badge: "Breaking",
  summaryHeading: "Bitcoin jumped after whale chatter, but positioning did most of the work",
  bodyHtml: initialBodyHtml,
  tags: "#Bitcoin, #Whales, #CryptoNews, #MarketPulse",
  feedHeroAssetKey: "",
  storyHeroAssetKey: "",
};
