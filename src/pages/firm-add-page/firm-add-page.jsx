import React from 'react';

const FirmAddPage = () => {
  return (
    <section className="page-content page__content">
      <header className="page-content__header standart-block">
        <h1 className="header header--1">Создание фирмы</h1>
      </header>

      <section className="page-content__inner">
        <form>
          <div className="standart-block standart-block--space-bottom-20">
            <h2 className="header header--2 header--space-bottom">Базовые данные</h2>

            <div className="form-block">
              <label className="label label--margin-right" htmlFor="firm-name">
                <span className="label__text">Название фирмы</span>
                <input
                  id="firm-name"
                  className="input input--no-margin-bottom"
                  name="firm-name"
                  type="text"
                  placeholder="Например: ООО ЕВРОТЕК"
                  title="Название фирмы"
                  alt="Название фирмы"
                />
              </label>

              <label className="label label--margin-right" htmlFor="inn">
                <span className="label__text">ИНН</span>
                <input
                  id="inn"
                  className="input input--no-margin-bottom"
                  type="text"
                  title="ИНН добавляемой фирмы"
                  alt="ИНН добавляемой фирмы"
                />
              </label>

              <label className="label label--margin-right" htmlFor="kpp">
                <span className="label__text">КПП</span>
                <input
                  id="kpp"
                  className="input input--no-margin-bottom"
                  name="kpp"
                  type="text"
                  title="КПП добавляемой фирмы"
                  alt="КПП добавляемой фирмы"
                />
              </label>

              <label className="label" htmlFor="color">
                <span className="label__text">Цвет</span>
                <input
                  id="color"
                  className="input input--color input--no-margin-bottom"
                  name="color"
                  type="color"
                  title="Цвет для фирмы"
                  alt="Цвет для фирмы"
                />
              </label>
            </div>
          </div>

          <div className="standart-block standart-block--space-bottom-20">
            <h2 className="header header--2 header--space-bottom">Настройка интеграции с сайтом</h2>
          </div>
        </form>
      </section>
    </section>
  );
}

export default FirmAddPage;
