import React, { useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  fetchProductsGroups,
  updateProduct
} from "../../store/api-actions";
import {
  getCurrentUser,
  getGroups,
  getStatusLoadProduct
} from '../../store/app-data/selectors.js';

import Preloader from "../../components/preloader/preloader.jsx";

const PopupEditProduct = (props) => {
  const dispatch = useDispatch();

  const currentUser = useSelector(getCurrentUser);

  const {
    product,
    setIsOpen,
    setSelectProductForDialog
  } = props;

  useEffect(() => {
    dispatch(fetchProductsGroups({idUser: currentUser.id}))
  }, []);

  const groups = useSelector(getGroups);
  const isLoadProduct = useSelector(getStatusLoadProduct);
  const inputNameRef = useRef();
  const inputGroupRef = useRef();

  return (
    <>
      <div className="background-black" />
      <div className="modal">
        <div
          className="modal__close"
          onClick={() => {
            setIsOpen(false);
            setSelectProductForDialog({});
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path
              d="M11.8516 8.59375L16.7378 3.70752C17.3374 3.10791 17.3374 2.13574 16.7378 1.53564L15.6519 0.449707C15.0522 -0.149902 14.0801 -0.149902 13.48 0.449707L8.59375 5.33594L3.70752 0.449707C3.10791 -0.149902 2.13574 -0.149902 1.53564 0.449707L0.449707 1.53564C-0.149902 2.13525 -0.149902 3.10742 0.449707 3.70752L5.33594 8.59375L0.449707 13.48C-0.149902 14.0796 -0.149902 15.0518 0.449707 15.6519L1.53564 16.7378C2.13525 17.3374 3.10791 17.3374 3.70752 16.7378L8.59375 11.8516L13.48 16.7378C14.0796 17.3374 15.0522 17.3374 15.6519 16.7378L16.7378 15.6519C17.3374 15.0522 17.3374 14.0801 16.7378 13.48L11.8516 8.59375Z"
              fill="#BE1622"/>
          </svg>
        </div>

        <h2 className="header header--2 header--center header--space-bottom">
          {product.isGroup ? 'Редактирование товарной группы' : 'Редактирование товара'}
        </h2>

        <label className="input-label" htmlFor="group-name">Измените наименование</label>
        <input
          ref={inputNameRef}
          className="input"
          name="product-name"
          type="text"
          defaultValue={product.name}
          placeholder="Например: Гидрораспределитель 1P40"
        />

        <label className="input-label" htmlFor="group-name">Выберите группу (или оставьте поле без изменений)</label>
        <select
          ref={inputGroupRef}
          className="input"
          name="group-name"
        >
          <option value='null'>Без группы</option>
          {
            groups.map((group) => {
              return (
                <option
                  value={group.id}
                  selected={ Number(group.id) === Number(product.idParent) }
                >
                  {group.name}
                </option>
              );
            })
          }
        </select>

        <button
          disabled={isLoadProduct}
          className="button button--add-group"
          type="button"
          onClick={async () => {
            const {
              id,
              idAuthor,
              isGroup,
            } = product;

            const productNew = {
              id: id,
              idAuthor,
              idParent: inputGroupRef.current.value === 'null' ? null : Number(inputGroupRef.current.value),
              isGroup,
              name: inputNameRef.current.value
            }

            await dispatch(updateProduct({product: productNew}));
            setSelectProductForDialog({});
            setIsOpen(false);
          }}
        >
          {
            isLoadProduct ? <Preloader /> : 'Изменить'
          }
        </button>
      </div>
    </>
  );
}

export default PopupEditProduct;
