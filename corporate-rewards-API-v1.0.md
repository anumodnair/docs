# YouGotaGift.com Corporate Rewards API _v1.0_

![YouGotaGift.com Logo](https://cdn.yougotagift.com/static/img/yougotagift.png)

## Overview

This is a documentation of the YouGotaGift.com Corporate Rewards API.

### API Older Version Link
[Version 0.4](https://github.com/YouGotaGift/docs/blob/master/Corporate-Rewards-API-v0.4.md)

[Version 0.3](https://github.com/YouGotaGift/docs/blob/master/corporate-rewards-API-0.3.md)

[Version 0.2](https://github.com/YouGotaGift/docs/blob/master/corporate-rewards-API-0.2.md)

### Changes
The goal of RestAPI v1 is to support global gifts which requires additional details for redemption. Eg: Code, Redemption URL, PIN etc..

### Summary of changes
* Removed "pdf_link" since "gift_pdf_link" has been introduced in 0.4 to provide an direct gift pdf download link.
* Removed "excel_link" since this functionality is currently not used by any user. Might introduce later when the need arises.
* "gift_voucher" has been introduced to provide all the important details required to redeem a gift in a single field.

### How It Works

The YouGotaGift.com Corporate Rewards API is an HTTP API, you can call it with simple HTTP GET/POST, and the result will be in JSON.

### API Endpoints
* All the following API endpoints are available under `https://yougotagift.com/corporate/api/`.
* All the API points return JSON responses.
* All the API points are callable using HTTP methods, some will only accept `GET` requests, some will only accept `POST` requests, and some will accept both.
* Authentication is done using HTTP Basic Authentication over TLS secured channel in HTTPS.
* The HTTP Response Code will tell you whether your call was successful or not.
* `HTTP 200` Means everything went okay.
* `HTTP 404` Means the object you were accessing does not exist.
* `HTTP 400` Means that you have an error in your request, the JSON content will have `errors` field which will explain what is the issue.
* `HTTP 500` Oops, it's our fault, we'll solve it ASAP.

#### `download`
- **Endpoint** `https://yougotagift.com/corporate/api/incentives-send/download/`
- **Returns** JSON Object with the result of your request
- **Accepts** `POST` only.
- **Request format** Should be an HTTP POST with a JSON array in the body of JSON objects for gifts requested.
- **Requires Authentication**

##### JSON Payload Parameters

| Parameter    | Description   |
| ------------ | ------------- |
| brand | Brand name.  **Required**.  Up-to-date brand names list can be found at https://yougotagift.com/gift-card-mall/all-brands/ to access other countries lists check the end of this file. |
| country | The brand's country.  Possible values: `AE`, `LB`, `SA`, `QA`, `UK`, `US`. _Optional_. Defaults to `AE`. |
| amount | Amount in AED.  **Required**. |
| currency | Order currency.  Possible values: `AED`, `USD`, `QAR`, `SAR`, `EUR`, `GBP`.  _Optional_.  Defaults to `AED`. |
| company | The company you're sending on behalf of.  **Required**. |

##### Response
JSON document with the following format:

    {
        count: X
        total_amount: XXX
        message: "Your order has been requested successfully."
        gifts_json: [
            {
              amount: XXX, 
              currency: "XXX",
              amount_in_currency: XXX, 
              brand: "",
              expiry_date:
              "XXXX-XX-XX",
              extra_fields: "",
              redemption_details: "XXXXX XXXXX XXXXX XXXXX XXXXX",
              gift_pdf_link: 'https://yougotagift.com/gifts/11111/XXXXXXXXXXXXXX/pdf/',
              gift_voucher: {
                  code: XXXXXXXXXXXXX,
                  url: "http:XXXXX.com",
                  pin: XXX
                },
            },
        ]
    }

#### Example Request and Response

    POST /corporate/api/incentives-send/download/ HTTP/1.1
    Host: yougotagift.com
    Connection: keep-alive
    Content-Length: 155
    Authorization: Basic aW5jZW50aXZlczppbmNlbnRpdmVz
    Content-Type: application/json

    [
        {"brand": "Boutique1",
        "amount": 100,
        "company": "IBM"},
    ]


    HTTP/1.0 200 OK
    Content-Type: application/json

    {
        "count": 1,
        "total_amount": 500,
        "message": "Your order has been requested successfully.",
        "gifts_json": [
            {
              "amount": 100,
              "code": "3275493941216",
              "brand": "Boutique1",
              "country": "AE", 
              "expiry_date": "2015-08-03",
              "extra_fields": ""
              "redemption_details": "XXXXX XXXXX XXXXX XXXXX XXXXX",
              "gift_pdf_link": 'https://yougotagift.com/gifts/11111/XXXXXXXXXXXXXX/pdf/',
              "gift_voucher": {
                  "code": 3275493941216
                }
            },
        ]
    }


#### `send`
- **Endpoint** `https://yougotagift.com/corporate/api/incentives-send/send/`.
- **Returns** JSON document with the result of the request.
- **Request method**  `POST`.
- **Request format**  Should be an HTTP POST with a JSON array in the body of JSON objects for gifts requested.
- **Requires Authentication**

##### JSON Payload Parameters

| Parameter    | Description   |
| ------------ | ------------- |
| brand | Brand name **Required** (Up-to-date brand names list can be found at https://yougotagift.com/gift-card-mall/all-brands/ to access other countries lists check the end of this file) |
| country | The brand's country. Possible values: AE, LB, SA, QA, UK, US. _Optional Default AE_ |
| amount | Amount in AED. **Required** |
| currency | Order currency. Possible values: AED, USD, QAR, SAR, EUR, GBP _Optional Default AED_ |
| company | The company you're sending on behalf of. **Required** |
| name | The gift receiver name. **Required** |
| email | The gift receiver email. **Required** |
| phone | The gift receiver mobile phone. Should be of format +9715XXXXXXXX or 009715XXXXXXXX or 05XXXXXXXX **Required if delivering by SMS** |
| delivery_time | The gift delivery time. Should be formatted `YYYY-MM-DD HH:MM:SS` in Dubai Time (GMT+4) **Required if not immediately** |
| occasion  | Possible values: `birthday`, `christmas`, `teacher`, `thank you`, `congratulations`, `just because`, `wedding`, `baby`, `good luck`, `love`, `house warming`, `anniversary`, `valentine`, `mother's day`, `sorry`, `miss you`, `season's greeting`, `get well`, `encouragement`, `back to school`, `eid`, `father's day`, `graduation`, `uae national day`, `other`. _Optional_.  Defaults to `thank you`.|
| card message | Short message to put on the cover of the card.  _Optional_.  If not set, the occasion's default message will be used, i.e. "Happy Birthday" for the "birthday" occasion.|
| message | Message to put inside the card.  _Optional_. |

_Any extra parameters will also be saved in the `extra_fields` field._

##### Response
JSON document with the following format:

    {
        count: X
        total_amount: XXX
        message: "Your order has been requested successfully."
    }

##### Example Request and Response

    POST /corporate/api/incentives-send/send/ HTTP/1.1
    Host: yougotagift.com
    Connection: keep-alive
    Content-Length: 155
    Authorization: Basic aW5jZW50aXZlczppbmNlbnRpdmVz
    Content-Type: application/json

    [
        {
          "brand": "Boutique1",
          "amount": 100,
          "amount_in_currency": 100,
          "currency": "AED",
          "country": "AE",
          "name": "John Smith",
          "email": "john@example.com",
          "company": "IBM"
          }
    ]


    HTTP/1.0 200 OK
    Content-Type: application/json

    {
        "count": 1,
        "total_amount": 500,
        "message": "Your order has been requested successfully."
    }

### List of YouGotaGift.com Brands in different countries
The list of brands available in a given country can be retrieved from the following URLs.  The returned text document will be a newline-separated names of the different brands.

- UAE (AE): https://yougotagift.com/gift-card-mall/all-brands/
- Lebanon (LB): https://yougotagift.com/lebanon/gift-card-mall/all-brands/
- Qatar (QA): https://yougotagift.com/qatar/gift-card-mall/all-brands/
- Saudi (SA): https://yougotagift.com/saudi/gift-card-mall/all-brands/
- USA (US): https://yougotagift.com/usa/gift-card-mall/all-brands/
- United Kingdom (UK): https://yougotagift.com/uk/gift-card-mall/all-brands/
