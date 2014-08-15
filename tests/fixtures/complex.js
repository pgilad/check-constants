//varied case of : http://www.yuiblog.com/blog/2009/03/10/when-you-cant-count-on-your-numbers/
var partialReduce = function (array, func) {
    var i, result = [];
    var x = array.length - 1;
    for (i = 0; i < x; i += 2) {
        result.push(func(array[i], array[i + 1]));
    }
    if (i === x) {
        result.push(array[i]);
    }
    return result;
};
