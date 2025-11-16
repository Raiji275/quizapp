# English Quiz Web App

A comprehensive web application for testing English language skills through reading comprehension, listening exercises, and writing tasks.

## Features

### 🔥 Core Features
- **Reading Comprehension**: Multiple choice questions based on passages covering various topics
- **Listening Exercises**: Audio-based questions using text-to-speech technology
- **Writing Tasks**: Essay and paragraph writing with word count tracking
- **Progress Tracking**: Real-time progress bar and question navigation
- **Timer**: 5-minute timer to add urgency to the quiz experience
- **Scoring System**: Detailed breakdown by skill type (Reading, Listening, Writing)
- **Review Mode**: Comprehensive answer review with explanations

### 💫 User Experience
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI**: Clean, gradient-based design with smooth animations
- **Intuitive Navigation**: Easy-to-use Previous/Next buttons with smart state management
- **Visual Feedback**: Color-coded answers and interactive elements
- **Accessibility**: Clear typography and high contrast colors

## Technologies Used

- **HTML5**: Semantic markup and modern web standards
- **CSS3**: Advanced styling with Flexbox, Grid, and animations
- **JavaScript (ES6+)**: Modern JavaScript with classes and modules
- **Web Speech API**: Text-to-speech for listening questions
- **Google Fonts**: Poppins font family for modern typography

## File Structure

```
english-quiz-app/
├── index.html          # Main HTML structure
├── style.css           # Comprehensive CSS styling
├── script.js           # JavaScript functionality and quiz logic
├── audio-test.html     # Audio testing and diagnostics page
├── generate-audio.html # Tool to generate audio files for listening questions
├── audio/              # Directory containing audio files for listening questions
│   ├── README.md       # Instructions for adding audio files
│   ├── listening1.mp3  # Audio for time management question
│   ├── listening2.mp3  # Audio for museum guide question
│   └── listening3.mp3  # Audio for flight announcement question
└── README.md           # This documentation file
```

## Quiz Content

### Reading Questions (4 total)
- **Artificial Intelligence**: Understanding AI's evolution and impact
- **Climate Change**: Causes and solutions for environmental challenges
- **Communication Skills**: Effective communication in a globalized world
- **Digital Revolution**: Benefits and challenges of digital transformation

### Listening Questions (3 total)
- **Time Management**: Academic success strategies
- **Museum Guide**: Ancient civilizations exhibit information
- **Flight Announcement**: Captain's update on flight status

### Writing Questions (3 total)
- **Language Learning Essay**: 150-200 words on multilingual benefits
- **Letter to Future Self**: 100-150 words personal reflection
- **Social Media Argument**: 120-180 words persuasive writing

## How to Use

### Getting Started
1. **Open the Application**: Double-click `index.html` or open it in any modern web browser
2. **Welcome Screen**: Read the introduction and click "Start Quiz"
3. **Take the Quiz**: Navigate through questions using Previous/Next buttons
4. **Submit**: Click "Submit Quiz" after completing all questions

### Question Types

#### Reading Questions
- Read the passage carefully
- Answer the multiple-choice question
- Click your selected answer to highlight it
- Use Previous/Next to navigate

#### Listening Questions
- Click the "🔊 Play Audio" button to hear the content
- Listen carefully (audio can be replayed)
- Answer the multiple-choice question based on what you heard
- The transcript appears after playing the audio

#### Writing Questions
- Read the prompt carefully
- Write your response in the text area
- Monitor the word count in the bottom-right corner
- Stay within the specified word limits

### Results and Review
- **Score Display**: See your overall percentage and breakdown by skill
- **Retake Option**: Start the quiz again with a fresh attempt
- **Review Answers**: See correct answers and explanations for all questions

## Technical Details

### Browser Compatibility
- **Chrome**: Full support including Web Speech API
- **Firefox**: Full support including Web Speech API
- **Safari**: Full support with text-to-speech
- **Edge**: Full support with all features
- **Mobile Browsers**: Responsive design works on all mobile browsers

### Audio Features & File Support
The listening questions now use actual audio files for the best quality experience:

#### Primary Method: Audio Files (NEW!)
- **High-quality audio**: Uses MP3/WAV files for crystal-clear listening experience
- **Professional audio controls**: Play/pause, progress bar, time display
- **Clickable progress bar**: Seek to any position in the audio
- **Visual feedback**: Progress indicator and playback status
- **Multiple format support**: MP3, WAV, OGG audio files

#### Audio File Management
- **Audio generator**: Use `generate-audio.html` to create audio files
- **Multiple creation methods**: Record yourself, use TTS services, or AI voices
- **Flexible naming**: Simply place files as `listening1.mp3`, `listening2.mp3`, etc.
- **Automatic detection**: Quiz automatically detects and uses available audio files

#### Fallback Method: Text-to-Speech
- **Automatic fallback**: If audio files are missing, uses browser TTS
- **Smart voice selection**: Prioritizes local English voices for reliability
- **Error handling**: Gracefully handles both file and TTS failures

#### Audio Tools
- **Audio Test Page**: `audio-test.html` - Test TTS compatibility and voices
- **Audio Generator**: `generate-audio.html` - Create audio files easily
- **Detailed Instructions**: Check `audio/README.md` for setup guide

#### Browser Compatibility
- **Universal support**: Audio files work in all modern browsers
- **Mobile friendly**: Full support on smartphones and tablets
- **No plugins required**: Uses standard HTML5 audio element

If everything fails:
- The transcript text is displayed automatically
- All quiz functionality remains intact
- Use the diagnostic tools to troubleshoot issues

### Performance
- **Lightweight**: No external dependencies except Google Fonts
- **Fast Loading**: Optimized CSS and JavaScript
- **Memory Efficient**: Clean event handling and DOM manipulation

## Customization Options

### Adding Questions
Edit the `initializeQuestions()` method in `script.js`:

```javascript
// Reading Question Example
{
    type: 'reading',
    passage: 'Your passage text here...',
    question: 'Your question here?',
    options: ['Option A', 'Option B', 'Option C', 'Option D'],
    correct: 1, // Index of correct answer (0-based)
    explanation: 'Explanation of the correct answer'
}

// Listening Question Example
{
    type: 'listening',
    audioText: 'Text to be spoken by text-to-speech',
    question: 'Your question here?',
    options: ['Option A', 'Option B', 'Option C', 'Option D'],
    correct: 2,
    explanation: 'Explanation of the correct answer'
}

// Writing Question Example
{
    type: 'writing',
    prompt: 'Your writing prompt here...',
    minWords: 100,
    maxWords: 200,
    rubric: {
        content: 'Content expectations',
        organization: 'Structure expectations',
        language: 'Language use expectations'
    }
}
```

### Styling Modifications
- **Colors**: Modify CSS custom properties at the top of `style.css`
- **Fonts**: Change the Google Fonts import and font-family declarations
- **Layout**: Adjust responsive breakpoints in the media queries
- **Animations**: Modify transition and transform properties

### Timer Settings
Change the timer duration in the `startTimer()` method:
```javascript
this.timeRemaining = 300; // Change to desired seconds
```

## Educational Benefits

### For Learners
- **Comprehensive Assessment**: Tests multiple language skills in one session
- **Immediate Feedback**: Instant results with detailed explanations
- **Self-Paced Learning**: Take time to read and understand questions
- **Progress Tracking**: See strengths and areas for improvement

### For Educators
- **Standardized Testing**: Consistent question format and timing
- **Multiple Skills**: Assess reading, listening, and writing in one tool
- **Easy Customization**: Add your own questions and content
- **Detailed Analytics**: Breakdown scores by skill type

## Future Enhancements

### Planned Features
- **User Accounts**: Save progress and track improvement over time
- **Question Bank**: Larger pool of randomized questions
- **Difficulty Levels**: Beginner, intermediate, and advanced options
- **Audio Files**: Support for pre-recorded audio instead of text-to-speech
- **Export Results**: PDF or CSV export of quiz results
- **Detailed Analytics**: Time spent per question, attempt history

### Technical Improvements
- **Offline Support**: Service worker for offline functionality
- **Database Integration**: Store questions and results in a database
- **Real Audio**: Integration with actual audio file playback
- **Advanced Scoring**: More sophisticated writing assessment algorithms

## Troubleshooting

### Common Issues

1. **Audio Not Playing**
   - Ensure your browser supports Web Speech API
   - Check browser audio permissions
   - Try using Chrome or Firefox for better compatibility

2. **Questions Not Loading**
   - Ensure JavaScript is enabled in your browser
   - Check the browser console for error messages
   - Refresh the page and try again

3. **Responsive Issues**
   - Clear browser cache and reload
   - Test on different screen sizes
   - Ensure CSS files are loading properly

4. **Timer Not Working**
   - Check if JavaScript is enabled
   - Look for console errors
   - Refresh the application

## License

This project is open source and available under the [MIT License](https://opensource.org/licenses/MIT).

## Contributing

Feel free to fork this project and submit pull requests for improvements. Some areas where contributions would be welcome:

- Additional question content
- Improved writing assessment algorithms
- Enhanced accessibility features
- Mobile app version
- Integration with learning management systems

## Contact

If you have questions, suggestions, or would like to contribute, please feel free to reach out or create an issue in the project repository.

---

**Enjoy testing your English skills with this comprehensive quiz application!** 🎓✨
