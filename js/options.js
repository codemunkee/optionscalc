/**
 * Created by russellnealis on 11/27/16.
 */

// convert number to currency
var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
});


// when someone clicks on plus sign to add shares that
// have already been sold.
var elAlreadySold = document.getElementById('addSold');
elAlreadySold.addEventListener('click', addSoldInput, false);

// appends the form items to the already sold portion of the page
function addSoldInput() {
    var elSoldForm = document.getElementById('soldForm');
    var divNode = document.createElement('div');
    elSoldForm.appendChild(divNode);

    var textNode0 = document.createTextNode("Quantity: ");
    var inputNode0 = document.createElement('input');
    var textNode1 = document.createTextNode(" Price: ");
    var inputNode1 = document.createElement('input');

    inputNode0.setAttribute('type', 'text');
    inputNode0.setAttribute('class', 'quantity');
    inputNode1.setAttribute('type', 'text');
    inputNode1.setAttribute('class', 'price');

    divNode.appendChild(textNode0);
    divNode.appendChild(inputNode0);
    divNode.appendChild(textNode1);
    divNode.appendChild(inputNode1);
}

// attach event handler to calculate "button"
var elCalculate = document.getElementsByClassName('calculate')[0];
elCalculate.addEventListener('click', calculate, false);

function calculate() {

    var elResult = document.getElementById('results');
    var elTotalOptions = document.getElementById('totalOptions');
    var elStrikePrice = document.getElementById('strikePrice');
    var elCurrentPrice = document.getElementById('currentPrice');
    var elTaxRate = document.getElementById('taxRate');

    function error(msg) {
        elResult.innerHTML = '<div class="errorFeedback">' + msg + '</div>';
    }

    if(!elTotalOptions.value) {
        error('You must enter the total number of options.')
        return;
    }

    if(!elStrikePrice.value) {
        error('You must enter the strike price for your options.')
        return;
    }

    if(!elCurrentPrice.value) {
        error('You must enter the current price for your options.')
        return;
    }

    if(!elTaxRate.value) {
        error('You must provide an expected tax rate (percent).')
        return;
    }

    function stockValue(options, strikePrice, stockPrice, taxRate) {
       return ((stockPrice * options) - (strikePrice * options)) *
                    (1 - (taxRate * .01));

    }

    // Go through the already sold form items
    var elOptionQuantities = document.getElementsByClassName('quantity');
    var elOptionPrices = document.getElementsByClassName('price');

    // total shares already sold
    var alreadySoldShares = 0;
    // sum of dollars already earned
    var alreadyDollars = 0;

    for (var i=0; i < elOptionQuantities.length; i++ ) {

        alreadySoldShares += elOptionQuantities[i].value;
        alreadyDollars += stockValue(elOptionQuantities[i].value, elStrikePrice.value,
                                     elOptionPrices[i].value, elTaxRate.value);
    }

    var remainingValue = stockValue(elTotalOptions.value - alreadySoldShares, elStrikePrice.value,
                                    elCurrentPrice.value, elTaxRate.value);


    if (alreadySoldShares === 0) {
        elResult.innerHTML = '<div class="results">' + 'Total Value: ' +
            formatter.format(remainingValue) + '</div>';
    } else {
        elResult.innerHTML = '<div class="results">' + 'Sold value: ' +
            formatter.format(alreadyDollars) + '<br>Remaining Value: ' + formatter.format(remainingValue) +
            '<p><strong>Total Value: ' + formatter.format(alreadyDollars + remainingValue) + '</strong></div>';
    }
}

