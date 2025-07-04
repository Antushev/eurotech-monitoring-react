export const ID_EXTENSION = 'aekgijemokmbcgjjfmphgkmlcbicnifj';

export const NameSpace = {
  DATA: 'DATA',
  PRODUCTS: 'PRODUCTS'
}

export const AppRoute = {
  Root: '/',
  Analysis: '/analysis',
  Monitoring: '/monitoring',
  ProductMonitor: '/monitoring/:idProduct',
  Triggers: '/triggers',
  TriggerAdd: '/trigger/add',
  TriggerEdit: '/trigger/:idTrigger/edit',
  Firms: '/firms',
  FirmAdd: '/firm/add',
  FirmEdit: '/firm/:idFirm/edit',
  Settings: '/settings/integrations'
}

export const MenuItem = {
  Analysis: 'Analysis',
  Monitoring: 'Monitoring',
  Settings: 'Settings',
  Triggers: 'Triggers',
  TriggersAdd: 'TriggersAdd',
  Firms: 'Firms',
  FirmAdd: 'FirmAdd'
}

export const SortType = {
  TOTAL_SHOW_ASC: 'TOTAL_SHOW_ASC',
  TOTAL_SHOW_DESC: 'TOTAL_SHOW_DESC',
  NAME_ASC: 'NAME_ASC',
  NAME_DESC: 'NAME_DESC',
  DESC: 'DESC',
  ASC: 'ASC'
}

export const LocalStorageKey = {
  TYPE_SHOW_VALUE: 'type-show-value',
  TYPE_SHOW_CONDITION_VALUE: 'type-show-condition-value',
  PERIOD: 'period',
  FAVORITE_CHANGE_PRODUCTS_TABLE: 'favorite-change-products-table',
  FAVORITE_CHANGE_STAT_DETALISATION: 'favorite-change-stata-detalisation',
  SETTINGS_DETALISATION_IN_MONITORING_PAGE: 'settings-detalisation-in-monitoring-page'
}

export const TypeShowValue = {
  PRICE: 'PRICE',
  COUNT: 'COUNT'
}

export const TypeShowConditionValue = {
  VALUE: 'VALUE',
  PERCENT: 'PERCENT'
}

export const TypeLastActionBlock = {
  NOTIFICATION: 'notification'
}

export const Period = {
  POINTS: null,
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month'
}

export const MethodSelectData = {
  DEFAULT: 'default',
  EXTENSION: 'extension'
}

export const toastSettings = {
  position: 'top-right',
  autoClose: '4000',
  hideProgressBar: false,
  newestOnTop: false,
  closeOnClick: true,
  rtl: false,
  pauseOnFocusLoss: true,
  draggable: true,
  pauseOnHover: true,
  theme: 'light',
  transition: 'flip'
}

export const TypeValueStatDetalisation = {
  PRICE: 'PRICE',
  COUNT: 'COUNT'
}

export const TypeValueCalculateStatDetalisation = {
  PERCENT: 'PERCENT',
  VALUE: 'VALUE'
}
