# Audio Files for Listening Questions

This directory contains audio files for the listening questions in the English Quiz.

## Audio File Requirements

- **Format**: MP3, WAV, or OGG (MP3 recommended for best browser compatibility)
- **Quality**: 128kbps or higher for clear audio
- **Duration**: 30-90 seconds per audio clip
- **Language**: Clear English pronunciation

## Current Audio Files

Replace these placeholder files with your own audio recordings:

1. **listening1.mp3** - Time Management (Academic Success)
   - Text: "Good morning, everyone. Today we'll be discussing the importance of time management in academic success. Studies have shown that students who effectively manage their time are more likely to achieve better grades and experience less stress. The key components of good time management include setting priorities, creating schedules, avoiding procrastination, and taking regular breaks. Remember, it's not about working harder, but working smarter."

2. **listening2.mp3** - Museum Guide (Ancient Civilizations)
   - Text: "Welcome to the museum's audio guide for the Ancient Civilizations exhibit. As you walk through this section, you'll discover artifacts from ancient Egypt, Greece, and Rome. The highlight of this exhibit is a 3,000-year-old Egyptian sarcophagus, discovered in the Valley of the Kings in 1922. The intricate hieroglyphics tell the story of a high priest who served during the reign of Ramesses II. Please take your time to examine the detailed craftsmanship and consider how these artifacts connect us to our shared human history."

3. **listening3.mp3** - Flight Announcement (Captain Update)
   - Text: "Attention passengers, this is your captain speaking. We're currently cruising at 35,000 feet with clear skies ahead. Our estimated arrival time in London is 2:30 PM local time, which puts us about 15 minutes ahead of schedule. The weather in London is partly cloudy with a temperature of 18 degrees Celsius. We'll begin our descent in approximately one hour. Thank you for flying with us today, and we hope you're enjoying your flight."

## How to Add Your Own Audio Files

### Option 1: Record Your Own
1. Use a recording app (Windows Voice Recorder, Audacity, etc.)
2. Speak clearly and at a moderate pace
3. Save as MP3 format
4. Name the files as: `listening1.mp3`, `listening2.mp3`, `listening3.mp3`

### Option 2: Text-to-Speech Services
You can use online TTS services to generate audio files:

- **TTSFree.com**: https://ttsfree.com/
- **Natural Readers**: https://www.naturalreaders.com/
- **Google Cloud TTS**: https://cloud.google.com/text-to-speech
- **Amazon Polly**: https://aws.amazon.com/polly/

### Option 3: AI Voice Generators
- **ElevenLabs**: https://elevenlabs.io/
- **Murf AI**: https://murf.ai/
- **Speechify**: https://speechify.com/

## Audio File Specifications

- **listening1.mp3**: Duration ~45-60 seconds
- **listening2.mp3**: Duration ~60-75 seconds  
- **listening3.mp3**: Duration ~30-45 seconds

## Testing Your Audio Files

1. Place your audio files in this directory
2. Open the main quiz application
3. Navigate to listening questions
4. Test audio playback and quality

## Fallback Options

If audio files are missing, the quiz will:
1. Try to use text-to-speech as backup
2. Display the transcript text
3. Show a message about missing audio files

## Technical Notes

- Audio files are loaded using HTML5 `<audio>` element
- Supported formats: MP3 (recommended), WAV, OGG
- Files should be under 5MB each for fast loading
- Use relative paths: `audio/listening1.mp3`
