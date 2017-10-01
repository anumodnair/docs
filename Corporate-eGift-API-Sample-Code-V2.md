## YouGotaGift.com eGift API _v2.0_ ( Authentication and Sample code )

![YouGotaGift.com Logo](https://cdn.yougotagift.com/static/img/yougotagift.png)

### Introduction

This document expalins Authentication and includes code snippets providing examples of submitting a YouGotaGift API request and printing the JSON response.

### Contents

- #### [Authentication](https://github.com/YouGotaGift/docs/blob/master/Corporate-eGift-API-Sample-Code-V2.md#authentication-1)
- #### [Code Snippets](https://github.com/YouGotaGift/docs/blob/master/Corporate-eGift-API-Sample-Code-V2.md#code-snippets-1)

### `Authentication`
Authentication is done by signing HTTP requests with secure signatures

1. Must obtain `API_SECRET` and `API_KEY` from YouGotaGift.com
2. Each request requires `API_KEY` and `Signature` parameter to be submitted.
3. The `Signature` parameter is built from `API_SECRET` + `timestamp` which is hmac-sha256 encrypted and later Hex encoded.

*Note: Each request requires new `Signature` built with the current timestamp to be submitted.*

##### Specification You Need to Be Familiar With:

To learn how to perform step 3 in the process above, refer to [draft-cavage-http-signatures](https://tools.ietf.org/html/draft-cavage-http-signatures-03). 

It's a draft specification that forms the basis for how YouGotaGift handles request signatures. It describes generally how to form the signing string, how to create the signature, and how to add the signature and required information to the request. The remaining sections in this topic assume you're familiar with it.

##### Important items to note about the API implementation:

##### `Authorization Header`

The YouGotaGift API signature uses the `Signature` Authentication scheme (with an Authorization header), and not the Signature HTTP header.

##### `Required Headers`

This section describes the headers that must be included in the signing string.

*Note: If a required header is missing, you will receive a `401 "Unauthorized"` response.*

##### `GET requests Headers`
For GET requests (when there's no content in the request body), the signing string must include at least these headers:

| Header | Description |
| ------------ | ------------- |
|(request-target) | [As described in draft-cavage-http-signatures-03](https://tools.ietf.org/html/draft-cavage-http-signatures-03) |
|host| Host |
|date| UTC date and time in standard format |

##### `POST requests Headers`
For POST requests (when there's content in the request body), the signing string must include at least these headers:

| Header | Description |
| ------------ | ------------- |
|(request-target) | [As described in draft-cavage-http-signatures-03](https://tools.ietf.org/html/draft-cavage-http-signatures-03) |
| host | Host |
| date | UTC date and time in standard format |
| content-type | The MIME type of the body of the request |
| content-length | The length of the request body |

##### `URL Encoding of Path and Query String`

When forming the signing string, you must URL encode all parameters in the path and query string (but not the headers) according to RFC 3986.

##### `Signing Algorithm`

The signing algorithm must be hmac-sha256, and you must set algorithm="hmac-sha256" in the Authorization header (notice the quotation marks).

##### `Example Header`

Here's an example of the general syntax of the Authorization header (for a request with content in the body):

        'HTTP_AUTHORIZATION': 'Signature headers="accept date",keyId="NGJHIVCEHBZCODYQC0EF",algorithm="hmac-sha256",signature="UBuv7hHKm85N18894stnYgF82PGQ9/Rf36CZQNJDNYk="',

##### `Example usage cURL to create Authorization header`

        ~$ API_SIG=Base64(Hmac(API_SECRET, "Date: Mon, 17 Aug 2017 06:11:05 GMT", SHA256))
        ~$ curl -v -H 'Date: "Mon, 17 Aug 2017 06:11:05 GMT"' -H 'Authorization: Signature keyId="API_KEY",algorithm="hmac-sha256",headers="date",signature="API_SIG"'

### `Code Snippets`
The following code snippets provides an example of submitting a YouGotaGift API request and printing the JSON response
- [`Postman`](https://github.com/YouGotaGift/docs/blob/master/Postman-doc.md)
- [`PHP`](https://github.com/YouGotaGift/docs/blob/master/Corporate-eGift-API-Sample-Code-V2.md#php)
- [`Python`](https://github.com/YouGotaGift/docs/blob/master/Corporate-eGift-API-Sample-Code-V2.md#python)
- [`Java`](https://github.com/YouGotaGift/docs/blob/master/Corporate-eGift-API-Sample-Code-V2.md#java)
- [`C#`](https://github.com/YouGotaGift/docs/blob/master/Corporate-eGift-API-Sample-Code-V2.md#c)


### PHP

        <?php
        $apiKey = 'NGJHIVCEHBZCODYQC0EF';
        $apiSecret = 'MK6Go9VxfyVykdHTaW6UyHpJCW7c1mP9R1qCwqCH';
        $fullURLString = 'https://xxxxxxxxxxxx/order/';
        
        $options = array(
            'key' => $apiSecret,
            'keyId' => $apiKey,
            'algorithm' => 'hmac-sha256');
        //Sign Header elements
        $options['headers'] = array('date');
        // Date header UTC Current Date and time 
        $headers['date'] = date(DATE_RFC1123);
        
        $sign = array();
        // Date header UTC Current Date and time 
        foreach ($options['headers'] as $header) {
            $sign[] = sprintf("%s: %s", $header, $headers[$header]);
        }
        $data = join("\n", $sign);
        // Create signature and Authorization Header
        // Ref : https://github.com/dgwynne/php-http-signature
        $signature = hash_hmac('sha256', $data, $options['key'], true);
        $headers['authorization'] = sprintf('Signature keyId="%s",algorithm="%s",headers="%s",signature="%s"', 
        $options['keyId'], $options['algorithm'], implode(' ', $options['headers']), 
        base64_encode($signature));

        $http_headers = array();
        foreach ($headers as $k => $v) {
            $http_headers[] = "$k: $v";
        }
        $http_headers[] = "accept: application/json";
        $http_headers[] = "X-Api-Key: $apiKey";

        $post = [
            'reference_id' => 10078,
            'brand_code' => '1847',
            'country' => 'AE',
            'amount' => 200,
            'currency' => 'AED',
            'delivery_type' => 1
        ];

        $ch = curl_init($fullURLString);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $http_headers);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $post);
        curl_exec($ch);
        curl_close($ch);
        ?>

### Python

    import datetime
    import requests 
    from httpsig.requests_auth import HTTPSignatureAuth

    API_KEY = 'NGJHIVCEHBZCODYQC0EF'
    API_SECRET = 'MK6Go9VxfyVykdHTaW6UyHpJCW7c1mP9R1qCwqCH'

    uri = "https://xxxxxxxxxxx/brands/{brand_code}/"
    uri = uri.format(
            brand_code=1847)

    signature_headers = ['accept', 'date']
    headers = {
        'Accept': 'application/json',
        'X-Api-Key': API_KEY,
        'date': str(datetime.datetime.now()),
    }
    auth = HTTPSignatureAuth(key_id=API_KEY, secret=API_SECRET, headers=signature_headers)

    # GET: brand catalogue API
    r = requests.get(uri, auth=auth, headers=headers)
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
    uri = "https://xxxxxxxxxxx/order/"
    r = requests.post(uri, json=payload, auth=auth, headers=headers)
    print r.json()
    

### Java

    package Signing;

    /**
     *
     * @author YouGotaGift
     */
    /*
    <dependency>
    <groupId>com.google.guava</groupId>
    <artifactId>guava</artifactId>
    <version>19.0</version>
    </dependency>
     */
    import com.google.common.collect.ImmutableList;
    import com.google.common.collect.ImmutableMap;
    /*
    <dependency>
        <groupId>org.apache.httpcomponents</groupId>
        <artifactId>httpclient</artifactId>
        <version>4.5</version>
    </dependency>
    */
    import org.apache.http.util.EntityUtils;
    import org.apache.http.client.methods.HttpGet;
    import org.apache.http.impl.client.DefaultHttpClient;
    import org.apache.http.HttpResponse;
    import org.apache.http.client.HttpClient;
    import org.apache.http.client.methods.HttpPost;
    import org.apache.http.client.methods.HttpRequestBase;
    /*
    <dependency>
        <groupId>org.tomitribe</groupId>
        <artifactId>tomitribe-http-signatures</artifactId>
        <version>1.0</version>
    </dependency>
    */
    import org.apache.http.entity.StringEntity;
    import org.tomitribe.auth.signatures.MissingRequiredHeaderException;
    import org.tomitribe.auth.signatures.Signature;
    import org.tomitribe.auth.signatures.Signer;


    import java.io.IOException;
    import java.time.Instant;
    import java.io.UnsupportedEncodingException;
    import java.net.URI;
    import java.security.Key;
    import java.text.SimpleDateFormat;
    import java.util.*;
    import java.util.stream.Collectors;
    import javax.crypto.spec.SecretKeySpec;

    /**
     * This example creates a {@link RequestSigner}, then prints out the Authorization header
     * that is inserted into the HttpGet object.
     */
    public class Signing {
        public static void main(String[] args) throws UnsupportedEncodingException, IOException {
            HttpRequestBase request;

            String apiKey = "XXXXXXXXXXXXXXXXXXXX";
            String passphrase = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
            final Key privateKey = new SecretKeySpec(passphrase.getBytes(), "HmacSHA256");
            RequestSigner signer = new RequestSigner(apiKey, privateKey);

            // GET with query parameters
            String uriget = "https://xxxxxxxxxx/account/";

            request = new HttpGet(uriget);
            request.setHeader("Accept", "application/json");
            request.setHeader("host", "https://xxxxxxxxxx");
            request.setHeader("X-Api-Key", apiKey);
            request.setHeader("Date", Instant.now().toString());
            signer.signRequest(request);
            HttpClient httpClientrequest = new DefaultHttpClient();
            HttpResponse responseget = httpClientrequest.execute(request);
            if (responseget.getStatusLine().getStatusCode() == 200) {
                String server_response = EntityUtils.toString(responseget.getEntity());
                System.out.print("Server response" + server_response);
            } else {
                System.out.print("Server response" + "Failed to get server response");
            }
            httpClientrequest.getConnectionManager().shutdown();

            // POST with body
            String uri = "https://xxxxxxxxxx/order/";
            HttpPost postRequest = new HttpPost(uri);
            postRequest.setHeader("Accept", "application/json");
            postRequest.setHeader("host", "https://xxxxxxxxxx");
            postRequest.setHeader("X-Api-Key", apiKey);
            postRequest.setHeader("Date", Instant.now().toString());
            StringEntity input = new StringEntity("{\"reference_id\": 987667, "
                    + "\"brand_code\": \"YGAGC\", "
                    + "\"country\": \"AE\", "
                    + "\"amount\": 200, "
                    + "\"currency\": \"AED\", "
                    + "\"delivery_type\": 1}");
            input.setContentType("application/json");
            HttpClient httpClient = new DefaultHttpClient();
            ((HttpPost)postRequest).setEntity(input);
            signer.signRequest(postRequest);
            HttpResponse response = httpClient.execute(postRequest);
            if (response.getStatusLine().getStatusCode() == 200) {
                String server_response = EntityUtils.toString(response.getEntity());
                System.out.print("Server response" + server_response);
            } else {
                String server_response = EntityUtils.toString(response.getEntity());
                System.out.print("Server response" + server_response);
            }
            httpClient.getConnectionManager().shutdown();


        }


        /**
         * A light wrapper around https://github.com/tomitribe/http-signatures-java
         */
        public static class RequestSigner {
            private static final SimpleDateFormat DATE_FORMAT;
            private static final String SIGNATURE_ALGORITHM = "hmac-sha256";
            private static final Map<String, List<String>> REQUIRED_HEADERS;
            static {
                DATE_FORMAT = new SimpleDateFormat("EEE, dd MMM yyyy HH:mm:ss zzz", Locale.US);
                DATE_FORMAT.setTimeZone(TimeZone.getTimeZone("GMT"));
                REQUIRED_HEADERS = ImmutableMap.<String, List<String>>builder()
                        .put("get", ImmutableList.of("date", "(request-target)", "host"))
                        .put("post", ImmutableList.of("date", "(request-target)", "host"))
                .build();
            }
            private final Map<String, Signer> signers;

            /**
             * @param apiKey The identifier for a key uploaded through the console.
             * @param privateKey The private key that matches the uploaded public key for the given apiKey.
             */
            public RequestSigner(String apiKey, Key privateKey) {
                this.signers = REQUIRED_HEADERS
                        .entrySet().stream()
                        .collect(Collectors.toMap(
                                entry -> entry.getKey(),
                                entry -> buildSigner(apiKey, privateKey, entry.getKey())));
            }

            /**
             * Create a {@link Signer} that expects the headers for a given method.
             * @param apiKey The identifier for a key uploaded through the console.
             * @param privateKey The private key that matches the uploaded public key for the given apiKey.
             * @param method HTTP verb for this signer
             * @return
             */
            protected Signer buildSigner(String apiKey, Key privateKey, String method) {
                final Signature signature = new Signature(
                        apiKey, SIGNATURE_ALGORITHM, null, REQUIRED_HEADERS.get(method.toLowerCase()));
                return new Signer(privateKey, signature);
            }

            /**
             * Sign a request, optionally including additional headers in the signature.
             *
             * <ol>
             * <li>If missing, insert the Date header (RFC 2822).</li>
             * <li>If PUT or POST, insert any missing content-type, content-length, x-content-sha256</li>
             * <li>Verify that all headers to be signed are present.</li>
             * <li>Set the request's Authorization header to the computed signature.</li>
             * </ol>
             *
             * @param request The request to sign
             */
            public void signRequest(HttpRequestBase request) {
                final String method = request.getMethod().toLowerCase();
                // nothing to sign for options
                if (method.equals("options")) {
                    return;
                }

                final String path = extractPath(request.getURI());

                // supply date if missing
                if (!request.containsHeader("date")) {
                    request.addHeader("date", DATE_FORMAT.format(new Date()));
                }

                // supply host if mossing
                if (!request.containsHeader("host")) {
                    request.addHeader("host", request.getURI().getHost());
                }


                final Map<String, String> headers = extractHeadersToSign(request);
                final String signature = this.calculateSignature(method, path, headers);
                request.setHeader("Authorization", signature);
            }

            /**
             * Extract path and query string to build the (request-target) pseudo-header.
             * For the URI "http://www.host.com/somePath?foo=bar" return "/somePath?foo=bar"
             */
            private static String extractPath(URI uri) {
                String path = uri.getRawPath();
                String query = uri.getRawQuery();
                if (query != null && !query.trim().isEmpty()) {
                    path = path + "?" + query;
                }
                return path;
            }

            /**
             * Extract the headers required for signing from a {@link HttpRequestBase}, into a Map
             * that can be passed to {@link RequestSigner#calculateSignature}.
             *
             * <p>
             * Throws if a required header is missing, or if there are multiple values for a single header.
             * </p>
             *
             * @param request The request to extract headers from.
             */
            private static Map<String, String> extractHeadersToSign(HttpRequestBase request) {
                List<String> headersToSign = REQUIRED_HEADERS.get(request.getMethod().toLowerCase());
                if (headersToSign == null) {
                    throw new RuntimeException("Don't know how to sign method " + request.getMethod());
                }
                return headersToSign.stream()
                        // (request-target) is a pseudo-header
                        .filter(header -> !header.toLowerCase().equals("(request-target)"))
                        .collect(Collectors.toMap(
                        header -> header,
                        header -> {
                            if (!request.containsHeader(header)) {
                                throw new MissingRequiredHeaderException(header);
                            }
                            if (request.getHeaders(header).length > 1) {
                                throw new RuntimeException(
                                        String.format("Expected one value for header %s", header));
                            }
                            return request.getFirstHeader(header).getValue();
                        }));
            }

            /**
             * Wrapper around {@link Signer#sign}, returns the {@link Signature} as a String.
             *
             * @param method Request method (GET, POST, ...)
             * @param path The path + query string for forming the (request-target) pseudo-header
             * @param headers Headers to include in the signature.
             */
            private String calculateSignature(String method, String path, Map<String, String> headers) {
                Signer signer = this.signers.get(method);
                if (signer == null) {
                    throw new RuntimeException("Don't know how to sign method " + method);
                }
                try {
                    return signer.sign(method, path, headers).toString();
                } catch (IOException e) {
                    throw new RuntimeException("Failed to generate signature", e);
                }
            }
        }
    }
    
### C#

        using System; 
        using System.Text; 
        using RestSharp; 
        using System.Security.Cryptography; 
        namespace ConsoleApp3 
        { 
                class Program 
                { 
                        public static string GetResponseFromAPI() 
                        { 
                                string url = "https://XYZ/v2/order/"; 
                                string key = "API_KEY"; 
                                string secret = "API_SECRET"; 
                                string apiResponse = String.Empty; 
                                var client = new RestClient(url); 
                                IRestResponse response; 

                                var request = new RestRequest(Method.POST); 
                                // Date in UTC
                                string utcdate = DateTime.UtcNow.ToString("s") + "Z"; 
                                string stringtosign = "x-date: " + utcdate; 
                                string sign = CreateSignature(secret, stringtosign); 
                                var authorizationHeader = "Signature headers=\"x-date\",keyId=\""+ key + "\",algorithm=\"hmac-sha256\",signature=\"" + sign+"\""; 
                                request.RequestFormat = DataFormat.Json; 
                                request.AddBody(new { reference_id = "1102", brand_code = "1847", country = "AE", amount = 200, currency = "AED" , delivery_type = "1" }); 
                                request.AddHeader("Accept", "application/json"); 
                                request.AddHeader("Content-type", "application/json"); 
                                request.AddHeader("Authorization", authorizationHeader); 
                                request.AddHeader("X-Api-Key", key); 
                                request.AddHeader("X-Date", utcdate); 
                                response = client.Execute(request); 
                                apiResponse = response.Content.ToString(); 
                                return apiResponse; 
                        } 
                        // Creating Signature
                        public static string CreateSignature(string secrete, string stringtosign) 
                        { 
                                var secretBytes = Encoding.UTF8.GetBytes(secrete); 
                                var valueBytes = Encoding.UTF8.GetBytes(stringtosign); 
                                string signature; 

                                using (var hmac = new HMACSHA256(secretBytes)) 
                                { 
                                var hash = hmac.ComputeHash(valueBytes); 
                                signature = Convert.ToBase64String(hash); 
                                } 
                                return signature; 
                        } 

                        static void Main(string[] args) 
                        { 
                                Console.Write(GetResponseFromAPI()); 
                                Console.ReadLine(); 
                        } 
                } 
        } 
