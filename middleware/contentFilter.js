// middleware/contentFilter.js

const bannedWords = [
  "sex",
  "porn",
  "xxx",
  "nude",
  "abuse",
  "hate",
  "kill",
  "terror"
];

// helper function to normalize text
function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "") // remove special chars
    .trim();
}

function contentFilter(content) {
  if (!content || typeof content !== "string") return false;

  const cleanText = normalize(content);

  return bannedWords.some((word) => cleanText.includes(word));
}

module.exports = contentFilter;