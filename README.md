# MarkDrop V2 - Smart Bookmark Management Dashboard

**MarkDrop V2** functions as an intelligent, visually structured bookmark operating system that transforms static browser bookmarks into an organized, interactive dashboard. Instead of simply listing saved links, the extension extracts all bookmarks using the Chrome Bookmarks API, processes them through a smart categorization engine that analyzes domains and keywords, and stores enhanced metadata locally. 

These bookmarks are then rendered as beautifully designed cards within categorized sections, allowing users to search, filter, group related links, and interact with them dynamically. Each bookmark can be scheduled for future viewing, triggering Chrome alarms and notifications at the chosen time, ensuring important links are not forgotten. All logic runs entirely on-device using local storage and Chrome APIs, maintaining privacy while delivering a proactive, structured, and aesthetically refined bookmark management experience.

## 🚀 The One-Click Experience (Native Dashboard)

MarkDrop V2 is built for speed and simplicity. It runs **natively** inside your browser, meaning **no external server or terminal is required.**

1.  **Launch**: Click the MarkDrop V2 icon in your extension bar.
2.  **Start**: Press the **"Start Dashboard"** button in the popup.
3.  **Explore**: A full-page dashboard opens instantly in a new tab, showing your entire bookmark collection beautifully organized.

## ✨ Core Features

-   **🧠 Smart Categorization**: Automatic sorting into *Development*, *Learning*, *Entertainment*, *Shopping*, *Work*, *Research*, and *Social*.
-   **🌫 Glassmorphism Mode**: A premium, "frosted glass" aesthetic with silky-smooth animations.
-   **🧱 Neobrutalism Mode**: A bold, high-contrast theme for those who prefer raw design.
-   **⏰ Scheduling Engine**: Set reminders for links using Chrome's native alarm system.
-   **🔗 Intelligent Clustering**: Toggle between standard grid and a "Stacked" view grouped by category.

## 🛠 Installation

### 1. Build the Project
1. Clone this repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the extension:
   ```bash
   npm run build
   ```
   *This creates a `dist` folder.*

### 2. Load into Chrome
1. Open Chrome and navigate to `chrome://extensions/`.
2. Enable **Developer mode** (top right).
3. Click **Load unpacked**.
4. Select the **`dist`** folder.
5. **Pin the extension** and click "Start Dashboard"!

## 🏗 Tech Stack

-   **Frontend**: React 18, Vite
-   **Styling**: Tailwind CSS
-   **Animations**: Framer Motion
-   **APIs**: Chrome Manifest V3 (Bookmarks, Alarms, Notifications, Storage)

## 🛡 License
MIT - Created by Atreya Kamat.
