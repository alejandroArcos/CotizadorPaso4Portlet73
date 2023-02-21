function downloadBlob(blob, filename) {
    if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, filename);
    } else {
        var elem = window.document.createElement('a');
        elem.href = window.URL.createObjectURL(blob);
        elem.download = filename;
        document.body.appendChild(elem);
        elem.click();
        document.body.removeChild(elem);
    }
}

function downloadDocument(strBase64, filename) {
    var url = "data:application/octet-stream;base64," + strBase64;
    var documento = null;
    /*.then(res => res.blob())*/
    fetch(url)
        .then(function(res) { return res.blob() })
        .then(function(blob) {
            downloadBlob(blob, filename);
        });
}


function detectIEEdge() {
    var ua = window.navigator.userAgent;

    var msie = ua.indexOf('MSIE ');
    if (msie > 0) {
        /* IE 10 or older => return version number*/
        console.log(parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10));
        return true;
    }

    var trident = ua.indexOf('Trident/');
    if (trident > 0) {
        /* IE 11 => return version number*/
        var rv = ua.indexOf('rv:');
        console.log(parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10));
        return true;
    }

    var edge = ua.indexOf('Edge/');
    if (edge > 0) {
        /* Edge => return version number*/
        console.log(parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10));
        return true;
    }

    /* other browser */
    return false;
}