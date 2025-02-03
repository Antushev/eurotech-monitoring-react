import React, { useState, useEffect, useRef } from 'react';
import * as dayjs from "dayjs";
import { useSelector, useDispatch } from 'react-redux';

import { fetchReports } from '../../store/api-actions.js';
import {
  setIsShowNotifications,
} from '../../store/app-data/app-data.js';
import { getReports } from '../../store/app-data/selectors.js';

import { TypeLastActionBlock } from '../../const.js';

const INTERVAL_UPLOAD_REPORTS = 10000;

const LastActionNotification = (props) => {
  const {
    type,
    isShow
  } = props;

  const dispatch = useDispatch();

  const notificationsRef = useRef();

  const reports = useSelector(getReports);

  // WIP: ДОДЕЛАТЬ СКРЫТИЕ УВЕДОМЛЕНИЙ ПО КЛИКУ ВНЕ БЛОКА УВЕДОМЛЕНИЙ
  const useOutsideClick = (ref) => {
    useEffect(() => {
      // const handleClickOutside = (evt) => {
      //   if (
      //     !ref.current.contains(evt.target)
      //   ) {
      //     dispatch(setIsShowNotifications(false));
      //   }
      // }

      const handleClickKeyboard = (evt) => {
        if (evt.key === 'Escape') {
          dispatch( setIsShowNotifications(false));
        }
      }

      // window.addEventListener('click', handleClickOutside);
      window.addEventListener('keydown', handleClickKeyboard);

      return () => {
        // removeEventListener('click', handleClickOutside);
        removeEventListener('keydown', handleClickKeyboard);
      }
    }, []);
  }

  useOutsideClick(notificationsRef);

  useEffect(() => {
    dispatch(fetchReports());

    const interval = setInterval(() => {
      dispatch(fetchReports());
    }, INTERVAL_UPLOAD_REPORTS)

    return () => clearInterval(interval);
  }, []);

  return (
    <aside
      ref={ notificationsRef }
      className={`last-action standart-block
        ${isShow ? '' : 'visually-hidden'}
        ${type === TypeLastActionBlock.NOTIFICATION ? 'last-action--notification' : ''}`
      }
    >
      <h2 className="header header--2 header--space-bottom">Уведомления</h2>

      <div className="last-action__block">
        {
          reports?.map((report) => {
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
  );
}

export default LastActionNotification;
