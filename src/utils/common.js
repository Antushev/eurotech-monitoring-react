export const getRandomNumber = (min, max) => {
  return Math.ceil((max - min) * Math.random() * 0.5)
}

export const truncate = (text, truncateLength = 50) => {
  return text?.length > truncateLength ? text.substring(0, truncateLength) + '...' : text;
}
