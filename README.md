# mask-sensitive-data

Mask sensitive data, eq. credit card numbers, phone numbers, emails, etc.

## Install

```shell
npm install mask-sesitive-data
```

## Usage

```ts
import maskSensitiveData from 'mask-sensitive-data'

const objectToBeMasked = {
  email: 'john.doe@example.com',
  creditCard: '1234 5678 9000 9876',
  id: '3f8a43fd-6489-4ec7-bd55-7a1ba172d77b',
  name: 'John',
  surname: 'Doe',
  phone: '+358 40 1234567',
  subuser: {
    email: 'john.smith@example.com',
    creditCard: '0987 6543 2100 1234',
    id: '7c942511-969b-4363-af11-9667bf756733',
    name: 'John',
    surname: 'Smith',
    phone: '+358 (0)40 1234567',
    subuser: {
      email: 'don.johnson@example.com',
      creditCard: '1234-0987-6543-0000',
      id: '12882e75-a726-4615-8631-6ee428e07592',
      name: 'Don',
      surname: 'Johnson',
      phone: '040-1234567',
    },
  },
}

// Mask object with sensitive data
maskSensitiveData(objectToBeMasked)
// -> {
//      creditCard: '1234 5*********9876',
//      email: 'john.d*************.com',
//      id: '3f8a43**************************d77b',
//      name: 'John',
//      surname: 'Doe',
//      phone: '+358 4*****4567',
//      subuser: {
//        creditCard: '0987 6*********1234',
//        email: 'john.s***************.com',
//        id: '7c9425**************************6733',
//        name: 'John',
//        surname: 'Smith',
//        phone: '+358 (********4567',
//        subuser: {
//          creditCard: '1234-0*********0000',
//          email: 'don.jo****************.com',
//          id: '12882e**************************7592',
//          name: 'Don',
//          surname: 'Johnson',
//          phone: '040-12*4567',
//        },
//      },
//    }

// Mask uuid string
maskSensitiveData(objectToBeMasked.id)
// -> 3f8a43**************************d77b

// Mask credit card number string with custom options
maskSensitiveData(
  objectToBeMasked.creditCard,
  {
    ...defaultMaskOptions,
    visibleCharsFromStart: 0,
  }
)
// -> ***************9876

// Mask array of uuids
maskSensitiveData([
  '439a02e5-390e-49f3-a0a3-80d8def9ace4',
  '43982692-386c-42dc-8837-93f479503c56'
])
// -> [
//      '439a02**************************ace4',
//      '439826**************************3c56'
//    ]

// Mask object data and skip uuid from masking
maskSensitiveData(
  objectToBeMasked,
  {
    ...defaultMaskOptions,
    uuidPattern: undefined,
  }
)
// -> {
//      creditCard: '1234 5*********9876',
//      email: 'john.d*************.com',
//      id: '3f8a43fd-6489-4ec7-bd55-7a1ba172d77b',
//      name: 'John',
//      surname: 'Smith',
//      phone: '+358 4*****4567',
//      subuser: {
//        creditCard: '0987 6*********1234',
//        email: 'john.s***************.com',
//        id: '7c942511-969b-4363-af11-9667bf756733',
//        name: 'John',
//        surname: 'Doe',
//        phone: '+358 (********4567',
//        subuser: {
//          creditCard: '1234-0*********0000',
//          email: 'don.jo****************.com',
//          id: '12882e75-a726-46*****31-6ee428e07592',
//          name: 'Don',
//          surname: 'Johnson',
//          phone: '040-12*4567',
//        },
//      },
//    }
```

## API

* Usage

  `maskSensitiveData(objectToBeMasked, options)`

* `objectToBeMasked`

  Object, Array of strings or just string to be masked

* `options`

  **bankCardNumberPattern**: RegExp|undefined

  **emailPattern**: RegExp|undefined

  **uuidPattern**: RegExp|undefined

  **phoneNumberPattern**: RegExp|undefined

  **visibleCharsFromEnd**: number

  **visibleCharsFromStart**: number

  **maskSymbol**: string

* Default `options`

  ```ts
  {
    bankCardNumberPattern: /([\d]{4}\W){3}[\d]{4}/g,
    emailPattern: /[\w+\.+\-]+@+[\w+\.+\-]+[\.\w]{2,}/g,
    uuidPattern: /[\w]{8}\b-[\w]{4}\b-[\w]{4}\b-[\w]{4}\b-[\w]{12}/g,
    phoneNumberPattern:
    /[\+]?[\d]{1,3}?[-\s\.]?[(]?[\d]{1,3}[)]?[-\s\.]?([\d-\s\.]){7,12}/g,
    visibleCharsFromEnd: 4,
    visibleCharsFromStart: 6,
    maskSymbol: '*',
  }
  ```
