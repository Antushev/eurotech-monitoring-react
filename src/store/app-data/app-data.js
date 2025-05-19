import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import {
  LocalStorageKey,
  NameSpace,
  SortType,
  TypeShowValue,
  TypeShowConditionValue,
  Period
} from '../../const';

import {
  checkSyncUrlXMLForBitrix,
  createLink,
  createMarks,
  createProduct,
  createProject,
  createTrigger,
  deleteAll,
  deleteLink,
  deleteProduct,
  fetchAllMarks,
  fetchAllProjects,
  fetchCurrentProductById,
  fetchFirmsByIdUser,
  createFirm,
  updateFirm,
  fetchParseData,
  fetchProductsGroups,
  fetchProductsWithSummaryDetail,
  fetchProductWithDetailStats,
  fetchReports,
  fetchReportsIntegrations,
  fetchSettingsSyncBitrix,
  fetchStartSyncBitrix,
  fetchTriggers,
  fetchTriggersForProduct,
  setFirmsActiveByIdUser,
  setSettingsSyncBitrix,
  updateLink,
  updateProduct,
  updateTrigger
} from '../api-actions.js';

const initialState = {
  user: {
    id: 1,
    firstName: 'Администратор',
    lastName: '',
    email: 'evgeny.melyukov@eurotechspb.com',
    login: 'dima.a@eurotechspb.com'
  },
  firms: [],
  products: [],
  productsForSelect: [],
  triggers: [],
  triggersForProduct: {triggers: [], reports: []},
  productWithDetailStats: {},
  currentProduct: null,
  groups: [],
  marks: [],
  projects: [],
  parseData: null,
  reports: [],
  reportsIntegrations: [],
  sortType: null,
  period: Period.DAY,
  typeShowValue: TypeShowValue.PRICE,
  typeShowConditionValue: TypeShowConditionValue.VALUE,
  isShowNotifications: false,
  checkDataSyncUrlXMLForBitrix: {},
  settingsSyncBitrix: {},
  hasCreateNewProject: false,
  hasDeleteAllData: false,
  hasLoadFirm: false,
  hasLoadFirms: false,
  hasLoadProducts: false,
  hasLoadProduct: false,
  hasLoadMarks: false,
  hasLoadParseData: false,
  hasLoadLink: false,
  hasLoadTriggers: false,
  hasLoadTriggersForProduct: false,
  hasLoadTrigger: false,
  hasCheckSyncUrlXMLForBitrix: false,
  hasLoadSettingsSyncBitrix: false,
  hasLoadReportsIntegrations: true,
  hasSyncBitrixProducts: false
}

export const appData = createSlice({
  name: NameSpace.DATA,
  initialState,
  reducers: {
    loadFirms: (state, action) => {
      state.firms = [];

      state.firms = action.payload;
    },
    loadProducts: (state, action) => {
      state.products = [];

      state.products = action.payload;
    },
    setCurrentProduct: (state, action) => {
      state.currentProduct = [];

      state.currentProduct = action.payload;
    },
    loadMarks: (state, action) => {
      state.marks = [];

      state.marks = action.payload;
    },
    sortMarks: (state) => {
      if (state.sortType === SortType.TOTAL_SHOW_ASC) {
        state.marks.sort((firstMark, secondMark) => {
          return firstMark.totalShow - secondMark.totalShow;
        });

        state.sortType = SortType.TOTAL_SHOW_DESC;
      } else {
        state.marks.sort((firstMark, secondMark) => {
          return secondMark.totalShow - firstMark.totalShow;
        });

        state.sortType = SortType.TOTAL_SHOW_ASC;
      }
    },
    setParseData: (state, action) => {
      state.parseData = action.payload;
    },
    setPeriod: (state, action) => {
      state.period = action.payload;
    },
    setTypeShowValue: (state, action) => {
      const typeShowValue = action.payload;

      state.typeShowValue = typeShowValue;

      localStorage.setItem(LocalStorageKey.TYPE_SHOW_VALUE, typeShowValue);
    },
    setTypeShowConditionValue: (state, action) => {
      const typeShowConditionValue = action.payload;

      state.typeShowConditionValue = typeShowConditionValue;

      localStorage.setItem(LocalStorageKey.TYPE_SHOW_CONDITION_VALUE, typeShowConditionValue);
    },
    setIsShowNotifications: (state, action) => {
      state.isShowNotifications = action.payload;
    },
    setCheckDataUrlXMLForBitrix: (state, action) => {
      state.checkDataSyncUrlXMLForBitrix = action.payload;
    },
    clearParseData: (state) => {
      state.parseData = null;
    }
  },
  extraReducers(builder) {
    builder
      // ПОЛУЧЕНИЕ СПИСКА ФИРМ
      .addCase(fetchFirmsByIdUser.pending, (state) => {
        state.hasLoadFirms = true;
      })
      .addCase(fetchFirmsByIdUser.fulfilled, (state, action) => {
        state.firms = action.payload;
        state.hasLoadFirms = false;
      })
      .addCase(fetchFirmsByIdUser.rejected, (state) => {
        state.hasLoadFirms = false;
      })
      // СОЗДАНИЕ НОВОЙ ФИРМЫ
      .addCase(createFirm.pending, (state) => {
        state.hasLoadFirm = true;
      })
      .addCase(createFirm.fulfilled, (state, action) => {
        const firm = action.payload;

        state.firms.push(firm);

        state.hasLoadFirm = false;
        toast.success(`Фирма ${firm.name} успешно добавлена`);
      })
      .addCase(createFirm.rejected, (state) => {
        state.hasLoadFirm = false;
        toast.error('Произошла ошибка при добавлении фирмы');
      })
      // РЕДАКТИРОВАНИЕ ФИРМЫ
      .addCase(updateFirm.pending, (state) => {
        state.hasLoadFirm = true;
      })
      .addCase(updateFirm.fulfilled, (state, action) => {
        const uploadFirm = action.payload;
        const { isMain } = uploadFirm;

        if (isMain) {
          state.firms = state.firms.map((firm) => {
            return {
              ...firm,
              isMain: false
            }
          });
        }

        const indexFirm = state.firms.findIndex((searchFirm) => Number(searchFirm.id) === Number(uploadFirm.id));

        if (indexFirm !== -1) {
          state.firms[indexFirm] = uploadFirm;
        }

        toast.success(`Фирма ${uploadFirm.name} успешно отредактирована`);

        state.hasLoadFirm = false;
      })
      .addCase(updateFirm.rejected, () => {
        toast.error('Произошла ошибка при редактировании фирмы');
        state.hasLoadFirm = false;
      })
      // ВЫБОР АКТИВНЫХ ФИРМ ДЛЯ ОПРЕДЕЛЁННОГО ПОЛЬЗОВАТЕЛЯ
      .addCase(setFirmsActiveByIdUser.pending, (state) => {
        state.hasLoadFirms = true;
      })
      .addCase(setFirmsActiveByIdUser.fulfilled, (state, action) => {
        state.hasLoadFirms = false;
      })
      .addCase(setFirmsActiveByIdUser.rejected, (state) => {
        state.hasLoadFirms = false;
      })
      // ПОЛУЧЕНИЕ ПРОДУКТА ПО ID
      .addCase(fetchCurrentProductById.pending, (state) => {

      })
      .addCase(fetchCurrentProductById.fulfilled, (state, action) => {
        state.currentProduct = action.payload;
      })
      .addCase(fetchCurrentProductById.rejected, (state) => {

      })
      // ПОЛУЧЕНИЕ СПИСКА ПРОУДКТОВ
      .addCase(fetchProductsWithSummaryDetail.pending, (state) => {
        state.hasLoadProducts = true;
      })
      .addCase(fetchProductsWithSummaryDetail.fulfilled, (state, action) => {
        state.products = [];

        state.products = action.payload;

        state.hasLoadProducts = false;
      })
      .addCase(fetchProductsWithSummaryDetail.rejected, (state) =>{
        state.hasLoadProducts = false;
      })
      // ПОЛУЧЕНИЕ ПРОДУКТА С ДЕТАЛЬНОЙ СТАТИСТИКОЙ
      .addCase(fetchProductWithDetailStats.pending, (state, action) => {
        state.hasLoadProduct = true;
      })
      .addCase(fetchProductWithDetailStats.fulfilled, (state, action) => {
        state.productWithDetailStats = action.payload;

        state.hasLoadProduct = false;
      })
      .addCase(fetchProductWithDetailStats.rejected, (state) => {
        state.hasLoadProduct = false;
      })
      // ПОЛУЧЕНИЕ СПИСКА ГРУПП ПОЛЬЗОВАТЕЛЯ
      .addCase(fetchProductsGroups.pending, (state) => {

      })
      .addCase(fetchProductsGroups.fulfilled, (state, action) => {
        state.groups = action.payload;
      })
      .addCase(fetchProductsGroups.rejected, (state) => {

      })
      // СОЗДАНИЕ НОВОГО ПРОДУКТА
      .addCase(createProduct.pending, (state) => {
        state.hasLoadProducts = true;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        const product = action.payload;
        const firms = state.firms;

        const stats = firms.map((firm) => {
          return {
            idFirm: firm.id,
            linkProduct: null,
            price: null,
            count: null
          }
        });

        state.products.push({...product, stats});

        state.hasLoadProducts = false;

        toast.success(`Товар ${product.name} успешно создан`);
      })
      .addCase(createProduct.rejected, (state) => {
        state.hasLoadProducts = false;
      })
      // РЕДАКТИРОВАНИЕ СУЩЕСТВУЮЩЕГО ПРОДУКТА
      .addCase(updateProduct.pending, (state) => {
        state.hasLoadProduct = true;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const { product: newProduct } = action.payload;

        const indexNewProduct = state.products.findIndex((product) => {
          return product.id === newProduct.id;
        });

        if (state.products[indexNewProduct].idParent !== newProduct.idParent) {
          state.products.splice(indexNewProduct, 1);
        } else {
          state.products[indexNewProduct] = {...state.products[indexNewProduct], ...newProduct};
        }

        state.hasLoadProduct = false;
      })
      .addCase(updateProduct.rejected, (state) => {
        state.hasLoadProduct = false;
      })
      // УДАЛЕНИЕ СУЩЕСТВУЮЩЕГО ПРОДУКТА
      .addCase(deleteProduct.pending, (state) => {
        state.hasLoadProduct = true;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        const deleteProduct = action.payload;

        state.products = state.products.filter((product) => product.id !== deleteProduct.id);

        state.hasLoadProduct = false;

        toast.success(`${deleteProduct.name} успешно удалён(-а)`);
      })
      .addCase(deleteProduct.rejected, (state) => {
        state.hasLoadProduct = false;
      })
      // СОЗДАНИЕ ССЫЛКИ
      .addCase(createLink.pending, (state) => {
        state.hasLoadLink = true;
      })
      .addCase(createLink.fulfilled, (state) => {
        state.hasLoadLink = false;

        toast.success('Ссылка успешно добавлена!');
      })
      .addCase(createLink.rejected, (state) => {
        state.hasLoadLink = false;

        toast.error('Произошла ошибка при добавлении ссылки');
      })
      // РЕДАКТИРОВАНИЕ ТЕКУЩЕЙ ССЫЛКИ
      .addCase(updateLink.pending, (state) => {
        state.hasLoadLink = true;
      })
      .addCase(updateLink.fulfilled, (state, action) => {
        state.hasLoadLink = false;

        toast.success('Ссылка успешно отредактирована!');
      })
      .addCase(updateLink.rejected, (state) => {
        state.hasLoadLink = false;

        toast.error('Произошла ошибка при редактировании ссылки');
      })
      // УДАЛЕНИЕ ТЕКУЩЕЙ ССЫЛКИ
      .addCase(deleteLink.pending, (state) => {
        state.hasLoadLink = true;
      })
      .addCase(deleteLink.fulfilled, (state, action) => {
        const deleteLink = action.payload;

        const { id: idLink } = deleteLink;

        state.products = state.products.map((product) => {
          const stats = product.stats?.map((stat) => {
            if (stat.idLink === idLink) {
              return {
                idProduct: null,
                idFirm: stat.idFirm,
                price: null,
                count: null,
                linkProduct: null
              }
            }

            return stat;
          });

          return {
            ...product,
            stats
          }
        })

        state.hasLoadLink = false;

        toast.success('Ссылка успешно удалена!');
      })
      .addCase(deleteLink.rejected, (state) => {
        state.hasLoadLink = false;

        toast.error('Произошла ошибка при удалении ссылки');
      })
      // ПОЛУЧЕНИЕ СПИСКА ТРИГГЕРОВ
      .addCase(fetchTriggers.pending, (state) => {
        state.hasLoadTriggers = true;
      })
      .addCase(fetchTriggers.fulfilled, (state, action) => {
        state.triggers = action.payload;

        state.hasLoadTriggers = false;
      })
      .addCase(fetchTriggers.rejected, (state) => {
        state.hasLoadTriggers = false;
      })
      // ПОЛУЧЕНИЕ СПИСКА ТРИГГЕРОВ ДЛЯ ТОВАРА
      .addCase(fetchTriggersForProduct.pending, (state) => {
        state.hasLoadTriggersForProduct = true;
      })
      .addCase(fetchTriggersForProduct.fulfilled, (state, action) => {
        state.triggersForProduct = action.payload;

        state.hasLoadTriggersForProduct = false;
      })
      .addCase(fetchTriggersForProduct.rejected, (state) => {
        state.hasLoadTriggersForProduct = false;
      })
      // ДОБАВЛЕНИЕ ТРИГГЕРА
      .addCase(createTrigger.pending, (state) => {
        state.hasLoadTrigger = true;
      })
      .addCase(createTrigger.fulfilled, (state, action) => {
        const newTrigger = action.payload;

        state.triggers.push(newTrigger);
        state.triggersForProduct?.triggers?.push(newTrigger);

        state.hasLoadTrigger = false;
        toast.success(`Триггер ${newTrigger.name} успешно создан!`);
      })
      .addCase(createTrigger.rejected, (state) => {
        state.hasLoadTrigger = false;

        toast.error('Возникла ошибка при создании триггера');
      })
      // РЕДАКТИРОВАНИЕ ТЕКУЩЕГО ТРИГГЕРА
      .addCase(updateTrigger.pending, (state) => {
        state.hasLoadTrigger = true;
      })
      .addCase(updateTrigger.fulfilled, (state, action) => {
        state.hasLoadTrigger = false;

        const updateFieldTrigger = action.payload;

        const indexTrigger = state.triggers.findIndex((trigger) => trigger.id === updateFieldTrigger.id);
        state.triggers[indexTrigger] = { ...state.triggers[indexTrigger], ...updateFieldTrigger};

        if (state.triggersForProduct.triggers && state.triggersForProduct.triggers.length !== 0) {
          const indexTriggerForProduct = state.triggersForProduct.triggers.findIndex((trigger) => trigger.id === updateFieldTrigger.id);

          if (indexTriggerForProduct !== -1) {
            state.triggersForProduct.triggers[indexTriggerForProduct] = {
              ...state.triggersForProduct.triggers[indexTriggerForProduct], ...updateFieldTrigger
            }
          }
        }

        toast.success(`Триггер ${state.triggers[indexTrigger].name} успешно обновлён!`);
      })
      .addCase(updateTrigger.rejected, (state, action) => {
        state.hasLoadTrigger = false;

        toast.error(`Ошибка при обновлении триггера`);
      })
      // ПОЛУЧЕНИЕ СПИСКА МАРКИРОВОК
      .addCase(fetchAllMarks.pending, (state) => {
        if (!state.marks.length > 0) {
          state.hasLoadMarks = true;
        }
      })
      .addCase(fetchAllMarks.fulfilled, (state, action) => {
        state.marks = [];
        if (state.sortType !== null && state.sortType === SortType.TOTAL_SHOW_DESC) {
          state.marks = action.payload.sort((firstProduct, secondProduct) => {
            return firstProduct.totalShow - secondProduct.totalShow;
          });
        } else {
          state.marks = action.payload.sort((firstProduct, secondProduct) => {
            return secondProduct.totalShow - firstProduct.totalShow;
          });
        }

        state.hasLoadMarks = false;
      })
      .addCase(fetchAllMarks.rejected, (state) => {
        state.hasLoadMarks = false;
      })
      //  ЗАПИСЬ В БАЗУ ДАННЫХ НОВЫХ МАРКИРОВОК
      .addCase(createMarks.pending, (state) => {

      })
      .addCase(createMarks.fulfilled, (state, action) => {

      })
      .addCase(createMarks.rejected, (state) => {

      })
      // ЗАПИСЬ ИНФОРМАЦИИ О ПРОЕКТЕ В БАЗУ ДАННЫХ
      .addCase(createProject.pending, (state) => {
        state.hasCreateNewProject = true;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.hasCreateNewProject = false;
      })
      .addCase(createProject.rejected, (state) => {
        state.hasCreateNewProject = false;
      })
      // ПОЛУЧЕНИЕ СПИСКА ПРОЕКТОВ
      .addCase(fetchAllProjects.pending, (state) => {

      })
      .addCase(fetchAllProjects.fulfilled, (state, action) => {
        state.projects = action.payload;
      })
      .addCase(fetchAllProjects.rejected, (state) => {

      })
      // ПОЛУЧЕНИЕ ЦЕНЫ И НАЛИЧИЯ ПО ССЫЛКЕ
      .addCase(fetchParseData.pending, (state) => {
        state.hasLoadParseData = true;
      })
      .addCase(fetchParseData.fulfilled, (state, action) => {
        state.parseData = action.payload;

        state.hasLoadParseData = false;
      })
      .addCase(fetchParseData.rejected, (state) => {
        state.hasLoadParseData = false;
      })
      // ПОЛУЧЕНИЕ ВСЕХ ОТЧЁТОВ
      .addCase(fetchReports.pending, (state) => {

      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.reports = action.payload;
      })
      .addCase(fetchReports.rejected, (state) => {

      })
      // УДАЛЕНИЕ ВСЕХ ДАННЫХ
      .addCase(deleteAll.pending, (state) => {
        state.hasDeleteAllData = true;
      })
      .addCase(deleteAll.fulfilled, (state) => {
        state.hasDeleteAllData = false;
        state.projects = [];
        state.products = [];
      })
      .addCase(deleteAll.rejected, (state) => {
        state.hasDeleteAllData = false;
      })
      // ПРОВЕРКА ССЫЛКИ ДЛЯ СИНХРОНИЗАЦИИ BITRIX
      .addCase(checkSyncUrlXMLForBitrix.pending, (state) => {
        state.hasCheckSyncUrlXMLForBitrix = true;
      })
      .addCase(checkSyncUrlXMLForBitrix.fulfilled, (state, action) => {
        state.checkDataSyncUrlXMLForBitrix = action.payload;

        state.hasCheckSyncUrlXMLForBitrix = false;
      })
      .addCase(checkSyncUrlXMLForBitrix.rejected, (state) => {
        state.hasCheckSyncUrlXMLForBitrix = false;
      })
      // ПОЛУЧЕНИЕ НАСТРОЕК ИНТЕГРАЦИИ С БИТРИКС
      .addCase(fetchSettingsSyncBitrix.pending, (state) => {
        state.hasLoadSettingsSyncBitrix = true;
      })
      .addCase(fetchSettingsSyncBitrix.fulfilled, (state, action) => {
        state.settingsSyncBitrix = action.payload;

        state.hasLoadSettingsSyncBitrix = false;
      })
      .addCase(fetchSettingsSyncBitrix.rejected, (state) => {
        state.hasLoadSettingsSyncBitrix = false;
      })
      // СОХРАНЕНИЕ НАСТРОЕК ИНТЕГРАЦИИ С БИТРИКС
      .addCase(setSettingsSyncBitrix.pending, (state) => {
        state.hasLoadSettingsSyncBitrix = true;
      })
      .addCase(setSettingsSyncBitrix.fulfilled, (state, action) => {
        state.settingsSyncBitrix = action.payload;

        state.hasLoadSettingsSyncBitrix = false;
      })
      .addCase(setSettingsSyncBitrix.rejected, (state) => {
        state.hasLoadSettingsSyncBitrix = false;
      })
      // ПОЛУЧЕНИЕ ИНТЕГРАЦИОННЫХ ОТЧЁТОВ
      .addCase(fetchReportsIntegrations.pending, (state) => {
        if (!state.reportsIntegrations.length > 0) {
          state.hasLoadReportsIntegrations = true;
        }
      })
      .addCase(fetchReportsIntegrations.fulfilled, (state, action) => {
        state.reportsIntegrations = action.payload;

        state.hasLoadReportsIntegrations = false;
      })
      .addCase(fetchReportsIntegrations.rejected, (state) => {
        state.hasLoadReportsIntegrations = false;
      })
      // СИНХРОНИЗАЦИЯ С БИТРИКСОМ
      .addCase(fetchStartSyncBitrix.pending, (state) => {
        state.hasSyncBitrixProducts = true;
      })
      .addCase(fetchStartSyncBitrix.fulfilled, (state) => {
        state.hasSyncBitrixProducts = false;
      })
      .addCase(fetchStartSyncBitrix.rejected, (state) => {
        state.hasSyncBitrixProducts = false;
      })
  }
})

export const {
  loadFirms,
  loadProducts,
  setCurrentProduct,
  loadMarks,
  sortMarks,
  setParseData,
  setPeriod,
  setTypeShowValue,
  setTypeShowConditionValue,
  setIsShowNotifications,
  setCheckDataUrlXMLForBitrix,
  clearParseData
} = appData.actions;
