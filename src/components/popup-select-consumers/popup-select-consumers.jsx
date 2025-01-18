import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Preloader from '../preloader/preloader.jsx';

import {
  fetchFirmsByIdUser,
  setFirmsActiveByIdUser,
  fetchProductsWithSummaryDetail
} from '../../store/api-actions.js';
import {
  getCurrentUser,
  getStatusLoadFirms,
  getStatusLoadProducts
} from '../../store/app-data/selectors.js';

// WIP: ЗАМЕНИТЬ ДАННЫМИ ИЗ БАЗЫ ДАННЫХ
import { firms as allFirms } from '../../utils/mocks.js';
import * as dayjs from "dayjs";

const PopupSelectConsumers = (props) => {
  const dispatch = useDispatch();

  const { firms: propFirms, currentProduct, setIsOpen } = props;
  const currentUser = useSelector(getCurrentUser);
  const isLoadFirms = useSelector(getStatusLoadFirms);
  const isLoadProducts = useSelector(getStatusLoadProducts);

  const [firms, setFirms] = useState(propFirms);

  return (
    <>
      <div className="background-black" />
      <div className="modal">
        <div
          className="modal__close"
          onClick={() => {
            setIsOpen(false)
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path
              d="M11.8516 8.59375L16.7378 3.70752C17.3374 3.10791 17.3374 2.13574 16.7378 1.53564L15.6519 0.449707C15.0522 -0.149902 14.0801 -0.149902 13.48 0.449707L8.59375 5.33594L3.70752 0.449707C3.10791 -0.149902 2.13574 -0.149902 1.53564 0.449707L0.449707 1.53564C-0.149902 2.13525 -0.149902 3.10742 0.449707 3.70752L5.33594 8.59375L0.449707 13.48C-0.149902 14.0796 -0.149902 15.0518 0.449707 15.6519L1.53564 16.7378C2.13525 17.3374 3.10791 17.3374 3.70752 16.7378L8.59375 11.8516L13.48 16.7378C14.0796 17.3374 15.0522 17.3374 15.6519 16.7378L16.7378 15.6519C17.3374 15.0522 17.3374 14.0801 16.7378 13.48L11.8516 8.59375Z"
              fill="#BE1622"/>
          </svg>
        </div>

        <h2 className="header header--2 header--center">Настройки таблицы</h2>
        <p className="modal__text text text--center text--italic">
          Выберите <b>не более 4</b> конкурентов, которые будут отображаться в таблице.
        </p>


        <ul className="consumers-list">
          {
            firms.map((firm) => {
              return (
                <li
                  key={firm.id}
                  className="consumers-list__item"
                  style={getFirmActiveStyles(firm)}
                  onClick={() => {
                    setFirms((prevFirms) => {
                     return prevFirms.map((prevFirm) => {
                       if (prevFirm.id === firm.id) {
                         return {...prevFirm, isSelect: !firm.isSelect}
                       } else {
                         return prevFirm;
                       }
                     })
                    })
                  }}
                  onMouseOver={() => {
                    setFirms((prevFirms) => {
                      return prevFirms.map((prevFirm) => {
                        if (prevFirm.id === firm.id) {
                          return {...prevFirm, isSelect: !firm.isSelect}
                        } else {
                          return prevFirm;
                        }
                      })
                    })
                  }}
                  onMouseOut={() => {
                    setFirms((prevFirms) => {
                      return prevFirms.map((prevFirm) => {
                        if (prevFirm.id === firm.id) {
                          return {...prevFirm, isSelect: !firm.isSelect}
                        } else {
                          return prevFirm;
                        }
                      })
                    })
                  }}
                >
                  {firm.name}
                </li>
              )
            })
          }
        </ul>

        <button
          disabled={isLoadProducts}
          className="button button--add-group"
          type="button"
          onClick={async () => {
            await dispatch(setFirmsActiveByIdUser({
              idUser: currentUser.id, firms
            }));
            await dispatch(fetchFirmsByIdUser(currentUser.id));
            await dispatch(fetchProductsWithSummaryDetail({
              idUser: currentUser.id,
              idParent: currentProduct === null ? null : currentProduct.id,
              withStats: 'summary',
              dateStart: dayjs().startOf('day'),
              dateEnd: dayjs().endOf('day')
            }));

            setIsOpen(false);
          }}
        >
          {isLoadProducts || isLoadFirms ?
            <Preloader />
            : 'Применить изменения'
          }
        </button>
      </div>
    </>
  );
}

const getFirmActiveStyles = (firm) => {
  if (firm.isSelect) {
    return {
      backgroundColor: firm.color,
      color: '#ffffff'
    }
  }
}

export default PopupSelectConsumers;
