﻿// Stripe Card Details form

var stripeResponseHandler = function (status, response) {
    var $form = $('#card-form');

    if (response.error) {
        // Show the errors on the form
        $form.find('.payment-errors').text(response.error.message);
        $form.find('button').prop('disabled', false);

        $form.find('#CreditCard_CardNumber').addClass('input-validation-error');
        $form.find('#CreditCard_ExpirationMonth').addClass('input-validation-error');
        $form.find('#CreditCard_ExpirationYear').addClass('input-validation-error');
        $form.find('#CreditCard_Cvc').addClass('input-validation-error');

    } else {
        // token contains id, last4, and card type
        var token = response.id;

        // Insert the token into the form so it gets submitted to the server
        $form.append($('<input type="hidden" name="CreditCard.StripeToken" />').val(token));

        if (typeof response.card !== 'undefined') {
            $form.append($('<input type="hidden" name="CreditCard.Type" />').val(response.card.type));
            $form.append($('<input type="hidden" name="CreditCard.Last4" />').val(response.card.last4));
            $form.append($('<input type="hidden" name="CreditCard.StripeId" />').val(response.card.id));
            $form.append($('<input type="hidden" name="CreditCard.Fingerprint" />').val(response.card.fingerprint));
            $form.append($('<input type="hidden" name="CreditCard.CardNumber" />').val(response.card.fingerprint));
        }

        // Remove CardNumber field from form
        var $card = $form.find('#CreditCard_CardNumber');
        $card.removeAttr('name');
        $card.removeAttr('id');

        // and re-submit
        $form.get(0).submit();
    }
};

jQuery(function ($) {

    var stripeKey = $('#stripe-publishable-key').val();
    Stripe.setPublishableKey($('#stripe-publishable-key').val());

    $('#card-form').submit(function (e) {
        var $form = $(this);

        // Disable the submit button to prevent repeated clicks
        $form.find('button').prop('disabled', true);

        Stripe.card.createToken($form, stripeResponseHandler);

        // Prevent the form from submitting with the default action
        return false;
    });
});
