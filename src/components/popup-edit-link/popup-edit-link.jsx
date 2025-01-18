import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as dayjs from "dayjs";

import {
  fetchParseData,
  fetchProductsWithSummaryDetail,
  updateLink
} from "../../store/api-actions";
import { setParseData } from "../../store/app-data/app-data";
import {
  getCurrentUser,
  getCurrentProduct,
  getParseData,
  getStatusLoadProducts,
  getStatusLoadParseData,
  getStatusLoadLink
} from '../../store/app-data/selectors.js';

import Preloader from "../../components/preloader/preloader.jsx";

const PopupEditLink = (props) => {
  const dispatch = useDispatch();

  const {
    stats,
    setIsOpen
  } = props;

  const { firm, product, stat } = stats;

  const currentUser = useSelector(getCurrentUser);
  const currentProduct = useSelector(getCurrentProduct);
  let parseData = useSelector(getParseData);
  const isLoadParseData = useSelector(getStatusLoadParseData);
  const isLoadLink = useSelector(getStatusLoadLink);
  const isLoadProducts = useSelector(getStatusLoadProducts);

  const [errorParseData, setErrorParseData] = useState(null);

  const inputRef = useRef();

  const styleButtonSuccess = {
    backgroundColor: '#6ace34'
  }

  return (
    <>
      <div className="background-black" />
      <div className="modal">
        <div
          className="modal__close"
          onClick={() => {
            setIsOpen(false);
            setErrorParseData(null);
            dispatch(setParseData(null));
            inputRef.current.value = '';
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path
              d="M11.8516 8.59375L16.7378 3.70752C17.3374 3.10791 17.3374 2.13574 16.7378 1.53564L15.6519 0.449707C15.0522 -0.149902 14.0801 -0.149902 13.48 0.449707L8.59375 5.33594L3.70752 0.449707C3.10791 -0.149902 2.13574 -0.149902 1.53564 0.449707L0.449707 1.53564C-0.149902 2.13525 -0.149902 3.10742 0.449707 3.70752L5.33594 8.59375L0.449707 13.48C-0.149902 14.0796 -0.149902 15.0518 0.449707 15.6519L1.53564 16.7378C2.13525 17.3374 3.10791 17.3374 3.70752 16.7378L8.59375 11.8516L13.48 16.7378C14.0796 17.3374 15.0522 17.3374 15.6519 16.7378L16.7378 15.6519C17.3374 15.0522 17.3374 14.0801 16.7378 13.48L11.8516 8.59375Z"
              fill="#BE1622"/>
          </svg>
        </div>

        <h2 className="header header--2 header--center header--space-bottom">Редактирование ссылки на продукт</h2>

        <ul className="add-link-list">
          <li className="add-link-list__item add-link-list__item--active">
            <h3 className="header header--3 add-link-list__header">Шаг 1. Ввод и проверка новой ссылки</h3>
            <label className="input-label">
              Введите новую ссылку на карточку товара <b>{product.name}</b> с сайта <a href={`https://${firm.site}`} target="_bulk">{firm.site}</a> конкурента <b>{firm.name}</b>
              <br />
              <i>Текущая ссылка:</i> <a href={stat.linkProduct} target="_blank">Перейти</a>
            </label>
            <div className="form-block">
              <input
                ref={inputRef}
                className={
                  errorParseData !== null
                    ? `input input--line input--error`
                    : `input input--line`
                }
                name="link"
                type="link"
                placeholder={`Новая ссылка: https://${firm.site}/raspredelitel-1-p-40`}
                onChange={() => {
                  dispatch(setParseData(null));
                }}
              />
              <button
                style={parseData && parseData.price && styleButtonSuccess}
                className="button button--form-line"
                onClick={async () => {
                  const isHttps = inputRef.current.value.includes('https://');
                  const isFirmSite = inputRef.current.value.includes(`${firm.site}`);
                  if (!isHttps) {
                    setErrorParseData('отсутствует указание протокола https:// в ссылке');
                  } else if (!isFirmSite) {
                    setErrorParseData(`данная ссылка не на товар с сайта конкурента ${firm.site}`);
                  } else {
                    setErrorParseData(null);
                    await dispatch(fetchParseData(inputRef.current.value));
                  }
                }
                }
              >
                {
                  isLoadParseData ? <Preloader />
                    : parseData !== null && parseData.price !== null
                      ? <svg width="26" height="20" viewBox="0 0 26 20" fill="none">
                        <path d="M8.87532 19.0563L0.750317 10.9313C0.262183 10.4432 0.262183 9.65174 0.750317 9.16355L2.51804 7.39578C3.00618 6.9076 3.79768 6.9076 4.28582 7.39578L9.75921 12.8691L21.4826 1.14578C21.9707 0.657645 22.7622 0.657645 23.2504 1.14578L25.0181 2.91355C25.5062 3.40169 25.5062 4.19314 25.0181 4.68133L10.6431 19.0564C10.1549 19.5445 9.36345 19.5445 8.87532 19.0563Z" fill="#ffffff"/>
                      </svg> : 'Проверить'

                }
              </button>
            </div>
            {
              errorParseData !== null &&
              <div className="input-error-block">
                Ссылка введена неверно: <b>{errorParseData}</b>
              </div>
            }
          </li>
          {
            parseData !== null && parseData.price !== null &&
            <li className="add-link-list__item">
              <h3 className="header header--3 add-link-list__header">Шаг 2. Проверка извлечённых данных</h3>
              <p className="add-link-list__text">
                Данные успешно извлечены по ранее предоставленной ссылке.
              </p>
              <div className="parse-data">
                <div>Цена: <b>{parseData.price.toLocaleString()} руб.</b></div>
                <div>Наличие: <b>{parseData.count === null ? 'Нет данных' : `${parseData.count} шт.`}</b></div>
              </div>

              <div className="message message--warning">
                <svg className="message__icon" width="51" height="45" viewBox="0 0 51 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M49.6153 38.3295C51.2176 41.1068 49.2064 44.5784 46.0062 44.5784H4.34942C1.14308 44.5784 -0.858828 41.1014 0.740304 38.3295L21.5689 2.21597C23.172 -0.562586 27.187 -0.557551 28.7872 2.21597L49.6153 38.3295ZM25.1781 30.8631C22.9728 30.8631 21.185 32.6509 21.185 34.8562C21.185 37.0615 22.9728 38.8492 25.1781 38.8492C27.3834 38.8492 29.1711 37.0615 29.1711 34.8562C29.1711 32.6509 27.3834 30.8631 25.1781 30.8631ZM21.387 16.5102L22.0309 28.3157C22.061 28.8681 22.5178 29.3006 23.071 29.3006H27.2851C27.8383 29.3006 28.2951 28.8681 28.3252 28.3157L28.9691 16.5102C29.0017 15.9135 28.5266 15.4117 27.929 15.4117H22.427C21.8295 15.4117 21.3545 15.9135 21.387 16.5102Z" fill="black"/>
                </svg>
                <span className="message__text">
                  <b>ВНИМАНИЕ!</b> После замены ссылки на новую, все данные, извлечённые по предыдущей ссылке, будут удалены!
                </span>
              </div>

              <p>Если всё верно, нажмите кнопку «Изменить ссылку», либо замените ссылку в поле ввода на другую.</p>
            </li>
          }
        </ul>


        {
          parseData !== null && parseData.price !== null &&
          <>
            <button
              className="button button--text-center"
              onClick={async () => {
                await dispatch(updateLink({
                  idFirm: firm.id,
                  idProduct: product.id,
                  idLink: stat.idLink,
                  link: inputRef.current.value.trim(),
                  price: parseData.price,
                  count: parseData.count
                }));
                await dispatch(fetchProductsWithSummaryDetail({
                  idUser: currentUser.id,
                  idParent: currentProduct !== null ? currentProduct.id : null,
                  withStats: 'summary',
                  dateStart: dayjs().startOf('day'),
                  dateEnd: dayjs().endOf('day')
                }));

                setIsOpen(false);
                setErrorParseData(null);
                dispatch(setParseData(null));
              }}
            >
              {
                isLoadLink || isLoadProducts ? <Preloader /> : 'Изменить ссылку'
              }
            </button>
          </>
        }
      </div>
    </>
  );
}

export default PopupEditLink;
