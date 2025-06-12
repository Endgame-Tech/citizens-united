export interface LeaderContact {
  email?: string;
  whatsapp?: string;
}

export interface ManifestoItem {
  title: string;
  status: "Fulfilled" | "In Progress" | "Broken";
}

export interface CorruptionCase {
  summary: string;
  status: string;
  publicResponse?: string;
  sources: string[];
}

export interface PolicyAction {
  title: string;
  description?: string;
  impactScore?: number;
  date?: string;
}

export interface Performance {
  attendance?: string;
  billsSponsored?: number;
  townHalls?: number;
  constituencyProjects?: number;
}

export interface LiveFeedItem {
  type: "news" | "video" | "alert";
  content: string;
  link?: string;
}

export interface AlertPreferences {
  corruptionUpdates: boolean;
  missedVotes: boolean;
  newManifestos: boolean;
  controversialAppearances: boolean;
}

export interface Leader {
  id: string;
  slug: string;
  fullName: string;
  officeHeld: string;
  politicalParty: string;
  level: "Federal" | "State" | "Local";
  state: string;
  lga: string;
  ward: string;
  imageUrl?: string;
  contact: LeaderContact;
  positioning?: string;
  activeYears?: string;
  nationality?: string;
  dateOfBirth?: string;
  religion?: string;
  stateOfOrigin?: string;
  town?: string;
  disputedFields?: string[];
  previousOffices?: string[];
  ideology?: string;
  manifesto?: ManifestoItem[];
  corruptionCases?: CorruptionCase[];
  policyDecisions?: PolicyAction[];
  performanceTracking?: Performance;
  liveFeed?: LiveFeedItem[];
  alertPreferences?: AlertPreferences;
  accountabilityScore?: number;
  compareAvailable?: boolean;
}

export const leadersMockData: Leader[] = [
  {
    id: "1",
    fullName: "Bola Ahmed Tinubu",
    slug: "bola-ahmed-tinubu",
    officeHeld: "President of Nigeria",
    politicalParty: "All Progressives Congress (APC)",
    level: "Federal",
    state: "Lagos",
    lga: "Eti-Osa",
    ward: "Ward A",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Bola_Tinubu_portrait.jpg/500px-Bola_Tinubu_portrait.jpg",
    contact: {
      email: "president@nigeria.gov.ng",
      whatsapp: "+2348000000001",
    },
    positioning: "Political Godfather",
    activeYears: "1992 – Present",
    nationality: "Nigerian",
    dateOfBirth: "1942-03-29",
    religion: "Islam",
    stateOfOrigin: "Lagos",
    town: "Unknown",
    disputedFields: ["Date of Birth", "State of Origin"],
    previousOffices: [
      "Senator, Lagos West (1992–1993)",
      "Governor, Lagos State (1999–2007)"
    ],
    ideology: "Market-driven governance, supports federalism, emphasizes youth inclusion and decentralisation.",
    manifesto: [
      { title: "Naira Stabilization", status: "In Progress" },
      { title: "Fuel Subsidy Removal", status: "Fulfilled" },
      { title: "Security Sector Reform", status: "Broken" }
    ],
    corruptionCases: [
      {
        summary: "Allegations around bullion vans during elections.",
        status: "Unresolved",
        publicResponse: "Dismissed as political witch-hunt.",
        sources: [
          "https://example.com/tinubu-bullion-investigation",
          "https://watchdog.ng/tinubu-case"
        ]
      }
    ],
    policyDecisions: [
      {
        title: "Subsidy Removal",
        description: "End of petroleum subsidy policy",
        impactScore: 62,
        date: "2023-05-29"
      },
      {
        title: "Cashless Policy Push",
        impactScore: 45,
        date: "2023-02-01"
      }
    ],
    performanceTracking: {
      attendance: "High",
      billsSponsored: 3,
      townHalls: 5,
      constituencyProjects: 12
    },
    liveFeed: [
      {
        type: "news",
        content: "President addresses economic hardship."
      },
      {
        type: "alert",
        content: "Fact-check: Misleading claim on GDP growth."
      }
    ],
    alertPreferences: {
      corruptionUpdates: true,
      missedVotes: true,
      newManifestos: true,
      controversialAppearances: true
    },
    accountabilityScore: 66,
    compareAvailable: true
  },
  {
    id: "2",
    fullName: "Kashim Shettima",
    slug: "kashim-shettima",
    officeHeld: "Vice President of Nigeria",
    politicalParty: "All Progressives Congress (APC)",
    level: "Federal",
    state: "Borno",
    lga: "Maiduguri",
    ward: "Ward B",
    imageUrl: "https://statehouse.gov.ng/wp-content/uploads/2023/05/FxSvH8TWAAYzC0H-835x1024.jpg",
    contact: {
      email: "vp@nigeria.gov.ng",
      whatsapp: "+2348000000002",
    },
    positioning: "Technocrat",
    activeYears: "2000 – Present",
    nationality: "Nigerian",
    dateOfBirth: "1966-09-02",
    religion: "Islam",
    stateOfOrigin: "Borno",
    town: "Maiduguri",
    previousOffices: [
      "Governor, Borno State (2011–2019)",
      "Senator, Borno Central (2019–2023)"
    ],
    ideology: "Pro-education and security-focused governance. Strong support for federal stability and economic development in the northeast.",
    manifesto: [
      { title: "Rebuild Borno Infrastructure", status: "Fulfilled" },
      { title: "Northeast Youth Empowerment", status: "In Progress" }
    ],
    corruptionCases: [],
    policyDecisions: [
      { title: "North-East Stabilization Fund", impactScore: 70, date: "2020-06-01" }
    ],
    performanceTracking: {
      attendance: "High",
      billsSponsored: 5,
      townHalls: 8,
      constituencyProjects: 15
    },
    liveFeed: [
      { type: "news", content: "VP launches IDP reintegration plan." }
    ],
    alertPreferences: {
      corruptionUpdates: false,
      missedVotes: true,
      newManifestos: true,
      controversialAppearances: false
    },
    accountabilityScore: 75,
    compareAvailable: true
  },
  {
    id: "3",
    fullName: "Babajide Sanwo-Olu",
    slug: "babajide-sanwo-olu",
    officeHeld: "Governor of Lagos State",
    politicalParty: "APC",
    level: "State",
    state: "Lagos",
    lga: "Lagos Island",
    ward: "Ward C",
    imageUrl: "https://pgf.ng/admin/assets/img/governors/governor-Lagos-babajide-olusola-sanwo-olu.jpeg",
    contact: {
      email: "governor@lagos.gov.ng",
      whatsapp: "+2348000000003",
    },
    positioning: "Technocrat",
    activeYears: "2003 – Present",
    nationality: "Nigerian",
    dateOfBirth: "1965-06-25",
    religion: "Christianity",
    stateOfOrigin: "Lagos",
    town: "Lagos Island",
    previousOffices: [
      "MD, Lagos State Property Development Corporation",
      "Commissioner, Lagos State"
    ],
    ideology: "Smart city development, urban mobility, public-private partnerships in governance.",
    manifesto: [
      { title: "Traffic Decongestion", status: "In Progress" },
      { title: "Education Reform", status: "Fulfilled" }
    ],
    corruptionCases: [],
    policyDecisions: [
      { title: "Lagos Blue Rail Launch", date: "2023-04-20", impactScore: 80 }
    ],
    performanceTracking: {
      attendance: "Moderate",
      billsSponsored: 2,
      townHalls: 10,
      constituencyProjects: 30
    },
    liveFeed: [
      { type: "video", content: "Governor commissions new primary schools." }
    ],
    alertPreferences: {
      corruptionUpdates: false,
      missedVotes: false,
      newManifestos: true,
      controversialAppearances: true
    },
    accountabilityScore: 82,
    compareAvailable: true
  },
  {
    id: "4",
    fullName: "Femi Gbajabiamila",
    slug: "femi-gbajabiamila",
    officeHeld: "Chief of Staff to the President",
    politicalParty: "APC",
    level: "Federal",
    state: "Lagos",
    lga: "Surulere",
    ward: "Ward D",
    imageUrl: "https://d1jcea4y7xhp7l.cloudfront.net/wp-content/uploads/2023/06/Gbajabiamila.png",
    contact: {
      email: "femi@nigeria.gov.ng",
      whatsapp: "+2348000000004",
    },
    positioning: "Legislative Power Broker",
    activeYears: "2003 – Present",
    nationality: "Nigerian",
    dateOfBirth: "1962-06-25",
    religion: "Islam",
    stateOfOrigin: "Lagos",
    town: "Surulere",
    previousOffices: [
      "Speaker, House of Representatives (2019–2023)",
      "Majority Leader, House of Representatives"
    ],
    ideology: "Parliamentary reform, civic engagement, and rule of law.",
    manifesto: [
      { title: "Constituency Empowerment Fund", status: "Fulfilled" }
    ],
    corruptionCases: [],
    policyDecisions: [
      { title: "House Oversight Bill", impactScore: 68 }
    ],
    performanceTracking: {
      attendance: "High",
      billsSponsored: 9,
      townHalls: 4,
      constituencyProjects: 20
    },
    liveFeed: [
      { type: "news", content: "Gbajabiamila pushes for legislative compliance audits." }
    ],
    alertPreferences: {
      corruptionUpdates: true,
      missedVotes: false,
      newManifestos: false,
      controversialAppearances: false
    },
    accountabilityScore: 88,
    compareAvailable: true
  },
  {
    id: "5",
    fullName: "Kehinde Martins",
    slug: "kehinde-martins",
    officeHeld: "LGA Chairman",
    politicalParty: "PDP",
    level: "Local",
    state: "Lagos",
    lga: "Agege",
    ward: "Ward E",
    contact: {
      email: "chairman@agege.ng",
      whatsapp: "+2348000000005",
    },
    positioning: "Community Advocate",
    activeYears: "2015 – Present",
    nationality: "Nigerian",
    dateOfBirth: "1975-02-11",
    religion: "Christianity",
    stateOfOrigin: "Lagos",
    town: "Agege",
    previousOffices: [
      "Councilor, Ward E (2011–2015)"
    ],
    ideology: "Grassroots empowerment and social justice."
  },
  {
    id: "6",
    fullName: "Fatima Bello",
    slug: "fatima-bello",
    officeHeld: "Councillor, Ward A",
    politicalParty: "Labour Party",
    level: "Local",
    state: "Kano",
    lga: "Tarauni",
    ward: "Ward A",
    contact: {
      email: "fatima@tarauni.ng",
      whatsapp: "+2348000000006",
    },
    positioning: "Grassroots Mobilizer",
    activeYears: "2018 – Present",
    nationality: "Nigerian",
    dateOfBirth: "1990-11-05",
    religion: "Islam",
    stateOfOrigin: "Kano",
    town: "Tarauni",
    previousOffices: [],
    ideology: "Youth participation and community development, pro-poor budget reforms."
  }
];
