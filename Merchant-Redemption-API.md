# YouGotaGift.com Merchant Redemption API v1

## Introduction

This document describes how the YouGotaGift.com Merchant Redemption API works, how to integrate with it, how to send requests to the service, and what responses can be received.


## Integration Basics

To integrate with YouGotaGift.com Merchant Redemption API - the API - you should use HTTP requests, mainly `GET` and `POST` requests, over a `TLS/STARTTLS` secured channel, and HTTP Basic Authentication with each request using the username/password combination provided to you by YouGotaGift.com, all responses will be `application/json` mime-typed and in JSON format.

<!-- The API will provide 5 access points for you, and will, optionally, require you to provide 2 access points for it. -->


## The API Access Points

The following tables describe the endpoints provided by the service for your system.  **You should authenticate all the requests using HTTP Basic Authentication with the username/password combination provided to you by the YouGotaGift.com team.**


### Check a Gift Card

<table>
<tr>
<td><strong>URL</strong></td><td>https://sandbox.yougotagift.com/merchant/api/check/ </td>
</tr>
<tr>
<td><strong>HTTP Method</strong></td><td>POST</td>
</tr>
<tr>
<td><strong>Parameters</strong></td><td><ul><li><code>code</code> [String 13 digits]</li></ul></td>
</tr>
<tr>
<td valign="top"><strong>Response</strong></td><td>
On success HTTP 200 with:<br />
<br />
If gift card is redeemed:<br />
The gift with the following structure:
<ul>
<li><code>code</code> [String 13 digits]
<li><code>brand</code> [String]
<li><code>date_redeemed</code> [String DD/MM/YYYY]
<li><code>staff</code> [String]
<li><code>store</code> [String]
<li><code>amount</code> [Integer]
<li><code>amount_in_usd</code> [Float]
</ul>
<br />

If gift card is not redeemed:<br />

The gift with the following structure:
<ul>
<li><code>code</code> [String 13 digits]
<li><code>brand</code> [String]
<li><code>date_purchased</code> [String DD/MM/YYYY]
<li><code>expiry_date</code> [String DD/MM/YYYY]
<li><code>amount</code> [Integer]
<li><code>amount_in_usd</code> [Float]
</ul>
<br />
On failure HTTP 400 with:
<ul>
<li><code>errors</code> [Array of errors].
</ul>
<br />
An error is:
<ul>
<li><code>field</code> [String]
<li><code>errors</code> [Array of strings].
</ul>
</td>
</tr>
</table>


### Redeem a Gift Card

<table>
<tr>
<td><strong>URL</strong></td><td> https://sandbox.yougotagift.com/merchant/api/redeem/</td>
</tr>
<tr>
<td><strong>HTTP Method</strong></td><td>POST</td>
</tr>
<tr>
<td valign="top"><strong>Parameters</strong></td>
<td>
<ul>
<li><code>code</code> [String 13 digits]</li>
<li><code>store_staff_position</code> [String]
<li><code>store_staff_name</code> [String]
<li><code>store_location</code> [String]
<li><code>brand_id</code> [Integer] (Optional.  Required only if merchant has multiple brands listed on YouGotaGift.com.)
</ul>
</td>
</tr>
<tr>
<td valign="top"><strong>Response</strong></td>
<td>On success <code>HTTP 200</code> with:<br />
<br />
The gift with the following structure:
<ul>
<li><code>code</code> [String 13 digits]
<li><code>brand</code> [String]
<li><code>date_redeemed</code> [String DD/MM/YYYY]
<li><code>staff</code> [String]
<li><code>store</code> [String]
<li><code>amount</code> [Integer]
<li><code>amount_in_usd</code> [Float]
<li><code>redemption_code</code> [String]
</ul>

On failure <code>HTTP 400</code> with:
<ul>
<li><code>errors</code> [Array of errors].
</ul>

An error is:
<ul>
<li><code>field</code> [String]
<li><code>errors</code> [Array of strings].
</ul>

</td>
</tr>
</table>

### Cancel Redemption

<table>
  <tr>
    <td><strong>URL</strong></td>
    <td>https://sandbox.yougotagift.com/merchant/api/cancel/</td>
  </tr>
  <tr>
    <td><strong>HTTP Method</strong></td>
    <td>POST</td>
  </tr>
  <tr>
    <td valign="top"><strong>Parameters</strong></td>
    <td>
      <ul>
        <li><code>code</code> [String 13 digits]</li>
        <li><code>redemption_code</code> [String]</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td valign="top"><strong>Response</strong></td>
    <td>
      On success <code>HTTP 200</code> with:<br />
      <br />
      If gift card redemption was cancelled:<br />

      The gift with the following structure:
      <ul>
        <li><code>code</code> [String 13 digits]
        <li><code>brand</code> [String]
        <li><code>date_redeemed</code> [String DD/MM/YYYY]
        <li><code>staff</code> [String]
        <li><code>store</code> [String]
        <li><code>amount</code> [Integer]
        <li><code>amount_in_usd</code> [Float]
        <li><code>ok</code> [true]
        <li><code>redemption_code</code> [String]
      </ul>

      On failure <code>HTTP 400</code> with:
      <ul>
        <li><code>errors</code> [Array of errors].
      </ul>

      An error is:
      <ul>
        <li><code>field</code> [String]
        <li><code>errors</code> [Array of strings].
      </ul>
    </td>
  </tr>
</table>

<em><strong>N.B.</strong> You can only cancel redemptions of gift cards redeemed less than 14 days ago.</em>


### Redeemed Gift Cards

<table>
  <tr>
    <td><strong>URL</strong></td>
    <td> https://sandbox.yougotagift.com/merchant/api/redeemed/ </td>
  </tr>
  <tr>
    <td><strong>HTTP Method</strong></td>
    <td> GET </td>
  </tr>
  <tr>
    <td valign="top"><strong>Parameters</strong></td>
    <td> None </td>
  </tr>
  <tr>
    <td valign="top"><strong>Response</strong></td>
    <td>
      JSON array of gifts, each gift has the following structure:
      <ul>
        <li><code>code</code> [String 13 digits]
        <li><code>brand</code> [String]
        <li><code>date_redeemed</code> [String DD/MM/YYYY]
        <li><code>staff</code> [String]
        <li><code>store</code> [String]
        <li><code>amount</code> [Integer]
        <li><code>amount_in_usd</code> [Float]
      </ul>
    </td>
  </tr>
</table>


## Sandbox

When requested, YouGotaGift.com can give you sandbox access to the API, which is a test account that you can test the API integration with. Below are the details.

* All test gift cards’ codes are of the form `9000000000xxx`.
* When calling Redeemed Gift Cards with the sandbox account you will get always a result of 10 test gift cards.
* When calling Redeem a Gift Card or Check a Gift Card with the sandbox account you will get a result depending on the `code` you send (You only have to send the `code` parameter):
  * If the code is of the form `9001xxxxxxxxx` you will receive the “Invalid code, please try again.” error in an `HTTP 400` response.
  * If the code is of the form `9002xxxxxxxxx` you will receive the “Code is expired since DD MM, YYYY” error in an `HTTP 400` response.
  * If the code is of the form `9003xxxxxxxxx` you will receive the “Gift card already redeemed on DD MM, YYYY” error in an `HTTP 400` response.
  * Else you will get the `HTTP 200` response with a redeemed test gift card.
* When calling Cancel Redemption with the sandbox account you will get a result depending on the code you send (You only have to send the code parameter):
  * If the code is of the form `9001xxxxxxxxx` you will receive the “Invalid code, please try again.” error in an `HTTP 400` response.
  * If the code is of the form `9002xxxxxxxxx` you will receive the “Invalid redemption code, please try again” error in an `HTTP 400` response.
  * If the code is of the form `9003xxxxxxxxx` you will receive the “Gift card is not redeemed” error in an `HTTP 400` response.
  * If the code is of the form `9004xxxxxxxxx` you will receive the “Gift card was redeemed more than 14 days ago” error in an `HTTP 400` response.
  * Else you will get the `HTTP 200` response with a redeemed test gift card.

When you send asking for a request call back, YouGotaGift.com will respond with an `HTTP 200` response with `{“ok” : “true”}` in its body, YouGotaGift.com will call your system API after at least 3 seconds delay.

You must call these API access points using a Sandbox account ONLY, otherwise it will return an `HTTP 404` response.


## Examples

### Check Gift Card

#### Request

```
POST /merchant/api/redeem/ HTTP/1.1
Host: yougotagift.com
Authorization: Basic dXNlcm5hbWU6cGFzc3dvcmQ=

code=5163171564575
```

#### Success Response

```
HTTP/1.0 200 OK 
Content-Type: application/json

{
  "code": "5163171564575",
  "brand": "Brand",
  "date_purchased": "09/11/2012",
  "expiry_date": "09/11/2013",
  "amount": 500,
  "amount_in_usd": 136.13,
}
```


#### Fail Response (Already Redeemed)

```
HTTP/1.0 400 BAD REQUEST 
Content-Type: application/json

{
  "errors": [
    {
      "field": "code",
      "errors": [
        "Gift card already redeemed on Dec 09, 2012"
      ]
    }
  ]
}
```


#### Fail Response (Invalid Gift Card Code)

```
HTTP/1.0 400 BAD REQUEST 
Content-Type: application/json

{
  "errors": [
    {
      "field": "code",
      "errors": [
        "Invalid code, please try again."
      ]
    }
  ]
}
```


#### Fail Response (Expired Gift Code)

```
HTTP/1.0 400 BAD REQUEST 
Content-Type: application/json

{
  "errors": [
    {
      "field": "code",
      "errors": [
        "Code is expired since Oct 02, 2012."
      ]
    }
  ]
}
```


#### Fail Response (Missing Fields)

```
HTTP/1.0 400 BAD REQUEST 
Content-Type: application/json

{
  "errors": [
    {
      "field": "store_staff_name",
      "errors": [
        "This field is required."
      ]
    },
    {
      "field": "store_staff_position",
      "errors": [
        "This field is required."
      ]
    },
    {
      "field": "store_location",
      "errors": [
         "This field is required."
      ]
    },
    {
      "field": "code",
      "errors": [
        "This field is required."
      ]
    }
  ]
}
```


### Redeem Gift Card

#### Request

```
POST /merchant/api/redeem/ HTTP/1.1
Host: yougotagift.com
Authorization: Basic dXNlcm5hbWU6cGFzc3dvcmQ=

code=5163171564575&store_staff_name=John%20Smith&store_staff_position=Store%20Manager&store_location=Dubai%20Mall
```


#### Success Response

```
HTTP/1.0 200 OK 
Content-Type: application/json

{ 
  "code": "5163171564575",
  "brand": "Brand",
  "date_redeemed": "09/12/2012",
  "staff": "John Smith, Store Manager",
  "store": "Dubai Mall",
  "amount": 1000,
  "amount_in_usd": 272.26,
}
```


#### Fail Response (Already Redeemed)

```
HTTP/1.0 400 BAD REQUEST 
Content-Type: application/json
{
  "errors": [
    {
      "field": "code",
      "errors": [
        "Gift card already redeemed on Dec 09, 2012"
      ]
    }
  ]
}
```


#### Fail Response (Invalid Gift Card Code)

```
HTTP/1.0 400 BAD REQUEST 
Content-Type: application/json

{
  "errors": [
    {
      "field": "code",
      "errors": [
        "Invalid code, please try again."
      ]
    }
  ]
}
```


#### Fail Response (Expired Gift Code)

```
HTTP/1.0 400 BAD REQUEST 
Content-Type: application/json

{
  "errors": [
    {
      "field": "code",
      "errors": [
        "Code is expired since Oct 02, 2012."
      ]
    }
  ]
}
```


#### Fail Response (Missing Fields)

```
HTTP/1.0 400 BAD REQUEST 
Content-Type: application/json

{
  "errors": [
    {
      "field": "store_staff_name",
      "errors": [
        "This field is required."
      ]
    },
    {
      "field": "store_staff_position",
      "errors": [
        "This field is required."
      ]
    },
    {
      "field": "store_location",
      "errors": [
         "This field is required."
      ]
    },
    {
      "field": "code",
      "errors": [
        "This field is required."
      ]
    }
  ]
}
```


### Cancel Redemption

#### Request

```
POST /merchant/api/cancel/ HTTP/1.1
Host: yougotagift.com
Authorization: Basic dXNlcm5hbWU6cGFzc3dvcmQ=

code=5163171564575&redemption_code=46ECE933
```

#### Success Response

```
HTTP/1.0 200 OK 
Content-Type: application/json

{
  "code": "5163171564575",
  "brand": "Brand",
  "date_purchased": "09/11/2012",
  "expiry_date": "09/11/2013",
  "amount": 500,
  "amount_in_usd": 136.13,
  "ok": true,
  "redemption_code": "46ECE933"
}
```


#### Fail Response (Not Redeemed)

```
HTTP/1.0 400 BAD REQUEST 
Content-Type: application/json

{
  "errors": [
    {
      "field": "code",
      "errors": [
        "Gift card is not redeemed"
      ]
    }
  ]
}
```


#### Fail Response (Redeemed more than 14 days ago)

```
HTTP/1.0 400 BAD REQUEST 
Content-Type: application/json

{
  "errors": [
    {
      "field": "code",
      "errors": [
        "Gift card was redeemed more than 14 days ago"
      ]
    }
  ]
}
```


#### Fail Response (Invalid Gift Card Code)

```
HTTP/1.0 400 BAD REQUEST 
Content-Type: application/json

{
  "errors": [
    {
      "field": "code",
      "errors": [
        "Invalid code, please try again."
      ]
    }
  ]
}
```


#### Fail Response (Invalid Redemption Code)

```
HTTP/1.0 400 BAD REQUEST 
Content-Type: application/json

{
  "errors": [
    {
      "field": "redemption_code",
      "errors": [
        "Invalid redemption code, please try again."
      ]
    }
  ]
}
```


#### Fail Response (Missing Fields)

```
HTTP/1.0 400 BAD REQUEST 
Content-Type: application/json

{
  "errors": [
    {
      "field": "code",
      "errors": [
        "This field is required."
      ]
    },
    {
      "field": "redemption_code",
      "errors": [
        "This field is required."
      ]
    }
  ]
} 
```


### Get Redeemed Gift Cards

#### Request

```
GET /merchant/api/redeemed/ HTTP/1.1
Host: yougotagift.com
Authorization: Basic dXNlcm5hbWU6cGFzc3dvcmQ=
```


#### Response

```
HTTP/1.0 200 OK 
Content-Type: application/json

[
  {
    "code": "5163171564575",
    "brand": "Brand",
    "date_redeemed": "09/12/2012",
    "staff": "John Smith, Store Manager",
    "store": "Dubai Mall",
    "amount": 1000,
    "amount_in_usd": 272.26,
    "redemption_code": "46ECE933",
  },
  {
    "code": "5963181564576",
    "brand": "Brand",
    "date_redeemed": "01/12/2012",
    "staff": "John Smith, Store Manager",
    "store": "Dubai Mall",
    "amount": 2000,
    "amount_in_usd": 544.51,
    "redemption_code": "328FF8B7",
  },
  {
    "code": "5263121564577",
    "brand": "Brand",
    "date_redeemed": "09/11/2012",
    "staff": "John Smith, Store Manager",
    "store": "Dubai Mall",
    "amount": 500,
    "amount_in_usd": 136.13,
    "redemption_code": "44FABE13",
  }
]
```
