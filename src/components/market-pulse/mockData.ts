export type EditorialPostStatus = "draft" | "published";

export type EditorialQueueItem = {
  id: string;
  title: string;
  slug: string;
  category: string;
  status: EditorialPostStatus;
  createdAt: string;
  publishedAt: string | null;
  views: number;
  likes: number;
};

type EditorialQueueSeed = Omit<EditorialQueueItem, "id">;

const editorialQueueSeed: EditorialQueueSeed[] = [
  {
    title: "Bitcoin jumps after mysterious whale chatter hits the timeline",
    slug: "bitcoin-jumps-after-mysterious-whale-chatter-hits-the-timeline",
    category: "Crypto",
    status: "draft",
    createdAt: "2026-06-26T13:12:00",
    publishedAt: null,
    views: 12400,
    likes: 3600,
  },
  {
    title: "PEPE holders are celebrating another green day like it means destiny",
    slug: "pepe-holders-are-celebrating-another-green-day-like-it-means-destiny",
    category: "Memes",
    status: "published",
    createdAt: "2026-06-26T10:42:00",
    publishedAt: "2026-06-26T10:42:00",
    views: 8900,
    likes: 2100,
  },
  {
    title: "\"I sold before the pump\" becomes the quote of the day again",
    slug: "i-sold-before-the-pump-becomes-the-quote-of-the-day-again",
    category: "Markets",
    status: "published",
    createdAt: "2026-06-24T14:08:00",
    publishedAt: "2026-06-25T16:00:00",
    views: 6200,
    likes: 1600,
  },
  {
    title: "Macro traders turn one CPI whisper into a full risk-on sermon",
    slug: "macro-traders-turn-one-cpi-whisper-into-a-full-risk-on-sermon",
    category: "Macro",
    status: "draft",
    createdAt: "2026-06-23T18:25:00",
    publishedAt: null,
    views: 4100,
    likes: 900,
  },
  {
    title: "A sleepy DeFi governance vote suddenly becomes the hottest room online",
    slug: "a-sleepy-defi-governance-vote-suddenly-becomes-the-hottest-room-online",
    category: "DeFi",
    status: "published",
    createdAt: "2026-06-20T09:15:00",
    publishedAt: "2026-06-22T11:35:00",
    views: 15700,
    likes: 4700,
  },
  {
    title: "Tech founders discover that one GPU rumor can move the whole group chat",
    slug: "tech-founders-discover-that-one-gpu-rumor-can-move-the-whole-group-chat",
    category: "Tech",
    status: "published",
    createdAt: "2026-06-19T12:10:00",
    publishedAt: "2026-06-20T09:20:00",
    views: 9800,
    likes: 2400,
  },
  {
    title: "A tiny altcoin listing turns into everyone's favorite overreaction of the day",
    slug: "a-tiny-altcoin-listing-turns-into-everyones-favorite-overreaction-of-the-day",
    category: "Crypto",
    status: "draft",
    createdAt: "2026-06-18T11:00:00",
    publishedAt: null,
    views: 3300,
    likes: 820,
  },
  {
    title: "Stocks traders start treating one analyst note like a sacred text",
    slug: "stocks-traders-start-treating-one-analyst-note-like-a-sacred-text",
    category: "Stocks",
    status: "published",
    createdAt: "2026-06-18T08:45:00",
    publishedAt: "2026-06-18T09:05:00",
    views: 7200,
    likes: 1800,
  },
  {
    title: "People on the timeline agree on one thing and that alone is suspicious",
    slug: "people-on-the-timeline-agree-on-one-thing-and-that-alone-is-suspicious",
    category: "People",
    status: "published",
    createdAt: "2026-06-17T15:20:00",
    publishedAt: "2026-06-17T17:00:00",
    views: 5600,
    likes: 1100,
  },
  {
    title: "DeFi farmers rotate so fast even the dashboards look dizzy",
    slug: "defi-farmers-rotate-so-fast-even-the-dashboards-look-dizzy",
    category: "DeFi",
    status: "draft",
    createdAt: "2026-06-17T10:40:00",
    publishedAt: null,
    views: 2950,
    likes: 760,
  },
  {
    title: "A meme coin chart becomes modern art for exactly forty minutes",
    slug: "a-meme-coin-chart-becomes-modern-art-for-exactly-forty-minutes",
    category: "Memes",
    status: "published",
    createdAt: "2026-06-16T14:55:00",
    publishedAt: "2026-06-16T15:30:00",
    views: 11400,
    likes: 3200,
  },
  {
    title: "Macro bears write another thread and bulls turn it into a buy signal",
    slug: "macro-bears-write-another-thread-and-bulls-turn-it-into-a-buy-signal",
    category: "Macro",
    status: "published",
    createdAt: "2026-06-15T09:35:00",
    publishedAt: "2026-06-15T11:05:00",
    views: 6800,
    likes: 1500,
  },
  {
    title: "Crypto influencers discover restraint for six minutes and then lose it again",
    slug: "crypto-influencers-discover-restraint-for-six-minutes-and-then-lose-it-again",
    category: "Crypto",
    status: "draft",
    createdAt: "2026-06-14T16:22:00",
    publishedAt: null,
    views: 2700,
    likes: 610,
  },
  {
    title: "Tech earnings whispers leak early and everyone pretends to be calm",
    slug: "tech-earnings-whispers-leak-early-and-everyone-pretends-to-be-calm",
    category: "Tech",
    status: "published",
    createdAt: "2026-06-14T09:12:00",
    publishedAt: "2026-06-14T10:15:00",
    views: 8600,
    likes: 2300,
  },
  {
    title: "One whale wallet wakes up and mid-cap traders forget how to breathe",
    slug: "one-whale-wallet-wakes-up-and-mid-cap-traders-forget-how-to-breathe",
    category: "Crypto",
    status: "published",
    createdAt: "2026-06-13T13:30:00",
    publishedAt: "2026-06-13T14:00:00",
    views: 13200,
    likes: 3800,
  },
  {
    title: "Market veterans call it noise right before the candles get louder",
    slug: "market-veterans-call-it-noise-right-before-the-candles-get-louder",
    category: "Markets",
    status: "draft",
    createdAt: "2026-06-13T08:18:00",
    publishedAt: null,
    views: 2400,
    likes: 540,
  },
  {
    title: "A forgotten protocol update suddenly becomes today's main character",
    slug: "a-forgotten-protocol-update-suddenly-becomes-todays-main-character",
    category: "DeFi",
    status: "published",
    createdAt: "2026-06-12T12:00:00",
    publishedAt: "2026-06-12T12:50:00",
    views: 7700,
    likes: 1900,
  },
  {
    title: "Stocks discourse gets weird when one chart starts looking too perfect",
    slug: "stocks-discourse-gets-weird-when-one-chart-starts-looking-too-perfect",
    category: "Stocks",
    status: "published",
    createdAt: "2026-06-11T11:28:00",
    publishedAt: "2026-06-11T13:05:00",
    views: 5900,
    likes: 1300,
  },
  {
    title: "People are once again using conviction as a substitute for evidence",
    slug: "people-are-once-again-using-conviction-as-a-substitute-for-evidence",
    category: "People",
    status: "draft",
    createdAt: "2026-06-10T17:10:00",
    publishedAt: null,
    views: 2100,
    likes: 480,
  },
  {
    title: "A late-night tweet sends the meme corner into unnecessary overtime",
    slug: "a-late-night-tweet-sends-the-meme-corner-into-unnecessary-overtime",
    category: "Memes",
    status: "published",
    createdAt: "2026-06-10T08:48:00",
    publishedAt: "2026-06-10T09:30:00",
    views: 10100,
    likes: 2900,
  },
  {
    title: "Macro desks price in certainty moments before the data ruins the mood",
    slug: "macro-desks-price-in-certainty-moments-before-the-data-ruins-the-mood",
    category: "Macro",
    status: "published",
    createdAt: "2026-06-09T15:05:00",
    publishedAt: "2026-06-09T16:15:00",
    views: 6400,
    likes: 1450,
  },
  {
    title: "Crypto tourists arrive at the top and ask if this is still early",
    slug: "crypto-tourists-arrive-at-the-top-and-ask-if-this-is-still-early",
    category: "Crypto",
    status: "draft",
    createdAt: "2026-06-08T14:44:00",
    publishedAt: null,
    views: 1850,
    likes: 390,
  },
  {
    title: "Tech chatter pivots from product launches to pure sentiment theater",
    slug: "tech-chatter-pivots-from-product-launches-to-pure-sentiment-theater",
    category: "Tech",
    status: "published",
    createdAt: "2026-06-07T10:18:00",
    publishedAt: "2026-06-07T11:25:00",
    views: 8300,
    likes: 2050,
  },
  {
    title: "DeFi dashboards glow green long enough for everyone to become a genius",
    slug: "defi-dashboards-glow-green-long-enough-for-everyone-to-become-a-genius",
    category: "DeFi",
    status: "published",
    createdAt: "2026-06-06T09:00:00",
    publishedAt: "2026-06-06T09:40:00",
    views: 9200,
    likes: 2600,
  },
];

export const editorialQueue: EditorialQueueItem[] = editorialQueueSeed.map((item, index) => ({
  id: `story-${String(index + 1).padStart(2, "0")}`,
  ...item,
}));

export const editorialStatusOptions: Array<{
  value: EditorialPostStatus;
  label: string;
}> = [
  { value: "draft", label: "Saved draft" },
  { value: "published", label: "Published" },
];

export function statusLabel(status: EditorialPostStatus) {
  return editorialStatusOptions.find((option) => option.value === status)?.label ?? status;
}

export function statusClassName(status: EditorialPostStatus) {
  switch (status) {
    case "draft":
      return "bg-zinc-100 text-zinc-700";
    case "published":
      return "bg-emerald-100 text-emerald-700";
  }
}
