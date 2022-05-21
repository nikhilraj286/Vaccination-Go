import React from "react";
import "./App.css";
import { BrowserRouter } from "react-router-dom";
import Main from "./components/Main";
import { withTranslation, Trans, useTranslation } from "react-i18next";

function App() {
  const { t, i18n } = useTranslation();
  const changeLanguage = (lng) => {
    // alert("ch");
    i18n.changeLanguage(lng);
  };

  return (
    <BrowserRouter>
      <Main changeLanguage={changeLanguage} />
    </BrowserRouter>
  );
}

export default App;
