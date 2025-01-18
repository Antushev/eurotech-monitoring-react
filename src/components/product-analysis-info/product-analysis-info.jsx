import React, {useState} from 'react';

const ProductAnalysisInfo = (props) => {
  const { name } = props.product;
  const { collectedKeywords } = props.product;

  const [isOpenPhrases, setIsOpenPhrases] = useState(true);
  const [isOpenSeasons, setIsOpenSeasons] = useState(false);
  const [isOpenRegions, setIsOpenRegions] = useState(false);

  return (
    <>
      <h2 className="header header--2 header--block info__header">{name}</h2>

      <ul className="info__menu">
        <li
          className={
            isOpenPhrases
              ?
              "info__menu-item info__menu-item--active"
              : "info__menu-item"
            }
          onClick={() => {
            setIsOpenPhrases(true);
            setIsOpenSeasons(false);
            setIsOpenRegions(false);
          }}
        >
          Популярные запросы
        </li>
        <li
          className={
            isOpenSeasons
            ?
              "info__menu-item info__menu-item--active"
              : "info__menu-item"
          }
          onClick={() => {
            setIsOpenPhrases(false);
            setIsOpenSeasons(true);
            setIsOpenRegions(false)
          }}
        >
          Сезонность
        </li>
        <li
          className={
            isOpenRegions
            ?
              "info__menu-item info__menu-item--active"
              : "info__menu-item"
          }
          onClick={() => {
            setIsOpenPhrases(false);
            setIsOpenSeasons(false);
            setIsOpenRegions(true);
          }}
        >
          Регионы
        </li>
      </ul>

      {
        isOpenPhrases
        ?
          <div className="info__content standart-block">
            <h2 className="header header--2">Популярные запросы</h2>
            <table className="keywords-list">
              {collectedKeywords ?
                collectedKeywords.map((keyword) => {
                  return (<tr>
                    <td><span>{keyword.keyword}</span> </td>
                    <td><span>{keyword.displays}</span></td>
                  </tr>);
                }) : ''
              }
            </table>
          </div>
          : ''
      }

      {
        isOpenSeasons
        ?
          <div className="info__content standart-block">
            <h2 className="header header--2">Сезонность</h2>
          </div>
          : ''
      }

      {
        isOpenRegions
        ?
          <div className="info__content standart-block">
            <h2 className="header header--2">Регионы</h2>
          </div>
          : ''
      }
    </>
  )
}

export default ProductAnalysisInfo;
