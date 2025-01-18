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
  Settings: '/settings/integrations'
}

export const MenuItem = {
  Analysis: 'Analysis',
  Monitoring: 'Monitoring',
  Settings: 'Settings',
  Triggers: 'Triggers',
  TriggersAdd: 'TriggersAdd'
}

export const SortType = {
  TOTAL_SHOW_ASC: 'TOTAL_SHOW_ASC',
  TOTAL_SHOW_DESC: 'TOTAL_SHOW_DESC',
  NAME_ASC: 'NAME_ASC',
  NAME_DESC: 'NAME_DESC',
}

export const LocalStorageKey = {
  TYPE_SHOW_VALUE: 'type-show-value',
  PERIOD: 'PERIOD'
}

export const TypeShowValue = {
  PRICE: 'PRICE',
  COUNT: 'COUNT'
}

export const Period = {
  POINTS: null,
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month'
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
