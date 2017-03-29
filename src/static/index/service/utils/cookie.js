

var pluses = /\+/g;
function encode(s) {
    return config.raw ? s : encodeURIComponent(s);
}
function decode(s) {
    return config.raw ? s : decodeURIComponent(s);
}
function stringifyCookieValue(value) {
    return encode(config.json ? JSON.stringify(value) : String(value));
}
function parseCookieValue(s) {
    if (s.indexOf('"') === 0) {
        s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
    }
    try {
        s = decodeURIComponent(s.replace(pluses, ' '));
        return config.json ? JSON.parse(s) : s;
    } catch(e) {}
}
function read(s, converter) {
    var value = config.raw ? s : parseCookieValue(s);
    return _isFunction(converter) ? converter(value) : value;
}
function _isFunction(func){
    return typeof func === 'function' ;
}
var config = function (key, value, options) {
    if (value !== undefined && !_isFunction(value)) {
        options = Object.assign({}, config.defaults, options);
        if (typeof options.expires === 'number') {
            var days = options.expires, t = options.expires = new Date();
            t.setTime(+t + days * 864e+5);
        }
        return (document.cookie = [
            encode(key), '=', stringifyCookieValue(value),
            options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
            options.path    ? '; path=' + options.path : '',
            options.domain  ? '; domain=' + options.domain : '',
            options.secure  ? '; secure' : ''
        ].join(''));
    }
    var result = key ? undefined : {};
    var cookies = document.cookie ? document.cookie.split('; ') : [];
    for (var i = 0, l = cookies.length; i < l; i++) {
        var parts = cookies[i].split('=');
        var name = decode(parts.shift());
        var cookie = parts.join('=');
        if (key && key === name) {
            result = read(cookie, value);
            break;
        }
        if (!key && (cookie = read(cookie)) !== undefined) {
            result[name] = cookie;
        }
    }
    return result;
};
config.defaults = {};

function removeCookie (key,options) {
    if (config(key) === undefined) {
        return false;
    }
    config(key, '', Object.assign({}, options, { expires: -1 }));
    return !config(key);
}


export default{
    config ,
    removeCookie
}