/**
 * Updates the values of an object, recursively applying the given updateFunction
 * to each non-object property.
 *
 * @param value - The object to update or a string or number that should be passed
 * to the updateFunction.
 * @param updateFunction - The function to apply to each non-object property of the
 * object.
 * @param clone - Whether or not to clone the object before updating it. Defaults to
 * false.
 * @returns The updated string, number or object, array with any depth
 */
export function updateDeepValue(
  value:
    | { [x: string]: any; hasOwnProperty: (arg0: string) => any }
    | string
    | number,
  updateFunction: (arg0: any) => any,
  clone?: boolean
) {
  if (typeof value === 'string' || typeof value === 'number') {
    return updateFunction(value)
  }

  const updateObj = clone ? JSON.parse(JSON.stringify(value)) : value

  function updateCycle(obj: {
    [x: string]: any
    hasOwnProperty: (arg0: string) => any
  }) {
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        if (typeof obj[prop] === 'object') {
          updateCycle(obj[prop])
        } else {
          obj[prop] = updateFunction(obj[prop])
        }
      }
    }
  }

  updateCycle(updateObj)

  return updateObj
}
