# Postman Pre-request script for HMAC Authentication
This is javascript for use with [Postman](https://www.getpostman.com/)'s pre-request script feature.
It generates HTTP request headers for HMAC authentication.

The script could easily be modified for use with custom HMAC authentication schemes.

## Usage

1. Copy the contents of [postman-pre-request-script.js](https://github.com/YouGotaGift/docs/blob/master/postman/pre-request-script.js) into the "Pre-request Script" tab in Postman.
2. Click Manage Environments ![Manage Environments](/postman/ManageEnvironment.png?raw=true)
3. Create an environment and add two key-value pairs at Postman's "Manage Environments" settings dialog. `keyId` containing the Key of the API , and `secret` containing the shared secret key.

    ![Manage Environments](/postman/postman-manage-env.png?raw=true)
3. Switch to the newly environment you just created, by following step 2.
4. On the "Headers" tab click "Bulk Edit" and paste the following content into the headers field. Note that the `Content-Type` header must be set manually to the content type of your request. The other headers will be generated automatically by the script.

        Authorization:{{auth-header}}
        Content-Length:{{content-length}}
        X-Api-Key:{{auth-key}}
        Accept:application/json
        X-Date:{{date-header}}

    As shown below:
    ![Headers](/postman/Headers.png?raw=true)
5. Send the request to http://sandbox.yougotagift.com/corporate/api/v2/account/. 


## Reference

[HTTP Signatures Specification](https://tools.ietf.org/html/draft-cavage-http-signatures)
