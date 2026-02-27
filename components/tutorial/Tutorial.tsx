"use client";

import React, { useState, useEffect, useCallback } from "react";
import { X, ChevronRight, ChevronLeft, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useLayout } from "../../contexts/layout/LayoutContext";

type Language = "en" | "hi" | "ja" | "mr" | "bn" | "te" | "ta" | "gu" | "kn" | "ml" | "pa";

interface TutorialStep {
    targetId?: string;
    texts: Record<string, string>;
    title?: Record<string, string>;
}

const tutorialSteps: TutorialStep[] = [
    {
        // Step 0: Language Selection & Intro
        texts: {
            en: "Welcome to Aki! Let's get you familiar with your Japanese learning journey. First, select your mother tongue for explanations.",
            hi: "Aki में आपका स्वागत है! आइए आपकी जापानी सीखने की यात्रा शुरू करें। सबसे पहले, स्पष्टीकरण के लिए अपनी मातृभाषा चुनें।",
            ja: "Akiへようこそ！あなたの日本語学習の道のりを案内します。まず、説明に使用する母国語を選択してください。",
            mr: "Aki मध्ये आपले स्वागत आहे! तुमची जपानी शिकण्याची प्रवासाची ओळख करून घेऊया. प्रथम, स्पष्टीकरणासाठी तुमची मातृभाषा निवडा.",
            bn: "Aki-তে আপনাকে স্বাগতম! আপনার জাপানি শেখার যাত্রার সাথে পরিচিত হওয়া যাক। প্রথমে, ব্যাখ্যার জন্য আপনার মাতৃভাষা নির্বাচন করুন।",
            te: "Akiకి స్వాగతం! జపనీస్ నేర్చుకునే మీ ప్రయాణాన్ని పరిచయం చేసుకుందాం. మొదట, వివరణల కోసం మీ మాతృభాషను ఎంచుకోండి.",
            ta: "Aki-க்கு உங்களை வரவேற்கிறோம்! உங்கள் ஜப்பானிய கற்றல் பயணத்தை அறிமுகப்படுத்துவோம். முதலில், விளக்கங்களுக்கு உங்கள் தாய்மொழியைத் தேர்ந்தெடுக்கவும்.",
            gu: "Aki માં તમારું સ્વાગત છે! ચાલો તમારી જાપાનીઝ શીખવાની મુસાફરીથી પરિચિત થઈએ. પહેલા, સમજૂતી માટે તમારી માતૃભાષા પસંદ કરો.",
            kn: "Aki ಗೆ ಸುಸ್ವಾಗತ! ಜಪಾನೀಸ್ ಕಲಿಯುವ ನಿಮ್ಮ ಪ್ರಯಾಣವನ್ನು ಪರಿಚಯ ಮಾಡಿಕೊಳ್ಳೋಣ. ಮೊದಲು, ವಿವರಣೆಗಳಿಗಾಗಿ ನಿಮ್ಮ ಮಾತೃಭಾಷೆಯನ್ನು ಆರಿಸಿ.",
            ml: "Aki-യിലേക്ക് സ്വാഗതം! ജാപ്പനീസ് പഠനത്തിനായുള്ള നിങ്ങളുടെ യാത്ര പരിചയപ്പെടാം. ആദ്യം, വിശദീകരണങ്ങൾക്കായി നിങ്ങളുടെ മാതൃഭാഷ തിരഞ്ഞെടുക്കുക.",
            pa: "Aki ਵਿੱਚ ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ! ਆਓ ਤੁਹਾਡੀ ਜਾਪਾਨੀ ਸਿੱਖਣ ਦੀ ਯਾਤਰਾ ਨਾਲ ਜਾਣੂ ਹੋਈਏ। ਸਭ ਤੋਂ ਪਹਿਲਾਂ, ਵਿਆਖਿਆਵਾਂ ਲਈ ਆਪਣੀ ਮਾਂ ਬੋਲੀ ਚੁਣੋ।"
        },
        title: {
            en: "Welcome to Aki",
            hi: "Aki में स्वागत है",
            ja: "Akiへようこそ",
            mr: "Aki मध्ये स्वागत",
            bn: "Aki-তে স্বাগতম",
            te: "Akiకి స్వాగతం",
            ta: "Aki-க்கு வரவேற்பு",
            gu: "Aki માં સ્વાગત",
            kn: "Aki ಗೆ ಸುಸ್ವಾಗತ",
            ml: "Aki-യിലേക്ക് സ്വാഗതം",
            pa: "Aki ਵਿੱਚ ਸੁਆਗਤ ਹੈ"
        },
    },
    {
        targetId: "sidebar-course-chart",
        title: {
            en: "Course Roadmap",
            hi: "कोर्स रोडमैप",
            ja: "コースのロードマップ",
            mr: "कोर्स रोडमॅप",
            bn: "কোর্স রোডম্যাপ",
            te: "కోర్సు రోడ్‌మ్యాప్",
            ta: "பாடநெறி வரைபடம்",
            gu: "કોર્સ રોડમેપ",
            kn: "ಕೋರ್ಸ್ ಮಾರ್ಗಸೂಚಿ",
            ml: "കോഴ്സ് రోഡ്മാപ്പ്",
            pa: "ਕੋਰਸ ਰੋਡਮੈਪ"
        },
        texts: {
            en: "This is your Course Chart. Here you can see the overall roadmap of your Japanese lessons.",
            hi: "यह आपका कोर्स चार्ट है। यहाँ आप अपने जापानी पाठों का पूरा रोडमैप देख सकते हैं।",
            ja: "これはコースチャートです。ここでは、日本語レッスンの全体的なロードマップを確認できます。",
            mr: "हा तुमचा कोर्स चार्ट आहे. येथे तुम्ही तुमच्या जपानी धड्यांचा एकंदर रोडमॅप पाहू शकता.",
            bn: "এটি আপনার কোর্স চার্ট। এখানে আপনি আপনার জাপানি পাঠের সামগ্রিক রোডম্যাপ দেখতে পারেন।",
            te: "ఇది మీ కోర్సు చార్ట్. ఇక్కడ మీరు మీ జపనీస్ పాఠాల మొత్తం రోడ్‌మ్యాప్‌ను చూడవచ్చు.",
            ta: "இது உங்கள் பாடநெறி விளக்கப்படம். உங்கள் ஜப்பானிய பாடங்களின் ஒட்டுமொத்த வரைபடத்தை இங்கே காணலாம்.",
            gu: "આ તમારો કોર્સ ચાર્ટ છે. અહીં તમે તમારા જાપાનીઝ પાઠોનો એકંદર રોડમેપ જોઈ શકો છો.",
            kn: "ಇದು ನಿಮ್ಮ ಕೋರ್ಸ್ ಚಾರ್ಟ್. ನಿಮ್ಮ ಜಪಾನೀಸ್ ಪಾಠಗಳ ಒಟ್ಟಾರೆ ಮಾರ್ಗಸೂಚಿಯನ್ನು ಇಲ್ಲಿ ನೀವು ನೋಡಬಹುದು.",
            ml: "ഇതാണ് നിങ്ങളുടെ കോഴ്സ് ചാർട്ട്. നിങ്ങളുടെ ജാപ്പനീസ് പാഠങ്ങളുടെ മൊത്തത്തിലുള്ള റോഡ്മാപ്പ് ഇവിടെ കാണാം.",
            pa: "ਇਹ ਤੁਹਾਡਾ ਕੋਰਸ ਚਾਰਟ ਹੈ। ਇੱਥੇ ਤੁਸੀਂ ਆਪਣੇ ਜਾਪਾਨੀ ਪਾਠਾਂ ਦਾ ਸਮੁੱਚਾ ਰੋਡਮੈਪ ਦੇਖ ਸਕਦੇ ਹੋ।"
        },
    },
    {
        targetId: "sidebar-reading",
        title: {
            en: "Reading Practice",
            hi: "पढ़ने का अभ्यास",
            ja: "リーディング練習",
            mr: "वाचन सराव",
            bn: "পড়ার অনুশীলন",
            te: "రీడింగ్ ప్రాక్టీస్",
            ta: "வாசிப்பு பயிற்சி",
            gu: "વાંચન પ્રેક્ટિસ",
            kn: "ಓದುವ ಅಭ್ಯಾಸ",
            ml: "വായനാ പരിശീലനം",
            pa: "ਪੜ੍ਹਨ ਦਾ ਅਭ್ಯಾਸ"
        },
        texts: {
            en: "The Reading section helps you practice vocabulary and sentence patterns.",
            hi: "पढ़ने वाला भाग आपको शब्दावली और वाक्य पैटर्न का अभ्यास करने में मदद करता है।",
            ja: "リーディングセクションは、語彙や文型の練習に役立ちます。",
            mr: "वाचन विभाग तुम्हाला शब्दसंग्रह आणि वाक्य रचनांचा सराव करण्यास मदत करतो.",
            bn: "রিডিং বিভাগটি আপনাকে শব্দভাণ্ডার এবং বাক্য বিন্যাস অনুশীলনে সহায়তা করে।",
            te: "రీడింగ్ విభాగం మీకు పదజాలం మరియు వాక్య నిర్మాణాలను ప్రాక్టీస్ చేయడంలో సహాయపడుతుంది.",
            ta: "வாசிப்புப் பிரிவு சொற்களஞ்சியம் மற்றும் வாக்கிய அமைப்புகளைப் பயிற்சி செய்ய உதவுகிறது.",
            gu: "રીડીંગ વિભાગ તમને શબ્દભંડોળ અને વાક્ય રચનાઓની પ્રેક્ટિસ કરવામાં મદદ કરે છે.",
            kn: "ರೀಡಿಂಗ್ ವಿಭಾಗವು ಶಬ್ದಕೋಶ ಮತ್ತು ವಾಕ್ಯ ಮಾದರಿಗಳನ್ನು ಅಭ್ಯಾಸ ಮಾಡಲು ನಿಮಗೆ ಸಹಾಯ ಮಾಡುತ್ತದೆ.",
            ml: "വായനാ വിഭാഗം പദപ്രയോഗങ്ങളും വാക്യഘടനകളും പരിശീലിക്കാൻ നിങ്ങളെ സഹായിക്കുന്നു.",
            pa: "ਰੀਡਿੰਗ ਸੈਕਸ਼ਨ ਤੁਹਾਨੂੰ ਸ਼ਬਦਾਵਲੀ ਅਤੇ ਵਾਕ ਪੈਟਰਨਾਂ ਦਾ ਅਭਿਆਸ ਕਰਨ ਵਿੱਚ ਮਦਦ ਕਰਦਾ ਹੈ।"
        },
    },
    {
        targetId: "sidebar-exercise",
        title: {
            en: "Interactive Exercises",
            hi: "इंटरैक्टिव अभ्यास",
            ja: "インタラクティブ演習",
            mr: "परस्परसंवादी व्यायाम",
            bn: "ইন্টারেক্টিভ অনুশীলন",
            te: "ఇంటరాక్టివ్ వ్యายామాలు",
            ta: "ஊடாடும் பயிற்சிகள்",
            gu: "ઇન્ટરેક્ટિવ કસરતો",
            kn: "ಸಂವಾದಾತ್ಮಕ ವ್ಯಾಯಾಮಗಳು",
            ml: "സംവേദനാത്മక വ്യായാമങ്ങൾ",
            pa: "ਇੰਟਰਐਕਟਿਵ ਅਭਿਆਸ"
        },
        texts: {
            en: "The Exercise section contains interactive tasks to test your knowledge.",
            hi: "अभ्यास अनुभाग में आपके ज्ञान का परीक्षण करने के लिए इंटरैक्टिव कार्य हैं।",
            ja: "演習セクションには、知識をテストするためのインタラクティブなタスクが含まれています。",
            mr: "अभ्यास विभागात तुमच्या ज्ञानाची चाचणी घेण्यासाठी परस्परसंवादी कार्ये आहेत.",
            bn: "অনুশীলন বিভাগে আপনার জ্ঞান পরীক্ষার জন্য ইন্টারেক্টিভ কাজ রয়েছে।",
            te: "వ్యాయామ విభాగంలో మీ జ్ఞానాన్ని పరీక్షించడానికి ఇంటరాక్టివ్ టాస్క్‌లు ఉన్నాయి.",
            ta: "பயிற்சிப் பிரிவில் உங்கள் அறிவைச் சோதிக்க ஊடாடும் பணிகள் உள்ளன.",
            gu: "વ્યાયામ વિભાગમાં તમારા જ્ઞાનની ચકાસણી માટે ઇન્ટરેક્ટિવ કાર્યો છે.",
            kn: "ವ್ಯಾಯಾಮ ವಿಭಾಗವು ನಿಮ್ಮ ಜ್ಞಾನವನ್ನು ಪರೀಕ್ಷಿಸಲು ಸಂವಾದಾತ್ಮಕ ಕಾರ್ಯಗಳನ್ನು ಒಳಗೊಂಡಿದೆ.",
            ml: "വ്യായാമ വിഭാഗത്തിൽ നിങ്ങളുടെ അറിവ് പരിശോധിക്കുന്നതിനുള്ള സംവേദനാത്മക ടാസ്ക്കുകൾ അടങ്ങിയിരിക്കുന്നു.",
            pa: "ਅਭਿਆਸ ਸੈਕਸ਼ਨ ਵਿੱਚ ਤੁਹਾਡੇ ਗਿਆਨ ਦੀ ਪਰਖ ਕਰਨ ਲਈ ਇੰਟਰਐਕਟਿਵ ਕੰਮ ਸ਼ਾਮਲ ਹਨ।"
        },
    },
    {
        targetId: "dashboard-progress",
        title: {
            en: "Your Progress",
            hi: "आपकी प्रगति",
            ja: "あなたの進捗",
            mr: "तुमची प्रगती",
            bn: "আপনার অগ্রগতি",
            te: "మీ పురోగతి",
            ta: "உங்கள் முன்னேற்றம்",
            gu: "તમારી પ્રગતિ",
            kn: "ನಿಮ್ಮ ಪ್ರಗತಿ",
            ml: "നിങ്ങളുടെ പുരോഗതി",
            pa: "ਤੁਹਾਡੀ ਪ੍ਰਗਤੀ"
        },
        texts: {
            en: "Track your progress here. See how many lessons you've completed and what's next.",
            hi: "अपनी प्रगति को यहाँ ट्रैक करें। देखें कि आपने कितने पाठ पूरे किए हैं और आगे क्या है।",
            ja: "ここで進捗状況を確認してください。完了したレッスンの数と次のステップを確認できます。",
            mr: "तुमच्या प्रगतीचा मागोवा येथे घ्या. तुम्ही किती धडे पूर्ण केले आहेत आणि पुढे काय आहे ते पहा.",
            bn: "এখানে আপনার অগ্রগতির খোঁজ রাখুন। আপনি কতগুলি পাঠ শেষ করেছেন এবং পরবর্তীতে কী আছে তা দেখুন।",
            te: "మీ పురోగతిని ఇక్కడ ట్రాక్ చేయండి. మీరు ఎన్ని పాఠాలు పూర్తి చేశారో మరియు తదుపరి ఏమిటో చూడండి.",
            ta: "உங்கள் முன்னேற்றத்தை இங்கே கண்காணிக்கவும். நீங்கள் எத்தனை பாடங்களை முடித்துள்ளீர்கள் மற்றும் அடுத்து என்ன என்பதைப் பார்க்கவும்.",
            gu: "તમારી પ્રગતિ અહીં ટ્રૅક કરો. તમે કેટલા પાઠ પૂર્ણ કર્યા છે અને આગળ શું છે તે જુઓ.",
            kn: "ನಿಮ್ಮ ಪ್ರಗತಿಯನ್ನು ಇಲ್ಲಿ ಟ್ರ್ಯಾಕ್ ಮಾಡಿ. ನೀವು ಎಷ್ಟು ಪಾಠಗಳನ್ನು ಪೂರ್ಣಗೊಳಿಸಿದ್ದೀರಿ ಮತ್ತು ಮುಂದಿನದು ಏನು ಎಂಬುದನ್ನು ನೋಡಿ.",
            ml: "നിങ്ങളുടെ പുരോഗതി ഇവിടെ ട്രാക്ക് ചെയ്യുക. നിങ്ങൾ എത്ര പാഠങ്ങൾ പൂർത്തിയാക്കി എന്നും അടുത്തത് എന്താണെന്നും കാണുക.",
            pa: "ਇੱਥੇ ਆਪਣੀ ਪ੍ਰਗਤੀ ਨੂੰ ਟ੍ਰੈਕ ਕਰੋ। ਦੇਖੋ ਕਿ ਤੁਸੀਂ ਕਿੰਨੇ ਪਾਠ ਪੂਰੇ ਕੀਤੇ ਹਨ ਅਤੇ ਅੱਗੇ ਕੀ ਹੈ।"
        },
    },
    {
        targetId: "practice-links",
        title: {
            en: "Quick Links",
            hi: "त्वरित लिंक",
            ja: "クイックリンク",
            mr: "द्रुत दुवे",
            bn: "দ্রুত লিঙ্ক",
            te: "త్వరిత లింకులు",
            ta: "விரைவான இணைப்புகள்",
            gu: "ઝડપી લિંક્સ",
            kn: "ತ್ವರಿತ ಲಿಂಕ್‌ಗಳು",
            ml: "ദ്രുത ലിങ്കുകൾ",
            pa: "ਤੁਰੰਤ ਲਿੰਕ"
        },
        texts: {
            en: "These links give you quick access to analysis, quizzes, and character charts.",
            hi: "ये लिंक आपको विश्लेषण, क्विज़ और वर्ण चार्ट तक त्वरित पहुँच प्रदान करते हैं।",
            ja: "これらのリンクを使用すると、分析、クイズ、文字チャートにすばやくアクセスできます。",
            mr: "हे दुवे तुम्हाला विश्लेषण, क्विझ आणि वर्ण चार्टमध्ये द्रुत प्रवेश देतात.",
            bn: "এই লিঙ্কগুলি আপনাকে বিশ্লেষণ, কুইজ এবং বর্ণ চার্টে দ্রুত নেভিগেট করার সুবিধা দেয়।",
            te: "ఈ లింక్‌లు మీకు విశ్లేషణ, క్విజ్‌లు మరియు క్యారెక్టర్ చార్ట్‌లకు శీఘ్ర ప్రాప్యతను ఇస్తాయి.",
            ta: "இந்த இணைப்புகள் பகுப்பாய்வு, வினாடி வினாக்கள் மற்றும் எழுத்து விளக்கப்படங்களுக்கு விரைவான அணுகலை வழங்குகின்றன.",
            gu: "આ લિંક્સ તમને વિશ્લેષણ, ક્વિઝ અને અક્ષર ચાર્ટની ઝડપી ઍક્સેસ આપે છે.",
            kn: "ಈ ಲಿಂಕ್‌ಗಳು ನಿಮಗೆ ವಿಶ್ಲೇಷಣೆ, ರಸಪ್ರಶ್ನೆಗಳು ಮತ್ತು ಅಕ್ಷರ ಚಾರ್ಟ್‌ಗಳಿಗೆ ತ್ವರಿತ ಪ್ರವೇಶವನ್ನು ನೀಡುತ್ತವೆ.",
            ml: "ഈ ലിങ്കുകൾ നിങ്ങൾക്ക് വിശകലനം, ക്വിസുകൾ, പ്രതീക ചാർട്ടുകൾ എന്നിവയിലേക്ക് വേഗത്തിലുള്ള പ്രവേശനം നൽകുന്നു.",
            pa: "ਇਹ ਲਿੰਕ ਤੁਹਾਨੂੰ ਵਿਸ਼ਲੇਸ਼ਣ, ਕਵਿਜ਼ ਅਤੇ ਅੱਖਰ ਚਾਰਟ ਤੱਕ ਤੁਰੰਤ ਪਹੁੰਚ ਪ੍ਰਦਾਨ ਕਰਦੇ ਹਨ।"
        },
    },
    {
        targetId: "ask-aki-button",
        title: {
            en: "Ask Aki",
            hi: "Aki से पूछें",
            ja: "Akiに聞いてみる",
            mr: "Aki ला विचारा",
            bn: "Aki-কে জিজ্ঞাসা করুন",
            te: "Akiని అడగండి",
            ta: "Aki-யிடம் கேட்கவும்",
            gu: "Aki ને પૂછો",
            kn: "Aki ಅವರನ್ನು ಕೇಳಿ",
            ml: "Aki-യോട് ചോദിക്കുക",
            pa: "Aki ਨੂੰ ਪੁੱਛੋ"
        },
        texts: {
            en: "Meet Aki! Click here anytime to have a voice conversation with your Japanese sensei.",
            hi: "Aki से मिलें! अपने जापानी शिक्षक के साथ आवाज में बातचीत करने के लिए कभी भी यहाँ क्लिक करें।",
            ja: "Akiに会いましょう！いつでもここをクリックして、日本語の先生と音声で会話を始められます。",
            mr: "Aki ला भेटा! तुमच्या जपानी शिक्षकाशी आवाजात संवाद साधण्यासाठी कधीही येथे क्लिक करा.",
            bn: "Aki-র সাথে পরিচিত হোন! আপনার জাপানি শিক্ষকের সাথে ভয়েস কথোপকথন করতে যে কোনও সময় এখানে ক্লিক করুন।",
            te: "Akiని కలవండి! మీ జపనీస్ గురువుతో వాయిస్ సంభాషణ చేయడానికి ఎప్పుడైనా ఇక్కడ క్లిక్ చేయండి.",
            ta: "Aki-யைச் சந்திக்கவும்! உங்கள் ஜப்பானிய ஆசிரியருடன் குரல் உரையாடலை மேற்கொள்ள எப்போது வேண்டுமானாலும் இங்கே கிளிக் செய்யவும்.",
            gu: "Aki ને મળો! તમારા જાપાનીઝ શિક્ષક સાથે વૉઇસ વાતચીત કરવા માટે ગમે ત્યારે અહીં ક્લિક કરો.",
            kn: "Aki ಅವರನ್ನು ಭೇಟಿ ಮಾಡಿ! ನಿಮ್ಮ ಜಪಾನೀಸ್ ಶಿಕ್ಷಕರೊಂದಿಗೆ ಧ್ವನಿ ಸಂಭಾಷಣೆ ನಡೆಸಲು ಯಾವಾಗ ಬೇಕಾದರೂ ಇಲ್ಲಿ ಕ್ಲಿಕ್ ಮಾಡಿ.",
            ml: "Aki-യെ പരിചയപ്പെടൂ! നിങ്ങളുടെ ജാപ്പനീസ് അധ്യാപകനുമായി വോയ്‌സ് സംഭാഷണം നടത്താൻ എപ്പോൾ വേണമെങ്കിലും ഇവിടെ ക്ലിక్ ചെയ്യുക.",
            pa: "Aki ਨੂੰ ਮਿਲੋ! ਆਪਣੇ ਜਾਪਾਨੀ ਸਿੱਖਿਆਰਥੀ ਨਾਲ ਆਵਾਜ਼ ਵਿੱਚ ਗੱਲਬਾਤ ਕਰਨ ਲਈ ਕਿਸੇ ਵੀ ਸਮੇਂ ਇੱਥੇ ਕਲਿੱਕ ਕਰੋ।"
        },
    },
];

interface TutorialProps {
    onComplete: (language: string) => void;
    show: boolean;
}

export default function Tutorial({ onComplete, show }: TutorialProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
    const { setSidebarVisible } = useLayout();
    const [highlightBox, setHighlightBox] = useState<{
        top: number;
        left: number;
        width: number;
        height: number;
    } | null>(null);

    const updateHighlight = useCallback(() => {
        const step = tutorialSteps[currentStep];
        if (step.targetId) {
            const element = document.getElementById(step.targetId);
            if (element) {
                const rect = element.getBoundingClientRect();
                setHighlightBox({
                    top: rect.top - 8,
                    left: rect.left - 8,
                    width: rect.width + 16,
                    height: rect.height + 16,
                });
            }
        } else {
            setHighlightBox(null);
        }
    }, [currentStep]);

    // Only scroll to element and handle sidebar when step changes
    useEffect(() => {
        const step = tutorialSteps[currentStep];
        let timeoutId: NodeJS.Timeout;

        if (show) {
            if (step.targetId?.startsWith("sidebar-")) {
                setSidebarVisible(true);
                // Give it slightly more time to open and for DOM to stabilize
                timeoutId = setTimeout(() => {
                    const element = document.getElementById(step.targetId!);
                    if (element) {
                        element.scrollIntoView({ behavior: "smooth", block: "center" });
                        // Re-trigger highlight calculation after scroll
                        setTimeout(updateHighlight, 300);
                    }
                }, 500);
            } else {
                // Auto-close sidebar if moving away from sidebar elements
                setSidebarVisible(false);

                if (step.targetId) {
                    const element = document.getElementById(step.targetId);
                    if (element) {
                        element.scrollIntoView({ behavior: "smooth", block: "center" });
                        // Position highlight after scroll
                        setTimeout(updateHighlight, 300);
                    }
                }
            }
        }

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [currentStep, show, setSidebarVisible, updateHighlight]);

    useEffect(() => {
        if (show) {
            updateHighlight();
            window.addEventListener("resize", updateHighlight);
            window.addEventListener("scroll", updateHighlight, true);
        }
        return () => {
            window.removeEventListener("resize", updateHighlight);
            window.removeEventListener("scroll", updateHighlight, true);
        };
    }, [show, updateHighlight]);

    if (!show) return null;

    const handleNext = () => {
        if (currentStep < tutorialSteps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            onComplete(selectedLanguage || "en");
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const stepData = tutorialSteps[currentStep];
    const lang = selectedLanguage || "en";

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 pointer-events-none">
            {/* NO dimmed background as requested */}

            {/* Highlight Border Overlay */}
            {highlightBox && (
                <div
                    className="absolute border-4 border-accent-red rounded-xl bg-transparent transition-all duration-300 pointer-events-none animate-pulse shadow-[0_0_20px_rgba(217,61,61,0.4)]"
                    style={{
                        top: highlightBox.top,
                        left: highlightBox.left,
                        width: highlightBox.width,
                        height: highlightBox.height,
                    }}
                />
            )}

            {/* Dialogue Box */}
            <div
                className={cn(
                    "relative bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] p-8 max-w-md w-full border border-gray-100 flex flex-col gap-6 animate-in zoom-in-95 duration-300 pointer-events-auto",
                    highlightBox ? "mt-auto mb-12 sm:mb-24" : ""
                )}
            >
                <button
                    onClick={() => onComplete(selectedLanguage || "en")}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-red-100 shrink-0 flex items-center justify-center overflow-hidden border-2 border-red-50 relative">
                        <Image
                            src="/voicechat_aki.png"
                            alt="Aki"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                            {stepData.title ? stepData.title[lang] || stepData.title['en'] : "Sensei Aki"}
                        </h3>
                        <p className="text-gray-600 leading-relaxed italic">
                            "{stepData.texts[lang] || stepData.texts['en']}"
                        </p>
                    </div>
                </div>

                {/* Mother Tongue Selection Grid */}
                {currentStep === 0 && (
                    <div className="grid grid-cols-2 gap-2 mt-2 max-h-64 overflow-y-auto pr-2 custom-scroll">
                        {[
                            { id: "en", label: "English", sub: "English" },
                            { id: "hi", label: "Hindi", sub: "हिन्दी" },
                            { id: "mr", label: "Marathi", sub: "मराठी" },
                            { id: "bn", label: "Bengali", sub: "বাংলা" },
                            { id: "te", label: "Telugu", sub: "తెలుగు" },
                            { id: "ta", label: "Tamil", sub: "தமிழ்" },
                            { id: "gu", label: "Gujarati", sub: "ગુજરાતી" },
                            { id: "kn", label: "Kannada", sub: "ಕನ್ನಡ" },
                            { id: "ml", label: "Malayalam", sub: "മലയാളം" },
                            { id: "pa", label: "Punjabi", sub: "ਪੰਜਾਬੀ" },
                            { id: "ja", label: "Japanese", sub: "日本語" },
                        ].map((l) => (
                            <button
                                key={l.id}
                                onClick={() => setSelectedLanguage(l.id)}
                                className={cn(
                                    "flex flex-col p-3 rounded-xl border-2 transition-all duration-200 text-left",
                                    selectedLanguage === l.id
                                        ? "border-accent-red bg-red-50 ring-2 ring-red-100"
                                        : "border-gray-100 hover:border-gray-200 bg-gray-50/50"
                                )}
                            >
                                <div className="font-bold text-gray-900 text-sm">{l.label}</div>
                                <div className="text-xs text-gray-500">{l.sub}</div>
                            </button>
                        ))}
                    </div>
                )}

                {/* Navigation */}
                <div className="flex justify-between items-center mt-4">
                    <div className="flex gap-1">
                        {tutorialSteps.map((_, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "h-1.5 rounded-full transition-all duration-300",
                                    currentStep === i ? "w-6 bg-accent-red" : "w-1.5 bg-gray-200"
                                )}
                            />
                        ))}
                    </div>

                    <div className="flex gap-3">
                        {currentStep > 0 && (
                            <button
                                onClick={handlePrev}
                                className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                        )}
                        <button
                            disabled={currentStep === 0 && !selectedLanguage}
                            onClick={handleNext}
                            className={cn(
                                "flex items-center gap-2 bg-ink text-white px-6 py-2 rounded-xl hover:bg-black transition-all shadow-lg hover:shadow-xl transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed",
                                currentStep === tutorialSteps.length - 1 && "bg-accent-red hover:bg-red-700"
                            )}
                        >
                            <span className="font-bold">
                                {currentStep === tutorialSteps.length - 1 ? "Finish" : "Next"}
                            </span>
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
