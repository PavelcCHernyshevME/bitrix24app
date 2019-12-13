<?php
function add2log($data) {
    $f = fopen('robot.txt', 'a');
    fwrite($f, '----------------\n');
    fwrite($f, time() . '\n');
    fwrite($f, print_r($data, 1));
    fclose($f);
}
add2log($_REQUEST);