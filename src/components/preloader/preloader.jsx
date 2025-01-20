import React from 'react';

const Preloader = (props) => {
  const {
    width,
    height,
    color,
    type
  } = props;

  return (
    <svg
      className={`${type === 'GROUP' ? 'goods-table__icon' : ''}`}
      width={width}
      height={height}
      viewBox="0 0 38 38"
      stroke={color}
    >
      <g fill="none" fillRule="evenodd">
        <g transform="translate(1 1)" strokeWidth="2">
          <circle strokeOpacity=".5" cx="18" cy="18" r="18"/>
          <path d="M36 18c0-9.94-8.06-18-18-18">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 18 18"
              to="360 18 18"
              dur="1s"
              repeatCount="indefinite"/>
          </path>
        </g>
      </g>
    </svg>
  );
}

Preloader.defaultProps = {
  width: 25,
  height: 25,
  color: '#ffffff'
}

export default Preloader;
