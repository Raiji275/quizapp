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
        if (Array.isArray(window.DEFAULT_QUESTIONS)) {
            this.questions = window.DEFAULT_QUESTIONS.slice();
        } else {
            this.questions = [];
        }
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

        // Try to play audio file first, then external TTS, then browser TTS as final fallback
        if (question.audioFile) {
            try {
                await this.playAudioFile(question.audioFile, playBtn, audioStatus, audioText);
                return;
            } catch (error) {
                console.warn('Audio file failed, falling back to external TTS:', error);
            }
        }

        // If no audioFile or it failed, try free external TTS first
        if (question.audioText) {
            try {
                await this.playWithExternalTTS(question.audioText, playBtn, audioStatus, audioText);
                return;
            } catch (error) {
                console.warn('External TTS failed, falling back to browser TTS:', error);
            }
        }

        // Fallback to browser text-to-speech
        if (question.audioText) {
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
        this.showAudioStatus('Using browser text-to-speech...', 'loading');

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
                    this.showAudioStatus('Playing with browser text-to-speech...', 'loading');
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

    async playWithExternalTTS(text, playBtn, audioStatus, audioText) {
        // Use a free, keyless TTS endpoint (StreamElements) to generate audio from text.
        // If this fails (network/CORS), the caller will fall back to browser TTS.
        const ttsUrl = `https://api.streamelements.com/kappa/v2/speech?voice=Brian&text=${encodeURIComponent(text)}`;
        this.showAudioStatus('Loading TTS audio...', 'loading');
        return this.playAudioFile(ttsUrl, playBtn, audioStatus, audioText);
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
