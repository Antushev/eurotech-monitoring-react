import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import * as dayjs from 'dayjs';
import debounce from 'debounce';
import Highlighter from 'react-highlight-words';
import { toast } from 'react-toastify';

import { getIdFirmsSelect } from '../../utils/common.js';

import { getLocalStorageStatDetalisationInMonitoringPage } from '../../services/local-storage.js';

import { api } from '../../store/index.js';

import Calendar from '../../components/calendar/calendar.jsx';

import {
  AppRoute,
  TypeShowValue,
  TypeShowConditionValue,
  TypeLastActionBlock
} from '../../const.js';
import {
  setCurrentProduct,
  setIsShowNotifications
} from '../../store/app-data/app-data.js';
import {
  fetchFirmsByIdUser,
  fetchCurrentProductById,
  fetchProductsWithSummaryDetail,
  fetchReports
} from '../../store/api-actions.js';

import {
  getCurrentUser,
  getAllFirms,
  getAllProducts,
  getCurrentProduct,
  getTypeShowValue,
  getTypeShowConditionValue,
  getIsShowNotifications,
  getStatusLoadProducts
} from '../../store/app-data/selectors.js';

import LastActionNotification from '../../components/last-action/last-action.jsx';
import StatDetalisation from '../../components/stat-detalisation/stat-detalisation.jsx';
import PopupAddGroup from '../../components/popup-add-group/popup-add-group.jsx';
import PopupAddProduct from '../../components/popup-add-product/popup-add-product.jsx';
import PopupEditProduct from '../../components/popup-edit-product/popup-edit-product.jsx';
import PopupSelectConsumers from '../../components/popup-select-consumers/popup-select-consumers.jsx';
import PopupAddLink from '../../components/popup-add-link/popup-add-link.jsx';
import PopupEditLink from '../../components/popup-edit-link/popup-edit-link.jsx';
import PopupStatDetalisation from '../../components/popup-stat-detalisation/popup-stat-detalisation.jsx';
import DialogWindowProduct from '../../components/dialog-window-product/dialog-window-product.jsx';
import DialogWindowEditLink from '../../components/dialog-window-edit-link/dialog-window-edit-link.jsx';
import Preloader from '../../components/preloader/preloader.jsx';

const SET_INTERVAL_FETCH_DATA = 15000;
const TIMER_DEBOUNCE = 800;
const WIDTH_PRELOADER = 15;
const HEIGHT_PRELOADER = 15;
const COLOR_PRELOADER = '#000000';
const WIDTH_PRELOADER_GROUP = 25;
const HEIGHT_PRELOADER_GROUP = 25;
const COLOR_PRELOADER_GROUP = '#000000';

const TypeSearch = {
  ALL: 'all',
  GROUP: 'group'
}

const MonitoringPage = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(getCurrentUser);
  const currentProduct = useSelector(getCurrentProduct);
  const typeShowValue = useSelector(getTypeShowValue);
  const typeShowConditionValue = useSelector(getTypeShowConditionValue);
  const isShowNotifications = useSelector(getIsShowNotifications);
  const isLoadProducts = useSelector(getStatusLoadProducts);

  const searchTextProductRef = useRef(null);

  // For StatDetalisationComponent
  const defaultSettingsStatDetalisation = getLocalStorageStatDetalisationInMonitoringPage();
  const [productsWithDetalisationStat, setProductsWithDetalisationStat] = useState([]);
  const [firmsForDetalisationStat, setFirmsForDetalisationStat] = useState(defaultSettingsStatDetalisation.firms);
  const [isLoadProductWithDetalisationStat, setIsLoadProductWithDetalisationStat] = useState(false);
  const [typeValue, setTypeValue] = useState(defaultSettingsStatDetalisation.typeValue); // price, count
  const [typeValueCalculate, setTypeValueCalculate] = useState(defaultSettingsStatDetalisation.typeValueCalculate); // percent, value
  const [sortStatDetalisation, setSortStatDetalisation] = useState(defaultSettingsStatDetalisation.sort);
  const [pageStatDetalisation, setPageStatDetalisation] = useState(1);
  const [dateForStatDetalisation, setDateForStatDetalisation] = useState({
    from: dayjs().subtract(1, 'month'),
    to: dayjs()
  });

  console.log(dateForStatDetalisation);


  useEffect(() => {
    dispatch(fetchFirmsByIdUser(currentUser.id));
    dispatch(fetchProductsWithSummaryDetail({
      idUser: currentUser.id,
      idParent: currentProduct !== null ? currentProduct.id : null,
      withStats: 'summary',
      dateStart: dayjs().startOf('day'),
      dateEnd: dayjs().endOf('day')
    }));
    dispatch(fetchReports());

    const interval = setInterval(() => {
      dispatch(fetchReports());
    }, SET_INTERVAL_FETCH_DATA);

    return () => clearInterval(interval);
  }, []);

  const fetchDataStatDetalisation = async (dateFrom, dateTo, typeValueFetch, typeValueCalculateFetch, sort, page = 1, idFirms = null, otherComponent = false) => {
    if (!otherComponent) {
      setProductsWithDetalisationStat([]);
      setIsLoadProductWithDetalisationStat(true);
    }

    const dateFromFormat = dayjs(dateFrom).startOf('day').format('YYYY-MM-DD HH:mm:ss');
    const dateToFormat = dayjs(dateTo).endOf('day').format('YYYY-MM-DD HH:mm:ss');

    const url = `/stat-detalisation/?dateFrom=${dateFromFormat}&dateTo=${dateToFormat}&sort=${sort}&typeValue=${typeValueFetch}&typeValueCalculate=${typeValueCalculateFetch}&page=${page}&idFirms=${idFirms}`
    const { data } = await api.get(url);

    if (!otherComponent) {
      await setProductsWithDetalisationStat(data);
      setIsLoadProductWithDetalisationStat(false);
    }

    if (!data) {
      return false;
    }

    return data;
  }

  useEffect(() => {
    const idFirms = getIdFirmsSelect(firmsForDetalisationStat);

    fetchDataStatDetalisation(dateForStatDetalisation.from, dateForStatDetalisation.to, typeValue, typeValueCalculate, sortStatDetalisation, pageStatDetalisation, idFirms, false).catch(() => {
      toast.warning('Не удалось обновить данные, проверьте подключение к Интернету');
    });
  }, []);


  const firms = useSelector(getAllFirms);
  const mainFirm = getMainFirm(firms);
  const products = useSelector(getAllProducts);

  const [dateProductsTable, setDateProductsTable] = useState(dayjs());
  const [isOpenPopupAddGroup, setIsOpenPopupAddGroup] = useState(false);
  const [isOpenPopupAddProduct, setIsOpenPopupAddProduct] = useState(false);
  const [isOpenPopupEditProduct, setIsOpenPopupEditProduct] = useState(false);
  const [isOpenPopupSelectConsumers, setIsOpenPopupSelectConsumers] = useState(false);
  const [isOpenPopupAddLink, setIsOpenPopupAddLink] = useState(false);
  const [isOpenPopupEditLink, setIsOpenPopupEditLink] = useState(false);
  const [isOpenPopupStatDetalisation, setIsOpenPopupStatDetalisation] = useState(false);
  const [selectProductAddLink, setSelectProductAddLink] = useState(null);
  const [selectFirmAddLink, setSelectFirmAddLink] = useState(null);
  const [selectProductForDialog, setSelectProductForDialog] = useState({});
  const [selectLinkForDialog, setSelectLinkForDialog] = useState({});
  const [idLoadGroup, setIdLoadGroup] = useState(null);
  const [typeSearch, setTypeSearch] = useState(TypeSearch.GROUP);
  const [isLoadSearch, setIsLoadSearch] = useState(false);

  return (
    <>
      <section className="page-content page__content">
        <DialogWindowProduct />
        {/*<section className="page-content__alert standart-block">Внимание! Данный раздел находится в разработке. Интерфейс не взаимодействует с базой данных.</section>*/}
        <header className="page-content__header page-content__header--monitoring standart-block">
          <h1 className="header header--1">Мониторинг</h1>

          <div className="page-content__header-block">
            <div className="notifications icon-block">
              <svg
                className={`icon ${isShowNotifications ? 'icon--active' : ''}`}
                width="24" height="27"
                viewBox="0 0 24 27"
                onClick={() => {
                  dispatch(setIsShowNotifications(!isShowNotifications));
                }}
              >
                <path d="M12 27C13.8921 27 15.427 25.4892 15.427 23.625H8.57305C8.57305 25.4892 10.1079 27 12 27ZM23.5387 19.1051C22.5037 18.0104 20.5671 16.3635 20.5671 10.9688C20.5671 6.87129 17.6486 3.59121 13.7132 2.78648V1.6875C13.7132 0.755684 12.9461 0 12 0C11.0539 0 10.2868 0.755684 10.2868 1.6875V2.78648C6.35145 3.59121 3.43288 6.87129 3.43288 10.9688C3.43288 16.3635 1.49628 18.0104 0.461286 19.1051C0.139858 19.4453 -0.00264152 19.8519 3.70385e-05 20.25C0.00592988 21.1148 0.695392 21.9375 1.71967 21.9375H22.2803C23.3046 21.9375 23.9946 21.1148 24 20.25C24.0026 19.8519 23.8601 19.4447 23.5387 19.1051Z" fill="#141414" fill-opacity="0.9"/>
              </svg>

              {/*<div className="icon-count">24</div>*/}

              <LastActionNotification
                type={ TypeLastActionBlock.NOTIFICATION }
                isShow={ isShowNotifications }
              />
            </div>
          </div>

        </header>
        <div className="page-content__inner page-content__inner--main">
          <section className="page-content__inline-blocks page-content__inline-blocks--margin-bottom">
            <div className="page-content__common-block goods-index-block">
              <ul className="goods-common-stat page-content__goods-common-stat">
                <li className="goods-common-stat__item standart-block">
                  <h3 className="header header--3">Цены</h3>
                </li>

                <li className="goods-common-stat__item standart-block">
                  <h3 className="header header--3">Остатки</h3>
                </li>

                <li className="goods-common-stat__item standart-block">
                  <h3 className="header header--3">Заполнение</h3>
                </li>
              </ul>

              <div className="goods-index-block standart-block page-content__goods-index-block">
                <div className="goods-index-block__header">
                  <h2 className="header header--2">Индекс роста цен за 2025 год</h2>
                </div>
              </div>
            </div>

            <StatDetalisation
              date={ dateForStatDetalisation }
              products={ productsWithDetalisationStat }
              firms={ firmsForDetalisationStat }
              typeValue={ typeValue }
              typeValueCalculate={ typeValueCalculate }
              sort={ sortStatDetalisation }
              page={ pageStatDetalisation }
              isLoad={ isLoadProductWithDetalisationStat }
              setProducts={ setProductsWithDetalisationStat }
              setSort={ setSortStatDetalisation }
              setDate={ setDateForStatDetalisation }
              setPage={ setPageStatDetalisation }
              setIsOpenPopup={ setIsOpenPopupStatDetalisation }
              fetchProducts={ fetchDataStatDetalisation }
            />
          </section>

          <section className="goods-block standart-block">
            <div className="goods-block__header">
              <div className="goods-block__header-block">
                <h2 className="header header--2">
                  Таблица {typeShowValue === TypeShowValue.PRICE ? 'цен' : 'остатков'} на {dayjs(dateProductsTable).format('DD.MM.YYYY')}
                </h2>

                <ul className="detalisation-list">
                  <li className="detalisation-list__item detalisation-list__item--active">все товары</li>
                  <li className="detalisation-list__item">избранные товары</li>
                </ul>
              </div>

              <div>
                <ul className="buttons-list">
                  <li className="buttons-list__item">
                    <button
                      className="button button--no-background button--text-red"
                      type="button"
                      onClick={() => {
                        setIsOpenPopupSelectConsumers(true)
                      }}
                    >
                      <svg className="buttons-list__icon" width="26" height="26" viewBox="0 0 26 26">
                        <path d="M24.7133 16.1242L22.4674 14.8347C22.6941 13.6185 22.6941 12.371 22.4674 11.1548L24.7133 9.86533C24.9717 9.71856 25.0877 9.41453 25.0033 9.13147C24.4181 7.26534 23.4217 5.57745 22.1195 4.17261C21.9191 3.9577 21.5922 3.90528 21.3392 4.05205L19.0933 5.34156C18.1496 4.53431 17.0635 3.91052 15.8878 3.50165V0.927868C15.8878 0.634321 15.6822 0.377467 15.3922 0.314564C13.4574 -0.115273 11.4751 -0.0943054 9.6351 0.314564C9.34514 0.377467 9.13952 0.634321 9.13952 0.927868V3.50689C7.96912 3.921 6.88306 4.54479 5.93408 5.3468L3.69343 4.05729C3.4351 3.91052 3.1135 3.9577 2.91316 4.17786C1.61095 5.57745 0.614523 7.26534 0.0293192 9.13671C-0.0603066 9.41977 0.0609519 9.7238 0.319285 9.87058L2.5652 11.1601C2.3385 12.3762 2.3385 13.6238 2.5652 14.8399L0.319285 16.1294C0.0609519 16.2762 -0.0550345 16.5802 0.0293192 16.8633C0.614523 18.7294 1.61095 20.4173 2.91316 21.8221C3.1135 22.0371 3.44037 22.0895 3.69343 21.9427L5.93935 20.6532C6.88306 21.4605 7.96912 22.0842 9.1448 22.4931V25.0721C9.1448 25.3657 9.35041 25.6225 9.64037 25.6854C11.5752 26.1153 13.5576 26.0943 15.3975 25.6854C15.6875 25.6225 15.8931 25.3657 15.8931 25.0721V22.4931C17.0635 22.079 18.1496 21.4552 19.0985 20.6532L21.3445 21.9427C21.6028 22.0895 21.9244 22.0423 22.1247 21.8221C23.4269 20.4226 24.4234 18.7347 25.0086 16.8633C25.0877 16.575 24.9717 16.271 24.7133 16.1242ZM12.5137 17.1883C10.1887 17.1883 8.29599 15.3064 8.29599 12.9948C8.29599 10.6831 10.1887 8.80123 12.5137 8.80123C14.8387 8.80123 16.7314 10.6831 16.7314 12.9948C16.7314 15.3064 14.8387 17.1883 12.5137 17.1883Z" fill="#BE1622"/>
                      </svg>
                      <span className="buttons-list__text-button">
                        Настроить
                      </span>
                    </button>
                  </li>
                  <li className="buttons-list__item">
                    <button
                      className="button"
                      type="button"
                      onClick={() => setIsOpenPopupAddGroup(true)}
                    >
                      Добавить группу
                    </button>
                  </li>
                  <li className="buttons-list__item">
                    <button
                      className="button"
                      type="button"
                      onClick={() => {
                        setIsOpenPopupAddProduct(true);
                      }}
                    >
                      Добавить товар
                    </button>
                  </li>
                  <li className="buttons-list__item">
                    <div className="search">
                      <input
                        disabled={isLoadSearch}
                        ref={searchTextProductRef}
                        className="search__input input input--search-field"
                        type="text"
                        placeholder="Поиск"
                        onChange={debounce(async (evt) => {
                          setIsLoadSearch(true);

                          const name = evt.target.value;

                          await dispatch(fetchProductsWithSummaryDetail({
                            idUser: currentUser.id,
                            idParent: typeSearch === TypeSearch.GROUP ? (currentProduct ? currentProduct.id : null) : (name !== '' ? false : currentProduct.id),
                            withStats: 'summary',
                            name: name && name !== '' ? name : null,
                            dateStart: dayjs(dateProductsTable).startOf('day'),
                            dateEnd: dayjs(dateProductsTable).endOf('day')
                          }));

                          setIsLoadSearch(false);
                        }, TIMER_DEBOUNCE)}
                      />

                      {
                        isLoadSearch
                        ?
                          <svg
                            className="search__icon icon"
                            width={WIDTH_PRELOADER}
                            height={HEIGHT_PRELOADER}
                            viewBox="0 0 38 38"
                            stroke={COLOR_PRELOADER}
                          >
                            <g fill="none" fillRule="evenodd">
                              <g transform="translate(1 1)" strokeWidth="2">
                                <circle strokeOpacity=".5" cx="18" cy="18" r="18"/>
                                <path d="M36 18c0-9.94-8.06-18-18-18">
                                  <animateTransform
                                    attributeName="transform"
                                    type="rotate"
                                    from="0 18 18"
                                    to="360 18 18"
                                    dur="1s"
                                    repeatCount="indefinite"/>
                                </path>
                              </g>
                            </g>
                          </svg>
                          :
                          <svg className="search__icon icon" width="20" height="20" viewBox="0 0 20 20">
                            <path d="M19.728 17.2913L15.8332 13.3971C15.6574 13.2214 15.4191 13.1237 15.1691 13.1237H14.5323C15.6105 11.7449 16.2512 10.0107 16.2512 8.12421C16.2512 3.63636 12.6142 0 8.12559 0C3.63698 0 0 3.63636 0 8.12421C0 12.612 3.63698 16.2484 8.12559 16.2484C10.0125 16.2484 11.747 15.6079 13.126 14.5298V15.1665C13.126 15.4165 13.2236 15.6547 13.3994 15.8305L17.2942 19.7246C17.6614 20.0918 18.2552 20.0918 18.6185 19.7246L19.7241 18.6193C20.0913 18.2521 20.0913 17.6584 19.728 17.2913ZM8.12559 13.1237C5.36367 13.1237 3.12523 10.8896 3.12523 8.12421C3.12523 5.36276 5.35977 3.12469 8.12559 3.12469C10.8875 3.12469 13.126 5.35885 13.126 8.12421C13.126 10.8857 10.8914 13.1237 8.12559 13.1237Z" fill="#141414" fill-opacity="0.9"/>
                          </svg>
                      }

                      <ul className="search__list-params">
                        <li
                          className={`search__list-params-item ${typeSearch === TypeSearch.GROUP ? 'search__list-params-item--active' : ''}` }
                          onClick={async () => {
                            setTypeSearch(TypeSearch.GROUP);

                            setIsLoadSearch(true);

                            const name = searchTextProductRef.current.value;

                            await dispatch(fetchProductsWithSummaryDetail({
                              idUser: currentUser.id,
                              idParent: currentProduct ? currentProduct.id : null,
                              withStats: 'summary',
                              name: name && name !== '' ? name : null,
                              dateStart: dayjs(dateProductsTable).startOf('day'),
                              dateEnd: dayjs(dateProductsTable).endOf('day')
                            }));

                            setIsLoadSearch(false);
                          }}
                        >
                          в группе
                        </li>
                        <li
                          className={`search__list-params-item ${typeSearch === TypeSearch.ALL ? 'search__list-params-item--active' : ''}`}
                          onClick={async () => {
                            setTypeSearch(TypeSearch.ALL);

                            setIsLoadSearch(true);

                            const name = searchTextProductRef.current.value;

                            await dispatch(fetchProductsWithSummaryDetail({
                              idUser: currentUser.id,
                              idParent: name ? (name !== '' ? false : null) : (currentProduct ? currentProduct.id : null),
                              withStats: 'summary',
                              name: name && name !== '' ? name : null,
                              dateStart: dayjs(dateProductsTable).startOf('day'),
                              dateEnd: dayjs(dateProductsTable).endOf('day')
                            }));

                            setIsLoadSearch(false);
                          }}
                        >
                          везде
                        </li>
                      </ul>

                    </div>
                  </li>

                  <li className="buttons-list__item">
                    <div className="date-select date-select--margin-right">
                      <input
                        className="date-select__input"
                        name="date-select"
                        type="date"
                        defaultValue={ dayjs(dateProductsTable).format('YYYY-MM-DD') }
                        alt="Дата до"
                        onChange={async (evt) => {
                          const name = searchTextProductRef.current.value;

                          setDateProductsTable(evt.target.value);

                          await dispatch(fetchProductsWithSummaryDetail({
                            idUser: currentUser.id,
                            idParent: currentProduct !== null ? currentProduct.id : null,
                            withStats: 'summary',
                            dateStart: dayjs(dateProductsTable).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
                            dateEnd: dayjs(dateProductsTable).endOf('day').format('YYYY-MM-DD HH:mm:ss'),
                          }));
                        }}
                      />
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <table className="goods-table">
              <thead>
                <tr className="goods-table__tr">
                  <th className="goods-table__th">Товар / Конкурент</th>
                  {
                    firms.map((firm) => {
                      if (firm.isSelect) {
                        if (firm.isMain) {
                          return <th key={firm.id} className="goods-table__th">
                            <svg className="goods-table__th-icon" width="15" height="14" viewBox="0 0 15 14">
                              <path d="M6.69533 0.487005L4.86449 4.10687L0.768236 4.68922C0.0336581 4.79311 -0.260734 5.67621 0.271975 6.182L3.23552 8.99806L2.53459 12.9761C2.40842 13.6951 3.18505 14.2337 3.83552 13.8975L7.5 12.0192L11.1645 13.8975C11.8149 14.231 12.5916 13.6951 12.4654 12.9761L11.7645 8.99806L14.728 6.182C15.2607 5.67621 14.9663 4.79311 14.2318 4.68922L10.1355 4.10687L8.30467 0.487005C7.97664 -0.158228 7.02617 -0.16643 6.69533 0.487005Z" fill="#ffffff"/>
                            </svg>
                            {firm.name}w
                          </th>
                        }

                        return <th key={firm.id} className="goods-table__th">{firm.name}</th>
                      }
                    })
                  }
                </tr>
              </thead>
              <tbody>
              {
                (
                  currentProduct !== null
                  && typeSearch !== TypeSearch.ALL
                ) &&
                  <tr className="goods-table__tr">
                    <td
                      className="goods-table__td"
                      onClick={async () => {
                        const name = searchTextProductRef.current.value;

                        setIdLoadGroup(currentProduct.id);

                        await dispatch(fetchProductsWithSummaryDetail({
                          idUser: currentUser.id,
                          idParent: currentProduct.idParent,
                          withStats: 'summary',
                          name: name && name !== '' ? name : null,
                          dateStart: dayjs(dateProductsTable).startOf('day'),
                          dateEnd: dayjs(dateProductsTable).endOf('day')
                        }));

                        setIdLoadGroup(null);

                        await dispatch(fetchCurrentProductById(currentProduct.idParent));
                      }}
                    >
                      {
                        idLoadGroup === currentProduct.id
                          ?
                          <Preloader
                            key={currentProduct.id}
                            width={WIDTH_PRELOADER_GROUP}
                            height={HEIGHT_PRELOADER_GROUP}
                            color={COLOR_PRELOADER_GROUP}
                            type="GROUP"
                          />
                          :
                          <svg className="icon goods-table__icon" width="18" height="18" viewBox="0 0 22 22">
                            <path d="M12.5757 19.895L11.4917 20.979C11.0327 21.438 10.2905 21.438 9.83643 20.979L0.344238 11.4917C-0.114746 11.0327 -0.114746 10.2905 0.344238 9.83643L9.83643 0.344238C10.2954 -0.114746 11.0376 -0.114746 11.4917 0.344238L12.5757 1.42822C13.0396 1.89209 13.0298 2.64893 12.5562 3.10303L6.67236 8.7085H20.7056C21.355 8.7085 21.8774 9.23096 21.8774 9.88037V11.4429C21.8774 12.0923 21.355 12.6147 20.7056 12.6147H6.67236L12.5562 18.2202C13.0347 18.6743 13.0444 19.4312 12.5757 19.895Z" fill="#BE1622"/>
                          </svg>
                      }


                      <svg className="icon goods-table__icon" width="26" height="18" viewBox="0 0 26 18" fill="none">
                        <path d="M25.8508 10.6919L22.5816 16.5116C22.3272 16.9645 21.963 17.3403 21.5251 17.6014C21.0873 17.8626 20.5912 18 20.0863 18H2.03238C1.19627 18 0.675323 17.0581 1.0966 16.3081L4.36574 10.4884C4.62016 10.0355 4.98443 9.65971 5.42227 9.39857C5.8601 9.13742 6.3562 9 6.86111 9H24.915C25.7512 9 26.2721 9.94186 25.8508 10.6919ZM6.86111 7.5H21.6667V5.25C21.6667 4.00734 20.6966 3 19.5 3H12.2778L9.38889 0H2.16667C0.970035 0 0 1.00734 0 2.25V15.2834L3.11806 9.73256C3.8916 8.35547 5.32589 7.5 6.86111 7.5Z" fill="black"/>
                      </svg>

                      <span className="goods-table__text">{currentProduct.name}</span>
                    </td>
                  </tr>
              }
                {
                  products?.length === 0 || !products
                  ? <tr>
                      <td>
                        {
                          (searchTextProductRef?.current?.value !== '' && typeSearch === TypeSearch.GROUP && !isLoadSearch)
                          && <p>В данной группе товаров по поисковой фразе <u><b>{searchTextProductRef?.current?.value}</b></u> ничего не найдено</p>
                        }

                        {
                          (searchTextProductRef?.current?.value !== '' && typeSearch === TypeSearch.ALL && !isLoadSearch)
                          && <p>При поиске по всем товарам по поисковой фразе <u><b>{searchTextProductRef?.current?.value}</b></u> ничего не найдено</p>
                        }
                      </td>
                  </tr> :
                  products.map((product, index) => {
                    if (product.isGroup) {
                      return (
                        <tr
                          key={index}
                          className="goods-table__tr"
                          onClick={async () => {
                            setIdLoadGroup(product.id)

                            const name = searchTextProductRef.current.value;

                            await dispatch(fetchProductsWithSummaryDetail({
                              idUser: currentUser.id,
                              idParent: product.id,
                              name: name && name !== '' ? name : null,
                              withStats: 'summary',
                              dateStart: dayjs(dateProductsTable).startOf('day'),
                              dateEnd: dayjs(dateProductsTable).endOf('day')
                            }));

                            await dispatch(setCurrentProduct(product));

                            setIdLoadGroup(null);
                          }}
                        >
                          <td
                            className="goods-table__td"
                            colSpan={10}
                            onContextMenu={(evt) => {
                              evt.preventDefault();

                              setSelectProductForDialog(product);
                            }}
                          >
                            {
                              idLoadGroup === product.id ?
                                <Preloader
                                  key={product.id}
                                  width={WIDTH_PRELOADER_GROUP}
                                  height={HEIGHT_PRELOADER_GROUP}
                                  color={COLOR_PRELOADER_GROUP}
                                  type="GROUP"
                                />
                                :
                                <svg className="goods-table__icon" width="28" height="19" viewBox="0 0 28 19" fill="none">
                                  <path d="M25.0186 3.05707H14.8012L11.3954 0H2.88084C1.47009 0 0.326477 1.02651 0.326477 2.2928V16.0496C0.326477 17.3159 1.47009 18.3424 2.88084 18.3424H25.0186C26.4294 18.3424 27.573 17.3159 27.573 16.0496V5.34986C27.573 4.08357 26.4294 3.05707 25.0186 3.05707Z" fill="#141414"/>
                                </svg>
                            }
                            <span className="goods-table__text">
                              <Highlighter
                                highlightClassName="highlighter"
                                searchWords={[searchTextProductRef?.current?.value]}
                                autoEscape={true}
                                textToHighlight={product?.name}
                              />
                            </span>

                            {
                              selectProductForDialog.id === product.id
                              &&
                              <DialogWindowProduct
                                product={product}
                                isOpen={true}
                                setIsOpen={setSelectProductForDialog}
                                setIsOpenPopupEditProduct={setIsOpenPopupEditProduct}
                              />
                            }

                          </td>
                        </tr>
                      )
                    }

                    const priceMainFirm = getPriceMainFirm(product.stats, mainFirm.id);
                    const countMainFirm = getCountMainFirm(product.stats, mainFirm.id);
                    return (
                      <tr
                        key={index}
                        className="goods-table__tr"
                      >
                        <td
                          className="goods-table__td goods-table__td--name"
                          onContextMenu={(evt) => {
                            evt.preventDefault();

                            setSelectProductForDialog(product);
                          }}
                        >
                          <Link className="goods-table__link" to={`${AppRoute.Monitoring}/${product.id}`}>
                            <Highlighter
                              highlightClassName="highlighter"
                              searchWords={[searchTextProductRef?.current?.value]}
                              autoEscape={true}
                              textToHighlight={product?.name}
                            />
                          </Link>
                          {
                            selectProductForDialog.id === product.id
                            &&
                            <DialogWindowProduct
                              product={product}
                              isOpen={true}
                              setIsOpen={setSelectProductForDialog}
                              setIsOpenPopupEditProduct={setIsOpenPopupEditProduct}
                            />
                          }
                        </td>
                        {

                          firms.filter(firm => firm.isSelect).map((firm) => {
                            return product.stats?.map((stat, index) => {

                              if (stat.idFirm === firm.id) {

                                if (stat.linkProduct === null) {
                                  return (
                                    <td key={index} className="goods-table__td">
                                    <button
                                      key={index}
                                      className="button button--no-background button--text-blue text--center goods-table__button"
                                      onClick={() => {
                                        setIsOpenPopupAddLink(true);
                                        setSelectFirmAddLink(firm);
                                        setSelectProductAddLink(product);
                                      }}
                                    >
                                      Добавить<br/>
                                      ссылку
                                    </button>
                                  </td>
                                  );
                                }

                                if (stat.price === null) {
                                  if (isLoadProducts) {
                                    return (
                                      <td
                                        className="goods-table__td"
                                      >
                                        <Preloader
                                          width={ WIDTH_PRELOADER }
                                          height={ HEIGHT_PRELOADER }
                                          color={ COLOR_PRELOADER }
                                        />
                                      </td>
                                    )
                                  }

                                  return (
                                    <td
                                      key={index}
                                      className="goods-table__td"
                                      onClick={(evt) => {
                                        evt.preventDefault();
                                        setSelectLinkForDialog({ stat, product, firm })
                                      }}
                                      onContextMenu={(evt) => {
                                        evt.preventDefault();
                                        setSelectLinkForDialog({stat, product, firm})
                                      }}
                                    >

                                      Нет данных <br />
                                      <span className="goods-table__text">
                                        <u>Подробнее</u>
                                      </span>
                                      {
                                        selectLinkForDialog.stat === stat
                                        &&
                                        <DialogWindowEditLink
                                          isOpen={true}
                                          setIsOpen={setSelectLinkForDialog}
                                          setIsOpenPopupEditLink={setIsOpenPopupEditLink}
                                          stat={stat}
                                        />
                                      }
                                    </td>
                                  )
                                }

                                const compareValue = typeShowValue === TypeShowValue.PRICE
                                  ? getCompareValue(stat.price, priceMainFirm, typeShowConditionValue)
                                  : getCompareValue(stat.count, countMainFirm, typeShowConditionValue)

                                if (isLoadProducts) {
                                  return (
                                    <td
                                      className="goods-table__td"
                                    >
                                      <Preloader
                                        width={ WIDTH_PRELOADER }
                                        height={ HEIGHT_PRELOADER }
                                        color={ COLOR_PRELOADER }
                                      />
                                    </td>
                                  )
                                }

                                return (
                                  <td
                                    key={index}
                                    className="goods-table__td"
                                    onContextMenu={(evt) => {
                                      evt.preventDefault();
                                      setSelectLinkForDialog({stat, product, firm});
                                    }}
                                  >

                                    <span className="goods-table__number-value">
                                      {
                                        typeShowValue === TypeShowValue.PRICE ? stat.price.toLocaleString() : (stat.count ? stat.count.toLocaleString() : 0)
                                      }
                                    </span>
                                    {
                                      firm.id !== mainFirm.id &&
                                      <div key={index}
                                        className={getClassForCompareBlock(compareValue, typeShowValue)}
                                      >

                                        {
                                          (typeShowValue === TypeShowValue.PRICE && compareValue < 0) &&
                                          `(${compareValue.toLocaleString()}${typeShowConditionValue === TypeShowConditionValue.PERCENT ? '%' : ''})`
                                        }

                                        {
                                          (typeShowValue === TypeShowValue.PRICE && compareValue > 0) &&
                                          `(+${compareValue.toLocaleString()}${typeShowConditionValue === TypeShowConditionValue.PERCENT ? '%' : ''})`
                                        }

                                        {
                                          (typeShowValue === TypeShowValue.COUNT && compareValue < 0) &&
                                          `(${compareValue.toLocaleString()}${typeShowConditionValue === TypeShowConditionValue.PERCENT ? '%' : ''})`
                                        }

                                        {
                                          (typeShowValue === TypeShowValue.COUNT && compareValue > 0) &&
                                          `(+${compareValue.toLocaleString()}${typeShowConditionValue === TypeShowConditionValue.PERCENT ? '%' : ''})`
                                        }
                                      </div>
                                    }
                                    {
                                      selectLinkForDialog.stat === stat
                                      &&
                                      <DialogWindowEditLink
                                        isOpen={true}
                                        setIsOpen={setSelectLinkForDialog}
                                        setIsOpenPopupEditLink={setIsOpenPopupEditLink}
                                        stat={stat}
                                      />
                                    }
                                  </td>
                                );
                              }
                            })
                          })
                        }
                      </tr>
                    );
                  })
                }
              </tbody>
            </table>
          </section>
        </div>
      </section>

      {isOpenPopupAddGroup
        ?
        <PopupAddGroup
          setIsOpen={setIsOpenPopupAddGroup}
        />
        : ''
      }

      {isOpenPopupAddProduct
        ?
        <PopupAddProduct
          currentProduct={currentProduct}
          setIsOpen={setIsOpenPopupAddProduct}
        />
        : ''
      }

      {
        isOpenPopupEditProduct &&
          <PopupEditProduct
            product={selectProductForDialog}
            setIsOpen={setIsOpenPopupEditProduct}
            setSelectProductForDialog={setSelectProductForDialog}
          />
      }

      {isOpenPopupSelectConsumers
        ?
        <PopupSelectConsumers
          firms={firms}
          currentProduct={currentProduct}
          setIsOpen={setIsOpenPopupSelectConsumers}
        />
        : ''
      }

      {
        isOpenPopupAddLink &&
          <PopupAddLink
            firm={selectFirmAddLink}
            product={selectProductAddLink}
            setIsOpen={setIsOpenPopupAddLink}
          />
      }

      {
        isOpenPopupEditLink &&
          <PopupEditLink
            stats={selectLinkForDialog}
            setIsOpen={setIsOpenPopupEditLink}
          />
      }

      {
        isOpenPopupStatDetalisation &&
        <PopupStatDetalisation
          date={ dateForStatDetalisation }
          allFirms={ firms }
          firmsSelect={ firmsForDetalisationStat }
          typeValue={ typeValue }
          typeValueCalculate={ typeValueCalculate }
          sort={ sortStatDetalisation }
          sortType={ sortStatDetalisation }
          setFirmsSelect={ setFirmsForDetalisationStat }
          setTypeValue={ setTypeValue }
          setTypeValueCalculate={ setTypeValueCalculate }
          setSortTypeDetalisation={ setSortStatDetalisation }
          setPage={ setPageStatDetalisation }
          setIsOpen={ setIsOpenPopupStatDetalisation }
          fetchData={ fetchDataStatDetalisation }
        />
      }

    </>
  );
}

const getMainFirm = (firms) => {
  return firms.find((firm) => firm.isMain);
}

const getPriceMainFirm = (stats, idMainFirm) => {
  if (stats) {
    return stats.find((stat) => stat.idFirm === idMainFirm).price;
  }

  return null;
}

const getCountMainFirm = (stats, idMainFirm) => {
  if (stats) {
    return stats.find((stat) => stat.idFirm === idMainFirm).count
  }

  return null;
}

const getClassForCompareBlock = (compareValue, typeShowValue) => {
  if (typeShowValue === TypeShowValue.PRICE && compareValue < 0) {
    return 'goods-table__compare-text goods-table__compare-text--minus';
  }

  if (typeShowValue === TypeShowValue.PRICE && compareValue > 0) {
    return 'goods-table__compare-text goods-table__compare-text--plus';
  }

  if (typeShowValue === TypeShowValue.COUNT && compareValue < 0) {
    return 'goods-table__compare-text goods-table__compare-text--plus';
  }

  if (typeShowValue === TypeShowValue.COUNT && compareValue > 0) {
    return 'goods-table__compare-text goods-table__compare-text--minus';
  }

  return 'goods-table__compare-text';
}

const getCompareValue = (value, mainValue, typeShowConditionValue) => {
  return typeShowConditionValue === TypeShowConditionValue.PERCENT
  ? (((value - mainValue) / mainValue) * 100).toFixed(2)
    : (value - mainValue).toFixed(2).toLocaleString();
}

export default MonitoringPage;
