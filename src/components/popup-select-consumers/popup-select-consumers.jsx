import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { toast } from 'react-toastify';
import Select from 'react-select';
import * as dayjs from "dayjs";

import { TypeShowConditionValue } from '../../const.js';

import {
  fetchFirmsByIdUser,
  fetchProductsWithSummaryDetail,
  setFirmsActiveByIdUser
} from '../../store/api-actions.js';
import { setTypeShowConditionValue } from '../../store/app-data/app-data.js';
import {
  getCurrentUser,
  getStatusLoadFirms,
  getStatusLoadProducts,
  getTypeShowConditionValue
} from '../../store/app-data/selectors.js';

import Preloader from '../preloader/preloader.jsx';

const PopupSelectConsumers = (props) => {
  const dispatch = useDispatch();

  const { firms, currentProduct, setIsOpen } = props;
  const currentUser = useSelector(getCurrentUser);
  const typeShowConditionValue = useSelector(getTypeShowConditionValue);
  const isLoadFirms = useSelector(getStatusLoadFirms);
  const isLoadProducts = useSelector(getStatusLoadProducts);

  const getFirmFormatDataForSelect = (firms) => {
    return firms.map((firm) => {
      return {
        label: firm.name,
        value: firm
      }
    });
  }

  const [firmsSelectOptions, setFirmsSelectOptions] = useState(getFirmFormatDataForSelect(firms));
  const [firmsSelect, setFirmsSelect] = useState(getFirmFormatDataForSelect(firms.filter((firm => firm.isSelect))));

  const getValidateStatus = (firmsSelect) => {
   return firmsSelect.some((firm) => firm.value.isMain === true);
  }
  const getMainFirm = (firms) => firms?.find((firm) => firm.isMain);
  const getFirmsFormatDataForWriteDb = (firmsSelect) => firmsSelect.map((firm) => firm.value);

  return (
    <>
      <div className="background-black" />
      <div className="modal modal--settings-monitoring-table">
        <div
          className="modal__close"
          onClick={() => {
            setIsOpen(false)
          }}
        >
          <svg className="icon" width="18" height="18" viewBox="0 0 18 18">
            <path
              d="M11.8516 8.59375L16.7378 3.70752C17.3374 3.10791 17.3374 2.13574 16.7378 1.53564L15.6519 0.449707C15.0522 -0.149902 14.0801 -0.149902 13.48 0.449707L8.59375 5.33594L3.70752 0.449707C3.10791 -0.149902 2.13574 -0.149902 1.53564 0.449707L0.449707 1.53564C-0.149902 2.13525 -0.149902 3.10742 0.449707 3.70752L5.33594 8.59375L0.449707 13.48C-0.149902 14.0796 -0.149902 15.0518 0.449707 15.6519L1.53564 16.7378C2.13525 17.3374 3.10791 17.3374 3.70752 16.7378L8.59375 11.8516L13.48 16.7378C14.0796 17.3374 15.0522 17.3374 15.6519 16.7378L16.7378 15.6519C17.3374 15.0522 17.3374 14.0801 16.7378 13.48L11.8516 8.59375Z"
              fill="#BE1622"/>
          </svg>
        </div>

        <h2 className="header header--2 header--center">Настройки таблицы</h2>
        <p className="modal__text">
          Выберите конкурентов для отображения в таблице
        </p>

        <Select
          className="input input--select input--select-consumers input--margin-bottom"
          maxMenuHeight={190}
          closeMenuOnSelect={false}
          cacheOptions
          isMulti={true}
          value={firmsSelect}
          options={firmsSelectOptions}
          placeholder="Выберите одну или несколько компаний"
          onChange={(evt) => {
            const mainFirm = getMainFirm(firms);

            if (evt.length === 0) {
              evt.push({ label: mainFirm.name, value: mainFirm });
            }

            const isValid = getValidateStatus(evt);
            if (!isValid) {
              toast.warning(`Фирма ${mainFirm.name} является основной - из списка выбора её убирать нельзя`);

              return false;
            }

            setFirmsSelect(evt);
          }}
        />

        <p className="modal__text">
          Выберите способ отображения разницы величин
        </p>
        <ul className="toggle-data-list toggle-data-list--margin-bottom">
          <li
            className={`toggle-data-list__item ${
              typeShowConditionValue === TypeShowConditionValue.VALUE && 'toggle-data-list__item--active'
            }`
            }
            onClick={() => {
              dispatch(setTypeShowConditionValue(TypeShowConditionValue.VALUE))
            }}
          >
            Значения
          </li>
          <li
            className={`toggle-data-list__item ${
              typeShowConditionValue === TypeShowConditionValue.PERCENT && 'toggle-data-list__item--active'
            }`
            }
            onClick={() => {
              dispatch(setTypeShowConditionValue(TypeShowConditionValue.PERCENT))
            }}
          >
            Проценты
          </li>
        </ul>

        <button
          disabled={isLoadProducts}
          className="button button--add-group button--bottom"
          type="button"
          onClick={async () => {
            await dispatch(setFirmsActiveByIdUser({
              idUser: currentUser.id,
              firms: getFirmsFormatDataForWriteDb(firmsSelect)
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
