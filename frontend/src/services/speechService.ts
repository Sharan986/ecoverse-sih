import { languageConfig } from '../utils/translations';

export class SpeechService {
  private recognition: any = null;
  private synthesis: SpeechSynthesis;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    this.synthesis = window.speechSynthesis;
    this.initializeSpeechRecognition();
  }

  private initializeSpeechRecognition() {
    try {
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        
        // Set basic properties only
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.maxAlternatives = 1;
        
        console.log('Speech recognition initialized successfully');
      } else {
        console.warn('Speech recognition not supported in this browser');
      }
    } catch (error) {
      console.error('Error initializing speech recognition:', error);
      this.recognition = null;
    }
  }

  // Check microphone permissions
  async checkMicrophonePermission(): Promise<boolean> {
    try {
      if (navigator.permissions) {
        const permission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        console.log('Microphone permission status:', permission.state);
        return permission.state === 'granted';
      }
      
      // Fallback: try to access microphone directly
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      console.log('Microphone access successful');
      return true;
    } catch (error) {
      console.error('Microphone permission check failed:', error);
      return false;
    }
  }

  // Check network connectivity for speech recognition
  async checkNetworkConnectivity(): Promise<boolean> {
    try {
      // Try to fetch a small resource to test connectivity
      const response = await fetch('https://www.google.com/favicon.ico', {
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-cache'
      });
      return true;
    } catch (error) {
      console.error('Network connectivity check failed:', error);
      return navigator.onLine; // Fallback to browser's online status
    }
  }

  // Request microphone permission
  async requestMicrophonePermission(): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('Microphone permission granted');
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (error) {
      console.error('Microphone permission denied:', error);
      return false;
    }
  }

  isSupported(): boolean {
    return !!this.recognition;
  }

  // Speech-to-Text with retry mechanism
  async startListening(language: string, retryCount: number = 0): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        reject(new Error('Speech recognition not supported'));
        return;
      }

      // Stop any existing recognition first
      this.stopListening();

      const config = languageConfig[language as keyof typeof languageConfig];
      this.recognition.lang = config?.speechLang || 'en-IN';

      // Add timeout to prevent hanging
      const timeout = setTimeout(() => {
        this.stopListening();
        reject(new Error('Speech recognition timeout'));
      }, 15000); // Increased to 15 seconds

      let hasResult = false;
      let errorHandled = false;
      
      // Clear any previous error flag
      if (this.recognition) {
        this.recognition._errorHandled = false;
      }

      // Set up event handlers
      this.recognition.onresult = (event: any) => {
        clearTimeout(timeout);
        hasResult = true;
        if (event.results.length > 0) {
          const transcript = event.results[0][0].transcript;
          console.log('Speech recognized:', transcript);
          resolve(transcript);
        }
      };

      this.recognition.onerror = (event: any) => {
        clearTimeout(timeout);
        console.error('Speech recognition error:', event.error);
        
        // Mark error as handled
        this.recognition._errorHandled = true;
        errorHandled = true;
        
        // Stop recognition to clean up
        try {
          this.recognition.stop();
        } catch (e) {
          // Ignore stop errors
        }
        
        // Handle network errors with exponential backoff retry
        if (event.error === 'network' && retryCount < 2) {
          const retryDelay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
          console.log(`Network error, retrying in ${retryDelay}ms... (attempt ${retryCount + 1})`);
          setTimeout(() => {
            this.startListening(language, retryCount + 1)
              .then(resolve)
              .catch(reject);
          }, retryDelay);
          return;
        }
        
        let errorMessage = 'Speech recognition failed';
        
        switch (event.error) {
          case 'not-allowed':
            errorMessage = 'Microphone permission denied. Please allow microphone access.';
            break;
          case 'no-speech':
            errorMessage = 'No speech detected. Please try again.';
            break;
          case 'network':
            errorMessage = 'Network connection failed. Speech recognition requires an internet connection. Please check your connection and try again.';
            break;
          case 'audio-capture':
            errorMessage = 'Microphone not found. Please check your microphone.';
            break;
          case 'service-not-allowed':
            errorMessage = 'Speech recognition service not allowed. Please try again.';
            break;
          case 'aborted':
            errorMessage = 'Speech recognition was cancelled.';
            break;
          default:
            errorMessage = `Speech recognition error: ${event.error}. Try using the virtual keyboard instead.`;
        }
        
        reject(new Error(errorMessage));
      };

      this.recognition.onend = () => {
        clearTimeout(timeout);
        console.log('Speech recognition ended');
        
        // Only reject if we didn't get a result and no error was already handled
        if (!hasResult && !errorHandled) {
          // This is likely a silent failure or user stopped speaking
          reject(new Error('No speech was detected. Please try speaking louder or closer to the microphone.'));
        }
      };

      this.recognition.onstart = () => {
        console.log('Speech recognition started');
      };

      try {
        console.log('Starting speech recognition...');
        this.recognition.start();
      } catch (error) {
        clearTimeout(timeout);
        console.error('Failed to start speech recognition:', error);
        reject(error);
      }
    });
  }

  stopListening() {
    if (this.recognition) {
      try {
        this.recognition.stop();
        console.log('Speech recognition stopped');
      } catch (error) {
        console.error('Error stopping speech recognition:', error);
      }
    }
  }

  // Text-to-Speech
  async speak(text: string, language: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!text.trim()) {
        resolve();
        return;
      }

      // Stop any current speech
      this.stopSpeaking();

      const config = languageConfig[language as keyof typeof languageConfig];
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set language and voice
      utterance.lang = config?.voiceLang || 'en-IN';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;

      // Try to find a voice that matches the language
      this.getVoiceForLanguage(config?.voiceLang || 'en-IN').then(voice => {
        if (voice) {
          utterance.voice = voice;
        }

        utterance.onend = () => {
          this.currentUtterance = null;
          resolve();
        };

        utterance.onerror = (event) => {
          this.currentUtterance = null;
          reject(new Error(`Speech synthesis error: ${event.error}`));
        };

        this.currentUtterance = utterance;
        this.synthesis.speak(utterance);
      });
    });
  }

  stopSpeaking() {
    if (this.synthesis.speaking) {
      this.synthesis.cancel();
    }
    this.currentUtterance = null;
  }

  private async getVoiceForLanguage(langCode: string): Promise<SpeechSynthesisVoice | null> {
    return new Promise((resolve) => {
      const getVoices = () => {
        const voices = this.synthesis.getVoices();
        
        // Try exact match first
        let voice = voices.find(v => v.lang === langCode);
        if (voice) {
          resolve(voice);
          return;
        }

        // Try base language match (e.g., 'hi' for 'hi-IN')
        const baseLang = langCode.split('-')[0];
        voice = voices.find(v => v.lang.startsWith(baseLang));
        if (voice) {
          resolve(voice);
          return;
        }

        // Fallback to any available voice
        resolve(voices[0] || null);
      };

      if (this.synthesis.getVoices().length === 0) {
        this.synthesis.onvoiceschanged = getVoices;
      } else {
        getVoices();
      }
    });
  }

  // Check if speech recognition is available
  get isRecognitionSupported(): boolean {
    return this.recognition !== null;
  }

  // Check if speech synthesis is available
  get isSynthesisSupported(): boolean {
    return 'speechSynthesis' in window;
  }

  // Test speech recognition with better error handling
  async testSpeechRecognition(): Promise<boolean> {
    if (!this.recognition) return false;
    
    try {
      // Test if we can create and configure recognition
      this.recognition.lang = 'en-US';
      return true;
    } catch (error) {
      console.error('Speech recognition test failed:', error);
      return false;
    }
  }

  // Comprehensive diagnostic method
  async runDiagnostics(): Promise<{
    recognitionSupported: boolean;
    synthesisSupported: boolean;
    microphonePermission: boolean;
    networkConnectivity: boolean;
    voicesAvailable: number;
    browserSupport: string;
    errors: string[];
  }> {
    const errors: string[] = [];
    let microphonePermission = false;
    let networkConnectivity = false;
    let voicesAvailable = 0;

    // Check browser support
    const browserSupport = (() => {
      if ('webkitSpeechRecognition' in window) return 'webkit';
      if ('SpeechRecognition' in window) return 'standard';
      return 'none';
    })();

    // Check network connectivity
    try {
      networkConnectivity = await this.checkNetworkConnectivity();
    } catch (error) {
      errors.push(`Network check failed: ${error}`);
    }

    // Check microphone permission
    try {
      microphonePermission = await this.checkMicrophonePermission();
    } catch (error) {
      errors.push(`Microphone check failed: ${error}`);
    }

    // Check voices
    try {
      const voices = this.synthesis.getVoices();
      voicesAvailable = voices.length;
    } catch (error) {
      errors.push(`Voice check failed: ${error}`);
    }

    // Test recognition initialization
    try {
      await this.testSpeechRecognition();
    } catch (error) {
      errors.push(`Recognition test failed: ${error}`);
    }

    const results = {
      recognitionSupported: this.isRecognitionSupported,
      synthesisSupported: this.isSynthesisSupported,
      microphonePermission,
      networkConnectivity,
      voicesAvailable,
      browserSupport,
      errors
    };

    console.log('Speech service diagnostics:', results);
    return results;
  }
}

export const speechService = new SpeechService();
