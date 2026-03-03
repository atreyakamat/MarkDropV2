# MarkDrop V2 - Smart Bookmark Management Dashboard

**MarkDrop V2** functions as an intelligent, visually structured bookmark operating system that transforms static browser bookmarks into an organized, interactive dashboard. This latest version introduces a **Zero-Server Architecture**, allowing the entire dashboard to run natively inside your browser with a single click—no terminal, Node.js server, or background processes required.

## 🚀 The "One-Click" Flow

MarkDrop V2 is designed to be frictionless. Here is the exact flow of how it works:

1.  **Click the Extension Icon**: Open the MarkDrop V2 launcher directly from your Chrome toolbar.
2.  **Press "Start Dashboard"**: Clicking the button triggers an instant, high-speed synchronization of your existing Chrome bookmarks.
3.  **Automatic Processing**: The internal engine processes every link, categorizing them into groups like *Development*, *Learning*, or *Social* based on intelligent domain and keyword mapping.
4.  **Native Tab Launch**: A new browser tab opens automatically, serving the dashboard **natively** from the extension's internal files.
5.  **Explore & Interact**: Your entire bookmark library is now a beautiful, interactive workspace. Search, filter, switch between Glassmorphism/Neobrutalism themes, or schedule reminders for later.

## ✨ Why Zero-Server?

-   **Zero Configuration**: No need to run `npm run server` or manage local ports.
-   **Instant Speed**: Dashboard loads directly from the browser's internal memory.
-   **Total Privacy**: Data never leaves the browser environment; categorization and storage happen 100% on your device.
-   **Persistent Sync**: Any bookmark you add to Chrome while the dashboard is open will appear in real-time.

## 🛠 Installation & Setup

### 1. Build the Extension
1. Clone this repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Generate the production build:
   ```bash
   npm run build
   ```
   *This will create the `dist` folder which contains the entire "Operating System".*

### 2. Load into Chrome
1. Open Chrome and navigate to `chrome://extensions/`.
2. Enable **Developer mode** (top right toggle).
3. Click **Load unpacked**.
4. Select the **`dist`** folder from this project.
5. **Pin the extension** for easy access.

## 🏗 Tech Stack

-   **UI**: React 18, Vite
-   **Styling**: Tailwind CSS (Custom Glass & Neo systems)
-   **Motion**: Framer Motion
-   **Engine**: Chrome Manifest V3 (Bookmarks, Alarms, Notifications, Storage APIs)

## 🛡 License
MIT - Created by Atreya Kamat.
