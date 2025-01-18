import React from 'react';
import { useDispatch } from 'react-redux';

import { sortMarks } from '../../store/app-data/app-data.js';

import Preloader from '../preloader/preloader.jsx';

const WIDTH_PRELOADER = 15;
const HEIGHT_PRELOADER = 15;
const COLOR_PRELOADER = '#203264';

const ProductsList = (props) => {
  const dispatch = useDispatch();

  const {
    products,
    currentProduct,
    onClickCurrentProduct
  } = props;

  return (
    <ul className="products-list">
      <li className="products-list__item products-list__item--header">
        <span>Наименование</span>
        <span
          onClick={() => {
            dispatch(sortMarks());
          }}
        >
          Показы
        </span>
      </li>
      {products.length !== 0
        ?
        products.map((product, index) => {
          return (

            <li
              onClick={() => {
                onClickCurrentProduct(product)
              }}
              key={index}
              className={currentProduct !== null && currentProduct._id === product._id
                ? 'products-list__item products-list__item--active' : 'products-list__item'}>
              <span>{product.name}</span>
              <span>{product.totalShow === null
                ? <Preloader
                  width={ WIDTH_PRELOADER }
                  height={ HEIGHT_PRELOADER }
                  color={ COLOR_PRELOADER }
                /> : product.totalShow}</span>
            </li>
          )
        })
        : <p>Маркировки не найдены</p>
      }
    </ul>
  );
}

export default ProductsList;
