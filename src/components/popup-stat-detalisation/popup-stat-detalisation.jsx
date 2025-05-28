import React, { useState } from 'react';
import AsyncSelect  from 'react-select';
import {
  TypeValueStatDetalisation,
  TypeValueCalculateStatDetalisation
} from '../../const.js';
import { setLocalStorageStatDetalisationInMonitoringPage } from '../../services/local-storage.js';

const PopupStatDetalisation = (props) => {
  const {
    typeValue,
    typeValueCalculate,
    setTypeValue,
    setTypeValueCalculate,
    setIsOpen,
    fetchData
  } = props;

  const [typeValueInner, setTypeValueInner] = useState(typeValue);
  const [typeValueCalculateInner, setTypeValueCalculateInner] = useState(typeValueCalculate);

  return (
    <>
      <div className="background-black" />
      <div className="modal modal">
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

        <h2 className="header header--2 header--center header--space-bottom">Параметры блока</h2>

        <label htmlFor="consumers">Выберите конкурентов для расчёта</label>
        <AsyncSelect
          id="consumers"
          className="input input--select"
          isClearable
          cacheOptions
          placeholder="По умолчанию выбраны все фирмы, кроме основной"
        />

        <div className="form-block form-block--margin-bottom">
          <div className="form-block__margin-right">
            <p className="modal__text">
              Рассчитываемая величина
            </p>
            <ul className="toggle-data-list">
              <li
                className={`toggle-data-list__item
                ${typeValueInner === TypeValueStatDetalisation.PRICE ? 'toggle-data-list__item--active' : ''}`}
                onClick={() => {
                  setTypeValueInner(TypeValueStatDetalisation.PRICE);
                }}
              >
                Цены
              </li>
              <li
                className={`toggle-data-list__item
                ${typeValueInner === TypeValueStatDetalisation.COUNT ? 'toggle-data-list__item--active' : ''}`}
                onClick={() => {
                  setTypeValueInner(TypeValueStatDetalisation.COUNT);
                }}
              >
                Остатки
              </li>
            </ul>
          </div>

          <div>
            <p className="modal__text">
              Отображаемые значения
            </p>
            <ul className="toggle-data-list">
              <li className={`toggle-data-list__item
               ${typeValueCalculateInner === TypeValueCalculateStatDetalisation.PERCENT ? 'toggle-data-list__item--active' : ''}`}
                onClick={() => {
                  setTypeValueCalculateInner(TypeValueCalculateStatDetalisation.PERCENT);
                }}
              >
                %
              </li>
              <li
                className={`toggle-data-list__item
                ${typeValueCalculateInner === TypeValueCalculateStatDetalisation.VALUE ? 'toggle-data-list__item--active' : ''}`}
                onClick={() => {
                  setTypeValueCalculateInner(TypeValueCalculateStatDetalisation.VALUE);
                }}
              >
                руб./шт.
              </li>
            </ul>
          </div>
        </div>

        <div>Метод рассчёта:</div>
        <div className="form-block form-block--radio">
          <div className="form-block__radio-block">
            <input
              checked
              id="method-calculate-default"
              className="input input--radio input--margin-right"
              type="radio"
              name="method-calculate"
            />
            <label
              className="label label--radio"
              htmlFor="method-calculate-default"
            >
              для каждого товара каждой фирмы относительно данных предыдущего периода того же товара той же фирмы
            </label>
          </div>
        </div>

        <div className="form-block form-block--radio form-block--margin-bottom">
          <div className="form-block__radio-block">
            <input
              id="method-calculate-with-main-firm"
              className="input input--radio input--margin-right"
              type="radio"
              name="method-calculate"
            />
            <label
              className="label label--radio"
              htmlFor="method-calculate-with-main-firm"
            >
              для каждого товара каждой фирмы относительно данных предыдущего периода того же товара основной фирмы (ООО ЕВРОТЕК)
            </label>
          </div>
        </div>


        <button
          className="button button--text-center"
          type="button"
          onClick={async () => {
            await setTypeValue(typeValueInner);
            await setTypeValueCalculate(typeValueCalculateInner);
            setLocalStorageStatDetalisationInMonitoringPage(typeValueInner, typeValueCalculate, null);
            fetchData(typeValueInner, typeValueCalculateInner);

            setIsOpen(false);
          }}
        >
          Сохранить
        </button>
      </div>
    </>
  );
}

export default PopupStatDetalisation;
