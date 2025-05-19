import React, {useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ExcelRenderer } from 'react-excel-renderer';

import {
  createMarks,
  createProject,
  fetchAllMarks,
  fetchAllProjects
} from '../../store/api-actions.js';
import { getStatusCreateNewProject } from '../../store/app-data/selectors.js';

import Preloader from '../preloader/preloader.jsx';

const WIDTH_PRELOADER = 15;
const HEIGHT_PRELOADER = 15;

const PopupAddMarks = (props) => {
  const dispatch = useDispatch();

  const {isOpen, setIsOpen} = props;
  const [marksNew, setMarks] = useState(null);

  const isProcessCreated = useSelector(getStatusCreateNewProject);

  const fileInput = React.useRef();
  const textInput = React.useRef();

  return (
    <>
      <div className="background-black" />
      <div className="modal">
        <div
          className="modal__close"
          onClick={() => {setIsOpen(false)}}
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path
              d="M11.8516 8.59375L16.7378 3.70752C17.3374 3.10791 17.3374 2.13574 16.7378 1.53564L15.6519 0.449707C15.0522 -0.149902 14.0801 -0.149902 13.48 0.449707L8.59375 5.33594L3.70752 0.449707C3.10791 -0.149902 2.13574 -0.149902 1.53564 0.449707L0.449707 1.53564C-0.149902 2.13525 -0.149902 3.10742 0.449707 3.70752L5.33594 8.59375L0.449707 13.48C-0.149902 14.0796 -0.149902 15.0518 0.449707 15.6519L1.53564 16.7378C2.13525 17.3374 3.10791 17.3374 3.70752 16.7378L8.59375 11.8516L13.48 16.7378C14.0796 17.3374 15.0522 17.3374 15.6519 16.7378L16.7378 15.6519C17.3374 15.0522 17.3374 14.0801 16.7378 13.48L11.8516 8.59375Z"
              fill="#BE1622"/>
          </svg>
        </div>

        <h2 className="header header--2 header--center">Добавление маркировок</h2>

        <p className="modal__text text text--center text--italic">Введите построчно значение маркировок в поле ниже или
          добавьте из файла Excel <br />
          <b>Примечание:</b> все маркировки в Excel-файле должны располагаться <u>в столбце А</u>
        </p>

        <form>
          <label htmlFor="products" />
          <textarea
            ref={textInput}
            id="products"
            className="input input--textarea"
            onresize="none"
            placeholder="Распределитель 1P40"
            defaultValue={parseExcelObject(marksNew)}
            onChange={() => {
              const lines = textInput.current.value.split('\n').map((lineText) => {
                return lineText.trim();
              });
              setMarks(lines);
            }}
          />


          <div className="modal__buttons">
            <button
              className="button button--text-blue button--no-background"
              type="file"
              onClick={(evt) => {
                evt.preventDefault();

                fileInput.current.click()
              }}
            >
              Загрузить из Excel
            </button>
            <input
              ref={fileInput}
              type="file"
              style={{ display: "none" }}
              onChange={(event) => {
                setMarks(null);

                const excelObject = event.target.files[0];

                ExcelRenderer(excelObject, (error, response) => {
                  if (error) {
                    console.log(error);

                    return false;
                  }

                  const result = response.rows.map((row) => {
                    return row[0];
                  })
                  setMarks(result);
                })
              }}
            />

            <button
              className="button"
              type="button"
              onClick={async () => {
                const marks = marksNew.map((product) => {
                  return {
                    name: product,
                    totalShow: null
                  }
                })

                await dispatch(createMarks({marks}));
                await dispatch(createProject({marks}));
                await dispatch(fetchAllMarks());
                await dispatch(fetchAllProjects());
                setIsOpen(false);
              }}
            >
              {
                isProcessCreated ? <Preloader width={WIDTH_PRELOADER} height={HEIGHT_PRELOADER} /> : 'Добавить и запустить анализ'
              }
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

const parseExcelObject = (products) => {
  if (products === null) {
    return '';
  }

  return products.map((product) => {
    return product
  }).join('\n')
}

export default PopupAddMarks;
