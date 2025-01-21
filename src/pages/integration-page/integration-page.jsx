import React, { useState, useEffect, useRef } from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {
  fetchSettingsSyncBitrix,
  setSettingsSyncBitrix,
  checkSyncUrlXMLForBitrix,
  fetchReportsIntegrations,
  fetchStartSyncBitrix
} from '../../store/api-actions.js';
import {
  setCheckDataUrlXMLForBitrix,
  setIsShowNotifications
} from '../../store/app-data/app-data.js';
import {
  getCurrentUser,
  getSettingsSyncBitrix,
  getCheckDataSyncUrlXMLForBitrix,
  getStatusCheckSyncUrlXMLForBitrix,
  getStatusLoadSettingsSyncBitrix,
  getReportsIntegrations,
  getStatusLoadReportsIntegrations,
  getStatusSyncBitrixProducts,
  getIsShowNotifications
} from '../../store/app-data/selectors.js';

import Preloader from './../../components/preloader/preloader.jsx';
import * as dayjs from "dayjs";

import LastActionNotification from "../../components/last-action/last-action.jsx";
import {TypeLastActionBlock} from "../../const.js";

const ID_FIRM_FOR_SYNC = 1;
const INTERVAL_FETCH_DATA = 5000;

const IntegrationPage = () => {
  const dispatch = useDispatch();

  const currentUser = useSelector(getCurrentUser);
  const isCheckUrl = useSelector(getStatusCheckSyncUrlXMLForBitrix);
  const dataCheckUrl = useSelector(getCheckDataSyncUrlXMLForBitrix);
  const isLoadReportsIntegrations = useSelector(getStatusLoadReportsIntegrations);
  const isSyncProducts = useSelector(getStatusSyncBitrixProducts);
  const isShowNotifications = useSelector(getIsShowNotifications);

  useEffect(() => {
    dispatch(fetchSettingsSyncBitrix({
      idUser: currentUser.id,
      idFirm: ID_FIRM_FOR_SYNC
    }));
  }, []);

  useEffect(() => {
    dispatch(fetchReportsIntegrations());

    const interval = setInterval(() => {
      dispatch(fetchReportsIntegrations());
    }, INTERVAL_FETCH_DATA);

    return () => clearInterval(interval);
  }, []);

  const settingsSyncBitrix = useSelector(getSettingsSyncBitrix);
  const {
    id,
    idUser,
    idFirm,
    url,
    typePeriod,
    time,
    isDeleteProducts,
    isActive
  } = settingsSyncBitrix;
  const isSaveSettings = useSelector(getStatusLoadSettingsSyncBitrix);
  const reportsIntegrations = useSelector(getReportsIntegrations);
  console.log(reportsIntegrations);

  const [isErrorInputLink, setIsErrorInputLink] = useState(false);

  const inputLinkRef = useRef();
  const selectPeriodRef = useRef();
  const selectTimeRef = useRef();
  const checkboxDeleteProductsRef = useRef();

  const styleCheckButton = {
    backgroundColor: '#6ace34'
  }

  return (
    <>
      <section className="page-content page__content">
        <header className="page-content__header standart-block">
          <h1 className="header header--1">Настройки</h1>

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

        <section className="integration">
          <div className="integration__block standart-block">
            <h2 className="header header--2 integration__header">Интеграции</h2>

            <div className="integration__section-block">
              <div className="integration__header-block">
                <h3 className="header header--3 integration__header-3">Настройка интеграции с Битрикс</h3>

                <ul className="toggle-data-list integration__toggle-list">
                  <li
                    className={
                      `toggle-data-list__item ${ !isActive ? 'toggle-data-list__item--active' : '' }`
                    }

                    onClick={() => {
                      dispatch(setSettingsSyncBitrix(
                        {
                          syncSettingsBitrix: {
                            id: id,
                            idUser: currentUser.id,
                            idFirm: ID_FIRM_FOR_SYNC,
                            url: url,
                            typePeriod: typePeriod,
                            time: time,
                            isDeleteProducts: isDeleteProducts,
                            isActive: false
                        }}
                      ));
                      setIsErrorInputLink(false);
                      dispatch(setCheckDataUrlXMLForBitrix({}));
                    }}
                  >
                    Выкл.
                  </li>
                  <li
                    className={
                      `toggle-data-list__item ${ isActive ? 'toggle-data-list__item--active' : ''}`
                    }

                    onClick={() => {
                      dispatch(setSettingsSyncBitrix(
                        {
                          syncSettingsBitrix: {
                            id: id,
                            idUser: currentUser.id,
                            idFirm: ID_FIRM_FOR_SYNC,
                            url: url,
                            typePeriod: typePeriod,
                            time: time,
                            isDeleteProducts: isDeleteProducts,
                            isActive: true
                          }}
                      ));
                    }}
                  >
                    Вкл.
                  </li>
                </ul>
                <button
                  // disabled={ isActive || url }
                  className={
                    `button integration__button integration__button--start ${ !url || !isActive ? 'button--disabled' : ''}`
                  }
                  onClick={() => {
                    console.log(currentUser.id, ID_FIRM_FOR_SYNC);
                    dispatch(fetchStartSyncBitrix({
                      idUser: currentUser.id,
                      idFirm: ID_FIRM_FOR_SYNC
                    }))
                  }}
                >
                  {
                    isSyncProducts &&
                    <Preloader
                      width={20}
                      height={20}
                    />
                  }

                  {
                    !isSyncProducts && (
                      <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
                        <path d="M16.3161 8.42418L2.95858 0.527313C1.87328 -0.113999 0.211182 0.50834 0.211182 2.09454V17.8845C0.211182 19.3075 1.75564 20.1651 2.95858 19.4517L16.3161 11.5586C17.5076 10.8566 17.5114 9.12621 16.3161 8.42418Z" fill="white"/>
                      </svg>
                    )
                  }
                </button>
              </div>

              {
                isActive && (
                  <ul className="setting-list">
                    <li className="setting-list__item">
                      <h4 className="header header--4 integration__header-4">
                        <b>Шаг 1. </b>Вставьте действующую ссылку на XML файл и нажмите кнопку «Проверить»
                      </h4>
                      <div className="form-block">
                        <input
                          ref={inputLinkRef}
                          className={
                            isErrorInputLink ?
                              "input input--line input--error integration__input"
                              : "input input--line integration__input"
                          }
                          name="bitrix-integration-link"
                          type="link"
                          defaultValue={url}
                          title="Ссылка на XML файл с товарами"
                          alt="Ссылка на XML файл с товарами"
                          placeholder="Например: https://example.com/file.xml"
                          onChange={() => {
                            setIsErrorInputLink(false);

                            dispatch(setCheckDataUrlXMLForBitrix({}));
                          }}
                        />
                        <button
                          disabled={isCheckUrl || dataCheckUrl.productsCount}
                          className="button button--form-line"
                          style={
                            dataCheckUrl.productsCount && styleCheckButton
                          }
                          onClick={async () => {
                            const url = inputLinkRef.current.value;

                            if (!url) {
                              setIsErrorInputLink(true);
                              return false;
                            }


                            await dispatch(checkSyncUrlXMLForBitrix(url));

                            setIsErrorInputLink(false);
                          }}
                        >
                          {
                            isCheckUrl ? <Preloader />
                              : !dataCheckUrl.productsCount || !url ? 'Проверить' : (
                                <svg width="26" height="20" viewBox="0 0 26 20" fill="none">
                                  <path d="M8.87532 19.0563L0.750317 10.9313C0.262183 10.4432 0.262183 9.65174 0.750317 9.16355L2.51804 7.39578C3.00618 6.9076 3.79768 6.9076 4.28582 7.39578L9.75921 12.8691L21.4826 1.14578C21.9707 0.657645 22.7622 0.657645 23.2504 1.14578L25.0181 2.91355C25.5062 3.40169 25.5062 4.19314 25.0181 4.68133L10.6431 19.0564C10.1549 19.5445 9.36345 19.5445 8.87532 19.0563Z" fill="#ffffff"/>
                                </svg>
                              )
                          }
                        </button>
                      </div>
                      {
                        isErrorInputLink &&
                        <div className="input-error-block">
                          Пожалуйста, введите ссылку на XML файл с товарами
                        </div>
                      }
                    </li>

                    <li className="setting-list__item">
                      <h4 className="header header--4 integration__header-4">
                        <b>Шаг 2. </b>Задайте расписание синхронизации товаров
                      </h4>
                      <div className="form-block">
                        <label
                          className="integration__label"
                          htmlFor="bitrix-integration-period"
                        >
                          Повторяемость
                          <select
                            ref={selectPeriodRef}
                            className="input input--select"
                            id="bitrix-integration-period"
                            name="bitrix-integration-period"
                          >
                            <option value="EVERY_DAY">Каждый день</option>
                          </select>
                        </label>

                        <label
                          className="integration__label"
                          htmlFor="bitrix-integration-period"
                        >
                          Время повтора
                          <select
                            ref={selectTimeRef}
                            className="input input--select"
                            id="bitrix-integration-period"
                            name="bitrix-integration-period"
                          >
                            {generateOptionForHourDay()}
                          </select>
                        </label>
                      </div>

                    </li>

                    <li className="setting-list__item">
                      <h4 className="header header--4 integration__header-4">
                        <b>Шаг 3. </b>Укажите параметры синхронизации
                      </h4>
                      <div className="form-block form-block--radio">
                        <div className="form-block__radio-block">
                          <input
                            ref={checkboxDeleteProductsRef}
                            className="input input--radio"
                            id="bitrix-integration-parameter-delete"
                            name="bitrix-integration-parameter-delete"
                            type="checkbox"
                          />
                        </div>

                        <label
                          className="label label--radio"
                          htmlFor="bitrix-integration-parameter-delete"
                        >
                          Удалять существующие товары, которых нет в выгрузке
                        </label>
                      </div>
                    </li>

                    <li className="setting-list__item">
                      <h4 className="header header--4 integration__header-4">
                        <b>Шаг 4. </b>Осуществите синхронизацию с новыми настройками
                      </h4>

                      <div className="integration__buttons-block">
                        <button
                          className="button integration__button"
                          onClick={async () => {
                            const url = inputLinkRef.current.value;
                            const typePeriod = selectPeriodRef.current.value;
                            const time = selectTimeRef.current.value;
                            const isDeleteProducts = checkboxDeleteProductsRef.current.checked;

                            if (!dataCheckUrl.productsCount) {
                              setIsErrorInputLink(true);
                              return false;
                            }

                            setIsErrorInputLink(false);

                            await dispatch(setSettingsSyncBitrix({
                              syncSettingsBitrix: {
                                id: id,
                                idUser: currentUser.id,
                                idFirm: ID_FIRM_FOR_SYNC,
                                url: url,
                                typePeriod: typePeriod,
                                time: time,
                                isDeleteProducts: isDeleteProducts,
                                isActive: true
                              }
                            }));
                          }}
                        >
                          {
                            isSaveSettings
                            ? <Preloader /> : 'Сохранить настройки'
                          }
                        </button>
                      </div>

                      {
                        url &&
                        <div className="notification notification--success">
                          Синхронизация выполнена и успешно работает с заданными настройками расписания
                        </div>
                      }

                    </li>
                  </ul>
                )
              }
            </div>
          </div>

          <div className="integration__block standart-block">
            <h2 className="header header--2 header--space-bottom">Логи</h2>
            {
              isLoadReportsIntegrations ? <Preloader color='#000000' /> : (
                <aside className="last-action last-action--integrations">
                  <div className="last-action__block">
                    {
                      reportsIntegrations.map((report) => {
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
                                        {
                                          report.type === 'IN_PROGRESS' && <Preloader width={15} height={15} color="#000000"/>
                                        }

                                        {
                                          report.type !== 'IN_PROGRESS' && (
                                            dayjs(report.updatedAt).format('HH:mm')
                                          )
                                        }
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
              )
            }
          </div>
        </section>
      </section>
    </>
  );
}

const generateOptionForHourDay = () => {
  const hours = 24;
  const options = []

  for (let i = 1; i < hours; i++) {
    options.push(<option key={i} value={`${i >= 0 && i <= 9 ? `0${i}` : i}:00:00`}>
      {`${i >= 0 && i <= 9 ? `0${i}` : i}:00`}
    </option>);
  }

  return options;
}

export default IntegrationPage;
