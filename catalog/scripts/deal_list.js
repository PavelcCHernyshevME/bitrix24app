function JSApp() {
    let $curapp = this;
    $curapp.DEAL_LIST = [];
}

JSApp.prototype.getUserDeals = function($contactId) {
    let $curapp = this;
    BX24.callMethod(
        "crm.deal.list",
        {
            filter: {
                'CONTACT_ID': $contactId
            }
        },
        function ($result) {
            if ($result.error()) {
                console.log('Errors ' + $result.error());
            }
            if ($result.data().length) {
                for (let $i = 0; $i < $result.data().length; $i++) {
                    let $dealInfo = $result.data()[$i];
                    $curapp.DEAL_LIST.push($dealInfo);
                }
            }
            if ($result.more()) {
                $result.next();
            } else {
                $curapp.buildDealList();
            }
        }
    );
};

JSApp.prototype.buildDealList = function() {
    let contentTable = $('<table><tr><th>Id</th><th>Title</th><th>Opportunity</th></tr></table>');
    let curApp = this;
    for (let i = 0; i < curApp.DEAL_LIST.length; i++) {
        let curDeal = curApp.DEAL_LIST[i];
        $('<tr>' +
            '<td>'+curDeal.ID+'</td>' +
            '<td>'+curDeal.TITLE+'</td>' +
            '<td>'+curDeal.OPPORTUNITY+'</td>' +
        '</tr>').appendTo(contentTable);
    }
    let conteiner = $('.deal-wrap');
    contentTable.appendTo(conteiner);
};

let myApp = new JSApp();