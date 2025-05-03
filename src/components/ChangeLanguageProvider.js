// src/components/ChangeLanguageProvider.js
import React from "react";
import useLanguageChange from "../hooks/useChangeLanguage";

const ChangeLanguageProvider = () => {

    useLanguageChange();
  return null;
};

export default ChangeLanguageProvider;
