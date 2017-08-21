# YouGotaGift.com Corporate Rewards API _v2.0_

![YouGotaGift.com Logo](https://cdn.yougotagift.com/static/img/yougotagift.png)

### Older API Version Links
[Version 1.0](https://github.com/YouGotaGift/docs/blob/master/corporate-rewards-API-v1.0.md)

[Version 0.4](https://github.com/YouGotaGift/docs/blob/master/corporate-rewards-API-v0.4.md)

[Version 0.3](https://github.com/YouGotaGift/docs/blob/master/corporate-rewards-API-0.3.md)

[Version 0.2](https://github.com/YouGotaGift/docs/blob/master/corporate-rewards-API-0.2.md)

### Introduction

YouGotaGift.com’s API allows you to deliver gift by email/SMS or receive gift card details as part of your system’s workflow. This document includes a definitive list of endpoints, along with common use cases and code examples. API calls can be tested once you receive login credentials of your test account.

#### Changes

v2.0 is a major release which includes whole new set of API endpoints and all response parameters are different from the previous version.

#### Summary of changes

- `account`: returns the account information, which includes the current account balance
- `brands` : brand catalogue with structured information
- `order`  : single API to order gift cards for all delivery types
- `orders` : returns the order history along with the gift details
- `topup`  : allows to topup/replenish the account balance, currently available only on test account

#### Credentials

The test calls that can be made from this document are against our Test environment. You'll need your `API_SECRET` and `API_KEY` to access the test account. Your test account details will be shared by YouGotaGift.com

You will need to contact YouGotaGift.com for your production environment, post a successful integration in the test environment, along with your server IP from which the requests are made to the API.

#### How It Works

The YouGotaGift.com API is a HTTP API, which can be called with simple HTTP GET/POST and the result will be in JSON.

#### API Endpoints

* All the API points return JSON responses
* All the API points are callable using HTTP methods `GET` or `POST`
* Authentication is done by signing HTTP requests with secure signatures

### `Authentication`
Authentication is done by signing HTTP requests with secure signatures

* Must obtain `API_SECRET` and `API_KEY` from YouGotaGift.com
* Each request requires `API_KEY` and  `Signature` parameter to be submitted.
* The `Signature` parameter is built from `API_SECRET` + `timestamp` which is SHA-256 encrypted and later Hex encoded.

#### Example usage cURL

        ~$ API_SIG=Base64(Hmac(API_SECRET, "Date: Mon, 17 Aug 2017 06:11:05 GMT", SHA256))
        ~$ curl -v -H 'Date: "Mon, 17 Aug 2017 06:11:05 GMT"' -H 'Authorization: Signature keyId="API_KEY",algorithm="hmac-sha256",headers="date",signature="API_SIG"'

#### Sample Authentication implemented in Python

        import datetime
        import requests 
        from httpsig.requests_auth import HTTPSignatureAuth

        API_KEY = '2451807E-3CCD-4E19-8'
        API_SECRET = '4bbd9678-cf43-4721-89a6-fc30aed636a0ebdc'

        api_url = 'http://xxxxxxxxxx%s'

        signature_headers = ['accept', 'date']
        headers = {
            'Accept': 'application/json',
            'X-Api-Key': API_KEY,
            'date': str(datetime.datetime.now()),
        }
        auth = HTTPSignatureAuth(key_id=API_KEY, secret=API_SECRET, headers=signature_headers)

        # GET: brand catalogue API
        r = requests.get(api_url % '/brands/', auth=auth, headers=headers)
        print r.json()
        
        # POST: Order API
        payload = {
            'reference_id': '987667',
            'brand_code': 'YGAGC',
            'country': 'AE',
            'amount': 200,
            'currency': 'AED',
            'delivery_type': 1
        }
        r = requests.post(api_url % '/order/', json=payload, auth=auth, headers=headers)
        print r.json()

### `HTTP Responses`

| Status Code    | Description   |
| ------------ | ------------- |
| HTTP 200 - OK | Everything worked as expected |
| HTTP 400 - Bad Request | An error in the request, the response will have all the required details of the error. |
| HTTP 403 - Forbidden | Request credentials are invalid. |
| HTTP 404 - Not Found | Resource does not exist. |
| HTTP 409 - Conflict | Resource already exists. |
| HTTP 500 | An error occured from our end. |

### `Errors`

In addition to HTTP status codes, error responses may include JSON response with state, message and params (optional) properties. The params property encapsulates user input errors.

### `Account`

Returns the account details including current account balance. All the options set during the account setup will be returned. Any changes needed should be notified to the YouGotaGift team.

- **Endpoint** `/account/`
- **Returns** JSON Object with the result of your request
- **Accepts** `GET` only.
- **Requires Authentication**

#### Response

        {
            "account": "HoneyTech Ventures",
            "balance_amount": {
                "amount": 13883155.27,
                "currency": "AED"
            },
            "custom_sms_message": "Thank you for participating in the survey . Your code <code> for the eGift Card worth <amount>. For more info please visit https://yougotagift.com/gift-use/"
            "pdf_type": "A4 PDF"
            "order_validity_month": "6"
        }
        
#### Response Parameters
| Parameter    | Description   |
| ------------ | ------------- |
| account | Account name |
| currency | Preferred currency of the account holder |
| balance | Current account balance |
| custom_sms_message |  **Optional** Custom SMS message set for the account. If not set, the default SMS message will be sent. Tags available which can placed in the message. \<code\> : Will be replaced by the gift code, pin or url, \<bname\> replaced by brand name, \<rname\> replaced by Receiver Name, <pdf_link> replaced by gift pdf link, \<amount\> replaced by the gift amount.  |
| pdf_type | Available options: [A4 PDF](http://gotagift.co/1sMEj), [A6 Duplex Print PDF](http://gotagift.co/nza35), [A5 Foldable PDF](http://gotagift.co/6safO), [Single Page PDF](http://gotagift.co/X6YmU) |
| order_validity_month | If set, ordered gift cards will have this set period as the validity. If not set, the ordered gift will have the default validity of the brand( validity which ever is lesser, will be mentioned on the gift ) |

### `Topup Account`
Available only in sandbox environment.
- **Endpoint** `/topup/`
- **Returns** JSON Object with the result of your request
- **Accepts** `POST` only.
- **Requires Authentication**

#### Request Parameters
| Parameter    | Description   |
| ------------ | ------------- |
| currency | **Required** Currency |
| amount | **Required** Amount (Numeric value). Amount should be given in the passed currency . |
| reference_id |  **Optional** Payment Reference ID |

#### Request

    POST /topup/ 
    
        {
            "currency": "AED",
            "amount": 1000,
            "reference_id": "12335"
        }

#### Response     
    
        {
            "state": 1,
            "balance_amount": {
                "currency": "AED",
                "amount": 3000
            },
            "reference_id": "12335",
            "topup_id": 469
        }
        
| Parameter    | Description   |
| ------------ | ------------- |
| state | `0` : Failed, `1` : succeeded |
| balance_amount | Current account balance amount |
| reference_id | Reference ID send by the client |
| topup_id | Unique reference ID generated by YouGotGaGift |

### `order`

`Order` Gift Card API delivers a single gift card. Response will differ based on the requested `delivery_type` 

- **Endpoint** `/order/`
- **Returns** JSON Object with the result of your request
- **Accepts** `POST` only.
- **Request format** Should be an HTTP POST with a JSON array in the body of JSON objects for gifts requested.
- **Requires Authentication**

#### Request Parameters

| Parameter    | Description   |
| ------------ | ------------- |
| reference_id | **Required** Reference Id (Numeric value max length 16 digits). Unique transaction reference number passed to the API. |
| delivery_type | **Required** Type of delivery (Enumerated 0 or 1).  Defaults to `0` Deliver the gift card as email or sms( either or both ) , `1` Returns the full gift details in the response. |
| brand_code | **Required** Brand Code (Up-to-date brand list can be found at [/brands/](https://github.com/YouGotaGift/docs/blob/master/Corporate-Rewards-API.md#brands-catalogue), explained in detail below) |
| currency | **Required** Available order currency values: `AED`, `USD`, `QAR`, `SAR`, `EUR`, `GBP`. see [/currencies/](https://github.com/YouGotaGift/docs/blob/master/Corporate-Rewards-API.md#currencies) for full list
| amount | **Required** Amount in the currency passed.
| country | **Required** The country to where the gift is being purchased. Available values: `AE`, `LB`, `SA`, `QA`, `UK`, `US`.  see countries `/countries/` for full list |

#### Extra Request Parameters for delivery type `0`
Deliver the gift card as email or sms( either or both )

| Parameter    | Description   |
| ------------ | ------------- |
| receiver_name | **Required**  The gift receiver name. |
| receiver_email | The gift receiver email. **Atleast one delivery method either receiver_email or receiver_phone is Required** |
| receiver_phone | The gift receiver mobile phone. **Atleast one delivery method either receiver_email or receiver_phone is Required** |

#### Request Json for delivery type `0` 
Deliver the gift card as email or sms( either or both )

        {
            "reference_id": "124DSF",
            "delivery_type": 0,
            "brand_code": "184726",
            "currency": "AED",
            "amount": 200,
            "country": "AE",
            "receiver_name" : "Jhon",
            "receiver_email" : "jhon@example.com",
            "receiver_phone" : "0551111111",
        }

#### Response for delivery type `0` 

        {
            "reference_id": "124DSF",
            "order_id": 5738,
            "state": 1
        }

#### Response Parameters for delivery type `0`
Deliver the gift card as email or sms( either or both )

| Parameter    | Description   |
| ------------ | ------------- |
| reference_id | Returns Reference Id sent in the request |
| order_id | Order ID generated by the API for the current order |
| state | `1` : Order Successful, `0` : Order Failed |

#### Request Json for delivery type `1` 
Returns the full gift details in the response

        {
           "reference_id": "1232ADS",
            "delivery_type": 1,
            "brand_code": "184726",
            "currency": "AED",
            "amount": 1000,
            "country": "AE"
        }

#### Response for delivery type `1`

        {
            "reference_id": "1232ADS",
            "order_id": 5737,
            "state": 1,
            "delivery_type": 1,
            "ordered_amount": {
                "currency": "AED",
                "amount": 1000
            },
            "extra_fields": "",
            "brand_accepted_amount": {
                "currency": "AED",
                "amount": 1000
            },
            "barcode": "https://xxxxxxxxxxxxx/xxxxxxx/",
            "pdf_link": "http://xxxxxx/xxxxx",
            "gift_voucher": {
                "code": "xxxxxxxxxx"
            },
            "expiry_date": "2018-08-21",
            "redemption_instructions": "This eGift Card is redeemable for any service offered in any 1847 branch across the UAE.\r\nThis eGift Card is only valid for a one time purchase to the full value unless otherwise specified.",
            "brand_details": {
                "logo": "https://xxxxxxxxxxxxx/images/cards/fb/1847-FB-196x196.jpg",
                "product_image": "https://xxxxxxxxxxxx/images/cards/print/1847-print.png",
                "code": "184726",
                "name": "1847"
            },
            "country": "AE"
        }
    
#### Response Parameters for delivery type `1`
Returns the full gift details in the response

| Parameter    | Description   |
| ------------ | ------------- |
| reference_id | Returns Reference Id sent in the request |
| order_id | Order ID generated by the API for the current order |
| state |  `0` : Order Failed , `1` : Order Successful |
| delivery_type | Type of delivery (Enumerated 0 or 1).  `0` Deliver the gift card as email or sms( either or both ) , `1` Returns the full gift details in the response. |
| ordered_amount | Gift ordered Amount |
| extra_fields | Returns the extra parameter passed to the request which is sent by the client |
| brand_accepted_amount | Amount in currency accepted by the brand, the brand accepts the gift card only in this particular currency. |
| barcode | Returns Barcode link for the applicable gift otherwise returns null |
| pdf_link | Gift PDF link |
| gift_voucher | Contains the gift code, Pin or url. This varies from brand to brand |
| expiry_date | Expiry date of the gift |
| redemption_instructions | Redemption instructions of the gift |
| brand_details | Ordered gift brand's details |
| country | Ordered gift country |

#### Sample Error Response #1
Order Failed

        HTTP 400 Bad Request
        Content-Type: application/json
        Vary: Accept
        Allow: POST
        
        {
            "state": 0,    
            "errors": {
                "message": "Order failed",
                "params": {
                                'receiver_email': [u'This field may not be blank.'], 
                                'receiver_name': [u'This field may not be blank.'], 
                                'amount': [u'A valid number is required.'], 
                                'brand_code': [u'This field may not be blank.'], 
                                'reference_id': [u'A valid integer is required.']
                            },
                "code": 2204
            }
        }
                
| Parameter    | Description   |
| ------------ | ------------- |
| state | `0` : Failed, `1` : succeeded |
| message | Error Message |
| params | Input field errors |
| code | Error Code ( `2204`: Invalid/missing paremeter in the request Json ) |
        
#### Sample Error Response #2
**If the  order already exists with the passed `reference_id`, we suggest to check the status of this `reference_id` in `/orders/<reference_id>/` and makes sure you don't process the same request again until you verify the result of the earlier request for the same `reference_id`**

        HTTP 409 Conflict
        Content-Type: application/json
        Vary: Accept
        Allow: POST

         {
            "state": 0,
            "errors": {
                "message": "Reference id 1233 already exists",
                "code": 2205
          }


| Parameter    | Description   |
| ------------ | ------------- |
| state | `0` : Failed, `1` : succeeded |
| message | Error Message |
| code | Error Code ( `2205`: Reference ID already exists ) |
       
### `List All Orders`

- **Endpoint** `/orders/`
- **Returns** JSON Object with the result of your request
- **Accepts** `GET` only.
- **Requires Authentication**

#### Response

        {
            "total_count": 740,
            "total_page": 38,
            "current_page": 1,
            "current_page_count": 20,
            "next": "https://xxxxxxxxxxxxx/orders/?page=2",
            "previous": null,
            "orders": [
                {
                    "reference_id": "65377",
                    "order_id": 5718,
                    "state": 1,
                    "receiver_name": "Peter",
                    "recevier_email": "peter@xxxxxxx.com"
                    "receiver_phone": "+9715xxxxxxx",
                    "delivery_type": 0,
                    "brand_code": "ITUNEUS273",
                    "ordered_amount": {
                        "currency": "USD",
                        "amount": 5
                    },
                    "extra_fields": ""
                },
                {
                    "reference_id": "12331",
                    "order_id": 5737,
                    "state": 1,
                    "delivery_type": 1,
                    "ordered_amount": {
                        "currency": "AED",
                        "amount": 1000
                    },
                    "extra_fields": "",
                    "brand_accepted_amount": {
                        "currency": "AED",
                        "amount": 1000
                    },
                    "barcode": "https://xxxxxxxxxxxxx/4110xxx885xx18/",
                    "pdf_link": "http://xxxxxxxxx/ZD0FurB",
                    "gift_voucher": {
                        "code": "xxxxxxxxxxx"
                    },
                    "expiry_date": "2018-08-21",
                    "redemption_instructions": "This eGift Card is redeemable for any service offered in any 1847 branch across the UAE.\r\nThis eGift Card is only valid for a one time purchase to the full value unless otherwise specified.",
                    "brand_details": {
                        "logo": "https://xxxxxxxx/images/cards/fb/1847-FB-196x196.jpg",
                        "product_image": "https://xxxxxxxxxxxx/media/images/cards/print/1847-print.png",
                        "code": "184726",
                        "name": "1847"
                    },
                    "country": "AE"
                }
        }
        
               
#### `Trace/retrieve your order`
Trace/retrieve your order using `/orders/<reference_id>/` by passing the `reference_id`, It returns the order details and its status, if order was succesfully processed then returns the gift details based on the `delivery_type` of the order.

- **Endpoint** `/orders/<reference_id>/`
- **Returns** JSON Object with the result of your request
- **Accepts** `GET` only.
- **Requires Authentication**

#### Response for succesfully processed gift of `delivery_type` 0

       GET /orders/1234D/
        
       {
            "reference_id": "1234D",
            "order_id": 5738,
            "state": 1,
            "delivery_type": 0,
            "ordered_amount": {
                "currency": "AED",
                "amount": 1000
            },
            "extra_fields": "",
            "brand_code": "184726",
            "receiver_name": "xxxxx",
            "receiver_email": "xxxx@xxxxx.com",
            "receiver_phone": "+9715xxxxxx"
        }
       
#### Response for succesfully processed gift of `delivery_type` 1

       GET /orders/12331/
        
       {
            "reference_id": "12331",
            "order_id": 5737,
            "state": 1,
            "delivery_type": 1,
            "ordered_amount": {
                "currency": "AED",
                "amount": 1000
            },
            "extra_fields": "",
            "brand_accepted_amount": {
                "currency": "AED",
                "amount": 1000
            },
            "barcode": "https://xxxxxxxxxxxxx/4110xxx885xx18/",
            "pdf_link": "http://xxxxxxxxx/ZD0FurB",
            "gift_voucher": {
                "code": "xxxxxxxxxxx"
            },
            "expiry_date": "2018-08-21",
            "redemption_instructions": "This eGift Card is redeemable for any service offered in any 1847 branch across the UAE.\r\nThis eGift Card is only valid for a one time purchase to the full value unless otherwise specified.",
            "brand_details": {
                "logo": "https://xxxxxxxx/images/cards/fb/1847-FB-196x196.jpg",
                "product_image": "https://xxxxxxxxxxxx/media/images/cards/print/1847-print.png",
                "code": "184726",
                "name": "1847"
            },
            "country": "AE"
        }

### `Brands Catalogue`
Returns the brand details of all of the countries

- **Endpoint** `/brands/`
- **Returns** JSON Object with the result of your request
- **Accepts** `GET` only.
- **Requires Authentication**

#### Response Parameters
| Parameter    | Description   |
| ------------ | ------------- |
| total_count | Total items count |
| total_page | Total number of pages |
| current_page | Current page number |
| current_page_count | Current page items count |
| next | Next page API endpoint |
| previous | Previous page API endpoint |
| brands | List which contains the brands and its details |
| id | Unique ID of the brand |
| is_active | Denotes the status of the brand. if false, denotes brand is currently unavailable |
| brand_code | Unique Code of the brand |
| name | Brand Name |
| logo | Brand logo image |
| product_image | Product image of the brand |
| country | The country details of the brand whose gift cards are issued |
| validity_in_months | Validity specified in months, will be set for an issued gift card of this brand based on its order date |
| variable_amount | Denotes this brand allows custom denominations in a specified range provided in the `denominations` key |
| denominations | if the brand supports custom denominations then the returned value will have the minimum and maximum range of a given currency, else it returns the fixed denomination of the brand in the available currency |
| tagline | Tagline of the brand |
| description | Description of the brand |
| brand_accepted_currency | Currency recognised by the brand, the store accepts the gift card only in this currency. Hence the gift card should be presented at the store in this currency |
| image_gallery | Store images of the brand |
| redemption_type | Denotes the end redemption process of the brand, Available options `redeem_online` : Gift card can only be redeemed online eg: Amazon, Itunes etc.., `redeem_at_store` : Gift card can only be redeemed at the physical store. , `self_redemption`: Gift card has to redeemed by the receiver by following the instructions mentioned in the gift. eg: Mobile Topup Cards, `direct_redemption`: Gift Card gets redeemed automatically. No manual action required from receiver’s end. eg: Direct mobile topup |
| redemption_instructions | The redemption instruction of the gift card |
| detail_url | Unique API endpoint of the brand which will return the current brand details |
| locations | API endpoint which returns the list of all current brand locations |

#### Response

        {
            "total_count": 192,
            "total_page": 10,
            "current_page": 1,
            "current_page_count": 20,
            "next": "https://xxxxxxx/v2/brands/?page=2",
            "previous": null,
            "brands": 
                [
                        {
                            "id": 26,
                            "is_active": true,
                            "brand_code": "184726",
                            "name": "1847",
                            "logo": "https://xxxxxxx/1847-FB-196x196.jpg",
                            "product_image": "https://xxxxxxx/1847-372x238.jpg",
                            "country": {
                                "name": "UAE",
                                "code": "AE"
                            },
                            "validity_in_months": 12,
                            "variable_amount": true,
                            "denominations": {
                                "LBP": {
                                    "min": 75000,
                                    "max": 3000000
                                },
                                "USD": {
                                    "min": 15,
                                    "max": 2700
                                },
                                "QAR": {
                                    "min": 50,
                                    "max": 10000
                                },
                                "BHD": {
                                    "min": 5,
                                    "max": 1120
                                },
                                "AED": {
                                    "min": 50,
                                    "max": 100000
                                },
                                "GBP": {
                                    "min": 10,
                                    "max": 1700
                                },
                                "SAR": {
                                    "min": 50,
                                    "max": 10000
                                },
                                "EUR": {
                                    "min": 10,
                                    "max": 2200
                                }
                            },
                            "tagline": "Executive grooming for men",
                            "description": "Where are all the luxury facilities and treatments for men? They are all at the Grooming Company’s 1847 in Dubai, exclusively for men to get away and relax! Men will go through an experience which starts with unwinding in the signature Chill Out Lounge with custom made Italian leather chairs, followed by selecting a channel or DVD of their choice while enjoying several treatments, massages, and even a facial!<!--more-->\r\n\r\nMen love good grooming just as much as women, so why not get them an 1847 eGift Card?! Give the man of your choice an experience they will never forget. First, they will enter the signature “Chill Out” Lounge, where they can select from different sports and news channels on the 42 inch plasma screen.  They can also choose from a range of gourmet sandwiches and drinks.\r\n\r\nNext, they can enjoy a selection of different treatments this modern day barber shop has to offer. Your loved one can have a manicure pedicure as well as a range of massages such as the Well Being Massage, Ancient Thai Massage, Reflexology, or 1847’s signature “Four Hands” massage.\r\n\r\nLast but not least, men can use their eGift Card to purchase products from “The Mint” boutique where they can choose from a range of skin care items, shaving kits, and hair treatments. When it comes to male pampering, choose the 1847 gift card.",
                            "brand_accepted_currency": "AED",
                            "image_gallery": [
                                {
                                    "image": "https://xxxxxxx/2pmq2WHMZ0oaJIlTwaIHpQ.jpg"
                                },
                                {
                                    "image": "https://xxxxxxx/10g7Kv4tV9Jo1OzUO_FhuF.jpg"
                                },
                                {
                                    "image": "https://xxxxxxx/1hj4Rmt7J9cpu_poxVeFEi.jpg"
                                },
                                {
                                    "image": "https://xxxxxxx/1jFwM5hrp6hatV7uva7q-p.jpg"
                                },
                                {
                                    "image": "https://xxxxxxx/3cP1ssTYB9to73qV1t1jGT.jpg"
                                },
                                {
                                    "image": "https://xxxxxxx/1l3FvnCoZdmGyzxyE2OOG-.jpg"
                                }
                            ],
                            "redemption_type": "Redeem at Store",
                            "redemption_instructions": "This eGift Card is redeemable for any service offered in any 1847 branch across the UAE.\r\nThis eGift Card is only valid for a one time purchase to the full value unless otherwise specified.",
                            "detail_url": "https://xxxxxxx/184726/",
                            "locations": "https://xxxxxxx/locations/"
                        },
                        {
                            "id": 117,
                            "is_active": true,
                            "brand_code": "ABC117",
                            "name": "ABC",
                            "logo": "https://xxxxxxx/ABC-FB-300x300.png",
                            "product_image": "https://xxxxxxx/ABC-372x238.jpg",
                            "country": {
                                "name": "Lebanon",
                                "code": "LB"
                            },
                            "validity_in_months": 12,
                            "variable_amount": false,
                            "denominations": {
                                "LBP": [
                                    75000,
                                    100000,
                                    150000,
                                    225000,
                                    300000,
                                    750000,
                                    1500000
                                ]
                            },
                            "tagline": "My gift your choice",
                            "description": "Want to spoil your loved ones with the ultimate gift of choice? Welcome to ABC, home of all that is vibrant, stylish, new and exciting! ABC is the most prominent mall in Lebanon that offers a unique shopping, dining, leisure and entertainment experience like no other. ABC provides a multitude of top store options to choose from in fashion, beauty, electronics, home décor, food shopping and more! \r\n\r\nAs Lebanon’s premier shopping and lifestyle destination, ABC is still first and as committed as ever to upholding the tradition of excellence that has made it what it is today. With six branches, including two flagship stores that combine world-class shopping, dining and entertainment, this dynamic retailer is perpetually reinventing the ultimate leisure experience. From Zara to H&M, M2 Multimedia Megastore to The Body Shop and ABC Grand Cinemas, your loved ones are bound to find the perfect gift!\r\n\r\nThis Gift Card is ideal for those who are hard to shop for and perfect for when you just want to surprise a loved one to purchase what they really want, as it takes the guess work out of gift shopping! Who wouldn't be happy to go on a shopping spree?\r\n\r\nYou can even customize your Gift Card to make it extra special with a greeting, message and photo! So whether you are looking to gift a loved one on their birthday, for a house warming, graduation, or just looking to say “thank-you,” they will surely appreciate an ABC Gift Card!",
                            "brand_accepted_currency": "LBP",
                            "image_gallery": [
                                {
                                    "image": "https://xxxxxxx/26txWWbCpeephNKuE1jsib.jpg"
                                },
                                {
                                    "image": "https://xxxxxxx/3fzDLrxIxadWoBwExCq6EH.jpg"
                                }
                            ],
                            "redemption_type": "Redeem at Store",
                            "redemption_instruction": "This eGift Card is redeemable for any merchandise offered in ABC outlets across Lebanon.\r\nThis eGift Card is only valid for a one time purchase to the full value unless otherwise specified\r\n",
                            "detail_url": "https://xxxxxxx/brands/ABC117/",
                            "locations": "https://xxxxxxx/brands/ABC117/locations/"
                        }
                ]
        }

#### Common Brands Catalogue Filtering

List all brands in UAE country
`/brands/?country=AE`

Filter `1847` brand details by brand code
`/brands/?brand_code=184726`

Filter `1847` brand details by brand name
`/brands/?name=1847`

List all active brands
`/brands/?is_active=true`

List the brands by page
`/brands/?page=2`

### `Brand Locations`
Returns the brand location details of a brand

- **Endpoint** `/brands/<brand_code>/locations/`
- **Returns** JSON Object with the result of your request
- **Accepts** `GET` only.
- **Requires Authentication**

#### Response
Brand location details are available under `store_locations`

        {
            "brand_name": "ACE",
            "store_locations": [
                {
                    "city": "Dubai",
                    "locations": [
                        {
                            "phone": "04 232 5232",
                            "name": "Dubai Festival City"
                        },
                        {
                            "phone": "04 341 1906",
                            "name": "Sheikh Zayed Road"
                        }
                    ]
                },
                {
                    "city": "Abu Dhabi",
                    "locations": [
                        {
                            "phone": "02 673 1665",
                            "name": "Mina Road"
                        },
                        {
                            "phone": "02 565 1945",
                            "name": "Yas Island"
                        },
                        {
                            "phone": "02 551 2744",
                            "name": "Dalma Mall"
                        }
                    ]
                },
                {
                    "city": "Al Ain",
                    "locations": [
                        {
                            "phone": "03 784 0561",
                            "name": "Bawadi Mall"
                        }
                    ]
                }
            ]
        }

#### Response
A few brands will have `retailers` list where the brand gift card can be redeemed

        {
            "brand_name": "Apparel Gift Card",
            "retailers": [
                "Anne Klein",
                "Aldo",
                "Athlete's Co.",
                "Birkenstock",
                "Call It Spring",
                "CHARLES & KEITH",
                "Dune",
                "Easy Spirit",
                "MBT",
                "Moreschi",
                "Naturalizer",
                "New Balance",
                "Nine West",
                "Pedro",
                "Shoe Gallery",
                "Shoe Studio",
                "Skechers"                
            ]
        }

### `Countries`
- **Endpoint** `/countries/`
- **Returns** JSON Object with the result of your request
- **Accepts** `GET` only.
- **Requires Authentication**

#### Response

        {
            "total_count": 9,
            "total_page": 1,
            "current_page": 1,
            "current_page_count": 9,
            "next": null,
            "previous": null,
            "countries": [
                {
                    "name": "UAE",
                    "code": "AE",
                    "currency": {
                        "name": "UAE Dirham",
                        "code": "AED"
                    },
                    "timezone": "Asia/Dubai",
                    "mobile_number_formats": [
                        "+971 2xxxxxxx",
                        "+971 3xxxxxxx",
                        "+971 4xxxxxxx",
                        "+971 50xxxxxxx",
                        "+971 55xxxxxxx",
                        "+971 6xxxxxxx",
                        "+971 7xxxxxxx",
                        "+971 9xxxxxxx"
                    ],
                    "mobile_number_regex": "^(?:(?:(?:\\+|00)971)|0)(5\\d{8,8})$",
                    "detail_url": "https://xxxxxxxxxx/v2/countries/1/"
                },
                {
                    "name": "Lebanon",
                    "code": "LB",
                    "currency": {
                        "name": "US Dollar",
                        "code": "USD"
                    },
                    "timezone": "Asia/Beirut",
                    "mobile_number_formats": [
                        "+961 79 15xxxx",
                        "+961 79 16xxxx",
                        "+961 79 17xxxx",
                        "+961 79 18xxxx",
                        "+961 79 19xxxx"
                    ],
                    "mobile_number_regex": "^(?:(?:(?:(?:\\+|00)961)|0)(3\\d{6,}))|(?:(?:(?:\\+|00)961)?((?:70\\d{6,6})|(?:71\\d{6,6})|(?:76\\d{6,6})|(?:78\\d{6,6})|(?:79\\d{6,6})))$",
                    "detail_url": "https://xxxxxxxxxx/countries/2/"
                }
        }
        
#### Response Parameters
| Parameter    | Description   |
| ------------ | ------------- |
| total_count | Total items count |
| total_page | Total number of pages |
| current_page | Current page number |
| current_page_count | Current page items count |
| next | Next page API endpoint |
| previous | Previous page API endpoint |
| countries | Details of the countries in the current page |
| name | Country Name |
| code | Country Code |
| currency | Country currency details |
| timezone | Timezone |
| mobile_number_formats | Examples of all available mobile number formats |
| mobile_number_regex | Returns the regex to validate the phone number |
| detail_url | Unique details url of the current country |


### `Currencies`
- **Endpoint** `/currencies/`
- **Returns** JSON Object with the result of your request
- **Accepts** `GET` only.
- **Requires Authentication**

#### Response
    
    {
        "count": 10,
        "next": null,
        "previous": null,
        "currencies": [
            {
                "name": "UAE Dirham",
                "code": "AED"
            },
            {
                "name": "Saudi Riyal",
                "code": "SAR"
            },
            {
                "name": "Qatari Riyal",
                "code": "QAR"
            },
            {
                "name": "US Dollar",
                "code": "USD"
            },
            {
                "name": "Pound Sterling",
                "code": "GBP"
            },
            {
                "name": "Euro",
                "code": "EUR"
            },
            {
                "name": "Lebanese Pound",
                "code": "LBP"
            },
            {
                "name": "Bahrain Dinar",
                "code": "BHD"
            },
            {
                "name": "Egyption Pound",
                "code": "EGP"
            },
            {
                "name": "Omani Riyal",
                "code": "OMR"
            }
        ]
    }
    
### `Currencies Rates`
- **Endpoint** `/currencies/rates/`
- **Returns** JSON Object with the result of your request
- **Accepts** `GET` only.
- **Requires Authentication**

#### Response

        {
            "count": 9,
            "next": null,
            "previous": null,
            "currencies": [
                {
                    "currency_from": "AED",
                    "currency_to": "EUR",
                    "conversion_rate": "0.225635"
                },
                {
                    "currency_from": "AED",
                    "currency_to": "GBP",
                    "conversion_rate": "0.206027"
                },
                {
                    "currency_from": "AED",
                    "currency_to": "LBP",
                    "conversion_rate": "407.608500"
                },
                {
                    "currency_from": "AED",
                    "currency_to": "QAR",
                    "conversion_rate": "0.990099"
                },
                {
                    "currency_from": "AED",
                    "currency_to": "SAR",
                    "conversion_rate": "1.020408"
                },
                {
                    "currency_from": "AED",
                    "currency_to": "USD",
                    "conversion_rate": "0.271739"
                },
                {
                    "currency_from": "AED",
                    "currency_to": "BHD",
                    "conversion_rate": "0.102041"
                },
                {
                    "currency_from": "AED",
                    "currency_to": "EGP",
                    "conversion_rate": "4.889999"
                },
                {
                    "currency_from": "AED",
                    "currency_to": "OMR",
                    "conversion_rate": "0.104167"
                }
            ]
        }
       
