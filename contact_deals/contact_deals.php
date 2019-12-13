<?php

function add2log($data) {
    $f = fopen('log.txt', 'a');
    fwrite($f, '----------------\n');
    fwrite($f, time() . '\n');
    fwrite($f, print_r($data, 1));
    fclose($f);
}
try {
    function send2b24($domen, $method, $data, $log = false)
    {
        $url = 'https://' . $domen . '/rest/' . $method;
        $fields = http_build_query($data);
        $curl = curl_init();
        curl_setopt_array($curl, [
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_POST => true,
            CURLOPT_HEADER => false,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_URL => $url,
            CURLOPT_POSTFIELDS => $fields,
        ]);
        $response = json_decode(curl_exec($curl), true);
        if ($log) {
            add2log($response);
        }
        return $response;
    }
    if (($contactId = $_REQUEST['properties']['contactId']) > 0) {

        $arParams = [
            'auth' => $_REQUEST['auth']['access_token'],
            'event_token' => $_REQUEST['event_token'],
            'filter' => [
                'CONTACT_ID' => $contactId,
            ],
            'select' => [
                'ID',
                'STAGE_ID',
                'CLOSED',
                'OPPORTUNITY'
            ]
        ];

        $data = send2b24($_REQUEST['auth']['domain'], 'crm.deal.list', $arParams, true);

        $countSuccessDeals = 0;
        $countFailDeals = 0;
        $countInWorkDeals = 0;
        $sumSuccessDeals = 0;

        foreach ($data['result'] as $dealInfo) {
            $closed = $dealInfo['CLOSED'] == 'Y';
            $won = $dealInfo['STAGE_ID'] == 'WON';
            if (!$closed) {
                $countInWorkDeals++;
            } elseif ($closed && $won) {
                $countSuccessDeals++;
                $sumSuccessDeals += $dealInfo['OPPORTUNITY'];
            } elseif ($closed && !$won) {
                $countFailDeals++;
            }
        }

        $arParams = [
            'auth' => $_REQUEST['auth']['access_token'],
            'event_token' => $_REQUEST['event_token'],
            'filter' => [
                'UF_CONTACT_ID' => $contactId,
            ],
            'select' => [
                'PAYED',
                'PRICE'
            ]
        ];
        
        $data = send2b24($_REQUEST['auth']['domain'], 'crm.invoice.list', $arParams, true);
        $sumNotPaidInvoice = 0;
        $sumPaidIncoice = 0;
        foreach ($data['result'] as $item) {
            if ($item['PAYED'] == 'Y') {
                $sumPaidIncoice += $item['PRICE'];
            } else {
                $sumNotPaidInvoice += $item['PRICE'];
            }
        }

        $arSend = [
            'EVENT_TOKEN' => $_REQUEST['event_token'],
            'auth' => $_REQUEST['auth']['access_token'],
            'RETURN_VALUES' => [
                'countSuccessDeals' => $countSuccessDeals,
                'countFailDeals' => $countFailDeals,
                'countInWorkDeals' => $countInWorkDeals,
                'sumSuccessDeals' => $sumSuccessDeals,
                'sumNotPaidInvoice' => $sumNotPaidInvoice,
                'sumPaidIncoice' => $sumPaidIncoice,
            ]
        ];
        send2b24($_REQUEST['auth']['domain'], 'bizproc.event.send', $arSend);
    }
} catch (Throwable $t) {
    add2log($t->getMessage());
}
