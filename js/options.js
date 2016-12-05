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
$('#addSold').on('click', addSoldInput);

// appends the form items to the already sold portion of the page
function addSoldInput() {
    var soldRow = 'Quantity: <input type="text" class="quantity"> ' +
                  'Price: <input type="text" class="price"><br>';

    $('#soldForm').append(soldRow);
}

// attach event handler to calculate "button"
$('.calculate').on('click', calculate);

function calculate() {

    var $totalOptions = $('#totalOptions');
    var $strikePrice = $('#strikePrice');
    var $currentPrice = $('#currentPrice');
    var $taxRate = $('#taxRate');
    var $results = $('#results');

    function error(msg) {
        $results.html('<div class="errorFeedback">' + msg + '</div>');
    }

    if(!$.isNumeric($totalOptions.val())) {
        error('You must enter the total number of options.');
        return;
    }

    if(!$.isNumeric($strikePrice.val())) {
        error('You must enter the strike price for your options.');
        return;
    }

    if(!$.isNumeric($currentPrice.val())) {
        error('You must enter the current price for your options.');
        return;
    }

    if(!$.isNumeric($taxRate.val())) {
        error('You must provide an expected tax rate (percent).');
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
        alreadyDollars += stockValue(elOptionQuantities[i].value, $strikePrice.val(),
                                     elOptionPrices[i].value, $taxRate.val());
    }

    var remainingValue = stockValue($totalOptions.val() - alreadySoldShares, $strikePrice.val(),
                                    $currentPrice.val(), $taxRate.val());


    if (alreadySoldShares === 0) {
        $results.html('<div class="results">' + 'Total Value: ' +
            formatter.format(remainingValue) + '</div>');
    } else {
        $results.html('<div class="results">' + 'Sold value: ' +
            formatter.format(alreadyDollars) + '<br>Remaining Value: ' + formatter.format(remainingValue) +
            '<p><strong>Total Value: ' + formatter.format(alreadyDollars + remainingValue) + '</strong></div>');
    }
}

