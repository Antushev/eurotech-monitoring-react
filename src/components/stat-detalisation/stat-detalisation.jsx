import React, { useState } from 'react';
import dayjs from 'dayjs';
import debounce from 'debounce';
import { truncate } from "../../utils/common.js";
import { Link } from "react-router-dom";
import { SortType } from '../../const.js';
import { getIdFirmsSelect } from '../../utils/common.js';

import {
  AppRoute,
  TypeValueStatDetalisation,
  TypeValueCalculateStatDetalisation
} from "../../const.js";

import { setLocalStorageFavoriteChangeStatDetalisation } from '../../services/local-storage.js';

import Calendar from '../calendar/calendar.jsx';
import Preloader from "../preloader/preloader.jsx";

const StatDetalisation = (props) => {
  const {
    date,
    products,
    firms,
    typeValue,
    typeValueCalculate,
    sort,
    page,
    isFavoriteChange,
    setIsFavoriteChange,
    isLoad,
    setProducts,
    setSort,
    setDate,
    setPage,
    setIsOpenPopup,
    fetchProducts
  } = props;

  const dateFromFormat = dayjs(date.from).format('DD.MM.YYYY');
  const dateToFormat = dayjs(date.to).format('DD.MM.YYYY');
  const idFirms = getIdFirmsSelect(firms);

  const [isLoadNewProduct, setIsLoadNewProduct] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  const handleChangeDateCalendar = async (evt) => {
    setDate(evt);
    await fetchProducts(evt.from, evt.to, typeValue, typeValueCalculate, sort, 1, idFirms, false);
  }

  return (
    <div className="page-content__detalisation-block goods-stat-detalisation standart-block">
      <div className="goods-stat-detalisation__header">
        <div className="goods-stat-detalisation__header-block">
          <h2 className="header header--2">Динамика</h2>

          <label
            className="goods-stat-detalisation__date label__text"
            htmlFor="date-for-stat"
            onClick={() => {
              setShowCalendar(!showCalendar);
            }}
          >
            {`${ dateFromFormat } - ${ dateToFormat }`}
          </label>
          {/*<input*/}
          {/*  id="date-for-stat"*/}
          {/*  className="input visually-hidden"*/}
          {/*  type="date"*/}
          {/*/>*/}

          {
            showCalendar &&
            <div className="calendar goods-stat-detalisation__calendar">
              <Calendar
                date={date}
                setDate={ handleChangeDateCalendar }
                mode="range"
              />
            </div>
          }
        </div>

        <div className="goods-stat-detalisation__settings">
          <svg
            className="icon icon--margin-right"
            width="26"
            height="26"
            viewBox="0 0 26 26"
            fill="none"
            onClick={() => {
              setIsOpenPopup(true);
            }}
          >
            <path d="M24.7133 16.1242L22.4674 14.8347C22.6941 13.6185 22.6941 12.371 22.4674 11.1548L24.7133 9.86533C24.9717 9.71856 25.0877 9.41453 25.0033 9.13147C24.4181 7.26534 23.4217 5.57745 22.1195 4.17261C21.9191 3.9577 21.5922 3.90528 21.3392 4.05205L19.0933 5.34156C18.1496 4.53431 17.0635 3.91052 15.8878 3.50165V0.927868C15.8878 0.634321 15.6822 0.377467 15.3922 0.314564C13.4574 -0.115273 11.4751 -0.0943054 9.6351 0.314564C9.34514 0.377467 9.13952 0.634321 9.13952 0.927868V3.50689C7.96912 3.921 6.88306 4.54479 5.93408 5.3468L3.69343 4.05729C3.4351 3.91052 3.1135 3.9577 2.91316 4.17786C1.61095 5.57745 0.614523 7.26534 0.0293192 9.13671C-0.0603066 9.41977 0.0609519 9.7238 0.319285 9.87058L2.5652 11.1601C2.3385 12.3762 2.3385 13.6238 2.5652 14.8399L0.319285 16.1294C0.0609519 16.2762 -0.0550345 16.5802 0.0293192 16.8633C0.614523 18.7294 1.61095 20.4173 2.91316 21.8221C3.1135 22.0371 3.44037 22.0895 3.69343 21.9427L5.93935 20.6532C6.88306 21.4605 7.96912 22.0842 9.1448 22.4931V25.0721C9.1448 25.3657 9.35041 25.6225 9.64037 25.6854C11.5752 26.1153 13.5576 26.0943 15.3975 25.6854C15.6875 25.6225 15.8931 25.3657 15.8931 25.0721V22.4931C17.0635 22.079 18.1496 21.4552 19.0985 20.6532L21.3445 21.9427C21.6028 22.0895 21.9244 22.0423 22.1247 21.8221C23.4269 20.4226 24.4234 18.7347 25.0086 16.8633C25.0877 16.575 24.9717 16.271 24.7133 16.1242ZM12.5137 17.1883C10.1887 17.1883 8.29599 15.3064 8.29599 12.9948C8.29599 10.6831 10.1887 8.80123 12.5137 8.80123C14.8387 8.80123 16.7314 10.6831 16.7314 12.9948C16.7314 15.3064 14.8387 17.1883 12.5137 17.1883Z" fill="#BE1622"/>
          </svg>

          {
            sort === SortType.DESC &&
            <svg
              className="icon"
              width="26"
              height="27"
              viewBox="0 0 26 27"
              onClick={async () => {
                if (!isLoad) {
                  setSort(SortType.ASC);
                  setPage(1);
                  await fetchProducts(date.from, date.to, typeValue, typeValueCalculate, SortType.ASC, 1, idFirms, false, isFavoriteChange);
                }
              }}
            >
              <path d="M10.592 19.2857H7.70319V0.964286C7.70319 0.708541 7.60174 0.463271 7.42116 0.282433C7.24057 0.101594 6.99565 0 6.74027 0H4.81441C4.55903 0 4.3141 0.101594 4.13352 0.282433C3.95294 0.463271 3.85149 0.708541 3.85149 0.964286V19.2857H0.962706C0.10871 19.2857 -0.322801 20.3247 0.283241 20.9316L5.09787 26.7173C5.27844 26.898 5.52327 26.9996 5.77854 26.9996C6.03382 26.9996 6.27865 26.898 6.45921 26.7173L11.2738 20.9316C11.8769 20.3259 11.4478 19.2857 10.592 19.2857ZM24.0729 23.1429H23.11V16.3929C23.11 16.1371 23.0086 15.8918 22.828 15.711C22.6474 15.5302 22.4025 15.4286 22.1471 15.4286H19.2583C19.0798 15.4287 18.9048 15.4786 18.753 15.5725C18.6011 15.6665 18.4783 15.8009 18.3983 15.9607L17.4354 17.8893C17.3618 18.0363 17.327 18.1996 17.3342 18.3638C17.3414 18.5281 17.3904 18.6877 17.4766 18.8276C17.5628 18.9675 17.6832 19.0831 17.8265 19.1632C17.9698 19.2434 18.1312 19.2856 18.2954 19.2857H19.2583V23.1429H18.2954C18.04 23.1429 17.7951 23.2445 17.6145 23.4253C17.4339 23.6061 17.3325 23.8514 17.3325 24.1071V26.0357C17.3325 26.2915 17.4339 26.5367 17.6145 26.7176C17.7951 26.8984 18.04 27 18.2954 27H24.0729C24.3283 27 24.5733 26.8984 24.7538 26.7176C24.9344 26.5367 25.0359 26.2915 25.0359 26.0357V24.1071C25.0359 23.8514 24.9344 23.6061 24.7538 23.4253C24.5733 23.2445 24.3283 23.1429 24.0729 23.1429ZM19.8704 0.175379C19.0858 0.39055 18.3696 0.803688 17.79 1.37528C17.2105 1.94688 16.7871 2.65781 16.5603 3.44009C15.7015 6.51676 17.8356 9.33248 20.7027 9.61935C20.3247 9.93873 19.9019 10.2009 19.4479 10.3974C18.9923 10.6023 18.7979 11.149 18.9556 11.6233L19.5514 12.8286C19.7241 13.3487 20.3055 13.6416 20.8092 13.4259C24.2998 11.933 26 9.71277 26 5.47051V4.82143C25.9988 1.73511 23.0871 -0.683438 19.8704 0.175379ZM21.1842 6.02679C20.9461 6.02679 20.7134 5.95609 20.5154 5.82365C20.3175 5.6912 20.1632 5.50295 20.0721 5.2827C19.981 5.06245 19.9572 4.82009 20.0036 4.58627C20.0501 4.35246 20.1647 4.13768 20.333 3.96911C20.5014 3.80054 20.7159 3.68574 20.9493 3.63923C21.1828 3.59272 21.4248 3.61659 21.6448 3.70782C21.8647 3.79905 22.0527 3.95355 22.185 4.15177C22.3172 4.34999 22.3878 4.58303 22.3878 4.82143C22.3878 5.14111 22.261 5.4477 22.0353 5.67374C21.8096 5.89979 21.5034 6.02679 21.1842 6.02679Z" fill="#BE1622"/>
            </svg>
          }

          {
            sort === SortType.ASC &&
            <svg
              className="icon"
              width="26"
              height="27"
              viewBox="0 0 26 27"
              onClick={async () => {
                if (!isLoad) {
                  setSort(SortType.DESC);
                  setPage(1);
                  await fetchProducts(date.from, date.to, typeValue, typeValueCalculate, SortType.DESC, 1, idFirms, false, isFavoriteChange);
                }
              }}
            >
              <path d="M18.2954 3.85721H19.2583V7.71441H18.2954C18.04 7.71441 17.7951 7.81601 17.6145 7.99685C17.4339 8.17769 17.3325 8.42297 17.3325 8.67872V10.6073C17.3325 10.8631 17.4339 11.1083 17.6145 11.2892C17.7951 11.47 18.04 11.5716 18.2954 11.5716H24.0729C24.3283 11.5716 24.5733 11.47 24.7538 11.2892C24.9344 11.1083 25.0359 10.8631 25.0359 10.6073V8.67872C25.0359 8.42297 24.9344 8.17769 24.7538 7.99685C24.5733 7.81601 24.3283 7.71441 24.0729 7.71441H23.11V0.964302C23.11 0.708553 23.0086 0.463279 22.828 0.282437C22.6474 0.101596 22.4025 0 22.1471 0H19.2583C19.0798 0.000151261 18.9048 0.0499982 18.753 0.143974C18.6011 0.237949 18.4783 0.372353 18.3983 0.532174L17.4354 2.46078C17.3618 2.60773 17.327 2.77108 17.3342 2.93531C17.3414 3.09954 17.3904 3.25919 17.4766 3.3991C17.5628 3.53902 17.6832 3.65455 17.8265 3.73473C17.9698 3.81491 18.1312 3.85707 18.2954 3.85721ZM19.8692 13.6756C19.0846 13.8908 18.3683 14.3039 17.7888 14.8755C17.2093 15.4471 16.7859 16.1581 16.5591 16.9404C15.7015 20.0171 17.8356 22.8329 20.7027 23.1197C20.3247 23.4391 19.9019 23.7013 19.4479 23.8978C18.9923 24.1027 18.7979 24.6494 18.9556 25.1237L19.5514 26.3291C19.7241 26.8492 20.3055 27.1421 20.8092 26.9263C24.2998 25.4341 26 23.2132 26 18.9708V18.3217C25.9988 15.2354 23.0871 12.8168 19.8704 13.6756H19.8692ZM21.1842 19.5271C20.9461 19.5271 20.7134 19.4564 20.5154 19.324C20.3175 19.1915 20.1632 19.0033 20.0721 18.783C19.981 18.5628 19.9572 18.3204 20.0036 18.0866C20.0501 17.8528 20.1647 17.638 20.333 17.4694C20.5014 17.3008 20.7159 17.186 20.9493 17.1395C21.1828 17.093 21.4248 17.1169 21.6448 17.2081C21.8647 17.2993 22.0527 17.4538 22.185 17.6521C22.3172 17.8503 22.3878 18.0833 22.3878 18.3217C22.3878 18.6414 22.261 18.948 22.0353 19.1741C21.8096 19.4001 21.5034 19.5271 21.1842 19.5271ZM10.592 19.286H7.70319V0.964302C7.70319 0.708553 7.60174 0.463279 7.42116 0.282437C7.24057 0.101596 6.99565 0 6.74027 0H4.81441C4.55903 0 4.3141 0.101596 4.13352 0.282437C3.95294 0.463279 3.85149 0.708553 3.85149 0.964302V19.286H0.962706C0.10871 19.286 -0.322801 20.3251 0.283241 20.932L5.09787 26.7178C5.27844 26.8985 5.52327 27 5.77854 27C6.03382 27 6.27865 26.8985 6.45921 26.7178L11.2738 20.932C11.8769 20.3263 11.4478 19.286 10.592 19.286Z" fill="#BE1622"/>
            </svg>
          }


        </div>
      </div>

      <ul className="detalisation-list goods-stat-detalisation__change-goods">
        <li
          disabled={ isLoad }
          className={`detalisation-list__item ${ !isFavoriteChange ? 'detalisation-list__item--active' : '' }`}
          onClick={async () => {
            setIsFavoriteChange(false);
            setLocalStorageFavoriteChangeStatDetalisation(false);

            const newProducts = await fetchProducts(date.from, date.to, typeValue, typeValueCalculate, sort, 1, idFirms, false, false);

            setProducts(newProducts);
          }}
        >
          все товары
        </li>
        <li
          className={`detalisation-list__item ${ isFavoriteChange ? 'detalisation-list__item--active' : '' }`}
          onClick={async () => {
            setIsFavoriteChange(true);
            setLocalStorageFavoriteChangeStatDetalisation(true);

            const newProducts = await fetchProducts(date.from, date.to, typeValue, typeValueCalculate, sort, 1, idFirms, false, true);

            setProducts(newProducts);
          }}
        >
          избранные товары
        </li>
      </ul>

      {
        isLoad ?
          <>
            <Preloader width={25} height={25} color="#000000"/>
          </>

          :
          <ul className="goods-stat-list goods-stat-detalisation__list">
            {
              products && products.length > 0 ?
                products.map((product) => {
                  return <li className="goods-stat-list__item">
                    <div className="goods-stat-list__name-block">
                      <div className="goods-stat-list__name">
                        <Link className="link-reset" to={`${AppRoute.Monitoring}/${product.idProduct}`}>
                          { truncate(product.productName, 30) }
                        </Link>
                      </div>
                      <div className="goods-stat-list__firm">
                        <Link to={`/firm/${product.idFirm}/edit`} className="link-reset">
                          { product.firmName }
                        </Link> - { product.parentFolder.name }
                      </div>
                    </div>

                    {
                      typeValueCalculate === TypeValueCalculateStatDetalisation.PERCENT &&
                      <div className={`goods-stat-list__stat goods-stat-list__stat--${product.stat.percent > 0 ? 'green' : 'red'}`}>
                        { product.stat.percent > 0 ? `+${ product.stat.percent }` : (product.stat.percent ? product.stat.percent : '0') } %
                      </div>
                    }

                    {
                      typeValueCalculate === TypeValueCalculateStatDetalisation.VALUE &&
                      <div className={`goods-stat-list__stat goods-stat-list__stat--${product.stat.value > 0 ? 'green' : 'red'}`}>
                        { product.stat.value > 0 ? `+${ product.stat.value }` : (product.stat.value ? product.stat.value : '0')}
                        { typeValue === TypeValueStatDetalisation.PRICE ? ' руб.' : ' шт.'}
                      </div>
                    }

                  </li>
                })
                :
                'Нет данных для отображения'
            }
          </ul>
      }

      {
        !isLoad && (products.length >= 10) &&
        <button
          disabled={ isLoadNewProduct }
          className="button button--no-background button--text-center goods-stat-detalisation__more"
          onClick={async () => {
            setIsLoadNewProduct(true);
            const idFirms = getIdFirmsSelect(firms);

            const newProducts = await fetchProducts(date.from, date.to, typeValue, typeValueCalculate, sort, page + 1, idFirms, true, isFavoriteChange);

            setProducts([...products, ...newProducts]);
            setPage(page + 1);
            setIsLoadNewProduct(false);
          }}
        >
          {
            isLoadNewProduct && 'Идёт загрузка...'
          }

          {
            !isLoadNewProduct && 'Показать ещё'
          }
        </button>
      }
    </div>
  );
}

export default StatDetalisation;

