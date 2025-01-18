import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchFirmsByIdUser = createAsyncThunk(
  'data/fetchFirmsByIdUser',
  async (idUser, { extra: api}) => {
    const { data } = await api.get(`/firms/${idUser}`);
    return data;
  });

export const setFirmsActiveByIdUser = createAsyncThunk(
  'data/setFirmsActiveByIdUser',
  async ({idUser, firms}, {extra: api}) => {
    const { data } = await api.put(`/firms/select-active/${idUser}`, { firms });

    return data;
  });

export const fetchCurrentProductById = createAsyncThunk(
  'data/fetchProductById',
  async (idProduct, { extra: api }) => {
    const { data } = await api.get(`/product/${idProduct}`);

    return data;
  }
)

export const fetchProductsWithSummaryDetail = createAsyncThunk(
  'data/fetchProductsWithSummaryDetail',
  async (param, { extra: api }) => {

    const { data } = await api.post('/products/', { ...param });

    return data;
  });

export const fetchProductWithDetailStats = createAsyncThunk(
  'data/fetchProductWithDetailStats',
  async (param, { extra: api }) => {

    const { data } = await api.post('/product/detail-stats/', { ...param });

    return data;
  });

export const fetchProductsGroups = createAsyncThunk(
  'data/fetchProductsGroups',
  async ({ idUser }, { extra: api }) => {
    const { data } = await api.get(`/products/only-groups/${idUser}`);

    return data;
  });

export const createProduct = createAsyncThunk(
  'data/createProduct',
  async ({ product }, {extra: api}) => {

    const { data } = await api.post('/product/', { product: product })

    return data;
  });

export const updateProduct = createAsyncThunk(
  'data/updateProduct',
  async ({ product }, { extra: api }) => {
    const { data } = await api.put('/product/', {product});

    return data;
  });

export const deleteProduct = createAsyncThunk(
  'data/deleteProduct',
  async (idProduct, { extra: api }) => {
    const { data } = await api.delete(`/product/${idProduct}`);

    return data;
  });

export const createLink = createAsyncThunk(
  'data/createLink',
  async (param, {extra: api}) => {
    console.log(param);

    const { data } = await api.post('/link/', { ...param });

    return data;
  });

export const updateLink = createAsyncThunk(
  'data/updateLink',
  async (param, { extra: api }) => {
    const { data } = await api.put('/link/', param);

    return data;
  });

export const deleteLink = createAsyncThunk(
  'data/deleteLink',
  async (idLink, { extra: api }) => {
    console.log('ID ссылки', idLink);

    const { data } = await api.delete(`/link/${idLink}`);

    return data;
  });

export const fetchTriggers = createAsyncThunk(
  'data/fetchTriggers',
  async (idUser, { extra: api }) => {
    const { data } = await api.get(`/triggers/${idUser}`);

    return data;
  });
export const fetchTriggersForProduct = createAsyncThunk(
  'data/fetchTriggersForProduct',
  async ({idUser, idProduct}, { extra: api }) => {
    console.log(idUser, idProduct);

    const { data } = await api.get(`/triggers/${idUser}/product/${idProduct}`);

    return data;
  });

export const createTrigger = createAsyncThunk(
  'data/createTrigger',
  async (trigger, { extra: api }) => {
    const { data } = await api.post('/trigger/', { ...trigger });

    return data;
  });

export const updateTrigger = createAsyncThunk(
  'data/updateTrigger',
  async (updateFieldTrigger, { extra: api }) => {
    const { data } = await api.put(`/trigger/${updateFieldTrigger.id}`, {...updateFieldTrigger});

    return updateFieldTrigger;
  });

export const fetchAllMarks = createAsyncThunk(
  'data/fetchAllMarks',
  async (_args, { extra: api }) => {
    const { data } = await api.get('/mark/all');

    return data;
});

export const createMarks = createAsyncThunk(
  'data/createMarks',
  async ({ marks }, { extra: api }) => {
    await api.post('/mark/', { marks });
});

export const fetchAllProjects = createAsyncThunk(
  'data/fetchAllProjects',
  async (_args, { extra: api }) => {
    const { data } = await api.get('/project/all');

    return data;
  });

export const createProject = createAsyncThunk(
  'data/createProject',
  async ({ marks }, {extra: api}) => {
    await api.post('/project/', { marks });
  });

export const fetchParseData = createAsyncThunk(
  'data/getParseData',
  async (link, {extra: api}) => {
    const { data } = await api.post('/parser/', { link });

    return data;
  });

export const fetchReports = createAsyncThunk(
  'data/getReports',
  async (_args, {extra: api}) => {
    const { data } = await api.get('/reports/');

    return data;
  }
)

export const deleteAll = createAsyncThunk(
  'data/deleteAll',
  async (_args, {extra: api}) => {
    await api.delete('/deleteAll/');
  });

export const checkSyncUrlXMLForBitrix = createAsyncThunk(
  'data/checkSyncUrlXMLForBitrix',
  async (url, {extra: api}) => {
    const { data } = await api.post('/sync/bitrix/check-url', { url });

    const { categoriesCount, productsCount } = data;

    return {categoriesCount, productsCount};
  }
);

export const fetchSettingsSyncBitrix = createAsyncThunk(
  'data/getSettingsSyncBitrix',
  async ({idUser, idFirm}, {extra: api}) => {

    const { data } = await api.get(`/sync/bitrix/${idUser}/${idFirm}`);

    return data;
  }
)

export const setSettingsSyncBitrix = createAsyncThunk(
  'data/setSettingsSyncBitrix',
  async ({ syncSettingsBitrix }, { extra: api }) => {

    const { data } = await api.post('/sync/bitrix/', { ...syncSettingsBitrix });

    console.log(data);

    return data;
  }
);

export const fetchReportsIntegrations = createAsyncThunk(
  'data/fetchReportsIntegrations',
  async (_args, {extra: api}) => {
    const { data } = await api.get('/reports-integrations');

    return data;
  }
)

export const fetchStartSyncBitrix = createAsyncThunk(
  'data/fetchStartSyncBitrix',
  async ({idUser, idFirm}, {extra: api}) => {
    console.log('ACTION:', idUser, idFirm);

    const {data} = await api.post('/sync/bitrix/start', {idUser, idFirm});

    return data;
  });
