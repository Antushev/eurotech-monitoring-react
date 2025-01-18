import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';

import Menu from '../../components/menu/menu.jsx';

const SettingsPage = () => {
  return (
    <>
      <Menu />
      <section className="page-content page__content">
        <header className="page-content__header standart-block">
          <h1 className="header header--1">Настройки</h1>
        </header>

        <ul className="info__menu">
          <li className="info__menu-item">
            Уведомления
          </li>
          <li className="info__menu-item">
            <NavLink to="/settings/integrations">Интеграции</NavLink>
          </li>
        </ul>

        <Outlet />
      </section>
    </>
  )
}

export default SettingsPage;
