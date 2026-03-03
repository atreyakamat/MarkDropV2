import { categorizeBookmark } from '../utils/categorizer.js';
import { getStorage, setStorage } from '../utils/storage.js';

// Initial sync on install
chrome.runtime.onInstalled.addListener(async () => {
  console.log('MarkDrop V2 Installed');
  await syncBookmarks();
  // Open internal dashboard on install
  chrome.tabs.create({ url: chrome.runtime.getURL("index.html") });
});

// Open internal dashboard when clicking the extension icon
chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({ url: chrome.runtime.getURL("index.html") });
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "START_SYNC") {
    syncBookmarks().then(() => {
      // Open the internal dashboard page
      chrome.tabs.create({ url: chrome.runtime.getURL("index.html") });
    });
  }
});

// Sync bookmarks from Chrome
async function syncBookmarks() {
  const tree = await chrome.bookmarks.getTree();
  const flatBookmarks = flattenBookmarks(tree);
  
  const categorized = flatBookmarks.map(bm => ({
    ...bm,
    category: bm.category || categorizeBookmark(bm.url, bm.title),
    dateAdded: bm.dateAdded || Date.now(),
    unread: true,
    scheduledAt: null
  }));

  await setStorage({ bookmarks: categorized });
}

function flattenBookmarks(nodes, result = []) {
  for (const node of nodes) {
    if (node.url) {
      result.push({
        id: node.id,
        title: node.title,
        url: node.url,
        parentId: node.parentId,
        dateAdded: node.dateAdded
      });
    }
    if (node.children) {
      flattenBookmarks(node.children, result);
    }
  }
  return result;
}

// Listen for new bookmarks
chrome.bookmarks.onCreated.addListener(async (id, bookmark) => {
  if (bookmark.url) {
    const { bookmarks = [] } = await getStorage(['bookmarks']);
    const newBookmark = {
      ...bookmark,
      category: categorizeBookmark(bookmark.url, bookmark.title),
      dateAdded: Date.now(),
      unread: true,
      scheduledAt: null
    };
    await setStorage({ bookmarks: [...bookmarks, newBookmark] });
  }
});

// Listen for bookmark removal
chrome.bookmarks.onRemoved.addListener(async (id) => {
  const { bookmarks = [] } = await getStorage(['bookmarks']);
  const filtered = bookmarks.filter(bm => bm.id !== id);
  await setStorage({ bookmarks: filtered });
});

// Handle Alarms for Scheduling
chrome.alarms.onAlarm.addListener(async (alarm) => {
  const { bookmarks = [] } = await getStorage(['bookmarks']);
  const bookmark = bookmarks.find(bm => bm.id === alarm.name);

  if (bookmark) {
    chrome.notifications.create(bookmark.id, {
      type: 'basic',
      iconUrl: '/icon.png',
      title: 'Time to revisit!',
      message: `You scheduled: ${bookmark.title}`,
      buttons: [{ title: 'Open Link' }],
      priority: 2
    });
  }
});

// Handle notification click
chrome.notifications.onButtonClicked.addListener(async (notificationId, buttonIndex) => {
  const { bookmarks = [] } = await getStorage(['bookmarks']);
  const bookmark = bookmarks.find(bm => bm.id === notificationId);

  if (bookmark && buttonIndex === 0) {
    chrome.tabs.create({ url: bookmark.url });
  }
});
