# CCO VibeCoder Platform

CCO (Chief Cognitive Officer) is an AI-powered platform that enhances client-developer collaboration through intelligent meeting analysis and documentation generation. The platform processes meetings, extracts key insights, and automatically generates project documentation, requirements, and code scaffolds.

## Features

- **Meeting Analysis**: Automatically analyze Zoom meetings to extract key points, action items, and insights
- **Document Generation**: Create PRDs, architecture proposals, and code scaffolds based on meeting content
- **Dashboard Experience**: View and manage all your meetings, documents, and projects in a unified interface
- **Client-Vibecoder Matching**: Connect clients with developers who match their communication style and project needs
- **Recommendations**: Receive real-time suggestions during meetings to improve communication and project outcomes
- **AI Assistance**: Get intelligent answers and suggestions powered by Amazon Bedrock AI integration

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/cco-platform.git
   cd cco-platform
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
cco-platform/
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── dashboard/      # Dashboard components
│   │   ├── layout/         # Layout components
│   │   ├── meetings/       # Meeting components
│   │   └── ui/             # Reusable UI components
│   ├── pages/              # Next.js pages
│   ├── styles/             # Global styles
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Utility functions
├── .gitignore              # Git ignore file
├── next.config.js          # Next.js configuration
├── package.json            # Project dependencies
├── postcss.config.js       # PostCSS configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **UI Components**: Headless UI, Heroicons
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Data Visualization**: Chart.js, React-ChartJS-2
- **Content Rendering**: React Markdown
- **Date Handling**: date-fns
- **AI Integration**: Amazon Bedrock with Claude 3 models

## Amazon Bedrock Integration

The platform includes integration with Amazon Bedrock for AI capabilities. For detailed setup and usage instructions, see [README-BEDROCK.md](README-BEDROCK.md).

Key features:
- AI-powered chat interface
- Contextual answers based on project information
- Support for multiple AI models (Claude, Titan)
- Simple API for developers to integrate AI capabilities into any component

Setting up Bedrock requires:
1. AWS credentials with Bedrock access
2. Configuration in your `.env.local` file
3. Enabling access to the AI models in AWS Bedrock console

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## Future Enhancements

- Integration with more meeting platforms beyond Zoom
- Advanced analytics for meeting trends and insights
- Team collaboration features
- Mobile application
- AI-powered code suggestion and implementation

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For questions or support, please contact: support@vibecoder.dev 