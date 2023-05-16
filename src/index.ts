import stringify from 'json-stringify-safe'
import { parse } from 'secure-json-parse'
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

let MASKED_TEXT = ''

const defaultTextMaskOptions = {
  maskSymbol: '*',
  maxCharsToMask: 35,
  visibleCharsFromEnd: 4,
  visibleCharsFromStart: 6,
} as maskTextOptions

export const defaultMaskOptions = {
  bankCardNumberPattern: /([\d]{4}\W){3}[\d]{4}/g,
  emailPattern: /[\w.öäå-]+@[\w.öäå-]+\.[a-z]{2,}/gim,
  jwtPattern: /[\w-]*\.[\w-]*\.[\w-]*/g,
  phoneNumberPattern:
    /[\+]?[\d]{1,3}?[-\s\.]?[(]?[\d]{1,3}[)]?[-\s\.]?([\d-\s\.]){7,12}/g,
  uuidPattern: /[\w]{8}\b-[\w]{4}\b-[\w]{4}\b-[\w]{4}\b-[\w]{12}/g,
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
  const unmaskedPartFromEnd =
    visibleCharsFromEnd > 0 ? text.slice(-visibleCharsFromEnd) : ''
  const partShouldBeMasked =
    visibleCharsFromEnd > 0
      ? text.slice(visibleCharsFromStart, -visibleCharsFromEnd)
      : text.slice(visibleCharsFromStart)
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

    MASKED_TEXT = MASKED_TEXT.replace(
      text,
      maskString(text, options)
    )
    strigifiedObject = strigifiedObject.replace(text, '')
  }

  return strigifiedObject
}

export default (
  text: object | string,
  options = defaultMaskOptions
): object | string => {
  try {
    const {
      bankCardNumberPattern,
      emailPattern,
      jwtPattern,
      phoneNumberPattern,
      uuidPattern,
      maxCharsToMask,
      maskSymbol,
      visibleCharsFromEnd,
      visibleCharsFromStart,
    } = options
    const shouldBeStringified = text instanceof (Object || Array)

    let objectToBeMasked = (
      MASKED_TEXT = shouldBeStringified
        ? stringify(text)
        : text
    )

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

    return shouldBeStringified ? parse(MASKED_TEXT) : MASKED_TEXT
  } catch (error) {
    console.warn('mask-sensitive-data:index:default', error)
    return MASKED_TEXT
  }
}
