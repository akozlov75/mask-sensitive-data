# mask-sensitive-data

Mask sensitive data eg. write debugging data to log files, etc.
Supports the below-mentioned items:

- credit card numbers
- emails
- JWT tokens
- phone numbers
- UUIDs

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
  token: 'eyJhbGciOiJIUzI1NiJ9.ew0KICAic3ViIjogIjEyMzQ1Njc4OTAiLA0KICAibmFtZSI6ICJBbGV4IEtvemxvdiIsDQogICJpYXQiOiAxNTE2MjM5MDIyDQp9.PNKysYFTCenU5bekHCmwIxCUXoYG41H_xc3uN3ZF_b8',
  subuser: {
    email: 'john.smith@example.com',
    creditCard: '0987 6543 2100 1234',
    id: '7c942511-969b-4363-af11-9667bf756733',
    name: 'John',
    surname: 'Smith',
    phone: '+358 (0)40 1234567',
    token: 'eyJraWQiOiJlOTRmODk4Mi02YWI1LTQxZjQtODlkYS03MTYxYmFjZDUzM2UiLCJhbGciOiJFUzI1NiJ9.ew0KICAic3ViIjogIjEyMzQ1Njc4OTAiLA0KICAibmFtZSI6ICJBbGV4IEtvemxvdiIsDQogICJpYXQiOiAxNTE2MjM5MDIyDQp9.CtiBkSYbhs5hEvMA7w4_Dbs3S5IHnxJgRo-fI8UhunY9BCUxBcb9vTRB4uRKLbhCL8MRYR90rzdzE7EcllyyDw',
    subuser: {
      email: 'don.johnson@example.com',
      creditCard: '1234-0987-6543-0000',
      id: '12882e75-a726-4615-8631-6ee428e07592',
      name: 'Don',
      surname: 'Johnson',
      phone: '040-1234567',
      token: 'eyJraWQiOiIxNDQzZWU0NS01ZGY4LTRlZmYtYmU2Yi1jYjRmMWI3MDA5YjMiLCJhbGciOiJFUzUxMiJ9.ew0KICAic3ViIjogIjEyMzQ1Njc4OTAiLA0KICAibmFtZSI6ICJBbGV4IEtvemxvdiIsDQogICJpYXQiOiAxNTE2MjM5MDIyDQp9.AB0kMsJ1wGlLG-Z89O-a1eZH0RJf3VYO7uoW3otcqV-xF6THYK3v14yppzv10sQ-HZWyUek6MW8-UzB-uq5Pm917ANZUXIw0XVY794W-u1JYrl36rKRi_DqSEEQ9X-hz9BhVFQEaGyNGZSDdKiVdix6MEMgN_4Nt5O-GXwGk6SLFdpBI',
    },
  },
}

// Mask object properties with default options
maskSensitiveData(objectToBeMasked)
// -> {
//      creditCard: '1234 5*********9876',
//      email: 'john.d*************.com',
//      id: '3f8a43**************************d77b',
//      name: 'John',
//      surname: 'Doe',
//      phone: '+358 4*****4567',
//      token: 'eyJhbG***********************************F_b8',
//      subuser: {
//        creditCard: '0987 6*********1234',
//        email: 'john.s***************.com',
//        id: '7c9425**************************6733',
//        name: 'John',
//        surname: 'Smith',
//        phone: '+358 (********4567',
//        token: "eyJraW***********************************yyDw",
//        subuser: {
//          creditCard: '1234-0*********0000',
//          email: 'don.jo****************.com',
//          id: '12882e**************************7592',
//          name: 'Don',
//          surname: 'Johnson',
//          phone: '040-12*4567',
//          token: 'eyJraW***********************************dpBI',
//        },
//      },
//    }

// Mask uuid string with default options
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

// Mask array of UUIDs with default options
maskSensitiveData([
  '439a02e5-390e-49f3-a0a3-80d8def9ace4',
  '43982692-386c-42dc-8837-93f479503c56'
])
// -> [
//      '439a02**************************ace4',
//      '439826**************************3c56'
//    ]

// Mask object properties with custom options (skip UUID strings from masking)
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
//      token: 'eyJhbG***********************************F_b8',
//      subuser: {
//        creditCard: '0987 6*********1234',
//        email: 'john.s***************.com',
//        id: '7c942511-969b-4363-af11-9667bf756733',
//        name: 'John',
//        surname: 'Doe',
//        phone: '+358 (********4567',
//        token: "eyJraW***********************************yyDw",
//        subuser: {
//          creditCard: '1234-0*********0000',
//          email: 'don.jo****************.com',
//          id: '12882e75-a726-46*****31-6ee428e07592',
//          name: 'Don',
//          surname: 'Johnson',
//          phone: '040-12*4567',
//          token: 'eyJraW***********************************dpBI',
//        },
//      },
//    }
```

## API

- Usage

  ```ts
  maskSensitiveData(objectToBeMasked, options)
  ```

- `objectToBeMasked`

  Object, Array of strings, or just string to be masked

- `options`

  **bankCardNumberPattern**: RegExp|undefined - RegExp pattern to recognize bank card numbers

  **emailPattern**: RegExp|undefined - RegExp pattern to recognize email addresses

  **jwtPattern**: RegExp|undefined - RegExp pattern to recognize JWT tokens

  **uuidPattern**: RegExp|undefined - RegExp pattern to recognize UUID identificators

  **phoneNumberPattern**: RegExp|undefined - RegExp pattern to recognize phone numbers

  **maskSymbol**: string - Symbol to replace masked chars

  **maxCharsToMask**: string - Maximal length on masking chars

  **visibleCharsFromEnd**: number - Amount of chars visible from the end of the string

  **visibleCharsFromStart**: number - Amount of chars visible from the beginning of the string

- Default `options`

  ```ts
  {
    bankCardNumberPattern: /([\d]{4}\W){3}[\d]{4}/g,
    emailPattern: /[\w+\.+\-]+@+[\w+\.+\-]+[\.\w]{2,}/g,
    jwtPattern: /[\w-]*\.[\w-]*\.[\w-]*/g,
    phoneNumberPattern: /[\+]?[\d]{1,3}?[-\s\.]?[(]?[\d]{1,3}[)]?[-\s\.]?([\d-\s\.]){7,12}/g,
    uuidPattern: /[\w]{8}\b-[\w]{4}\b-[\w]{4}\b-[\w]{4}\b-[\w]{12}/g,
    maskSymbol: '*',
    maxCharsToMask: 35,
    visibleCharsFromEnd: 4,
    visibleCharsFromStart: 6,
  }
  ```
