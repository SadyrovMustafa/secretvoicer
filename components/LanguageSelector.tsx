import { useState } from 'react';

export type Language = 'RU' | 'EN' | 'TR' | 'KZ';

interface LanguageSelectorProps {
  currentLanguage: Language;
  onLanguageChange: (language: Language) => void;
}

const languages: { code: Language; name: string; flag: string }[] = [
  { code: 'RU', name: 'Русский', flag: '🇷🇺' },
  { code: 'EN', name: 'English', flag: '🇺🇸' },
  { code: 'TR', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'KZ', name: 'Қазақша', flag: '🇰🇿' },
];

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLanguage,
  onLanguageChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const currentLang = languages.find(lang => lang.code === currentLanguage);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-dark-card rounded-lg border border-gray-600 hover:border-gray-500 transition-colors"
      >
        <span className="text-lg">{currentLang?.flag}</span>
        <span className="text-dark-text">{currentLang?.code}</span>
        <svg
          className={`w-4 h-4 text-dark-text transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-dark-card border border-gray-600 rounded-lg shadow-lg z-50">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => {
                onLanguageChange(language.code);
                setIsOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-700 transition-colors ${
                currentLanguage === language.code ? 'bg-gray-700' : ''
              }`}
            >
              <span className="text-lg">{language.flag}</span>
              <span className="text-dark-text">{language.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}; 