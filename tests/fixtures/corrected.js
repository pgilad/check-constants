var fixed = 9.99;
var TAX = 0.13;

//example taken from https://github.com/danielstjules/buddy.js
function getCorrectedTotal(subtotal) {
    var beforeTax = subtotal + fixed;
    return beforeTax + (beforeTax * TAX);
}
