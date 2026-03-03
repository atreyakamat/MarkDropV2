# MarkDrop V2 - Smart Bookmark Management Dashboard

MarkDrop V2 is a modern, privacy-first Chrome extension that transforms your browser's bookmarks into an intelligent, visually stunning dashboard. It uses local categorization logic and scheduling to help you actually *revisit* the links you save.

## ✨ Features

- **🧠 Auto-Categorization Engine**: Automatically sorts your bookmarks into categories like *Development*, *Learning*, *Entertainment*, *Shopping*, and more based on domain and keywords.
- **🌫 Dual Premium UI Themes**:
  - **Glassmorphism**: A sleek, modern aesthetic with backdrop blurs, gradients, and soft shadows.
  - **Neobrutalism**: A bold, high-contrast look with thick borders and vibrant colors.
- **⏰ Smart Revisit Scheduling**: Set reminders for bookmarks using presets (Tonight, Tomorrow, Weekend) or custom times. Integrates with `chrome.notifications`.
- **🔗 Intelligent Grouping**: Toggle between a standard grid and a categorized view that clusters related links.
- **🔍 Smart Filter & Search**: Powerful real-time search and sidebar filters for Recent, Scheduled, and specific categories.
- **🔒 Privacy First**: Everything runs locally. No servers, no tracking, and no data leaves your browser.

## 🚀 Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- [NPM](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)

### 1. Build the Extension
1. Clone this repository.
2. Open your terminal in the project directory.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Build the project:
   ```bash
   npm run build
   ```
   This will create a `dist` folder.

### 2. Load into Chrome
1. Open Chrome and go to `chrome://extensions/`.
2. Enable **Developer mode** (toggle in the top right).
3. Click **Load unpacked**.
4. Select the `dist` folder created in the previous step.
5. The MarkDrop V2 icon should now appear in your extension toolbar.

## 🛠 Usage

1. **Open Dashboard**: Click the extension icon in your toolbar to open the full-page dashboard.
2. **Switch Themes**: Use the toggle button in the bottom left to switch between Glassmorphism and Neobrutalism.
3. **Schedule Revisit**: Click the clock icon on any bookmark card to set a reminder.
4. **Group View**: Use the "Layers" icon in the top right to switch between the standard grid and the categorized view.
5. **Mark as Read**: Click the checkmark to mark a bookmark as revisited.

## 🏗 Built With

- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Storage**: Chrome Extension Storage Local API

## 🛡 License

MIT License. See [LICENSE](LICENSE) for details.
