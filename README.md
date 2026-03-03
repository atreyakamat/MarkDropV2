# MarkDrop V2 - Smart Bookmark Management Dashboard

**MarkDrop V2** is not just a bookmark manager; it is a proactive knowledge dashboard for power users. It transforms your browser's static bookmark list into an intelligent, visually stunning workspace that helps you organize, revisit, and actually use the links you save.

## 🚀 How It Works (The Dashboard Experience)

Unlike traditional extensions that live in a tiny popup, **MarkDrop V2 operates as a full-page dashboard**. 

1.  **Full-Page Tab**: Clicking the extension icon immediately opens the dashboard in a new, high-resolution tab. This gives you a wide-canvas workspace to manage your knowledge without squinting at a small menu.
2.  **Auto-Intelligence**: The moment you save a bookmark in Chrome, MarkDrop's background engine analyzes it. It looks at the domain (e.g., `github.com` → `Development`) and keywords in the title (e.g., "tutorial" → `Learning`) to automatically categorize it.
3.  **Proactive Reminders**: It solves the "save and forget" problem. You can schedule any link to reappear as a system notification later tonight, tomorrow, or over the weekend.
4.  **Privacy First**: **Everything runs 100% locally.** There are no external servers, no tracking, and no data collection. Your bookmarks and habits never leave your machine.

## ✨ Core Features

-   **🧠 Smart Categorization**: Automatic sorting into *Development*, *Learning*, *Entertainment*, *Shopping*, *Work*, *Research*, and *Social*.
-   **🌫 Glassmorphism Mode**: A premium, "frosted glass" aesthetic with silky-smooth Framer Motion animations and vibrant depth.
-   **🧱 Neobrutalism Mode**: A bold, high-contrast theme for those who prefer raw, energetic design.
-   **⏰ Scheduling Engine**: Integrated with `chrome.alarms` and `chrome.notifications` to keep you productive.
-   **🔗 Intelligent Clustering**: Toggle between a standard grid and a "Stacked" view that groups your knowledge by category for better mental mapping.
-   **🔍 Global Search**: Find any link instantly with a high-performance search bar.

## 🛠 Installation

### 1. Build the Extension
1. Clone this repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the production bundle:
   ```bash
   npm run build
   ```
   *This creates a `dist` folder ready for Chrome.*

### 2. Load into Chrome
1. Open Chrome and navigate to `chrome://extensions/`.
2. Enable **Developer mode** (top right toggle).
3. Click **Load unpacked**.
4. Select the **`dist`** folder.
5. **Pin the extension**: Click the puzzle icon in Chrome and pin MarkDrop V2.

## 🏗 Tech Stack

-   **Frontend**: React 18, Vite
-   **Styling**: Tailwind CSS (Custom Glass & Neo utility classes)
-   **Animations**: Framer Motion
-   **APIs**: Chrome Manifest V3 (Bookmarks, Alarms, Notifications, Storage, Tabs)

## 🛡 License
MIT - Created by Atreya Kamat.
