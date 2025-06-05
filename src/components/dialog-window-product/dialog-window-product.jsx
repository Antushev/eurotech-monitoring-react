import React, {useEffect, useRef} from 'react';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';

import { deleteProduct, updateProduct, fetchProductsWithSummaryDetail } from '../../store/api-actions.js';
import { getStatusLoadProduct } from '../../store/app-data/selectors.js';

import Preloader from '../../components/preloader/preloader.jsx';
import * as dayjs from "dayjs";

const WIDTH_PRELOADER = 20;
const HEIGHT_PRELOADER = 20;
const COLOR_PRELOADER = '#000000';

const DialogWindowProduct = (props) => {
  const dispatch = useDispatch();

  const {
    product,
    isOpen,
    setIsOpen,
    setIsOpenPopupEditProduct
  } = props;

  const isLoadProduct = useSelector(getStatusLoadProduct);

  const useOutsideClick = (ref, isOpenElement, setIsOpen) => {
    useEffect(() => {
      const handleClickOutside = (evt) => {
        if (
          isOpenElement
          && ref.current
          && !ref.current.contains(evt.target)
          && !document.querySelector('.background-black')
        ) {
          setIsOpen({});
        }
      }

      document.addEventListener('mousedown', handleClickOutside);

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      }
    });
  }

  const wrapperRef = useRef();

  useOutsideClick(wrapperRef, isOpen, setIsOpen);

  return (
    <div
      ref={wrapperRef}
      className={
        isOpen ? 'dialog-window' : 'dialog-window visually-hidden'
      }
    >
      <ul
        className="dialog-list"
        onClick={(evt) => {
          evt.preventDefault();
          evt.cancelBubble = true;
          evt.stopPropagation();
        }}
      >
        <li
          className="dialog-list__item"
          onClick={() => {
            setIsOpenPopupEditProduct(true);
          }}
        >
          <div className="dialog-list__icon-block">
            <svg className="dialog-list__icon" width="14" height="13" viewBox="0 0 14 13">
              <path d="M9.78542 2.01979L11.9778 4.21215C12.0701 4.30451 12.0701 4.45521 11.9778 4.54757L6.66944 9.8559L4.41389 10.1062C4.1125 10.1403 3.85729 9.88507 3.89132 9.58368L4.14167 7.32812L9.45 2.01979C9.54236 1.92743 9.69306 1.92743 9.78542 2.01979ZM13.7229 1.46319L12.5368 0.277083C12.1674 -0.0923611 11.567 -0.0923611 11.1951 0.277083L10.3347 1.1375C10.2424 1.22986 10.2424 1.38056 10.3347 1.47292L12.5271 3.66528C12.6194 3.75764 12.7701 3.75764 12.8625 3.66528L13.7229 2.80486C14.0924 2.43299 14.0924 1.83264 13.7229 1.46319ZM9.33333 8.41215V10.8865H1.55556V3.10868H7.14097C7.21875 3.10868 7.29167 3.07708 7.34757 3.02361L8.31979 2.05139C8.50451 1.86667 8.37326 1.55312 8.11319 1.55312H1.16667C0.52257 1.55312 0 2.07569 0 2.71979V11.2753C0 11.9194 0.52257 12.442 1.16667 12.442H9.72222C10.3663 12.442 10.8889 11.9194 10.8889 11.2753V7.43993C10.8889 7.17986 10.5753 7.05104 10.3906 7.23333L9.4184 8.20555C9.36493 8.26146 9.33333 8.33437 9.33333 8.41215Z" fill="black"/>
            </svg>
          </div>

          <span className="dialog-list__text">
            Редактировать
          </span>
        </li>

        <li
          className="dialog-list__item"
          onClick={async () => {
            await dispatch(deleteProduct(product.id));
          }}
        >
          <div className="dialog-list__icon-block">
            <svg className="dialog-list__icon" width="11" height="12" viewBox="0 0 11 12">
              <path d="M0.75 10.875C0.75 11.1734 0.868526 11.4595 1.0795 11.6705C1.29048 11.8815 1.57663 12 1.875 12H8.625C8.92337 12 9.20951 11.8815 9.42049 11.6705C9.63147 11.4595 9.75 11.1734 9.75 10.875V3H0.75V10.875ZM7.125 4.875C7.125 4.77555 7.16451 4.68016 7.23483 4.60984C7.30516 4.53951 7.40054 4.5 7.5 4.5C7.59945 4.5 7.69484 4.53951 7.76516 4.60984C7.83549 4.68016 7.875 4.77555 7.875 4.875V10.125C7.875 10.2245 7.83549 10.3198 7.76516 10.3902C7.69484 10.4605 7.59945 10.5 7.5 10.5C7.40054 10.5 7.30516 10.4605 7.23483 10.3902C7.16451 10.3198 7.125 10.2245 7.125 10.125V4.875ZM4.875 4.875C4.875 4.77555 4.91451 4.68016 4.98483 4.60984C5.05516 4.53951 5.15054 4.5 5.25 4.5C5.34945 4.5 5.44484 4.53951 5.51516 4.60984C5.58549 4.68016 5.625 4.77555 5.625 4.875V10.125C5.625 10.2245 5.58549 10.3198 5.51516 10.3902C5.44484 10.4605 5.34945 10.5 5.25 10.5C5.15054 10.5 5.05516 10.4605 4.98483 10.3902C4.91451 10.3198 4.875 10.2245 4.875 10.125V4.875ZM2.625 4.875C2.625 4.77555 2.66451 4.68016 2.73483 4.60984C2.80516 4.53951 2.90054 4.5 3 4.5C3.09946 4.5 3.19484 4.53951 3.26516 4.60984C3.33549 4.68016 3.375 4.77555 3.375 4.875V10.125C3.375 10.2245 3.33549 10.3198 3.26516 10.3902C3.19484 10.4605 3.09946 10.5 3 10.5C2.90054 10.5 2.80516 10.4605 2.73483 10.3902C2.66451 10.3198 2.625 10.2245 2.625 10.125V4.875ZM10.125 0.750004H7.3125L7.09219 0.311723C7.04552 0.218023 6.97363 0.139205 6.8846 0.084135C6.79558 0.0290653 6.69296 -7.09679e-05 6.58828 4.10923e-06H3.90937C3.80493 -0.000397388 3.70249 0.0286302 3.61378 0.0837612C3.52507 0.138892 3.45369 0.217897 3.40781 0.311723L3.1875 0.750004H0.375C0.275544 0.750004 0.180161 0.789513 0.109835 0.859839C0.0395088 0.930165 0 1.02555 0 1.125L0 1.875C0 1.97446 0.0395088 2.06984 0.109835 2.14017C0.180161 2.21049 0.275544 2.25 0.375 2.25H10.125C10.2245 2.25 10.3198 2.21049 10.3902 2.14017C10.4605 2.06984 10.5 1.97446 10.5 1.875V1.125C10.5 1.02555 10.4605 0.930165 10.3902 0.859839C10.3198 0.789513 10.2245 0.750004 10.125 0.750004Z" fill="black"/>
            </svg>
          </div>

          <span className="dialog-list__text">
            Удалить
          </span>

          {
            isLoadProduct &&
              <Preloader
                width={WIDTH_PRELOADER}
                height={HEIGHT_PRELOADER}
                color={COLOR_PRELOADER}
              />
          }
        </li>
        {
          !product?.isGroup &&
            <li
              className="dialog-list__item"
              onClick={async () => {
                await dispatch(updateProduct({product: { id: product.id, isFavorite: !product.isFavorite }}));

                if (product.isFavorite) {
                  toast.success(`Товар ${product.name} убран из Избранного`);
                }

                if (!product.isFavorite) {
                  toast.success(`Товар ${product.name} добавлен в Избранное`);
                }
              }}
            >
              <div className="dialog-list__icon-block">
                <svg className="dialog-list__icon" width="12" height="12" viewBox="0 0 11 11">
                  <path d="M4.90991 0.382647L3.56729 3.22683L0.563373 3.68439C0.0246826 3.76602 -0.191205 4.45988 0.199449 4.85729L2.37272 7.06991L1.8587 10.1955C1.76617 10.7605 2.33571 11.1837 2.81272 10.9194L5.5 9.44364L8.18729 10.9194C8.66429 11.1815 9.23383 10.7605 9.1413 10.1955L8.62728 7.06991L10.8006 4.85729C11.1912 4.45988 10.9753 3.76602 10.4366 3.68439L7.43271 3.22683L6.09009 0.382647C5.84953 -0.124322 5.15252 -0.130766 4.90991 0.382647Z" fill="black"/>
                </svg>
              </div>

              <span className="dialog-list__text">
                {
                  !product?.isFavorite ? 'Добавить в избранное' : 'Убрать из избранного'
                }
              </span>

              {
                isLoadProduct &&
                <Preloader
                  width={WIDTH_PRELOADER}
                  height={HEIGHT_PRELOADER}
                  color={COLOR_PRELOADER}
                />
              }
            </li>
        }
      </ul>
    </div>
  );
}

export default DialogWindowProduct;
