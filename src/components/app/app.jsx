import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import {
  AppRoute,
  LocalStorageKey,
  TypeShowValue,
  TypeShowConditionValue,
  Period
} from '../../const';

import {
  setTypeShowValue,
  setTypeShowConditionValue,
  setPeriod
} from '../../store/app-data/app-data.js';

import Menu from "../menu/menu.jsx";
import AnalysisPage from './../../pages/analysis-page/analysis-page.jsx';
import MonitoringPage from './../../pages/monitoring-page/monitoring-page.jsx';
import ProductMonitorPage from './../../pages/product-monitor-page/product-monitor-page.jsx';
import TriggersPage from './../../pages/triggers-page/triggers-page.jsx';
import TriggerAddPage from './../../pages/trigger-add-page/trigger-add-page.jsx';
import TriggerEditPage from './../../pages/trigger-edit-page/trigger-edit-page.jsx';
import FirmsPage from './../../pages/firms-page/firms-page.jsx';
import FirmAddPage from './../../pages/firm-add-page/firm-add-page.jsx';
import FirmEditPage from './../../pages/firm-edit-page/firm-edit-page.jsx';
import IntegrationPage from './../../pages/integration-page/integration-page.jsx';
// import SettingsPage from '../../pages/NOT_settings-page/settings-page.jsx';
import NotFoundPage from './../../pages/not-found-page/not-found-page.jsx';

const App = () => {
  const dispatch = useDispatch();

  if (!localStorage.getItem(LocalStorageKey.TYPE_SHOW_VALUE)) {
    localStorage.setItem(LocalStorageKey.TYPE_SHOW_VALUE, TypeShowValue.PRICE);
  }

  if (!localStorage.getItem(LocalStorageKey.TYPE_SHOW_CONDITION_VALUE)) {
    localStorage.setItem(LocalStorageKey.TYPE_SHOW_CONDITION_VALUE, TypeShowConditionValue.VALUE);
  }

  if (!localStorage.getItem(LocalStorageKey.PERIOD)) {
    localStorage.setItem(LocalStorageKey.PERIOD, Period.DAY)
  }

  const period = localStorage.getItem(LocalStorageKey.PERIOD);
  dispatch(setPeriod(period));
  const typeShowValue = localStorage.getItem(LocalStorageKey.TYPE_SHOW_VALUE);
  dispatch(setTypeShowValue(typeShowValue));
  const typeShowConditionValue = localStorage.getItem(LocalStorageKey.TYPE_SHOW_CONDITION_VALUE);
  dispatch(setTypeShowConditionValue(typeShowConditionValue));

  return (
    <>
      <ToastContainer />
      <Menu />
      <HelmetProvider>
        <Routes>
          <Route path={ AppRoute.Root } element={ <MonitoringPage /> } />
          <Route path={ AppRoute.Analysis } element={ <AnalysisPage /> } />
          <Route path={ AppRoute.ProductMonitor } element={ <ProductMonitorPage /> } />
          <Route path={ AppRoute.Monitoring } element={ <MonitoringPage /> } />
          <Route path={ AppRoute.TriggerAdd } element={ <TriggerAddPage /> } />
          <Route path={ AppRoute.TriggerEdit } element={ <TriggerEditPage /> } />
          <Route path={ AppRoute.Triggers } element={ <TriggersPage /> } />
          <Route path={ AppRoute.FirmAdd } element={ <FirmAddPage /> } />
          <Route path={ AppRoute.FirmEdit } element={ <FirmEditPage />} />
          <Route path={ AppRoute.Firms } element={ <FirmsPage /> } />
          <Route path={ AppRoute.Settings } element={ <IntegrationPage /> } />
          <Route path='*' element={ <NotFoundPage /> } />
        </Routes>
      </HelmetProvider>
    </>

  )
}

export { App };
