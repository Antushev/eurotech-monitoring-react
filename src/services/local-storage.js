import {
  LocalStorageKey,
  TypeValueStatDetalisation,
  TypeValueCalculateStatDetalisation
} from '../const.js';

export const setLocalStorageStatDetalisationInMonitoringPage = (typeValue = null, typeValueCalculate = null, sort = null, firms = null) => {
  const currentSettings = JSON.parse(localStorage.getItem(LocalStorageKey.SETTINGS_DETALISATION_IN_MONITORING_PAGE));

  if (!currentSettings) {
    const newSettings = {
      typeValue: typeValue !== null ? typeValue : TypeValueStatDetalisation.PRICE,
      typeValueCalculate: typeValueCalculate !== null ? typeValueCalculate : TypeValueCalculateStatDetalisation.VALUE,
      sort: sort !== null ? sort : 'ASC',
      firms: firms !== null ? firms : null
    }

    localStorage.setItem(LocalStorageKey.SETTINGS_DETALISATION_IN_MONITORING_PAGE, JSON.stringify(newSettings));

    return newSettings;
  }

  const newSettings = {
    typeValue: typeValue !== null ? typeValue : currentSettings.typeValue,
    typeValueCalculate: typeValueCalculate !== null ? typeValueCalculate : currentSettings.typeValueCalculate,
    sort: sort !== null ? sort : currentSettings.sort,
    firms: firms !== null ? firms : null
  }

  localStorage.setItem(LocalStorageKey.SETTINGS_DETALISATION_IN_MONITORING_PAGE, JSON.stringify(newSettings));

  return newSettings;
}

export const getLocalStorageStatDetalisationInMonitoringPage = () => {
  const currentSettings = localStorage.getItem(LocalStorageKey.SETTINGS_DETALISATION_IN_MONITORING_PAGE);

  if (!currentSettings) {
    const settings = {
      typeValue: TypeValueStatDetalisation.PRICE,
      typeValueCalculate: TypeValueCalculateStatDetalisation.VALUE,
      sort: 'ASC',
      firms: null
    }

    localStorage.setItem(LocalStorageKey.SETTINGS_DETALISATION_IN_MONITORING_PAGE, JSON.stringify(settings));

    return settings;
  }

  return JSON.parse(localStorage.getItem(LocalStorageKey.SETTINGS_DETALISATION_IN_MONITORING_PAGE));
}
