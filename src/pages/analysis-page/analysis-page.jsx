import React, {useEffect, useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {deleteAll, fetchAllMarks, fetchAllProjects} from '../../store/api-actions';
import {
  getAllMarks,
  getStatusDeleteAllData,
  getStatusLoadMarks
} from '../../store/app-data/selectors';

import ProductsList from './../../components/products-list/products-list.jsx';
import ProductAnalysisInfo from './../../components/product-analysis-info/product-analysis-info.jsx';
import PopupAddMarks from '../../components/popup-add-marks/popup-add-marks.jsx';
import PopupReports from './../../components/popup-reports/popup-reports.jsx';
import Help from './../../components/help/help.jsx';
import Preloader from './../../components/preloader/preloader.jsx';

const WIDTH_PRELOADER = 15;
const HEIGHT_PRELOADER = 15;
const COLOR_PRELOADER = '#203264';

const AnalysisPage = (props) => {
  const dispatch = useDispatch();

  useEffect( () => {
    dispatch(fetchAllMarks());
    dispatch(fetchAllProjects());

    const interval = setInterval(() => {
      dispatch(fetchAllMarks());
      dispatch(fetchAllProjects());

    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const [currentProduct, setCurrentProduct] = useState(null);
  const [isOpenPopupAddProduct, setIsOpenPopupAddProduct] = useState(false);
  const [isOpenPopupReports, setIsOpenPopupReports] = useState(false);

  const products = useSelector(getAllMarks);
  const isProcessDeletedAllProducts = useSelector(getStatusDeleteAllData);
  const isLoadMarks = useSelector(getStatusLoadMarks);

  return (
    <>
      <section className="page-content page__content">
        <header className="page-content__header standart-block">
          <div className="header-block">
            <h1 className="header header--1 header--margin-right">Анализ спроса</h1>

            <Help>
              <p>Данные по показам в столбце "Показы" выводятся за месяц с момента запроса из сервиса Яндекс Wordstat.</p>
            </Help>
          </div>

          <div className="header__buttons">
            <button
              className="button button--no-background button--text-blue header__button--clear"
              type="button"
              onClick={async () => {
                await dispatch(deleteAll());
              }}
            >
              {
                isProcessDeletedAllProducts
                ? <Preloader
                    width={ WIDTH_PRELOADER }
                    height={ HEIGHT_PRELOADER }
                    color={ COLOR_PRELOADER }
                  /> : 'Отчистить все данные'
              }
            </button>

            <button
              className="button"
              type="button"
              onClick={() => {
                setIsOpenPopupReports(true);
              }}
            >
              Отчёты
            </button>
          </div>
        </header>

        <div className="page-content__inner page-content__inner--analyse">
          <section className="products standart-block page-content__products">
            <div className="header-block">
              <h2 className="header header--2 header--space-bottom">Маркировки</h2>


            </div>


            <button
              className="button button--add-excel products__add-button"
              onClick={() => {
                setIsOpenPopupAddProduct(true)
              }}
            >
              <svg className="button__icon" width="30px" height="30px" viewBox="0 0 24 24">
                <path d="M6 12H18M12 6V18" stroke="#ffffff" strokeWidth="3" strokeLinecap="round"
                      strokeLinejoin="round"/>
              </svg>
              <span
                className="button__text"
              >
                Добавить маркировки
              </span>
            </button>

            {isLoadMarks
              ? <Preloader color={COLOR_PRELOADER}/>
              : <ProductsList
              products={products}
              currentProduct={currentProduct}
              onClickCurrentProduct={setCurrentProduct}
            />
            }
          </section>

          <section className="info page-content__info">

            {
              products.length !== 0
                && currentProduct !== null
                ? <ProductAnalysisInfo
                  product={currentProduct}
                /> : ''
            }

            {
              products.length === 0 || currentProduct === null
                ?
                <div className="info__content standart-block">
                  <p>Пожалуйста, выберите маркировку из списка или добавьте при помощи кнопки
                    <a
                      href="#"
                      onClick={() => {
                        setIsOpenPopupAddProduct(true);
                      }}
                    > «Добавить маркировки»</a>
                  </p>
                </div> : ''

            }
          </section>
        </div>
      </section>
      {
        isOpenPopupAddProduct
        ?
          <PopupAddMarks
            isOpen={isOpenPopupAddProduct}
            setIsOpen={setIsOpenPopupAddProduct}
          />
          :''
      }

      {
        isOpenPopupReports
        ?
          <PopupReports
            isOpen={isOpenPopupReports}
            setIsOpen={setIsOpenPopupReports}
          />
          :''
      }

    </>
  );
}

export default AnalysisPage;
