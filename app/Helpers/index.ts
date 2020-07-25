export { default as Http } from './Http'
export { default as HttpError } from './HttpError'

export const cleanObject = <T>(object: T) => Object.entries(object)
  .reduce((acc, [key, value]) => {
    if (typeof value !== 'undefined') {
      (acc as any)[key] = value
    }
    return acc
  }, {})