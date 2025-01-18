import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { getCurrentUser } from '../../store/app-data/selectors.js';

import {
  AppRoute,
  MenuItem
} from '../../const';

const Menu = () => {
  const currentUser = useSelector(getCurrentUser);

  const [activeMenuItem, setActiveMenuItem] = useState(AppRoute.Monitoring);

  return (
    <aside className="menu page__menu">
      <div className="menu__inner">
        <div className="logo logo--menu">
          <img className="logo__img" src="/img/logo_eurotech_380.png" width="191" height="35" />
        </div>

        <ul className="menu-list">
          <li
            className={
              activeMenuItem === MenuItem.Analysis
              ? 'menu-list__item menu-list__item--active' : 'menu-list__item'
            }
            onClick={() => {
              setActiveMenuItem(MenuItem.Analysis)
            }}
          >

              <div className="menu-list__icon-block">
                <svg className="menu-list__icon" width="22" height="25" viewBox="0 0 22 25">
                  <path
                    d="M19.5312 0H2.34375C1.09375 0 0 1.09375 0 2.34375V22.6562C0 23.9062 1.09375 25 2.34375 25H19.5312C20.7812 25 21.875 23.9062 21.875 22.6562V2.34375C21.875 1.09375 20.7812 0 19.5312 0ZM6.25 21.25C6.25 21.5625 5.9375 21.875 5.625 21.875H3.75C3.4375 21.875 3.125 21.5625 3.125 21.25V19.375C3.125 19.0625 3.4375 18.75 3.75 18.75H5.625C5.9375 18.75 6.25 19.0625 6.25 19.375V21.25ZM6.25 15C6.25 15.3125 5.9375 15.625 5.625 15.625H3.75C3.4375 15.625 3.125 15.3125 3.125 15V13.125C3.125 12.8125 3.4375 12.5 3.75 12.5H5.625C5.9375 12.5 6.25 12.8125 6.25 13.125V15ZM12.5 21.25C12.5 21.5625 12.1875 21.875 11.875 21.875H10C9.6875 21.875 9.375 21.5625 9.375 21.25V19.375C9.375 19.0625 9.6875 18.75 10 18.75H11.875C12.1875 18.75 12.5 19.0625 12.5 19.375V21.25ZM12.5 15C12.5 15.3125 12.1875 15.625 11.875 15.625H10C9.6875 15.625 9.375 15.3125 9.375 15V13.125C9.375 12.8125 9.6875 12.5 10 12.5H11.875C12.1875 12.5 12.5 12.8125 12.5 13.125V15ZM18.75 21.25C18.75 21.5625 18.4375 21.875 18.125 21.875H16.25C15.9375 21.875 15.625 21.5625 15.625 21.25V13.125C15.625 12.8125 15.9375 12.5 16.25 12.5H18.125C18.4375 12.5 18.75 12.8125 18.75 13.125V21.25ZM18.75 8.75C18.75 9.0625 18.4375 9.375 18.125 9.375H3.75C3.4375 9.375 3.125 9.0625 3.125 8.75V3.75C3.125 3.4375 3.4375 3.125 3.75 3.125H18.125C18.4375 3.125 18.75 3.4375 18.75 3.75V8.75Z"
                    fill="#141414" fillOpacity="0.9"/>
                </svg>
              </div>
            <NavLink to={AppRoute.Analysis}>
              <a className="menu-list__link" href="#">Анализ спроса</a>
            </NavLink>
          </li>
          <li
            className={
              activeMenuItem === MenuItem.Monitoring
              ? 'menu-list__item menu-list__item--active' : 'menu-list__item'
            }
            onClick={() => {
              setActiveMenuItem(MenuItem.Monitoring)
            }}
          >
              <div className="menu-list__icon-block">
                <svg className="menu-list__icon" idth="25" height="22" viewBox="0 0 25 22">
                  <path d="M20.3125 0.78125C20.3125 0.349609 19.9629 0 19.5312 0H16.4062C15.9746 0 15.625 0.349609 15.625 0.78125V3.125H20.3125V0.78125ZM3.12061 6.24951C2.99805 10.832 0.168945 11.8271 0 18.1641V20.3125C0 21.1753 0.699707 21.875 1.5625 21.875H6.25C7.11279 21.875 7.8125 21.1753 7.8125 20.3125V12.5H9.375V4.6875H4.67969C3.81885 4.6875 3.14404 5.38916 3.12061 6.24951ZM21.8794 6.24951C21.856 5.38916 21.1812 4.6875 20.3203 4.6875H15.625V12.5H17.1875V20.3125C17.1875 21.1753 17.8872 21.875 18.75 21.875H23.4375C24.3003 21.875 25 21.1753 25 20.3125V18.1641C24.8311 11.8271 22.002 10.832 21.8794 6.24951ZM8.59375 0H5.46875C5.03711 0 4.6875 0.349609 4.6875 0.78125V3.125H9.375V0.78125C9.375 0.349609 9.02539 0 8.59375 0ZM10.9375 12.5H14.0625V4.6875H10.9375V12.5Z" fill="#141414"/>
                </svg>
              </div>
            <NavLink to={AppRoute.Monitoring}>
              <a className="menu-list__link" href="#">Мониторинг</a>
            </NavLink>
          </li>
        </ul>

        <ul className="menu-list">
          <li
            className={
              activeMenuItem === MenuItem.Triggers
              ? 'menu-list__item menu-list__item--active' : 'menu-list__item'
            }
            onClick={() => {
              setActiveMenuItem(MenuItem.Triggers);
            }}
          >
            <div className="menu-list__icon-block">
              <svg className="menu-list__icon" width="25" height="23" viewBox="0 0 25 23">
                <path d="M25 10.4167C25 9.39106 24.4379 8.50521 23.6111 8.02431V1.38932C23.6111 1.00955 23.3082 0 22.2222 0C21.9132 0 21.6063 0.103299 21.355 0.304688L17.6645 3.25738C15.8108 4.73915 13.4835 5.55556 11.1111 5.55556H2.77778C1.24349 5.55556 0 6.79905 0 8.33333V12.5C0 14.0343 1.24349 15.2778 2.77778 15.2778H4.24045C4.18012 15.7326 4.14583 16.1953 4.14583 16.6667C4.14583 18.3928 4.54774 20.0239 5.25521 21.4818C5.48047 21.9457 5.97222 22.2222 6.48785 22.2222H9.71181C10.8424 22.2222 11.5213 20.9271 10.8359 20.0278C10.1241 19.0938 9.70095 17.9288 9.70095 16.6667C9.70095 16.1845 9.77127 15.7209 9.89236 15.2778H11.1111C13.4835 15.2778 15.8108 16.0942 17.6641 17.576L21.3546 20.5286C21.6007 20.7256 21.9065 20.8331 22.2218 20.8333C23.3034 20.8333 23.6107 19.8446 23.6107 19.4444V12.8095C24.4379 12.3281 25 11.4423 25 10.4167ZM20.8333 16.5547L19.3989 15.4071C17.0551 13.5321 14.1111 12.5 11.1111 12.5V8.33333C14.1111 8.33333 17.0551 7.30121 19.3989 5.42621L20.8333 4.27865V16.5547Z" fill="#141414"/>
              </svg>
            </div>
            <NavLink to={ AppRoute.Triggers }>
              <a className="menu-list__link" href="#">Триггеры</a>
            </NavLink>
          </li>
        </ul>

        <ul className="menu-list">
          <li
            className={
              activeMenuItem === MenuItem.Settings
                ? 'menu-list__item menu-list__item--active' : 'menu-list__item'
            }
            onClick={() => {
              setActiveMenuItem(MenuItem.Settings)
            }}
          >

            <div className="menu-list__icon-block">
              <svg className="menu-list__icon" width="26" height="26" viewBox="0 0 26 26" fill="none">
                <path d="M24.7133 16.1242L22.4674 14.8347C22.6941 13.6185 22.6941 12.371 22.4674 11.1548L24.7133 9.86533C24.9717 9.71856 25.0877 9.41453 25.0033 9.13147C24.4181 7.26534 23.4217 5.57745 22.1195 4.17261C21.9191 3.9577 21.5922 3.90528 21.3392 4.05205L19.0933 5.34156C18.1496 4.53431 17.0635 3.91052 15.8878 3.50165V0.927868C15.8878 0.634321 15.6822 0.377467 15.3922 0.314564C13.4574 -0.115273 11.4751 -0.0943054 9.6351 0.314564C9.34514 0.377467 9.13952 0.634321 9.13952 0.927868V3.50689C7.96912 3.921 6.88306 4.54479 5.93408 5.3468L3.69343 4.05729C3.4351 3.91052 3.1135 3.9577 2.91316 4.17786C1.61095 5.57745 0.614523 7.26534 0.0293192 9.13671C-0.0603066 9.41977 0.0609519 9.7238 0.319285 9.87058L2.5652 11.1601C2.3385 12.3762 2.3385 13.6238 2.5652 14.8399L0.319285 16.1294C0.0609519 16.2762 -0.0550345 16.5802 0.0293192 16.8633C0.614523 18.7294 1.61095 20.4173 2.91316 21.8221C3.1135 22.0371 3.44037 22.0895 3.69343 21.9427L5.93935 20.6532C6.88306 21.4605 7.96912 22.0842 9.1448 22.4931V25.0721C9.1448 25.3657 9.35041 25.6225 9.64037 25.6854C11.5752 26.1153 13.5576 26.0943 15.3975 25.6854C15.6875 25.6225 15.8931 25.3657 15.8931 25.0721V22.4931C17.0635 22.079 18.1496 21.4552 19.0985 20.6532L21.3445 21.9427C21.6028 22.0895 21.9244 22.0423 22.1247 21.8221C23.4269 20.4226 24.4234 18.7347 25.0086 16.8633C25.0877 16.575 24.9717 16.271 24.7133 16.1242ZM12.5137 17.1883C10.1887 17.1883 8.29599 15.3064 8.29599 12.9948C8.29599 10.6831 10.1887 8.80123 12.5137 8.80123C14.8387 8.80123 16.7314 10.6831 16.7314 12.9948C16.7314 15.3064 14.8387 17.1883 12.5137 17.1883Z" fill="#141414"/>
              </svg>
            </div>
            <NavLink to={AppRoute.Settings}>
              <a className="menu-list__link" href="#">Настройки</a>
            </NavLink>
          </li>
        </ul>

        <div className="account menu__account">
          <div className="account__inner">
            <div className="account__logo">
              <img className="account__img" src="/img/logo.jpg" width="61" height="61" />
            </div>
            <div className="account__name">
              <div className="account__name-text">{`${currentUser.firstName} ${currentUser.lastName}`}</div>
              <div className="account__company-text">ООО ЕВРОТЕК</div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Menu;
