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
    if (($companyId = $_REQUEST['properties']['idCompany']) > 0) {
        $arSend = [
            'EVENT_TOKEN' => $_REQUEST['event_token'],
            'auth' => $_REQUEST['auth']['access_token'],
            'RETURN_VALUES' => [
                'countAllDeals' => 1,
                'sumSuccessDeals' => 1,
                'countFailDeals' => 3,
                'countInWorkDeals' => 1,
            ]
        ];
        $arParams = [
            'auth' => $_REQUEST['auth']['access_token'],
            'event_token' => $_REQUEST['event_token'],
            'filter' => [
                //'COMPANY_ID' => $companyId,
            ],
            'select' => [/*
                'ID',
                'STAGE_ID',
                'CLOSED',
                'OPPORTUNITY'*/
            ]
        ];

        $data = send2b24($_REQUEST['auth']['domain'], 'crm.deal.list', $arParams, true);
        $res = send2b24($_REQUEST['auth']['domain'], 'bizproc.event.send', $arSend, true);
    }
} catch (Throwable $t) {
    add2log($t->getMessage());
}
