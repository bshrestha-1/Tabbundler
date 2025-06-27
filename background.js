// background.js

const TOPIC_VECTORS = {
  "Shopping": ["buy", "price", "amazon", "review", "product", "cart", "store"],
  "Learning": ["learn", "how", "tutorial", "course", "lesson", "guide", "wiki", "documentary", "explained", "lecture"],
  "Research": ["dataset", "arxiv", "paper", "research", "journal", "study", "citations"],
  "Entertainment": ["youtube", "netflix", "music", "video", "stream", "series", "movie", "funny", "vlog", "reaction"],
  "News": ["cnn", "bbc", "news", "reuters", "headline", "article", "press"]
};

const DOMAIN_HINTS = {
  "Research": ["arxiv.org", "researchgate.net", "jstor.org", "sciencedirect.com"],
  "News": ["cnn.com", "bbc.com", "nytimes.com", "reuters.com", "washingtonpost.com"],
  "Shopping": ["amazon.com", "ebay.com", "etsy.com", "walmart.com"]
};

function textToVector(text) {
  const words = text.toLowerCase().split(/[^a-z]+/);
  const vec = {};
  for (const word of words) {
    if (!word) continue;
    vec[word] = (vec[word] || 0) + 1;
  }
  return vec;
}

function cosineSimilarity(vec1, vec2) {
  let dot = 0, normA = 0, normB = 0;
  for (const k in vec1) {
    dot += (vec1[k] || 0) * (vec2[k] || 0);
    normA += vec1[k] * vec1[k];
  }
  for (const k in vec2) normB += vec2[k] * vec2[k];
  if (normA === 0 || normB === 0) return 0;
  return dot / Math.sqrt(normA * normB);
}

function getTopicByDomain(url, title) {
  // YouTube special handling
  if (url.includes("youtube.com")) {
    const learningIndicators = ["tutorial", "explained", "lesson", "how", "education", "course", "lecture", "documentary"];
    const entertainmentIndicators = ["vlog", "funny", "reaction", "comedy", "music video", "shorts", "meme"];
    const titleLower = title.toLowerCase();
    const learnMatch = learningIndicators.some(word => titleLower.includes(word));
    const entertainMatch = entertainmentIndicators.some(word => titleLower.includes(word));
    if (learnMatch && !entertainMatch) return "Learning";
    if (entertainMatch && !learnMatch) return "Entertainment";
    // If both or none, fallback to vector analysis
  }

  for (const [topic, domains] of Object.entries(DOMAIN_HINTS)) {
    for (const domain of domains) {
      if (url.includes(domain)) return topic;
    }
  }
  return null;
}

function classifyTabs(tabs) {
  const groups = {};

  for (const tab of tabs) {
    const title = tab.title || "";
    const url = tab.url || "";
    const combinedText = title + " " + url;
    const vec = textToVector(combinedText);

    const domainHint = getTopicByDomain(url, title);
    if (domainHint) {
      if (!groups[domainHint]) groups[domainHint] = [];
      groups[domainHint].push(tab);
      continue;
    }

    let bestTopic = "Other";
    let bestScore = 0.0;

    for (const topic in TOPIC_VECTORS) {
      const topicVec = textToVector(TOPIC_VECTORS[topic].join(" "));
      const score = cosineSimilarity(vec, topicVec);
      if (score > bestScore) {
        bestScore = score;
        bestTopic = topic;
      }
    }

    if (!groups[bestTopic]) groups[bestTopic] = [];
    groups[bestTopic].push(tab);
  }

  return groups;
}

function groupAndStoreTabs() {
  browser.tabs.query({})
    .then(tabs => {
      const grouped = classifyTabs(tabs);
      browser.storage.local.set({ tabGroups: grouped });
    });
}

browser.tabs.onUpdated.addListener(groupAndStoreTabs);
browser.tabs.onCreated.addListener(groupAndStoreTabs);
browser.tabs.onRemoved.addListener(groupAndStoreTabs);

groupAndStoreTabs();

