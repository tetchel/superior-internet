// returns an int [0, 255]
// from ints and strings

function normalize(input) {

    let type = typeof(input);
    if (type !== 'string' && type !== 'number') {
        console.log("Unsupported object type " + type);
    }
    else if (type === 'string') {
        // the input strings are md5 hashes
        // get the mod of the first 1/4 of the md5 (to fit in a 32-bit int)
        let shortHash = input.substring(0, 8);
        input = parseInt(input, 16);
    }

    return input % 255;
    
}

module.exports = normalize;