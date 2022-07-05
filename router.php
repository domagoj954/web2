<?php 
error_reporting(E_ERROR | E_PARSE);
header('Access-Control-Allow-Origin:http://localhost');
header('Access-Control-Allow-Credentials: true');
require_once('db_credential.php');
require_once('database.php');
require_once('poruke.php');
?>
<?php

session_start(); 

//dozvoljavam samo POST i GET metodu u svakom slučaju prepunjava se $injson varijabla
switch ($_SERVER['REQUEST_METHOD']) {
    case 'POST':
        $injson = json_encode($_POST);
        break;
    case 'GET':
        $injson = json_encode($_GET);
        break;
    default:
        echo $request_err;
        return;
}

$in_obj = json_decode($injson);

//provjera podataka koji su došli s inputa
//print_r($in_obj);

//logout, pozivam prije konekcije na bazu jer je ne trebam, radim samo sa SESSIONom na serveru
if($in_obj->procedura =="p_logout"){
    session_destroy();
    echo $logout;
    return; 
}
//ako session nije kreiran samo p_login mogu zvati
if (!isset( $_SESSION['ID']) && $in_obj->procedura !="p_login") {
       echo $login_err;
       return; 
}

//refresh, vraćam podatke iz SESSIONa i to napravim prije konekcije na bazu, ne treba mi baza za ovo
if (isset($_SESSION['ID']) && $in_obj->procedura == "p_refresh") {
    echo json_encode($_SESSION);
    return; 
}

//konekcija na bazu
try{
    $db = f_get_database();
 }catch (Exception $e){
    echo $database_error;
    return;
 }

//raspoređujem pozive prema funkcijama
switch ($in_obj->procedura) {
    case 'p_login':
        f_login($db, $in_obj);
        break;


    case 'p_get_fanovi':
        f_get_fanovi($db, $in_obj);
        break;
    case 'p_save_fanovi':
        f_save_fanovi($db, $in_obj);
        break;
    case 'p_delete_fanovi':
        f_delete_fanovi($db, $in_obj);
        break;


    case 'p_get_klubovi':
        f_get_klubovi($db, $in_obj);
        break;
    case 'p_save_klubovi':
        f_save_klubovi($db, $in_obj);
        break;
    case 'p_delete_klubovi':
        f_delete_klubovi($db, $in_obj);
        break;


    case 'p_get_igraci':
        f_get_igraci($db, $in_obj);
        break;
    case 'p_save_igraci':
        f_save_igraci($db, $in_obj);
        break;
    case 'p_delete_igraci':
        f_delete_igraci($db, $in_obj);
        break;


    case 'p_get_treneri':
        f_get_treneri($db, $in_obj);
        break;
    case 'p_save_treneri':
        f_save_treneri($db, $in_obj);
        break;
    case 'p_delete_treneri':
        f_delete_treneri($db, $in_obj);
        break;


    case 'p_get_predsjednik':
        f_get_predsjednik($db, $in_obj);
        break;
    case 'p_save_predsjednik':
        f_save_predsjednik($db, $in_obj);
        break;
   /* case 'p_save_predsjednik':
        f_delete_predsjednik($db, $in_obj);
        break;*/

    case 'p_get_stadion':
        f_get_stadion($db, $in_obj);
        break;
    case 'p_save_stadion':
        f_save_stadion($db, $in_obj);
        break;
    /* case 'p_save_predsjednik':
        f_delete_stadion($db, $in_obj);
        break;*/

    case 'p_get_liga':
        f_get_liga($db, $in_obj);
        break;
    case 'p_save_liga':
        f_save_liga($db, $in_obj);
        break;
    case 'p_delete_liga':
        f_delete_liga($db, $in_obj);
        break;
   
    


    default:
    echo $request_err;
    return;

}

?>