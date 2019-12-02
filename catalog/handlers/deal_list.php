<?php
require __DIR__ . '/../include/header.php';
$options = json_decode($_REQUEST['PLACEMENT_OPTIONS'], true);
?>
<script src="../scripts/deal_list.js"></script>
<div class="deal-wrap">
</div>
<script>
    BX24.init(function () {
        myApp.SETTINGS = BX24.getAuth();
        myApp.getUserDeals(<?=(int)$options['ID']?>);
    })
</script>
<?
require __DIR__ . '/../include/footer.php';