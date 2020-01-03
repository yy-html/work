export const throttle = (method, interval, context) => {
  clearTimeout(method.tId)
  method.tId = setTimeout(function () {
    method.call(context)
  }, interval)
}

export const numberFormat =(value, precision = 2) => {
  if(!value) return 0
  return (Math.round(value * Math.pow(10, precision)) / (Math.pow(10, precision))).toFixed(precision)
}

export default {
  throttle,
  numberFormat
}