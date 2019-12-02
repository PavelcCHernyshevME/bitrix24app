function JSTestTask() {
    let $curapp = this;
    $curapp.USER_LIST = [];
    $curapp.USER_LIST_SHORT = [];
}

JSTestTask.prototype.getUserList = function() {
    let $curapp = this;
    BX24.callMethod(
        'user.get',
        {},
        function ($result) {
            if ($result.error()) {
                console.log('Errors ' + $result.error());
            }
            if ($result.data().length) {
                for (let $i = 0; $i < $result.data().length; $i++) {
                    let $userInfo = $result.data()[$i];
                    let $curUser = {
                        'NAME': $userInfo.NAME
                    };
                    $curapp.USER_LIST_SHORT.push($curUser);
                    $curapp.USER_LIST.push($userInfo);
                }
            }
            if ($result.more()) {
                $result.next();
            } else {
                $curapp.buildUserList();
            }
        }
    )
};

JSTestTask.prototype.buildUserList = function() {
    let $curapp = this;
    if ($curapp.USER_LIST.length) {
        let $userContainet = $('#user-wrap');
        $userContainet.html('');
        for (let $i = 0; $i < $curapp.USER_LIST.length; $i++) {
            let $curUser = $curapp.USER_LIST[$i];
            if ($curUser.NAME.length) {
                let $profileImg = $curUser.PERSONAL_PHOTO != null ? $curUser.PERSONAL_PHOTO : "profile.jpg";
                $('<div class="user-list-item" data-user-id="'+$curUser.ID+'"></div>')
                    .text($curUser.NAME + ' ' + $curUser.LAST_NAME + ' ')
                    .append($('<img class="profile-img" alt="profile" src="'+$profileImg+'">'))
                    .appendTo($userContainet);
            }
        }
        $('.user-list-item').on('click', function (event) {
            let $userId = $(event.target).data('user-id');
            $curapp.buildCrmList($userId);
        })
    }
};

JSTestTask.prototype.buildCrmList = function($userId) {
    let $methodsList = {
        'get_leads': {
            method: 'crm.lead.list',
            params: {
                filter: {
                    'ASSIGNED_BY_ID': $userId,
                }
            }
        },
        'get_deals': {
            method: 'crm.deal.list',
            params: {
                filter: {
                    'ASSIGNED_BY_ID': $userId,
                }
            }
        },
        'get_leads_statuses': {
            method: 'crm.status.list',
            params: {
                filter: {
                    'ENTITY_ID': 'STATUS'
                }
            }
        },
        'get_deals_statuses': {
            method: 'crm.status.list',
            params: {
                filter: {
                    'ENTITY_ID': 'DEAL_STAGE'
                }
            }
        }
    };
    BX24.callBatch(
        $methodsList,
        function ($result) {
            let $leadList = $result.get_leads.data();
            let $dealList = $result.get_deals.data();
            let $leadStatuses = $result.get_leads_statuses.data();
            let $dealStatuses = $result.get_deals_statuses.data();

            function buildStatusSelect($stauses, $entityStatusId, $entytId, $class) {
                let $select = $('<select class="'+$class+'" data-entity-id="'+$entytId+'"></select>');
                for (let $i = 0; $i < $stauses.length; $i++) {
                    let $curstatus = $stauses[$i];
                    let $selected = $curstatus.STATUS_ID === $entityStatusId ? 'selected' : '';
                    $select.append(
                        $('<option '+$selected+' value="'+$curstatus.STATUS_ID+'"></option>')
                        .text($curstatus.NAME)
                    );
                }
                return $select;
            }

            let $crmContainer = $('#crm-wrap');
            $crmContainer.html('');

            if ($leadList.length) {
                $('<h4>Лиды</h4>').appendTo($crmContainer);
                for (let $i = 0; $i < $leadList.length; $i++) {
                    let $curlead = $leadList[$i];
                    if ($curlead) {
                        $('<div class="crm-list-item lead-item"></div>')
                            .text('#'+$curlead.ID+' - '+$curlead.TITLE)
                            .append(buildStatusSelect($leadStatuses, $curlead.STATUS_ID, $curlead.ID, 'lead_select'))
                            .appendTo($crmContainer);
                    }
                }
                $('.lead_select').on('change', function ($event) {
                    let option = $($event.target);
                    BX24.callMethod(
                        'crm.lead.update',
                        {
                            id: option.data('entity-id'),
                            fields: {
                                "STATUS_ID": option.val()
                            }
                        },
                        function ($result) {
                            if ($result.error()) {
                                console.log('Errors ' + $result.error());
                            }
                        }
                    );
                });
            } else {
                $('<h4>Лиды отсутствуют</h4>').appendTo($crmContainer);
            }
            if ($dealList.length) {
                $('<h4>Сделки</h4>').appendTo($crmContainer);

                for (let $i = 0; $i < $dealList.length; $i++) {
                    let $curdeal = $dealList[$i];
                    if ($curdeal) {
                        $('<div class="crm-list-item deal-item"></div>')
                            .text('#'+$curdeal.ID+' - '+$curdeal.TITLE)
                            .append(buildStatusSelect($dealStatuses, $curdeal.STAGE_ID, $curdeal.ID, 'deal_select'))
                            .appendTo($crmContainer);
                    }
                }
                $('.deal_select').on('change', function ($event) {
                    let option = $($event.target);
                    BX24.callMethod(
                        'crm.deal.update',
                        {
                            id: option.data('entity-id'),
                            fields: {
                                "STAGE_ID": option.val()
                            }
                        },
                        function ($result) {
                            if ($result.error()) {
                                console.log('Errors ' + $result.error());
                            }
                        }
                    );
                });
            } else {
                $('<h4>Сделки отсутствуют</h4>').appendTo($crmContainer);
            }
        }
    )
};

let myApp = new JSTestTask();