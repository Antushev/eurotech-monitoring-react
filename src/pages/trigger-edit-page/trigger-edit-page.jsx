import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import AsyncSelect from 'react-select/async';

import { AppRoute } from '../../const.js';

import { api } from '../../store';

import { fetchFirmsByIdUser, updateTrigger } from '../../store/api-actions.js';
import {
  getCurrentUser,
  getAllFirms,
  getStatusLoadTrigger
} from '../../store/app-data/selectors.js';

import Preloader from '../../components/preloader/preloader.jsx';

const WIDTH_PRELOADER = 15;
const HEIGHT_PRELOADER = 15;
const COLOR_PRELOADER = '#ffffff';
const COLOR_PRELOADER_TEST_EMAIL = '#000000';

const TriggerAddPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { idTrigger } = useParams();
  const [currentTrigger, setCurrentTrigger] = useState();

  const currentUser = useSelector(getCurrentUser);
  const firmsSelect = useSelector(getAllFirms);
  const isLoadTrigger = useSelector(getStatusLoadTrigger);

  const nameTriggerRef = useRef('');
  const compareValueRef = useRef();
  const emailsRef = useRef(null);
  const additionalTextRef = useRef(null);
  // const typeActiveRef = useRef('ONCE');
  // const activeIntervalRef = useRef('3600');
  // const dateActiveFromRef = useRef(dayjs());
  // const dateActiveToRef = useRef(dayjs());
  // const isActiveRef = useRef();
  // const productRef = useRef(null);
  // const typeChangeProductsInGroupRef = useRef(null);
  // const firmRef = useRef(null);
  // const compareObjectRef = useRef('PRICE');
  // const compareTypeRef = useRef();
  // const compareConditionRef = useRef('>');
  // const compareProductRef = useRef(null);
  // const compareTypeChangeProductsInGroupRef = useRef(null);
  // const compareFirmRef = useRef(null);
  // const isActionSendEmailRef = useRef(false);

  const [nameTrigger, setNameTrigger] = useState('');
  const [typeActive, setTypeActive] = useState('ONCE');
  const [activeInterval, setActiveInterval] = useState(null);
  const [activeCount, setActiveCount] = useState(4);
  const [dateActiveFrom, setDateActiveFrom] = useState();
  const [dateActiveTo, setDateActiveTo] = useState();
  const [isActive, setIsActive] = useState();
  const [products, setProducts] = useState(null);
  const [typeChangeProductsInGroup, setTypeChangeProductsInGroup] = useState('PRODUCT');
  const [firms, setFirms] = useState([1]);
  const [compareObject, setCompareObject] = useState('PRICE');
  const [compareType, setCompareType] = useState('VALUE');
  const [compareValue, setCompareValue] = useState(1000);
  const [compareCondition, setCompareCondition] = useState('gt');
  const [compareProducts, setCompareProducts] = useState(null);
  const [compareTypeChangeProductsInGroup, setTypeCompareChangeProductsInGroup] = useState('PRODUCT');
  const [compareFirms, setCompareFirms] = useState([2]);
  const [isActionSendEmail, setIsActionSendEmail] = useState(true);
  const [emails, setEmails] = useState([currentUser.email]);
  const [additionalText, setAdditionalText] = useState('');

  const [defaultValueSelect, setDefaultValueSelect] = useState([]);
  const [defaultCompareValueSelect, setDefaultCompareValueSelect] = useState([]);

  const [errorNameInput, setErrorNameInput] = useState(false);
  const [errorProductsInput, setErrorProductsInput] = useState(false);
  const [errorCompareValueInput, setErrorCompareValue] = useState(false);
  const [errorCompareProductsInput, setErrorCompareProducts] = useState(false);
  const [errorEmailsInput, setErrorEmailsInput] = useState(false);

  const [isSendingTestEmail, setIsSendingTestEmail] = useState(false);

  const getValidateStatus = () => {
    if (nameTriggerRef.current.value === '' || nameTriggerRef.current.value === null) {
      setErrorNameInput(true);
      toast.warning('Не заполнены обязательные поля формы');
      return false;
    }

    if (!products) {
      setErrorProductsInput(true);
      toast.warning('Не заполнены обязательные поля формы');
      return false;
    }

    if (compareType === 'VALUE'
      && !compareValueRef.current
      && (compareCondition !== 'DIFFERENT' && compareCondition !== 'NOT_DIFFERENT')
    ) {
      setErrorCompareValue(true);
      toast.warning('Не заполнены обязательные поля формы')
      return false;
    }

    if (compareType === 'PRODUCT' && !compareProducts && (compareCondition !== 'DIFFERENT' && compareCondition !== 'NOT_DIFFERENT')) {
      setErrorCompareProducts(true);
      toast.warning('Не заполнены обязательные поля формы')
      return false;
    }

    if (!emails || emails.length === 0) {
      setErrorEmailsInput(true);
      toast.warning('Не заполнены обязательные поля формы');
      return false;
    }

    return true;
  }

  const getTriggerData = () => {
    return {
      id: idTrigger,
      idUser: currentUser.id,
      name: nameTrigger,
      typeActive: typeActive,
      activeInterval: activeInterval,
      activeCount: activeCount,
      dateActiveFrom: dateActiveFrom,
      dateActiveTo: dateActiveTo,
      isActive: isActive,
      typeChangeProductsInGroup: typeChangeProductsInGroup,
      products: getIdProducts(products),
      firms: firms,
      compareObject: compareObject,
      compareCondition: compareCondition,
      compareType: compareType,
      compareValue: compareValue,
      compareTypeChangeProductsInGroup: compareTypeChangeProductsInGroup,
      compareProducts: compareType === 'PRODUCT' && (compareCondition !== 'DIFFERENT' && compareCondition !== 'NOT_DIFFERENT') ? getIdProducts(compareProducts) : null,
      compareFirms: compareType === 'PRODUCT' && (compareCondition !== 'DIFFERENT' && compareCondition !== 'NOT_DIFFERENT') ? compareFirms : null,
      isActionSendEmail: isActionSendEmail,
      emails: emails,
      additionalText: additionalTextRef.current?.value
    }
  }

  useEffect(() => {
    const fetchTrigger = async () => {
      const { data:trigger } = await api.get(`/trigger/${idTrigger}`);

      setCurrentTrigger(trigger);
      setNameTrigger(trigger.name);
      setTypeActive(trigger.typeActive);
      setActiveInterval(trigger.activeInterval);
      setActiveCount(trigger.activeCount);
      setDateActiveFrom(dayjs(trigger.dateActiveFrom).format('YYYY-MM-DDTHH:mm'));
      setDateActiveTo(dayjs(trigger.dateActiveTo).format('YYYY-MM-DDTHH:mm'));
      setIsActive(trigger.isActive);
      setProducts(trigger.products.map((product) => { return { value: product } }));
      setTypeChangeProductsInGroup(trigger.typeChangeProductsInGroup);
      setFirms(trigger.firms);
      setCompareObject(trigger.compareObject);
      setCompareType(trigger.compareType);
      setCompareValue(trigger.compareValue);
      setCompareCondition(trigger.compareCondition);
      setCompareProducts(trigger.compareProducts)
      setTypeCompareChangeProductsInGroup(trigger.compareTypeChangeProductsInGroup);
      setCompareFirms(trigger.compareFirms);
      setIsActionSendEmail(trigger.isActionSendEmail)
      setEmails(trigger.emails)
      setAdditionalText(trigger.additionalText);

      let resultProducts = [];
      for (let idProduct of trigger.products) {
        const { data: productFetch } = await api.get(`/product/${idProduct}`);

        resultProducts.push({
          value: productFetch.id,
          label: productFetch.name
        });
      }
      setProducts(resultProducts);
      setDefaultValueSelect(resultProducts);

      if (trigger.compareProducts && trigger.compareProducts?.length !== 0) {
        let resultCompareProducts = [];
        for (let idProduct of trigger.compareProducts) {
          const {data: productFetch} = await api.get(`/product/${idProduct}`);

          resultCompareProducts.push({
            value: productFetch.id,
            label: productFetch.name
          });
        }
        setCompareProducts(resultCompareProducts);
        setDefaultCompareValueSelect(resultCompareProducts);
      }

      compareValueRef.current = trigger.compareValue;
    }

    fetchTrigger();
  }, []);

  useEffect(() => {
    dispatch(fetchFirmsByIdUser(currentUser.id));
  }, []);

  return (
    <section className="page-content page__content">
      <header className="page-content__header standart-block">
        <h1 className="header header--1">Редактирование триггера</h1>
      </header>

      <section className="page-content__inner trigger-add">
        <form>
          <div className="standart-block trigger-add__block">
            <h2 className="header header--2 header--space-bottom">Шаг 1. Базовые данные</h2>

            <div className="form-block">
              <label className="trigger-add__input" for="trigger-name">
                <span className="input__label-text">Название триггера</span>
                <input
                  ref={nameTriggerRef}
                  id="name-trigger"
                  className={`input input--trigger ${errorNameInput && 'input--error'}`}
                  name="trigger-name"
                  type="text"
                  defaultValue={nameTrigger}
                  placeholder="Например: Отслеживание цены на Распределитель 1P40"
                  size="50"
                  title="Название триггера"
                  alt="Введите название триггера"
                  required={true}
                  onChange={() => {
                    setNameTrigger(nameTriggerRef.current.value);

                    setErrorNameInput(false);
                  }}
                />
              </label>

              <label className="trigger-add__input">
                <span className="input__label-text">Тип срабатывания</span>
                <select
                  id="type-active"
                  className="input input--trigger"
                  name="type-active"
                  defaultValue={typeActive}
                  onChange={(evt) => {
                    setTypeActive(evt.target.value);
                    setActiveInterval(null);

                    if (evt.target.value === 'IS_ACTIVE') {
                      setActiveInterval('3600');
                    }
                  }}
                >
                  <option value="ONCE" selected={typeActive === 'ONCE'}>Один раз</option>
                  <option value="IS_ACTIVE" selected={typeActive === 'IS_ACTIVE'}>Пока активен</option>
                </select>
              </label>
              {
                typeActive === 'IS_ACTIVE' &&
                <label className="input--margin-right">
                  <span className="input__label-text">Интервал срабатывания</span>
                  <select
                    id="active-interval"
                    className="input input--trigger input--margin-right"
                    name="active-interval"
                    defaultValue={activeInterval}
                    onChange={(evt) => {
                      setActiveInterval(evt.target.value);
                    }}
                  >
                    <option value="1800">Каждые 30 минут</option>
                    <option value="3600">Каждый час</option>
                    <option value="7200">Каждые 2 часа</option>
                    <option value="9800">Каждые 3 часа</option>
                    <option value="14400">Каждые 4 часа</option>
                    <option value="18000">Каждые 5 часов</option>
                    <option value="21600">Каждые 6 часов</option>
                    <option value="25200">Каждые 7 часов</option>
                    <option value="28800">Каждые 8 часов</option>
                  </select>
                </label>
              }

              {
                typeActive === 'IS_ACTIVE' &&
                <label>
                  <span className="input__label-text">Количество срабатываний</span>
                  <input
                    id="active-count"
                    className="input input--trigger"
                    name="active-count"
                    defaultValue={activeCount}
                    type="number"
                    onChange={(evt) => {
                      setActiveCount(evt.target.value);
                    }}
                  />
                </label>
              }
            </div>

            <div className="form-block form-block--margin-bottom">
              <label>
                <span className="input__label-text">Период действия</span>
                <div className="date-select">
                  <input
                    className="date-select__input date-select__from"
                    name="date-from"
                    type="datetime-local"
                    alt="Дата от"
                    defaultValue={ dateActiveFrom }
                    onChange={(evt) => {
                      setDateActiveFrom(evt.target.value);
                    }}
                  />
                  <span> - </span>
                  <input
                    className="date-select__input date-select__to"
                    name="date-select"
                    type="datetime-local"
                    alt="Дата до"
                    defaultValue={ dateActiveTo }
                    onChange={(evt) => {
                      setDateActiveTo(evt.target.value);
                    }}
                  />
                </div>
              </label>

            </div>

            <div className="form-block form-block--radio">
              <input
                id="is-active"
                className="input input--radio"
                type="checkbox"
                defaultChecked={isActive}
                onChange={(evt) => {
                  setIsActive(evt.target.checked);
                }}
              />
              <label htmlFor="is-active">Активен</label>
            </div>

          </div>

          <div className="standart-block trigger-add__block">
            <h2 className="header header--2 header--space-bottom">Шаг 2. Задайте сравниваемые объекты</h2>

            <div className="form-block">
              <span className="form-block__trigger-text">Если у</span>

              <select
                className="input input--trigger input--margin-right"
                defaultValue={ typeChangeProductsInGroup }
                onChange={(evt) => {
                  setTypeChangeProductsInGroup(evt.target.value);
                }}
              >
                <option value="PRODUCT" selected={typeChangeProductsInGroup === 'PRODUCT'}>Товара</option>
                {/*<option value="ALL_PRODUCT_IN_GROUP" selected={typeChangeProductsInGroup === 'ALL_PRODUCT_IN_GROUP'}>Всех товаров в группе</option>*/}
                {/*<option value="ONE_PRODUCT_IN_GROUP" selected={typeChangeProductsInGroup === 'ONE_PRODUCT_IN_GROUP'}>Хотя бы у одного товара в группе</option>*/}
              </select>

              <AsyncSelect
                className={`input input--select input--margin-right ${errorProductsInput && 'input--error'}`}
                isClearable
                cacheOptions
                value={ defaultValueSelect }
                defaultOptions={ defaultValueSelect }
                loadOptions={ loadProducts }
                onChange={(product) => {
                  setProducts([product]);
                  if (compareProducts?.length === 0) {
                    setCompareProducts([product]);
                    setDefaultCompareValueSelect([product]);
                  }
                  setDefaultValueSelect(product);
                  setErrorProductsInput(false);
                }}
                placeholder="Начните вводить название товара"
              />

              <span className="form-block__trigger-text">фирмы</span>

              <select
                className="input input--trigger"
                onChange={(evt) => {
                  setFirms([Number(evt.target.value)]);
                }}
              >
                {
                  firmsSelect.map((firm) => {
                    return <option value={firm.id} selected={firm.id === firms[0]}>{firm.name}</option>
                  })
                }
              </select>
            </div>
          </div>

          <div className="standart-block trigger-add__block">
            <h2 className="header header--2 header--space-bottom">Шаг 3. Задайте условие срабатывания</h2>
            <div className="form-block">
              <select
                className="input input--trigger input--margin-right"
                defaultValue={compareObject}
                onChange={(evt) => {
                  setCompareObject(evt.target.value);
                }}
              >
                <option value="PRICE" selected={compareObject === 'PRICE'}>Цена</option>
                <option value="COUNT" selected={compareObject === 'COUNT'}>Наличие</option>
              </select>

              <select
                className="input input--trigger input--margin-right"
                defaultValue={compareCondition}
                onChange={(evt) => {
                  setCompareCondition(evt.target.value);
                }}
              >
                <option value="gt" selected={compareCondition === 'gt'}>&gt;</option>
                <option value="lt" selected={compareCondition === 'lt'}>&lt;</option>
                <option value="DIFFERENT" selected={compareCondition === 'DIFFERENT'}>Изменилась(-ось)</option>
                <option value="NOT_DIFFERENT" selected={compareCondition === 'NOT_DIFFERENT'}>Не изменилась(-ось)</option>
              </select>
              {
                (compareCondition !== 'DIFFERENT' && compareCondition !== 'NOT_DIFFERENT') &&
                <select
                  className="input input--trigger input--margin-right"
                  defaultValue={compareType}
                  onChange={(evt) => {
                    setCompareType(evt.target.value);
                  }}
                >
                  <option value="VALUE" selected={compareType === 'VALUE'}>Значения</option>
                  <option value="PRODUCT" selected={compareType === 'PRODUCT'}>Определённого товара</option>
                </select>
              }

              {
                compareType === 'VALUE'
                && (compareCondition !== 'DIFFERENT' && compareCondition !== 'NOT_DIFFERENT') &&
                <input
                  ref={compareValueRef}
                  className="input input--trigger"
                  name="value"
                  type="number"
                  defaultValue={compareValueRef.current}
                  placeholder="Введите значение"
                  title="Введите значение для сравнения"
                  alt="Введите значение для сравнения"
                  onChange={(evt) => {
                    setCompareValue(evt.target.value);
                    setErrorCompareValue(false);
                  }}
                />
              }
            </div>
          </div>

          <div className="standart-block trigger-add__block">
            {
              (compareType === 'VALUE'
                || compareCondition === 'DIFFERENT'
                || compareCondition === 'NOT_DIFFERENT') && <div className="trigger-add__background-disable" />
            }

            <h2 className="header header--2 header--space-bottom">
              {
                (compareType === 'VALUE'
                  || compareCondition === 'DIFFERENT'
                  || compareCondition === 'NOT_DIFFERENT')
                  ? 'При выбранных параметрах данный шаг пропускается' : 'Шаг 4. Задайте объекты для сравнения'
              }
            </h2>

            <div className="form-block">
              <span className="form-block__trigger-text">чем у</span>

              <select
                className="input input--trigger input--margin-right"
                onChange={(evt) => {
                  setTypeCompareChangeProductsInGroup(evt.target.value);
                }}
              >
                <option value="PRODUCT" selected={compareTypeChangeProductsInGroup === 'PRODUCT'}>Товар</option>
                {/*<option value="ALL_PRODUCT_IN_GROUP" selected={compareTypeChangeProductsInGroup === 'ALL_PRODUCT_IN_GROUP'}>Все товары в группе</option>*/}
                {/*<option value="ONE_PRODUCT_IN_GROUP" selected={compareTypeChangeProductsInGroup === 'ONE_PRODUCT_IN_GROUP'}>Хотя бы у одного товара в группе</option>*/}
              </select>

              <AsyncSelect
                className={`input input--select input--margin-right ${errorCompareProductsInput && 'input--error'}`}
                isClearable
                isDisabled={(compareType === 'VALUE'
                  || compareCondition === 'DIFFERENT'
                  || compareCondition === 'NOT_DIFFERENT')}
                cacheOptions
                value={ defaultCompareValueSelect }
                loadOptions={ loadProducts }
                onChange={(product) => {
                  setCompareProducts([product]);
                  setDefaultCompareValueSelect([product]);
                  setErrorCompareProducts(false);
                }}
                placeholder="Начните вводить название товара"
              />

              <span className="form-block__trigger-text">фирмы</span>

              <select
                className="input input--trigger"
                onChange={(evt) => {
                  setCompareFirms([Number(evt.target.value)]);
                }}
              >
                {
                  firmsSelect.map((firm) => {
                    return <option value={firm.id} selected={compareFirms?.includes(firm.id)}>{firm.name}</option>
                  })
                }
              </select>
            </div>
          </div>

          <div className="standart-block trigger-add__block">
            <h2 className="header header--2 header--space-bottom">
              {
                compareType === 'VALUE' && 'Шаг 4. Действие'
              }

              {
                compareType === 'PRODUCT' && 'Шаг 5. Действие'
              }
            </h2>

            <ul className="trigger-action-list">
              <li className="trigger-action-list__item">
                <div className="form-block form-block--radio">
                  <input
                    id="action-notification-email"
                    className="input input--radio"
                    type="checkbox"
                    defaultChecked={isActionSendEmail}
                    defaultValue={isActionSendEmail}
                    onClick={(evt) => {
                      setIsActionSendEmail(evt.target.checked);
                    }}
                  />
                  <label htmlFor="action-notification-email">Отправить уведомление на электронную почту</label>
                </div>

                <div
                  className={isActionSendEmail ?
                    'trigger-action-block' : 'trigger-action-block visually-hidden'
                  }
                >
                  <div className="trigger-action-block__email-settings">
                    <label
                      className="input__label-text"
                      htmlFor="emails"
                    >
                      Адреса электронных почт (построчно)
                    </label>
                    <textarea
                      ref={emailsRef}
                      id="emails"
                      className={`input ${ errorEmailsInput && 'input--error' }`}
                      defaultValue={emails.join('\n')}
                      value={emails.join('\n')}
                      rows="4"
                      placeholder="example@mail.ru&#10;example@yandex.ru&#10;example@gmail.com"
                      onChange={() => {
                        const emailsText = emailsRef.current.value;
                        if (emailsText !== '') {
                          const emailsResult = emailsText?.split('\n').map((email) => {
                            if (email !== '') {
                              return email.trim();
                            }
                          });

                          setEmails(emailsResult);
                          setErrorEmailsInput(false);
                          return true;
                        }

                        setEmails([]);
                        setErrorEmailsInput(false);
                      }}
                    >
                    </textarea>

                    <label
                      className="input__label-text"
                      htmlFor="email-text"
                    >
                      Дополнительный текст
                    </label>
                    <textarea
                      ref={additionalTextRef}
                      id="email-text"
                      className="input input--no-margin-bottom"
                      defaultValue={additionalText}
                      rows="4"
                      placeholder="Например: Необходимо уведомить маркетолога и изменить цену товара в 1С."
                      onChange={() => {
                        setAdditionalText(additionalTextRef.current.value);
                      }}
                    >
                    </textarea>
                  </div>

                  <div className="trigger-action-block__email-example">
                    <span className="trigger-action-block__header-example">
                      Пример структуры письма
                    </span>

                    <div className="trigger-email-example">
                      <p className="trigger-email-example__text">
                        <span className="trigger-email-example__header">Тема: </span>
                        <span className="trigger-email-example__header-text">
                          [СРАБОТАЛ  ТРИГГЕР]: {nameTrigger}
                        </span>
                      </p>

                      <p className="trigger-email-example__text">
                        <span className="trigger-email-example__header">Получатели: </span>
                        <span className="trigger-email-example__header-text">
                          { (emails && emails.length !== 0) && emails?.join('; ') }
                        </span>
                      </p>

                      <p className="trigger-email-example__text">
                        <span className="trigger-email-example__header">Текст письма: </span>
                        <div className="trigger-email-example__header-text">
                          <p className="trigger-email-example__text trigger-email-example__text--mail">
                            <span className="trigger-email-example__text-italic">
                              Дата и время срабатывания:
                            </span>
                            <span className="trigger-email-example__text"> {dayjs().format('DD.MM.YYYY HH:mm')}</span>
                          </p>

                          <p className="trigger-email-example__text trigger-email-example__text--mail">
                          <span className="trigger-email-example__text-italic">
                            Условие срабатывания:
                          </span>
                            <div className="trigger-email-example__text">
                              {
                                getEmailAdditionalText(
                                  compareObject,
                                  compareCondition,
                                  compareType,
                                  compareValue,
                                  firmsSelect,
                                  products,
                                  firms,
                                  compareProducts,
                                  compareFirms
                                )
                              }
                            </div>
                          </p>


                          {
                            additionalText !== '' &&
                            <p className="trigger-email-example__text trigger-email-example__text--mail">
                              <span className="trigger-email-example__text-italic">
                                Дополнительный текст:
                              </span>
                              <div className="trigger-email-example__text">
                                {additionalText}
                              </div>
                            </p>
                          }

                          <p className="trigger-email-example__text trigger-email-example__text--mail">
                            {
                              (products || compareProducts) &&
                              <span className="trigger-email-example__text-italic">
                                Ссылки:
                              </span>
                            }
                            <div className="trigger-email-example__text">
                              {
                                products  && <span>Сравниваемые товары:</span>
                              }

                              {
                                products &&
                                products?.map((product) => {
                                  return (
                                    <div>
                                      <span>{product?.label} - </span>

                                      <a href={`https://eurotech.antushev.com/monitoring/${product?.value}`}>
                                        {`https://eurotech.antushev.com/monitoring/${product?.value}`}
                                      </a>
                                    </div>
                                  )
                                })
                              }

                              {
                                (compareType === 'PRODUCT' && compareProducts) && <span>Товары для сравнения:</span>
                              }

                              {
                                compareType === 'PRODUCT' && compareProducts &&
                                compareProducts?.map((product) => {
                                  return (
                                    <div>
                                      <span>{product?.label} - </span>

                                      <a href={`https://eurotech.antushev.com/monitoring/${product?.value}`} target="_blank">
                                        {`https://eurotech.antushev.com/monitoring/${product?.value}`}
                                      </a>
                                    </div>
                                  )
                                })
                              }
                            </div>
                          </p>
                        </div>
                      </p>

                      <button
                        type="button"
                        className="button button--no-background button--text-blue"
                        onClick={async () => {
                          const validateStatus = getValidateStatus();

                          if (!validateStatus) {
                            return false;
                          }

                          const trigger = getTriggerData();

                          setIsSendingTestEmail(true);
                          await api.post('/send/email/trigger', { ...trigger });
                          setIsSendingTestEmail(false);
                          toast.info(`Тестовое электронное письмо отправлено на следующие электронные ящики: ${trigger.emails.join(', ')}`);
                        }}
                      >
                        {
                          isSendingTestEmail
                            ? <Preloader width={WIDTH_PRELOADER} height={HEIGHT_PRELOADER} color={COLOR_PRELOADER_TEST_EMAIL} />
                            : 'Отправить тестовое письмо'
                        }
                      </button>
                    </div>
                  </div>
                </div>
              </li>

              {/*<li className="trigger-action-list__item">*/}
              {/*  <div className="form-block form-block--radio">*/}
              {/*    <input*/}
              {/*      id="action-notification-telegram"*/}
              {/*      className="input input--radio"*/}
              {/*      type="checkbox"*/}
              {/*    />*/}
              {/*    <label htmlFor="action-notification-telegram">Отправить уведомление в Telegram</label>*/}
              {/*  </div>*/}
              {/*</li>*/}

              {/*<li className="trigger-action-list__item">*/}
              {/*  <div className="form-block form-block--radio">*/}
              {/*    <input*/}
              {/*      id="action-1s"*/}
              {/*      className="input input--radio"*/}
              {/*      type="checkbox"*/}
              {/*    />*/}
              {/*    <label htmlFor="action-1s">Создать документ "Установка цен" в 1C</label>*/}
              {/*  </div>*/}
              {/*</li>*/}
            </ul>
          </div>

          <div className="standart-block trigger-add__block">
            <div className="trigger-add__buttons">
              <button
                type="button"
                className="button button--no-background button--text-blue"
              >
                Сбросить настройки
              </button>
              <button
                type="submit"
                className="button"
                onClick={async (evt) => {
                  evt.preventDefault();

                  const validateStatus = getValidateStatus();

                  if (!validateStatus) {
                    return false;
                  }

                  const trigger = getTriggerData();

                  await dispatch(updateTrigger(trigger));
                }}
              >
                {
                  isLoadTrigger
                    ? <Preloader width={WIDTH_PRELOADER} height={HEIGHT_PRELOADER} color={COLOR_PRELOADER} />
                    : 'Сохранить'
                }
              </button>
            </div>
          </div>
        </form>
      </section>
    </section>
  );
}

const loadProducts = async (name) => {
  const { data } = await api.post('/products/', {
    idUser: null,
    idParent: null,
    name: name,
    withStats: null,
    dateStart: null,
    dateEnd: null
  });

  return data.map((product) => {
    return {
      value: product.id,
      label: product.name
    }
  });
}

const getIdProducts = (products) => {
  return products?.map((product) => product.value);
}

const getEmailAdditionalText = (
  compareObject,
  compareCondition,
  compareType,
  compareValue,
  allFirms = [],
  productsName = [],
  firmsName = [],
  compareProductsName = [],
  compareFirmsName = []) =>
{
  const productsText = productsName?.map((product) => product?.label).join(', ');
  const firmsText = firmsName?.map((idFirm) => getFirmNameById(allFirms, idFirm)).join(', ');
  const compareProductsText = compareProductsName?.map((product) => product?.label).join(', ');
  const compareFirmsText = compareFirmsName?.map((idFirm) => getFirmNameById(allFirms, idFirm)).join(', ');
  const compareObjectText = compareObject === 'PRICE' ? 'цена' : 'наличие';
  const compareConditionText = getCompareConditionText(compareCondition);
  const compareTypeText = compareType === 'VALUE' ? 'заданного значения' : 'товара';

  let text = null;

  if (compareCondition === 'DIFFERENT' || compareCondition === 'NOT_DIFFERENT') {
    text = `У товара ${ productsText } фирмы ${ firmsText } ${ compareObjectText } ${ compareConditionText } за указанный период активности триггера`;
    return text;
  }

  text = `У товара ${ productsText } фирмы ${ firmsText } ${ compareObjectText } ${ compareConditionText }, чем у ${ compareTypeText } ${ compareType === 'VALUE' ? compareValue : compareProductsText + ' фирмы ' + compareFirmsText }`;
  return text;
}

const getCompareConditionText = (condition) => {
  switch (condition) {
    case ('gt'):
      return 'больше';
    case ('lt'):
      return 'меньше';
    case ('DIFFERENT'):
      return 'изменится';
    case ('NOT_DIFFERENT'):
      return 'не изменится';
    default:
      return '';
  }
}

const getFirmNameById = (firms, idFirm) => {
  const searchFirm = firms.find((firm) => Number(firm.id) === Number(idFirm));

  return searchFirm?.name;
}

// WIP: НУЖНО УКАЗАТЬ ID ТЕКУЩЕГО ПОЛЬЗОВАТЕЛЯ, КОТОРЫЙ ВОШЁЛ В СИСТЕМУ
const loadFirms = async () => {
  const { data } = await api.get('/firms/1');

  return data;
}

export default TriggerAddPage;
