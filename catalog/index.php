<?php
require ('include/header.php');
$host = $_SERVER['HTTP_HOST'];
$handlerDir = '/catalog/handlers';
$placementList = [
    [
        'PLACEMENT' => 'CRM_CONTACT_LIST_MENU',
        'TITLE' => 'Приложение для контакта',
        'MENU_TITLE' => 'Список сделок контакта',
        'HANDLER' => 'https://' . $host . $handlerDir . '/deal_list.php'
    ],
    [
        'PLACEMENT' => 'CRM_COMPANY_DETAIL_TAB',
        'TITLE' => 'Приложение для компании',
        'MENU_TITLE' => 'Список контактов компании',
        'HANDLER' => 'https://' . $host . $handlerDir . '/contact_list.php'
    ],
];
?>

<script src="https://api.bitrix24.com/api/v1/"></script>
<h1>
    Приложение
</h1>

<ul>
    <?foreach ($placementList as $placement):?>
        <li onclick="BX24.callMethod('placement.bind', {
            PLACEMENT: '<?=$placement['PLACEMENT']?>',
            HANDLER: '<?=$placement['HANDLER']?>',
            TITLE: '<?=$placement['MENU_TITLE']?>',
        })"><?=$placement['TITLE'];?></li>
    <?endforeach;?>
</ul>
<?
require ('include/footer.php');