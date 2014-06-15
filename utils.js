/**
 * Created by maxime on 6/15/14.
 */

function isArray(o) {
    return Object.prototype.toString.call(o) === '[object Array]';
}

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