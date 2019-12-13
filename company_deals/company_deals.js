function createBizProcComp($handler) {
    var $params = {
        'CODE': 'company_deals',
        'HANDLER': $handler,
        'NAME': {
            'ru': 'Информация о сделках компании'
        },
        'PROPERTIES': {
            'idCompany': {
                'Name': {
                    'ru': 'ID компании'
                },
                'Type': 'int',
                'Default': null
            }
        },
        'RETURN_PROPERTIES': {
            'countAllDeals': {
                'Name': {
                    'ru': 'Общее кол-во'
                },
                'Type': 'int',
            },
            'sumSuccessDeals': {
                'Name': {
                    'ru': 'Сумма успешно закрытых'
                },
                'Type': 'int',
            },
            'countFailDeals': {
                'Name': {
                    'ru': 'Кол-во проваленых'
                },
                'Type': 'int',
            },
            'countInWorkDeals': {
                'Name': {
                    'ru': 'Кол-во в работе'
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
