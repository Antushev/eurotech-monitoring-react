import { ID_EXTENSION } from '../const.js';

const CommandForGetDataExtension = {
  GET_VERSION: 'version',
  GET_DATA_PRODUCT: 'site-check-for-data'
}

const CommandForAction = {
  OPEN_OF_PRODUCT: 'open-for-add-firm',
  CLEAR_DATA: 'clear-data-for-open'
}

const getDataExtension = async (command) => {
  if (chrome.runtime.lastError) {
    console.log(chrome.runtime.lastError);
  }

  const response =  await chrome.runtime.sendMessage(ID_EXTENSION, { message:  command});

  if (response) {
    return response;
  }

  return false;
}

const actionExtension = async (command, param = null) => {
  if (chrome.runtime.lastError) {
    console.log(chrome.runtime.lastError);
  }

  if (param?.url) {
    window.open(param?.url);
  }

  await chrome.runtime.sendMessage(ID_EXTENSION, { message: command });
}

export {
  CommandForGetDataExtension,
  CommandForAction,
  getDataExtension,
  actionExtension
};
