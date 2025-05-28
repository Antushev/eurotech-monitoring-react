import React, { useState } from 'react';
import { truncate } from "../../utils/common.js";
import { Link } from "react-router-dom";

import {
  AppRoute,
  TypeValueStatDetalisation,
  TypeValueCalculateStatDetalisation
} from "../../const.js";

import Preloader from "../preloader/preloader.jsx";

const StatDetalisation = (props) => {
  const {
    products,
    typeValue,
    typeValueCalculate,
    isLoad,
    setIsOpenPopup
  } = props;

  return (
    <div className="page-content__detalisation-block goods-stat-detalisation standart-block">
      <div className="goods-stat-detalisation__header">
        <div className="goods-stat-detalisation__header-block">
          <h2 className="header header--2">Динамика изменения цен</h2>

          <label
            className="goods-stat-detalisation__date label__text"
            htmlFor="date-for-stat"
          >
            19.05.2025 - 25.05.2025
          </label>
          <input
            id="date-for-stat"
            className="input visually-hidden"
            type="date"
          />
        </div>

        <div className="goods-stat-detalisation__settings">
          <svg
            className="icon"
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
        </div>
      </div>

      <ul className="detalisation-list goods-stat-detalisation__change-goods">
        <li className="detalisation-list__item detalisation-list__item--active">Все товары</li>
        <li className="detalisation-list__item">Избранные товары</li>
      </ul>

      {
        isLoad ?
          <Preloader width={25} height={25} color="#000000"/>
          :
          <ul className="goods-stat-list goods-stat-detalisation__list">
            {
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
                      { product.stat.percent > 0 ? `+${ product.stat.percent }` : product.stat.percent } %
                    </div>
                  }

                  {
                    typeValueCalculate === TypeValueCalculateStatDetalisation.VALUE &&
                    <div className={`goods-stat-list__stat goods-stat-list__stat--${product.stat.value > 0 ? 'green' : 'red'}`}>
                      { product.stat.value > 0 ? `+${ product.stat.value }` : product.stat.value }
                      { typeValue === TypeValueStatDetalisation.PRICE ? 'руб.' : 'шт.'}
                    </div>
                  }

                </li>
              })
            }
          </ul>
      }

      {
        isLoad || products.length <= 10 &&
        <div className="goods-stat-detalisation__more">Показать больше товаров</div>
      }
    </div>
  );
}

export default StatDetalisation;
