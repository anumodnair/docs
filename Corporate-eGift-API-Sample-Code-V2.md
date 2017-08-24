# YouGotaGift.com eGift API Sample Code _v2.0_

![YouGotaGift.com Logo](https://cdn.yougotagift.com/static/img/yougotagift.png)

### Introduction

This document includes code snippets providing examples of submitting a YouGotaGift API request and printing the JSON response.

### Code Snippets

- [`Python`](https://github.com/YouGotaGift/docs/blob/master/Corporate-eGift-API-Sample-Code-V2.md#python)
- [`Java`](https://github.com/YouGotaGift/docs/blob/master/Corporate-Rewards-API-Sample-Code-V2.md#Java)

### Python

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
            String uriget = "http://xxxxxxxxxx/account/";

            request = new HttpGet(uriget);
            request.setHeader("Accept", "application/json");
            request.setHeader("host", "http://xxxxxxxxxx");
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
            String uri = "http://xxxxxxxxxx/order/";
            HttpPost postRequest = new HttpPost(uri);
            postRequest.setHeader("Accept", "application/json");
            postRequest.setHeader("host", "http://xxxxxxxxxx");
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
    
