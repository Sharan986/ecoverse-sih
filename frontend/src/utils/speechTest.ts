/**
 * Speech Recognition Test Utility
 * Use this to test speech functionality in browser console
 */

import { speechService } from '../services/speechService';

export const testSpeechService = async () => {
  console.log('🎤 Starting Speech Service Diagnostics...\n');
  
  try {
    // Run comprehensive diagnostics
    const diagnostics = await speechService.runDiagnostics();
    
    console.log('📋 Diagnostic Results:');
    console.table(diagnostics);
    
    // Test basic functionality
    console.log('\n🔊 Testing Speech Synthesis...');
    if (speechService.isSynthesisSupported) {
      await speechService.speak('Hello! This is a test of speech synthesis.', 'English');
      console.log('✅ Speech synthesis test completed');
    } else {
      console.log('❌ Speech synthesis not supported');
    }
    
    // Test recognition (requires user interaction)
    console.log('\n🎙️ Testing Speech Recognition...');
    if (speechService.isRecognitionSupported) {
      console.log('ℹ️ Speech recognition requires user interaction');
      console.log('   Use the chatbot interface to test voice input');
      
      // Test recognition initialization
      const recognitionTest = await speechService.testSpeechRecognition();
      console.log(`   Recognition initialization: ${recognitionTest ? '✅ Success' : '❌ Failed'}`);
    } else {
      console.log('❌ Speech recognition not supported');
    }
    
    console.log('\n🎯 Summary:');
    console.log(`   Browser Support: ${diagnostics.browserSupport}`);
    console.log(`   Recognition: ${diagnostics.recognitionSupported ? 'Available' : 'Not Available'}`);
    console.log(`   Synthesis: ${diagnostics.synthesisSupported ? 'Available' : 'Not Available'}`);
    console.log(`   Microphone: ${diagnostics.microphonePermission ? 'Granted' : 'Denied/Unknown'}`);
    console.log(`   Voices: ${diagnostics.voicesAvailable} available`);
    
    if (diagnostics.errors.length > 0) {
      console.log('\n⚠️ Errors detected:');
      diagnostics.errors.forEach(error => console.log(`   • ${error}`));
    }
    
    return diagnostics;
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    return null;
  }
};

// Quick test function for browser console
export const quickSpeechTest = () => {
  console.log('Running quick speech test...');
  
  // Test synthesis immediately
  speechService.speak('Speech test successful!', 'English');
  
  // Log basic info
  console.log('Recognition supported:', speechService.isRecognitionSupported);
  console.log('Synthesis supported:', speechService.isSynthesisSupported);
};

// Make functions available globally for console testing
if (typeof window !== 'undefined') {
  (window as any).testSpeechService = testSpeechService;
  (window as any).quickSpeechTest = quickSpeechTest;
  (window as any).speechService = speechService;
  
  console.log('🎤 Speech test functions available in console:');
  console.log('   testSpeechService() - Run full diagnostics');
  console.log('   quickSpeechTest() - Quick test');
  console.log('   speechService - Access speech service directly');
}
