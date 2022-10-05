import maskFunction, { defaultMaskOptions  } from '.'

const testObject = {
  email: 'john.doe@testdomain.com',
  creditCard: '1234 5678 9000 9876',
  id: '3f8a43fd-6489-4ec7-bd55-7a1ba172d77b',
  name: 'John',
  surname: 'Doe',
  phone: '+358 40 1234567',
  subuser: {
    email: 'john.smith@testdomain.com',
    creditCard: '0987 6543 2100 1234',
    id: '7c942511-969b-4363-af11-9667bf756733',
    name: 'John',
    surname: 'Smith',
    phone: '+358 (0)40 1234567',
    subuser: {
      email: 'don.johnson@testdomain.com',
      creditCard: '1234-0987-6543-0000',
      id: '12882e75-a726-4615-8631-6ee428e07592',
      name: 'Don',
      surname: 'Johnson',
      phone: '040-1234567',
    },
  },
}

describe('Mask sensitive data', () => {
  describe('Object', () => {
    it('should return masked object', () => {
      expect(maskFunction(testObject)).toEqual({
        creditCard: '1234 5*********9876',
        email: 'john.d*************.com',
        id: '3f8a43**************************d77b',
        name: 'John',
        phone: '+358 4*****4567',
        subuser: {
          creditCard: '0987 6*********1234',
          email: 'john.s***************.com',
          id: '7c9425**************************6733',
          name: 'John',
          phone: '+358 (********4567',
          subuser: {
            creditCard: '1234-0*********0000',
            email: 'don.jo****************.com',
            id: '12882e**************************7592',
            name: 'Don',
            phone: '040-12*4567',
            surname: 'Johnson',
          },
          surname: 'Smith',
        },
        surname: 'Doe',
      })
    })

    it('should return masked object with custom options', () => {
      expect(
        maskFunction(testObject, {
          ...defaultMaskOptions,
          uuidPattern: undefined,
        })
      ).toEqual({
        creditCard: '1234 5*********9876',
        email: 'john.d*************.com',
        id: '3f8a43fd-6489-4ec7-bd55-7a1ba172d77b',
        name: 'John',
        phone: '+358 4*****4567',
        subuser: {
          creditCard: '0987 6*********1234',
          email: 'john.s***************.com',
          id: '7c942511-969b-4363-af11-9667bf756733',
          name: 'John',
          phone: '+358 (********4567',
          subuser: {
            creditCard: '1234-0*********0000',
            email: 'don.jo****************.com',
            id: '12882e75-a726-46*****31-6ee428e07592',
            name: 'Don',
            phone: '040-12*4567',
            surname: 'Johnson',
          },
          surname: 'Smith',
        },
        surname: 'Doe',
      })
    })
  })

  describe('String', () => {
    it('should return masked text', () => {
      expect(maskFunction(testObject.id)).toEqual(
        '3f8a43**************************d77b'
      )

      expect(maskFunction(testObject.email)).toEqual('john.d*************.com')
    })

    it('should return masked text with custom options', () => {
      expect(
        maskFunction(testObject.creditCard, {
          ...defaultMaskOptions,
          visibleCharsFromStart: 0,
        })
      ).toEqual('***************9876')

      expect(
        maskFunction(testObject.phone, {
          ...defaultMaskOptions,
          visibleCharsFromStart: 0,
        })
      ).toEqual('***********4567')
    })
  })

  describe('Arrays', () => {
    it('should return masked array of uuids', () => {
      expect(
        maskFunction([
          '439a02e5-390e-49f3-a0a3-80d8def9ace4',
          '43982692-386c-42dc-8837-93f479503c56'
        ])
      ).toEqual([
        '439a02**************************ace4',
        '439826**************************3c56'
      ])
    })
  })
})
