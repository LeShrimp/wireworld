/**
 * Created by maxime on 6/15/14.
 */


function isArray(o) {
    return Object.prototype.toString.call(o) === '[object Array]';
}

/**
 * Checks wether given array is rectangular. And of given width and height
 * (if provided). First dimension ist considered as width, second as height.
 * Array is supposed to be of the form a[x][y], x in width direction. y in
 * height direction.
 *
 * @param {Array} a
 * @param {number} [width]
 * @param {number} [height]
 * @returns {boolean}
 */
function isRectArray(a, width, height) {
    if (!isArray(a)) {
        return false;
    }
    if (typeof(width)!=='undefined' && a.length != width) {
        return false;
    }
    for (var i=0; i<a.length; i++) {
        if (!isArray(a[i])) {
            return false;
        }
        if (typeof(height)!=='undefined' && a[i].length != height) {
            return false;
        }
    }
    return true;
}


function cloneRectArray(a) {
    var b = [];
    for (var i=0; i<a.length; i++) {
        b[i] = [];
        for (var j=0; j<a[i].length; j++) {
            b[i][j] = a[i][j];
        }
    }
    return b;
}

function transpose(a) {
    if (!isRectArray(a)) {
        throw 'Unable to transpose argument. Invalid format.';
    }
    at = [];
    for (var j=0; j<a[0].length; j++) {
        at[j] = [];
        for (var i=0; i<a.length; i++) {
            at[j][i] = a[i][j];
        }
    }

    return at;
}


/**
 * Copys every enumerable property of the second object to
 * the first object.
 *
 * @param {Object} obj1
 * @param {Object} obj2
 */
function copyProperties(obj1, obj2) {
    for (var prop in obj2) {
        obj1[prop] = obj2[prop];
    }
}


/**
 * Copys every enumerable property of the second arguments prototype to
 * the prototype of the first argument.
 *
 * @param {function} constr1
 * @param {function} constr2
 */
function copyPrototype(constr1, constr2) {
    proto1 = constr1.prototype;
    proto2 = constr2.prototype;
    for (var prop in proto2) {
        proto1[prop] = proto2[prop];
    }
}


/**
 * Primitive implementation of each. Executes callback(a[i])
 * for every element in the array a.
 *
 * @param {Array} a
 * @param {function} callback
 */
function forEach(a, callback) {
    for (var i in a) {
        callback(a[i]);
    }
}

function inArray(needle, haystack) {
    for (var i in haystack) {
        if (haystack[i] == needle)
            return true;
    }
    return false;
}

/**
 * Clear the given DOM node.
 */
function getClearedElementById(id)
{
    var node = document.getElementById(id);
    var clone = node.cloneNode(false);
    node.parentNode.replaceChild(clone, node);
    return clone;
}

//Cookie functions from http://www.w3schools.com/js/js_cookies.asp
//Note that cookie setting does not work for local files in chrom* browser
function setCookie(cname,cvalue,exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname+"="+cvalue+"; "+expires;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) != -1) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function deleteCookie(cname) {
    document.cookie = cname + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

//Return defaultValue if value is undefined, value otherwise
function defaultsTo(value, defaultValue) {
    return typeof value === 'undefined' ? defaultValue : value;
}

function mailme() {
    window.location.href = stupidEncode("hdliqj?hd}r`bEbh}+k`q");
}

function stupidEncode(str) {
    var result = '';
    for (var i = 0; i < str.length; i++) {
        result += String.fromCharCode(str.charCodeAt(i) ^ 5);
    }
    return result;
}
