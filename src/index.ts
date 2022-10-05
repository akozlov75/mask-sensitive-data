interface maskTextOptions {
  maskSymbol: string
  visibleCharsFromEnd: number
  visibleCharsFromStart: number
}

interface maskOptions extends maskTextOptions {
  bankCardNumberPattern?: RegExp|undefined
  emailPattern?: RegExp|undefined
  uuidPattern?: RegExp|undefined
  phoneNumberPattern?: RegExp|undefined
}

const defaultTextMaskOptions = {
  visibleCharsFromEnd: 4,
  visibleCharsFromStart: 6,
  maskSymbol: '*',
} as maskTextOptions

export const defaultMaskOptions = {
  bankCardNumberPattern: /([\d]{4}\W){3}[\d]{4}/g,
  emailPattern: /[\w+\.+\-]+@+[\w+\.+\-]+[\.\w]{2,}/g,
  uuidPattern: /[\w]{8}\b-[\w]{4}\b-[\w]{4}\b-[\w]{4}\b-[\w]{12}/g,
  phoneNumberPattern:
    /[\+]?[\d]{1,3}?[-\s\.]?[(]?[\d]{1,3}[)]?[-\s\.]?([\d-\s\.]){7,12}/g,
  ...defaultTextMaskOptions,
} as maskOptions

const maskString = (
  text: string,
  options = defaultTextMaskOptions
): string => {
  if (!text) return text

  const { visibleCharsFromStart, visibleCharsFromEnd, maskSymbol } = options

  const unmaskedPartFromStart = text.slice(0, visibleCharsFromStart)
  const unmaskedPartFromEnd = text.slice(-visibleCharsFromEnd)
  const partShouldBeMasked = text.slice(
    visibleCharsFromStart,
    -visibleCharsFromEnd
  )

  return [
    unmaskedPartFromStart,
    maskSymbol.repeat(partShouldBeMasked.length),
    unmaskedPartFromEnd,
  ].join('')
}

const replaceTextInObjectWithPattern = (
  strigifiedObject: string,
  pattern: RegExp,
  options = defaultTextMaskOptions
): string => {
  for (const item of strigifiedObject.matchAll(pattern)) {
    const text = item[0]
    const maskedText = maskString(text, options)

    strigifiedObject = strigifiedObject.replace(text, maskedText)
  }

  return strigifiedObject
}

export default (
  text: object | string,
  options = defaultMaskOptions
): object | string => {
  const {
    bankCardNumberPattern,
    emailPattern,
    uuidPattern,
    phoneNumberPattern,
    visibleCharsFromEnd,
    visibleCharsFromStart,
    maskSymbol,
  } = options
  const isObject = typeof text === 'object'

  let objectToBeMasked = isObject ? JSON.stringify(text) : text

  if (emailPattern) {
    objectToBeMasked = replaceTextInObjectWithPattern(
      objectToBeMasked,
      emailPattern,
      {
        visibleCharsFromStart,
        visibleCharsFromEnd,
        maskSymbol,
      }
    )
  }

  if (bankCardNumberPattern) {
    objectToBeMasked = replaceTextInObjectWithPattern(
      objectToBeMasked,
      bankCardNumberPattern,
      {
        visibleCharsFromStart,
        visibleCharsFromEnd,
        maskSymbol,
      }
    )
  }

  if (uuidPattern) {
    objectToBeMasked = replaceTextInObjectWithPattern(
      objectToBeMasked,
      uuidPattern,
      {
        visibleCharsFromStart,
        visibleCharsFromEnd,
        maskSymbol,
      }
    )
  }

  if (phoneNumberPattern) {
    objectToBeMasked = replaceTextInObjectWithPattern(
      objectToBeMasked,
      phoneNumberPattern,
      {
        visibleCharsFromStart,
        visibleCharsFromEnd,
        maskSymbol,
      }
    )
  }

  return isObject ? JSON.parse(objectToBeMasked) : objectToBeMasked
}
