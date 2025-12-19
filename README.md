# Afterglow | Event ROI & Relationship Analytics

Afterglow is a production-quality analytics dashboard designed for B2B networking event organizers. It helps track the post-event relationship lifecycle, proving event ROI by visualizing how initial introductions convert into real-world business outcomes like hires, investments, and partnerships.

## 🌟 Key Features

### 1. ROI Overview & Funnel Analytics
- **Conversion Funnel**: Tracks the journey from *Suggested Intro* → *Accepted* → *Scheduled* → *Held* → *Outcome*.
- **Bottleneck Detector**: Automatically identifies where drop-offs are highest (e.g., "Scheduling" or "Acceptance") and suggests tactical improvements.
- **KPI Dashboard**: Real-time tracking of attendee engagement, meeting volume, and estimated pipeline value.

### 2. Relationship Pipeline
- **Lifecycle Tracking**: A comprehensive table view of all attendee matches and their current status.
- **Match Details Drawer**: Deep dive into individual relationships with a full activity timeline and AI-powered follow-up drafts.
- **AI Nudges**: Generates context-aware, WhatsApp-style follow-up messages to help bridge the gap between an intro and a meeting.

### 3. Network Graph Intelligence
- **Social Topology**: Interactive D3.js visualization of the attendee network.
- **Clustering**: Nodes are grouped by role (Founder, Investor, Operator) and industry.
- **Graph Insights**: AI-driven analysis of the network structure to identify super-connectors, isolated nodes, and suggested "bridging" introductions.

### 4. Outcome Logging
- **Structured Tracking**: Log meeting results with AI-assisted analysis of raw notes.
- **Automated Extraction**: Extracts outcome types, sentiment, and suggested next steps from unstructured text.

## 🛠️ Technology Stack

- **Framework**: React 19 with TypeScript
- **Styling**: Tailwind CSS (Minimalist, Premium Aesthetic)
- **Visualizations**: D3.js (Network Graph) & Recharts (Analytics)
- **AI Engine**: Google Gemini 2.0 (via `@google/genai`)
- **Icons**: Lucide React

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file and add your Gemini API key:
   ```env
   VITE_GEMINI_API_KEY=your_api_key_here
   ```
   *(Note: The app runs in **Demo Mode** with synthetic data if no key is provided)*

### Running Locally
```bash
npm run dev
```

## 📱 Mobile Experience
The app features a fully responsive design with a native-feel bottom navigation bar for mobile users, ensuring organizers can track ROI on the go.

---
**Deployment Link:** https://afterglow-vert.vercel.app/
