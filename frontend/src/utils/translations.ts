// Translation system for multilingual support
export const translations = {
  English: {
    appTitle: "🌍 JourneySmith AI Assistant",
    placeholder: "Ask me about Jharkhand tourism...",
    sendButton: "Send",
    selectLanguage: "Language:",
    listening: "🎙️ Listening...",
    micButton: "🎤 Voice",
    stopButton: "🛑 Stop",
    chatTitle: "Travel Assistant",
    welcomeMessage: "Hi! I'm your Jharkhand travel assistant. Ask me about destinations, festivals, local experiences, or travel tips!",
    errorMessage: "Sorry, I couldn't process that. Please try again.",
    serverError: "Connection error. Please check your internet.",
    clearChat: "Clear Chat",
    minimizeChat: "Minimize",
    expandChat: "Expand"
  },
  Hindi: {
    appTitle: "🌍 जर्नीस्मिथ AI सहायक",
    placeholder: "झारखंड पर्यटन के बारे में पूछें...",
    sendButton: "भेजें",
    selectLanguage: "भाषा:",
    listening: "🎙️ सुन रहा हूं...",
    micButton: "🎤 आवाज़",
    stopButton: "🛑 रोकें",
    chatTitle: "यात्रा सहायक",
    welcomeMessage: "नमस्ते! मैं आपका झारखंड यात्रा सहायक हूँ। मुझसे गंतव्य, त्योहार, स्थानीय अनुभव या यात्रा सुझाव के बारे में पूछें!",
    errorMessage: "खुशी है, मैं इसे प्रोसेस नहीं कर सका। कृपया फिर से कोशिश करें।",
    serverError: "कनेक्शन त्रुटि। कृपया अपना इंटरनेट चेक करें।",
    clearChat: "चैट साफ़ करें",
    minimizeChat: "छोटा करें",
    expandChat: "बड़ा करें"
  },
  Bengali: {
    appTitle: "🌍 জার্নিস্মিথ AI সহায়ক",
    placeholder: "ঝাড়খণ্ড পর্যটন সম্পর্কে জিজ্ঞাসা করুন...",
    sendButton: "পাঠান",
    selectLanguage: "ভাষা:",
    listening: "🎙️ শুনছি...",
    micButton: "🎤 কণ্ঠস্বর",
    stopButton: "🛑 থামুন",
    chatTitle: "ভ্রমণ সহায়ক",
    welcomeMessage: "হ্যালো! আমি আপনার ঝাড়খণ্ড ভ্রমণ সহায়ক। আমাকে গন্তব্য, উৎসব, স্থানীয় অভিজ্ঞতা বা ভ্রমণ টিপস সম্পর্কে জিজ্ঞাসা করুন!",
    errorMessage: "দুঃখিত, আমি এটি প্রক্রিয়া করতে পারিনি। দয়া করে আবার চেষ্টা করুন।",
    serverError: "সংযোগ ত্রুটি। দয়া করে আপনার ইন্টারনেট চেক করুন।",
    clearChat: "চ্যাট পরিষ্কার করুন",
    minimizeChat: "ছোট করুন",
    expandChat: "বড় করুন"
  }
};

// Language configurations for speech recognition and synthesis
export const languageConfig = {
  English: {
    speechLang: "en-IN", // Indian English for better recognition
    voiceLang: "en-IN",
    code: "en"
  },
  Hindi: {
    speechLang: "hi-IN",
    voiceLang: "hi-IN", 
    code: "hi"
  },
  Bengali: {
    speechLang: "bn-IN",
    voiceLang: "bn-IN",
    code: "bn"
  }
};

// Virtual keyboard layouts for Jharkhand languages
export const keyboardLayouts = {
  English: [
    ["1","2","3","4","5","6","7","8","9","0","Backspace"],
    ["Q","W","E","R","T","Y","U","I","O","P"],
    ["A","S","D","F","G","H","J","K","L"],
    ["Z","X","C","V","B","N","M"],
    ["Space"]
  ],
  Hindi: [
    ["१","२","३","४","५","६","७","८","९","०","Backspace"],
    ["क","ख","ग","घ","ङ","च","छ","ज","झ","ञ"],
    ["ट","ठ","ड","ढ","ण","त","थ","द","ध","न"],
    ["प","फ","ब","भ","म","य","र","ल","व","स","ह"],
    ["Space"]
  ],
  Bengali: [
    ["১","২","ৃ","৪","৫","৬","৭","৮","৯","০","Backspace"],
    ["ক","খ","গ","ঘ","ঙ","চ","ছ","জ","ঝ","ঞ"],
    ["ট","ঠ","ড","ঢ","ণ","ত","থ","দ","ধ","ন"],
    ["প","ফ","ব","ভ","ম","য","র","ল","শ","ষ","স","হ"],
    ["Space"]
  ]
};
