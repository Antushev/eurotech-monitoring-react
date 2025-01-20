import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import * as dayjs from 'dayjs';

import {
  AppRoute,
  TypeShowValue,
  TypeShowConditionValue
} from '../../const.js';
import {
  setCurrentProduct,
  setTypeShowValue
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
  getReports,
  getTypeShowValue,
  getTypeShowConditionValue,
  getStatusLoadProducts
} from '../../store/app-data/selectors.js';

import PopupAddGroup from '../../components/popup-add-group/popup-add-group.jsx';
import PopupAddProduct from '../../components/popup-add-product/popup-add-product.jsx';
import PopupEditProduct from '../../components/popup-edit-product/popup-edit-product.jsx';
import PopupSelectConsumers from '../../components/popup-select-consumers/popup-select-consumers.jsx';
import PopupAddLink from '../../components/popup-add-link/popup-add-link.jsx';
import PopupEditLink from '../../components/popup-edit-link/popup-edit-link.jsx';
import DialogWindowProduct from '../../components/dialog-window-product/dialog-window-product.jsx';
import DialogWindowEditLink from '../../components/dialog-window-edit-link/dialog-window-edit-link.jsx';
import Preloader from '../../components/preloader/preloader.jsx';

const SET_INTERVAL_FETCH_DATA = 15000;
const WIDTH_PRELOADER = 15;
const HEIGHT_PRELOADER = 15;
const COLOR_PRELOADER = '#000000';
const WIDTH_PRELOADER_GROUP = 25;
const HEIGHT_PRELOADER_GROUP = 25;
const COLOR_PRELOADER_GROUP = '#000000';

const MonitoringPage = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(getCurrentUser);
  const currentProduct = useSelector(getCurrentProduct);
  const typeShowValue = useSelector(getTypeShowValue);
  const typeShowConditionValue = useSelector(getTypeShowConditionValue);
  const isLoadProducts = useSelector(getStatusLoadProducts);

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

  const firms = useSelector(getAllFirms);
  const mainFirm = getMainFirm(firms);
  const products = useSelector(getAllProducts);
  const reports = useSelector(getReports);

  const dateFormat = dayjs().format('YYYY-MM-DD')
  const dateRef = useRef(dateFormat);

  const [date, setDate] = useState(dateFormat);
  const [isOpenPopupAddGroup, setIsOpenPopupAddGroup] = useState(false);
  const [isOpenPopupAddProduct, setIsOpenPopupAddProduct] = useState(false);
  const [isOpenPopupEditProduct, setIsOpenPopupEditProduct] = useState(false);
  const [isOpenPopupSelectConsumers, setIsOpenPopupSelectConsumers] = useState(false);
  const [isOpenPopupAddLink, setIsOpenPopupAddLink] = useState(false);
  const [isOpenPopupEditLink, setIsOpenPopupEditLink] = useState(false);
  const [selectProductAddLink, setSelectProductAddLink] = useState(null);
  const [selectFirmAddLink, setSelectFirmAddLink] = useState(null);
  const [selectProductForDialog, setSelectProductForDialog] = useState({});
  const [selectLinkForDialog, setSelectLinkForDialog] = useState({});
  const [idLoadGroup, setIdLoadGroup] = useState(null);

  return (
    <>
      <section className="page-content page__content">
        <DialogWindowProduct />
        {/*<section className="page-content__alert standart-block">Внимание! Данный раздел находится в разработке. Интерфейс не взаимодействует с базой данных.</section>*/}
        <header className="page-content__header page-content__header--monitoring standart-block">
          <h1 className="header header--1">Мониторинг</h1>

          <div className="page-content__header-block">
            <ul className="toggle-data-list toggle-data-list--margin-right">
              <li
                className={`toggle-data-list__item ${
                  typeShowValue === TypeShowValue.PRICE && 'toggle-data-list__item--active'
                }`
                }
                onClick={() => {
                  dispatch(setTypeShowValue(TypeShowValue.PRICE))
                }}
              >
                Цены
              </li>
              <li
                className={`toggle-data-list__item ${
                  typeShowValue === TypeShowValue.COUNT && 'toggle-data-list__item--active'
                }`
                }
                onClick={() => {
                  dispatch(setTypeShowValue(TypeShowValue.COUNT));
                }}
              >
                Остатки
              </li>
            </ul>

            <div className="date-select">
              <input
                ref={dateRef}
                className="date-select__input"
                name="date-select"
                type="date"
                defaultValue={dateFormat}
                alt="Дата до"
                onChange={async (evt) => {
                  setDate(dateRef.current.value);

                  await dispatch(fetchProductsWithSummaryDetail({
                    idUser: currentUser.id,
                    idParent: currentProduct !== null ? currentProduct.id : null,
                    withStats: 'summary',
                    dateStart: dayjs(evt.target.value).startOf('day'),
                    dateEnd: dayjs(evt.target.value).endOf('day')
                  }));
                }}
              />
            </div>
          </div>

        </header>
        <div className="page-content__inner page-content__inner--main">
          <div className="monitoring-block-left">
            <section className="goods-block standart-block">
              <div className="goods-block__header">
                <h2 className="header header--2">
                  Таблица {typeShowValue === TypeShowValue.PRICE ? 'цен' : 'остатков'} на {dayjs(date).format('DD.MM.YYYY')}
                </h2>
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
                              {firm.name}
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
                  currentProduct !== null &&
                    <tr className="goods-table__tr">
                      <td
                        className="goods-table__td"
                        onClick={async () => {
                          await dispatch(fetchProductsWithSummaryDetail({
                            idUser: currentUser.id,
                            idParent: currentProduct.idParent,
                            withStats: 'summary',
                            dateStart: dayjs(date).startOf('day'),
                            dateEnd: dayjs(date).endOf('day')
                          }));

                          await dispatch(fetchCurrentProductById(currentProduct.idParent));
                        }}
                      >
                        <svg className="goods-table__icon" width="26" height="18" viewBox="0 0 26 18" fill="none">
                          <path d="M25.8508 10.6919L22.5816 16.5116C22.3272 16.9645 21.963 17.3403 21.5251 17.6014C21.0873 17.8626 20.5912 18 20.0863 18H2.03238C1.19627 18 0.675323 17.0581 1.0966 16.3081L4.36574 10.4884C4.62016 10.0355 4.98443 9.65971 5.42227 9.39857C5.8601 9.13742 6.3562 9 6.86111 9H24.915C25.7512 9 26.2721 9.94186 25.8508 10.6919ZM6.86111 7.5H21.6667V5.25C21.6667 4.00734 20.6966 3 19.5 3H12.2778L9.38889 0H2.16667C0.970035 0 0 1.00734 0 2.25V15.2834L3.11806 9.73256C3.8916 8.35547 5.32589 7.5 6.86111 7.5Z" fill="black"/>
                        </svg>

                        <span className="goods-table__text">{currentProduct.name}</span>
                      </td>
                    </tr>
                }
                  {
                    products.length === 0
                    ? <tr>
                        <td>
                          <p>В данной группе нет товаров</p>
                        </td>
                    </tr> :
                    products.map((product, index) => {
                      if (product.isGroup) {
                        return (
                          <tr
                            key={index}
                            className="goods-table__tr"
                            onClick={async () => {
                              setIdLoadGroup(product.id);

                              await dispatch(fetchProductsWithSummaryDetail({
                                idUser: currentUser.id,
                                idParent: product.id,
                                withStats: 'summary',
                                dateStart: dayjs(date).startOf('day'),
                                dateEnd: dayjs(date).endOf('day')
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
                              <span className="goods-table__text">{product.name}</span>

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
                              {product.name}
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
                                          typeShowValue === TypeShowValue.PRICE ? stat.price.toLocaleString() : stat.count.toLocaleString()
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

          <div className="monitoring-block-right">
            <aside className="last-action standart-block">
              <h2 className="header header--2 header--space-bottom">Последние события</h2>

              <div className="last-action__block">
                {
                  reports.map((report) => {
                    return (
                      <>
                        <div className="last-action__date">
                          {dayjs(report.day).format('DD.MM.YYYY')}
                        </div>

                        <ul className="last-action__list">
                          {
                            report.times.map((report) => {
                              return (
                                <li className="last-action__item">
                                  <div className="last-action__item-text">
                                    {report.text}
                                  </div>
                                  <div className="last-action__item-time">
                                    {dayjs(report.createdAt).format('HH:mm')}
                                  </div>
                                </li>
                              );
                            })
                          }
                        </ul>
                      </>
                    )
                  })
                }
              </div>
            </aside>
          </div>

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
