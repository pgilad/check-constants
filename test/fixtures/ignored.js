//example taken from https://github.com/danielstjules/buddy.js
function getTotal(subtotal) {
    var beforeTax = subtotal + 1;
    return beforeTax + (beforeTax * 0.13);
}
