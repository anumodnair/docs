# YouGotaGift.com Corporate Rewards API _v1.0_

![YouGotaGift.com Logo](https://cdnstatic.yougotagift.com/static/img/yougotagift.png)

## Overview

This is a documentation of the YouGotaGift.com Corporate Rewards API 1.0

### API Older Version Links
[Version 0.4](https://github.com/YouGotaGift/docs/blob/master/corporate-rewards-API-v0.4.md)

[Version 0.3](https://github.com/YouGotaGift/docs/blob/master/corporate-rewards-API-0.3.md)

[Version 0.2](https://github.com/YouGotaGift/docs/blob/master/corporate-rewards-API-0.2.md)

### Changes
Added support for international brands which requires additional details for redemption. Eg: Code, Redemption URL, PIN etc..

### Summary of changes
* Removed "code" , instead introduced "gift_voucher" which provides all the important gift card details eg: code, redemption url, Pin etc..  
* Removed "pdf_link" since "gift_pdf_link" has been introduced in 0.4 to provide a direct gift pdf download link.
* Removed "excel_link" since this functionality is currently not used by any user. Might introduce later when the need arises.
* Removed "total_amount" since the gift amount already holds the value
* Removed "count" since it always returns 1 and more than one quantity is not allowed
* "gifts_json" key returned by download endpoint has been renamed to "gift_json"

### How It Works

The YouGotaGift.com Corporate Rewards API is an HTTP API, you can call it with simple HTTP GET/POST, and the result will be in JSON.

### Authentication

All calls to the YouGotaGift.com Corporate Rewards API require corporate authentication.

### API Endpoints
* All the following API endpoints are available under `https://sandbox.yougotagift.com/corporate/api/`.
* All the API points return JSON responses.
* All the API points are callable using HTTP methods, some will only accept `GET` requests, some will only accept `POST` requests, and some will accept both.
* Authentication is done using HTTP Basic Authentication over TLS secured channel in HTTPS.
* The HTTP Response Code will tell you whether your call was successful or not.
* `HTTP 200` Means everything went okay.
* `HTTP 201` Means Resource created.
* `HTTP 401` Means Unauthorized, The request requires user authentication.
* `HTTP 404` Means the object you were accessing does not exist.
* `HTTP 403` Means Forbidden, the requested is hidden for administrators only.
* `HTTP 405` Means Request Method Not Allowed.
* `HTTP 400` Bad Request – Inavllid or malformed request, Means that you have an error in your request, the JSON content will have `errors` field which will explain what is the issue.
* `HTTP 50x` Internal Server Error, something went wrong from server side, we'll resolve it ASAP.

#### `download`
- **Endpoint** `https://sandbox.yougotagift.com/corporate/api/incentives-send/download/`
- **Returns** JSON Object with the result of your request
- **Accepts** `POST` only.
- **Request format** Should be an HTTP POST with a JSON array in the body of JSON objects for gifts requested.
- **Requires Authentication**

##### JSON Payload Parameters

| Parameter    | Description   |
| ------------ | ------------- |
| brand | Brand name.  **Required**.  Up-to-date brand names list can be found at https://sandbox.yougotagift.com/corporate/api/v1/brands/ to access other countries lists check the end of this file. |
| country | The brand's country.  Possible values: `AE`, `LB`, `SA`, `QA`, `BH`, `UK`, `US`. _Optional_. Defaults to `AE`. |
| amount | Amount in the given currency.  **Required**. |
| currency | Order currency.  Possible values: `AED`, `USD`, `QAR`, `SAR`, `EUR`, `GBP`, `BHD`.  _Optional_.  Defaults to `AED`. |

##### Response
JSON document with the following format:

    {
      'gift_json': {
          'amount': 5,
          'amount_in_currency': 5,
          'barcode_image': 'https://sandbox.yougotagift.com/gifts/barcode/generate/hPc7bN/',
          'brand': 'Walmart',
	      'brand_accepted_amount': {u'amount': 1.36, u'currency': u'USD'},
          'brand_print_image': 'https://sandbox.yougotagift.com/media/images/cards/print/Walmart-print-495x318.png',
          'brand_square_image': 'https://sandbox.yougotagift.com/media/images/cards/fb/Walmart-FB-300x300.png',
          'brand_store_image': 'https://sandbox.yougotagift.com/media/images/cards/store/Walmart-262x168.jpg',
          'country': 'US',
          'currency': 'USD',
          'expiry_date': '2017-07-31',
          'extra_fields': '',
          'gift_pdf_link': 'https://sandbox.yougotagift.com/usa/gifts/95370/1BZnu0hn-qPtTg9HcVVX2keDTm71-KlOa/pdf/',
          'gift_voucher': {
                'code': XXXX,
                'url': 'http://gotagift.co/XXXX',
                'pin': XXX 
            },
          'id': 95370,
          'redemption_details': 'To redeem your Walmart eGift Card, please click on the Redemption URL above and enter the above Challenge Key into the website.'
        },
      'message': 'Your order has been requested successfully.',
      'purchase_request_id': 13544
    }

#### Example Request and Response

    POST /corporate/api/incentives-send/download/ HTTP/1.1
    Host: sandbox.yougotagift.com
    Connection: keep-alive
    Content-Length: 155
    Authorization: Basic Y29ycG9yYXRlLXNhbmRib3g6c2FuZGJveA==
    Accept: application/json
    Accept: version=1.0

    {
       "brand" : "Virgin Megastore",                    
        "amount" : '50',                   
    }

    HTTP/1.0 200 OK
    Content-Type: application/json

    {
      'gift_json': {
          'amount': 50,
          'amount_in_currency': 50,
          'barcode_image': 'https://sandbox.yougotagift.com/gifts/barcode/generate/XXXXXXXXXX/',
          'brand': 'Virgin Megastore',
	      'brand_accepted_amount': {u'amount': 50, u'currency': u'AED'},
          'brand_print_image': 'https://sandbox.yougotagift.com/media/images/cards/print/virgin-print_2_2.png',
          'brand_square_image': 'https://sandbox.yougotagift.com/media/images/cards/fb/virgin-196x196_2_4.jpg',
          'brand_store_image': 'https://sandbox.yougotagift.com/media/images/cards/store/virgin-262x168_2_2.jpg',
          'country': 'AE',
          'currency': 'AED',
          'expiry_date': '2017-07-31',
          'extra_fields': '',
          'gift_pdf_link': 'https://sandbox.yougotagift.com/gifts/XXXXX/acymcSBBn3QrP4fCAz5V1ncT067JRiic/pdf/',
          'gift_voucher': {
                'code': 'XXXXXXXXXX'
            },
          'id': 95372,
          'redemption_details': 'This eGift Card is redeemable for any merchandise offered in any Virgin Megastore across the UAE.\r\nThis eGift Card is only valid for a one time purchase to the full value unless otherwise specified.'
        },
      'message': 'Your order has been requested successfully.',
      'purchase_request_id': 13546
    }


#### `send`
- **Endpoint** `https://sandbox.yougotagift.com/corporate/api/incentives-send/send/`.
- **Returns** JSON document with the result of the request.
- **Request method**  `POST`.
- **Request format**  Should be an HTTP POST with a JSON array in the body of JSON objects for gifts requested.
- **Requires Authentication**

##### JSON Payload Parameters

| Parameter    | Description   |
| ------------ | ------------- |
| brand | Brand name **Required** (Up-to-date brand names list can be found at https://sandbox.yougotagift.com/corporate/api/v1/brands/ to access other countries lists check the end of this file) |
| country | The brand's country. Possible values: AE, LB, SA, QA, BH, UK, US. _Optional Default AE_ |
| amount | Amount in the given currency. **Required** |
| currency | Order currency. Possible values: AED, USD, QAR, SAR, EUR, GBP, BHD _Optional Default AED_ |
| company | The company you're sending on behalf of. _Optional |
| name | The gift receiver name. **Required** |
| email | The gift receiver email. **Required** |
| phone | The gift receiver mobile phone. Should be of format +9715XXXXXXXX or 009715XXXXXXXX or 05XXXXXXXX **Required if delivering by SMS** |
| occasion  | Possible values: `birthday`, `christmas`, `teacher`, `thank you`, `congratulations`, `just because`, `wedding`, `baby`, `good luck`, `love`, `house warming`, `anniversary`, `valentine`, `mother's day`, `sorry`, `miss you`, `season's greeting`, `get well`, `encouragement`, `back to school`, `eid`, `father's day`, `graduation`, `uae national day`, `other`. _Optional_.  Defaults to `thank you`.|
| card message | Short message to put on the cover of the card.  _Optional_.  If not set, the occasion's default message will be used, i.e. "Happy Birthday" for the "birthday" occasion.|
| message | Message to put inside the card.  _Optional_. |

_Any extra parameters will also be saved in the `extra_fields` field._

##### Response
JSON document with the following format:

    {
        message: "Your order has been requested successfully."
        purchase_request_id: 13547
    }

##### Example Request and Response

    POST /corporate/api/incentives-send/send/ HTTP/1.1
    Host: sandbox.yougotagift.com
    Connection: keep-alive
    Content-Length: 155
    Authorization: Basic XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    Accept: application/json
    Accept: version=1.0

    {
      "brand": "Boutique1",
      "amount": 50,
      "currency": "AED",
      "country": "AE",
      "name": "John Smith",
      "email": "john@example.com",
      "company": "Apoclapsy"
    }
  


    HTTP/1.0 200 OK
    Content-Type: application/json

    {
        "message": "Your order has been requested successfully.",
	"purchase_request_id": 13547
    }


#### `Brands catalogue REST API `
- **Endpoint** `https://sandbox.yougotagift.com/corporate/api/v1/`.
- **Returns** JSON list of brands catalogue API endpoints.
- **Request method**  `GET`.
- **Request format**  Should be an HTTP GET.
- **Requires Authentication**


##### Example Request and Response

    GET /corporate/api/v1/  HTTP/1.1
	Accept: application/json
	Authorization: Basic "Your Corporate Authentication"

    HTTP/1.0 200 OK
    Content-Type: application/json

    {
	    "brands": "https://sandbox.yougotagift.com/corporate/api/v1/brands/",
	    "countries": "https://sandbox.yougotagift.com/corporate/api/v1/countries/",
	    "currencies": "https://sandbox.yougotagift.com/corporate/api/v1/currencies/",
	    "currency-conversion-rates": "https://sandbox.yougotagift.com/corporate/api/v1/currency-conversion-rates/"
	}



#### `countries`
- **Endpoint** `https://sandbox.yougotagift.com/corporate/api/v1/countries/`.
- **Returns** JSON document with the result of the request.
- **Request method**  `GET`.
- **Request format**  Should be an HTTP GET.
- **Requires Authentication**


##### Example Request and Response

    GET /corporate/api/v1/countries/ HTTP/1.1
	Accept: application/json
	Authorization: Basic "Your Corporate Authentication"


    HTTP 200 OK
    Content-Type: application/json

    {
	    "count": 1,
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
	            "mobile_number_format": "+9715xxxxxxxx",
	            "detail_url": "https://sandbox.yougotagift.com/corporate/api/v1/countries/1/"
	        },
	    ]
	}


#### `brands`
- **Endpoint** `https://sandbox.yougotagift.com/corporate/api/v1/brands/`.
- **Returns** JSON document with the result of the request.
- **Request method**  `GET`.
- **Request format**  Should be an HTTP GET.
- **Requires Authentication**



##### Example Request and Response

    GET /corporate/api/v1/brands/ HTTP/1.1
	Accept: application/json
	Authorization: Basic "Your Corporate Authentication"

	It will list all active brand with paginated results (default 20 brands per page),

	For country specific brands pass country parameter in url with country code

	Example: /corporate/api/v1/brands/?country=AE


    HTTP 200 OK
    Content-Type: application/json

    {
	    "count": 162,
	    "next": "https://sandbox.yougotagift.com/corporate/api/v1/brands/?page=2",
	    "previous": null,
	    "brands": [
	        {
	            "id": 26,
	            "brand_code": "1847",
	            "name": "1847",
	            "logo": "https://sandbox.yougotagift.com/media/images/cards/fb/1847-FB-196x196.jpg",
	            "product_image": "https://sandbox.yougotagift.com/media/images/cards/mail/1847-372x238.jpg",
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
	                    "image": "https://sandbox.yougotagift.com/media/images/cards/gallery/2pmq2WHMZ0oaJIlTwaIHpQ.jpg"
	                },
	                {
	                    "image": "https://sandbox.yougotagift.com/media/images/cards/gallery/10g7Kv4tV9Jo1OzUO_FhuF.jpg"
	                },
	                {
	                    "image": "https://sandbox.yougotagift.com/media/images/cards/gallery/1hj4Rmt7J9cpu_poxVeFEi.jpg"
	                },
	                {
	                    "image": "https://sandbox.yougotagift.com/media/images/cards/gallery/1jFwM5hrp6hatV7uva7q-p.jpg"
	                },
	                {
	                    "image": "https://sandbox.yougotagift.com/media/images/cards/gallery/3cP1ssTYB9to73qV1t1jGT.jpg"
	                },
	                {
	                    "image": "https://sandbox.yougotagift.com/media/images/cards/gallery/1l3FvnCoZdmGyzxyE2OOG-.jpg"
	                }
	            ],
	            "redemption_type": "Redeem at Store",
	            "redemption_instruction": "This eGift Card is redeemable for any service offered in any 1847 branch across the UAE.\r\nThis eGift Card is only valid for a one time purchase to the full value unless otherwise specified.",
	            "detail_url": "https://sandbox.yougotagift.com/corporate/api/v1/brands/26/",
		    "locations": "https://sandbox.yougotagift.com/corporate/api/v1/brands/26/locations/"
	        },
	        {
            "id": 240,
            "brand_code": "ITUNEAE",
            "name": "iTunes UAE Gift Card",
            "logo": "https://sandbox.yougotagift.com/media/images/cards/fb/iTunes-FB-300x300_1_1_HOpeDzG.png",
            "product_image": "https://sandbox.yougotagift.com/media/images/cards/mail/iTunes-1016x650_1_jndOEh5.png",
            "country": {
                "name": "UAE",
                "code": "AE"
            },
            "validity_in_months": 12,
            "variable_amount": false,
            "denominations": {
                "AED": [
                    50,
                    100,
                    250,
                    500
                ]
            },
            "tagline": "Music, Movies & Games",
            "description": "Are you looking for a special gift for a lover of music? Well, you can officially stop looking because the ITunes Gift Card is available for all the music lovers! When you give them the ITunes and Apple Music eGift card, you are allowing them to choose from a long list of albums, songs and applications from the ITunes Store. \r\n\r\nWith this gift card, your loved ones will be able to put the songs in their head into their libraries and just come back to listen to them whenever and wherever they want. They can play their favorite songs at home, at work, in the car and at the gym. The ITunes UAE gift cards keeps your loved one up to date with all the latest music and albums, making sure they never go out of music style. \r\n\r\nMusic is not the only option with ITunes gift cards; owners of these cards can download their favorite movies and television shows. Whether they want to watch a documentary, a romantic comedy or even a classic, ITunes has got all their movie needs covered. The best part is that, after they have purchased the movie, it will be there for a very long time and can be watched over and over again, whenever they please. \r\n\r\nThat’s not all! ITunes UAE gifts even let the receiver download the best applications available on the platform. They can download the UAE Cinema app, for example, and keep themselves updated on all the new movie releases. Other fun applications include Afterlight for photo editing, English Study Box to improve their language skills and Heads Up for a fun time with friends. These are only some of the options available to holders of the ITunes gift card!\r\n\r\nSo, if you are looking for a unique and special gift for a friend, a relative or colleague who loves music, movies and applications, then you have found it right here. From top music to top movies, it is all available on this platform. ITunes will make their lives happier and filled with music and laughter. \r\n\r\nIf you would like to see more options on <a href=\"https://yougotagift.com/gift-card-mall/music-movies-games/\" class=\"plink\">music, movies & games</a> or <a href=\"https://yougotagift.com/gift-card-mall/electronics/\" class=\"plink\">electronics</a> check out our list in the categories.",
             "brand_accepted_currency": "AED",
            "image_gallery": [
                {
                    "image": "https://sandbox.yougotagift.com/media/images/cards/gallery/F1JLMeKtaOEiUhx5H4OQ2.jpg"
                },
                {
                    "image": "https://sandbox.yougotagift.com/media/images/cards/gallery/1PNkXMAaxcoa7mBDKc4ylM.jpg"
                },
                {
                    "image": "https://sandbox.yougotagift.com/media/images/cards/gallery/1GQ_Yzu0Z99VjL-MvOT-eX.jpg"
                },
                {
                    "image": "https://sandbox.yougotagift.com/media/images/cards/gallery/3w0ntq7AR5V83jz3o7NIbj.jpg"
                }
            ],
            "redemption_type": "Redeem Online",
            "redemption_instruction": "This eGift Card is redeemable for iTunes UAE Store only.\r\nRedeem your iTunes Code for music, movies, TV shows, games, apps, books, and more on the iTunes UAE Store, the App Store, the iBooks Store, or the Mac App Store.\r\nOpen iTunes Store & Scroll to bottom and click or tap Redeem.\r\nEnter the digit code shown above.\r\nDownload iTunes® for Mac or Windows, free of charge, at www.apple.com/ae/itunes/",
            "detail_url": "https://sandbox.yougotagift.com/corporate/api/v1/brands/240/",
            "locations": null
        },
	        
	    ]
	}

	Atrribute "variable_amount" is used to differentiate the denominations, if it returns True then 
	denominations field will contains variable amounts in different currencies with min and max amount
	otherwise denominations will be fixed amount.
	
	Attribute "locations" will contain the url of brand locations, Note: for some brands this attribute will be empty.
	
	
##### Brand locations Sample Request and Response

    GET /corporate/api/v1/brands/26/locations/ HTTP/1.1
	Accept: application/json
	Authorization: Basic "Your Corporate Authentication"


    HTTP 200 OK
    Content-Type: application/json

    {
	    "brand": "1847",
	    "store_locations": [
	        {
	            "city": "Dubai",
	            "locations": [
	                {
	                    "phone": "04 330 1847",
	                    "name": "Emirates Towers Boulevard"
	                },
	                {
	                    "phone": "04 399 8989",
	                    "name": "Grosvenor House Hotel"
	                },
	                {
	                    "phone": "04 422 1847",
	                    "name": "JBR The Walk"
	                },
	                {
	                    "phone": "04 236 2020",
	                    "name": "Mirdif City Centre"
	                },
	                {
	                    "phone": "04 344 3363",
	                    "name": "City Walk"
	                }
	            ]
	        }
	    ]
	}
	
	{
    "brand": "Apparel Gift Card",
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
        "Skechers",
        "TOMS",
        "All About Watches",
        "Aldo Accessories",
        "Charming Charlie",
        "Ice Watch",
        "Ninewest Accessories",
        "Booksplus",
        "The Children's Place",
        "Tommy Hilfiger",
        "Z generation"
    ]
}

#### `currencies`
- **Endpoint** `https://sandbox.yougotagift.com/corporate/api/v1/currencies/`.
- **Returns** JSON document with the result of the request.
- **Request method**  `GET`.
- **Request format**  Should be an HTTP GET.
- **Requires Authentication**


##### Example Request and Response

    GET /corporate/api/v1/currencies/ HTTP/1.1
	Accept: application/json
	Authorization: Basic "Your Corporate Authentication"


    HTTP 200 OK
    Content-Type: application/json

    {
	    "currencies": [
	        {
	            "name": "UAE Dirham",
	            "code": "AED"
	        },
	        {
	            "name": "Saudi Riyal",
	            "code": "SAR"
	        },
	    ]
	}

#### `currency conversion rates`
- **Endpoint** `https://sandbox.yougotagift.com/corporate/api/v1/currency-conversion-rates/`.
- **Returns** JSON document with the result of the request.
- **Request method**  `GET`.
- **Request format**  Should be an HTTP GET.
- **Requires Authentication**



##### Example Request and Response

    GET /corporate/api/v1/currency-conversion-rates/ HTTP/1.1
	Accept: application/json
	Authorization: Basic "Your Corporate Authentication"


    HTTP 200 OK
    Content-Type: application/json

    {
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
	    ]
	}


