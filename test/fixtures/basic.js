//example taken from https://github.com/danielstjules/buddy.js
function getTotal(subtotal) {
    var beforeTax = subtotal + 9.99;
    return beforeTax + (beforeTax * 0.13);
}
