import type { Doctor, LayoutConfig, Prescription } from "./types";
// ─── Real photography ───
export const IMG = {
  clinicHero:
    "https://images.pexels.com/photos/7789603/pexels-photo-7789603.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  clinicAlt:
    "https://images.pexels.com/photos/7789616/pexels-photo-7789616.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  docFemale:
    "https://images.pexels.com/photos/29995629/pexels-photo-29995629.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  docMaleSuit:
    "https://images.pexels.com/photos/39172781/pexels-photo-39172781.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  docSenior:
    "https://images.pexels.com/photos/12759731/pexels-photo-12759731.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  docHijab:
    "https://images.pexels.com/photos/37272329/pexels-photo-37272329.png?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
};
export const DOCTORS: Doctor[] = [
  {
    id: "d1",
    name: "Dr. Ananya Reddy",
    specialty: "General Physician",
    photoUrl: IMG.docFemale,
    feeInr: 499,
    languages: ["Telugu", "English", "Hindi"],
    expYears: 12,
    rating: 4.9,
    nextSlot: "Today · 6:30 PM",
    clinic: "Tapza Clinic · Madhapur, Hyderabad",
  },
  {
    id: "d2",
    name: "Dr. Ravi Shankar",
    specialty: "Pediatrician",
    photoUrl: IMG.docSenior,
    feeInr: 599,
    languages: ["Telugu", "English"],
    expYears: 18,
    rating: 4.8,
    nextSlot: "Today · 7:15 PM",
    clinic: "Tapza Clinic · Kukatpally, Hyderabad",
  },
  {
    id: "d3",
    name: "Dr. Fatima Khan",
    specialty: "Dermatologist",
    photoUrl: IMG.docHijab,
    feeInr: 699,
    languages: ["Hindi", "Urdu", "English"],
    expYears: 9,
    rating: 4.9,
    nextSlot: "Tomorrow · 10:00 AM",
    clinic: "Tapza Clinic · Vijayawada",
  },
  {
    id: "d4",
    name: "Dr. Vikram Rao",
    specialty: "Orthopedic",
    photoUrl: IMG.docMaleSuit,
    feeInr: 799,
    languages: ["Telugu", "English", "Hindi"],
    expYears: 15,
    rating: 4.7,
    nextSlot: "Tomorrow · 11:30 AM",
    clinic: "Tapza Clinic · Dilsukhnagar, Hyderabad",
  },
];
export const CONFIG_NORMAL: LayoutConfig = {
  version: 42,
  theme: {
    primary: "#0E7C6B",
    secondary: "#0B3D3A",
    background: "#F4F7F5",
    surface: "#FFFFFF",
    textPrimary: "#10201D",
    textSecondary: "#5E726E",
    accent: "#FF8A3D",
    festival: {
      name: "normal",
      greeting: "Namaste 🙏",
      bannerImageUrl: IMG.clinicHero,
    },
  },
  tabs: [
    { id: "t1", label: "Home", icon: "home", screen: "home" },
    { id: "t2", label: "Bookings", icon: "calendar", screen: "bookings" },
    { id: "t3", label: "Rx", icon: "rx", screen: "prescriptions" },
    { id: "t4", label: "Profile", icon: "user", screen: "profile" },
  ],
  sections: [
    {
      id: "hero",
      type: "hero_banner",
      background: {
        kind: "gradient",
        value: "linear-gradient(135deg,#0B3D3A 0%,#0E7C6B 60%,#14A085 100%)",
      },
      title: "Hero",
      items: [
        {
          greeting: "Namaste, Lakshmi garu 🙏",
          sub: "Tapza Clinic · Madhapur is open till 9 PM today",
          cta: "Book visit",
          image: IMG.clinicHero,
          stats: [
            { value: "4.9★", label: "12k reviews" },
            { value: "~10 min", label: "avg. wait" },
            { value: "₹499", label: "starts at" },
          ],
        },
      ],
    },
    {
      id: "chips",
      type: "category_chips",
      background: { kind: "color", value: "#F4F7F5" },
      title: "What do you need today?",
      items: [
        { id: "c1", label: "Consult", icon: "stethoscope", count: "12 docs" },
        { id: "c2", label: "Lab tests", icon: "flask", count: "40% off" },
        { id: "c3", label: "Pharmacy", icon: "pill", count: "2hr delivery" },
        { id: "c4", label: "Vaccines", icon: "syringe", count: "All ages" },
        { id: "c5", label: "X-Ray", icon: "scan", count: "Same day" },
        { id: "c6", label: "Dental", icon: "smile", count: "New" },
      ],
    },
    {
      id: "offer1",
      type: "offer_strip",
      background: { kind: "color", value: "#0B3D3A" },
      title: "Offer",
      items: [
        {
          id: "o1",
          message: "Monsoon Health Camp — Free BP & Sugar check till Sunday",
          code: "HEALTH40",
        },
      ],
    },
    {
      id: "quick",
      type: "quick_actions",
      background: { kind: "color", value: "#FFFFFF" },
      title: "Quick actions",
      subtitle: "One tap for family care",
      items: [
        {
          id: "q1",
          label: "Book",
          icon: "calendar-plus",
          desc: "Doctor visit",
        },
        {
          id: "q2",
          label: "Prescriptions",
          icon: "file-text",
          desc: "3 active",
        },
        { id: "q3", label: "Reminders", icon: "bell", desc: "2 due today" },
        { id: "q4", label: "Family", icon: "users", desc: "5 members" },
      ],
    },
    {
      id: "services",
      type: "service_grid",
      background: { kind: "color", value: "#EFF6F3" },
      title: "Clinic services",
      subtitle: "Zepto-fast · Priced in ₹ · No hidden charges",
      items: [
        {
          id: "s1",
          name: "Full Body Checkup (72 tests)",
          priceInr: 999,
          mrpInr: 2499,
          image: IMG.clinicAlt,
          badge: "Bestseller",
          rating: "4.8 (2.1k)",
        },
        {
          id: "s2",
          name: "Fever + Viral Panel",
          priceInr: 449,
          mrpInr: 899,
          image: IMG.clinicHero,
          badge: "40% OFF",
          rating: "4.9 (860)",
        },
        {
          id: "s3",
          name: "Diabetes Care (HbA1c + Consult)",
          priceInr: 799,
          image: IMG.clinicAlt,
          rating: "4.7 (540)",
        },
        {
          id: "s4",
          name: "Home Sample Collection",
          priceInr: 0,
          image: IMG.clinicHero,
          badge: "FREE",
          rating: "4.9 (3.4k)",
        },
      ],
    },
    {
      id: "docs",
      type: "doctor_carousel",
      background: {
        kind: "gradient",
        value: "linear-gradient(180deg,#FFFFFF 0%,#E6F2EE 100%)",
      },
      title: "Doctors near you",
      subtitle: "Madhapur · Within 3 km · Speaks Telugu & Hindi",
      items: [
        { doctorId: "d1", tag: "Available today" },
        { doctorId: "d2" },
        { doctorId: "d3" },
        { doctorId: "d4" },
      ],
    },
    {
      id: "mystery",
      type: "diwali_lucky_draw_xyz",
      background: { kind: "color", value: "#fff" },
      title: "Mystery",
      items: [],
    },
  ],
};
export const CONFIG_DIWALI: LayoutConfig = {
  version: 77,
  theme: {
    primary: "#B91C1C",
    secondary: "#451A03",
    background: "#FFF7ED",
    surface: "#FFFFFF",
    textPrimary: "#431407",
    textSecondary: "#754125",
    accent: "#F59E0B",
    festival: {
      name: "diwali",
      greeting: "Shubh Deepavali 🪔",
      bannerImageUrl: IMG.clinicAlt,
    },
  },
  tabs: [
    { id: "t1", label: "Home", icon: "home", screen: "home" },
    { id: "t2", label: "Bookings", icon: "calendar", screen: "bookings" },
    { id: "t3", label: "Rx", icon: "rx", screen: "prescriptions" },
    { id: "t4", label: "Profile", icon: "user", screen: "profile" },
  ],
  sections: [
    {
      id: "offer-d",
      type: "offer_strip",
      background: {
        kind: "gradient",
        value: "linear-gradient(90deg,#7C2D12,#B91C1C,#F59E0B)",
      },
      title: "Diwali Offer",
      items: [
        {
          id: "o1",
          message:
            "🪔 Diwali Dhamaka — Flat 50% off health checkups + free diya with every visit",
          code: "DIWALI50",
        },
      ],
    },
    {
      id: "hero-d",
      type: "hero_banner",
      background: {
        kind: "gradient",
        value: "linear-gradient(135deg,#451A03 0%,#9A3412 55%,#D97706 100%)",
      },
      title: "Hero",
      items: [
        {
          greeting: "Shubh Deepavali, Lakshmi garu 🪔",
          sub: "Mithai kam, health zyada — book festive checkup for the whole family",
          cta: "Book festive visit",
          image: IMG.clinicAlt,
          stats: [
            { value: "50% OFF", label: "all checkups" },
            { value: "Free diya", label: "with visit" },
            { value: "7 AM–11 PM", label: "festival hours" },
          ],
        },
      ],
    },
    {
      id: "docs-d",
      type: "doctor_carousel",
      background: {
        kind: "gradient",
        value: "linear-gradient(180deg,#FFF7ED 0%,#FDE68A 100%)",
      },
      title: "Festival doctors on duty",
      subtitle: "Even on Diwali · 7 AM – 11 PM · Hyderabad + Vijayawada",
      items: [
        { doctorId: "d3", tag: "Diwali duty" },
        { doctorId: "d1", tag: "Available today" },
        { doctorId: "d4" },
        { doctorId: "d2" },
      ],
    },
    {
      id: "services-d",
      type: "service_grid",
      background: { kind: "color", value: "#FFFBEB" },
      title: "Mithas-free health combos",
      subtitle: "Family packs · Zepto-fast reports in 6 hrs",
      items: [
        {
          id: "s1",
          name: "Diwali Family Pack (4 persons)",
          priceInr: 1499,
          mrpInr: 4999,
          image: IMG.clinicHero,
          badge: "DIWALI50",
          rating: "4.9 (5.2k)",
        },
        {
          id: "s2",
          name: "Sugar & Heart Festive Panel",
          priceInr: 599,
          mrpInr: 1499,
          image: IMG.clinicAlt,
          badge: "50% OFF",
          rating: "4.8 (1.9k)",
        },
        {
          id: "s3",
          name: "Cracker Pollution Lung Check",
          priceInr: 399,
          image: IMG.clinicAlt,
          rating: "4.7 (720)",
        },
        {
          id: "s4",
          name: "Free Home Collection + Diya",
          priceInr: 0,
          image: IMG.clinicHero,
          badge: "FREE 🪔",
          rating: "5.0 (8.1k)",
        },
      ],
    },
    {
      id: "chips-d",
      type: "category_chips",
      background: { kind: "color", value: "#FFF7ED" },
      title: "Festival needs?",
      items: [
        {
          id: "c1",
          label: "Sweets-Safe Consult",
          icon: "candy",
          count: "Spl.",
        },
        { id: "c2", label: "Lab tests", icon: "flask", count: "50% off" },
        { id: "c3", label: "Pharmacy", icon: "pill", count: "Free delivery" },
        { id: "c4", label: "Vaccines", icon: "syringe", count: "Flu shot" },
        {
          id: "c5",
          label: "Skin & Hair",
          icon: "sparkles",
          count: "Festive glow",
        },
      ],
    },
    {
      id: "quick-d",
      type: "quick_actions",
      background: { kind: "color", value: "#FFFFFF" },
      title: "Quick actions",
      subtitle: "Shubh Deepavali — care for dadi to chintu",
      items: [
        {
          id: "q1",
          label: "Book",
          icon: "calendar-plus",
          desc: "Festive slot",
        },
        {
          id: "q2",
          label: "Prescriptions",
          icon: "file-text",
          desc: "3 active",
        },
        { id: "q3", label: "Reminders", icon: "bell", desc: "2 due today" },
        { id: "q4", label: "Family", icon: "users", desc: "5 members" },
      ],
    },
  ],
};
export const PRESCRIPTIONS: Prescription[] = [
  {
    id: "rx1",
    issuedAt: new Date().toLocaleDateString("en-CA"),
    doctorName: "Dr. Ananya Reddy",
    specialty: "General Physician",
    clinicName: "Tapza Clinic · Madhapur, Hyderabad",
    diagnosis: "Viral fever · BP normal",
    medicines: [
      {
        id: "m1",
        name: "Paracetamol 650",
        dose: "1 tab",
        days: 5,
        timing: ["morning", "night"],
        withFood: true,
      },
      {
        id: "m2",
        name: "Azithral 500",
        dose: "1 tab",
        days: 3,
        timing: ["morning"],
        withFood: false,
      },
      {
        id: "m3",
        name: "Limcee (Vit C)",
        dose: "1 tab",
        days: 15,
        timing: ["afternoon"],
        withFood: true,
      },
      {
        id: "m4",
        name: "Montair LC",
        dose: "1 tab",
        days: 7,
        timing: ["night"],
        withFood: false,
      },
    ],
  },
  {
    id: "rx2",
    issuedAt: new Date().toLocaleDateString("en-CA"),
    doctorName: "Dr. Ravi Shankar",
    specialty: "Pediatrician · for Aarav (7y)",
    clinicName: "Tapza Clinic · Kukatpally",
    diagnosis: "Seasonal cold & cough",
    medicines: [
      {
        id: "m5",
        name: "Maxtra Syrup",
        dose: "5 ml",
        days: 5,
        timing: ["morning", "night"],
      },
      {
        id: "m6",
        name: "Zincovit",
        dose: "5 ml",
        days: 15,
        timing: ["afternoon"],
      },
    ],
  },
  {
    id: "rx3",
    issuedAt: new Date().toLocaleDateString("en-CA"),
    doctorName: "Dr. Fatima Khan",
    specialty: "Dermatologist",
    clinicName: "Tapza Clinic · Vijayawada",
    diagnosis: "Monsoon skin allergy",
    medicines: [
      {
        id: "m7",
        name: "Cetrizine 10",
        dose: "1 tab",
        days: 10,
        timing: ["night"],
      },
      {
        id: "m8",
        name: "Moisturex Cream",
        dose: "Apply thin",
        days: 20,
        timing: ["morning", "night"],
      },
    ],
  },
];
// Shared English, Hindi and Telugu interface labels.
export const STR: Record<string, Record<"en" | "hi" | "te", string>> = {
  home: { en: "Home", hi: "होम", te: "హోమ్" },
  bookings: { en: "Bookings", hi: "बुकिंग", te: "బుకింగ్‌లు" },
  rx: { en: "Rx", hi: "पर्चा", te: "మందుల చీటీ" },
  profile: { en: "Profile", hi: "प्रोफ़ाइल", te: "ప్రొఫైల్" },
  bookVisit: { en: "Book visit", hi: "अपॉइंटमेंट लें", te: "అపాయింట్‌మెంట్" },
  confirm: {
    en: "Confirm booking",
    hi: "बुकिंग पक्की करें",
    te: "బుకింగ్ నిర్ధారించు",
  },
  morning: { en: "Morning", hi: "सुबह", te: "ఉదయం" },
  afternoon: { en: "Afternoon", hi: "दोपहर", te: "మధ్యాహ్నం" },
  night: { en: "Night", hi: "रात", te: "రాత్రి" },
  taken: { en: "Taken", hi: "ले लिया", te: "తీసుకున్నారు" },
  takeDose: { en: "Mark taken", hi: "ले लिया", te: "తీసుకున్నాను" },
};
export function slotSeed(
  doctorId: string,
  dateISO: string,
): {
  label: string;
  period: "morning" | "afternoon" | "evening";
  available: boolean;
}[] {
  const base =
    [...doctorId].reduce((a, c) => a + c.charCodeAt(0), 0) +
    [...dateISO].reduce((a, c) => a + c.charCodeAt(0), 0);
  const times: {
    label: string;
    period: "morning" | "afternoon" | "evening";
  }[] = [
    { label: "09:00 AM", period: "morning" },
    { label: "09:45 AM", period: "morning" },
    { label: "10:30 AM", period: "morning" },
    { label: "12:00 PM", period: "afternoon" },
    { label: "01:15 PM", period: "afternoon" },
    { label: "04:30 PM", period: "evening" },
    { label: "06:30 PM", period: "evening" },
    { label: "07:15 PM", period: "evening" },
    { label: "08:30 PM", period: "evening" },
  ];
  return times.map((t, i) => ({
    ...t,
    available: (base + i * 7) % 4 !== 0, // ~25% taken
  }));
}
