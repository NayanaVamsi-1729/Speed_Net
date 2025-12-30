import { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'es' | 'fr' | 'de' | 'hi' | 'zh';

interface LanguageOption {
  code: Language;
  label: string;
  flag: string;
}

export const languages: LanguageOption[] = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'hi', label: 'हिंदी', flag: '🇮🇳' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
];

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    title: 'Internet Speed Test',
    subtitle: 'Browser-based network performance analysis',
    startTest: 'Start Test',
    stop: 'Stop',
    restartTest: 'Restart Test',
    copyResults: 'Copy Results',
    copied: 'Copied',
    advertisement: 'Advertisement',
    download: 'Download',
    upload: 'Upload',
    ping: 'Ping',
    jitter: 'Jitter',
    speedOverTime: 'Speed Over Time',
    testingDownload: 'Testing Download',
    testingUpload: 'Testing Upload',
    testComplete: 'Test Complete',
    readyToTest: 'Ready to Test',
    testDuration: 'Test Duration',
    footer: 'Browser-based estimation. Results may vary from ISP measurements.',
  },
  es: {
    title: 'Test de Velocidad',
    subtitle: 'Análisis de rendimiento de red basado en navegador',
    startTest: 'Iniciar Prueba',
    stop: 'Detener',
    restartTest: 'Reiniciar',
    copyResults: 'Copiar',
    copied: 'Copiado',
    advertisement: 'Publicidad',
    download: 'Descarga',
    upload: 'Subida',
    ping: 'Ping',
    jitter: 'Jitter',
    speedOverTime: 'Velocidad en el Tiempo',
    testingDownload: 'Probando Descarga',
    testingUpload: 'Probando Subida',
    testComplete: 'Prueba Completa',
    readyToTest: 'Listo para Probar',
    testDuration: 'Duración',
    footer: 'Estimación basada en navegador. Los resultados pueden variar.',
  },
  fr: {
    title: 'Test de Vitesse',
    subtitle: 'Analyse des performances réseau basée sur le navigateur',
    startTest: 'Démarrer',
    stop: 'Arrêter',
    restartTest: 'Redémarrer',
    copyResults: 'Copier',
    copied: 'Copié',
    advertisement: 'Publicité',
    download: 'Téléchargement',
    upload: 'Envoi',
    ping: 'Ping',
    jitter: 'Gigue',
    speedOverTime: 'Vitesse au Fil du Temps',
    testingDownload: 'Test Téléchargement',
    testingUpload: 'Test Envoi',
    testComplete: 'Test Terminé',
    readyToTest: 'Prêt à Tester',
    testDuration: 'Durée du Test',
    footer: 'Estimation basée sur le navigateur. Les résultats peuvent varier.',
  },
  de: {
    title: 'Geschwindigkeitstest',
    subtitle: 'Browserbasierte Netzwerkleistungsanalyse',
    startTest: 'Test Starten',
    stop: 'Stoppen',
    restartTest: 'Neustart',
    copyResults: 'Kopieren',
    copied: 'Kopiert',
    advertisement: 'Werbung',
    download: 'Download',
    upload: 'Upload',
    ping: 'Ping',
    jitter: 'Jitter',
    speedOverTime: 'Geschwindigkeit über Zeit',
    testingDownload: 'Download Test',
    testingUpload: 'Upload Test',
    testComplete: 'Test Abgeschlossen',
    readyToTest: 'Bereit zum Testen',
    testDuration: 'Testdauer',
    footer: 'Browserbasierte Schätzung. Ergebnisse können variieren.',
  },
  hi: {
    title: 'इंटरनेट स्पीड टेस्ट',
    subtitle: 'ब्राउज़र-आधारित नेटवर्क प्रदर्शन विश्लेषण',
    startTest: 'टेस्ट शुरू करें',
    stop: 'रोकें',
    restartTest: 'पुनः प्रारंभ',
    copyResults: 'कॉपी करें',
    copied: 'कॉपी हो गया',
    advertisement: 'विज्ञापन',
    download: 'डाउनलोड',
    upload: 'अपलोड',
    ping: 'पिंग',
    jitter: 'जिटर',
    speedOverTime: 'समय के साथ गति',
    testingDownload: 'डाउनलोड टेस्ट',
    testingUpload: 'अपलोड टेस्ट',
    testComplete: 'टेस्ट पूरा',
    readyToTest: 'टेस्ट के लिए तैयार',
    testDuration: 'टेस्ट अवधि',
    footer: 'ब्राउज़र-आधारित अनुमान। परिणाम भिन्न हो सकते हैं।',
  },
  zh: {
    title: '网速测试',
    subtitle: '基于浏览器的网络性能分析',
    startTest: '开始测试',
    stop: '停止',
    restartTest: '重新测试',
    copyResults: '复制结果',
    copied: '已复制',
    advertisement: '广告',
    download: '下载',
    upload: '上传',
    ping: '延迟',
    jitter: '抖动',
    speedOverTime: '速度趋势',
    testingDownload: '测试下载',
    testingUpload: '测试上传',
    testComplete: '测试完成',
    readyToTest: '准备测试',
    testDuration: '测试时长',
    footer: '基于浏览器的估算。结果可能与ISP测量值不同。',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const stored = localStorage.getItem('language');
    return (stored as Language) || 'en';
  });

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
