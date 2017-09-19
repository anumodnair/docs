function getHeadersString(sigHeaders) {
    var headers = '';
    Object.keys(sigHeaders).forEach(function(h) {
        if (headers !== '') headers += ' ';
        headers += h;
    });
    return headers;
}

function getSigString(sigHeaders) {
    var sigString = '';
    Object.keys(sigHeaders).forEach(function(h) {
        if (sigString !== '') sigString += '\n';
        if (h.toLowerCase() == "request-line")
            sigString += sigHeaders[h];
        else
            sigString += h.toLowerCase() + ": " + sigHeaders[h];
    });
    return sigString;
}

function hashString(algorithm, str, secret) {
    switch (algorithm) {
        case 'hmac-sha1': return CryptoJS.HmacSHA1(str, secret);
        case 'hmac-sha256': return CryptoJS.HmacSHA256(str, secret);
        case 'hmac-sha512': return CryptoJS.HmacSHA512(str, secret);
        default : return null;
    }
}

function strFormatMap(template, map) {
    var out = template;
    Object.keys(map).forEach(function(key) {
        out = out.replace("${" + key + "}", map[key]);
    });
    return out;
}

var dateHeader = new Date().toGMTString();
// Set headers for the signature hash
var sigHeaders = {
    'x-date' : dateHeader
};
// Set the key ID and secret
var keyId = environment.keyId;
var secret = environment.secret;
// Set the signature hash algorithm
var algorithm = 'hmac-sha256';
var authHeaderTemplate = 'Signature headers="x-date",keyId="${keyId}",algorithm="hmac-sha256",signature="${signature}"';
var headers = getHeadersString(sigHeaders);
var sigString = getSigString(sigHeaders);
var sigHash = hashString(algorithm, sigString, secret);
// Format the authorization header

var authHeader = strFormatMap(authHeaderTemplate, {
    keyId : keyId,
    signature : CryptoJS.enc.Base64.stringify(sigHash)
    });

var contentLength = 0;
if (request.data) {
    contentLength = request.data.length;
}
postman.setEnvironmentVariable('auth-header', authHeader);
postman.setEnvironmentVariable('date-header', dateHeader);
postman.setEnvironmentVariable('content-length', contentLength);
postman.setEnvironmentVariable('auth-key', keyId);
