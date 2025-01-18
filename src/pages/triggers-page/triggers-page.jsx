import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as dayjs from 'dayjs';

import { AppRoute } from '../../const';

import { fetchTriggers, updateTrigger } from '../../store/api-actions.js';
import {
  getCurrentUser,
  getAllTriggers,
  getStatusLoadTriggers
} from '../../store/app-data/selectors.js';

import Preloader from '../../components/preloader/preloader.jsx';

const WIDTH_PRELOADER = 25;
const HEIGHT_PRELOADER = 25;
const COLOR_PRELOADER = '#000000';

const TriggersPage = () => {
  const dispatch = useDispatch();

  const currentUser = useSelector(getCurrentUser);
  const triggers = useSelector(getAllTriggers);
  const isLoadTriggers = useSelector(getStatusLoadTriggers);

  useEffect(() => {
    dispatch(fetchTriggers(currentUser.id));
  }, []);

  return (
    <>
      <section className="page-content page__content">
        <header className="page-content__header standart-block">
          <h1
            className="header header--1">Триггеры</h1>
        </header>

        <section className="page-content__inner">
          <div className="triggers table-block standart-block">
            <div className="table-block__header">
              <h2 className="header header--2">Таблица триггеров</h2>

              <div>
                <ul className="buttons-list">
                  <li className="buttons-list__item">
                    <NavLink to={ AppRoute.TriggerAdd } className="button">
                      <svg className="button__icon" width="19" height="18" viewBox="0 0 19 18">
                        <path d="M16.7991 7.04309H11.0217V1.28056C11.0217 0.573451 10.4467 0 9.73779 0H8.45391C7.74497 0 7.17004 0.573451 7.17004 1.28056V7.04309H1.3926C0.683662 7.04309 0.108727 7.61654 0.108727 8.32365V9.60421C0.108727 10.3113 0.683662 10.8848 1.3926 10.8848H7.17004V16.6473C7.17004 17.3544 7.74497 17.9279 8.45391 17.9279H9.73779C10.4467 17.9279 11.0217 17.3544 11.0217 16.6473V10.8848H16.7991C17.508 10.8848 18.083 10.3113 18.083 9.60421V8.32365C18.083 7.61654 17.508 7.04309 16.7991 7.04309Z" fill="white"/>
                      </svg>
                      Добавить триггер
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
                    Название
                  </th>
                  <th className="table__th">
                    Тип действия
                  </th>
                  <th className="table__th">
                    Срабатываний
                  </th>
                  <th className="table__th">
                    Последнее срабатывание
                  </th>
                  <th className="table__th">
                    Период активности
                  </th>
                  <th className="table__th">
                    Активность
                  </th>
                </tr>
              </thead>

             <tbody className="table__tbody">
                {
                  isLoadTriggers
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
                    triggers.map((trigger) => {
                      return (
                        <tr key={trigger.id} className="table__tr">
                          <td className="table__td">
                            { trigger.id }
                          </td>

                          <td className="table__td table__td--name">
                            <Link to={`/trigger/${trigger.id}/edit`}>
                              { trigger.name }
                            </Link>
                          </td>

                          <td className="table__td">
                            {
                              trigger.isActionSendEmail &&
                                <svg width="25" height="25" viewBox="0 0 25 25">
                                  <path d="M12.1094 0C5.41704 0 0 5.41597 0 12.1094C0 18.8017 5.41597 24.2188 12.1094 24.2188C14.4606 24.2188 16.7647 23.5283 18.7211 22.2547C19.3073 21.8731 19.4352 21.0688 18.9922 20.5276L18.4953 19.9205C18.1207 19.4629 17.4611 19.3508 16.9634 19.6701C15.5234 20.5936 13.8337 21.0938 12.1094 21.0938C7.15537 21.0938 3.125 17.0634 3.125 12.1094C3.125 7.15537 7.15537 3.125 12.1094 3.125C16.999 3.125 21.0938 5.93843 21.0938 10.9375C21.0938 12.8313 20.0638 14.8312 18.2534 15.0241C17.4063 15.0019 17.4277 14.3963 17.5954 13.5581L18.7396 7.64448C18.8795 6.92139 18.3256 6.25 17.5891 6.25H15.3928C15.2306 6.25 15.0741 6.30969 14.9531 6.4177C14.8322 6.5257 14.7552 6.67446 14.7369 6.8356L14.7364 6.84009C14.0188 5.96602 12.7614 5.77686 11.8082 5.77686C8.16655 5.77686 5.07812 8.81562 5.07812 13.1724C5.07812 16.361 6.87427 18.3418 9.76562 18.3418C11.0832 18.3418 12.5668 17.5783 13.4273 16.4701C13.8922 18.1353 15.4104 18.1353 16.8799 18.1353C22.1977 18.1353 24.2188 14.6386 24.2188 10.9375C24.2188 4.27993 18.8488 0 12.1094 0ZM11.0508 14.8647C9.96441 14.8647 9.28955 14.1019 9.28955 12.874C9.28955 10.6771 10.7924 9.32275 12.1523 9.32275C13.2408 9.32275 13.8907 10.0669 13.8907 11.3135C13.8907 13.5137 12.2366 14.8647 11.0508 14.8647Z" fill="black"/>
                                </svg>
                            }
                          </td>

                          <td className="table__td">
                            { trigger.countReports ? trigger.countReports : 0 }
                          </td>

                          <td className="table__td">
                            {
                              trigger.lastActive && dayjs(trigger.lastActive).format('DD.MM.YYYY HH:mm')
                            }

                            {
                              !trigger.lastActive && '-'
                            }
                          </td>

                          <td className="table__td">
                            { `${dayjs(trigger.dateActiveFrom).format('DD.MM.YYYY')} - ${dayjs(trigger.dateActiveTo).format('DD.MM.YYYY')}`}
                          </td>

                          <td
                            className="table__td table__td--cursor"
                            onClick={() => {
                              dispatch(updateTrigger({
                                id: trigger.id,
                                isActive: !trigger.isActive
                              }));
                            }}
                          >
                            {
                              trigger.isActive &&
                              <svg className="icon" width="40" height="27" viewBox="0 0 40 27">
                                <path d="M26.6667 0H13.3333C5.97222 0 0 6.04688 0 13.5C0 20.9531 5.97222 27 13.3333 27H26.6667C34.0278 27 40 20.9531 40 13.5C40 6.04688 34.0278 0 26.6667 0ZM26.6667 22.5C21.75 22.5 17.7778 18.4711 17.7778 13.5C17.7778 8.52187 21.7569 4.5 26.6667 4.5C31.5833 4.5 35.5556 8.52891 35.5556 13.5C35.5556 18.4781 31.5764 22.5 26.6667 22.5Z" fill="#BE1622"/>
                              </svg>
                            }

                            {
                              !trigger.isActive &&
                              <svg className="icon" width="40" height="27">
                                <path d="M26.6667 0H13.3333C5.96951 0 0 5.96951 0 13.3333C0 20.6972 5.96951 26.6667 13.3333 26.6667H26.6667C34.0305 26.6667 40 20.6972 40 13.3333C40 5.96951 34.0305 0 26.6667 0ZM4.44444 13.3333C4.44444 8.42076 8.42007 4.44444 13.3333 4.44444C18.2459 4.44444 22.2222 8.42007 22.2222 13.3333C22.2222 18.2459 18.2466 22.2222 13.3333 22.2222C8.42076 22.2222 4.44444 18.2466 4.44444 13.3333ZM26.6667 22.2222H23.2705C27.7994 17.1626 27.8008 9.50556 23.2705 4.44444H26.6667C31.5792 4.44444 35.5556 8.42007 35.5556 13.3333C35.5556 18.2458 31.5799 22.2222 26.6667 22.2222Z" fill="#BE1622"/>
                              </svg>
                            }
                          </td>
                        </tr>
                      );
                    })
                  )
                }

                {
                  !triggers || triggers.length === 0 &&
                  <tr className="table__tr">
                    <td className="table__td" colSpan={10}>
                      Таблица триггеров пуста
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

export default TriggersPage;
