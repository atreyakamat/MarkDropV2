# MarkDrop V2 - Smart Bookmark Management Dashboard

**MarkDrop V2** functions as an intelligent, visually structured bookmark operating system that transforms static browser bookmarks into an organized, interactive dashboard. Instead of simply listing saved links, the extension extracts all bookmarks using the Chrome Bookmarks API, processes them through a smart categorization engine that analyzes domains and keywords, and stores enhanced metadata locally. 

These bookmarks are then rendered as beautifully designed cards within categorized sections, allowing users to search, filter, group related links, and interact with them dynamically. Each bookmark can be scheduled for future viewing, triggering Chrome alarms and notifications at the chosen time, ensuring important links are not forgotten. All logic runs entirely on-device using local storage and Chrome APIs, maintaining privacy while delivering a proactive, structured, and aesthetically refined bookmark management experience.

## 🚀 How It Works (The Dashboard Experience)

MarkDrop V2 operates as a high-performance local dashboard triggered by a browser popup.

1.  **Extension Popup**: Click the MarkDrop V2 icon in your browser to open the launcher.
2.  **Start Dashboard**: Click the "Start Dashboard" button. The extension will automatically sync your bookmarks and open a new tab at **`http://localhost:9331`**.
3.  **Local Server**: The dashboard is served locally on port **9331**, providing a fast and private full-page experience.
4.  **Auto-Intelligence**: Bookmarks are analyzed by domain and title keywords to automatically sort into categories like *Development*, *Learning*, etc.
5.  **Proactive Reminders**: Schedule links to reappear as system notifications later.

## ✨ Core Features

-   **🧠 Smart Categorization**: Automatic sorting into *Development*, *Learning*, *Entertainment*, *Shopping*, *Work*, *Research*, and *Social*.
-   **🌫 Glassmorphism Mode**: A premium aesthetic with silky-smooth animations.
-   **🧱 Neobrutalism Mode**: A bold, high-contrast theme.
-   **⏰ Scheduling Engine**: Integrated with `chrome.alarms` and `chrome.notifications`.
-   **🔗 Intelligent Clustering**: Toggle between standard grid and a "Stacked" view.

## 🛠 Installation & Running

### 1. Build & Start the Server
1. Clone this repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the production bundle:
   ```bash
   npm run build
   ```
4. **Start the local server**:
   ```bash
   npm run server
   ```
   *The dashboard will now be available at http://localhost:9331.*

### 2. Load the Extension into Chrome
1. Open Chrome and navigate to `chrome://extensions/`.
2. Enable **Developer mode** (top right toggle).
3. Click **Load unpacked**.
4. Select the **`dist`** folder.
5. Pin the extension and click "Start Dashboard"!

## 🏗 Tech Stack

-   **Frontend**: React 18, Vite
-   **Server**: Node.js + Express (Port 9331)
-   **Styling**: Tailwind CSS
-   **APIs**: Chrome Manifest V3

## 🛡 License
MIT - Created by Atreya Kamat.
