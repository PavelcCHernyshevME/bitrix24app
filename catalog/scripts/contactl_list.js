function JSApp() {
    let $curapp = this;
    $curapp.CONTACT_ID_LIST = [];
    $curapp.CONTACT_LIST = [];
    $curapp.CONTACT_DEAL_OPP_SUM = new Map();
}

JSApp.prototype.buildContactList = function() {
    let $curapp = this;
    let container = $('.contact-wrap');
    for (let i = 0; i < $curapp.CONTACT_LIST.length; i++) {
        let curContact = $curapp.CONTACT_LIST[i];
        $('<div>'+curContact.NAME+' | '+$curapp.CONTACT_DEAL_OPP_SUM.get(curContact.ID)+'</div>')
            .appendTo(container);
    }
};

JSApp.prototype.getContactOpportunity = function($contactIdList) {
    let $curapp = this;
    BX24.callMethod(
        "crm.deal.list",
        {
            filter: {
                'CONTACT_ID': $contactIdList
            }
        },
        function ($result) {
            if ($result.error()) {
                console.log('Errors ' + $result.error());
            }
            if ($result.data().length) {
                for (let $i = 0; $i < $result.data().length; $i++) {
                    let $dealInfo = $result.data()[$i];
                    let opp = Number($dealInfo.OPPORTUNITY);
                    let existOpp = Number($curapp.CONTACT_DEAL_OPP_SUM.get($dealInfo.CONTACT_ID));
                    if (existOpp > 0) {
                        opp += Number(existOpp);
                    }
                    $curapp.CONTACT_DEAL_OPP_SUM.set($dealInfo.CONTACT_ID, opp);
                }
            }
            if ($result.more()) {
                $result.next();
            } else {
                $curapp.buildContactList();
            }
        }
    );
};

JSApp.prototype.getContactList = function(contactIdList) {
    let $curapp = this;
    BX24.callMethod(
        "crm.contact.list",
        {
            filter: {
                'ID': contactIdList
            }
        },
        function ($result) {
            if ($result.error()) {
                console.log('Errors ' + $result.error());
            }
            if ($result.data().length) {
                for (let $i = 0; $i < $result.data().length; $i++) {
                    let contactInfo = $result.data()[$i];
                    $curapp.CONTACT_LIST.push(contactInfo);
                }
            }
            if ($result.more()) {
                $result.next();
            } else {
                $curapp.getContactOpportunity(contactIdList);
            }
        }
    );
};

JSApp.prototype.getCompanyContactList = function(companyId) {
    let $curapp = this;
    BX24.callMethod(
        "crm.company.contact.items.get",
        {
            'id': companyId
        },
        function ($result) {
            if ($result.error()) {
                console.log('Errors ' + $result.error());
            }
            if ($result.data().length) {
                for (let $i = 0; $i < $result.data().length; $i++) {
                    let contactInfo = $result.data()[$i];
                    $curapp.CONTACT_ID_LIST.push(contactInfo.CONTACT_ID);
                }
            }
            if ($result.more()) {
                $result.next();
            } else {
                $curapp.getContactList($curapp.CONTACT_ID_LIST);
            }
        }
    );
};

let myApp = new JSApp();