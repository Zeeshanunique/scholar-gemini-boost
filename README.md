# Scholar Gemini Boost - AI-Driven Learning Platform

## Project Overview

Scholar Gemini Boost is an innovative educational platform powered by Google's Gemini AI that helps identify slow learners and provides personalized remedial teaching strategies. The platform is designed to support teachers in delivering effective, targeted interventions based on comprehensive student assessments.

## Key Features

### 1. Comprehensive Learning Assessment
- **Academic Performance Analysis**: Collects and analyzes test scores across subjects
- **Learning Style Detection**: Identifies each student's preferred learning modality (visual, auditory, kinesthetic, etc.)
- **Behavioral Metrics Tracking**: Monitors engagement, motivation, attention span, and other behavioral factors

### 2. AI-Powered Remedial Strategies
- **Personalized Learning Plans**: Creates tailored remedial approaches for each student
- **Conceptual Gap Identification**: Pinpoints specific concepts that need reinforcement
- **Customized Practice Exercises**: Generates targeted practice activities to strengthen weak areas

### 3. Teacher Dashboard & Analytics
- **Classroom Performance Overview**: Visualizes class-wide performance metrics
- **At-Risk Student Identification**: Highlights students requiring immediate intervention
- **Improvement Tracking**: Monitors progress over time with detailed analytics
- **Effective Intervention Analysis**: Identifies which teaching strategies yield the best results

### 4. Innovative Teaching Methods
- **Learning Style-Based Approaches**: Suggests teaching techniques aligned with student learning preferences
- **Multi-Sensory Strategies**: Provides resources for varied instruction methods
- **Engagement Enhancement**: Offers activities to boost student motivation and participation

## Getting Started

### Prerequisites
- Node.js & npm - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- Google Gemini API key - [Get a key from Google AI Studio](https://aistudio.google.com/)

### Installation

```sh
# Step 1: Clone the repository
git clone https://github.com/YourUsername/scholar-gemini-boost.git

# Step 2: Navigate to the project directory
cd scholar-gemini-boost

# Step 3: Install dependencies
npm install

# Step 4: Create a .env file in the root directory with your Gemini API key
# Add this line to the .env file:
VITE_GEMINI_API_KEY=your_api_key_here

# Step 5: Start the development server
npm run dev
```

### Usage

1. **Enter API Key**: On first use, enter your Google Gemini API key
2. **Access Assessment**: Enter student data including test scores, behavioral observations, and learning preferences
3. **Review Recommendations**: Explore personalized remedial strategies and teaching approaches
4. **Monitor Progress**: Track student improvement over time through the Teacher Dashboard

## Technologies Used

This project is built with modern web technologies:

- **Vite**: Next-generation frontend build tool
- **React**: UI component library
- **TypeScript**: Type-safe JavaScript
- **Google Gemini AI**: Advanced AI model for generating personalized learning insights
- **shadcn-ui**: High-quality UI components
- **Tailwind CSS**: Utility-first CSS framework
- **Recharts**: Composable charting library for data visualization

## Deployment

This application can be deployed to any standard hosting platform that supports Node.js applications, such as:

- Vercel
- Netlify
- GitHub Pages
- AWS Amplify

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
