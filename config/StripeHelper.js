const toFixed = require('tofixed');
const constants = require('./constants');
const fs = require('fs');

"use strict";

const stripe = require("stripe")(
   // "sk_test_4a57vt9tMTRhuJ4KQnx6hLTP"
);

module.exports = function() {
    var StripeHelper = {
        // add bank account
        addBank: function(add_option, callback) {
            if (add_option.id_proof_name != '') {
                var fp = fs.readFileSync(constants.ROOT_PATH + "uploads/idproof/" + add_option.id_proof_name);
                stripe.fileUploads.create({
                    purpose: 'dispute_evidence',
                    file: {
                        data: fp,
                        name: 'file.jpg',
                        type: 'application/octet-stream'
                    },
                    purpose: 'identity_document',
                }, function(err, fileUpload) {
                    if (fileUpload) {
                        stripe.accounts.create({
                            type: 'custom',
                            country: 'US',
                            email: add_option.email,
                            legal_entity: {
                                type: 'individual',
                                first_name: add_option.first_name,
                                last_name: add_option.last_name,
                                ssn_last_4: add_option.ssn_last_4,
                                dob: {
                                    day: add_option.day,
                                    month: add_option.month,
                                    year: add_option.year
                                },
                                address: {
                                    city: add_option.city,
                                    country: add_option.country,
                                    state: add_option.state,
                                    postal_code: add_option.postal_code,
                                    line1: add_option.line1,
                                    line2: add_option.line2,
                                    postal_code: add_option.postal_code,
                                },
                                verification: {
                                    document: fileUpload.id
                                }
                            },
                            external_account: {
                                object: 'bank_account',
                                bank_name: add_option.bank_name,
                                account_number: add_option.account_number,
                                routing_number: add_option.routing_number,
                                country: 'US',
                                currency: 'usd',
                                account_holder_name: add_option.account_holder_name,
                                account_type: 'individual',
                            },
                            tos_acceptance: {
                                date: Math.floor(Date.now() / 1000),
                                ip: add_option.ip_address // Assumes you're not using a proxy
                            }
                        }, function(err, account) {
                            console.log('add bank error' + err);
                            if (account) {
                                var response = {
                                    status: 1,
                                    result: account
                                };
                                callback(response);
                            } else {
                                var errorResponse = {
                                    status: 0,
                                    msg: err.message
                                };
                                callback(errorResponse);
                            }
                        });
                    } else {
                        var errorResponse = {
                            status: 0,
                            msg: err.message
                        };
                        callback(errorResponse);
                    }
                });
            } else {
                stripe.accounts.create({
                    type: 'custom',
                    country: 'US',
                    name: add_option.account_holder_name,
                    email: add_option.email,
                    first_name: add_option.first_name,
                    last_name: add_option.last_name,
                    legal_entity: {
                        type: 'individual',
                        ssn_last_4: add_option.ssn_last_4,
                        first_name: add_option.first_name,
                        last_name: add_option.last_name,
                        dob: {
                            day: add_option.day,
                            month: add_option.month,
                            year: add_option.year
                        },
                        address: {
                            city: add_option.city,
                            country: add_option.country,
                            state: add_option.state,
                            postal_code: add_option.postal_code,
                            line1: add_option.line1,
                            line2: add_option.line2,
                            postal_code: add_option.postal_code,
                        },
                        verification: {
                            document: fileUpload.id
                        }
                    },
                    external_account: {
                        object: 'bank_account',
                        bank_name: add_option.bank_name,
                        account_number: add_option.account_number,
                        routing_number: add_option.routing_number,
                        country: 'US',
                        currency: 'usd',
                        account_holder_name: add_option.account_holder_name,
                        account_type: 'individual',
                    },
                    tos_acceptance: {
                        date: Math.floor(Date.now() / 1000),
                        ip: add_option.ip_address // Assumes you're not using a proxy
                    }
                }, function(err, account) {
                    if (account) {
                        var response = {
                            status: 1,
                            result: account
                        };
                        callback(response);
                    } else {
                        var errorResponse = {
                            status: 0,
                            msg: err.message
                        };
                        callback(errorResponse);
                    }
                });
            }
        },

        // update bank account
        updateBank: function(update_option, callback) {
            if (update_option.id_proof_name != '') {
                var fp = fs.readFileSync(constants.ROOT_PATH + "uploads/idproof/" + update_option.id_proof_name);
                stripe.fileUploads.create({
                    purpose: 'dispute_evidence',
                    file: {
                        data: fp,
                        name: 'file.jpg',
                        type: 'application/octet-stream'
                    },
                    purpose: 'identity_document',
                }, function(err, fileUpload) {
                    if (fileUpload) {
                        stripe.accounts.update(update_option.account_id, {
                            email: update_option.email,
                            legal_entity: {
                                type: 'individual',
                                first_name: update_option.first_name,
                                last_name: update_option.last_name,
                                ssn_last_4: update_option.ssn_last_4,
                                dob: {
                                    day: update_option.day,
                                    month: update_option.month,
                                    year: update_option.year
                                },
                                address: {
                                    city: update_option.city,
                                    country: update_option.country,
                                    state: update_option.state,
                                    line1: update_option.line1,
                                    line2: update_option.line2,
                                    postal_code: update_option.postal_code,
                                },
                                verification: {
                                    document: fileUpload.id
                                }
                            },
                            external_account: {
                                object: 'bank_account',
                                bank_name: update_option.bank_name,
                                account_number: update_option.account_number,
                                routing_number: update_option.routing_number,
                                country: 'US',
                                currency: 'usd',
                                account_holder_name: update_option.account_holder_name,
                                account_type: 'individual',
                            },
                            tos_acceptance: {
                                date: Math.floor(Date.now() / 1000),
                                ip: update_option.ip_address // Assumes you're not using a proxy
                            }
                        }, function(err, account) {
                            if (account) {
                                var response = {
                                    status: 1,
                                    result: account
                                };
                                callback(response);
                            } else {
                                var errorResponse = {
                                    status: 0,
                                    msg: err.message
                                };
                                callback(errorResponse);
                            }
                        });
                    } else {
                        var errorResponse = {
                            status: 0,
                            msg: err.message
                        };
                        callback(errorResponse);
                    }
                });
            } else {
                if (update_option.ssn_last_4 != '') {
                    var send_data = {
                        email: update_option.email,
                        legal_entity: {
                            type: 'individual',
                            first_name: update_option.first_name,
                            last_name: update_option.last_name,
                            ssn_last_4: update_option.ssn_last_4,
                            dob: {
                                day: update_option.day,
                                month: update_option.month,
                                year: update_option.year
                            },
                            address: {
                                city: update_option.city,
                                country: update_option.country,
                                state: update_option.state,
                                line1: update_option.line1,
                                line2: update_option.line2,
                                postal_code: update_option.postal_code,
                            }


                        },
                        external_account: {
                            object: 'bank_account',
                            bank_name: update_option.bank_name,
                            account_number: update_option.account_number,
                            routing_number: update_option.routing_number,
                            country: 'US',
                            currency: 'usd',
                            account_holder_name: update_option.account_holder_name,
                            account_type: 'individual',
                        },
                        tos_acceptance: {
                            date: Math.floor(Date.now() / 1000),
                            ip: add_option.ip_address // Assumes you're not using a proxy
                        }
                    }

                } else {
                    var send_data = {
                        email: update_option.email,
                        external_account: {
                            object: 'bank_account',
                            bank_name: update_option.bank_name,
                            account_number: update_option.account_number,
                            routing_number: update_option.routing_number,
                            country: 'US',
                            currency: 'usd',
                            account_holder_name: update_option.account_holder_name,
                            account_type: 'individual',
                        }

                    }
                }
                console.log(send_data)
                stripe.accounts.update(update_option.account_id, send_data, function(err, account) {
                    // console.log('update bank error' + err);
                    if (account) {
                        var response = {
                            status: 1,
                            result: account
                        };
                        callback(response);
                    } else {
                        var errorResponse = {
                            status: 0,
                            msg: err.message
                        };
                        callback(errorResponse);
                    }
                });
            }
        },

        addCard: function(add_option, callback) {
            var add_card_responce = {};
            stripe.tokens.create({
                card: {
                    "number": add_option.card_number,
                    "exp_month": add_option.month,
                    "exp_year": add_option.year,
                    "cvc": add_option.cvc,
                    "name": add_option.holder_name
                }
            }, function(err, token) {
                //got toekn then add to user account
                if (token) {
                    add_card_responce = {
                        'card_id': token.card.id,
                        'card_brand': token.card.brand,
                        'card_last4': token.card.last4,
                        'exp_month': token.card.exp_month,
                    };
                    stripe.customers.createSource(
                        add_option.userSripeId, {
                            source: token.id
                        },
                        function(err, card) {
                            if (card) {
                                console.log(card);
                                var response = {
                                    status: 1,
                                    result: card
                                };
                                callback(response);
                            } else {
                                var error_response = {
                                    status: 0,
                                    message: err.message
                                };
                                callback(error_response);
                            }
                        }
                    );
                } else {
                    var response = {
                        status: 0,
                        message: err.message
                    };
                    callback(response);;
                }
            });
        },

        addCustomer: function(add_option, callback) {
            // console.log(add_option.email);
            stripe.customers.create({
                email: add_option.email,
                //	  source: "tok_visa" // obtained with Stripe.js
            }, function(err, customer) {
                if (customer) {
                    console.log(customer);
                    var response = {
                        status: 1,
                        result: customer
                    };
                    callback(response);
                    //callback(customer.id);
                } else {
                    var response = {
                        status: 0,
                        message: err.message
                    };
                    callback(response);;
                }
            });
        },

        // add bank account
        // addCustomer: function(add_option, callback) {
        //     stripe.customers.create({
        //         email: add_option.email,
        //         //	  source: "tok_visa" // obtained with Stripe.js
        //     }, function(err, customer) {
        //         console.log('tt');
        //         if (customer) {
        //             var response = {
        //                 status: 1,
        //                 result: customer
        //             };
        //             callback(response);
        //         } else {
        //             var error_response = {
        //                 status: 0,
        //                 message: err.message
        //             };
        //             callback(error_response);
        //         }
        //     });
        // },

        deleteCard: function(delete_option, callback) {

            console.log(delete_option.stripe_id + "============")
            console.log(delete_option.card_id + '--------')

            stripe.customers.deleteCard(delete_option.stripe_id, delete_option.card_id, function(err, confirmation) {
                if (confirmation) {
                    var response = {
                        status: 1,
                        result: confirmation
                    };
                    callback(response);
                } else {
                    var error_response = {
                        status: 0,
                        message: err.message
                    };
                    callback(error_response);
                }
            });
        },

        // card list 
        cardList: function(list_option, callback) {
            stripe.customers.listCards(list_option.userSripeId, function(err, cards) {
                if (cards) {
                    callback(cards);
                } else {
                    var error_response = {
                        status: 0
                    };
                    callback(error_response);
                }
            });
        },

        // Make charge
        makeCharge: function(apnOption, callback) {
            console.log(apnOption)
            var ammount = apnOption.amount * 100;
            ammount = toFixed(ammount, 2)
            stripe.charges.create({
                "amount": parseFloat(ammount), // amount in cent
                "currency": "usd",
                "customer": apnOption.customer_id,
                "card": apnOption.card_id,
                "capture": false
                    //	  source: "tok_visa" // obtained with Stripe.js
            }, function(err, result) {
                if (result) {
                    var response = {
                        status: 1,
                        data: result
                    };
                    callback(response);
                } else {
                    var errorResponse = {
                        status: 0,
                        message: err.message
                    };
                    callback(errorResponse);
                }
            });
        },



        updateCharge: function(apnOption, callback) {
            console.log(JSON.stringify(apnOption) + '++++++++++++++++=')
            var provider_amount = apnOption.provider_amount * 100;
            provider_amount = toFixed(provider_amount, 2);
            stripe.charges.update(
                apnOption.charge_id, {
                    destination: {
                        amount: parseFloat(provider_amount),
                        account: apnOption.account_id,
                    },
                },
                function(err, charge) {
                    if (charge) {
                        var response = {
                            status: 1,
                            data: charge
                        };
                        callback(response);
                    } else {
                        var errorResponse = {
                            status: 0,
                            message: err.message
                        };
                        callback(errorResponse);
                    }
                }
            );
        },

        createCharge: function(apnOption, callback) {
            var provider_amount = apnOption.provider_amount * 100;
            provider_amount = toFixed(provider_amount, 2);
            stripe.transfers.create({
                amount: parseFloat(provider_amount),
                currency: "usd",
                source_transaction: apnOption.charge_id,
                destination: apnOption.account_id,
            }, (function(err, transfer) {

                if (transfer) {
                    var response = {
                        status: 1,
                        data: transfer
                    };
                    callback(response);
                } else {
                    var errorResponse = {
                        status: 0,
                        message: err.message
                    };
                    callback(errorResponse);
                }
            }));
        },

        // during confirm job
        destinationCharge: function(apnOption, callback) {
            console.log(apnOption);
            apnOption.amount = toFixed(apnOption.amount, 2)
            stripe.charges.create({
                amount: parseFloat(apnOption.amount),
                currency: "usd",
                card: apnOption.card_id,
                customer: apnOption.customer_id,
                transfer_group: apnOption.transfer_group,
            }, function(err, charge) {
                if (charge) {
                    var response = {
                        status: 1,
                        data: charge
                    };
                    callback(response);
                } else {
                    var errorResponse = {
                        status: 0,
                        message: err.message
                    };
                    callback(errorResponse);
                }
            });
        },

        // during transfer charge
        transferCharge: function(apnOption, callback) {
            var provider_amount = apnOption.amount * 100;
            console.log(provider_amount+'----------')
            provider_amount = toFixed(provider_amount, 2);
             console.log(provider_amount+'----nelow------')
            stripe.transfers.create({
                amount: parseFloat(provider_amount),
                currency: "usd",
                destination: apnOption.account_id,
            }, function(err, transfer) {
                console.log(transfer);
                if (transfer) {
                    var response = {
                        status: 1,
                        data: transfer
                    };
                    callback(response);
                } else {
                    var errorResponse = {
                        status: 0,
                        message: err.message
                    };
                    callback(errorResponse);
                }
            });
        },


        capureCharge: function(apnOption, callback) {
            stripe.charges.capture(apnOption.charge_id, function(err, charge) {
                // asynchronously called
                if (charge) {
                    var response = {
                        status: 1,
                        data: charge
                    };
                    callback(response);
                } else {
                    var errorResponse = {
                        status: 0,
                        message: err.message
                    };
                    callback(errorResponse);
                }
            });
        },

        retrievAccount: function(apnOption, callback) {
            stripe.accounts.retrieve(apnOption.account_id, function(err, response) {
                // asynchronously called
                if (response) {
                    console.log(response.legal_entity.verification);
                    console.log("-----------------");
                    if (response.legal_entity.verification.status != undefined && response.legal_entity.verification.status == 'verified') {
                        var verified_status = 1;
                    } else {
                        var verified_status = 0;
                    }
                    var responseData = {
                        status: 1,
                        verified_status: verified_status
                    };
                    console.log(responseData)
                    console.log("---========================-----------")
                    callback(responseData);
                } else {
                    var errorResponse = {
                        status: 0,
                        message: err.message
                    };
                    callback(errorResponse);
                }
            });
        },

        refundCharge: function(apnOption, callback) {
            console.log(apnOption)
            stripe.refunds.create({
                charge: apnOption.charge_id,
                amount: apnOption.amount
            }, function(err, refund) {
                if (refund) {
                    console.log(refund);
                    var response = {
                        status: 1,
                        data: refund
                    };
                    callback(response);
                } else {
                    console.log(err.message);
                    var errorResponse = {
                        status: 0,
                        message: err.message
                    };
                    callback(errorResponse);
                }
            });
        },
    }
    return StripeHelper;
}