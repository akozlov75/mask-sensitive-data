import maskFunction, { defaultMaskOptions } from '.'
import shopifyOrderExample from './__mock__/shopify_order.json'

const testObject = {
  email: 'john.doe@example.com',
  creditCard: '1234 5678 9000 9876',
  id: '3f8a43fd-6489-4ec7-bd55-7a1ba172d77b',
  name: 'John',
  surname: 'Doe',
  phone: '+358 40 1234567',
  token:
    'eyJhbGciOiJIUzI1NiJ9.ew0KICAic3ViIjogIjEyMzQ1Njc4OTAiLA0KICAibmFtZSI6ICJBbGV4IEtvemxvdiIsDQogICJpYXQiOiAxNTE2MjM5MDIyDQp9.PNKysYFTCenU5bekHCmwIxCUXoYG41H_xc3uN3ZF_b8',
  subuser: {
    email: 'john.smith@example.com',
    creditCard: '0987 6543 2100 1234',
    id: '7c942511-969b-4363-af11-9667bf756733',
    name: 'John',
    surname: 'Smith',
    phone: '+358 (0)40 1234567',
    token:
      'eyJraWQiOiJlOTRmODk4Mi02YWI1LTQxZjQtODlkYS03MTYxYmFjZDUzM2UiLCJhbGciOiJFUzI1NiJ9.ew0KICAic3ViIjogIjEyMzQ1Njc4OTAiLA0KICAibmFtZSI6ICJBbGV4IEtvemxvdiIsDQogICJpYXQiOiAxNTE2MjM5MDIyDQp9.CtiBkSYbhs5hEvMA7w4_Dbs3S5IHnxJgRo-fI8UhunY9BCUxBcb9vTRB4uRKLbhCL8MRYR90rzdzE7EcllyyDw',
    subuser: {
      email: 'don.johnson@example.com',
      creditCard: '1234-0987-6543-0000',
      id: '12882e75-a726-4615-8631-6ee428e07592',
      name: 'Don',
      surname: 'Johnson',
      phone: '040-1234567',
      token:
        'eyJraWQiOiIxNDQzZWU0NS01ZGY4LTRlZmYtYmU2Yi1jYjRmMWI3MDA5YjMiLCJhbGciOiJFUzUxMiJ9.ew0KICAic3ViIjogIjEyMzQ1Njc4OTAiLA0KICAibmFtZSI6ICJBbGV4IEtvemxvdiIsDQogICJpYXQiOiAxNTE2MjM5MDIyDQp9.AB0kMsJ1wGlLG-Z89O-a1eZH0RJf3VYO7uoW3otcqV-xF6THYK3v14yppzv10sQ-HZWyUek6MW8-UzB-uq5Pm917ANZUXIw0XVY794W-u1JYrl36rKRi_DqSEEQ9X-hz9BhVFQEaGyNGZSDdKiVdix6MEMgN_4Nt5O-GXwGk6SLFdpBI',
    },
  },
}

const multilineTestString = `
https://www.rfc-editor.org/rfc/rfc6531 allows international characters
in email, for example ääöö@åå.com, and we might want to find them also.
In addition, we might not want to match all string containting @-sign,
like foo@bar since this is not an email-address. `

describe('Mask sensitive data', () => {
  describe('Object', () => {
    it('should return masked object', () => {
      expect(maskFunction(testObject)).toEqual({
        creditCard: '1234 5*********9876',
        email: 'john.d**********.com',
        id: '3f8a43**************************d77b',
        name: 'John',
        surname: 'Doe',
        phone: '+358 4*****4567',
        token: 'eyJhbG***********************************F_b8',
        subuser: {
          creditCard: '0987 6*********1234',
          email: 'john.s************.com',
          id: '7c9425**************************6733',
          name: 'John',
          surname: 'Smith',
          phone: '+358 (********4567',
          token: 'eyJraW***********************************yyDw',
          subuser: {
            creditCard: '1234-0*********0000',
            email: 'don.jo*************.com',
            id: '12882e**************************7592',
            name: 'Don',
            surname: 'Johnson',
            phone: '040-12*4567',
            token: 'eyJraW***********************************dpBI',
          },
        },
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
        email: 'john.d**********.com',
        id: '3f8a43fd-6489-4ec7-bd55-7a1ba172d77b',
        name: 'John',
        surname: 'Doe',
        phone: '+358 4*****4567',
        token: 'eyJhbG***********************************F_b8',
        subuser: {
          creditCard: '0987 6*********1234',
          email: 'john.s************.com',
          id: '7c942511-969b-4363-af11-9667bf756733',
          name: 'John',
          surname: 'Smith',
          phone: '+358 (********4567',
          token: 'eyJraW***********************************yyDw',
          subuser: {
            creditCard: '1234-0*********0000',
            email: 'don.jo*************.com',
            id: '12882e75-a726-46*****31-6ee428e07592',
            name: 'Don',
            phone: '040-12*4567',
            surname: 'Johnson',
            token: 'eyJraW***********************************dpBI',
          },
        },
      })
    })
  })

  describe('String', () => {
    it('should return masked text', () => {
      expect(maskFunction(testObject.id)).toEqual(
        '3f8a43**************************d77b'
      )

      expect(maskFunction(testObject.email)).toEqual('john.d**********.com')
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

    it('should mask sensitive information from multiline string', () => {
      expect(
        maskFunction(multilineTestString, {
          ...defaultMaskOptions,
          visibleCharsFromStart: 0,
          visibleCharsFromEnd: 0,
        })
      ).toEqual(`
https://******************/rfc/rfc6531 allows international characters
in email, for example ***********, and we might want to find them also.
In addition, we might not want to match all string containting @-sign,
like foo@bar since this is not an email-address. `)
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

  describe('JSON with numbers', () => {
    it('should return masked data as a string', () => {
      console.warn = jest.fn()
      expect(maskFunction(shopifyOrderExample)).toEqual(
        '{"app_id":498191***9750,"billing_address":{"address1":"2259 Park Ct","address2":"Apartment 5","city":"Drayton Valley","company":null,"country":"Canada","first_name":"Christopher","last_name":"Gorski","phone":"(555)55**5555","province":"Alberta","zip":"T0E 0M0","name":"Christopher Gorski","province_code":"AB","country_code":"CA","latitude":"45.41634","longitude":"-75.6868"},"browser_ip":"216.19*.105.146","buyer_accepts_marketing":false,"cancel_reason":"customer","cancelled_at":null,"cart_token":"68778783ad298f1c80c3bafcddeea","checkout_token":"bd5a8aa1ecd019dd3520ff791ee3a24c","client_details":{"accept_language":"en-US,en;q=0.9","browser_height":1320,"browser_ip":"216.19*.105.146","browser_width":1280,"session_hash":"9ad4d1f4e6a8977b9dd98eed1e477643","user_agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.33202.94 Safari/537.36"},"closed_at":"2008-01-10T11:00:00-05:00","created_at":"2008-01-10T11:00:00-05:00","currency":"USD","current_total_discounts":"10.00","current_total_discounts_set":{"current_total_discounts_set":{"shop_money":{"amount":"10.00","currency_code":"CAD"},"presentment_money":{"amount":"5.00","currency_code":"EUR"}}},"current_total_duties_set":{"current_total_duties_set":{"shop_money":{"amount":"164.86","currency_code":"CAD"},"presentment_money":{"amount":"105.31","currency_code":"EUR"}}},"current_total_price":"10.00","current_total_price_set":{"current_total_price_set":{"shop_money":{"amount":"30.00","currency_code":"CAD"},"presentment_money":{"amount":"20.00","currency_code":"EUR"}}},"current_subtotal_price":"10.00","current_subtotal_price_set":{"current_subtotal_price_set":{"shop_money":{"amount":"30.00","currency_code":"CAD"},"presentment_money":{"amount":"20.00","currency_code":"EUR"}}},"current_total_tax":"10.00","current_total_tax_set":{"current_total_tax_set":{"shop_money":{"amount":"30.00","currency_code":"CAD"},"presentment_money":{"amount":"20.00","currency_code":"EUR"}}},"customer":{"id":2071199551,"email":"bob.no*****************.com","accepts_marketing":false,"created_at":"2012-03-13T16:09:55-04:00","updated_at":"2012-03-13T16:09:55-04:00","first_name":"Bob","last_name":"Norman","state":"disabled","note":null,"verified_email":true,"multipass_identifier":null,"tax_exempt":false,"tax_exemptions":{},"phone":"+13125**1212","tags":"loyal","currency":"USD","addresses":{},"admin_graphql_api_id":"gid://shopify/Customer/2071199551","default_address":{}},"customer_locale":"en-CA","discount_applications":{"discount_applications":[{"type":"manual","title":"custom discount","description":"customer deserved it","value":"2.0","value_type":"fixed_amount","allocation_method":"across","target_selection":"explicit","target_type":"line_item"},{"type":"script","description":"my scripted discount","value":"5.0","value_type":"fixed_amount","allocation_method":"across","target_selection":"explicit","target_type":"shipping_line"},{"type":"discount_code","code":"SUMMERSALE","value":"10.0","value_type":"fixed_amount","allocation_method":"across","target_selection":"all","target_type":"line_item"}]},"discount_codes":[{"code":"SPRING30","amount":"30.00","type":"fixed_amount"}],"email":"bob.no*****************.com","estimated_taxes":false,"financial_status":"authorized","fulfillments":[{"created_at":"2012-03-13T16:09:54-04:00","id":2558588046,"order_id":4507899469,"status":"failure","tracking_company":"USPS","tracking_number":"1Z2345","updated_at":"2012-05-01T14:22:25-04:00"}],"fulfillment_status":"partial","gateway":"shopify_payments","id":4507899469,"landing_site":"http://www.ex*****.com?source=abc","line_items":[{"fulfillable_quantity":1,"fulfillment_service":"amazon","fulfillment_status":"fulfilled","grams":500,"id":6697511112,"price":"199.99","product_id":7513594,"quantity":1,"requires_shipping":true,"sku":"IPOD-342-N","title":"IPod Nano","variant_id":4264112,"variant_title":"Pink","vendor":"Apple","name":"IPod Nano - Pink","gift_card":false,"price_set":{"shop_money":{"amount":"199.99","currency_code":"USD"},"presentment_money":{"amount":"173.30","currency_code":"EUR"}},"properties":[{"name":"custom engraving","value":"Happy Birthday Mom!"}],"taxable":true,"tax_lines":[{"title":"HST","price":"25.81","price_set":{"shop_money":{"amount":"25.81","currency_code":"USD"},"presentment_money":{"amount":"20.15","currency_code":"EUR"}},"channel_liable":true,"rate":0.13}],"total_discount":"5.00","total_discount_set":{"shop_money":{"amount":"5.00","currency_code":"USD"},"presentment_money":{"amount":"4.30","currency_code":"EUR"}},"discount_allocations":[{"amount":"5.00","discount_application_index":2,"amount_set":{"shop_money":{"amount":"5.00","currency_code":"USD"},"presentment_money":{"amount":"3.96","currency_code":"EUR"}}}],"origin_location":{"id":139059***6454,"country_code":"CA","province_code":"ON","name":"Apple","address1":"700 West Georgia Street","address2":"1500","city":"Toronto","zip":"V7Y 1G5"},"duties":[{"id":"2","harmonized_system_code":"520300","country_code_of_origin":"CA","shop_money":{"amount":"164.86","currency_code":"CAD"},"presentment_money":{"amount":"105.31","currency_code":"EUR"},"tax_lines":[{"title":"VAT","price":"16.486","rate":0.1,"price_set":{"shop_money":{"amount":"16.486","currency_code":"CAD"},"presentment_money":{"amount":"10.531","currency_code":"EUR"}},"channel_liable":true}],"admin_graphql_api_id":"gid://shopify/Duty/2"}]}],"location_id":49202758,"name":"#1001","note":"Customer changed their mind.","note_attributes":[{"name":"custom name","value":"custom value"}],"number":1,"order_number":1001,"original_total_duties_set":{"original_total_duties_set":{"shop_money":{"amount":"164.86","currency_code":"CAD"},"presentment_money":{"amount":"105.31","currency_code":"EUR"}}},"payment_details":{"avs_result_code":"Y","credit_card_bin":"453600","cvv_result_code":"M","credit_card_number":"•••• •••• •••• 4242","credit_card_company":"Visa"},"payment_terms":{"amount":70,"currency":"CAD","payment_terms_name":"NET_30","payment_terms_type":"NET","due_in_days":30,"payment_schedules":[{"amount":70,"currency":"CAD","issued_at":"2020-07-29T13:02:43-04:00","due_at":"2020-08-29T13:02:43-04:00","completed_at":"null","expected_payment_method":"shopify_payments"}]},"payment_gateway_names":["authorize_net","Cash on Delivery (COD)"],"phone":"+55773***1234","presentment_currency":"CAD","processed_at":"2008-01-10T11:00:00-05:00","processing_method":"direct","referring_site":"http://www.an*******.com","refunds":[{"id":184234*7608,"order_id":394481**5128,"created_at":"2018-03-06T09:35:37-05:00","note":null,"user_id":null,"processed_at":"2018-03-06T09:35:37-05:00","refund_line_items":[],"transactions":[],"order_adjustments":[]}],"shipping_address":{"address1":"123 Amoebobacterieae St","address2":"","city":"Ottawa","company":null,"country":"Canada","first_name":"Bob","last_name":"Bobsen","latitude":"45.41634","longitude":"-75.6868","phone":"555-62**1199","province":"Ontario","zip":"K2P0V6","name":"Bob Bobsen","country_code":"CA","province_code":"ON"},"shipping_lines":[{"code":"INT.TP","price":"4.00","price_set":{"shop_money":{"amount":"4.00","currency_code":"USD"},"presentment_money":{"amount":"3.17","currency_code":"EUR"}},"discounted_price":"4.00","discounted_price_set":{"shop_money":{"amount":"4.00","currency_code":"USD"},"presentment_money":{"amount":"3.17","currency_code":"EUR"}},"source":"canada_post","title":"Small Packet International Air","tax_lines":[],"carrier_identifier":"third_party_carrier_identifier","requested_fulfillment_service_id":"third_party_fulfillment_service_id"}],"source_name":"instagram","source_identifier":"ORDERID-123","source_url":"{URL_to_order}","subtotal_price":398,"subtotal_price_set":{"shop_money":{"amount":"141.99","currency_code":"CAD"},"presentment_money":{"amount":"90.95","currency_code":"EUR"}},"tags":"imported, vip","tax_lines":[{"price":11.94,"rate":0.06,"title":"State Tax","channel_liable":true}],"taxes_included":false,"test":true,"token":"b1946ac92492d2347c6235b4d2611184","total_discounts":"0.00","total_discounts_set":{"shop_money":{"amount":"0.00","currency_code":"CAD"},"presentment_money":{"amount":"0.00","currency_code":"EUR"}},"total_line_items_price":"398.00","total_line_items_price_set":{"shop_money":{"amount":"141.99","currency_code":"CAD"},"presentment_money":{"amount":"90.95","currency_code":"EUR"}},"total_outstanding":"5.00","total_price":"409.94","total_price_set":{"shop_money":{"amount":"164.86","currency_code":"CAD"},"presentment_money":{"amount":"105.31","currency_code":"EUR"}},"total_shipping_price_set":{"shop_money":{"amount":"30.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_tax":"11.94","total_tax_set":{"shop_money":{"amount":"18.87","currency_code":"CAD"},"presentment_money":{"amount":"11.82","currency_code":"EUR"}},"total_tip_received":"4.87","total_weight":300,"updated_at":"2012-08-24T14:02:15-04:00","user_id":31522279,"order_status_url":{"order_status_url":"https://checko**********.com/112233/checkouts/4207896aad57dfb159/thank_you_token?key=7536211327b9e8a64789651bf221dfe35"}}'
      )
      expect(console.warn).toHaveBeenCalledTimes(1)
    })
  })
})
