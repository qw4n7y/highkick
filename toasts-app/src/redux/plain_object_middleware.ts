import * as Redux from 'redux'

// Middleware for allowing actions to be class instances
const actionToPlainObjectMiddleware: Redux.Middleware<any, any> = store => next => action => {
  function isObjectLike(val: any): val is {} {
    return val !== undefined && val !== null && typeof val === 'object'
   }
  if (isObjectLike(action)) {
    return next({ ...action } as any)
  }
  return next(action)
}

export default actionToPlainObjectMiddleware