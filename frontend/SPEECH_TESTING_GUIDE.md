# Speech Recognition Testing Guide

## Overview
The JourneySmith AI application now includes comprehensive multilingual speech recognition and text-to-speech capabilities. This guide explains how to test and debug the speech functionality.

## Features Implemented

### 1. **Multilingual Speech Recognition**
- **Supported Languages**: English, Hindi, Bengali
- **Voice Input**: Click microphone button to start listening
- **Auto-send**: Voice input is automatically sent to the AI chatbot
- **Stop Function**: Red stop button to cancel listening

### 2. **Text-to-Speech**
- **Response Reading**: AI responses can be read aloud
- **Language-specific Voices**: Appropriate voices for each language
- **Voice Controls**: Play/pause speech synthesis

### 3. **Enhanced Error Handling**
- **Permission Checks**: Automatic microphone permission requests
- **Network Error Recovery**: Automatic retry for network failures
- **User-friendly Messages**: Clear error descriptions with solutions

### 4. **Diagnostic Tools**
- **Built-in Diagnostics**: Speech diagnostics button in chatbot header
- **Console Testing**: Developer tools for troubleshooting
- **Comprehensive Reporting**: Detailed status of all speech components

## Testing Instructions

### Browser Console Testing
1. Open browser console (F12)
2. Run diagnostic commands:
   ```javascript
   // Full diagnostic report
   testSpeechService()
   
   // Quick test
   quickSpeechTest()
   
   // Access speech service directly
   speechService.runDiagnostics()
   ```

### UI Testing
1. **Open Chatbot**: Click the chat bubble icon
2. **Language Selection**: Choose English, Hindi, or Bengali
3. **Speech Diagnostics**: Click the Volume2 icon in header for diagnostic report
4. **Voice Input**: 
   - Click microphone button
   - Grant permission if prompted
   - Speak clearly
   - View transcribed text
5. **Voice Output**: Click speaker icon to hear AI responses

### Troubleshooting Common Issues

#### Speech Recognition Not Working
1. **Check Browser Support**: Use Chrome, Edge, or Safari
2. **Microphone Permission**: Ensure permission is granted
3. **Internet Connection**: Speech recognition requires internet
4. **HTTPS**: Voice features only work on HTTPS (localhost works)

#### Network Errors
- Automatic retry system implemented
- Check internet connectivity
- Try refreshing the page

#### No Speech Detected
- Speak louder and clearer
- Check microphone is working
- Try different language selection

### Browser Compatibility
- ✅ **Chrome**: Full support (Recommended)
- ✅ **Edge**: Full support
- ✅ **Safari**: Limited support (iOS devices)
- ❌ **Firefox**: Limited speech recognition support

### Security Requirements
- **HTTPS Required**: Voice features only work on secure origins
- **Permission Required**: Microphone access must be granted
- **User Interaction**: Speech recognition requires user gesture

## Development Features

### Debug Mode
- Console logging for all speech events
- Detailed error reporting
- Performance monitoring

### Configuration
- Adjustable recognition timeouts
- Retry mechanisms
- Language-specific voice selection

### Testing Utilities
- `speechTest.ts`: Comprehensive testing suite
- Console functions for quick debugging
- Diagnostic reporting tools

## File Structure
```
src/
├── services/
│   └── speechService.ts     # Core speech functionality
├── utils/
│   ├── speechTest.ts        # Testing utilities
│   └── translations.tsx     # Language configuration
└── components/
    └── ChatBot.tsx          # UI integration
```

## Next Steps for SIH Demo
1. Test across different devices and browsers
2. Verify multilingual accuracy
3. Prepare fallback options for unsupported browsers
4. Test with various accents and speaking speeds
5. Document any limitations for judges

## Support
If speech recognition fails:
1. Use the virtual keyboard as backup
2. Switch to text input mode
3. Check diagnostic report for specific issues
4. Use different browser if needed

The system is designed to gracefully degrade when speech features are unavailable, ensuring the chatbot remains functional for SIH evaluation.
