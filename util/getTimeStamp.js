export default function getTimeStamp(date) {
  return`${date.getFullYear()}-${make2digit(date.getMonth() + 1)}-${make2digit(date.getDate())}T${make2digit(date.getHours())}:${make2digit(date.getMinutes())}`
}

export function make2digit(a) {
  if(a < 10) return `0${a}`
  else return a
}