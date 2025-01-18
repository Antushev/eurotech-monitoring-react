import React from 'react';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { getAllProjects } from '../../store/app-data/selectors.js';

import Preloader from '../preloader/preloader.jsx';

const WIDTH_PRELOADER = 15;
const HEIGHT_PRELOADER = 15;

const PopupReports = (props) => {
  const {isOpen, setIsOpen} = props;

  const projects = useSelector(getAllProjects);

  return (
    <>
      <div className="background-black" />
      <div className="modal modal--reports">
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

        <h2 className="header header--2 header--center header--reports">Список отчётов</h2>

        <table className="table reports-table">
          <tr className="table__tr">
            <th className="table__td table__td--th">ID отчёта</th>
            <th className="table__td table__td--th">Дата создания</th>
            <th className="table__td table__td--th">Статус</th>
            <th className="table__td table__td--th">Ссылка</th>
          </tr>
          {
            projects.map((project, index) => {
              return (
                <tr key={index} className="table__tr">
                  <td className="table__td">{project.id}</td>
                  <td className="table__td">{dayjs(project.date).format('DD.MM.YYYY HH:mm')}</td>
                  <td className="table__td">
                    {project.status !== ('Success' || 'Done')
                      ? <>
                        <Preloader
                          width={WIDTH_PRELOADER}
                          height={HEIGHT_PRELOADER}
                        />
                        {' ' + project.status}
                      </> : project.status
                    }
                  </td>
                  <td className="table__td">
                    {
                      project.status !== 'Success'
                      ? <Preloader
                          width={WIDTH_PRELOADER}
                          height={HEIGHT_PRELOADER}
                        /> : <a href={project.resulturl}>Скачать</a>
                    }
                  </td>
                </tr>
              )
            })
          }

        </table>

      </div>
    </>
  );
}

export default PopupReports;
