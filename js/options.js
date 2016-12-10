// convert number to currency
var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
});

function stockValue(options, strikePrice, stockPrice, taxRate) {
    return ((stockPrice * options) - (strikePrice * options)) *
        (1 - (taxRate * .01));
}

// when someone clicks on plus sign to add shares that
// have already been sold we give them input boxes.
$('.addSold').on('click', addSoldInput);

// appends the form items to the already sold portion of the page
function addSoldInput() {
    var soldRow = '<div class="sold-row">Quantity: <input type="text" class="quantity"> ' +
                  'Price: <input type="text" class="price">&nbsp;' +
                  '<img class="delete" src="images/red-x.gif"><br></div>';

    $('#soldForm').append(soldRow);

    // gives us the ability to remove the row later by clicking on the red x
    var $delete = $('.delete');
    $delete.on('click', function () {
        $(this).parent().remove();
    })
}

function calcAlreadySold(strikePrice, taxRate) {
    var $quantities = $('.quantity');
    var alreadySoldShares = 0;
    var alreadySoldValue = 0;

    // if we have input elements for options already sold
    if($quantities.length) {
        for (var i = 0; i < $quantities.length; i++) {
            var quantitySold = parseFloat($quantities.eq(i).val());
            var soldValue = parseFloat($('.price').eq(i).val());
            alreadySoldValue += stockValue(quantitySold, strikePrice, soldValue, taxRate);
            alreadySoldShares += quantitySold;
        }
    }

    return [alreadySoldShares, alreadySoldValue];
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

    // contains total number of shares already sold [0] and their value [1]
    var alreadySold = calcAlreadySold($strikePrice.val(), $taxRate.val());

    var remainingValue = stockValue($totalOptions.val() - alreadySold[0], $strikePrice.val(),
        $currentPrice.val(), $taxRate.val());

    // if we haven't already sold any shares
    if (alreadySold[0] === 0) {
        $results.html('<div class="results">' + 'Total Value: ' +
                      formatter.format(remainingValue) + '</div>');
    } else {
        $results.html('<div class="results">' +
                      'Sold value: ' + formatter.format(alreadySold[1]) +
                      '<br>Remaining Value: ' + formatter.format(remainingValue) +
                      '<p><strong>Total Value: ' + formatter.format(alreadySold[1] + remainingValue) +
                      '</strong></div>');
    }
}

$('#cash').on('click', getPrice);

$('#test').html('russ');

function setPrice(data) {
    $('#currentPrice').val(data.l);
    if (data.c < 0) {
        $('#currentPrice').after('&nbsp;<img src="images/red-down.png" height="15" width="20" />');
    } else {
        $('#currentPrice').after('&nbsp;<img src="images/green-up.png" height="15" width="20"/>');
    }
}

function getPrice() {
    $.getJSON("/stock", function (data) {
        setPrice(data);
    });
}
