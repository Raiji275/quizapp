// Default quiz questions used when no PocketBase quiz is loaded yet
// This mirrors the original initializeQuestions() data.

window.DEFAULT_QUESTIONS = [
    // Reading Questions (4 questions)
    {
        type: 'reading',
        passage: `The concept of artificial intelligence has evolved dramatically over the past few decades. Originally conceived as a way to create machines that could think like humans, AI has now become integral to many aspects of our daily lives. From recommendation algorithms on streaming platforms to navigation systems in our cars, AI is quietly working behind the scenes to make our experiences more personalized and efficient. However, this rapid advancement also raises important questions about privacy, job displacement, and the future of human-machine interaction.`,
        question: 'What is the main idea of this passage?',
        options: [
            'AI was created to replace human thinking entirely',
            'AI has evolved and become integrated into daily life while raising important concerns',
            'AI is only useful for entertainment and navigation',
            'AI development has stopped in recent years'
        ],
        correct: 1,
        explanation: 'The passage discusses how AI has evolved from its original concept to become integrated into daily life, while also noting the important questions it raises.'
    },
    {
        type: 'reading',
        passage: `Climate change represents one of the most pressing challenges of our time. Rising global temperatures, melting ice caps, and extreme weather patterns are just some of the visible signs of our changing planet. Scientists worldwide agree that human activities, particularly the burning of fossil fuels, are the primary drivers of these changes. While the challenges are significant, there are reasons for hope. Renewable energy technologies are becoming more affordable and efficient, and many countries are committing to ambitious carbon reduction targets.`,
        question: 'According to the passage, what is the primary cause of climate change?',
        options: [
            'Natural weather patterns',
            'Melting ice caps',
            'Human activities, especially burning fossil fuels',
            'Renewable energy technologies'
        ],
        correct: 2,
        explanation: 'The passage explicitly states that scientists agree human activities, particularly burning fossil fuels, are the primary drivers of climate change.'
    },
    {
        type: 'reading',
        passage: `The art of effective communication extends far beyond simply speaking clearly. It involves active listening, understanding cultural contexts, and adapting your message to your audience. In today's globalized world, these skills are more important than ever. Whether you're presenting to colleagues, writing an email to international partners, or simply having a conversation with a friend, the ability to communicate effectively can make the difference between success and misunderstanding.`,
        question: 'What does effective communication involve according to the passage?',
        options: [
            'Only speaking clearly and loudly',
            'Active listening, cultural understanding, and audience adaptation',
            'Using complex vocabulary and grammar',
            'Avoiding international communication'
        ],
        correct: 1,
        explanation: 'The passage states that effective communication involves active listening, understanding cultural contexts, and adapting your message to your audience.'
    },
    {
        type: 'reading',
        passage: `The digital revolution has transformed the way we work, learn, and connect with others. Remote work, once considered an exception, has become commonplace. Online education platforms have democratized access to learning, allowing people from around the world to acquire new skills and knowledge. Social media has redefined how we maintain relationships and share experiences. However, this digital transformation also brings challenges, including screen fatigue, digital privacy concerns, and the need for digital literacy skills.`,
        question: 'What is mentioned as both a benefit and a challenge of the digital revolution?',
        options: [
            'Remote work has become commonplace',
            'Online education has democratized learning',
            'The transformation brings both opportunities and challenges like privacy concerns',
            'Social media has changed relationships'
        ],
        correct: 2,
        explanation: 'The passage presents the digital revolution as bringing both benefits (remote work, online education, social media) and challenges (screen fatigue, privacy concerns, need for digital literacy).'
    },

    // Listening Questions (3 questions)
    {
        type: 'listening',
        audioFile: 'audio/listening1.mp3',
        audioText: `Good morning, everyone. Today we'll be discussing the importance of time management in academic success. Studies have shown that students who effectively manage their time are more likely to achieve better grades and experience less stress. The key components of good time management include setting priorities, creating schedules, avoiding procrastination, and taking regular breaks. Remember, it's not about working harder, but working smarter.`,
        question: 'According to the audio, what are the key components of good time management?',
        options: [
            'Working harder and longer hours',
            'Setting priorities, creating schedules, avoiding procrastination, and taking breaks',
            'Only focusing on difficult subjects',
            'Studying without any breaks'
        ],
        correct: 1,
        explanation: 'The audio specifically mentions these four key components of good time management.'
    },
    {
        type: 'listening',
        audioFile: 'audio/listening2.mp3',
        audioText: `Welcome to the museum's audio guide for the Ancient Civilizations exhibit. As you walk through this section, you'll discover artifacts from ancient Egypt, Greece, and Rome. The highlight of this exhibit is a 3,000-year-old Egyptian sarcophagus, discovered in the Valley of the Kings in 1922. The intricate hieroglyphics tell the story of a high priest who served during the reign of Ramesses II. Please take your time to examine the detailed craftsmanship and consider how these artifacts connect us to our shared human history.`,
        question: 'When was the Egyptian sarcophagus discovered?',
        options: [
            '3,000 years ago',
            '1922',
            'During the reign of Ramesses II',
            'The audio doesn\'t specify'
        ],
        correct: 1,
        explanation: 'The audio clearly states that the sarcophagus was discovered in the Valley of the Kings in 1922.'
    },
    {
        type: 'listening',
        audioFile: 'audio/listening3.mp3',
        audioText: `Attention passengers, this is your captain speaking. We're currently cruising at 35,000 feet with clear skies ahead. Our estimated arrival time in London is 2:30 PM local time, which puts us about 15 minutes ahead of schedule. The weather in London is partly cloudy with a temperature of 18 degrees Celsius. We'll begin our descent in approximately one hour. Thank you for flying with us today, and we hope you're enjoying your flight.`,
        question: 'How does the current flight status compare to the original schedule?',
        options: [
            'The flight is running 15 minutes late',
            'The flight is on schedule',
            'The flight is 15 minutes ahead of schedule',
            'The schedule information is not provided'
        ],
        correct: 2,
        explanation: 'The captain announces that the estimated arrival time puts them about 15 minutes ahead of schedule.'
    },

    // Writing Questions (3 questions)
    {
        type: 'writing',
        prompt: `Write a short essay (150-200 words) about the importance of learning a second language. In your response, discuss at least two benefits of being multilingual and provide specific examples or personal experiences if applicable.`,
        minWords: 40,
        maxWords: 90,
        rubric: {
            content: 'Discusses at least two clear benefits with examples',
            organization: 'Clear structure with introduction, body, and conclusion',
            language: 'Appropriate vocabulary and grammar',
            wordCount: 'Within the specified word limit'
        }
    },
    {
        type: 'writing',
        prompt: `Imagine you are writing a letter to your future self 10 years from now. Write a paragraph (100-150 words) describing your current goals, interests, and what you hope to achieve in the next decade. Use appropriate letter formatting and maintain a personal, reflective tone.`,
        minWords: 40,
        maxWords: 90,
        rubric: {
            content: 'Discusses current goals and future aspirations',
            tone: 'Personal and reflective',
            format: 'Appropriate letter format',
            language: 'Clear expression of ideas'
        }
    },
    {
        type: 'writing',
        prompt: `Write a persuasive paragraph (120-180 words) arguing for or against the statement: "Social media has a positive impact on society." Support your position with specific reasons and examples. Make sure to acknowledge the opposing viewpoint briefly.`,
        minWords: 40,
        maxWords: 90,
        rubric: {
            argument: 'Clear position with supporting reasons',
            examples: 'Specific examples provided',
            counterargument: 'Acknowledges opposing viewpoint',
            persuasion: 'Convincing and well-structured argument'
        }
    }
];
