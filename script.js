// Quiz Application State
class QuizApp {
    constructor() {
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.score = { reading: 0, listening: 0, writing: 0 };
        this.timer = null;
        this.timeRemaining = 300; // 5 minutes per question
        this.questions = [];
        this.isQuizCompleted = false;
        this.voicesLoaded = false;

        this.initializeQuestions();
        this.initializeAudio();
        this.bindEvents();
        this.showScreen('startScreen');
    }

    initializeAudio() {
        // Ensure voices are loaded for Web Speech API
        if ('speechSynthesis' in window) {
            // Trigger voice loading
            speechSynthesis.getVoices();

            // Listen for voices changed event
            speechSynthesis.onvoiceschanged = () => {
                this.voicesLoaded = true;
                console.log('Voices loaded:', speechSynthesis.getVoices().length);
            };

            // Fallback timeout
            setTimeout(() => {
                if (speechSynthesis.getVoices().length > 0) {
                    this.voicesLoaded = true;
                }
            }, 1000);
        }
    }

    initializeQuestions() {
        this.questions = [
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
    }

    bindEvents() {
        // Start Quiz
        document.getElementById('startQuizBtn').addEventListener('click', () => {
            this.startQuiz();
        });

        // Navigation
        document.getElementById('nextBtn').addEventListener('click', () => {
            this.nextQuestion();
        });

        document.getElementById('prevBtn').addEventListener('click', () => {
            this.previousQuestion();
        });

        document.getElementById('submitBtn').addEventListener('click', () => {
            this.submitQuiz();
        });

        // Results actions
        document.getElementById('retakeBtn').addEventListener('click', () => {
            this.resetQuiz();
        });

        document.getElementById('reviewBtn').addEventListener('click', () => {
            this.showReview();
        });

        document.getElementById('backToResultsBtn').addEventListener('click', () => {
            this.showScreen('resultsScreen');
        });

        // Audio button for listening questions
        const playAudioBtn = document.getElementById('playAudioBtn');
        if (playAudioBtn) {
            playAudioBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.playAudio();
            });
        } else {
            console.error('playAudioBtn element not found!');
        }

        // Writing area word count
        document.getElementById('writingArea').addEventListener('input', (e) => {
            this.updateWordCount(e.target.value);
        });

        // Audio progress bar click
        document.getElementById('audioProgress').addEventListener('click', (e) => {
            this.seekAudio(e);
        });
    }

    startQuiz() {
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.isQuizCompleted = false;
        this.showScreen('quizScreen');
        this.displayQuestion();
        this.startTimer();
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.add('hidden');
        });
        document.getElementById(screenId).classList.remove('hidden');
    }

    displayQuestion() {
        const question = this.questions[this.currentQuestionIndex];
        const questionType = document.getElementById('questionType');

        // Hide all question content first
        document.querySelectorAll('.question-content').forEach(content => {
            content.classList.add('hidden');
        });

        // Update progress
        this.updateProgress();

        // Update navigation buttons
        this.updateNavigation();

        // Hide all question containers first
        document.getElementById('readingQuestion').classList.add('hidden');
        document.getElementById('listeningQuestion').classList.add('hidden');
        document.getElementById('writingQuestion').classList.add('hidden');
        this.hideAudioControls();

        // Display appropriate question type
        switch (question.type) {
            case 'reading':
                this.displayReadingQuestion(question);
                questionType.textContent = `📖 Reading Question ${this.getQuestionNumberByType('reading')}`;
                break;
            case 'listening':
                this.displayListeningQuestion(question);
                questionType.textContent = `🎧 Listening Question ${this.getQuestionNumberByType('listening')}`;
                break;
            case 'writing':
                this.displayWritingQuestion(question);
                questionType.textContent = `✍️ Writing Question ${this.getQuestionNumberByType('writing')}`;
                break;
        }
    }

    displayReadingQuestion(question) {
        document.getElementById('readingQuestion').classList.remove('hidden');
        document.getElementById('passage').textContent = question.passage;
        document.getElementById('question').textContent = question.question;

        const optionsContainer = document.getElementById('options');
        optionsContainer.innerHTML = '';

        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            optionElement.textContent = option;
            optionElement.addEventListener('click', () => {
                this.selectOption(optionsContainer, index);
            });
            optionsContainer.appendChild(optionElement);
        });

        // Restore previous answer if exists
        if (this.userAnswers[this.currentQuestionIndex] !== undefined) {
            this.selectOption(optionsContainer, this.userAnswers[this.currentQuestionIndex]);
        }
    }

    /**
     * Display a listening question
     * @param {Object} question - The listening question object
     */
    displayListeningQuestion(question) {
        // Remove hidden class from listening question screen
        document.getElementById('listeningQuestion').classList.remove('hidden');

        // Update question text
        document.getElementById('listeningQuestionText').textContent = question.question;

        // Update audio text
        document.getElementById('audioText').textContent = question.audioText;

        // Reset audio player and controls
        this.resetAudioPlayer();

        // Get options container
        const optionsContainer = document.getElementById('listeningOptions');

        // Clear all options
        optionsContainer.innerHTML = '';

        // Create options
        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            optionElement.textContent = option;
            optionElement.addEventListener('click', () => {
                this.selectOption(optionsContainer, index);
            });
            optionsContainer.appendChild(optionElement);
        });

        // Restore previous answer if exists
        if (this.userAnswers[this.currentQuestionIndex] !== undefined) {
            this.selectOption(optionsContainer, this.userAnswers[this.currentQuestionIndex]);
        }

        // Ensure audio button event is bound
        this.bindAudioButtonEvent();

        // Show audio controls for listening questions
        this.showAudioControls();
    }

    displayWritingQuestion(question) {
        console.log('Displaying writing question:', question);
        console.log('Writing prompt:', question.prompt);

        const writingQuestionEl = document.getElementById('writingQuestion');
        const writingPromptEl = document.getElementById('writingPrompt');

        if (!writingQuestionEl) {
            console.error('writingQuestion element not found!');
            return;
        }

        if (!writingPromptEl) {
            console.error('writingPrompt element not found!');
            return;
        }

        writingQuestionEl.classList.remove('hidden');
        writingPromptEl.textContent = question.prompt;

        console.log('Writing prompt element content:', writingPromptEl.textContent);

        const writingArea = document.getElementById('writingArea');
        if (writingArea) {
            writingArea.value = this.userAnswers[this.currentQuestionIndex] || '';
            this.updateWordCount(writingArea.value);
        } else {
            console.error('writingArea element not found!');
        }
    }

    selectOption(container, selectedIndex) {
        // Remove previous selections
        container.querySelectorAll('.option').forEach(opt => {
            opt.classList.remove('selected');
        });

        // Add selection to clicked option
        container.children[selectedIndex].classList.add('selected');

        // Save answer
        this.userAnswers[this.currentQuestionIndex] = selectedIndex;
    }

    async playAudio() {
        const question = this.questions[this.currentQuestionIndex];
        const audioPlayer = document.getElementById('audioPlayer');
        const playBtn = document.getElementById('playAudioBtn');
        const audioStatus = document.getElementById('audioStatus');
        const audioText = document.getElementById('audioText');

        if (question.type !== 'listening') {
            return;
        }

        // If audio is currently playing, pause it
        if (audioPlayer && !audioPlayer.paused) {
            this.pauseAudio();
            return;
        }

        // If audio is paused and has a source, try to resume
        if (audioPlayer && audioPlayer.src && audioPlayer.paused) {
            try {
                playBtn.textContent = '🔄 Loading...';
                playBtn.disabled = true;
                await audioPlayer.play();
                return;
            } catch (error) {
                console.warn('Resume failed, reloading audio:', error);
                // Reset and reload
                audioPlayer.removeAttribute('src');
                audioPlayer.load();
            }
        }

        // Try to play audio file first
        if (question.audioFile) {
            try {
                await this.playAudioFile(question.audioFile, playBtn, audioStatus, audioText);
            } catch (error) {
                console.warn('Audio file failed, falling back to TTS:', error);
                await this.playWithTextToSpeech(question.audioText, playBtn, audioStatus, audioText);
            }
        } else {
            // Fallback to text-to-speech if no audio file
            await this.playWithTextToSpeech(question.audioText, playBtn, audioStatus, audioText);
        }
    }

    async playAudioFile(audioFile, playBtn, audioStatus, audioText) {
        return new Promise((resolve, reject) => {
            const audioPlayer = document.getElementById('audioPlayer');

            // Show loading status
            this.showAudioStatus('Loading audio file...', 'loading');
            playBtn.textContent = '🔄 Loading...';
            playBtn.disabled = true;
            playBtn.className = 'audio-btn loading';

            // Set up audio player
            audioPlayer.src = audioFile;

            const handleLoadedMetadata = () => {
                this.updateAudioTime();
                playBtn.textContent = '▶️ Play';
                playBtn.disabled = false;
                playBtn.className = 'audio-btn';
                this.showAudioStatus('Audio ready to play', 'success');

                // Auto-hide success message after 3 seconds
                setTimeout(() => {
                    const statusEl = document.getElementById('audioStatus');
                    if (statusEl) statusEl.style.display = 'none';
                }, 3000);
            };

            const handleCanPlay = () => {
                if (playBtn.textContent.includes('Loading')) {
                    playBtn.textContent = '▶️ Play';
                    playBtn.disabled = false;
                    playBtn.className = 'audio-btn';
                }
            };

            const handlePlay = () => {
                playBtn.textContent = '⏸️ Pause';
                playBtn.className = 'audio-btn playing';
                this.startAudioProgressUpdate();
            };

            const handlePause = () => {
                playBtn.textContent = '▶️ Play';
                playBtn.className = 'audio-btn paused';
                this.stopAudioProgressUpdate();
            };

            const handleEnded = () => {
                playBtn.textContent = '🔄 Play Again';
                playBtn.className = 'audio-btn';
                this.stopAudioProgressUpdate();
                this.resetAudioProgress();

                // Show transcript after audio ends
                audioText.classList.remove('hidden');
                resolve();

                // Clean up event listeners
                this.cleanupAudioListeners(audioPlayer, {
                    handleLoadedMetadata,
                    handleCanPlay,
                    handlePlay,
                    handlePause,
                    handleEnded,
                    handleError
                });
            };

            const handleError = (event) => {
                console.error('Audio playback error:', event);
                this.showAudioStatus(`Audio file not found: ${audioFile}`, 'error');
                playBtn.textContent = '📄 Show Text';
                playBtn.disabled = false;
                playBtn.className = 'audio-btn';

                // Show transcript immediately on error
                audioText.classList.remove('hidden');
                reject(new Error(`Audio file failed: ${audioFile}`));

                // Clean up event listeners
                this.cleanupAudioListeners(audioPlayer, {
                    handleLoadedMetadata,
                    handleCanPlay,
                    handlePlay,
                    handlePause,
                    handleEnded,
                    handleError
                });
            };

            // Add event listeners
            audioPlayer.addEventListener('loadedmetadata', handleLoadedMetadata);
            audioPlayer.addEventListener('canplay', handleCanPlay);
            audioPlayer.addEventListener('play', handlePlay);
            audioPlayer.addEventListener('pause', handlePause);
            audioPlayer.addEventListener('ended', handleEnded);
            audioPlayer.addEventListener('error', handleError);

            // Load the audio
            audioPlayer.load();
        });
    }

    cleanupAudioListeners(audioPlayer, handlers) {
        if (audioPlayer && handlers) {
            Object.values(handlers).forEach(handler => {
                if (typeof handler === 'function') {
                    audioPlayer.removeEventListener('loadedmetadata', handler);
                    audioPlayer.removeEventListener('canplay', handler);
                    audioPlayer.removeEventListener('play', handler);
                    audioPlayer.removeEventListener('pause', handler);
                    audioPlayer.removeEventListener('ended', handler);
                    audioPlayer.removeEventListener('error', handler);
                }
            });
        }
    }

    bindAudioButtonEvent() {
        const playAudioBtn = document.getElementById('playAudioBtn');
        if (playAudioBtn && !playAudioBtn.hasAttribute('data-event-bound')) {
            console.log('Binding audio button event');
            playAudioBtn.addEventListener('click', (e) => {
                console.log('Play audio button clicked');
                e.preventDefault();
                e.stopPropagation();
                this.playAudio();
            });
            playAudioBtn.setAttribute('data-event-bound', 'true');
        }
    }

    showAudioControls() {
        const audioContainer = document.querySelector('.audio-container');
        if (audioContainer) {
            audioContainer.style.display = 'block';
        }
    }

    hideAudioControls() {
        const audioContainer = document.querySelector('.audio-container');
        if (audioContainer) {
            audioContainer.style.display = 'none';
        }
    }

    pauseAudio() {
        const audioPlayer = document.getElementById('audioPlayer');
        const playBtn = document.getElementById('playAudioBtn');

        if (audioPlayer && !audioPlayer.paused) {
            audioPlayer.pause();
        }

        // Also stop any speech synthesis
        if ('speechSynthesis' in window) {
            speechSynthesis.cancel();
        }
    }

    async playWithTextToSpeech(text, playBtn, audioStatus, audioText) {
        this.showAudioStatus('Using text-to-speech fallback...', 'loading');

        if ('speechSynthesis' in window) {
            return new Promise((resolve, reject) => {
                speechSynthesis.cancel();

                const utterance = new SpeechSynthesisUtterance(text);
                utterance.rate = 0.85;
                utterance.pitch = 1.0;
                utterance.volume = 1.0;

                // Try to get a good English voice
                const voices = speechSynthesis.getVoices();
                const englishVoice = voices.find(voice => voice.lang.startsWith('en'));
                if (englishVoice) {
                    utterance.voice = englishVoice;
                }

                utterance.onstart = () => {
                    playBtn.textContent = '⏸️ Stop';
                    playBtn.className = 'audio-btn playing';
                    this.showAudioStatus('Playing with text-to-speech...', 'loading');
                };

                utterance.onend = () => {
                    playBtn.textContent = '🔄 Play Again';
                    playBtn.className = 'audio-btn';
                    audioText.classList.remove('hidden');
                    document.getElementById('audioStatus').style.display = 'none';
                    resolve();
                };

                utterance.onerror = (event) => {
                    console.error('TTS Error:', event);
                    this.showAudioFallback(playBtn, audioText);
                    reject(event.error);
                };

                speechSynthesis.speak(utterance);
            });
        } else {
            this.showAudioFallback(playBtn, audioText);
            return Promise.resolve();
        }
    }

    showAudioStatus(message, type) {
        const audioStatus = document.getElementById('audioStatus');
        audioStatus.textContent = message;
        audioStatus.className = `audio-status ${type}`;
        audioStatus.style.display = 'block';
    }

    updateAudioTime() {
        const audioPlayer = document.getElementById('audioPlayer');
        const currentTimeEl = document.getElementById('currentTime');
        const durationEl = document.getElementById('duration');

        if (audioPlayer && !isNaN(audioPlayer.duration)) {
            currentTimeEl.textContent = this.formatTime(audioPlayer.currentTime || 0);
            durationEl.textContent = this.formatTime(audioPlayer.duration || 0);
        }
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    startAudioProgressUpdate() {
        this.audioProgressInterval = setInterval(() => {
            const audioPlayer = document.getElementById('audioPlayer');
            const progressFill = document.getElementById('audioProgressFill');

            if (audioPlayer && !isNaN(audioPlayer.duration) && audioPlayer.duration > 0) {
                const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
                progressFill.style.width = `${progress}%`;
                this.updateAudioTime();
            }
        }, 100);
    }

    stopAudioProgressUpdate() {
        if (this.audioProgressInterval) {
            clearInterval(this.audioProgressInterval);
            this.audioProgressInterval = null;
        }
    }

    resetAudioProgress() {
        const progressFill = document.getElementById('audioProgressFill');
        progressFill.style.width = '0%';
        this.updateAudioTime();
    }

    seekAudio(event) {
        const audioPlayer = document.getElementById('audioPlayer');
        const progressBar = event.currentTarget.querySelector('.progress-bar-audio');

        if (audioPlayer && !isNaN(audioPlayer.duration) && audioPlayer.duration > 0) {
            const rect = progressBar.getBoundingClientRect();
            const clickX = event.clientX - rect.left;
            const progressBarWidth = rect.width;
            const clickPercentage = clickX / progressBarWidth;

            const newTime = clickPercentage * audioPlayer.duration;
            audioPlayer.currentTime = newTime;

            // Update progress immediately
            const progressFill = document.getElementById('audioProgressFill');
            progressFill.style.width = `${clickPercentage * 100}%`;
            this.updateAudioTime();
        }
    }

    resetAudioPlayer() {
        // Stop any playing audio
        this.pauseAudio();
        this.stopAudioProgressUpdate();

        // Clear source to prevent stale state
        const audioPlayer = document.getElementById('audioPlayer');
        if (audioPlayer) {
            audioPlayer.removeAttribute('src');
            audioPlayer.load();
        }

        // Reset UI elements
        const playBtn = document.getElementById('playAudioBtn');
        const audioStatus = document.getElementById('audioStatus');
        const audioText = document.getElementById('audioText');

        playBtn.textContent = '🔊 Play Audio';
        playBtn.disabled = false;
        playBtn.className = 'audio-btn';

        audioStatus.style.display = 'none';
        audioText.classList.add('hidden');

        // Reset progress bar
        this.resetAudioProgress();

        // Reset time display
        document.getElementById('currentTime').textContent = '0:00';
        document.getElementById('duration').textContent = '0:00';
    }


    showAudioFallback(playBtn, audioText) {
        // Show text immediately as fallback
        playBtn.textContent = '📄 Show Text';
        playBtn.disabled = false;
        audioText.classList.remove('hidden');

        // Update button to just show/hide text
        playBtn.onclick = () => {
            if (audioText.classList.contains('hidden')) {
                audioText.classList.remove('hidden');
                playBtn.textContent = '📄 Hide Text';
            } else {
                audioText.classList.add('hidden');
                playBtn.textContent = '📄 Show Text';
            }
        };

        // Show a helpful message
        const helpText = document.createElement('div');
        helpText.className = 'audio-help';
        helpText.style.cssText = 'color: #666; font-size: 0.9em; margin-top: 10px; text-align: center;';
        helpText.textContent = '🎧 Audio not available - text displayed below';
        audioText.parentNode.insertBefore(helpText, audioText);
    }

    updateWordCount(text) {
        const words = text.trim().split(/\s+/).filter(word => word.length > 0);
        document.getElementById('wordCount').textContent = words.length;
    }

    getQuestionNumberByType(type) {
        let count = 0;
        for (let i = 0; i <= this.currentQuestionIndex; i++) {
            if (this.questions[i].type === type) {
                count++;
            }
        }
        return count;
    }

    updateProgress() {
        const progress = ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
        document.getElementById('progressFill').style.width = `${progress}%`;
        document.getElementById('progressText').textContent =
            `Question ${this.currentQuestionIndex + 1} of ${this.questions.length}`;
    }

    updateNavigation() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const submitBtn = document.getElementById('submitBtn');

        prevBtn.disabled = this.currentQuestionIndex === 0;

        if (this.currentQuestionIndex === this.questions.length - 1) {
            nextBtn.classList.add('hidden');
            submitBtn.classList.remove('hidden');
        } else {
            nextBtn.classList.remove('hidden');
            submitBtn.classList.add('hidden');
        }
    }

    nextQuestion() {
        // Save writing answer if on writing question
        if (this.questions[this.currentQuestionIndex].type === 'writing') {
            this.userAnswers[this.currentQuestionIndex] = document.getElementById('writingArea').value;
        }

        if (this.currentQuestionIndex < this.questions.length - 1) {
            this.currentQuestionIndex++;
            this.displayQuestion();
        }
    }

    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.displayQuestion();
        }
    }

    startTimer() {
        this.timeRemaining = 300; // 5 minutes
        this.updateTimerDisplay();

        this.timer = setInterval(() => {
            this.timeRemaining--;
            this.updateTimerDisplay();

            if (this.timeRemaining <= 0) {
                clearInterval(this.timer);
                this.submitQuiz();
            }
        }, 1000);
    }

    updateTimerDisplay() {
        const minutes = Math.floor(this.timeRemaining / 60);
        const seconds = this.timeRemaining % 60;
        document.getElementById('timer').textContent =
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    submitQuiz() {
        // Save current writing answer if applicable
        if (this.questions[this.currentQuestionIndex].type === 'writing') {
            this.userAnswers[this.currentQuestionIndex] = document.getElementById('writingArea').value;
        }

        clearInterval(this.timer);
        this.calculateScore();
        this.showResults();
    }

    calculateScore() {
        this.score = { reading: 0, listening: 0, writing: 0 };

        this.questions.forEach((question, index) => {
            const userAnswer = this.userAnswers[index];

            if (question.type === 'reading' || question.type === 'listening') {
                if (userAnswer === question.correct) {
                    this.score[question.type]++;
                }
            } else if (question.type === 'writing') {
                // Simple writing assessment based on word count and content presence
                if (userAnswer && userAnswer.trim().length > 50) {
                    const words = userAnswer.trim().split(/\s+/).filter(word => word.length > 0);
                    if (words.length >= question.minWords * 0.7) { // At least 70% of minimum words
                        this.score.writing++;
                    }
                }
            }
        });
    }

    showResults() {
        this.showScreen('resultsScreen');

        const totalQuestions = this.questions.length;
        const totalCorrect = this.score.reading + this.score.listening + this.score.writing;
        const percentage = Math.round((totalCorrect / totalQuestions) * 100);

        document.getElementById('scorePercentage').textContent = `${percentage}%`;

        // Count questions by type
        const readingTotal = this.questions.filter(q => q.type === 'reading').length;
        const listeningTotal = this.questions.filter(q => q.type === 'listening').length;
        const writingTotal = this.questions.filter(q => q.type === 'writing').length;

        document.getElementById('readingScore').textContent = `${this.score.reading}/${readingTotal}`;
        document.getElementById('listeningScore').textContent = `${this.score.listening}/${listeningTotal}`;
        document.getElementById('writingScore').textContent = `${this.score.writing}/${writingTotal}`;
    }

    showReview() {
        this.showScreen('reviewScreen');
        const reviewContainer = document.getElementById('reviewQuestions');
        reviewContainer.innerHTML = '';

        this.questions.forEach((question, index) => {
            const reviewElement = document.createElement('div');
            reviewElement.className = 'review-question';

            let content = `<div class="review-question-text">Question ${index + 1} (${question.type})</div>`;

            if (question.type === 'reading') {
                const userAnswer = this.userAnswers[index];
                const isCorrect = userAnswer === question.correct;
                content += `<div class="review-answer ${isCorrect ? 'correct' : 'incorrect'}">
                    Your answer: ${question.options[userAnswer] || 'Not answered'}
                </div>`;
                if (!isCorrect) {
                    content += `<div class="review-answer correct">
                        Correct answer: ${question.options[question.correct]}
                    </div>`;
                }
                content += `<div class="review-explanation">${question.explanation}</div>`;
            } else if (question.type === 'listening') {
                const userAnswer = this.userAnswers[index];
                const isCorrect = userAnswer === question.correct;
                content += `<div class="review-answer ${isCorrect ? 'correct' : 'incorrect'}">
                    Your answer: ${question.options[userAnswer] || 'Not answered'}
                </div>`;
                if (!isCorrect) {
                    content += `<div class="review-answer correct">
                        Correct answer: ${question.options[question.correct]}
                    </div>`;
                }
                content += `<div class="review-explanation">${question.explanation}</div>`;
            } else if (question.type === 'writing') {
                const userAnswer = this.userAnswers[index] || 'Not answered';
                const wordCount = userAnswer.trim().split(/\s+/).filter(word => word.length > 0).length;
                content += `<div class="review-answer">
                    Word count: ${wordCount} (Required: ${question.minWords}-${question.maxWords})
                </div>`;
                content += `<div class="review-explanation">
                    <strong>Your response:</strong><br>${userAnswer.substring(0, 200)}${userAnswer.length > 200 ? '...' : ''}
                </div>`;
            }

            reviewElement.innerHTML = content;
            reviewContainer.appendChild(reviewElement);
        });
    }

    resetQuiz() {
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.score = { reading: 0, listening: 0, writing: 0 };
        this.isQuizCompleted = false;
        clearInterval(this.timer);
        this.showScreen('startScreen');
    }
}

// Initialize the quiz when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.quiz = new QuizApp();
    console.log('Quiz app initialized and exposed as window.quiz');
});
