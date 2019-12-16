<?php
function add2log($data) {
    $f = fopen('robot.txt', 'a');
    fwrite($f, '----------------\n');
    fwrite($f, time() . '\n');
    fwrite($f, print_r($data, 1));
    fclose($f);
}
add2log($_REQUEST);
try {
    function send2b24($domen, $method, $data, $log = false)
    {
        $res = [];
        do {
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
            $querryResponce = json_decode(curl_exec($curl), true);
            if ($log) {
                add2log($querryResponce);
            }
            $res['result'] = array_merge((array)$res['result'], $querryResponce['result']);
            $hasNext = $querryResponce['next'] > 0;
            if ($hasNext && $querryResponce['next'] < $querryResponce['total']) {
                $params['start'] = $querryResponce['next'];
            } else {
                $hasNext = false;
            }
        } while ($hasNext);
        return $res;
    }

        $name = $_REQUEST['properties']['name'];
        $group_type = $_REQUEST['group_type'];
        $group_head = $_REQUEST['group_head'];
        $group_moderator_list = $_REQUEST['group_moderator_list'];
        $isProject = $group_type == 'project';
        $isOpen = $group_type == 'group_out';
        $arFields = [
            'auth' => [
                'member_id' => $_REQUEST['auth']['member_id'],
                'application_token' => $_REQUEST['auth']['application_token']
            ],
            'event_token' => $_REQUEST['event_token'],
            'NAME' => $name,
            'DESCRIPTION' => '',
            'KEYWORDS' => '',
            'INITIATE_PERMS' => 'E',
            'PROJECT' => $isProject ? 'Y' : 'N',
            'VISIBLE' => 'Y',
            'OPENED' => $isOpen ? 'Y' : 'N',
            'CLOSED' => 'N',
            'SPAM_PERMS' => 'SONET_ROLES_MODERATOR',
        ];
        $domen = $_REQUEST['auth']['domain'];
        $res = send2b24($domen, 'sonet_group.create', $arFields, true);
        add2log($res);
} catch (Throwable $t) {
    add2log($t->getMessage() . $t->getTraceAsString());
}
