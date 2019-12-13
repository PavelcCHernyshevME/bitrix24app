function createBizProcCont($handler) {
    var $params = {
        'CODE': 'user_contact_deals',
        'HANDLER': $handler,
        'NAME': {
            'ru': 'Информация о сделках контакта пользователя'
        },
        'PROPERTIES': {
            'contactId': {
                'Name': {
                    'ru': 'ID контакта'
                },
                'Type': 'int',
                'Default': null
            }
        },

    'RETURN_PROPERTIES': {
            'countSuccessDeals': {
                'Name': {
                    'ru': 'Кол-во выигранных сделок'
                },
                'Type': 'int',
            },
            'countFailDeals': {
                'Name': {
                    'ru': 'Кол-во проигранных сделок'
                },
                'Type': 'int',
            },
            'countInWorkDeals': {
                'Name': {
                    'ru': 'Кол-во сделок в работе'
                },
                'Type': 'int',
            },
            'sumSuccessDeals': {
                'Name': {
                    'ru': 'Сумма выигранных сделок'
                },
                'Type': 'int',
            },
            'sumNotPaidInvoice': {
                'Name': {
                    'ru': 'Сумма неоплаченных счетов (незакрытые счет)'
                },
                'Type': 'int',
            },
            'sumPaidIncoice': {
                'Name': {
                    'ru': 'Сумма оплачены счетов'
                },
                'Type': 'int',
            },
        }
    };
    BX24.callMethod(
        'bizproc.activity.add',
        $params,
        function ($res) {
            alert('Активити добавлено');
        }
    );
}
