# MarkDrop V2 - Smart Bookmark Management Dashboard

**MarkDrop V2** functions as an intelligent, visually structured bookmark operating system that transforms static browser bookmarks into an organized, interactive dashboard. This version features a **Zero-Server Architecture** and a **High-Fidelity Glassmorphism UI**, delivering a premium, native-feeling experience directly in your browser.

## 🚀 The "One-Click" Flow

MarkDrop V2 is built for frictionless organization. 

1.  **Launch**: Open the MarkDrop V2 launcher from your toolbar.
2.  **Start**: Press "Start Dashboard" to sync and categorize your links instantly.
3.  **Manage**: The dashboard opens in a new tab, served natively. Explore your bookmarks through a beautifully animated, high-fidelity interface.

## ✨ Advanced Features

-   **🧠 Smart Categorization**: Automatic sorting into *Development*, *Learning*, *Entertainment*, *Shopping*, *Work*, *Research*, and *Social*.
-   **💎 High-Fidelity Glassmorphism**: Features real-time moving glass particles, refraction highlights, and realistic edge-lighting for a truly premium feel.
-   **🧱 Neobrutalism Mode**: A bold, high-contrast alternative theme with thick borders and sharp shadows.
-   **🕒 Smart Undo Deletion**: A 10-second safety net for every deleted bookmark. If you delete something by mistake, hit **Undo** within the 10-second countdown to restore it instantly.
-   **⏰ Scheduling Engine**: Schedule revisits using Chrome's native alarm and notification system.
-   **🔗 Intelligent Clustering**: Toggle between a standard grid and a "Stacked" view grouped by category.
-   **📜 Enhanced Navigation**: Optimized custom scrollbars and a responsive mobile sidebar for seamless control on any device.

## 🛠 Installation

### 1. Build the Project
1. Clone this repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Generate the production build:
   ```bash
   npm run build
   ```

### 2. Load into Chrome
1. Open Chrome and navigate to `chrome://extensions/`.
2. Enable **Developer mode** (top right).
3. Click **Load unpacked** and select the **`dist`** folder.
4. **Pin the extension** and launch your new dashboard!

## 🏗 Tech Stack

-   **UI**: React 18, Vite
-   **Styling**: Tailwind CSS (Custom Glass & Neo systems)
-   **Motion**: Framer Motion
-   **Engine**: Chrome Manifest V3 (Bookmarks, Alarms, Notifications, Storage APIs)

## 🛡 License
MIT - Created by Atreya Kamat.
