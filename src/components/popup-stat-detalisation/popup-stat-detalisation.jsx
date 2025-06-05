import React, { useState } from 'react';
import Select  from 'react-select';
import {
  TypeValueStatDetalisation,
  TypeValueCalculateStatDetalisation
} from '../../const.js';
import { getIdFirmsSelect } from '../../utils/common.js';

import { setLocalStorageStatDetalisationInMonitoringPage } from '../../services/local-storage.js';

const PopupStatDetalisation = (props) => {
  const {
    date,
    firmsSelect,
    allFirms,
    typeValue,
    typeValueCalculate,
    sort,
    setFirmsSelect,
    setTypeValue,
    setTypeValueCalculate,
    setPage,
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

        <div className="form-block form-block--column">
          <label className="label input--margin-bottom">
            <span className="label__text">Выберите конкурентов</span>
            <Select
              id="consumers"
              className="input input--select"
              isClearable
              cacheOptions
              isMulti
              onInputChange
              maxMenuHeight={150}
              closeMenuOnSelect={ false }
              value={ firmsSelect }
              options={ getOptionsForFirmsSelect(allFirms) }
              placeholder="Выберите фирмы (по умолчанию все фирмы)"
              onChange={(evt) => {
                const firmsChange = evt.length === 0 ? null : evt;
                setFirmsSelect(firmsChange);
                console.log(firmsSelect);
              }}
            />
          </label>
          {/*<label className="label">*/}
          {/*  <span className="label__text">Выберите товарные категории</span>*/}
          {/*  <Select*/}
          {/*    id="categories"*/}
          {/*    className="input input--select-no-z-index"*/}
          {/*    isClearable*/}
          {/*    cacheOptions*/}
          {/*    isMulti*/}
          {/*    onInputChange*/}
          {/*    closeMenuOnSelect={ false }*/}
          {/*    placeholder="Выберите категории товаров (по умолчанию все категории)"*/}
          {/*  />*/}
          {/*</label>*/}
        </div>


        <div className="form-block">
          <div className="form-block__margin-right">
            <p className="modal__text modal__text--no-margin-top">
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
            <p className="modal__text modal__text--no-margin-top">
              Отображаемые значения
            </p>
            <ul className="toggle-data-list">
              <li
                className={`toggle-data-list__item
                ${typeValueCalculateInner === TypeValueCalculateStatDetalisation.VALUE ? 'toggle-data-list__item--active' : ''}`}
                onClick={() => {
                  setTypeValueCalculateInner(TypeValueCalculateStatDetalisation.VALUE);
                }}
              >
                руб./шт.
              </li>

              <li className={`toggle-data-list__item
               ${typeValueCalculateInner === TypeValueCalculateStatDetalisation.PERCENT ? 'toggle-data-list__item--active' : ''}`}
                onClick={() => {
                  setTypeValueCalculateInner(TypeValueCalculateStatDetalisation.PERCENT);
                }}
              >
                %
              </li>
            </ul>
          </div>
        </div>

        {/*<div>Метод рассчёта:</div>*/}
        {/*<div className="form-block form-block--radio">*/}
        {/*  <div className="form-block__radio-block">*/}
        {/*    <input*/}
        {/*      checked*/}
        {/*      id="method-calculate-default"*/}
        {/*      className="input input--radio input--margin-right"*/}
        {/*      type="radio"*/}
        {/*      name="method-calculate"*/}
        {/*    />*/}
        {/*    <label*/}
        {/*      className="label label--radio"*/}
        {/*      htmlFor="method-calculate-default"*/}
        {/*    >*/}
        {/*      для каждого товара каждой фирмы относительно данных предыдущего периода того же товара той же фирмы*/}
        {/*    </label>*/}
        {/*  </div>*/}
        {/*</div>*/}

        {/*<div className="form-block form-block--radio form-block--margin-bottom">*/}
        {/*  <div className="form-block__radio-block">*/}
        {/*    <input*/}
        {/*      id="method-calculate-with-main-firm"*/}
        {/*      className="input input--radio input--margin-right"*/}
        {/*      type="radio"*/}
        {/*      name="method-calculate"*/}
        {/*    />*/}
        {/*    <label*/}
        {/*      className="label label--radio"*/}
        {/*      htmlFor="method-calculate-with-main-firm"*/}
        {/*    >*/}
        {/*      для каждого товара каждой фирмы относительно данных предыдущего периода того же товара основной фирмы (ООО ЕВРОТЕК)*/}
        {/*    </label>*/}
        {/*  </div>*/}
        {/*</div>*/}


        <button
          className="button button--text-center"
          type="button"
          onClick={async () => {
            setTypeValue(typeValueInner);
            setTypeValueCalculate(typeValueCalculateInner);
            setLocalStorageStatDetalisationInMonitoringPage(typeValueInner, typeValueCalculateInner, null, firmsSelect);
            const idFirmsSelect = getIdFirmsSelect(firmsSelect);
            fetchData(date.from, date.to, typeValueInner, typeValueCalculateInner, sort, 1, idFirmsSelect, false);
            setPage(1);

            setIsOpen(false);
          }}
        >
          Сохранить
        </button>
      </div>
    </>
  );
}

const getOptionsForFirmsSelect = (firms) => {
  if (!firms) {
    return [];
  }

  return firms.map((firm) => {
    return {
      label: firm.name,
      value: firm.id
    }
  })
}

export default PopupStatDetalisation;
