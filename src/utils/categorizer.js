const domainMap = {
  'github.com': 'Development',
  'stackoverflow.com': 'Development',
  'npm-js.com': 'Development',
  'dev.to': 'Development',
  'medium.com': 'Learning',
  'coursera.org': 'Learning',
  'udemy.com': 'Learning',
  'youtube.com': 'Entertainment',
  'netflix.com': 'Entertainment',
  'twitch.tv': 'Entertainment',
  'amazon.com': 'Shopping',
  'ebay.com': 'Shopping',
  'nytimes.com': 'News',
  'bbc.com': 'News',
  'twitter.com': 'Social',
  'facebook.com': 'Social',
  'linkedin.com': 'Social',
  'google.com': 'Research'
};

const keywordMap = {
  'learn': 'Learning',
  'tutorial': 'Learning',
  'course': 'Learning',
  'react': 'Development',
  'javascript': 'Development',
  'python': 'Development',
  'api': 'Development',
  'news': 'News',
  'daily': 'News',
  'shop': 'Shopping',
  'buy': 'Shopping',
  'movie': 'Entertainment',
  'watch': 'Entertainment'
};

export const categorizeBookmark = (url, title) => {
  const lowercaseUrl = url.toLowerCase();
  const lowercaseTitle = title.toLowerCase();

  // 1. Domain Match
  for (const [domain, category] of Object.entries(domainMap)) {
    if (lowercaseUrl.includes(domain)) {
      return category;
    }
  }

  // 2. Keyword Match
  for (const [keyword, category] of Object.entries(keywordMap)) {
    if (lowercaseUrl.includes(keyword) || lowercaseTitle.includes(keyword)) {
      return category;
    }
  }

  // 3. Default
  return 'Research';
};
