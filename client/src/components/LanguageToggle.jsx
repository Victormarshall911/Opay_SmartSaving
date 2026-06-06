import { useApp } from '../context/AppContext';
import strings from '../utils/strings';

export default function LanguageToggle() {
  const { language, toggleLanguage } = useApp();
  const s = strings[language];

  return (
    <button
      onClick={toggleLanguage}
      className="lang-toggle"
      aria-label="Toggle language"
    >
      <span className={`lang-option ${language === 'en' ? 'active' : ''}`}>
        EN 🇬🇧
      </span>
      <span className={`lang-option ${language === 'pid' ? 'active' : ''}`}>
        PID 🇳🇬
      </span>
    </button>
  );
}
