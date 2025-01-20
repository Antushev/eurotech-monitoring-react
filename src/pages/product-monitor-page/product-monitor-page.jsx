import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import {
  AppRoute,
  LocalStorageKey,
  TypeShowValue,
  Period
} from '../../const.js'

import {
  fetchFirmsByIdUser,
  fetchProductWithDetailStats,
  fetchTriggersForProduct,
  updateTrigger
} from '../../store/api-actions.js';
import {
  setPeriod,
  setTypeShowValue
} from "../../store/app-data/app-data";
import {
  getCurrentUser,
  getAllFirms,
  getStatusLoadProduct,
  getProductWithDetailStats,
  getTriggersForProduct,
  getPeriod,
  getTypeShowValue,
  getStatusLoadTriggersForProduct
} from '../../store/app-data/selectors.js';

import FirmsSummaryStats from '../../components/firms-summary-stats/firms-summary-stats.jsx';
import Preloader from '../../components/preloader/preloader.jsx';

import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  ReferenceLine,
  Label,
  Brush
} from 'recharts';

const ProductMonitorPage = () => {
  const dispatch = useDispatch();

  const { idProduct } = useParams();

  const isLoadProduct = useSelector(getStatusLoadProduct);
  const isLoadTriggersForProduct = useSelector(getStatusLoadTriggersForProduct);
  const currentUser = useSelector(getCurrentUser);
  const typeShowValue = useSelector(getTypeShowValue);
  const period = useSelector(getPeriod);
  const { id: idUser } = currentUser;

  const dateStartLoad = dayjs().add(-7, 'day');
  const dateEndLoad = dayjs().endOf('day');
  const [dateStart, setDateStart] = useState(dateStartLoad);
  const [dateEnd, setDateEnd] = useState(dateEndLoad);

  const product = useSelector(getProductWithDetailStats);
  const firms = useSelector(getAllFirms);
  const { triggers, reports: reportsTriggers } = useSelector(getTriggersForProduct);

  const [triggersActiveGraph, setTriggersActiveGraph] = useState([]);

  const statsFirms = getStatsAboutFirms(product.stats, firms);
  const datesStatsFirmsSet = statsFirms ? getDateStatsFirms(statsFirms) : [];
  const dataGraph = datesStatsFirmsSet ? getStatsForGraph(datesStatsFirmsSet, statsFirms, firms, typeShowValue, period) : [];

  const minValuesStats = getMinValuesStatsFirms(statsFirms, firms, typeShowValue);
  const mainFirmMinValue = minValuesStats ? minValuesStats[0] : {};
  const averageValuesStats = getAverageValuesStatsFirms(statsFirms, firms, typeShowValue);
  const mainFirmAverageValue = averageValuesStats ? averageValuesStats[0] : {};
  const maxValuesStats = getMaxValuesStatsFirms(statsFirms, firms, typeShowValue);
  const mainFirmMaxValue = maxValuesStats ? maxValuesStats[0]: {};

  useEffect(() => {
    dispatch(fetchFirmsByIdUser(idUser));
    dispatch(fetchProductWithDetailStats({
      idUser: idUser,
      idProduct: idProduct,
      period: period,
      dateStart: dateStart,
      dateEnd: dateEnd
    }));
  }, []);

  useEffect(() => {
    if (!isLoadProduct) {
      dispatch(fetchTriggersForProduct({ idUser: currentUser.id, idProduct: Number(idProduct) }));
    }
  }, []);

  if (product.stats?.length === 0) {
    return (
      <>
        <section className="page-content page__content">
          <header className="page-content__header standart-block">
            <div className="">
              <h1 className="header header--1">
                {

                }
              </h1>
            </div>
          </header>

          <div className="product-monitor page-content__inner">
            <div className="standart-block">
              <h2 className="header header--2">Недостаточно данных</h2>

              <p>Пожалуйста, привяжите хотя бы одну ссылку к товару.</p>
            </div>
          </div>
        </section>
      </>
    )
  }

  return (
    <>
      <section className="page-content page__content">
        <header className="page-content__header standart-block">
          <div className="">
            <h1 className="header header--1">{truncate(product.name)}</h1>
          </div>

          <div className="date-select">
            <input
              className="date-select__input date-select__from"
              name="date-from"
              type="date"
              defaultValue={dayjs(dateStart).format('YYYY-MM-DD')}
              alt="Дата от"
              onChange={(evt) => {
                setDateStart(dayjs(evt.target.value).startOf('day'));

                dispatch(fetchProductWithDetailStats({
                  idUser: idUser,
                  idProduct: idProduct,
                  period: period,
                  dateStart: dayjs(evt.target.value).startOf('day'),
                  dateEnd: dateEnd
                }));
              }}
            />
            <span> - </span>
            <input
              className="date-select__input date-select__to"
              name="date-select"
              type="date"
              defaultValue={dateEnd.format('YYYY-MM-DD')}
              alt="Дата до"
              onChange={(evt) => {
                setDateEnd(dayjs(evt.target.value).endOf('day'));

                dispatch(fetchProductWithDetailStats({
                  idUser: idUser,
                  idProduct: idProduct,
                  period: period,
                  dateStart: dateStart,
                  dateEnd: dayjs(evt.target.value).endOf('day')
                }));
              }}
            />
          </div>
        </header>

        <div className="product-monitor page-content__inner">
          <div className="product-monitor__dynamic standart-block">
            <header className="product-monitor__header">
              <div className="product-monitor__header-block--main">
                <h2 className="header header--2 product-monitor__header-2">
                  Динамика изменения {typeShowValue === TypeShowValue.PRICE ? ' цен ' : ' наличия '} с {dayjs(dateStart).format('DD.MM.YYYY')} по {dayjs(dateEnd).format('DD.MM.YYYY')}
                </h2>

                <ul className="detalisation-list">
                  <li
                    className={`detalisation-list__item ${period === Period.POINTS && 'detalisation-list__item--active'}`}
                    onClick={() => {
                      dispatch(setPeriod(Period.POINTS));
                      localStorage.setItem(LocalStorageKey.PERIOD, Period.POINTS);
                      dispatch(fetchProductWithDetailStats({
                        idUser: idUser,
                        idProduct: idProduct,
                        period: Period.POINTS,
                        dateStart: dateStart,
                        dateEnd: dateEnd
                      }));
                    }}
                  >
                    по точкам выгрузки
                  </li>
                  <li
                    className={`detalisation-list__item ${period === Period.DAY && 'detalisation-list__item--active'}`}
                    onClick={() => {
                      dispatch(setPeriod(Period.DAY));
                      localStorage.setItem(LocalStorageKey.PERIOD, Period.DAY);
                      dispatch(fetchProductWithDetailStats({
                        idUser: idUser,
                        idProduct: idProduct,
                        period: Period.DAY,
                        dateStart: dateStart,
                        dateEnd: dateEnd
                      }));
                    }}
                  >
                    по дням
                  </li>
                  <li
                    className={`detalisation-list__item ${period === Period.WEEK && 'detalisation-list__item--active'}`}
                    onClick={() => {
                      dispatch(setPeriod(Period.WEEK));
                      localStorage.setItem(LocalStorageKey.PERIOD, Period.WEEK);
                      dispatch(fetchProductWithDetailStats({
                        idUser: idUser,
                        idProduct: idProduct,
                        period: Period.WEEK,
                        dateStart: dateStart,
                        dateEnd: dateEnd
                      }));
                    }}
                  >
                    по неделям
                  </li>
                  <li
                    className={`detalisation-list__item ${period === Period.MONTH && 'detalisation-list__item--active'}`}
                    onClick={() => {
                      dispatch(setPeriod(Period.MONTH));
                      localStorage.setItem(LocalStorageKey.PERIOD, Period.MONTH);
                      dispatch(fetchProductWithDetailStats({
                        idUser: idUser,
                        idProduct: idProduct,
                        period: Period.MONTH,
                        dateStart: dateStart,
                        dateEnd: dateEnd
                      }));
                    }}
                  >
                    по месяцам
                  </li>
                </ul>
              </div>


              <div className="product-monitor__settings">
                <ul className="toggle-data-list product-monitor__toggle-data-list">
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

                {/*<button className="button product-monitor__triggers-button">Триггеры</button>*/}

                {/*<button className="button button--no-background">*/}
                {/*  <svg className="buttons-list__icon" width="26" height="26" viewBox="0 0 26 26" fill="none">*/}
                {/*    <path d="M24.7133 16.1242L22.4674 14.8347C22.6941 13.6185 22.6941 12.371 22.4674 11.1548L24.7133 9.86533C24.9717 9.71856 25.0877 9.41453 25.0033 9.13147C24.4181 7.26534 23.4217 5.57745 22.1195 4.17261C21.9191 3.9577 21.5922 3.90528 21.3392 4.05205L19.0933 5.34156C18.1496 4.53431 17.0635 3.91052 15.8878 3.50165V0.927868C15.8878 0.634321 15.6822 0.377467 15.3922 0.314564C13.4574 -0.115273 11.4751 -0.0943054 9.6351 0.314564C9.34514 0.377467 9.13952 0.634321 9.13952 0.927868V3.50689C7.96912 3.921 6.88306 4.54479 5.93408 5.3468L3.69343 4.05729C3.4351 3.91052 3.1135 3.9577 2.91316 4.17786C1.61095 5.57745 0.614523 7.26534 0.0293192 9.13671C-0.0603066 9.41977 0.0609519 9.7238 0.319285 9.87058L2.5652 11.1601C2.3385 12.3762 2.3385 13.6238 2.5652 14.8399L0.319285 16.1294C0.0609519 16.2762 -0.0550345 16.5802 0.0293192 16.8633C0.614523 18.7294 1.61095 20.4173 2.91316 21.8221C3.1135 22.0371 3.44037 22.0895 3.69343 21.9427L5.93935 20.6532C6.88306 21.4605 7.96912 22.0842 9.1448 22.4931V25.0721C9.1448 25.3657 9.35041 25.6225 9.64037 25.6854C11.5752 26.1153 13.5576 26.0943 15.3975 25.6854C15.6875 25.6225 15.8931 25.3657 15.8931 25.0721V22.4931C17.0635 22.079 18.1496 21.4552 19.0985 20.6532L21.3445 21.9427C21.6028 22.0895 21.9244 22.0423 22.1247 21.8221C23.4269 20.4226 24.4234 18.7347 25.0086 16.8633C25.0877 16.575 24.9717 16.271 24.7133 16.1242ZM12.5137 17.1883C10.1887 17.1883 8.29599 15.3064 8.29599 12.9948C8.29599 10.6831 10.1887 8.80123 12.5137 8.80123C14.8387 8.80123 16.7314 10.6831 16.7314 12.9948C16.7314 15.3064 14.8387 17.1883 12.5137 17.1883Z" fill="#BE1622"/>*/}
                {/*  </svg>*/}
                {/*</button>*/}
              </div>
            </header>

            {
              isLoadProduct ? <Preloader /> :
                <div className="product-monitor__graph-block">
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <LineChart
                      data={dataGraph}
                      margin={{
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 5
                      }}
                    >
                      <CartesianGrid
                        strokeDasharray="8 3"
                      />
                      <XAxis
                        yAxisId={0}
                        dataKey="name"
                        padding={{left: 1, right: 50}}
                      />
                      <YAxis
                      />
                      <Tooltip />
                      <Legend />
                      {
                        firms.map((firm) => {
                          if (firm.isSelect) {
                            return (
                              <Line
                                connectNulls
                                unit={
                                  typeShowValue === TypeShowValue.PRICE ? ' руб.' : ' шт.'
                                }
                                type="monotone"
                                dataKey={getFirmName(firm.id, firms)}
                                stroke={getFirmColor(firm.id, firms)}
                                strokeWidth={2}
                                activeDot={{r: 8}}
                              />
                            );
                          }
                        })
                      }

                      {
                        triggers?.map((trigger) => {
                          if (trigger?.compareType === 'VALUE' && triggersActiveGraph?.includes(trigger.id)) {
                            return (
                              <ReferenceLine
                                y={ trigger.compareValue }
                                yAxisId={0}
                                strokeWidth={1}
                                stroke={getFirmColor(trigger.firms[0], firms)}
                                strokeDasharray="15 4"
                              >
                                <Label
                                  value={`Триггер: ${trigger.name}`}
                                  position="insideBottomLeft"
                                />
                              </ReferenceLine>
                            );
                          }
                        })
                      }
                    </LineChart>
                  </ResponsiveContainer>
                </div>
            }
          </div>

          <div className="product-monitor__triggers-block">
            <div className="product-monitor__triggers standart-block">
              <div className="product-monitor__header-block">
                <h3 className="header header--3">Список триггеров</h3>

                <Link to={ `${AppRoute.TriggerAdd}?idProductDefault=${idProduct}&nameProductDefault=${product?.name}&redirectUrl=/monitoring/${product.id}` } className="button">
                  <svg className="product-monitor__icon" width="19" height="18" viewBox="0 0 19 18">
                    <path d="M16.7991 7.04309H11.0217V1.28056C11.0217 0.573451 10.4467 0 9.73779 0H8.45391C7.74497 0 7.17004 0.573451 7.17004 1.28056V7.04309H1.3926C0.683662 7.04309 0.108727 7.61654 0.108727 8.32365V9.60421C0.108727 10.3113 0.683662 10.8848 1.3926 10.8848H7.17004V16.6473C7.17004 17.3544 7.74497 17.9279 8.45391 17.9279H9.73779C10.4467 17.9279 11.0217 17.3544 11.0217 16.6473V10.8848H16.7991C17.508 10.8848 18.083 10.3113 18.083 9.60421V8.32365C18.083 7.61654 17.508 7.04309 16.7991 7.04309Z" fill="white"/>
                  </svg>

                  <svg width="25" height="23" viewBox="0 0 25 23">
                    <path d="M25 10.4167C25 9.39106 24.4379 8.50521 23.6111 8.02431V1.38932C23.6111 1.00955 23.3082 0 22.2222 0C21.9132 0 21.6063 0.103299 21.355 0.304688L17.6645 3.25738C15.8108 4.73915 13.4835 5.55556 11.1111 5.55556H2.77778C1.24349 5.55556 0 6.79905 0 8.33333V12.5C0 14.0343 1.24349 15.2778 2.77778 15.2778H4.24045C4.18012 15.7326 4.14583 16.1953 4.14583 16.6667C4.14583 18.3928 4.54774 20.0239 5.25521 21.4818C5.48047 21.9457 5.97222 22.2222 6.48785 22.2222H9.71181C10.8424 22.2222 11.5213 20.9271 10.8359 20.0278C10.1241 19.0938 9.70095 17.9288 9.70095 16.6667C9.70095 16.1845 9.77127 15.7209 9.89236 15.2778H11.1111C13.4835 15.2778 15.8108 16.0942 17.6641 17.576L21.3546 20.5286C21.6007 20.7256 21.9065 20.8331 22.2218 20.8333C23.3034 20.8333 23.6107 19.8446 23.6107 19.4444V12.8095C24.4379 12.3281 25 11.4423 25 10.4167ZM20.8333 16.5547L19.3989 15.4071C17.0551 13.5321 14.1111 12.5 11.1111 12.5V8.33333C14.1111 8.33333 17.0551 7.30121 19.3989 5.42621L20.8333 4.27865V16.5547Z" fill="#ffffff"/>
                  </svg>
                </Link>
              </div>
              {
                isLoadTriggersForProduct && <Preloader color='#000000'/>
              }

              {
                triggers && triggers?.length !== 0 &&
                <table className="product-monitor__table">
                  <thead>
                  <tr className="product-monitor__table-tr">
                    <th className="product-monitor__table-th">
                      ID
                    </th>
                    <th className="product-monitor__table-th product-monitor__table-th--name">
                      Название
                    </th>
                    <th className="product-monitor__table-th">
                      График
                    </th>
                    <th className="product-monitor__table-th">
                      Активность
                    </th>
                  </tr>
                  </thead>

                  <tbody>
                    {
                      triggers.map((trigger) => {
                        return (
                          <tr className="product-monitor__table-tr">
                            <td className="product-monitor__table-td">
                              {trigger.id}
                            </td>
                            <td className="product-monitor__table-td product-monitor__table-td--name">
                              <Link className="product-monitor__table-link" to={`/trigger/${trigger.id}/edit`}>
                                { trigger.name }
                              </Link>
                            </td>
                            <td className="product-monitor__table-td">
                              {
                                trigger.compareType === 'VALUE' ?
                                <input
                                  type="checkbox"
                                  checked={triggersActiveGraph.includes(trigger.id)}
                                  onChange={(evt) => {
                                    if (evt.target.checked) {
                                      const triggersActiveGraphNew = [...triggersActiveGraph, trigger.id];
                                      setTriggersActiveGraph(triggersActiveGraphNew);
                                    } else {
                                      const triggersActiveGraphNew = triggersActiveGraph.filter((triggerActive) => {
                                        return triggerActive !== trigger.id
                                      });
                                      setTriggersActiveGraph(triggersActiveGraphNew);
                                    }
                                  }}
                                />
                                  : <input type="checkbox" disabled={true} />
                              }
                            </td>
                            <td
                              className="product-monitor__table-td"
                              onClick={() => {
                                dispatch(updateTrigger({...trigger, isActive: !trigger.isActive}))
                              }}
                            >
                              {
                                trigger.isActive ?
                                  <svg  className="icon" width="40" height="27" viewBox="0 0 40 27">
                                    <path d="M26.6667 0H13.3333C5.97222 0 0 6.04688 0 13.5C0 20.9531 5.97222 27 13.3333 27H26.6667C34.0278 27 40 20.9531 40 13.5C40 6.04688 34.0278 0 26.6667 0ZM26.6667 22.5C21.75 22.5 17.7778 18.4711 17.7778 13.5C17.7778 8.52187 21.7569 4.5 26.6667 4.5C31.5833 4.5 35.5556 8.52891 35.5556 13.5C35.5556 18.4781 31.5764 22.5 26.6667 22.5Z" fill="#BE1622"/>
                                  </svg>
                                  :
                                  <svg className="icon" width="40" height="27">
                                    <path d="M26.6667 0H13.3333C5.96951 0 0 5.96951 0 13.3333C0 20.6972 5.96951 26.6667 13.3333 26.6667H26.6667C34.0305 26.6667 40 20.6972 40 13.3333C40 5.96951 34.0305 0 26.6667 0ZM4.44444 13.3333C4.44444 8.42076 8.42007 4.44444 13.3333 4.44444C18.2459 4.44444 22.2222 8.42007 22.2222 13.3333C22.2222 18.2459 18.2466 22.2222 13.3333 22.2222C8.42076 22.2222 4.44444 18.2466 4.44444 13.3333ZM26.6667 22.2222H23.2705C27.7994 17.1626 27.8008 9.50556 23.2705 4.44444H26.6667C31.5792 4.44444 35.5556 8.42007 35.5556 13.3333C35.5556 18.2458 31.5799 22.2222 26.6667 22.2222Z" fill="#BE1622"/>
                                  </svg>

                              }
                            </td>
                          </tr>
                        );
                      })
                    }
                  </tbody>
                </table>
              }

              {
                !triggers || triggers.length === 0 && 'У данного товара нет триггеров'
              }

            </div>

            <div className="product-monitor__reports-triggers standart-block">
              <div className="product-monitor__header-block">
                <h3 className="header header--3">История срабатываний триггеров</h3>

                {/*<svg className="icon" width="22" height="22" viewBox="0 0 22 22">*/}
                {/*  <path d="M20.9677 0H1.03245C0.116441 0 -0.345774 1.11143 0.303269 1.76047L8.24999 9.7084V18.5625C8.24999 18.899 8.41418 19.2143 8.68986 19.4073L12.1274 21.8127C12.8055 22.2875 13.75 21.8063 13.75 20.9679V9.7084L21.6969 1.76047C22.3446 1.11272 21.8856 0 20.9677 0Z" fill="#BE1622"/>*/}
                {/*</svg>*/}
              </div>

              {
                isLoadTriggersForProduct && <Preloader color='#000000' />
              }

              {
                reportsTriggers && reportsTriggers?.length !== 0 &&
                <table className="product-monitor__table">
                  <thead>
                  <tr className="product-monitor__table-tr">
                    <th className="product-monitor__table-th product-monitor__table-th--name">
                      Название триггера
                    </th>
                    <th className="product-monitor__table-th">
                      Дата и время
                    </th>
                    <th className="product-monitor__table-th">
                      Действие
                    </th>
                  </tr>
                  </thead>

                  <tbody>
                  {
                    reportsTriggers.map((report) => {
                      return (
                        <tr className="product-monitor__table-tr">
                          <td className="product-monitor__table-td product-monitor__table-td--name">
                            {report.name}
                          </td>
                          <td className="product-monitor__table-td">
                            { dayjs(report.createdAt).format('DD.MM.YYYY HH:mm') }
                          </td>
                          <td className="product-monitor__table-td">
                            {
                              report.isActionSendEmail &&
                              <svg width="25" height="25" viewBox="0 0 25 25">
                                <path d="M12.1094 0C5.41704 0 0 5.41597 0 12.1094C0 18.8017 5.41597 24.2188 12.1094 24.2188C14.4606 24.2188 16.7647 23.5283 18.7211 22.2547C19.3073 21.8731 19.4352 21.0688 18.9922 20.5276L18.4953 19.9205C18.1207 19.4629 17.4611 19.3508 16.9634 19.6701C15.5234 20.5936 13.8337 21.0938 12.1094 21.0938C7.15537 21.0938 3.125 17.0634 3.125 12.1094C3.125 7.15537 7.15537 3.125 12.1094 3.125C16.999 3.125 21.0938 5.93843 21.0938 10.9375C21.0938 12.8313 20.0638 14.8312 18.2534 15.0241C17.4063 15.0019 17.4277 14.3963 17.5954 13.5581L18.7396 7.64448C18.8795 6.92139 18.3256 6.25 17.5891 6.25H15.3928C15.2306 6.25 15.0741 6.30969 14.9531 6.4177C14.8322 6.5257 14.7552 6.67446 14.7369 6.8356L14.7364 6.84009C14.0188 5.96602 12.7614 5.77686 11.8082 5.77686C8.16655 5.77686 5.07812 8.81562 5.07812 13.1724C5.07812 16.361 6.87427 18.3418 9.76562 18.3418C11.0832 18.3418 12.5668 17.5783 13.4273 16.4701C13.8922 18.1353 15.4104 18.1353 16.8799 18.1353C22.1977 18.1353 24.2188 14.6386 24.2188 10.9375C24.2188 4.27993 18.8488 0 12.1094 0ZM11.0508 14.8647C9.96441 14.8647 9.28955 14.1019 9.28955 12.874C9.28955 10.6771 10.7924 9.32275 12.1523 9.32275C13.2408 9.32275 13.8907 10.0669 13.8907 11.3135C13.8907 13.5137 12.2366 14.8647 11.0508 14.8647Z" fill="black"/>
                              </svg>
                            }

                          </td>
                        </tr>
                      )
                    })
                  }
                  </tbody>
                </table>
              }

              {
                !reportsTriggers || reportsTriggers.length === 0 && 'У данного товара отсутствует история срабатывания триггеров'
              }

            </div>
          </div>

          <FirmsSummaryStats
            minPrice={product.minAllPrice}
            averagePrice={product.averageAllPrice}
            maxPrice={product.maxAllPrice}
            minCount={product.minAllCount}
            averageCount={product.averageAllCount}
            maxCount={product.maxAllCount}
            typeShowValue={typeShowValue}
          />

          <div className="firms-summary-stat">
            <ul className="firms-summary-stats__list">
              <li className="standart-block firms-summary-stats__item">
                <h3 className="header header--3 header--center firms-summary-stats__header">
                  {
                    typeShowValue === TypeShowValue.PRICE ? 'минимальные цены' : 'минимальное количество'
                  }
                </h3>
                <div className="firms-summary-stats__stat">
                  <div className="firms-summary-stats__main-stat">
                    <div style={{backgroundColor: mainFirmMinValue?.color}} className="circle"/>
                    <div className="firms-summary-stats__main-numbers">
                      <div className="firms-summary-stats__main-number">
                        {
                          typeShowValue === TypeShowValue.PRICE && mainFirmMinValue && `${mainFirmMinValue?.minPrice?.toLocaleString()} руб.`
                        }

                        {
                          typeShowValue === TypeShowValue.COUNT && mainFirmMinValue && `${mainFirmMinValue?.minCount?.toLocaleString()} шт.`
                        }
                      </div>
                      <div className="firms-summary-stats__main-firm">
                        {
                          mainFirmMinValue?.name
                        }
                      </div>
                    </div>
                  </div>

                  <ul className="firms-summary-stats__list-other-stat">
                    {
                      minValuesStats?.map((stat) => {
                        if (stat.idFirm !== mainFirmMinValue.idFirm) {
                          const style= {
                            backgroundColor: stat.color
                          }

                          return (
                            <li key={stat.idFirm} className="firms-summary-stats__item-other-stat">
                              <span style={style} className="circle" />
                              <div  className="">
                                {
                                  typeShowValue === TypeShowValue.PRICE && `${stat?.minPrice?.toLocaleString()} руб.`
                                }

                                {
                                  typeShowValue === TypeShowValue.COUNT && `${stat?.minCount?.toLocaleString()} шт.`
                                }
                              </div>
                            </li>
                          )
                        }
                      })
                    }
                  </ul>
                </div>
              </li>

              <li className="standart-block firms-summary-stats__item">
                <h3 className="header header--3 header--center firms-summary-stats__header">
                  {
                    typeShowValue === TypeShowValue.PRICE ? 'средние цены' : 'среднее количество'
                  }
                </h3>
                <div className="firms-summary-stats__stat">
                  <div className="firms-summary-stats__main-stat">
                    <div style={{backgroundColor: mainFirmAverageValue?.color}} className="circle"/>
                    <div className="firms-summary-stats__main-numbers">
                      <div className="firms-summary-stats__main-number">
                        {
                          typeShowValue === TypeShowValue.PRICE && `${mainFirmAverageValue?.averagePrice?.toLocaleString()} руб.`
                        }
                        {
                          typeShowValue === TypeShowValue.COUNT && `${mainFirmAverageValue?.averageCount?.toLocaleString()} шт.`
                        }
                      </div>
                      <div className="firms-summary-stats__main-firm">
                        { mainFirmAverageValue?.name }
                      </div>
                    </div>
                  </div>

                  <ul className="firms-summary-stats__list-other-stat">
                    {
                      averageValuesStats?.map((stat) => {
                        if (stat.idFirm !== mainFirmAverageValue.idFirm) {
                          const style= {
                            backgroundColor: stat.color
                          }

                          return (
                            <li key={stat.idFirm} className="firms-summary-stats__item-other-stat">
                              <span style={style} className="circle" />
                              <div  className="">
                                {
                                  typeShowValue === TypeShowValue.PRICE && `${stat?.averagePrice?.toLocaleString()} руб.`
                                }

                                {
                                  typeShowValue === TypeShowValue.COUNT && `${stat?.averageCount?.toLocaleString()} шт.`
                                }
                              </div>
                            </li>
                          )
                        }
                      })
                    }
                  </ul>
                </div>
              </li>

              <li className="standart-block firms-summary-stats__item">
                <h3 className="header header--3 header--center firms-summary-stats__header">
                  {
                    typeShowValue === TypeShowValue.PRICE ? 'максимальные цены' : 'максимальное количество'
                  }
                </h3>
                <div className="firms-summary-stats__stat">
                  <div className="firms-summary-stats__main-stat">
                    <div style={{backgroundColor: mainFirmMaxValue?.color}} className="circle circle--blue"/>
                    <div className="firms-summary-stats__main-numbers">
                      <div className="firms-summary-stats__main-number">
                        {
                          typeShowValue === TypeShowValue.PRICE && `${mainFirmMaxValue?.maxPrice?.toLocaleString()} руб.`
                        }

                        {
                          typeShowValue === TypeShowValue.COUNT && `${mainFirmMaxValue?.maxCount?.toLocaleString()} шт.`
                        }
                      </div>
                      <div className="firms-summary-stats__main-firm">
                        {mainFirmMaxValue?.name}
                      </div>
                    </div>
                  </div>
                  <ul className="firms-summary-stats__list-other-stat">
                    {
                      maxValuesStats?.map((stat) => {
                        if (stat.idFirm !== mainFirmMaxValue.idFirm) {
                          const style= {
                            backgroundColor: stat.color
                          }

                          return (
                            <li key={stat.idFirm} className="firms-summary-stats__item-other-stat">
                              <span style={style} className="circle" />
                              <div  className="">
                                {
                                  typeShowValue === TypeShowValue.PRICE && `${stat?.maxPrice?.toLocaleString()} руб.`
                                }
                                {
                                  typeShowValue === TypeShowValue.COUNT && `${stat?.maxCount?.toLocaleString()} шт.`
                                }
                              </div>
                            </li>
                          )
                        }
                      })
                    }
                  </ul>
                </div>
              </li>
            </ul>
          </div>

        </div>
      </section>
    </>
  )
}

const getStatsForGraph = (datesSet, stats, firms, typeShowValue = TypeShowValue.PRICE, period = Period.POINTS) => {
  const statsResult = [];

  for (let date of datesSet) {
    const objectPoint = {};

    for (let stat of stats) {
      const statsFirm = stat.stats;

      let valueByFirm = null;

      if (typeShowValue === TypeShowValue.PRICE) {
        valueByFirm = statsFirm?.find((statFirm) => {
          return date === statFirm.createdAt;
        })?.price;
      } else {
        valueByFirm = statsFirm?.find((statFirm) => {
          return date === statFirm.createdAt;
        })?.count;
      }

      Object.assign(
        objectPoint,
        {name: period === Period.POINTS ? dayjs(date).format('DD.MM.YYYY HH:mm') : dayjs(date).format('DD.MM.YYYY')},
        {[`${getFirmName(stat.idFirm, firms)}`]: valueByFirm})
    }

    statsResult.push(objectPoint);
  }

  return statsResult;
}

const getStatsAboutFirms = (stats, firms) => {
  if (typeof stats !== 'undefined') {
    return stats.filter((stat) => {
      if (stat.linkProduct !== null) {
        return {
          idFirm: stat.idFirm,
          minPrice: stat.minPrice,
          averagePrice: stat.averagePrice,
          maxPrice: stat.maxPrice,
          minCount: stat.minCount,
          averageCount: stat.averageCount,
          maxCount: stat.maxCount
        }
      }
    });
  }
}

const getDateStatsFirms = (stats) => {
  const resultStats = stats.map((stat) => {
    return stat.stats?.map((statDetail) => statDetail.createdAt);
  });

  return new Set(resultStats
    .flat(Infinity)
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime()));
}


const getMinValuesStatsFirms = (stats, firms, typeShowValue = TypeShowValue.PRICE) => {
  if (typeof stats !== 'undefined') {
    const statsResult = stats.map((stat) => {
      return {
        idFirm: stat.idFirm,
        name: getFirmName(stat.idFirm, firms),
        minPrice: stat.minPrice,
        minCount: stat.minCount,
        color: getFirmColor(stat.idFirm, firms)
      }
    });

    return typeShowValue === TypeShowValue.PRICE ?
      statsResult.sort((a, b) => a.minPrice - b.minPrice)
      : statsResult.sort((a, b) => a.minCount - b.minCount)
  }

  return null;
}

const getAverageValuesStatsFirms = (stats, firms, typeShowValue = TypeShowValue.PRICE) => {
  if (typeof stats !== 'undefined') {
    const statsResult = stats.map((stat) => {
      return {
        idFirm: stat.idFirm,
        name: getFirmName(stat.idFirm, firms),
        averagePrice: parseInt(stat.averagePrice, 10),
        averageCount: parseInt(stat.averageCount, 10),
        color: getFirmColor(stat.idFirm, firms)
      }
    });

    return typeShowValue === TypeShowValue.PRICE ?
      statsResult.sort((a, b) => a.averagePrice - b.averagePrice)
      : statsResult.sort((a, b) => a.averageCount - b.averageCount)
  }

  return null;
}

const getMaxValuesStatsFirms = (stats, firms, typeShowValue = TypeShowValue.PRICE) => {
  if (typeof stats !== 'undefined') {
    const statsResult = stats.map((stat) => {
      return {
        idFirm: stat.idFirm,
        name: getFirmName(stat.idFirm, firms),
        maxPrice: stat.maxPrice,
        maxCount: stat.maxCount,
        color: getFirmColor(stat.idFirm, firms)
      }
    });

    return typeShowValue === TypeShowValue.PRICE ?
      statsResult.sort((a, b) => b.maxPrice - a.maxPrice)
      : statsResult.sort((a, b) => b.maxCount - a.maxCount)
  }

  return null;
}

const getFirmColor = (idFirm, firms) => {
  return firms.find((firm) => firm.id === idFirm).color;
};

const getFirmName = (idFirm, firms) => {
  return firms.find((firm) => firm.id === idFirm).name;
}

const truncate = (text, truncateLength = 50) => {
  return text?.length > truncateLength ? text.substring(0, truncateLength) + '...' : text;
}

export default ProductMonitorPage;
