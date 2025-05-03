// hooks/useLanguageChange.js

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

const useLanguageChange = () => {
  const language = useSelector((state) => state.language.language);
  const { i18n } = useTranslation();

  useEffect(() => {
    i18n.changeLanguage(language);  
  }, [language, i18n]);
};

export default useLanguageChange;
