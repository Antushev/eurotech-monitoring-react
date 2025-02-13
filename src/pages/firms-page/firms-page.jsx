import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {Link, NavLink} from "react-router-dom";
import * as dayjs from "dayjs";
import debounce from 'debounce';

import {AppRoute, TypeLastActionBlock} from "../../const";

import {
  fetchFirmsByIdUser,
  updateFirm
} from "../../store/api-actions.js";
import { setIsShowNotifications } from "../../store/app-data/app-data.js";
import {
  getCurrentUser,
  getAllFirms,
  getStatusLoadFirms,
  getIsShowNotifications
} from '../../store/app-data/selectors.js';

import LastActionNotification from "../../components/last-action/last-action.jsx";
import Preloader from "../../components/preloader/preloader.jsx";

const TIMER_DEBOUNCE = 1500;
const WIDTH_PRELOADER = 15;
const HEIGHT_PRELOADER = 15;
const COLOR_PRELOADER = '#000000';

const FirmsPage = () => {
  const dispatch = useDispatch();

  const currentUser = useSelector(getCurrentUser);
  const firms = useSelector(getAllFirms);
  const isLoadFirms = useSelector(getStatusLoadFirms);
  const isShowNotifications = useSelector(getIsShowNotifications);

  const colorRef = useRef();

  useEffect(() => {
    dispatch(fetchFirmsByIdUser(currentUser.id));
  }, []);

  return (
    <>
      <section className="page-content page__content">
        <header className="page-content__header page-content__header--triggers standart-block">
          <h1 className="header header--1">Конкуренты</h1>

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

        <section className="page-content__inner">
          <div className="triggers table-block standart-block">
            <div className="table-block__header">
              <h2 className="header header--2">Таблица конкурентов</h2>

              <div>
                <ul className="buttons-list">
                  <li className="buttons-list__item">
                    <NavLink to={ AppRoute.FirmAdd } className="button">
                      <svg className="button__icon" width="19" height="18" viewBox="0 0 19 18">
                        <path d="M16.7991 7.04309H11.0217V1.28056C11.0217 0.573451 10.4467 0 9.73779 0H8.45391C7.74497 0 7.17004 0.573451 7.17004 1.28056V7.04309H1.3926C0.683662 7.04309 0.108727 7.61654 0.108727 8.32365V9.60421C0.108727 10.3113 0.683662 10.8848 1.3926 10.8848H7.17004V16.6473C7.17004 17.3544 7.74497 17.9279 8.45391 17.9279H9.73779C10.4467 17.9279 11.0217 17.3544 11.0217 16.6473V10.8848H16.7991C17.508 10.8848 18.083 10.3113 18.083 9.60421V8.32365C18.083 7.61654 17.508 7.04309 16.7991 7.04309Z" fill="white"/>
                      </svg>
                      Добавить конкурента
                    </NavLink>
                  </li>
                </ul>
              </div>
            </div>

            <table className="table">
              <thead className="table__thead">
              <tr className="table__tr">
                <th className="table__th">
                  ID
                </th>
                <th className="table__th table__th--name">
                  Имя
                </th>
                <th className="table__th">
                  ИНН
                </th>
                <th className="table__th">
                  Сайт
                </th>
                <th className="table__th">
                  Цвет
                </th>
                <th className="table__th">
                  Основная фирма
                </th>
                <th className="table__th">
                  Дата добавления
                </th>
                {/*<th className="table__th">*/}
                {/*  Активность*/}
                {/*</th>*/}
              </tr>
              </thead>

              <tbody className="table__tbody">
              {
                isLoadFirms
                  ? (
                    <tr className="table__tr">
                      <td className="table__td">
                        <Preloader
                          width={ WIDTH_PRELOADER }
                          height={ HEIGHT_PRELOADER }
                          color={ COLOR_PRELOADER }
                        />
                      </td>
                    </tr>
                  )
                  : (
                    firms.map((firm) => {
                      return (
                        <tr key={firm.id} className="table__tr">
                          <td className="table__td">
                            {firm.id }
                          </td>
                          <td className="table__td table__td--name">
                            <Link to={`/firm/${firm.id}/edit`}>
                              { firm.name }
                            </Link>
                          </td>

                          <td className="table__td">
                              { firm.inn }
                          </td>

                          <td className="table__td">
                            <a className="link" href={`https://${firm.site}`} target="_blank">
                              { firm.site }
                            </a>
                          </td>

                          <td className="table__td">
                            <input
                              ref={ colorRef }
                              id="color-firm"
                              className="input input--color"
                              type="color"
                              name="color-firm"
                              defaultValue={ firm.color }
                              onChange={debounce(async (evt) => {
                                const color = evt.target.value;

                                const newFirm = {
                                  ...firm,
                                  color
                                }

                                dispatch(updateFirm(newFirm));
                              }, TIMER_DEBOUNCE)}
                            />
                          </td>

                          <td
                            className="table__td"
                            onClick={() => {
                              dispatch(updateFirm({...firm, isMain: !firm.isMain}));
                            }}
                          >
                            {
                              firm.isMain &&
                              <svg className="icon" width="40" height="27" viewBox="0 0 40 27">
                                <path d="M26.6667 0H13.3333C5.97222 0 0 6.04688 0 13.5C0 20.9531 5.97222 27 13.3333 27H26.6667C34.0278 27 40 20.9531 40 13.5C40 6.04688 34.0278 0 26.6667 0ZM26.6667 22.5C21.75 22.5 17.7778 18.4711 17.7778 13.5C17.7778 8.52187 21.7569 4.5 26.6667 4.5C31.5833 4.5 35.5556 8.52891 35.5556 13.5C35.5556 18.4781 31.5764 22.5 26.6667 22.5Z" fill="#BE1622"/>
                              </svg>
                            }

                            {
                              !firm.isMain &&
                              <svg className="icon" width="40" height="27">
                                <path d="M26.6667 0H13.3333C5.96951 0 0 5.96951 0 13.3333C0 20.6972 5.96951 26.6667 13.3333 26.6667H26.6667C34.0305 26.6667 40 20.6972 40 13.3333C40 5.96951 34.0305 0 26.6667 0ZM4.44444 13.3333C4.44444 8.42076 8.42007 4.44444 13.3333 4.44444C18.2459 4.44444 22.2222 8.42007 22.2222 13.3333C22.2222 18.2459 18.2466 22.2222 13.3333 22.2222C8.42076 22.2222 4.44444 18.2466 4.44444 13.3333ZM26.6667 22.2222H23.2705C27.7994 17.1626 27.8008 9.50556 23.2705 4.44444H26.6667C31.5792 4.44444 35.5556 8.42007 35.5556 13.3333C35.5556 18.2458 31.5799 22.2222 26.6667 22.2222Z" fill="#BE1622"/>
                              </svg>
                            }
                          </td>

                          <td className="table__td">
                            { `${dayjs(firm.createdAt).format('DD.MM.YYYY HH:mm')}`}
                          </td>

                          {/*<td*/}
                          {/*  className="table__td table__td--cursor"*/}
                          {/*>*/}
                          {/*  { firm.isActive }*/}
                          {/*</td>*/}
                        </tr>
                      );
                    })
                  )
              }

              {
                !firms || firms.length === 0 &&
                <tr className="table__tr">
                  <td className="table__td" colSpan={10}>
                    Таблица конкурентов пуста
                  </td>
                </tr>
              }
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </>
  );
}

export default FirmsPage;
