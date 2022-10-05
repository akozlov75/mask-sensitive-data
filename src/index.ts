interface maskTextOptions {
  maskSymbol: string
  maxCharsToMask: number
  visibleCharsFromEnd: number
  visibleCharsFromStart: number
}

interface maskOptions extends maskTextOptions {
  bankCardNumberPattern?: RegExp | undefined
  emailPattern?: RegExp | undefined
  jwtPattern?: RegExp | undefined
  phoneNumberPattern?: RegExp | undefined
  uuidPattern?: RegExp | undefined
}

const defaultTextMaskOptions = {
  maskSymbol: '*',
  maxCharsToMask: 35,
  visibleCharsFromEnd: 4,
  visibleCharsFromStart: 6,
} as maskTextOptions

export const defaultMaskOptions = {
  bankCardNumberPattern: /([\d]{4}\W){3}[\d]{4}/g,
  emailPattern: /[\w+\.+\-]+@+[\w+\.+\-]+[\.\w]{2,}/g,
  jwtPattern: /[\w-]*\.[\w-]*\.[\w-]*/g,
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

  const {
    maskSymbol,
    maxCharsToMask,
    visibleCharsFromEnd,
    visibleCharsFromStart,
  } = options

  const unmaskedPartFromStart = text.slice(0, visibleCharsFromStart)
  const unmaskedPartFromEnd = text.slice(-visibleCharsFromEnd)
  const partShouldBeMasked = text.slice(
    visibleCharsFromStart,
    -visibleCharsFromEnd
  )
  const maskedCharsCount =
    partShouldBeMasked.length > maxCharsToMask
      ? maxCharsToMask
      : partShouldBeMasked.length

  return [
    unmaskedPartFromStart,
    maskSymbol.repeat(maskedCharsCount),
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
    jwtPattern,
    maskSymbol,
    maxCharsToMask,
    phoneNumberPattern,
    uuidPattern,
    visibleCharsFromEnd,
    visibleCharsFromStart,
  } = options
  const shouldBeStringified = text instanceof (Object || Array)

  let objectToBeMasked = shouldBeStringified ? JSON.stringify(text) : text

  for (const pattern of [
    bankCardNumberPattern,
    emailPattern,
    jwtPattern,
    uuidPattern,
    phoneNumberPattern,
  ]) {
    objectToBeMasked = replaceTextInObjectWithPattern(
      objectToBeMasked,
      pattern as RegExp,
      {
        maskSymbol,
        maxCharsToMask,
        visibleCharsFromEnd,
        visibleCharsFromStart,
      }
    )
  }

  return shouldBeStringified ? JSON.parse(objectToBeMasked) : objectToBeMasked
}
