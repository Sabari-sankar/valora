# 💎 Valora — Offline Finance & Expense Tracker

> A modern, offline-first personal finance ledger and expense management web application tailored with regional South Indian insights, PIN-code security, and real-time visual analytics.

---

## 👨‍💻 Developer Information

- **Developer**: Sabari Vasan
- **Email**: [sabarivasan1512@gmail.com](mailto:sabarivasan1512@gmail.com)
- **GitHub Repository**: [Sabari-sankar/IntelliBike](https://github.com/Sabari-sankar/IntelliBike)
- **Workspace**: `Sabari-sankar/valora`

---

## ✨ Features

- 🔒 **PIN-Lock Security & Offline Onboarding**: Fast local setup with 4-digit PIN protection, keeping all personal financial records 100% offline in your browser.
- 💵 **Income & Expense Ledger**: Detailed transaction tracking with customizable categories, search filters, and date management.
- 🏷️ **Quick Category Drawer**: Integrated slide-up category drawer inside the entry recorder allowing instant category creation without breaking workflow.
- 📊 **Visual Financial Analytics**: Interactive spending breakdown pie/pizza charts and historical balance trend area charts.
- 💡 **Smart Financial Advice**: Dynamic offline tips tailored for South Indian cities (Bangalore, Chennai, Hyderabad, Kochi, Coimbatore, Mysore, etc.).
- 🔄 **Continuous Animated UI**: Rotating navigation icons for Overview and Backup, active user status indicators, and React Bits WebGL `<SpecularButton />` light effects.
- 💾 **JSON Backup & Import/Export**: Complete local data backup and restore mechanism via JSON files.
- 📱 **Cross-Platform Ready**: Built with Next.js and Capacitor integration for Android APK packaging.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, React 19)
- **Styling**: Modern Vanilla CSS Design System with Glassmorphism, Dark/Light theme toggle, & HSL custom properties
- **Graphics & WebGL**: [OGL](https://github.com/oamap/ogl) for SpecularButton WebGL shaders
- **Mobile Integration**: Capacitor (`@capacitor/core`, `@capacitor/android`)

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.0 or higher)
- `npm` or `yarn`

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Sabari-sankar/IntelliBike.git
   cd valora
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 📜 Available Scripts

- `npm run dev`: Starts the Next.js development server with Turbopack.
- `npm run build`: Compiles and builds the production application.
- `npm run start`: Launches the production server after build.
- `npm run lint`: Runs ESLint to check code syntax and conventions.

---

## 🔐 Security & Privacy

Valora operates entirely **offline**. No transaction data, PIN numbers, or profile information are transmitted to external servers. All data is persisted securely within your device's browser `localStorage`.
