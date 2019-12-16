function robote($handler) {
    var $params = {
        'CODE': 'robot5',
        'AUTH_USER_ID': 1,
        'HANDLER': $handler,
        'NAME': 'РОБОТ v5',
        'PROPERTIES': {
            'name': {
                'Name': {
                    'ru': 'Имя группы'
                },
                'Type': 'string',
                'Default': null,
                'Description': 'описание',
                'Required': 'N',
                'Multiple': 'N',
            },
            'group_type': {
                'Name': {
                    'ru': 'Тип группы'
                },
                'Type': 'select',
                'Options': {
                    'project': 'проект',
                    'group_out': 'группа внешняя',
                    'group_inner': 'группа внутренняя',
                },
                'Default': null
            },
            'group_head': {
                'Name': {
                    'ru': 'Руководитель'
                },
                'Type': 'user',
                'Default': null
            },
            'group_moderator_list': {
                'Name': {
                    'ru': 'Модераторы'
                },
                'Type': 'user',
                'Default': null,
                'Multiple': 'Y'
            },
        },
        'RETURN_PROPERTIES': {
            'groupId': {
                'Name': {
                    'ru': 'Идентификатор созданной группы'
                },
                'Type': 'int',
                'Default': null,
                'Description': 'описание',
                'Required': 'N',
                'Multiple': 'N',
            },
        }
    };
    BX24.callMethod(
        'bizproc.robot.add',
        $params,
        function (result) {
            if(result.error())
                alert("Error: " + result.error());
            else
                alert("Успешно: " + result.data());
        }
    );
}