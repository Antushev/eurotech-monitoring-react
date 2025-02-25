import React, {useEffect, useRef, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import debounce from "debounce";

import { ID_EXTENSION } from '../../const.js';

import { api } from "../../store";
import { updateFirm } from '../../store/api-actions.js';
import { getCurrentUser, getStatusLoadFirm } from "../../store/app-data/selectors";

import { CommandForGetDataExtension, getDataExtension } from '../../services/chrome-extension.js';

import Preloader from "../../components/preloader/preloader.jsx";

const TIME_DEBOUNCE = 1000;
const WIDTH_PRELOADER = 20;
const HEIGHT_PRELOADER = 20;
const COLOR_PRELOADER = '#000000';
const INTERVAL_CHECK_DATA_FROM_EXTENSION = 1000;

const stagesInit = {
  installPlugin: true,
  urlSite: true,
  urlProductCard: true,
  elementsSite: true,
  checked: true
}

const FirmEditPage = () => {
  const dispatch = useDispatch();
  const { idFirm } = useParams();

  const isLoadFirm = useSelector(getStatusLoadFirm);
  const currentUser = useSelector(getCurrentUser);

  const firmNameRef = useRef('');
  const innRef = useRef('');
  const kppRef = useRef('');
  const colorRef = useRef('#ffffff');
  const urlSiteRef = useRef('');
  const urlProductCardRef = useRef('');

  const [currentFirm, setCurrentFirm] = useState(null);
  const [errorFirmName, setErrorFirmName] = useState(false);
  const [errorInn, setErrorInn] = useState(false);
  const [errorKpp, setErrorKpp] = useState(false);
  const [errorUrlSite, setErrorUrlSite] = useState(false);
  const [errorUrlProductCard, setErrorUrlProductCard] = useState(false);
  const [stages, setStages] = useState(stagesInit);
  const [versionExtension, setVersionExtension] = useState(false);
  const [isCheckUrlSite, setIsCheckUrlSite] = useState(false);
  const [isCheckUrlProductCard, setIsCheckUrlProductCard] = useState(false);

  const [changeCompleteFromSite, setChangeCompleteFromSite] = useState(true);
  const [priceChangeFromSite, setPriceChangeFromSite] = useState(null);
  const [priceSelectorFromSite, setPriceSelectorFromSite] = useState(null);
  const [countChangeFromSite, setCountChangeFromSite] = useState(null);
  const [countSelectorFromSite, setCountSelectorFromSite] = useState(null);

  const getValidateStatus = () => {
    if (firmNameRef.current.value === '') {
      toast.warning('Необходимо заполнить название фирмы');
      setErrorFirmName(true);

      return false;
    }

    if (innRef.current.value === '') {
      toast.warning('Необходимо заполнить ИНН фирмы');
      setErrorInn(true);

      return false;
    }

    if (kppRef.current.value === '') {
      toast.warning('Необходимо заполнить КПП фирмы');
      setErrorKpp(true);

      return false;
    }

    if (urlSiteRef.current.value === '') {
      toast.warning('Необходимо указать адрес сайта');
      setErrorUrlSite(true);

      return false;
    }

    if (!stages.checked) {
      toast.warning('Необходимо заполнить форму настройки интеграции с сайтом');

      return false;
    }

    return true;
  }

  const checkedUrlSite = async (url) => {
    setIsCheckUrlSite(true);

    const result = await api.post(`/check-url-site/`, { baseURL: url });
    const status = result?.data;

    if (!status) {
      setStages({
        ...stages,
        urlSite: false,
        urlProductCard: false,
        elementsSite: false,
        checked: false
      });
      setErrorUrlSite(true);
      toast.warning(`При проверка сайта ${url} произошла ошибка. Возможно адрес указан неверно.`);

      setIsCheckUrlSite(false);
      return false;
    }

    setStages({
      ...stages,
      urlSite: true,
      urlProductCard: false,
      elementsSite: false,
      checked: false
    });
    setErrorUrlSite(false);

    setIsCheckUrlSite(false);

    return true;
  }

  const checkedUrlProductCard = async (url) => {
    setIsCheckUrlProductCard(true);

    const result = await api.post(`/check-url-site/`, { baseURL: url });
    const status = result?.data;

    if (!status) {
      setStages({
        ...stages,
        urlProductCard: false,
        elementsSite: false,
        checked: false
      });
      setErrorUrlProductCard(true);
      toast.warning(`Не удалось проверить карточку товара по адресу ${url}. Возможно адрес карточки указан неверно.`);

      setIsCheckUrlProductCard(false);

      return false;
    }

    setStages({
      ...stages,
      urlProductCard: true,
      elementsSite: false,
      checked: false
    });
    setErrorUrlProductCard(false);

    setIsCheckUrlProductCard(false);

    return true;
  }

  const addListenerDataFromExtension = async () => {
    try {
      const response = await getDataExtension(CommandForGetDataExtension.GET_DATA_PRODUCT);

      if (response) {
        const {
          changeComplete,
          price,
          priceSelector,
          count,
          countSelector
        } = response;

        setChangeCompleteFromSite(changeComplete);

        if (changeComplete) {
          setStages({
            ...stages,
            elementsSite: true,
          });
          setPriceChangeFromSite(price);
          setPriceSelectorFromSite(priceSelector);
          setCountChangeFromSite(count);
          setCountSelectorFromSite(countSelector);
        } else {
          setStages({
            ...stages,
            elementsSite: false,
          });
          setPriceChangeFromSite(null);
          setPriceSelectorFromSite(null);
          setCountChangeFromSite(null);
          setCountSelectorFromSite(null);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  const listenerExtension = () => {
    if (!stages.checked) {
      return setInterval( () => {
        addListenerDataFromExtension();
      }, INTERVAL_CHECK_DATA_FROM_EXTENSION);
    }

    return null;
  }

  useEffect(() => {
    const getFirmInfo = async () => {
      const { data: firm } = await api.get(`/firm/${idFirm}`);

      setCurrentFirm(firm);
      firmNameRef.current['value'] = firm.name;
      innRef.current['value'] = firm.inn;
      kppRef.current['value'] = firm.kpp;
      colorRef.current['value'] = firm.color;
      urlSiteRef.current['value'] = firm.site;

      setPriceSelectorFromSite(firm.priceDefaultSelector);
      setCountSelectorFromSite(firm.countDefaultSelector);
    }

    getFirmInfo();

  }, [])

  const checkInstallExtension = async (idExtension) => {
    return await chrome.runtime.sendMessage(idExtension, {message: "version"},
      function (reply) {
        if (reply.version && typeof reply.version !== 'undefined') {
          setVersionExtension(reply.version);
        } else {
          setVersionExtension(false);
        }
      });
  }

  useEffect(() => {
    const interval = setInterval(async () => {
      await checkInstallExtension(ID_EXTENSION);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = listenerExtension();

    return () => clearInterval(interval);
  }, [stages]);

  return (
    <section className="page-content page__content">
      <header className="page-content__header standart-block">
        <h1 className="header header--1">Редактирование конкурента</h1>
      </header>

      <section className="page-content__inner firm-add">
        <form>
          <div className="standart-block standart-block--space-bottom-20">
            <h2 className="header header--2 header--space-bottom">Базовые данные</h2>

            <div className="form-block">
              <label className="label label--margin-right" htmlFor="firm-name">
                <span className="label__text">Название фирмы</span>
                <input
                  ref={ firmNameRef }
                  id="firm-name"
                  className={`input input--no-margin-bottom ${errorFirmName ? 'input--error' : ''}`}
                  name="firm-name"
                  type="text"
                  placeholder="Например: ООО ЕВРОТЕК"
                  title="Название фирмы"
                  alt="Название фирмы"
                  onChange={() => {
                    setErrorFirmName(false);
                  }}
                />
              </label>

              <label className="label label--margin-right" htmlFor="inn">
                <span className="label__text">ИНН</span>
                <input
                  ref={ innRef }
                  id="inn"
                  className={`input input--no-margin-bottom ${ errorInn ? 'input--error' : '' }`}
                  type="text"
                  title="ИНН добавляемой фирмы"
                  alt="ИНН добавляемой фирмы"
                  onChange={() => {
                    setErrorInn(false);
                  }}
                />
              </label>

              <label className="label label--margin-right" htmlFor="kpp">
                <span className="label__text">КПП</span>
                <input
                  ref={ kppRef }
                  id="kpp"
                  className={`input input--no-margin-bottom ${ errorKpp ? 'input--error' : '' }`}
                  name="kpp"
                  type="text"
                  title="КПП добавляемой фирмы"
                  alt="КПП добавляемой фирмы"
                  onChange={() => {
                    setErrorKpp(false);
                  }}
                />
              </label>

              <label className="label" htmlFor="color">
                <span className="label__text">Цвет</span>
                <input
                  ref={ colorRef }
                  id="color"
                  className="input input--color input--no-margin-bottom"
                  name="color"
                  type="color"
                  title="Цвет для фирмы"
                  alt="Цвет для фирмы"
                />
              </label>
            </div>
          </div>

          <div className="standart-block standart-block--space-bottom-20">
            <div className="header-block header-block--margin-bottom">
              {
                stages.checked &&
                <svg className="icon firm-add__link-icon" width="26" height="20" viewBox="0 0 26 20">
                  <path d="M8.87532 19.0563L0.750317 10.9313C0.262183 10.4432 0.262183 9.65174 0.750317 9.16355L2.51804 7.39578C3.00618 6.9076 3.79768 6.9076 4.28582 7.39578L9.75921 12.8691L21.4826 1.14578C21.9707 0.657645 22.7622 0.657645 23.2504 1.14578L25.0181 2.91355C25.5062 3.40169 25.5062 4.19314 25.0181 4.68133L10.6431 19.0564C10.1549 19.5445 9.36345 19.5445 8.87532 19.0563Z" fill="#6ace34"/>
                </svg>
              }

              <h2 className="header header--2 header--margin-right">
                Настройка интеграции с сайтом
              </h2>

              {
                stages.checked &&
                <button
                  className="button button--no-background button--text-main-color"
                  type="button"
                  onClick={() => {
                    setStages({
                      ...stages,
                      urlProductCard: false,
                      elementsSite: false,
                      checked: false
                    })
                  }}
                >
                  редактировать
                </button>
              }
            </div>

            <div className="firm-add__add-site">
              <div className="firm-add__form-site">
                <form>
                  <div className="firm-add__field-block">
                    <div className="firm-add__field">
                      <h3 className="header header--4 header--space-bottom-10"><b>Шаг 1.</b> Скачайте и установите расширение для браузера</h3>

                      <label className="label">
                        <div className="firm-add__link-extension">
                          <a className="firm-add__link" href="/other/eurotech-monitoring.zip">
                            {
                              !versionExtension &&
                              <>
                                <svg className="icon firm-add__link-icon" width="25" height="25" viewBox="0 0 15 15">
                                  <path d="M9.78628 5.93402C11.42 7.56942 11.3976 10.1914 9.79612 11.8017C9.79312 11.805 9.78956 11.8086 9.78628 11.8118L7.94878 13.6493C6.32812 15.27 3.69139 15.2698 2.07097 13.6493C0.450303 12.0289 0.450303 9.39191 2.07097 7.77152L3.08558 6.7569C3.35465 6.48784 3.81801 6.66667 3.83191 7.04691C3.84962 7.5315 3.93652 8.01835 4.09687 8.4885C4.15117 8.6477 4.11237 8.82379 3.99342 8.94273L3.63558 9.30058C2.86924 10.0669 2.84521 11.3147 3.60399 12.0886C4.37028 12.87 5.62978 12.8747 6.40194 12.1025L8.23944 10.2653C9.01029 9.49442 9.00707 8.24848 8.23944 7.48086C8.13825 7.37985 8.03631 7.30137 7.95668 7.24655C7.90035 7.20787 7.85384 7.15655 7.82086 7.09671C7.78788 7.03686 7.76934 6.97013 7.76673 6.90185C7.7559 6.61291 7.85827 6.31516 8.08659 6.08684L8.66229 5.51112C8.81325 5.36016 9.05008 5.34162 9.22513 5.46379C9.42561 5.60378 9.61338 5.76113 9.78628 5.93402ZM13.64 2.08014C12.0196 0.45969 9.38282 0.459471 7.76216 2.08014L5.92466 3.91764C5.92138 3.92092 5.91782 3.92447 5.91482 3.92775C4.3134 5.53808 4.29095 8.16005 5.92466 9.79545C6.09755 9.96834 6.28531 10.1257 6.48578 10.2657C6.66084 10.3878 6.89769 10.3693 7.04862 10.2183L7.62432 9.6426C7.85264 9.41428 7.95501 9.11653 7.94419 8.82759C7.94157 8.75931 7.92303 8.69258 7.89005 8.63273C7.85707 8.57289 7.81056 8.52158 7.75423 8.48289C7.67461 8.42807 7.57267 8.34959 7.47147 8.24859C6.70385 7.48096 6.70062 6.23502 7.47147 5.46417L9.30897 3.62694C10.0811 2.85478 11.3406 2.85943 12.1069 3.64089C12.8657 4.41472 12.8417 5.66252 12.0753 6.42886L11.7175 6.78671C11.5985 6.90565 11.5597 7.08175 11.614 7.24094C11.7744 7.71109 11.8613 8.19794 11.879 8.68253C11.8929 9.06277 12.3563 9.2416 12.6253 8.97254L13.6399 7.95792C15.2606 6.33756 15.2606 3.70053 13.64 2.08014Z" fill="#be1622"/>
                                </svg>
                                <span>Ссылка на скачивание</span>
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
                        </div>
                      </label>
                    </div>

                    {
                      stages.installPlugin ?
                        <div className="firm-add__progress progress">
                          <div className="progress__circle progress__circle--active progress__circle--animate-success">
                            <svg width="26" height="20" viewBox="0 0 26 20">
                              <path d="M8.87532 19.0563L0.750317 10.9313C0.262183 10.4432 0.262183 9.65174 0.750317 9.16355L2.51804 7.39578C3.00618 6.9076 3.79768 6.9076 4.28582 7.39578L9.75921 12.8691L21.4826 1.14578C21.9707 0.657645 22.7622 0.657645 23.2504 1.14578L25.0181 2.91355C25.5062 3.40169 25.5062 4.19314 25.0181 4.68133L10.6431 19.0564C10.1549 19.5445 9.36345 19.5445 8.87532 19.0563Z" fill="#ffffff"/>
                            </svg>
                          </div>
                          <div className="progress__line progress__line--active" />
                        </div>
                        :
                        <div className="firm-add__progress progress">
                          <div className="progress__circle">
                            <svg width="15" height="19" viewBox="0 0 15 19">
                              <path d="M13.3594 2.375C13.8513 2.375 14.25 1.97626 14.25 1.48438V0.890625C14.25 0.39874 13.8513 0 13.3594 0H0.890625C0.39874 0 0 0.39874 0 0.890625V1.48438C0 1.97626 0.39874 2.375 0.890625 2.375C0.890625 5.75065 2.7838 8.5995 5.375 9.5C2.7838 10.4005 0.890625 13.2493 0.890625 16.625C0.39874 16.625 0 17.0237 0 17.5156V18.1094C0 18.6013 0.39874 19 0.890625 19H13.3594C13.8513 19 14.25 18.6013 14.25 18.1094V17.5156C14.25 17.0237 13.8513 16.625 13.3594 16.625C13.3594 13.2493 11.4662 10.4005 8.875 9.5C11.4662 8.5995 13.3594 5.75065 13.3594 2.375Z" fill="#141414" fill-opacity="0.9"/>
                            </svg>
                          </div>
                          <div className="progress__line" />
                        </div>
                    }
                  </div>

                  <div className="firm-add__field-block">
                    <div className="firm-add__field">
                      <h3 className="header header--4 header--space-bottom-10"><b>Шаг 2.</b> Адрес сайта</h3>

                      <label className="label">
                        <input
                          disabled={ !stages.installPlugin || stages.checked }
                          ref={ urlSiteRef }
                          className={`input input--no-margin-bottom ${ errorUrlSite ? 'input--error' : '' }`}
                          name="site"
                          type="url"
                          placeholder="Например: example.com"
                          title="Адрес сайта"
                          alt="Адрес сайта"
                          required
                          onChange={debounce(async () => {
                            const url = urlSiteRef.current.value;

                            await checkedUrlSite(url);
                            urlProductCardRef.current.value = '';
                          }, TIME_DEBOUNCE)}
                        />

                        {
                          isCheckUrlSite &&
                          <div className="label__preloader">
                            <Preloader
                              width={ WIDTH_PRELOADER }
                              height={ HEIGHT_PRELOADER }
                              color={ COLOR_PRELOADER }
                            />
                          </div>
                        }
                      </label>
                    </div>

                    {
                      stages.urlSite ?
                        <div className="firm-add__progress progress">
                          <div className="progress__circle progress__circle--active progress__circle--animate-success">
                            <svg width="26" height="20" viewBox="0 0 26 20">
                              <path d="M8.87532 19.0563L0.750317 10.9313C0.262183 10.4432 0.262183 9.65174 0.750317 9.16355L2.51804 7.39578C3.00618 6.9076 3.79768 6.9076 4.28582 7.39578L9.75921 12.8691L21.4826 1.14578C21.9707 0.657645 22.7622 0.657645 23.2504 1.14578L25.0181 2.91355C25.5062 3.40169 25.5062 4.19314 25.0181 4.68133L10.6431 19.0564C10.1549 19.5445 9.36345 19.5445 8.87532 19.0563Z" fill="#ffffff"/>
                            </svg>
                          </div>
                          <div className="progress__line progress__line--active" />
                        </div>
                        :
                        <div className="firm-add__progress progress">
                          <div className="progress__circle">
                            <svg width="15" height="19" viewBox="0 0 15 19">
                              <path d="M13.3594 2.375C13.8513 2.375 14.25 1.97626 14.25 1.48438V0.890625C14.25 0.39874 13.8513 0 13.3594 0H0.890625C0.39874 0 0 0.39874 0 0.890625V1.48438C0 1.97626 0.39874 2.375 0.890625 2.375C0.890625 5.75065 2.7838 8.5995 5.375 9.5C2.7838 10.4005 0.890625 13.2493 0.890625 16.625C0.39874 16.625 0 17.0237 0 17.5156V18.1094C0 18.6013 0.39874 19 0.890625 19H13.3594C13.8513 19 14.25 18.6013 14.25 18.1094V17.5156C14.25 17.0237 13.8513 16.625 13.3594 16.625C13.3594 13.2493 11.4662 10.4005 8.875 9.5C11.4662 8.5995 13.3594 5.75065 13.3594 2.375Z" fill="#141414" fill-opacity="0.9"/>
                            </svg>
                          </div>
                          <div className="progress__line" />
                        </div>
                    }
                  </div>

                  <div className="firm-add__field-block">
                    <div className="firm-add__field">
                      <h3 className="header header--4 header--space-bottom-10"><b>Шаг 3.</b> Ссылка на карточку товара (с ценой и/или наличием)</h3>

                      <label
                        className="label"
                      >
                        <input
                          disabled={ !stages.urlSite || stages.checked }
                          ref={ urlProductCardRef }
                          className={`input input--no-margin-bottom ${ errorUrlProductCard ? 'input--error' : '' }`}
                          name="site"
                          type="url"
                          placeholder="Например: example.com/catalog/product/"
                          title="Адрес сайта"
                          alt="Адрес сайта"
                          required
                          onChange={debounce(async () => {
                            setErrorUrlProductCard(false);

                            urlSiteRef.current.value?.replace('https://', '').replace('www', '');
                            const urlSite = urlSiteRef.current.value;
                            urlProductCardRef.current.value?.replace('https://', '').replace('www', '');
                            const urlProductCard = urlProductCardRef.current.value;

                            if (urlSite === urlProductCard) {
                              toast.warning(`Адрес сайта и ссылка на карточку товара не могут быть одинаковыми`);
                              setErrorUrlProductCard(true);

                              return false;
                            }

                            if (!urlProductCard.includes(urlSite)) {
                              toast.warning(`Ссылка на карточку товара должна вести на сайт ${urlSite}`);
                              setErrorUrlProductCard(true);

                              return false;
                            }

                            await checkedUrlProductCard(urlProductCard);

                          }, TIME_DEBOUNCE)}
                        />

                        {
                          isCheckUrlProductCard &&
                          <div className="label__preloader">
                            <Preloader
                              width={ WIDTH_PRELOADER }
                              height={ HEIGHT_PRELOADER }
                              color={ COLOR_PRELOADER }
                            />
                          </div>
                        }
                      </label>
                    </div>

                    {
                      stages.urlProductCard ?
                        <div className="firm-add__progress progress">
                          <div className="progress__circle progress__circle--active progress__circle--animate-success">
                            <svg width="26" height="20" viewBox="0 0 26 20">
                              <path d="M8.87532 19.0563L0.750317 10.9313C0.262183 10.4432 0.262183 9.65174 0.750317 9.16355L2.51804 7.39578C3.00618 6.9076 3.79768 6.9076 4.28582 7.39578L9.75921 12.8691L21.4826 1.14578C21.9707 0.657645 22.7622 0.657645 23.2504 1.14578L25.0181 2.91355C25.5062 3.40169 25.5062 4.19314 25.0181 4.68133L10.6431 19.0564C10.1549 19.5445 9.36345 19.5445 8.87532 19.0563Z" fill="#ffffff"/>
                            </svg>
                          </div>
                          <div className="progress__line progress__line--active" />
                        </div>
                        :
                        <div
                          className="firm-add__progress progress"
                        >
                          <div className="progress__circle">
                            <svg width="15" height="19" viewBox="0 0 15 19">
                              <path d="M13.3594 2.375C13.8513 2.375 14.25 1.97626 14.25 1.48438V0.890625C14.25 0.39874 13.8513 0 13.3594 0H0.890625C0.39874 0 0 0.39874 0 0.890625V1.48438C0 1.97626 0.39874 2.375 0.890625 2.375C0.890625 5.75065 2.7838 8.5995 5.375 9.5C2.7838 10.4005 0.890625 13.2493 0.890625 16.625C0.39874 16.625 0 17.0237 0 17.5156V18.1094C0 18.6013 0.39874 19 0.890625 19H13.3594C13.8513 19 14.25 18.6013 14.25 18.1094V17.5156C14.25 17.0237 13.8513 16.625 13.3594 16.625C13.3594 13.2493 11.4662 10.4005 8.875 9.5C11.4662 8.5995 13.3594 5.75065 13.3594 2.375Z" fill="#141414" fill-opacity="0.9"/>
                            </svg>
                          </div>
                          <div className="progress__line" />
                        </div>
                    }
                  </div>

                  <div className="firm-add__field-block">
                    <div className="firm-add__field">
                      <h3 className="header header--4 header--space-bottom-10"><b>Шаг 4.</b> Элементы сайта с ценой и/или наличием</h3>

                      <ul className="detalisation-list firm-add__detalisation-list">
                        <li className="detalisation-list__item detalisation-list__item--active">
                          указать через расширение
                        </li>

                        {/*<li className="detalisation-list__item">*/}
                        {/*  указать вручную*/}
                        {/*</li>*/}
                      </ul>

                      <button
                        disabled={ !stages.urlProductCard || stages.checked }
                        className="button firm-add__button-start-extension"
                        type="button"
                        onClick={async () => {
                          if (!stages.urlProductCard || urlProductCardRef.current.value === '') {
                            toast.warning('Пожалуйста, заполните поле ссылки на карточку товара');

                            return false;
                          }

                          setStages({
                            ...stages,
                            checked: false
                          })
                          window.open(urlProductCardRef.current.value);

                          await chrome.runtime.sendMessage(ID_EXTENSION, { message: 'open-for-add-firm' },
                            function(reply) {
                              return reply.response;
                            });
                        }}
                      >
                        <svg className="icon icon--white icon--margin-right" width="18" height="20" viewBox="0 0 18 20">
                          <path d="M16.3161 8.42418L2.95858 0.527313C1.87328 -0.113999 0.211182 0.50834 0.211182 2.09454V17.8845C0.211182 19.3075 1.75564 20.1651 2.95858 19.4517L16.3161 11.5586C17.5076 10.8566 17.5114 9.12621 16.3161 8.42418Z" fill="white"/>
                        </svg>

                        Запустить расширение
                      </button>
                      {
                        stages.urlProductCard && !stages.checked &&
                        <ul className="firm-add__values-list">
                          {
                            priceChangeFromSite ?
                              <li className="firm-add__values-list-item">
                                <span className="firm-add__values-text">Выгруженная цена:</span>
                                <b>{ priceChangeFromSite } руб.</b>
                              </li>
                              :
                              <li className="firm-add__values-list-item">
                                <span className="firm-add__values-text">Выгруженная цена:</span>
                                <Preloader
                                  width={WIDTH_PRELOADER}
                                  height={HEIGHT_PRELOADER}
                                  color={COLOR_PRELOADER}
                                />
                                <span className="firm-add__values-margin-left">ожидание значения</span>
                              </li>
                          }

                          {
                            countChangeFromSite ?
                              <li className="firm-add__values-list-item">
                                <span className="firm-add__values-text">Выгруженное наличие:</span>
                                <b>{ countChangeFromSite } шт.</b>
                              </li>
                              :
                              <li className="firm-add__values-list-item">
                                {
                                  changeCompleteFromSite ?
                                    <>
                                      <span className="firm-add__values-text">Выгруженное наличие:</span>
                                      <span className="firm-add__values-margin-left"><b>наличие на сайте отсутствует</b></span>
                                    </>
                                    :
                                    <>
                                      <span className="firm-add__values-text">Выгруженное наличие:</span>
                                      <Preloader
                                        width={WIDTH_PRELOADER}
                                        height={HEIGHT_PRELOADER}
                                        color={COLOR_PRELOADER}
                                      />
                                      <span className="firm-add__values-margin-left">ожидание значения</span>
                                    </>
                                }
                              </li>
                          }
                        </ul>
                      }
                    </div>

                    {
                      stages.urlProductCard && stages.elementsSite ?
                        <div className="firm-add__progress progress">
                          <div className="progress__circle progress__circle--active progress__circle--animate-success">
                            <svg width="26" height="20" viewBox="0 0 26 20">
                              <path d="M8.87532 19.0563L0.750317 10.9313C0.262183 10.4432 0.262183 9.65174 0.750317 9.16355L2.51804 7.39578C3.00618 6.9076 3.79768 6.9076 4.28582 7.39578L9.75921 12.8691L21.4826 1.14578C21.9707 0.657645 22.7622 0.657645 23.2504 1.14578L25.0181 2.91355C25.5062 3.40169 25.5062 4.19314 25.0181 4.68133L10.6431 19.0564C10.1549 19.5445 9.36345 19.5445 8.87532 19.0563Z" fill="#ffffff"/>
                            </svg>
                          </div>
                          <div className="progress__line progress__line--large progress__line--active" />
                        </div>
                        :
                        <div className="firm-add__progress progress">
                          <div className="progress__circle">
                            <svg width="15" height="19" viewBox="0 0 15 19">
                              <path d="M13.3594 2.375C13.8513 2.375 14.25 1.97626 14.25 1.48438V0.890625C14.25 0.39874 13.8513 0 13.3594 0H0.890625C0.39874 0 0 0.39874 0 0.890625V1.48438C0 1.97626 0.39874 2.375 0.890625 2.375C0.890625 5.75065 2.7838 8.5995 5.375 9.5C2.7838 10.4005 0.890625 13.2493 0.890625 16.625C0.39874 16.625 0 17.0237 0 17.5156V18.1094C0 18.6013 0.39874 19 0.890625 19H13.3594C13.8513 19 14.25 18.6013 14.25 18.1094V17.5156C14.25 17.0237 13.8513 16.625 13.3594 16.625C13.3594 13.2493 11.4662 10.4005 8.875 9.5C11.4662 8.5995 13.3594 5.75065 13.3594 2.375Z" fill="#141414" fill-opacity="0.9"/>
                            </svg>
                          </div>
                          {
                            (stages.urlProductCard && stages.elementsSite) &&
                            <div className="progress__line progress__line--large" />
                          }
                        </div>
                    }
                  </div>

                  {
                    (stages.urlProductCard && stages.elementsSite) &&
                    <div className="firm-add__field-block">
                      <div className="firm-add__field">
                        <h3 className="header header--4 header--space-bottom-10"><b>Шаг 5.</b> Проверка</h3>

                        <div className="firm-add__info">
                          {
                            stages.checked ?
                              <svg className="firm-add__icon" width="46" height="40" viewBox="0 0 26 20">
                                <path d="M8.87532 19.0563L0.750317 10.9313C0.262183 10.4432 0.262183 9.65174 0.750317 9.16355L2.51804 7.39578C3.00618 6.9076 3.79768 6.9076 4.28582 7.39578L9.75921 12.8691L21.4826 1.14578C21.9707 0.657645 22.7622 0.657645 23.2504 1.14578L25.0181 2.91355C25.5062 3.40169 25.5062 4.19314 25.0181 4.68133L10.6431 19.0564C10.1549 19.5445 9.36345 19.5445 8.87532 19.0563Z" fill="#6ace34"/>
                              </svg>
                              :
                              <svg className="firm-add__icon" width="46" height="46" viewBox="0 0 46 46">
                                <path d="M46 23C46 35.7054 35.7017 46 23 46C10.2983 46 0 35.7054 0 23C0 10.3021 10.2983 0 23 0C35.7017 0 46 10.3021 46 23ZM23 27.6371C20.6439 27.6371 18.7339 29.5471 18.7339 31.9032C18.7339 34.2593 20.6439 36.1694 23 36.1694C25.3561 36.1694 27.2661 34.2593 27.2661 31.9032C27.2661 29.5471 25.3561 27.6371 23 27.6371ZM18.9497 12.3026L19.6376 24.9155C19.6698 25.5057 20.1578 25.9677 20.7489 25.9677H25.2511C25.8422 25.9677 26.3302 25.5057 26.3624 24.9155L27.0503 12.3026C27.0851 11.6651 26.5775 11.129 25.9391 11.129H20.0608C19.4224 11.129 18.9149 11.6651 18.9497 12.3026Z" fill="#BE1622"/>
                              </svg>
                          }


                          <div className="firm-add__info-text">
                            <h4 className="header header--5 header--space-bottom firm-add__header">
                              Настройки интеграции с сайтом выполнены успешно
                            </h4>

                            <p className="firm-add__text">
                              Пожалуйста, проверьте введённые данные и нажмите на кнопку «Сохранить настройки», если настройки произведены верно - в противном случае исправьте настройки, повторно запустив расширение.
                            </p>

                            <button
                              disabled={ !changeCompleteFromSite }
                              className={`button firm-add__button ${stages.checked ? ' button--text-green button--no-background' : ''}`}
                              type="button"
                              onClick={() => {
                                setStages({
                                  ...stages,
                                  checked: true
                                });

                                toast.success('Настройки интеграции с сайтом сохранены!');
                              }}
                            >
                              {
                                stages.checked ?
                                  <>
                                    <svg className="icon firm-add__link-icon" width="26" height="20" viewBox="0 0 26 20">
                                      <path d="M8.87532 19.0563L0.750317 10.9313C0.262183 10.4432 0.262183 9.65174 0.750317 9.16355L2.51804 7.39578C3.00618 6.9076 3.79768 6.9076 4.28582 7.39578L9.75921 12.8691L21.4826 1.14578C21.9707 0.657645 22.7622 0.657645 23.2504 1.14578L25.0181 2.91355C25.5062 3.40169 25.5062 4.19314 25.0181 4.68133L10.6431 19.0564C10.1549 19.5445 9.36345 19.5445 8.87532 19.0563Z" fill="#6ace34"/>
                                    </svg>
                                    Настройки сохранены
                                  </>
                                  :
                                  'Сохранить настройки'
                              }

                            </button>
                          </div>
                        </div>
                      </div>

                      {
                        stages.checked ?
                          <div className="firm-add__progress progress">
                            <div className="progress__circle progress__circle--active progress__circle--animate-success">
                              <svg width="26" height="20" viewBox="0 0 26 20">
                                <path d="M8.87532 19.0563L0.750317 10.9313C0.262183 10.4432 0.262183 9.65174 0.750317 9.16355L2.51804 7.39578C3.00618 6.9076 3.79768 6.9076 4.28582 7.39578L9.75921 12.8691L21.4826 1.14578C21.9707 0.657645 22.7622 0.657645 23.2504 1.14578L25.0181 2.91355C25.5062 3.40169 25.5062 4.19314 25.0181 4.68133L10.6431 19.0564C10.1549 19.5445 9.36345 19.5445 8.87532 19.0563Z" fill="#ffffff"/>
                              </svg>
                            </div>
                          </div>
                          :
                          <div className="firm-add__progress progress">
                            <div className="progress__circle">
                              <svg width="15" height="19" viewBox="0 0 15 19">
                                <path d="M13.3594 2.375C13.8513 2.375 14.25 1.97626 14.25 1.48438V0.890625C14.25 0.39874 13.8513 0 13.3594 0H0.890625C0.39874 0 0 0.39874 0 0.890625V1.48438C0 1.97626 0.39874 2.375 0.890625 2.375C0.890625 5.75065 2.7838 8.5995 5.375 9.5C2.7838 10.4005 0.890625 13.2493 0.890625 16.625C0.39874 16.625 0 17.0237 0 17.5156V18.1094C0 18.6013 0.39874 19 0.890625 19H13.3594C13.8513 19 14.25 18.6013 14.25 18.1094V17.5156C14.25 17.0237 13.8513 16.625 13.3594 16.625C13.3594 13.2493 11.4662 10.4005 8.875 9.5C11.4662 8.5995 13.3594 5.75065 13.3594 2.375Z" fill="#141414" fill-opacity="0.9"/>
                              </svg>
                            </div>
                          </div>
                      }
                    </div>
                  }

                </form>
              </div>

              <div className="firm-add__video">
                <video className="video" controls>
                  <source src="/video/presentation.mp4" type="video/mp4"/>

                  Данное видео не поддерживается в вашем браузере
                  <a href="/video/presentation.mp4">Скачайте его по ссылке</a>
                </video>
              </div>
            </div>
          </div>

          <div className="standart-block">
            <button
              disabled={ isLoadFirm }
              className="button button--margin-left"
              type="submit"
              onClick={async (evt) => {
                evt.preventDefault();

                const isValidate = getValidateStatus();

                if (!isValidate) {
                  return false;
                }

                const firm = {
                  id: idFirm,
                  name: firmNameRef.current.value,
                  inn: innRef.current.value,
                  kpp: kppRef.current.value,
                  color: colorRef.current.value,
                  site: urlSiteRef.current.value.replace('https://', '').replace('http://', ''),
                  priceDefaultSelector: priceSelectorFromSite,
                  countDefaultSelector: countSelectorFromSite,
                  valute: 'RUB',
                  isMain: currentFirm.isMain
                }

                await dispatch(updateFirm(firm));
              }}
            >
              {
                isLoadFirm ?
                  <Preloader
                    width={WIDTH_PRELOADER}
                    height={HEIGHT_PRELOADER}
                    color={COLOR_PRELOADER}
                  />
                  : 'Сохранить изменения'
              }
            </button>
          </div>
        </form>
      </section>
    </section>
  );
}

export default FirmEditPage;
