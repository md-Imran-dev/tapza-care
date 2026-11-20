import type { Lang } from "../data/types";

// English copy is the lookup key; names, medicine data and unknown remote copy stay unchanged.
const messages: Record<string, readonly [string, string]> = {
  Home: ["होम", "హోమ్"],
  Bookings: ["बुकिंग", "బుకింగ్‌లు"],
  Prescriptions: ["प्रिस्क्रिप्शन", "మందుల చీటీలు"],
  Profile: ["प्रोफ़ाइल", "ప్రొఫైల్"],
  "Changing language…": ["भाषा बदली जा रही है…", "భాష మారుస్తున్నాము…"],
  "Could not change language. Please retry.": [
    "भाषा नहीं बदल सकी। फिर कोशिश करें।",
    "భాష మార్చలేకపోయాము. మళ్లీ ప్రయత్నించండి.",
  ],
  "Search doctors, labs, medicines…": [
    "डॉक्टर, जांच, दवाएं खोजें…",
    "వైద్యులు, పరీక్షలు, మందులు వెతకండి…",
  ],
  "Search doctors": ["डॉक्टर खोजें", "వైద్యులను వెతకండి"],
  "Search name or specialty": [
    "नाम या विशेषज्ञता खोजें",
    "పేరు లేదా ప్రత్యేకత వెతకండి",
  ],
  "Namaste 🙏": ["नमस्ते 🙏", "నమస్కారం 🙏"],
  "Shubh Deepavali 🪔": ["शुभ दीपावली 🪔", "దీపావళి శుభాకాంక్షలు 🪔"],
  there: ["आप", "మీకు"],
  "Book visit": ["अपॉइंटमेंट लें", "అపాయింట్‌మెంట్ బుక్ చేయండి"],
  "Book a visit": ["अपॉइंटमेंट लें", "అపాయింట్‌మెంట్ బుక్ చేయండి"],
  "+ Book a visit": ["+ अपॉइंटमेंट लें", "+ అపాయింట్‌మెంట్ బుక్ చేయండి"],
  "Book festive visit": [
    "त्योहार पर अपॉइंटमेंट लें",
    "పండుగ అపాయింట్‌మెంట్ బుక్ చేయండి",
  ],
  "Book a clinic visit": [
    "क्लिनिक अपॉइंटमेंट लें",
    "క్లినిక్ అపాయింట్‌మెంట్ బుక్ చేయండి",
  ],
  "Book session": ["अपॉइंटमेंट बुक करें", "అపాయింట్‌మెంట్ బుక్ చేయండి"],
  "Book Now": ["अभी बुक करें", "ఇప్పుడే బుక్ చేయండి"],
  Book: ["बुक करें", "బుక్ చేయండి"],
  Consult: ["परामर्श", "సంప్రదింపు"],
  "Lab tests": ["लैब जांच", "ల్యాబ్ పరీక్షలు"],
  Pharmacy: ["दवाइयां", "మందులు"],
  Vaccines: ["टीके", "టీకాలు"],
  Dental: ["दांतों की देखभाल", "దంత సంరక్షణ"],
  "X-Ray": ["एक्स-रे", "ఎక్స్‌రే"],
  "What do you need today?": ["आज आपको क्या चाहिए?", "ఈరోజు మీకు ఏమి కావాలి?"],
  "Quick actions": ["ज़रूरी सुविधाएं", "త్వరిత సేవలు"],
  "One tap for family care": [
    "परिवार की देखभाल, एक टैप में",
    "కుటుంబ సంరక్షణకు ఒక ట్యాప్",
  ],
  Reminders: ["याद दिलाएं", "రిమైండర్లు"],
  Family: ["परिवार", "కుటుంబం"],
  "Doctor visit": ["डॉक्टर से मिलें", "వైద్యుడిని కలవండి"],
  "Clinic services": ["क्लिनिक सेवाएं", "క్లినిక్ సేవలు"],
  "Doctors near you": ["आपके पास के डॉक्टर", "మీ సమీపంలోని వైద్యులు"],
  "Festival doctors on duty": [
    "त्योहार पर उपलब्ध डॉक्टर",
    "పండుగ రోజున అందుబాటులో వైద్యులు",
  ],
  "Festival needs?": ["त्योहार पर क्या चाहिए?", "పండుగకు ఏమి కావాలి?"],
  "Mithas-free health combos": [
    "स्वास्थ्य जांच पैकेज",
    "ఆరోగ్య పరీక్షల ప్యాకేజీలు",
  ],
  "ADD +": ["जोड़ें +", "జోడించండి +"],
  FREE: ["मुफ़्त", "ఉచితం"],
  "FREE · ₹0": ["मुफ़्त · ₹0", "ఉచితం · ₹0"],
  Bestseller: ["सबसे लोकप्रिय", "అత్యంత ప్రజాదరణ"],
  "Home Sample Collection": ["घर से सैंपल कलेक्शन", "ఇంటి వద్ద నమూనా సేకరణ"],
  "Full Body Checkup (72 tests)": [
    "पूरे शरीर की जांच (72 टेस्ट)",
    "పూర్తి శరీర పరీక్ష (72 పరీక్షలు)",
  ],
  "Fever + Viral Panel": ["बुखार और वायरल जांच", "జ్వరం మరియు వైరల్ పరీక్షలు"],
  "Diabetes Care (HbA1c + Consult)": [
    "डायबिटीज देखभाल (HbA1c + परामर्श)",
    "మధుమేహ సంరక్షణ (HbA1c + సంప్రదింపు)",
  ],
  "Diwali Family Pack (4 persons)": [
    "दीवाली फैमिली पैक (4 लोग)",
    "దీపావళి కుటుంబ ప్యాక్ (4 మంది)",
  ],
  "Sugar & Heart Festive Panel": [
    "शुगर और हृदय जांच पैकेज",
    "చక్కెర మరియు గుండె పరీక్షల ప్యాకేజీ",
  ],
  "Cracker Pollution Lung Check": [
    "पटाखों के प्रदूषण की फेफड़ों की जांच",
    "టపాసుల కాలుష్య ఊపిరితిత్తుల పరీక్ష",
  ],
  "Free Home Collection + Diya": [
    "मुफ़्त होम कलेक्शन + दीया",
    "ఉచిత ఇంటి సేకరణ + దీపం",
  ],
  "Choose a doctor": ["डॉक्टर चुनें", "వైద్యుడిని ఎంచుకోండి"],
  "Choose your doctor": ["अपना डॉक्टर चुनें", "మీ వైద్యుడిని ఎంచుకోండి"],
  "Previously consulted": ["पहले मिले डॉक्टर", "గతంలో సంప్రదించిన వారు"],
  "Previously consulted doctors": [
    "पहले मिले डॉक्टर",
    "గతంలో సంప్రదించిన వైద్యులు",
  ],
  "No previously consulted doctors found in your prescription history.": [
    "आपके प्रिस्क्रिप्शन में पहले मिले डॉक्टर नहीं हैं।",
    "మీ మందుల చీటీలలో గతంలో సంప్రదించిన వైద్యులు లేరు.",
  ],
  "No doctors available right now.": [
    "अभी कोई डॉक्टर उपलब्ध नहीं है।",
    "ప్రస్తుతం వైద్యులు అందుబాటులో లేరు.",
  ],
  "Select a doctor to see dates and available times.": [
    "तारीख और उपलब्ध समय देखने के लिए डॉक्टर चुनें।",
    "తేదీలు మరియు అందుబాటులో సమయాలు చూడటానికి వైద్యుడిని ఎంచుకోండి.",
  ],
  "Select date": ["तारीख चुनें", "తేదీ ఎంచుకోండి"],
  "Pick a date": ["तारीख चुनें", "తేదీ ఎంచుకోండి"],
  "PICK A DATE": ["तारीख चुनें", "తేదీ ఎంచుకోండి"],
  "Select time": ["समय चुनें", "సమయం ఎంచుకోండి"],
  "Available times": ["उपलब्ध समय", "అందుబాటులో సమయాలు"],
  Morning: ["सुबह", "ఉదయం"],
  Afternoon: ["दोपहर", "మధ్యాహ్నం"],
  Evening: ["शाम", "సాయంత్రం"],
  Night: ["रात", "రాత్రి"],
  "🌅 Morning": ["🌅 सुबह", "🌅 ఉదయం"],
  "☀️ Afternoon": ["☀️ दोपहर", "☀️ మధ్యాహ్నం"],
  "🌙 Evening": ["🌙 शाम", "🌙 సాయంత్రం"],
  "Retry available times": ["समय फिर देखें", "సమయాలను మళ్లీ చూడండి"],
  "Retry slots": ["समय फिर देखें", "సమయాలను మళ్లీ చూడండి"],
  Retry: ["फिर कोशिश करें", "మళ్లీ ప్రయత్నించండి"],
  "Retry home": ["होम फिर लोड करें", "హోమ్ మళ్లీ లోడ్ చేయండి"],
  "No times available. Please choose another date.": [
    "कोई समय उपलब्ध नहीं है। दूसरी तारीख चुनें।",
    "సమయాలు అందుబాటులో లేవు. మరో తేదీ ఎంచుకోండి.",
  ],
  "Slots couldn’t load": ["समय लोड नहीं हो सके", "సమయాలు లోడ్ కాలేదు"],
  "Check your connection and try again.": [
    "कनेक्शन जांचकर फिर कोशिश करें।",
    "కనెక్షన్ తనిఖీ చేసి మళ్లీ ప్రయత్నించండి.",
  ],
  "No slots available": ["कोई समय उपलब्ध नहीं है", "సమయాలు అందుబాటులో లేవు"],
  "Try another date or check back later.": [
    "दूसरी तारीख चुनें या बाद में देखें।",
    "మరో తేదీ ఎంచుకోండి లేదా తర్వాత చూడండి.",
  ],
  "Try tomorrow": ["कल के समय देखें", "రేపటి సమయాలు చూడండి"],
  "Confirming…": ["पुष्टि की जा रही है…", "నిర్ధారిస్తున్నాము…"],
  "Confirm booking": ["बुकिंग पक्की करें", "బుకింగ్ నిర్ధారించండి"],
  "Select a slot to continue": [
    "आगे बढ़ने के लिए समय चुनें",
    "కొనసాగడానికి సమయం ఎంచుకోండి",
  ],
  "Booking confirmed! 🎉": [
    "बुकिंग पक्की हो गई! 🎉",
    "బుకింగ్ నిర్ధారించబడింది! 🎉",
  ],
  "Saved offline": ["ऑफ़लाइन सहेजा गया", "ఆఫ్‌లైన్‌లో సేవ్ అయింది"],
  "View my bookings": ["मेरी बुकिंग देखें", "నా బుకింగ్‌లు చూడండి"],
  "Slot just taken (409). Pick another time to retry.": [
    "यह समय अभी बुक हो गया (409)। दूसरा समय चुनें।",
    "ఈ సమయం ఇప్పుడే బుక్ అయింది (409). మరో సమయం ఎంచుకోండి.",
  ],
  "Free reschedule · Care for your whole family": [
    "समय बदलना मुफ़्त · पूरे परिवार की देखभाल",
    "ఉచిత సమయ మార్పు · మీ కుటుంబమంతటికీ సంరక్షణ",
  ],
  "Pay at clinic": ["क्लिनिक पर भुगतान करें", "క్లినిక్‌లో చెల్లించండి"],
  "· Pay at clinic": ["· क्लिनिक पर भुगतान करें", "· క్లినిక్‌లో చెల్లించండి"],
  "· Pay at visit": ["· विज़िट पर भुगतान करें", "· సందర్శనలో చెల్లించండి"],
  Experience: ["अनुभव", "అనుభవం"],
  "years experience": ["साल का अनुभव", "సంవత్సరాల అనుభవం"],
  years: ["साल", "సంవత్సరాలు"],
  "· Doctor rating": ["· डॉक्टर की रेटिंग", "· వైద్యుడి రేటింగ్"],
  Speaks: ["भाषाएं", "భాషలు"],
  Pediatrician: ["बाल रोग विशेषज्ञ", "పిల్లల వైద్యుడు"],
  Dermatologist: ["त्वचा रोग विशेषज्ञ", "చర్మ వైద్యుడు"],
  Orthopedic: ["हड्डी रोग विशेषज्ञ", "ఎముకల వైద్యుడు"],
  "Your bookings": ["आपकी बुकिंग", "మీ బుకింగ్‌లు"],
  "Your family’s care, all in one place": [
    "परिवार की देखभाल, एक ही जगह",
    "మీ కుటుంబ సంరక్షణ ఒకే చోట",
  ],
  "Syncing saved visits…": [
    "सहेजी गई बुकिंग सिंक हो रही हैं…",
    "సేవ్ చేసిన బుకింగ్‌లు సమకాలీకరిస్తున్నాము…",
  ],
  "No visits yet": ["अभी कोई बुकिंग नहीं है", "ఇంకా బుకింగ్‌లు లేవు"],
  "Your next step to feeling better starts here.": [
    "बेहतर सेहत की शुरुआत यहां से करें।",
    "మెరుగైన ఆరోగ్యం వైపు తొలి అడుగు ఇక్కడే.",
  ],
  "Find a doctor": ["डॉक्टर खोजें", "వైద్యుడిని వెతకండి"],
  CONFIRMED: ["पुष्टि हुई", "నిర్ధారించబడింది"],
  PENDING: ["पुष्टि बाकी", "నిర్ధారణ పెండింగ్"],
  QUEUED: ["सिंक होना बाकी", "సమకాలీకరణ కోసం వేచి ఉంది"],
  FAILED: ["असफल", "విఫలమైంది"],
  "Token assigned after confirmation": [
    "पुष्टि के बाद टोकन मिलेगा",
    "నిర్ధారణ తర్వాత టోకెన్ లభిస్తుంది",
  ],
  "Saved offline. We’ll retry when you reconnect.": [
    "ऑफ़लाइन सहेजा गया। कनेक्ट होने पर फिर कोशिश करेंगे।",
    "ఆఫ్‌లైన్‌లో సేవ్ అయింది. కనెక్ట్ అయినప్పుడు మళ్లీ ప్రయత్నిస్తాము.",
  ],
  "Pick another slot": ["दूसरा समय चुनें", "మరో సమయం ఎంచుకోండి"],
  "Your prescriptions": ["आपके प्रिस्क्रिप्शन", "మీ మందుల చీటీలు"],
  "Care continues after your clinic visit": [
    "क्लिनिक के बाद भी देखभाल जारी",
    "క్లినిక్ సందర్శన తర్వాత కూడా సంరక్షణ",
  ],
  "Medicine reminders": ["दवा की याद दिलाएं", "మందుల రిమైండర్లు"],
  "Enable medicine reminders": [
    "दवा के रिमाइंडर चालू करें",
    "మందుల రిమైండర్లు ఆన్ చేయండి",
  ],
  "Scheduling…": ["समय तय हो रहा है…", "షెడ్యూల్ చేస్తున్నాము…"],
  "No upcoming doses in these prescriptions.": [
    "इन प्रिस्क्रिप्शन में आगे की खुराक नहीं है।",
    "ఈ మందుల చీటీలలో రాబోయే మోతాదులు లేవు.",
  ],
  "No prescriptions yet": [
    "अभी कोई प्रिस्क्रिप्शन नहीं है",
    "ఇంకా మందుల చీటీలు లేవు",
  ],
  "After your clinic visit, your medicines and schedule will appear here.": [
    "क्लिनिक के बाद दवाएं और समय यहां दिखेंगे।",
    "క్లినిక్ సందర్శన తర్వాత మందులు మరియు సమయాలు ఇక్కడ కనిపిస్తాయి.",
  ],
  "Prescriptions couldn’t refresh": [
    "प्रिस्क्रिप्शन अपडेट नहीं हो सके",
    "మందుల చీటీలు నవీకరించలేకపోయాము",
  ],
  "Check your connection. Saved doses are safe.": [
    "कनेक्शन जांचें। सहेजी गई खुराक सुरक्षित हैं।",
    "కనెక్షన్ తనిఖీ చేయండి. సేవ్ చేసిన మోతాదులు సురక్షితం.",
  ],
  days: ["दिन", "రోజులు"],
  medicines: ["दवाएं", "మందులు"],
  "· After food": ["· खाने के बाद", "· భోజనం తర్వాత"],
  "· Before food": ["· खाने से पहले", "· భోజనం ముందు"],
  "Today ·": ["आज ·", "ఈరోజు ·"],
  "Your family, our care": [
    "आपका परिवार, हमारी देखभाल",
    "మీ కుటుంబం, మా సంరక్షణ",
  ],
  "Manage family members": ["परिवार के सदस्य देखें", "కుటుంబ సభ్యులను చూడండి"],
  "Make yourself at home": ["अपनी पसंद चुनें", "మీ ప్రాధాన్యతలను ఎంచుకోండి"],
  "Home configuration v": ["होम कॉन्फ़िगरेशन v", "హోమ్ కాన్ఫిగరేషన్ v"],
  "🪔 Diwali · Switch to normal": [
    "🪔 दीवाली · सामान्य थीम चुनें",
    "🪔 దీపావళి · సాధారణ థీమ్‌కు మారండి",
  ],
  "☀️ Normal day · Switch to Diwali": [
    "☀️ सामान्य दिन · दीवाली थीम चुनें",
    "☀️ సాధారణ రోజు · దీపావళి థీమ్‌కు మారండి",
  ],
  "Demo lab & live config editor": [
    "डेमो और कॉन्फ़िग संपादक",
    "డెమో మరియు కాన్ఫిగ్ ఎడిటర్",
  ],
  "Sign out": ["लॉग आउट", "లాగ్ అవుట్"],
  "Sign out?": ["लॉग आउट करें?", "లాగ్ అవుట్ చేయాలా?"],
  "Are you sure you want to sign out of Tapza Care?": [
    "क्या आप Tapza Care से लॉग आउट करना चाहते हैं?",
    "మీరు Tapza Care నుండి లాగ్ అవుట్ చేయాలనుకుంటున్నారా?",
  ],
  Cancel: ["रद्द करें", "రద్దు చేయండి"],
  "Please wait…": ["कृपया प्रतीक्षा करें…", "దయచేసి వేచి ఉండండి…"],
  "Could not sign out": ["लॉग आउट नहीं हो सका", "లాగ్ అవుట్ కాలేదు"],
  "Please retry.": ["फिर कोशिश करें।", "మళ్లీ ప్రయత్నించండి."],
  "Your family": ["आपका परिवार", "మీ కుటుంబం"],
  "A little care for everyone you love": [
    "हर प्रियजन के लिए थोड़ी देखभाल",
    "మీ ప్రియమైన వారందరికీ సంరక్షణ",
  ],
  "Your neighbourhood clinic": ["आपके पड़ोस का क्लिनिक", "మీ సమీప క్లినిక్"],
  "Doctors couldn’t refresh": [
    "डॉक्टर सूची अपडेट नहीं हो सकी",
    "వైద్యుల జాబితా నవీకరించలేకపోయాము",
  ],
  "Check your connection and retry.": [
    "कनेक्शन जांचकर फिर कोशिश करें।",
    "కనెక్షన్ తనిఖీ చేసి మళ్లీ ప్రయత్నించండి.",
  ],
  "No doctors found": ["कोई डॉक्टर नहीं मिला", "వైద్యులు కనబడలేదు"],
  "Try another name or specialty.": [
    "दूसरा नाम या विशेषज्ञता खोजें।",
    "మరో పేరు లేదా ప్రత్యేకత వెతకండి.",
  ],
  "Please check back soon for availability.": [
    "उपलब्धता के लिए बाद में देखें।",
    "అందుబాటు కోసం తర్వాత చూడండి.",
  ],
  "Doctor not found.": ["डॉक्टर नहीं मिला।", "వైద్యుడు కనబడలేదు."],
  "Collection address": ["सैंपल कलेक्शन का पता", "నమూనా సేకరణ చిరునామా"],
  "Visit location": ["क्लिनिक का पता", "సందర్శన స్థలం"],
  "Collection at your address": ["आपके पते पर कलेक्शन", "మీ చిరునామాలో సేకరణ"],
  "Clinic service appointment": [
    "क्लिनिक सेवा अपॉइंटमेंट",
    "క్లినిక్ సేవ అపాయింట్‌మెంట్",
  ],
  "House/flat, street, area, city and PIN code": [
    "घर/फ़्लैट, सड़क, इलाका, शहर और पिन कोड",
    "ఇల్లు/ఫ్లాట్, వీధి, ప్రాంతం, నగరం మరియు పిన్ కోడ్",
  ],
  "Enter your complete collection address and six-digit PIN code before confirming.":
    [
      "पुष्टि से पहले पूरा पता और छह अंकों का पिन कोड भरें।",
      "నిర్ధారణకు ముందు పూర్తి చిరునామా మరియు ఆరు అంకెల పిన్ కోడ్ ఇవ్వండి.",
    ],
  "Include a valid six-digit PIN code in your collection address.": [
    "पते में सही छह अंकों का पिन कोड जोड़ें।",
    "చిరునామాలో సరైన ఆరు అంకెల పిన్ కోడ్ ఇవ్వండి.",
  ],
  "Enter a complete address (at least 10 characters).": [
    "पूरा पता भरें (कम से कम 10 अक्षर)।",
    "పూర్తి చిరునామా ఇవ్వండి (కనీసం 10 అక్షరాలు).",
  ],
  "Confirm home collection": [
    "होम कलेक्शन पक्का करें",
    "ఇంటి సేకరణను నిర్ధారించండి",
  ],
  "Confirm service visit": [
    "सेवा अपॉइंटमेंट पक्का करें",
    "సేవ సందర్శనను నిర్ధారించండి",
  ],
  "Service saved offline": [
    "सेवा ऑफ़लाइन सहेजी गई",
    "సేవ ఆఫ్‌లైన్‌లో సేవ్ అయింది",
  ],
  "Service booking confirmed": [
    "सेवा बुकिंग पक्की हुई",
    "సేవ బుకింగ్ నిర్ధారించబడింది",
  ],
  "Home collection": ["होम कलेक्शन", "ఇంటి వద్ద సేకరణ"],
  "Clinic service": ["क्लिनिक सेवा", "క్లినిక్ సేవ"],
  "Demo booking · No real service or payment.": [
    "डेमो बुकिंग · असली सेवा या भुगतान नहीं।",
    "డెమో బుకింగ్ · నిజమైన సేవ లేదా చెల్లింపు లేదు.",
  ],
  "Demo only · No technician is dispatched or payment collected.": [
    "केवल डेमो · कोई तकनीशियन नहीं भेजा जाएगा, भुगतान नहीं होगा।",
    "డెమో మాత్రమే · సిబ్బందిని పంపడం లేదా చెల్లింపు సేకరణ జరగదు.",
  ],
  "This time has passed. Please choose another time.": [
    "यह समय बीत गया है। दूसरा समय चुनें।",
    "ఈ సమయం గడిచిపోయింది. మరో సమయం ఎంచుకోండి.",
  ],
  "Could not save your booking. Please try again.": [
    "बुकिंग सहेजी नहीं जा सकी। फिर कोशिश करें।",
    "బుకింగ్ సేవ్ కాలేదు. మళ్లీ ప్రయత్నించండి.",
  ],
  "No real bookings or messages": [
    "असली बुकिंग या संदेश नहीं",
    "నిజమైన బుకింగ్‌లు లేదా సందేశాలు లేవు",
  ],
  "Loading content": ["लोड हो रहा है", "లోడ్ అవుతోంది"],
  "Contact clinic": ["क्लिनिक से संपर्क करें", "క్లినిక్‌ను సంప్రదించండి"],
  "Close booking": ["बुकिंग बंद करें", "బుకింగ్ మూసివేయండి"],
  "12k reviews": ["12 हज़ार समीक्षाएं", "12 వేల సమీక్షలు"],
  "avg. wait": ["औसत इंतज़ार", "సగటు వేచి సమయం"],
  "starts at": ["शुरुआती कीमत", "ప్రారంభ ధర"],
  "all checkups": ["सभी जांच", "అన్ని పరీక్షలు"],
  "Free diya": ["मुफ़्त दीया", "ఉచిత దీపం"],
  "with visit": ["विज़िट के साथ", "సందర్శనతో"],
  "festival hours": ["त्योहार का समय", "పండుగ వేళలు"],
  "All ages": ["हर उम्र", "అన్ని వయసులు"],
  "Same day": ["उसी दिन", "అదే రోజు"],
  New: ["नया", "కొత్తది"],
  "General Physician": ["सामान्य चिकित्सक", "సాధారణ వైద్యుడు"],
  "Enter 10-digit number": ["10 अंकों का नंबर भरें", "10 అంకెల నంబర్ ఇవ్వండి"],
  "Your name": ["आपका नाम", "మీ పేరు"],
  "Tapza Clinic · Madhapur is open till 9 PM today": [
    "Tapza Clinic · माधापुर आज रात 9 बजे तक खुला है",
    "Tapza Clinic · మాదాపూర్ ఈరోజు రాత్రి 9 వరకు తెరిచి ఉంది",
  ],
  "Mithai kam, health zyada — book festive checkup for the whole family": [
    "मिठाई कम, सेहत ज़्यादा — पूरे परिवार की त्योहार पर जांच बुक करें",
    "తీపి తక్కువ, ఆరోగ్యం ఎక్కువ — కుటుంబమంతటికీ పండుగ పరీక్షలు బుక్ చేయండి",
  ],
  "Open today till 9 PM": [
    "आज रात 9 बजे तक खुला",
    "ఈరోజు రాత్రి 9 వరకు తెరిచి ఉంది",
  ],
  "🟢 Open today till 9 PM": [
    "🟢 आज रात 9 बजे तक खुला",
    "🟢 ఈరోజు రాత్రి 9 వరకు తెరిచి ఉంది",
  ],
  "Festival hours 7AM–11PM": [
    "त्योहार का समय सुबह 7–रात 11",
    "పండుగ వేళలు ఉదయం 7–రాత్రి 11",
  ],
  "🟢 Festival hours 7AM–11PM": [
    "🟢 त्योहार का समय सुबह 7–रात 11",
    "🟢 పండుగ వేళలు ఉదయం 7–రాత్రి 11",
  ],
  "Zepto-fast · Priced in ₹ · No hidden charges": [
    "तेज़ सेवा · कीमत ₹ में · कोई छुपा शुल्क नहीं",
    "త్వరిత సేవ · ధరలు ₹లో · దాచిన ఛార్జీలు లేవు",
  ],
  "Madhapur · Within 3 km · Speaks Telugu & Hindi": [
    "माधापुर · 3 किमी के भीतर · तेलुगु और हिंदी",
    "మాదాపూర్ · 3 కి.మీ. పరిధిలో · తెలుగు మరియు హిందీ",
  ],
  "Even on Diwali · 7 AM – 11 PM · Hyderabad + Vijayawada": [
    "दीवाली पर भी · सुबह 7–रात 11 · हैदराबाद + विजयवाड़ा",
    "దీపావళి రోజున కూడా · ఉదయం 7–రాత్రి 11 · హైదరాబాద్ + విజయవాడ",
  ],
  "Family packs · Zepto-fast reports in 6 hrs": [
    "फैमिली पैक · 6 घंटे में तेज़ रिपोर्ट",
    "కుటుంబ ప్యాక్‌లు · 6 గంటల్లో రిపోర్టులు",
  ],
  "Monsoon Health Camp — Free BP & Sugar check till Sunday": [
    "मानसून स्वास्थ्य शिविर — रविवार तक BP और शुगर जांच मुफ़्त",
    "వర్షాకాల ఆరోగ్య శిబిరం — ఆదివారం వరకు BP మరియు చక్కెర పరీక్ష ఉచితం",
  ],
  "WhatsApp us": ["WhatsApp पर संपर्क करें", "WhatsAppలో సంప్రదించండి"],
  "Trusted care · Hyderabad & Vijayawada": [
    "भरोसेमंद देखभाल · हैदराबाद और विजयवाड़ा",
    "నమ్మకమైన సంరక్షణ · హైదరాబాద్ మరియు విజయవాడ",
  ],
  "Offline · Showing saved slots. Availability is confirmed when you reconnect.":
    [
      "ऑफ़लाइन · सहेजे हुए समय दिख रहे हैं। जुड़ने पर उपलब्धता पक्की होगी।",
      "ఆఫ్‌లైన్ · సేవ్ చేసిన సమయాలు చూపిస్తున్నాము. కనెక్ట్ అయినప్పుడు అందుబాటు నిర్ధారిస్తాము.",
    ],
  "Your visit will sync when you go online.": [
    "ऑनलाइन होने पर आपकी बुकिंग सिंक होगी।",
    "ఆన్‌లైన్‌లోకి వచ్చినప్పుడు మీ బుకింగ్ సమకాలీకరించబడుతుంది.",
  ],
  "Offline · Saved availability only. We’ll confirm your request when you reconnect.":
    [
      "ऑफ़लाइन · सहेजी हुई उपलब्धता। जुड़ने पर बुकिंग पक्की करेंगे।",
      "ఆఫ్‌లైన్ · సేవ్ చేసిన అందుబాటు మాత్రమే. కనెక్ట్ అయినప్పుడు మీ అభ్యర్థన నిర్ధారిస్తాము.",
    ],
  "We couldn’t confirm this service. Availability or service details may have changed. Select a new time or reopen the service.":
    [
      "सेवा पक्की नहीं हो सकी। समय या जानकारी बदल सकती है। नया समय चुनें या सेवा फिर खोलें।",
      "సేవ నిర్ధారించలేకపోయాము. సమయం లేదా వివరాలు మారి ఉండవచ్చు. కొత్త సమయం ఎంచుకోండి లేదా సేవ మళ్లీ తెరవండి.",
    ],
  "This service is no longer available. Please return to Home and choose another service.":
    [
      "यह सेवा अब उपलब्ध नहीं है। होम पर जाकर दूसरी सेवा चुनें।",
      "ఈ సేవ ఇప్పుడు అందుబాటులో లేదు. హోమ్‌కు వెళ్లి మరో సేవ ఎంచుకోండి.",
    ],
  "The service or time is no longer available. Reopen the service to try again.":
    [
      "सेवा या समय अब उपलब्ध नहीं है। सेवा फिर खोलें।",
      "సేవ లేదా సమయం అందుబాటులో లేదు. మళ్లీ ప్రయత్నించడానికి సేవ తెరవండి.",
    ],
  "This slot was taken while your booking was offline.": [
    "ऑफ़लाइन रहते हुए यह समय बुक हो गया।",
    "మీరు ఆఫ్‌లైన్‌లో ఉన్నప్పుడు ఈ సమయం బుక్ అయింది.",
  ],
  "Could not refresh the home. Showing the last available layout.": [
    "होम अपडेट नहीं हो सका। आखिरी सहेजा लेआउट दिखा रहे हैं।",
    "హోమ్ నవీకరించలేకపోయాము. చివరిగా సేవ్ చేసిన లేఅవుట్ చూపిస్తున్నాము.",
  ],
  "Changes could not be saved. Please check device storage.": [
    "बदलाव सहेजे नहीं जा सके। डिवाइस स्टोरेज जांचें।",
    "మార్పులు సేవ్ కాలేదు. పరికర నిల్వను తనిఖీ చేయండి.",
  ],
  "Saved data could not be restored. You can still use the app.": [
    "सहेजा डेटा वापस नहीं मिला। आप ऐप इस्तेमाल कर सकते हैं।",
    "సేవ్ చేసిన డేటా పునరుద్ధరించలేకపోయాము. మీరు యాప్ ఉపయోగించవచ్చు.",
  ],
  "Tapza Care · Assessment demo · No real bookings or messages": [
    "Tapza Care · डेमो · असली बुकिंग या संदेश नहीं",
    "Tapza Care · డెమో · నిజమైన బుకింగ్‌లు లేదా సందేశాలు లేవు",
  ],
  "WhatsApp communication is shown as a preview in this demo. No messages are sent.":
    [
      "इस डेमो में WhatsApp का केवल प्रीव्यू है। कोई संदेश नहीं भेजा जाता।",
      "ఈ డెమోలో WhatsApp ప్రివ్యూ మాత్రమే. సందేశాలు పంపబడవు.",
    ],
  "Demo lab": ["डेमो लैब", "డెమో ల్యాబ్"],
  "Refresh home & lists": [
    "होम और सूचियां अपडेट करें",
    "హోమ్ మరియు జాబితాలు నవీకరించండి",
  ],
  "Apply configuration": [
    "कॉन्फ़िगरेशन लागू करें",
    "కాన్ఫిగరేషన్ వర్తింపజేయండి",
  ],
  "Network delay": ["नेटवर्क में देरी", "నెట్‌వర్క్ ఆలస్యం"],
  "Please check your connection.": [
    "कनेक्शन जांचें।",
    "మీ కనెక్షన్ తనిఖీ చేయండి.",
  ],
  English: ["अंग्रेज़ी", "ఆంగ్లం"],
  Hindi: ["हिंदी", "హిందీ"],
  Telugu: ["तेलुगु", "తెలుగు"],
  "2hr delivery": ["2 घंटे में डिलीवरी", "2 గంటల్లో డెలివరీ"],
  "12 docs": ["12 डॉक्टर", "12 మంది వైద్యులు"],
  "40% off": ["40% छूट", "40% తగ్గింపు"],
  "40% OFF": ["40% छूट", "40% తగ్గింపు"],
  "50% OFF": ["50% छूट", "50% తగ్గింపు"],
  "3 active": ["3 चालू", "3 క్రియాశీలం"],
  "2 due today": ["आज 2 खुराक", "ఈరోజు 2 మోతాదులు"],
  "5 members": ["5 सदस्य", "5 మంది సభ్యులు"],

  "Welcome to better care": [
    "बेहतर देखभाल में आपका स्वागत है",
    "మెరుగైన సంరక్షణకు స్వాగతం",
  ],
  "Sign in with your mobile number to keep your family’s care together.": [
    "परिवार की देखभाल के लिए मोबाइल नंबर से साइन इन करें।",
    "మీ కుటుంబ సంరక్షణ కోసం మొబైల్ నంబర్‌తో సైన్ ఇన్ చేయండి.",
  ],
  "Mobile number": ["मोबाइल नंबर", "మొబైల్ నంబర్"],
  "Sending code…": ["कोड भेजा जा रहा है…", "కోడ్ పంపుతున్నాము…"],
  "Continue with OTP": ["OTP के साथ आगे बढ़ें", "OTPతో కొనసాగండి"],
  "What should we call you?": ["आपका नाम क्या है?", "మిమ్మల్ని ఏమని పిలవాలి?"],
  "One last step before we take care of the rest.": [
    "बस एक आखिरी कदम, फिर आपकी देखभाल।",
    "మీ సంరక్షణకు ముందు చివరి అడుగు.",
  ],
  "Full name": ["पूरा नाम", "పూర్తి పేరు"],
  "Your full name": ["आपका पूरा नाम", "మీ పూర్తి పేరు"],
  "Saving…": ["सहेजा जा रहा है…", "సేవ్ చేస్తున్నాము…"],
  "Start caring for my family": [
    "परिवार की देखभाल शुरू करें",
    "నా కుటుంబ సంరక్షణ ప్రారంభించండి",
  ],
  "Verify your number": ["अपना नंबर सत्यापित करें", "మీ నంబర్ నిర్ధారించండి"],
  "Verification code": ["सत्यापन कोड", "నిర్ధారణ కోడ్"],
  "‹ Change mobile number": ["‹ मोबाइल नंबर बदलें", "‹ మొబైల్ నంబర్ మార్చండి"],
  "Verifying…": ["सत्यापन हो रहा है…", "నిర్ధారిస్తున్నాము…"],
  "Verify & continue": ["सत्यापित करके आगे बढ़ें", "నిర్ధారించి కొనసాగండి"],
  "Resend code": ["कोड फिर भेजें", "కోడ్ మళ్లీ పంపండి"],
  "Demo verification code: 123456 · Valid for 5 minutes": [
    "डेमो कोड: 123456 · 5 मिनट तक मान्य",
    "డెమో కోడ్: 123456 · 5 నిమిషాల వరకు చెల్లుతుంది",
  ],
  "Get started": ["शुरू करें", "ప్రారంభించండి"],
  "Getting ready…": ["तैयारी हो रही है…", "సిద్ధం చేస్తున్నాము…"],
  "Visits without the wait": [
    "बिना इंतज़ार डॉक्टर से मिलें",
    "వేచి ఉండకుండా సందర్శనలు",
  ],
  "Prescriptions for your family": [
    "परिवार के प्रिस्क्रिप्शन",
    "మీ కుటుంబ మందుల చీటీలు",
  ],
  "Never lose track of a dose": [
    "दवा की खुराक न भूलें",
    "మందుల మోతాదు మరవకండి",
  ],
  "A little care. A healthier family.": [
    "थोड़ी देखभाल, स्वस्थ परिवार।",
    "చిన్న సంరక్షణ. ఆరోగ్యవంతమైన కుటుంబం.",
  ],
  "Your neighbourhood clinic, now in your pocket.": [
    "आपके पड़ोस का क्लिनिक, अब आपकी जेब में।",
    "మీ సమీప క్లినిక్, ఇప్పుడు మీ చేతిలో.",
  ],
  "~10 min": ["~10 मिनट", "~10 నిమిషాలు"],
  "Offline mode": ["ऑफ़लाइन मोड", "ఆఫ్‌లైన్ మోడ్"],
  "Fail config fetch": ["कॉन्फ़िग लोड असफल करें", "కాన్ఫిగ్ లోడ్ విఫలం చేయండి"],
  "Booking conflict (409)": ["बुकिंग टकराव (409)", "బుకింగ్ సంఘర్షణ (409)"],
  "Fail slot fetch": ["समय लोड असफल करें", "సమయాల లోడ్ విఫలం చేయండి"],
  "No available slots": ["कोई समय उपलब्ध नहीं", "అందుబాటులో సమయాలు లేవు"],
  "Empty doctor list": ["खाली डॉक्टर सूची", "ఖాళీ వైద్యుల జాబితా"],
  "Empty prescription list": ["खाली प्रिस्क्रिप्शन सूची", "ఖాళీ మందుల చీటీల జాబితా"],
  "Live configuration": ["लाइव कॉन्फ़िगरेशन", "లైవ్ కాన్ఫిగరేషన్"],
  "Test slow networks, server failures and empty states.": ["धीमे नेटवर्क, सर्वर असफलता और खाली सूचियां जांचें।", "నెమ్మది నెట్‌వర్క్, సర్వర్ వైఫల్యం మరియు ఖాళీ జాబితాలను పరీక్షించండి."],

};

export const localeFor = (lang: Lang) =>
  ({ en: "en-IN", hi: "hi-IN", te: "te-IN" })[lang];

export function translateText(text: string, lang: Lang): string {
  if (lang === "en") return text;
  const key = text.trim();
  const entry = Object.prototype.hasOwnProperty.call(messages, key) ? messages[key] : undefined;
  if (entry) return text.replace(key, entry[lang === "hi" ? 0 : 1]);
  const greeting = key.match(/^(Namaste|Shubh Deepavali), (.+)$/);
  if (greeting)
    return `${greeting[1] === "Namaste" ? (lang === "hi" ? "नमस्ते" : "నమస్కారం") : lang === "hi" ? "शुभ दीपावली" : "దీపావళి శుభాకాంక్షలు"}, ${greeting[2]}`;
  const visit = key.match(/^Your visit with (.+) is booked.\n(.+) · (.+)$/);
  if (visit)
    return `${lang === "hi" ? `${visit[1]} के साथ आपकी बुकिंग पक्की है।` : `${visit[1]}తో మీ బుకింగ్ నిర్ధారించబడింది.`}\n${visit[2]} · ${translateText(visit[3], lang)}`;
  const reminder = key.match(
    /^Next (\d+) dose reminders scheduled within the prescription durations\.$/,
  );
  if (reminder)
    return lang === "hi"
      ? `अगली ${reminder[1]} खुराक के रिमाइंडर तय किए गए हैं।`
      : `తదుపరి ${reminder[1]} మోతాదుల రిమైండర్లు షెడ్యూల్ అయ్యాయి.`;
  const countdown = key.match(/^Resend code in (\d+)s$/);
  if (countdown)
    return lang === "hi"
      ? `${countdown[1]} सेकंड में कोड फिर भेजें`
      : `${countdown[1]} సెకన్లలో కోడ్ మళ్లీ పంపండి`;
  const accessible = key.match(
    /^(View details for|Book now with|Select|Open|Portrait of) (.+)$/,
  );
  if (accessible) {
    const actions: Record<string, readonly [string, string]> = {
      "View details for": ["विवरण देखें", "వివరాలు చూడండి"],
      "Book now with": ["अपॉइंटमेंट लें", "అపాయింట్‌మెంట్ బుక్ చేయండి"],
      Select: ["चुनें", "ఎంచుకోండి"],
      Open: ["खोलें", "తెరవండి"],
      "Portrait of": ["फोटो", "ఫోటో"],
    };
    return `${accessible[2]} · ${actions[accessible[1]][lang === "hi" ? 0 : 1]}`;
  }
  const confirmation = key.match(/^Confirm booking · (.+)$/);
  if (confirmation)
    return `${translateText("Confirm booking", lang)} · ${translateText(confirmation[1], lang)}`;
  const time = key.match(/^(\d{1,2}:\d{2}) (AM|PM)$/);
  if (time)
    return `${time[1]} ${lang === "hi" ? (time[2] === "AM" ? "पूर्वाह्न" : "अपराह्न") : time[2] === "AM" ? "పూర్వాహ్నం" : "అపరాహ్నం"}`;
  const token = key.match(/^Token #(\d+)$/);
  if (token) return `${lang === "hi" ? "टोकन" : "టోకెన్"} #${token[1]}`;
  const price = key.match(/^(₹[\d,.]+) · Pay at (clinic|visit)$/);
  if (price)
    return `${price[1]} ${translateText(price[2] === "clinic" ? "· Pay at clinic" : "· Pay at visit", lang)}`;
  return text;
}
