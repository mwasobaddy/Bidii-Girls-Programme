"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type Language = "en" | "fr" | "sw"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = {
  en: {
    // Hero Section
    heroTitle: "Restoring Dignity,",
    heroSubtitle: "Empowering Education",
    heroDescription: "We provide menstrual products and education support to empower girls, helping them stay in school with dignity and confidence.",
    learnMore: "Recent Projects",
    girlsSupported: "Girls Supported",
    schoolsReached: "Schools Reached",
    yearsImpact: "Years Of Impact",

    // Featured Campaigns
    featuredCampaigns: "Featured Campaigns",
    campaignsDescription: "Support our urgent campaigns to make an immediate impact in girls' lives",
    raised: "Raised",
    target: "Target",
    supporters: "supporters",

    // Partners
    partnersSponsors: "Our Partners & Sponsors",

    // Impact Section
    ourImpact: "Our Impact",
    impactDescription:
      "Since our founding, we've made significant strides in combating period poverty and empowering girls through education. Our comprehensive approach addresses immediate needs while building long-term solutions.",
    productsDistributed: "Products Distributed",
    attendanceRate: "School Attendance Rate",
    learnMoreAboutUs: "Learn More About Us",

    // How We Help
    howWeHelp: "How We Help",
    howWeHelpDescription:
      "Our comprehensive approach addresses the root causes of period poverty through education, support, and empowerment.",
    education: "Education",
    educationDescription: "Comprehensive menstrual health education to break stigma and build confidence.",
    support: "Support",
    supportDescription: "Providing menstrual hygiene products and emotional support to girls in need.",
    empowerment: "Empowerment",
    empowermentDescription: "Leadership training and life skills to help girls reach their full potential.",

    // Call to Action
    joinOurMission: "Join Our Mission",
    joinDescription:
      "Whether you want to partner with us or volunteer your time, there are many ways to make a difference in the lives of young girls.",
    becomePartner: "Become a Partner",
    volunteerWithUs: "Volunteer With Us",
    partnershipInquiry: "Partnership Inquiry",
    volunteerApplication: "Volunteer Application",
    fullName: "Full Name",
    emailAddress: "Email Address",
    whatsappNumber: "WhatsApp Number",
    submitPartnership: "Submit Partnership Inquiry",
    submitVolunteer: "Submit Volunteer Application",

    // Projects
    ourProjects: "Our Projects",
    projectsDescription: "Discover our ongoing initiatives that are transforming lives and communities.",
    viewAllProjects: "View All Projects",
    readMore: "Read More",

    // Blog
    latestStories: "Latest Stories",
    storiesDescription: "Read about our impact and the lives we're changing",
    viewAllPosts: "View All Posts",

    // Footer
    footerAbout:
      "Empowering girls through education and eradicating period poverty in Kenyan slums. Together, we can break barriers and create lasting change.",
    subscribeNewsletter: "Subscribe to Our Newsletter",
    enterEmail: "Enter your email",
    subscribe: "Subscribe",
    quickLinks: "Quick Links",
    aboutUs: "About Us",
    blog: "Blog",
    gallery: "Gallery",
    contact: "Contact",
    admin: "Admin",
    allRightsReserved: "All rights reserved.",

    // Toast Messages
    thankYou: "Thank You!",
    partnerResponse: "We'll get back to you soon about partnership opportunities.",
    subscribed: "Subscribed!",
    newsletterSuccess: "Thank you for subscribing to our newsletter.",
  },
  fr: {
    // Hero Section
    heroTitle: "Autonomiser les Filles,",
    heroSubtitle: "Briser les Barrières",
    heroDescription:
      "Rejoignez-nous pour éradiquer la précarité menstruelle et autonomiser l'éducation des filles dans les bidonvilles kényans",
    learnMore: "En Savoir Plus",
    girlsSupported: "Filles Soutenues",
    schoolsReached: "Écoles Atteintes",
    yearsImpact: "Années d'Impact",

    // Featured Campaigns
    featuredCampaigns: "Campagnes en Vedette",
    campaignsDescription: "Soutenez nos campagnes urgentes pour avoir un impact immédiat sur la vie des filles",
    raised: "Collecté",
    target: "Objectif",
    supporters: "supporters",

    // Partners
    partnersSponsors: "Nos Partenaires et Sponsors",

    // Impact Section
    ourImpact: "Notre Impact",
    impactDescription:
      "Depuis notre fondation, nous avons fait des progrès significatifs dans la lutte contre la précarité menstruelle et l'autonomisation des filles par l'éducation.",
    productsDistributed: "Produits Distribués",
    attendanceRate: "Taux de Fréquentation Scolaire",
    learnMoreAboutUs: "En Savoir Plus Sur Nous",

    // How We Help
    howWeHelp: "Comment Nous Aidons",
    howWeHelpDescription:
      "Notre approche globale s'attaque aux causes profondes de la précarité menstruelle par l'éducation, le soutien et l'autonomisation.",
    education: "Éducation",
    educationDescription:
      "Éducation complète sur la santé menstruelle pour briser les stigmates et renforcer la confiance.",
    support: "Soutien",
    supportDescription:
      "Fournir des produits d'hygiène menstruelle et un soutien émotionnel aux filles dans le besoin.",
    empowerment: "Autonomisation",
    empowermentDescription:
      "Formation au leadership et compétences de vie pour aider les filles à atteindre leur plein potentiel.",

    // Call to Action
    joinOurMission: "Rejoignez Notre Mission",
    joinDescription:
      "Que vous souhaitiez vous associer à nous ou faire du bénévolat, il existe de nombreuses façons de faire une différence.",
    becomePartner: "Devenir Partenaire",
    volunteerWithUs: "Faire du Bénévolat",
    partnershipInquiry: "Demande de Partenariat",
    volunteerApplication: "Candidature Bénévole",
    fullName: "Nom Complet",
    emailAddress: "Adresse Email",
    whatsappNumber: "Numéro WhatsApp",
    submitPartnership: "Soumettre la Demande de Partenariat",
    submitVolunteer: "Soumettre la Candidature Bénévole",

    // Projects
    ourProjects: "Nos Projets",
    projectsDescription: "Découvrez nos initiatives en cours qui transforment des vies et des communautés.",
    viewAllProjects: "Voir Tous les Projets",
    readMore: "Lire Plus",

    // Blog
    latestStories: "Dernières Histoires",
    storiesDescription: "Lisez sur notre impact et les vies que nous changeons",
    viewAllPosts: "Voir Tous les Articles",

    // Footer
    footerAbout:
      "Autonomiser les filles par l'éducation et éradiquer la précarité menstruelle dans les bidonvilles kényans.",
    subscribeNewsletter: "S'abonner à Notre Newsletter",
    enterEmail: "Entrez votre email",
    subscribe: "S'abonner",
    quickLinks: "Liens Rapides",
    aboutUs: "À Propos",
    blog: "Blog",
    gallery: "Galerie",
    contact: "Contact",
    admin: "Admin",
    allRightsReserved: "Tous droits réservés.",

    // Toast Messages
    thankYou: "Merci!",
    partnerResponse: "Nous vous recontacterons bientôt concernant les opportunités de partenariat.",
    subscribed: "Abonné!",
    newsletterSuccess: "Merci de vous être abonné à notre newsletter.",
  },
  sw: {
    // Hero Section
    heroTitle: "Kuwawezesha Wasichana,",
    heroSubtitle: "Kuvunja Vizuizi",
    heroDescription:
      "Jiunge nasi katika kuondoa umaskini wa hedhi na kuwezesha elimu kwa wasichana katika vijiji vya Kenya",
    learnMore: "Jifunze Zaidi",
    girlsSupported: "Wasichana Waliosaidiwa",
    schoolsReached: "Shule Zilizofikwa",
    yearsImpact: "Miaka ya Athari",

    // Featured Campaigns
    featuredCampaigns: "Kampeni Maalum",
    campaignsDescription: "Unga mkono kampeni zetu za haraka ili kuwa na athari ya haraka katika maisha ya wasichana",
    raised: "Imekusanywa",
    target: "Lengo",
    supporters: "wafuasi",

    // Partners
    partnersSponsors: "Washirika na Wafadhili Wetu",

    // Impact Section
    ourImpact: "Athari Yetu",
    impactDescription:
      "Tangu tuanzishwe, tumefanya maendeleo makubwa katika kupambana na umaskini wa hedhi na kuwawezesha wasichana kupitia elimu.",
    productsDistributed: "Bidhaa Zilizosambazwa",
    attendanceRate: "Kiwango cha Mahudhurio Shuleni",
    learnMoreAboutUs: "Jifunze Zaidi Kutuhusu",

    // How We Help
    howWeHelp: "Jinsi Tunavyosaidia",
    howWeHelpDescription:
      "Mbinu yetu ya kina inashughulikia mizizi ya umaskini wa hedhi kupitia elimu, msaada, na uwezeshaji.",
    education: "Elimu",
    educationDescription: "Elimu kamili ya afya ya hedhi ili kuvunja aibu na kujenga ujasiri.",
    support: "Msaada",
    supportDescription: "Kutoa bidhaa za usafi wa hedhi na msaada wa kihisia kwa wasichana wanaohitaji.",
    empowerment: "Uwezeshaji",
    empowermentDescription: "Mafunzo ya uongozi na ujuzi wa maisha ili kuwasaidia wasichana kufikia uwezo wao kamili.",

    // Call to Action
    joinOurMission: "Jiunge na Dhamira Yetu",
    joinDescription:
      "Iwe unataka kushirikiana nasi au kujitolea wakati wako, kuna njia nyingi za kuleta mabadiliko katika maisha ya wasichana.",
    becomePartner: "Kuwa Mshirika",
    volunteerWithUs: "Jitolee Nasi",
    partnershipInquiry: "Hojaji ya Ushirikiano",
    volunteerApplication: "Maombi ya Kujitolea",
    fullName: "Jina Kamili",
    emailAddress: "Anwani ya Barua Pepe",
    whatsappNumber: "Nambari ya WhatsApp",
    submitPartnership: "Wasilisha Hojaji ya Ushirikiano",
    submitVolunteer: "Wasilisha Maombi ya Kujitolea",

    // Projects
    ourProjects: "Miradi Yetu",
    projectsDescription: "Gundua miradi yetu inayoendelea ambayo inabadilisha maisha na jamii.",
    viewAllProjects: "Ona Miradi Yote",
    readMore: "Soma Zaidi",

    // Blog
    latestStories: "Hadithi za Hivi Karibuni",
    storiesDescription: "Soma kuhusu athari yetu na maisha tunayobadilisha",
    viewAllPosts: "Ona Machapisho Yote",

    // Footer
    footerAbout: "Kuwawezesha wasichana kupitia elimu na kuondoa umaskini wa hedhi katika vijiji vya Kenya.",
    subscribeNewsletter: "Jiandikishe kwa Jarida Letu",
    enterEmail: "Ingiza barua pepe yako",
    subscribe: "Jiandikishe",
    quickLinks: "Viungo vya Haraka",
    aboutUs: "Kutuhusu",
    blog: "Blogu",
    gallery: "Picha",
    contact: "Mawasiliano",
    admin: "Msimamizi",
    allRightsReserved: "Haki zote zimehifadhiwa.",

    // Toast Messages
    thankYou: "Asante!",
    partnerResponse: "Tutawasiliana nawe hivi karibuni kuhusu fursa za ushirikiano.",
    subscribed: "Umejiandikisha!",
    newsletterSuccess: "Asante kwa kujiandikisha kwa jarida letu.",
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)[typeof language]] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
