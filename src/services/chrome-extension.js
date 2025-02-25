import { ID_EXTENSION } from '../const.js';

const CommandForGetDataExtension = {
  GET_DATA_PRODUCT: 'site-check-for-data'
}

const getDataExtension = async (command) => {
  if (chrome.runtime.lastError) {
    console.log(chrome.runtime.lastError);
  }

  const response =  await chrome.runtime.sendMessage(ID_EXTENSION, { message:  command});

  console.log(response);

  if (response) {
    return response;
  }

  return false;
}

 export { CommandForGetDataExtension, getDataExtension };
