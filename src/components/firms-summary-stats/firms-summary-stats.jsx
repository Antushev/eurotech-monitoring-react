import React from 'react';

import { TypeShowValue } from '../../const.js';

const FirmsSummaryStats = (props) => {
  const {
    minPrice,
    averagePrice,
    maxPrice,
    minCount,
    averageCount,
    maxCount,
    typeShowValue
  } = props;

  return (
    <div className="firms-summary-stats firms-summary-stats--reduce product-monitor__summary-reduce">
      <ul className="firms-summary-stats__list">
        <li className="standart-block firms-summary-stats__item">
          <h3 className="header header--3 header--center firms-summary-stats__header">
            {
              typeShowValue === TypeShowValue.PRICE ? 'общая минимальная цена' : 'общее минимальное количество'
            }
          </h3>
          <div className="firms-summary-stats__stat">
            <div className="firms-summary-stats__main-stat">
              <div className="firms-summary-stats__main-numbers">
                <div className="firms-summary-stats__main-number">
                  {
                    typeShowValue === TypeShowValue.PRICE && `${minPrice?.toLocaleString()} руб.`
                  }

                  {
                    typeShowValue === TypeShowValue.COUNT && `${minCount?.toLocaleString()} шт.`
                  }
                </div>
              </div>
            </div>
          </div>
        </li>

        <li className="standart-block firms-summary-stats__item">
          <h3 className="header header--3 header--center firms-summary-stats__header">
            {
              typeShowValue === TypeShowValue.PRICE ? 'общая средняя цена' : 'общее среднее количество'
            }
          </h3>
          <div className="firms-summary-stats__stat">
            <div className="firms-summary-stats__main-stat">
              <div className="firms-summary-stats__main-numbers">
                <div className="firms-summary-stats__main-number">
                  {
                    typeShowValue === TypeShowValue.PRICE && `${parseInt(averagePrice, 10)?.toLocaleString()} руб.`
                  }

                  {
                    typeShowValue === TypeShowValue.COUNT && `${parseInt(averageCount, 10)?.toLocaleString()} шт.`
                  }
                </div>
              </div>
            </div>
          </div>
        </li>

        <li className="standart-block firms-summary-stats__item">
          <h3 className="header header--3 header--center firms-summary-stats__header">
            {
              typeShowValue === TypeShowValue.PRICE ? 'общая максимальная цена' : 'общее максимальное количество'
            }
          </h3>
          <div className="firms-summary-stats__stat">
            <div className="firms-summary-stats__main-stat">
              <div className="firms-summary-stats__main-numbers">
                <div className="firms-summary-stats__main-number">
                  {
                    typeShowValue === TypeShowValue.PRICE && `${maxPrice?.toLocaleString()} руб.`
                  }

                  {
                    typeShowValue === TypeShowValue.COUNT && `${maxCount?.toLocaleString()} шт.`
                  }
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
}

export default FirmsSummaryStats;
