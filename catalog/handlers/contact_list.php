<?php
require __DIR__ . '/../include/header.php';
$options = json_decode($_REQUEST['PLACEMENT_OPTIONS'], true);
?>
    <script src="../scripts/contactl_list.js"></script>
    <div class="contact-wrap">
    </div>
    <script>
        BX24.init(function () {
            myApp.SETTINGS = BX24.getAuth();
            myApp.getCompanyContactList(<?=(int)$options['ID']?>);
        })
    </script>
<?
require __DIR__ . '/../include/footer.php';