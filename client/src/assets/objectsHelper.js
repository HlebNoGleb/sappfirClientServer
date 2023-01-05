import config from "./config";

const getAllKeys = (obj, prefix = '') =>
    Object.keys(obj).reduce((res, el) => {
        if( Array.isArray(obj[el]) ) {
            return [...res, prefix + el];
        } else if( typeof obj[el] === 'object' && obj[el] !== null ) {
            return [...res, ...getAllKeys(obj[el], prefix + el + '.')];
        }

        return [...res, prefix + el];
    }, []);

function getNestedValue(path, obj=self, separator='.') {
    var properties = Array.isArray(path) ? path : path.split(separator)
    return properties.reduce((prev, curr) => prev?.[curr], obj)
}

function createNestedObject( base, names, value ) {
    var lastName = arguments.length === 3 ? names.pop() : false;

    for( var i = 0; i < names.length; i++ ) {
        base = base[ names[i] ] = base[ names[i] ] || {};
    }

    if( lastName ) base = base[ lastName ] = value;

    return base;
};

function getDefaultValueByType(value){
    let type = typeof value;
    console.log(type);
    if (typeof type !== 'string') throw new TypeError('Type must be a string.');

// Handle simple types (primitives and plain function/object)
    switch (type) {
        case 'bigint'    : return BigInt(0);
        case 'boolean'   : return false;
        case 'function'  : return function () {};
        case 'number'    : return 0;
        case 'object'    : return {};
        case 'string'    : return "";
        case 'symbol'    : return Symbol();
        case 'undefined' : return void 0;
    }

    return null;
}

function uploadFiles(event, path){
    const formData = new FormData(event.target)
    formData.append('path', path)

    fetch(`${config.serverUrl}/upload`, {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        let text = data.data.map(x => x);
        console.log(text);
        Swal.fire(
            'Отлично',
             text.join('<br>'),
            'success'
        );
    })
    .catch(error => {
        console.error(error)
    })
}

export let objectHelper = {
    getAllKeys, getNestedValue, createNestedObject, getDefaultValueByType, uploadFiles
}