<?
    $host = $_SERVER['HTTP_HOST'];
    define('BP_HANDLER', 'https://'. $host. '/company_deals/company_deals.php')
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
    <script src="//api.bitrix24.com/api/v1/"></script>
    <script src="company_deals.js"></script>
    <title>Title</title>
</head>
<body>
    <h1>Новое активити</h1>
    <script>
        BX24.init(function () {
            createBizProcComp('<?= BP_HANDLER?>');
        });
    </script>
</body>
</html>
