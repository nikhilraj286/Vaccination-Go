import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
// not like to use this?
// have a look at the Quick start guide 
// for passing in lng and translations on init

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // we init with resources
    resources: {
      en: {
        translations: {
          "Switch Languages":"Switch Languages",
          "Clinic Name":"Clinic Name",
          "Number of Physicians":"Number of Physicians",
          "Start Business Hour":"Start Business Hour",
          "End Business Hour":"End Business Hour",
          "Integers interpreted as hour of the day":"Integers interpreted as hour of the day",
          "Address":"Address",
          "Create Clinic":"Create Clinic",
          "Create Disease":"Create Disease",
          "Disease Name":"Disease Name",
          "Disease Description":"Disease Description",
          "Add disease":"Add disease",
          "Add Vaccination":"Add Vaccination",
          "Vaccination Name":"Vaccination Name",
          "Manufacturer":"Manufacturer",
          "No of Shot":"No of Shot",
          "Shot Interval Value":"Shot Interval Value",
          "List of Diseases":"List of Diseases",
          "Error fetching diseases":"Error fetching diseases",
          "Create Vaccination":"Create Vaccination",
          "New Appointment":"New Appointment",
          "Future Appointments":"Future Appointments",
          "Appointment Date":"Appointment Date",
          "Appointment Time":"Appointment Time",
          "Clinic":"Clinic",
          "Vaccinations":"Vaccinations",
          "Check In":"Check In",
          "Checked In":"Checked In",
          "Cancelled Appointments":"Cancelled Appointments",
          "Past Appointments":"Past Appointments",
          "Completed":"Completed",
          "No Show":"No Show",
          "Vaccinations Due":"Vaccinations Due",
          "Select Clinic":"Select Clinic",
          "Start Date":"Start Date",
          "End Date":"End Date",
          "Submit":"Submit",
          "Get Reports":"Get Reports",
          "Total Appointments":"Total Appointments",
          "Total No Shows":"Total No Shows",
          "No Show Rate":"No Show Rate",
          "Number of shot due":"Number of shot due",
          "Due Date":"Due Date",
          "Scheduled appointment for vaccine":"Scheduled appointment for vaccine",
          "You have not booked an appointment yet":"You have not booked an appointment yet",
          "Currently vaccinated until due date":"Currently vaccinated until due date"

        }
      },
      fr: {
        translations: {
            "Switch Languages":"Changer de langue",
            "Clinic Name":"Nom de la clinique",
            "Number of Physicians":"Nombre de médecins",
            "Start Business Hour":"Start Business Hour",
            "End Business Hour":"End Business Hour",
            "Integers interpreted as hour of the day":"Integers interpreted as hour of the day",
            "Address":"Address",
            "Create Clinic":"Create Clinic",
            "Create Disease":"Create Disease",
            "Disease Name":"Disease Name",
            "Disease Description":"Disease Description",
            "Add disease":"Add disease",
            "Add Vaccination":"Add Vaccination",
            "Vaccination Name":"Vaccination Name",
            "Manufacturer":"Manufacturer",
            "No of Shot":"No of Shot",
            "Shot Interval Value":"Shot Interval Value",
            "List of Diseases":"List of Diseases",
            "Error fetching diseases":"Error fetching diseases",
            "Create Vaccination":"Create Vaccination",
            "New Appointment":"Nouveau rendez-vous",
            "Future Appointments":"Nominations futures",
            "Appointment Date":"date de rendez-vous",
            "Appointment Time":"heure de rendez-vous",
            "Clinic":"Clinique",
            "Vaccinations":"Vaccinations",
            "Check In":"Enregistrement",
            "Checked In":"Enregistré",
            "Cancelled Appointments":"Rendez-vous annulés",
            "Past Appointments":"Rendez-vous passés",
            "Completed":"Terminé",
            "No Show":"Non-présentation",
            "Vaccinations Due":"Vaccinations Dues",
            "Select Clinic":"Sélectionnez la clinique",
            "Start Date":"Date de début",
            "End Date":"Date de fin",
            "Submit":"Soumettre",
            "Get Reports":"Obtenir des rapports",
            "Total Appointments":"Nombre total de rendez-vous",
            "Total No Shows":"Total des non-présentations",
            "No Show Rate":"Taux de non-présentation",
            "Start date":"Date de début",
            "End date":"Date de fin",
            "Global Time": "Horloge mondiale",
            "Local Time": "Horloge locale",
            "Vaccination History":"Antécédents de vaccination",
            "Patient Report":"Rapport du patient",
            "Appointments":"Rendez-vous",
            "Clinic Address":"Adresse de la clinique",
            "Address":"Adresse",
            "No Active Cancelled Appointments":"Aucun rendez-vous actif annulé",
            "Vaccinations taken":"Vaccins pris",
            "Vaccination Name":"Nom du vaccin",
            "Total Shots Required":"Nombre total de coups requis",
            "Number of shots due":"Nombre de tirs dus",
            "Due Date":"Date d'échéance",
            "Scheduled appointment for vaccine":"Rendez-vous prévu pour le vaccin",
            "You have not booked an appointment yet":"Vous n'avez pas encore pris de rendez-vous",
            "Currently vaccinated until due date":"Actuellement vacciné jusqu'à la date prévue",
            "No Active Future Appointments":"Aucun rendez-vous futur actif",
            "You have not taken any vaccines yet":"Vous n'avez pas encore pris de vaccins",
            "You have no vaccinations due":"Vous n'avez aucun vaccin à faire",
            "Select Vaccination":"Sélectionnez la vaccination",
            "NEW APPOINTMENT":"NOUVEAU RENDEZ-VOUS",
            "PATIENT":"PATIENTE",
            "ADMIN":"ADMINISTRATRICE",
        }
      }
    },
    fallbackLng: "en",
    debug: true,

    // have a common namespace used around the full app
    ns: ["translations"],
    defaultNS: "translations",

    keySeparator: false, // we use content as keys

    interpolation: {
      escapeValue: false
    }
  });


export default i18n;