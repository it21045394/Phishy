var testdata;
var prediction;

function predict(data, weight) {
    var f = 0;
    for (var j = 0; j < data.length; j++) {
        f += data[j] * weight[j];
    }
    return f > 0 ? 1 : -1;
}

var weight = [0.03605329, 0.01830405, 0.19099547, 0.06810706, 0.00092106, 0.03927075, 0.00105097, 0.01527932, 0.00063617, 0.15585134, 0.04486626, 0.03186033, 0.39680394];


function isipInURL() {
    var reg = /\d{1,3}[\.]{1}\d{1,3}[\.]{1}\d{1,3}[\.]{1}\d{1,3}/;
    var url = window.location.href;
    if (reg.exec(url) == null) {
        return 1;
    } else {
        return -1;
    }
}

function countSubstringOccurrences(mainString, substring) {
    return mainString.split(substring).length - 1;
}

function nbComInURL() {
    var url = window.location.href;
    var count = countSubstringOccurrences(url, ".com");
    if (count > 1) {
        return 1; // phishing
    } else {
        return -1; // legitimate
    }
}
function lengthURL() {
    var url = window.location.href;
    if (url.length < 54) {
        return 1; // legitimate
    } else if (url.length >= 54 && url.length < 75) {
        return 0; // partially phishing
    } else {
        return -1; // phishing
    }
}
function nbHyphens() {
    var url = window.location.href;
    var count = countSubstringOccurrences(url, "-");
    if (count <= 1) {
        return 1; // legitimate
    } else if (count <= 2) {
        return 0; // partially phishing
    } else {
        return -1; // phishing
    }
}
function port() {
    var url = window.location.href;
    var portRegex = /:(\d+)/;
    var match = portRegex.exec(url);
    if (match && match[1]) {
        var portNumber = parseInt(match[1]);
        if ([8080, 443, 80, 8443].includes(portNumber)) {
            return 1; // legitimate
        } else if (portNumber >= 1 && portNumber <= 65535) {
            return -1; // phishing
        }
    }
    return 1; // legitimate
}
function nbRedirection() {
    var redirectionCount = performance.navigation.redirectCount;
    if (redirectionCount >= 2) {
        return 1; // phishing
    } else {
        return -1; // legitimate
    }
}
function nbExternalRedirection() {
    var redirects = document.querySelectorAll("meta[http-equiv='refresh']");
    var externalRedirectCount = 0;

    redirects.forEach(function(redirect) {
        var content = redirect.getAttribute("content");
        var urlMatch = content.match(/url=(.*?)(;|$)/i);

        if (urlMatch && urlMatch[1]) {
            var redirectURL = urlMatch[1];
            
            try {
                var currentDomain = window.location.hostname;
                var redirectDomain = new URL(redirectURL).hostname;

                if (currentDomain !== redirectDomain) {
                    externalRedirectCount++;
                }
            } catch (error) {
                console.error("Error processing redirect URL:", error);
            }
        }
    });

    if (externalRedirectCount > 0) {
        console.log("P");
        return 1; // phishing
    } else {
        console.log("NP");
        return -1; // legitimate
    }
}

function externalFavicon() {
    var currentDomain = window.location.hostname;
    var faviconURLs = document.querySelectorAll("link[rel*='icon']");

    for (var i = 0; i < faviconURLs.length; i++) {
        var faviconURL = faviconURLs[i].getAttribute("href");
        var faviconDomain = new URL(faviconURL, window.location.href).hostname;

        if (currentDomain !== faviconDomain) {
            console.log("P");
            return 1; // phishing
        }
    }

    console.log("NP");
    return -1; // legitimate
}
function iframe() {
    var iframeCount = document.querySelectorAll('iframe').length;
    if (iframeCount > 0) {
        return 1; // phishing
    } else {
        return -1; // legitimate
    }
}
function length_hostname() {
    var url = window.location.href;
    var urlObj = new URL(url);
    var hostname = urlObj.hostname;
    var hostnameLength = hostname.length;

    console.log("Hostname length:", hostnameLength);

    // Define a threshold based on your judgment
    var suspiciousLength = 15; // For example, consider lengths greater than 15 as suspicious

    if (hostnameLength > suspiciousLength) {
        return -1; // Suspicious
    } else {
        return 1; // Legitimate
    }
}
function nb_dots() {
    var url = window.location.href;
    var urlObj = new URL(url);
    var hostname = urlObj.hostname;
    var dotCount = (hostname.match(/\./g) || []).length;

    console.log("Number of dots in hostname:", dotCount);

    // Define a threshold based on your judgment
    var suspiciousDotCount = 7; // For example, consider more than 2 dots as suspicious

    if (dotCount > suspiciousDotCount) {
        return -1; // Suspicious
    } else {
        return 1; // Legitimate
    }
}
function nb_subdomains() {
    var url = window.location.href;
    var urlObj = new URL(url);
    var hostname = urlObj.hostname;
    
    // Remove www. from the beginning of the hostname
    hostname = hostname.replace(/^www\./, '');

    var subdomainCount = (hostname.match(/\./g) || []).length;

    console.log("Number of subdomains:", subdomainCount);

    // Define a threshold based on your judgment
    var suspiciousSubdomainCount = 3; // For example, consider more than 2 subdomains as suspicious

    if (subdomainCount > suspiciousSubdomainCount) {
        return -1; // Suspicious
    } else {
        return 1; // Legitimate
    }
}

function nbHyperlinks() {
    var hyperlinkCount = document.querySelectorAll('a').length;
    if (hyperlinkCount > 10) {
        return 1; // phishing
    } else {
        return -1; // legitimate
    }
}
testdata = [
    isipInURL(),
    nbComInURL(),
    lengthURL(),
    nbHyphens(),
    port(),
    nbRedirection(),
    nbExternalRedirection(),
    externalFavicon(),
    iframe(),
    length_hostname(),
    nb_dots(),
    nb_subdomains(),
    nbHyperlinks(),
];

prediction = predict(testdata, weight);
    

chrome.extension.sendRequest(prediction);