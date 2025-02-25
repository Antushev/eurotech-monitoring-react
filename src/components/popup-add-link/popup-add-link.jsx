import React, {useState, useRef, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import * as dayjs from "dayjs";
import debounce from 'debounce';

import { ID_EXTENSION, MethodSelectData } from '../../const.js';

import { api } from '../../store/index.js';

import {
  fetchProductsWithSummaryDetail,
  fetchParseData,
  createLink
} from '../../store/api-actions.js';
import { clearParseData } from '../../store/app-data/app-data.js';

import Preloader from '../../components/preloader/preloader.jsx';

import {
  getCurrentUser,
  getCurrentProduct,
  getStatusLoadProducts,
  getStatusLoadLink
} from '../../store/app-data/selectors.js';

const INTERVAL_CHECK_INSTALL_EXTENSION = 1000;

const PopupAddLink = (props) => {
  const dispatch = useDispatch();

  const {
    firm,
    product,
    setIsOpen
  } = props;

  const currentUser = useSelector(getCurrentUser);
  const currentProduct = useSelector(getCurrentProduct);

  const isLoadLink = useSelector(getStatusLoadLink);
  const isLoadProducts = useSelector(getStatusLoadProducts);

  const [parseData, setParseData] = useState(null);
  const [versionExtension, setVersionExtension] = useState(false);
  const [methodSelectData, setMethodSelectData] = useState(MethodSelectData.DEFAULT);
  const [errorParseData, setErrorParseData] = useState(null);
  const [isLoadLinkConsumer, setIsLoadLinkConsumer] = useState(false);
  const [statusLink, setStatusLink] = useState(false);

  const inputRef = useRef();

  const checkInstallExtension = async (idExtension) => {
    return await chrome.runtime.sendMessage(idExtension, {message: "version"},
      function (reply) {
        if (reply.version && typeof reply.version !== 'undefined') {
          setVersionExtension(reply.version);
        } else {
          setVersionExtension(null);
        }
      });
  }

  useEffect(() => {
    const interval = setInterval(async () => {
      await checkInstallExtension(ID_EXTENSION);
    }, INTERVAL_CHECK_INSTALL_EXTENSION);

    return () => clearInterval(interval);
  }, []);

  const loadLink = async (methodSelectData) => {
    setErrorParseData(null);

    if (inputRef.current.value === '') {
      setParseData(null);
      setStatusLink(false);
      setIsLoadLinkConsumer(false);

      return false;
    }

    setIsLoadLinkConsumer(true);
    setStatusLink(false);
    setParseData(null);

    const isHttps = inputRef.current.value.includes('https://');
    const isFirmSite = inputRef.current.value.includes(`${firm.site}`);
    if (!isHttps) {
      setErrorParseData('Отсутствует указание протокола https:// в ссылке');
      toast.warning('Отсутствует указание протокола https:// в ссылке');
    } else if (!isFirmSite) {
      setErrorParseData(`Данная ссылка не на товар с сайта конкурента ${firm.site}`);
      toast.warning(`Данная ссылка не на товар с сайта конкурента ${firm.site}`);
    } else {
      const parseSettings = {
        link: inputRef.current.value,
        idFirm: firm.id
      }
      setErrorParseData(null);

      if (methodSelectData === MethodSelectData.DEFAULT) {
        const {data, status} = await api.post(`/parser/`, parseSettings);

        if (status !== 200) {
          setIsLoadLinkConsumer(false);
          setErrorParseData('Ссылка не действительна');
          setParseData(null);
        }

        setParseData(data);
        setStatusLink(true);
        setErrorParseData(null);
      }

      if (methodSelectData === MethodSelectData.EXTENSION) {
        const {status} = await api.post(`/parser/`, parseSettings);

        if (status !== 200) {
          setIsLoadLinkConsumer(false);
          setErrorParseData('Ссылка не действительна');
          setParseData(null);
        }

        setStatusLink(true);
      }

      setIsLoadLinkConsumer(false);
    }
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
            inputRef.current.value = '';
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path
              d="M11.8516 8.59375L16.7378 3.70752C17.3374 3.10791 17.3374 2.13574 16.7378 1.53564L15.6519 0.449707C15.0522 -0.149902 14.0801 -0.149902 13.48 0.449707L8.59375 5.33594L3.70752 0.449707C3.10791 -0.149902 2.13574 -0.149902 1.53564 0.449707L0.449707 1.53564C-0.149902 2.13525 -0.149902 3.10742 0.449707 3.70752L5.33594 8.59375L0.449707 13.48C-0.149902 14.0796 -0.149902 15.0518 0.449707 15.6519L1.53564 16.7378C2.13525 17.3374 3.10791 17.3374 3.70752 16.7378L8.59375 11.8516L13.48 16.7378C14.0796 17.3374 15.0522 17.3374 15.6519 16.7378L16.7378 15.6519C17.3374 15.0522 17.3374 14.0801 16.7378 13.48L11.8516 8.59375Z"
              fill="#BE1622"/>
          </svg>
        </div>

        <h2 className="header header--2 header--center header--space-bottom">Добавление ссылки на товар</h2>

        <ul className="info-list info-list--margin-bottom">
          <li className="info-list__item">
            <svg className="info-list__icon" width="25" height="20" viewBox="0 0 25 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M25 7.98623V8.68068C25 9.25598 24.5336 9.72235 23.9583 9.72235H23.6111L22.4777 17.6559C22.3311 18.6822 21.4521 19.4446 20.4154 19.4446H4.58464C3.54787 19.4446 2.66888 18.6822 2.52222 17.6559L1.38889 9.72235H1.04167C0.466363 9.72235 0 9.25598 0 8.68068V7.98623C0 7.41093 0.466363 6.94457 1.04167 6.94457H3.96445L8.599 0.572128C9.05017 -0.0481843 9.91875 -0.185381 10.5391 0.265791C11.1595 0.716963 11.2967 1.58558 10.8455 2.20594L7.39918 6.94457H17.6008L14.1545 2.2059C13.7033 1.58558 13.8405 0.71692 14.4609 0.265748C15.0812 -0.185424 15.9499 -0.0482711 16.401 0.572085L21.0355 6.94457H23.9583C24.5336 6.94457 25 7.41093 25 7.98623ZM13.5417 15.6251V10.764C13.5417 10.1887 13.0753 9.72235 12.5 9.72235C11.9247 9.72235 11.4583 10.1887 11.4583 10.764V15.6251C11.4583 16.2004 11.9247 16.6668 12.5 16.6668C13.0753 16.6668 13.5417 16.2004 13.5417 15.6251ZM18.4028 15.6251V10.764C18.4028 10.1887 17.9364 9.72235 17.3611 9.72235C16.7858 9.72235 16.3194 10.1887 16.3194 10.764V15.6251C16.3194 16.2004 16.7858 16.6668 17.3611 16.6668C17.9364 16.6668 18.4028 16.2004 18.4028 15.6251ZM8.68056 15.6251V10.764C8.68056 10.1887 8.21419 9.72235 7.63889 9.72235C7.06358 9.72235 6.59722 10.1887 6.59722 10.764V15.6251C6.59722 16.2004 7.06358 16.6668 7.63889 16.6668C8.21419 16.6668 8.68056 16.2004 8.68056 15.6251Z" fill="#141414" fill-opacity="0.9"/>
            </svg>

            <Link to={`/monitoring/${product.id}`} target="_blank">
              {product.name}
            </Link>

          </li>
          <li className="info-list__item">
            <svg className="info-list__icon" width="25" height="20" viewBox="0 0 25 20">
              <path d="M22.9167 0H2.08333C0.93316 0 0 0.93316 0 2.08333V17.3611C0 18.5113 0.93316 19.4444 2.08333 19.4444H22.9167C24.0668 19.4444 25 18.5113 25 17.3611V2.08333C25 0.93316 24.0668 0 22.9167 0ZM7.63889 4.16667C9.17101 4.16667 10.4167 5.41233 10.4167 6.94444C10.4167 8.47656 9.17101 9.72222 7.63889 9.72222C6.10677 9.72222 4.86111 8.47656 4.86111 6.94444C4.86111 5.41233 6.10677 4.16667 7.63889 4.16667ZM12.5 14.4444C12.5 14.9045 12.066 15.2778 11.5278 15.2778H3.75C3.21181 15.2778 2.77778 14.9045 2.77778 14.4444V13.6111C2.77778 12.2309 4.0842 11.1111 5.69444 11.1111H5.91146C6.44531 11.3325 7.02691 11.4583 7.63889 11.4583C8.25087 11.4583 8.83681 11.3325 9.36632 11.1111H9.58333C11.1936 11.1111 12.5 12.2309 12.5 13.6111V14.4444ZM22.2222 12.1528C22.2222 12.3437 22.066 12.5 21.875 12.5H15.625C15.434 12.5 15.2778 12.3437 15.2778 12.1528V11.4583C15.2778 11.2674 15.434 11.1111 15.625 11.1111H21.875C22.066 11.1111 22.2222 11.2674 22.2222 11.4583V12.1528ZM22.2222 9.375C22.2222 9.56597 22.066 9.72222 21.875 9.72222H15.625C15.434 9.72222 15.2778 9.56597 15.2778 9.375V8.68055C15.2778 8.48958 15.434 8.33333 15.625 8.33333H21.875C22.066 8.33333 22.2222 8.48958 22.2222 8.68055V9.375ZM22.2222 6.59722C22.2222 6.78819 22.066 6.94444 21.875 6.94444H15.625C15.434 6.94444 15.2778 6.78819 15.2778 6.59722V5.90278C15.2778 5.7118 15.434 5.55555 15.625 5.55555H21.875C22.066 5.55555 22.2222 5.7118 22.2222 5.90278V6.59722Z" fill="#141414" fill-opacity="0.9"/>
            </svg>

            <Link to={`/firm/${firm.id}/edit`} target="_blank">
              {firm.name}
            </Link>
          </li>
          <li className="info-list__item">
            <svg className="info-list__icon" width="25" height="25" viewBox="0 0 15 15">
              <path d="M9.78628 5.93402C11.42 7.56942 11.3976 10.1914 9.79612 11.8017C9.79312 11.805 9.78956 11.8086 9.78628 11.8118L7.94878 13.6493C6.32812 15.27 3.69139 15.2698 2.07097 13.6493C0.450303 12.0289 0.450303 9.39191 2.07097 7.77152L3.08558 6.7569C3.35465 6.48784 3.81801 6.66667 3.83191 7.04691C3.84962 7.5315 3.93652 8.01835 4.09687 8.4885C4.15117 8.6477 4.11237 8.82379 3.99342 8.94273L3.63558 9.30058C2.86924 10.0669 2.84521 11.3147 3.60399 12.0886C4.37028 12.87 5.62978 12.8747 6.40194 12.1025L8.23944 10.2653C9.01029 9.49442 9.00707 8.24848 8.23944 7.48086C8.13825 7.37985 8.03631 7.30137 7.95668 7.24655C7.90035 7.20787 7.85384 7.15655 7.82086 7.09671C7.78788 7.03686 7.76934 6.97013 7.76673 6.90185C7.7559 6.61291 7.85827 6.31516 8.08659 6.08684L8.66229 5.51112C8.81325 5.36016 9.05008 5.34162 9.22513 5.46379C9.42561 5.60378 9.61338 5.76113 9.78628 5.93402ZM13.64 2.08014C12.0196 0.45969 9.38282 0.459471 7.76216 2.08014L5.92466 3.91764C5.92138 3.92092 5.91782 3.92447 5.91482 3.92775C4.3134 5.53808 4.29095 8.16005 5.92466 9.79545C6.09755 9.96834 6.28531 10.1257 6.48578 10.2657C6.66084 10.3878 6.89769 10.3693 7.04862 10.2183L7.62432 9.6426C7.85264 9.41428 7.95501 9.11653 7.94419 8.82759C7.94157 8.75931 7.92303 8.69258 7.89005 8.63273C7.85707 8.57289 7.81056 8.52158 7.75423 8.48289C7.67461 8.42807 7.57267 8.34959 7.47147 8.24859C6.70385 7.48096 6.70062 6.23502 7.47147 5.46417L9.30897 3.62694C10.0811 2.85478 11.3406 2.85943 12.1069 3.64089C12.8657 4.41472 12.8417 5.66252 12.0753 6.42886L11.7175 6.78671C11.5985 6.90565 11.5597 7.08175 11.614 7.24094C11.7744 7.71109 11.8613 8.19794 11.879 8.68253C11.8929 9.06277 12.3563 9.2416 12.6253 8.97254L13.6399 7.95792C15.2606 6.33756 15.2606 3.70053 13.64 2.08014Z" fill="black"/>
            </svg>

            <a href={`https://${firm.site}`} target="_bulk">{firm.site}</a>
          </li>
        </ul>

        <ul className="add-link-list">
          <li className="add-link-list__item add-link-list__item--active">
            <div className="add-link-list__item-content">
              <h3 className="header header--3 add-link-list__header">Шаг 1. Ввод и проверка ссылки</h3>
              <ul className="detalisation-list add-link-list__detalisation">
                <li className="detalisation-list__item detalisation-list__item--info">Способ извлечения данных: </li>
                <li
                  className={`detalisation-list__item ${methodSelectData === MethodSelectData.DEFAULT ? 'detalisation-list__item--active' : ''}`}
                  onClick={ async () => {
                    setParseData(null);
                    loadLink(MethodSelectData.DEFAULT);
                    setMethodSelectData(MethodSelectData.DEFAULT);
                  }}
                >
                  По умолчанию
                </li>

                <li
                  className={`detalisation-list__item ${methodSelectData === MethodSelectData.EXTENSION ? 'detalisation-list__item--active' : ''}`}
                  onClick={async () => {
                    setParseData(null);
                    setMethodSelectData(MethodSelectData.EXTENSION);
                    loadLink(MethodSelectData.EXTENSION);
                  }}
                >
                  При помощи расширения
                </li>
              </ul>
              <label className="label input-label--no-margin-bottom">
                <input
                  ref={inputRef}
                  className={
                    errorParseData ? 'input input--no-margin-bottom input--error' : 'input input--no-margin-bottom'
                  }
                  name="link"
                  type="link"
                  placeholder="Ссылка на карточку товара"
                  onChange={debounce(async () => await loadLink(methodSelectData), 100)}
                />
                {
                  statusLink &&
                  <span className="label__preloader">
                    <svg width="26" height="20" viewBox="0 0 26 20">
                      <path d="M8.87532 19.0563L0.750317 10.9313C0.262183 10.4432 0.262183 9.65174 0.750317 9.16355L2.51804 7.39578C3.00618 6.9076 3.79768 6.9076 4.28582 7.39578L9.75921 12.8691L21.4826 1.14578C21.9707 0.657645 22.7622 0.657645 23.2504 1.14578L25.0181 2.91355C25.5062 3.40169 25.5062 4.19314 25.0181 4.68133L10.6431 19.0564C10.1549 19.5445 9.36345 19.5445 8.87532 19.0563Z" fill="#6ace34"/>
                    </svg>
                  </span>
                }

                {
                  isLoadLinkConsumer &&
                  <span className="label__preloader">
                    <Preloader color='#000000' width="20" height="20"/>
                 </span>
                }
              </label>
              {
                errorParseData !== null &&
                <div className="input-error-block">
                  {errorParseData}
                </div>
              }
              {
                methodSelectData === MethodSelectData.EXTENSION &&
                <div className="add-link-list__extension">
                  <a className="add-link-list__link" href="/other/eurotech-monitoring.zip">
                    {
                      (!versionExtension || false) &&
                      <>
                        <svg className="icon firm-add__link-icon" width="25" height="25" viewBox="0 0 15 15">
                          <path d="M9.78628 5.93402C11.42 7.56942 11.3976 10.1914 9.79612 11.8017C9.79312 11.805 9.78956 11.8086 9.78628 11.8118L7.94878 13.6493C6.32812 15.27 3.69139 15.2698 2.07097 13.6493C0.450303 12.0289 0.450303 9.39191 2.07097 7.77152L3.08558 6.7569C3.35465 6.48784 3.81801 6.66667 3.83191 7.04691C3.84962 7.5315 3.93652 8.01835 4.09687 8.4885C4.15117 8.6477 4.11237 8.82379 3.99342 8.94273L3.63558 9.30058C2.86924 10.0669 2.84521 11.3147 3.60399 12.0886C4.37028 12.87 5.62978 12.8747 6.40194 12.1025L8.23944 10.2653C9.01029 9.49442 9.00707 8.24848 8.23944 7.48086C8.13825 7.37985 8.03631 7.30137 7.95668 7.24655C7.90035 7.20787 7.85384 7.15655 7.82086 7.09671C7.78788 7.03686 7.76934 6.97013 7.76673 6.90185C7.7559 6.61291 7.85827 6.31516 8.08659 6.08684L8.66229 5.51112C8.81325 5.36016 9.05008 5.34162 9.22513 5.46379C9.42561 5.60378 9.61338 5.76113 9.78628 5.93402ZM13.64 2.08014C12.0196 0.45969 9.38282 0.459471 7.76216 2.08014L5.92466 3.91764C5.92138 3.92092 5.91782 3.92447 5.91482 3.92775C4.3134 5.53808 4.29095 8.16005 5.92466 9.79545C6.09755 9.96834 6.28531 10.1257 6.48578 10.2657C6.66084 10.3878 6.89769 10.3693 7.04862 10.2183L7.62432 9.6426C7.85264 9.41428 7.95501 9.11653 7.94419 8.82759C7.94157 8.75931 7.92303 8.69258 7.89005 8.63273C7.85707 8.57289 7.81056 8.52158 7.75423 8.48289C7.67461 8.42807 7.57267 8.34959 7.47147 8.24859C6.70385 7.48096 6.70062 6.23502 7.47147 5.46417L9.30897 3.62694C10.0811 2.85478 11.3406 2.85943 12.1069 3.64089C12.8657 4.41472 12.8417 5.66252 12.0753 6.42886L11.7175 6.78671C11.5985 6.90565 11.5597 7.08175 11.614 7.24094C11.7744 7.71109 11.8613 8.19794 11.879 8.68253C11.8929 9.06277 12.3563 9.2416 12.6253 8.97254L13.6399 7.95792C15.2606 6.33756 15.2606 3.70053 13.64 2.08014Z" fill="#be1622"/>
                        </svg>
                        <span>Ссылка на скачивание расширения</span>
                      </>

                    }

                    {
                      versionExtension &&
                      <>
                        <svg className="icon firm-add__link-icon" width="26" height="20" viewBox="0 0 26 20">
                          <path d="M8.87532 19.0563L0.750317 10.9313C0.262183 10.4432 0.262183 9.65174 0.750317 9.16355L2.51804 7.39578C3.00618 6.9076 3.79768 6.9076 4.28582 7.39578L9.75921 12.8691L21.4826 1.14578C21.9707 0.657645 22.7622 0.657645 23.2504 1.14578L25.0181 2.91355C25.5062 3.40169 25.5062 4.19314 25.0181 4.68133L10.6431 19.0564C10.1549 19.5445 9.36345 19.5445 8.87532 19.0563Z" fill="#6ace34"/>
                        </svg>
                        <span className="firm-add__link-text-green">Установлена последняя версия расширения</span>
                      </>
                    }
                  </a>

                  <button
                    disabled={ !versionExtension }
                    className={`button button--margin-right ${ !versionExtension ? 'button--disabled' : '' }`}
                  >
                    <svg className="icon icon--white icon--margin-right" width="18" height="20" viewBox="0 0 18 20">
                      <path d="M16.3161 8.42418L2.95858 0.527313C1.87328 -0.113999 0.211182 0.50834 0.211182 2.09454V17.8845C0.211182 19.3075 1.75564 20.1651 2.95858 19.4517L16.3161 11.5586C17.5076 10.8566 17.5114 9.12621 16.3161 8.42418Z" fill="white"/>
                    </svg>

                    Выбрать данные
                  </button>
                </div>
              }
            </div>

            <div className="add-link-list__progress progress">
              <div
                className={ `progress__circle ${
                  parseData && parseData.price
                    ? 'progress__circle--active' : ''}` }
              >
                {
                  parseData && parseData.price ?
                  <svg width="26" height="20" viewBox="0 0 26 20">
                  <path d="M8.87532 19.0563L0.750317 10.9313C0.262183 10.4432 0.262183 9.65174 0.750317 9.16355L2.51804 7.39578C3.00618 6.9076 3.79768 6.9076 4.28582 7.39578L9.75921 12.8691L21.4826 1.14578C21.9707 0.657645 22.7622 0.657645 23.2504 1.14578L25.0181 2.91355C25.5062 3.40169 25.5062 4.19314 25.0181 4.68133L10.6431 19.0564C10.1549 19.5445 9.36345 19.5445 8.87532 19.0563Z" fill="#ffffff"/>
                  </svg> :
                  <svg width="15" height="19" viewBox="0 0 15 19">
                    <path d="M13.3594 2.375C13.8513 2.375 14.25 1.97626 14.25 1.48438V0.890625C14.25 0.39874 13.8513 0 13.3594 0H0.890625C0.39874 0 0 0.39874 0 0.890625V1.48438C0 1.97626 0.39874 2.375 0.890625 2.375C0.890625 5.75065 2.7838 8.5995 5.375 9.5C2.7838 10.4005 0.890625 13.2493 0.890625 16.625C0.39874 16.625 0 17.0237 0 17.5156V18.1094C0 18.6013 0.39874 19 0.890625 19H13.3594C13.8513 19 14.25 18.6013 14.25 18.1094V17.5156C14.25 17.0237 13.8513 16.625 13.3594 16.625C13.3594 13.2493 11.4662 10.4005 8.875 9.5C11.4662 8.5995 13.3594 5.75065 13.3594 2.375Z" fill="#141414" fill-opacity="0.9"/>
                  </svg>
                }

              </div>
              {
                parseData && parseData.price ?
                <div className="progress__line progress__line--active add-link-list__progress-line" />
                  :  <div className="progress__line add-link-list__progress-line" />
              }

            </div>
          </li>
          <li className="add-link-list__item">
            <div>
              <h3 className="header header--3 add-link-list__header">Шаг 2. Проверка извлечённых данных</h3>
              <div className="parse-data">
                <div className="parse-data__data parse-data--price">
                  {
                    (parseData && parseData?.price) &&
                    <>
                      <span>Цена:</span> <b>{parseData.price.toLocaleString()} руб.</b>
                    </>
                  }

                  {
                    (!parseData || !parseData.price) &&
                      <>
                        <span>Цена: </span>
                        <Preloader width='15px' height='15px' color='#000000'/> ожидание данных
                      </>

                  }
                </div>
                <div className="parse-data__data parse-data__count">
                  {
                    (parseData && parseData?.count) &&
                    <>
                      <span>Наличие:</span> <b>{parseData.count.toLocaleString()} шт.</b>
                    </>
                  }

                  {
                    (parseData === null) &&
                    <>
                      <span>Наличие: </span>
                      <Preloader width='15px' height='15px' color='#000000'/> ожидание данных
                    </>

                  }

                  {
                    (parseData && parseData.count === null) &&
                    <>
                      <span>Наличие: </span>
                      <b>отсутствует на странице</b>
                    </>
                  }

                </div>

                <p className="add-link-list__text">Если всё верно, нажмите кнопку «Добавить ссылку», либо замените ссылку на другую.</p>
              </div>
            </div>

            <div className="progress">
              <div
                className={ `progress__circle ${parseData && parseData.price ? 'progress__circle--active' : ''}` }
              >
                {
                  parseData && parseData.price ?
                    <svg width="26" height="20" viewBox="0 0 26 20">
                      <path d="M8.87532 19.0563L0.750317 10.9313C0.262183 10.4432 0.262183 9.65174 0.750317 9.16355L2.51804 7.39578C3.00618 6.9076 3.79768 6.9076 4.28582 7.39578L9.75921 12.8691L21.4826 1.14578C21.9707 0.657645 22.7622 0.657645 23.2504 1.14578L25.0181 2.91355C25.5062 3.40169 25.5062 4.19314 25.0181 4.68133L10.6431 19.0564C10.1549 19.5445 9.36345 19.5445 8.87532 19.0563Z" fill="#ffffff"/>
                    </svg> :
                    <svg width="15" height="19" viewBox="0 0 15 19">
                      <path d="M13.3594 2.375C13.8513 2.375 14.25 1.97626 14.25 1.48438V0.890625C14.25 0.39874 13.8513 0 13.3594 0H0.890625C0.39874 0 0 0.39874 0 0.890625V1.48438C0 1.97626 0.39874 2.375 0.890625 2.375C0.890625 5.75065 2.7838 8.5995 5.375 9.5C2.7838 10.4005 0.890625 13.2493 0.890625 16.625C0.39874 16.625 0 17.0237 0 17.5156V18.1094C0 18.6013 0.39874 19 0.890625 19H13.3594C13.8513 19 14.25 18.6013 14.25 18.1094V17.5156C14.25 17.0237 13.8513 16.625 13.3594 16.625C13.3594 13.2493 11.4662 10.4005 8.875 9.5C11.4662 8.5995 13.3594 5.75065 13.3594 2.375Z" fill="#141414" fill-opacity="0.9"/>
                    </svg>
                }

              </div>
            </div>
          </li>
        </ul>
        <button
          disabled={!parseData || !parseData?.price }
          className="button button--text-center"
          onClick={async () => {
            await dispatch(createLink({
              idFirm: firm.id,
              idProduct: product.id,
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
            setParseData(null);
          }}
        >
          {
            isLoadLink || isLoadProducts ? <Preloader /> : 'Добавить ссылку'
          }
        </button>
      </div>
    </>
  );
}

export default PopupAddLink;
