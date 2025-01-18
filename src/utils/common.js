export const getRandomNumber = (min, max) => {
  return Math.ceil((max - min) * Math.random() * 0.5)
}
