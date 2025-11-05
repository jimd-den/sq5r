# sq5r

A modern web application that transforms passive reading into active learning using the SQ5R study method.

## What is SQ5R?

SQ5R is an evidence-based study technique that enhances reading comprehension and retention through seven structured steps:

1. **Survey** - Scan the material and identify key elements like headings, keywords, and images
2. **Question** - Generate questions about the content to guide your reading
3. **Read** - Engage with the material through focused, timed reading sessions
4. **Record** - Document answers to your questions and capture important insights
5. **Recite** - Test your memory by recalling information without looking
6. **Review** - Compare your recited answers with your notes and assess understanding
7. **Reflect** - Synthesize your learning and plan next steps

## Features

- **Organized Subject Management** - Create and manage multiple study subjects
- **Guided Workflow** - Step-by-step progression through the SQ5R process
- **Focused Reading Timer** - 25-minute focused reading sessions to promote deep concentration
- **Spaced Repetition System** - Intelligent review scheduling based on difficulty ratings
- **Progress Tracking** - Visual indicators showing your progress through each note
- **Markdown Export** - Export completed notes with all your work preserved
- **Offline-First Storage** - All data stored locally using IndexedDB for instant access
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Audio Feedback** - Subtle sound cues for actions and completions

## Tech Stack

- **React 18** - Modern UI library with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first styling
- **IndexedDB** - Client-side data persistence
- **Lucide React** - Beautiful, consistent icons
- **Clean Architecture** - Organized codebase with clear separation of concerns

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/sq5r.git
cd sq5r
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Other Commands

```bash
npm run lint       # Run ESLint
npm run typecheck  # Check TypeScript types
npm run preview    # Preview production build
```

## How to Use

1. **Create a Subject** - Start by creating a subject (e.g., "Biology 101", "History")
2. **Add a Note** - Within a subject, create a note for the material you want to study
3. **Survey** - Add headings, keywords, and images you notice in the material
4. **Question** - Write questions you want answered as you read
5. **Read** - Start the 25-minute timer and read the material with focus
6. **Record** - Answer your questions and add side notes as you discover insights
7. **Recite** - Test yourself by recalling information from memory
8. **Review** - Compare your recited answers with your notes and rate difficulty
9. **Reflect** - Write a reflection on what you learned and complete the session

The app will automatically schedule reviews based on spaced repetition principles. Notes due for review appear on the home screen.

## Project Structure

```
src/
├── contracts/          # Interface definitions
├── entities/          # Core data models
├── helpers/           # Utility functions
├── infrastructure/    # External integrations (IndexedDB, Supabase)
├── services/          # Business logic
└── views/             # UI components
```

The codebase follows clean architecture principles with clear separation between:
- Business logic (services)
- Data persistence (infrastructure)
- User interface (views)
- Core domain models (entities)
- Contracts (interfaces)

## Browser Support

This application works in all modern browsers that support:
- ES2015+ JavaScript
- IndexedDB
- CSS Grid and Flexbox

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Acknowledgments

- SQ5R method developed by Francis Pleasant Robinson
- Inspired by evidence-based learning techniques and spaced repetition research
