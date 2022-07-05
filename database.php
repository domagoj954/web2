<?php
function f_get_database(){
    $db = new mysqli(DB_SERVER,DB_USER,DB_PASS,DB_NAME);
    if($db->connect_errno){
        throw new Exception("Neuspješna konekcija na bazu");
    }
    $db->set_charset("utf8");
    return $db;
}

//funkcija za provjeru logina
function f_login($db, $in_obj){
    $sql = 'SELECT * FROM fanovi WHERE EMAIL =\'' . $in_obj->username . "' AND PASSWORD=" . $in_obj->password ;
    $rows=[];  
    $result = $db->query($sql);
    while($row = mysqli_fetch_assoc($result)) {
        $rows[]=$row;
    }

    if (!empty($rows)){
        $_SESSION = $rows[0];
        echo json_encode($rows);
    }else{
        global $wrong_login;
        echo $wrong_login;
    }
}


// ************** funkcije za fanove************/////
//dohvacanje fanova
function f_get_fanovi($db, $in_obj){ 
    $offset = $in_obj->page*($in_obj->page-1);
    if (isset($in_obj->ID)){
        $sql = "SELECT * FROM fanovi where ID = " . $in_obj->ID;
    }else{
       $offset = $in_obj->page*($in_obj->page-1);
       $sql = "SELECT * FROM fanovi WHERE DELETED= 0 LIMIT $in_obj->perPage OFFSET $offset";
       $output['count'] = f_get_count($db, "SELECT count(1) from fanovi");
    }
    $output['data'] = f_get_rows($db, $sql);
    echo json_encode($output);   
}


function f_get_count($db, $sql){
    $result = $db->query($sql);
    $row = mysqli_fetch_assoc($result);
    return $row['count(1)'];
}

function f_get_rows($db, $sql){
    $db->set_charset("utf8");    
    $result = $db->query($sql);
    $rows=[];
    while($row = mysqli_fetch_assoc($result)) {
        $rows[]=$row;
    }    
    return $rows; 
}


function f_save_fanovi($db, $in_obj){ 
    global $insert_error;
    global $insert_pass;
    global $update_error; 
    global $update_pass;

    $poruka = f_kontrole_fanovi($in_obj);

    if (isset($poruka)){
        echo $poruka;
        return;
    }

    if (isset($in_obj->ID)){
        $sql = "UPDATE fanovi SET "
          . "IME = '" . $in_obj->IME ."', "
          . "PREZIME = '" . $in_obj->PREZIME ."', "
          . "JMBAG = " . $in_obj->JMBAG .", "
          . "EMAIL = '" . $in_obj->EMAIL ."', "
          . "SPOL = " . $in_obj->SPOL .", "
          . "OVLASTI = " . $in_obj->OVLASTI .", "
          . "IDklub = " . $in_obj->IDklub .""
          ." WHERE ID ="  . $in_obj->ID;

        $db->set_charset("utf8");
        if ($db->query($sql) === TRUE) {
            echo $update_pass;
        }else{
            echo $update_error;   
        }
    
    }else{
        $sql = "INSERT INTO fanovi (IME, PREZIME, JMBAG, EMAIL, SPOL, OVLASTI, IDklub, DELETED) VALUES "
	      . "( " 
	      . "'". $in_obj->IME . "'" . "," 
	      . "'". $in_obj->PREZIME . "'" . "," 
          .  $in_obj->JMBAG  . ","
	      . "'". $in_obj->EMAIL . "'" . "," 
	      .  $in_obj->SPOL  . ","
          .  $in_obj->OVLASTI  . ","
          .  $in_obj->IDklub  . ","
          .  0 . ","
          .")"; 
           //echo $sql;

          $db->set_charset("utf8");
          if ($db->query($sql) === TRUE) {
              echo $insert_pass;
          }else{
              echo $insert_error;   
          } 
    }
}

function f_delete_fanovi($db, $in_obj){
    global $delete_error;
    global $delete_pass;
 
    if(isset($in_obj->ACTION)){
     if($in_obj->ACTION = "delete"){
         $sql = "DELETE from fanovi WHERE ID = " . $in_obj->ID;
         if ($db->query($sql) === TRUE) {
             echo $delete_pass;
         }else{
             echo $delete_error;   
         } 
     }
 }else{
     if(isset($poruka)){
         echo $poruka;
         return;
 
    $sql = "UPDATE fanovi SET "
           . "DELETED = 1,"  
           . "WHERE ID = "  . $in_obj->ID;
 
    if ($db->query($sql) === TRUE) {
        echo $delete_pass;
    }else{
        echo $delete_error;   
    } 
 
  }
 }
 }

 function f_kontrole_fanovi($in_obj){
    if($in_obj->IME == "" || $in_obj->IME == NULL){
        return '{"h_message":"Ime ne može biti prazno!","h_errcode":876}';
    }
    if($in_obj->PREZIME == "" || $in_obj->PREZIME == NULL){
        return '{"h_message":"Prezime ne može biti prazno!","h_errcode":876}';
    }
    if($in_obj->JMBAG == "" || $in_obj->JMBAG == NULL){
        return '{"h_message":"JMBAG ne može biti prazan!","h_errcode":876}';
    }
    if($in_obj->EMAIL == "" || $in_obj->EMAIL == NULL){
        return '{"h_message":"Email ne može biti prazan!","h_errcode":876}';
    }
    if($in_obj->SPOL == "" || $in_obj->SPOL == NULL){
        return '{"h_message":"Spol ne može biti prazan!","h_errcode":876}';
    }
    if($in_obj->OVLASTI == "" || $in_obj->OVLASTI == NULL){
        return '{"h_message":"Ovlasti ne mogu biti prazne!","h_errcode":876}';
    }
    if($in_obj->IDklub == "" || $in_obj->IDklub == NULL){
        return '{"h_message":"IDklub ne može biti prazan!","h_errcode":876}';
    }
}



//************funkcije za klubove ********* */

function f_get_klubovi($db, $in_obj){ 
    $offset = $in_obj->page*($in_obj->page-1);
    if (isset($in_obj->ID)){
        $sql = "SELECT * FROM klubovi where ID = " . $in_obj->ID;
    }else{
       $offset = $in_obj->page*($in_obj->page-1);
       $sql = "SELECT * FROM klubovi WHERE DELETED= 0 LIMIT $in_obj->perPage OFFSET $offset";
       $output['count'] = f_get_count($db, "SELECT count(1) from klubovi");
    }
    $output['data'] = f_get_rows($db, $sql);
    echo json_encode($output);   
}

function f_save_klubovi($db, $in_obj){ 
    global $insert_error_klub;
    global $insert_pass_klub;
    global $update_error_klub; 
    global $update_pass_klub;

    $poruka = f_kontrole_klubovi($in_obj);

    if (isset($poruka)){
        echo $poruka;
        return;
    }

    if (isset($in_obj->ID)){
        $sql = "UPDATE klubovi SET "
          . "KLUB = '" . $in_obj->KLUB ."'"   /////nema zareza između zadnjih navodnih znakova
          . "WHERE ID = "  . $in_obj->ID;

        $db->set_charset("utf8");
        if ($db->query($sql) === TRUE) {
            echo $update_pass_klub;
        }else{
           //echo $update_error_klub;
            echo $sql;
        } 

    }else{
        $sql = "INSERT INTO klubovi (KLUB,  DELETED) VALUES "
	      . "( " 
	      . "'". $in_obj->KLUB . "'" .  ","
          .  0 . 
          ")"; 
           echo $sql;

          $db->set_charset("utf8");
          if ($db->query($sql) === TRUE) {
              echo $insert_pass_klub;
          }else{
              echo $insert_error_klub;   
          } 
    }
}

function f_delete_klubovi($db, $in_obj){
   global $delete_error_klub;
   global $delete_pass;

   
   if(isset($in_obj->ACTION)){
    if($in_obj->ACTION = "delete"){
        $sql = "DELETE from klubovi WHERE ID = " . $in_obj->ID;
        if ($db->query($sql) === TRUE) {
            echo $delete_pass;
        }else{
            echo $delete_error_klub;   
        } 
    }
}else{
    if(isset($poruka)){
        echo $poruka;
        return;

   $sql = "UPDATE fanovi SET "
          . "DELETED = 1,"  
          . "WHERE ID = "  . $in_obj->ID;

   if ($db->query($sql) === TRUE) {
       echo $delete_pass;
   }else{
       echo $delete_error_klub;   
   } 

 }
}
}

function f_kontrole_klubovi($in_obj){
        
}

//*********************** funkcije za igrace ************************** */

function f_get_igraci($db, $in_obj){ 
    $offset = $in_obj->page*($in_obj->page-1);
    if (isset($in_obj->ID)){
        $sql = "SELECT * FROM igraci where ID = " . $in_obj->ID;
    }else{
       $offset = $in_obj->page*($in_obj->page-1);
       $sql = "SELECT * FROM igraci WHERE DELETED= 0 LIMIT $in_obj->perPage OFFSET $offset";
       $output['count'] = f_get_count($db, "SELECT count(1) from igraci");
    }
    $output['data'] = f_get_rows($db, $sql);
    echo json_encode($output);   
}

function f_save_igraci($db, $in_obj){ 
    global $insert_error;
    global $insert_pass;
    global $update_error; 
    global $update_pass;

    $poruka = f_kontrole_igraci($in_obj);

    if (isset($poruka)){
        echo $poruka;
        return;
    }

    if (isset($in_obj->ID)){
        $sql = "UPDATE igraci SET "
          . "IDklub = '" . $in_obj->IDklub ."', "
          . "IDtrener = '" . $in_obj->IDtrener ."', "
          . "IDlige = '" . $in_obj->IDlige ."', "
          . "IME = '" . $in_obj->IME ."', "
          . "PREZIME = '" . $in_obj->PREZIME ."', "
          . "NACIONALNOST = '" . $in_obj->NACIONALNOST ."', "
          . "GODINE = '" . $in_obj->GODINE ."', "
          . "POZICIJA = '" . $in_obj->POZICIJA ."', "
          . "BROJ = '" . $in_obj->BROJ ."', "
          . "BROJ_GOLOVA = '" . $in_obj->BROJ_GOLOVA ."', "
          . "ODIGRANIH_UTAKMICA = '" . $in_obj->ODIGRANIH_UTAKMICA ."', "
          . "VRIJEDNOST = '" . $in_obj->VRIJEDNOST ."'"
          . "WHERE ID = "  . $in_obj->ID;

        $db->set_charset("utf8");
        if ($db->query($sql) === TRUE) {
            echo $update_pass;
        }else{
            echo $update_error;   
        } 
    }else{
        $sql = "INSERT INTO igraci (IDklub, IDtrener, IDlige, IME, PREZIME, NACIONALNOST, GODINE, POZICIJA, BROJ, BROJ_GOLOVA, ODIGRANIH_UTAKMICA, VRIJEDNOST, DELETED) VALUES "
	      . "( " 
          .  $in_obj->IDklub  . ","
          .  $in_obj->IDtrener  . ","
          .  $in_obj->IDlige  . ","
	      . "'". $in_obj->IME . "'" . "," 
          . "'". $in_obj->PREZIME . "'" . "," 
          . "'". $in_obj->NACIONALNOST . "'" . "," 
          .  $in_obj->GODINE  . ","
          . "'". $in_obj->POZICIJA . "'" . ","
          .  $in_obj->BROJ  . ","
          .  $in_obj->BROJ_GOLOVA  . ","
          .  $in_obj->ODIGRANIH_UTAKMICA  . ","
          .  $in_obj->VRIJEDNOST  . ","
          .  $in_obj->DELETED  . ","
          .")"; 
           //echo $sql;

          $db->set_charset("utf8");
          if ($db->query($sql) === TRUE) {
              echo $insert_pass;
          }else{
              echo $insert_error;   
          } 
    }
}

function f_delete_igraci($db, $in_obj){
   global $delete_error;
   global $delete_pass;

   if(isset($in_obj->ACTION)){
    if($in_obj->ACTION = "delete"){
        $sql = "DELETE from igraci WHERE ID = " . $in_obj->ID;
        if ($db->query($sql) === TRUE) {
            echo $delete_pass;
        }else{
            echo $delete_error;   
        } 
    }
}else{
    if(isset($poruka)){
        echo $poruka;
        return;

   $sql = "UPDATE igraci SET "
          . "DELETED = 1,"  
          . "WHERE ID = "  . $in_obj->ID;

   if ($db->query($sql) === TRUE) {
       echo $delete_pass;
   }else{
       echo $delete_error;   
   } 

 }
}
}
function f_kontrole_igraci($in_obj){
        
}



//*********************** funkcije za trenere ************************** */

function f_get_treneri($db, $in_obj){ 
    $offset = $in_obj->page*($in_obj->page-1);
    if (isset($in_obj->ID)){
        $sql = "SELECT * FROM treneri where ID = " . $in_obj->ID;
    }else{
       $offset = $in_obj->page*($in_obj->page-1);
       $sql = "SELECT * FROM treneri WHERE DELETED= 0 LIMIT $in_obj->perPage OFFSET $offset";
       $output['count'] = f_get_count($db, "SELECT count(1) from treneri");
    }
    $output['data'] = f_get_rows($db, $sql);
    echo json_encode($output);   
}

function f_save_treneri($db, $in_obj){ 
    global $insert_error;
    global $insert_pass;
    global $update_error; 
    global $update_pass;

    $poruka = f_kontrole_treneri($in_obj);

    if (isset($poruka)){
        echo $poruka;
        return;
    }

    if (isset($in_obj->ID)){
        $sql = "UPDATE treneri SET "
          . "IDklub = '" . $in_obj->IDklub ."', "
          . "IDlige = '" . $in_obj->IDlige ."', "
          . "IME = '" . $in_obj->IME ."', "
          . "PREZIME = '" . $in_obj->PREZIME ."', "
          . "GODINE = '" . $in_obj->GODINE ."', "
          . "NACIONALNOST = '" . $in_obj->NACIONALNOST ."', "
          . "WHERE ID = "  . $in_obj->ID;

        $db->set_charset("utf8");
        if ($db->query($sql) === TRUE) {
            echo $update_pass;
        }else{
            echo $update_error;   
        } 
    }else{
        $sql = "INSERT INTO treneri (IDklub, IDlige, IME, PREZIME, GODINE, NACIONALNOST, DELETED) VALUES "
	      . "( " 
          .  $in_obj->IDklub  . ","
          .  $in_obj->IDlige  . ","
	      . "'". $in_obj->IME . "'" . "," 
          . "'". $in_obj->PREZIME . "'" . "," 
          .  $in_obj->GODINE  . ","
          . "'". $in_obj->NACIONALNOST . "'" . "," 
          .  $in_obj->DELETED  . ","
          .")"; 
           //echo $sql;

          $db->set_charset("utf8");
          if ($db->query($sql) === TRUE) {
              echo $insert_pass;
          }else{
              echo $insert_error;   
          } 
    }
}

function f_delete_treneri($db, $in_obj){
   global $delete_error;
   global $delete_pass;

   if(isset($in_obj->ACTION)){
    if($in_obj->ACTION = "delete"){
        $sql = "DELETE from treneri WHERE ID = " . $in_obj->ID;
        if ($db->query($sql) === TRUE) {
            echo $delete_pass;
        }else{
            echo $delete_error;   
        } 
    }
}else{
    if(isset($poruka)){
        echo $poruka;
        return;

   $sql = "UPDATE treneri SET "
          . "DELETED = 1,"  
          . "WHERE ID = "  . $in_obj->ID;

   if ($db->query($sql) === TRUE) {
       echo $delete_pass;
   }else{
       echo $delete_error;   
   } 

 }
}
}
function f_kontrole_treneri($in_obj){
        
}

//*********************** funkcije za predsjednika ************************** */


function f_get_predsjednik($db, $in_obj){ 
    $offset = $in_obj->page*($in_obj->page-1);
    if (isset($in_obj->ID)){
        $sql = "SELECT * FROM predsjednik where ID = " . $in_obj->ID;
    }else{
       $offset = $in_obj->page*($in_obj->page-1);
       $sql = "SELECT * FROM predsjednik WHERE DELETED= 0 LIMIT $in_obj->perPage OFFSET $offset";
       $output['count'] = f_get_count($db, "SELECT count(1) from predsjednik");
    }
    $output['data'] = f_get_rows($db, $sql);
    echo json_encode($output);   
}

function f_save_predsjednik($db, $in_obj){ 
    global $insert_error;
    global $insert_pass;
    global $update_error; 
    global $update_pass;

    $poruka = f_kontrole_predsjednik($in_obj);

    if (isset($poruka)){
        echo $poruka;
        return;
    }

    if (isset($in_obj->ID)){
        $sql = "UPDATE predsjednik SET "
        . "IME = '" . $in_obj->IME ."', "
        . "PREZIME = '" . $in_obj->PREZIME ."', "
        . "IDklub = '" . $in_obj->IDklub ."', "
        . "WHERE ID = "  . $in_obj->ID;

        $db->set_charset("utf8");
        if ($db->query($sql) === TRUE) {
            echo $update_pass;
        }else{
            echo $update_error;   
        } 
    }else{
        $sql = "INSERT INTO predsjednik (IDklub, IME, PREZIME, DELETED) VALUES "
	      . "( " 
	      . "'". $in_obj->IME . "'" . "," 
          . "'". $in_obj->PREZIME . "'" . "," 
          .  $in_obj->IDklub  . ","
          .  $in_obj->DELETED  . ","
          .")"; 
           //echo $sql;

          $db->set_charset("utf8");
          if ($db->query($sql) === TRUE) {
              echo $insert_pass;
          }else{
              echo $insert_error;   
          } 
    }
}

function f_delete_predsjednik($db, $in_obj){
   global $delete_error;
   global $delete_pass;

   if(isset($in_obj->ACTION)){
    if($in_obj->ACTION = "delete"){
        $sql = "DELETE from predsjednik WHERE ID = " . $in_obj->ID;
        if ($db->query($sql) === TRUE) {
            echo $delete_pass;
        }else{
            echo $delete_error;   
        } 
    }
}else{
    if(isset($poruka)){
        echo $poruka;
        return;

   $sql = "UPDATE predsjednik SET "
          . "DELETED = 1,"  
          . "WHERE ID = "  . $in_obj->ID;

   if ($db->query($sql) === TRUE) {
       echo $delete_pass;
   }else{
       echo $delete_error;   
   } 

 }
}
}
function f_kontrole_predsjednik($in_obj){
        
}



//*********************** funkcije za stadion************************** */
function f_get_stadion($db, $in_obj){ 
    $offset = $in_obj->page*($in_obj->page-1);
    if (isset($in_obj->ID)){
        $sql = "SELECT * FROM stadion where ID = " . $in_obj->ID;
    }else{
       $offset = $in_obj->page*($in_obj->page-1);
       $sql = "SELECT * FROM stadion WHERE DELETED= 0 LIMIT $in_obj->perPage OFFSET $offset";
       $output['count'] = f_get_count($db, "SELECT count(1) from stadion");
    }
    $output['data'] = f_get_rows($db, $sql);
    echo json_encode($output);   
}

function f_save_stadion($db, $in_obj){ 
    global $insert_error;
    global $insert_pass;
    global $update_error; 
    global $update_pass;

    $poruka = f_kontrole_stadion($in_obj);

    if (isset($poruka)){
        echo $poruka;
        return;
    }

    if (isset($in_obj->ID)){
        $sql = "UPDATE stadion SET "
        . "IDklub = '" . $in_obj->IDklub ."', "
        . "IME = '" . $in_obj->IME ."', "
        . "KAPACITET = '" . $in_obj->KAPACITET ."', "
        . "ADRESA = '" . $in_obj->IDklub ."', ";

        $db->set_charset("utf8");
        if ($db->query($sql) === TRUE) {
            echo $update_pass;
        }else{
            echo $update_error;   
        } 
    }else{
        $sql = "INSERT INTO stadion (IDklub, IME, KAPACITET, DELETED) VALUES "
	      . "( " 
          .  $in_obj->IDklub  . ","
	      . "'". $in_obj->IME . "'" . "," 
          .  $in_obj->KAPACITET  . ","
          .  $in_obj->DELETED  . ","
          .")"; 
           //echo $sql;

          $db->set_charset("utf8");
          if ($db->query($sql) === TRUE) {
              echo $insert_pass;
          }else{
              echo $insert_error;   
          } 
    }
}

function f_delete_stadion($db, $in_obj){
   global $delete_error;
   global $delete_pass;

   if(isset($in_obj->ACTION)){
    if($in_obj->ACTION = "delete"){
        $sql = "DELETE from stadion WHERE ID = " . $in_obj->ID;
        if ($db->query($sql) === TRUE) {
            echo $delete_pass;
        }else{
            echo $delete_error;   
        } 
    }
}else{
    if(isset($poruka)){
        echo $poruka;
        return;

   $sql = "UPDATE stadion SET "
          . "DELETED = 1,"  
          . "WHERE ID = "  . $in_obj->ID;

   if ($db->query($sql) === TRUE) {
       echo $delete_pass;
   }else{
       echo $delete_error;   
   } 

 }
}
}
function f_kontrole_stadion($in_obj){
        
}


//*********************** funkcije za lige ************************** */


function f_get_liga($db, $in_obj){ 
    $offset = $in_obj->page*($in_obj->page-1);
    if (isset($in_obj->ID)){
        $sql = "SELECT * FROM liga where ID = " . $in_obj->ID;
    }else{
       $offset = $in_obj->page*($in_obj->page-1);
       $sql = "SELECT * FROM liga WHERE DELETED= 0 LIMIT $in_obj->perPage OFFSET $offset";
       $output['count'] = f_get_count($db, "SELECT count(1) from liga");
    }
    $output['data'] = f_get_rows($db, $sql);
    echo json_encode($output);   
}

function f_save_liga($db, $in_obj){ 
    global $insert_error;
    global $insert_pass;
    global $update_error; 
    global $update_pass;

    $poruka = f_kontrole_liga($in_obj);

    if (isset($poruka)){
        echo $poruka;
        return;
    }
    
   if(isset($in_obj->ACTION)){
    if($in_obj->ACTION = "edit"){

    if (isset($in_obj->ID)){
        $sql = "UPDATE liga SET "
          . "IDklub = '" . $in_obj->IDklub ."', "
          . "IDlige = '" . $in_obj->IDlige ."', "
          . "IME = '" . $in_obj->IME ."', "
          . "PREZIME = '" . $in_obj->PREZIME ."', "
          . "GODINE = '" . $in_obj->GODINE ."', "
          . "NACIONALNOST = '" . $in_obj->NACIONALNOST ."', "
          . "WHERE ID = "  . $in_obj->ID;

        $db->set_charset("utf8");
        if ($db->query($sql) === TRUE) {
            echo $update_pass;
        }else{
            echo $update_error;   
        } }}
    }else{
        $sql = "INSERT INTO liga (IDklub, IDlige, IME, PREZIME, GODINE, NACIONALNOST, DELETED) VALUES "
	      . "( " 
          .  $in_obj->IDklub  . ","
          .  $in_obj->IDlige  . ","
	      . "'". $in_obj->IME . "'" . "," 
          . "'". $in_obj->PREZIME . "'" . "," 
          .  $in_obj->GODINE  . ","
          . "'". $in_obj->NACIONALNOST . "'" . "," 
          .  $in_obj->DELETED  . ","
          .")"; 
           //echo $sql;

          $db->set_charset("utf8");
          if ($db->query($sql) === TRUE) {
              echo $insert_pass;
          }else{
              echo $insert_error;   
          } 
    }
}

function f_delete_liga($db, $in_obj){
   global $delete_error;
   global $delete_pass;

   if(isset($in_obj->ACTION)){
    if($in_obj->ACTION = "delete"){
        $sql = "DELETE from liga WHERE ID = " . $in_obj->ID;
        if ($db->query($sql) === TRUE) {
            echo $delete_pass;
        }else{
            echo $delete_error;   
        } 
    }
}else{
    if(isset($poruka)){
        echo $poruka;
        return;

   $sql = "UPDATE liga SET "
          . "DELETED = 1,"  
          . "WHERE ID = "  . $in_obj->ID;

   if ($db->query($sql) === TRUE) {
       echo $delete_pass;
   }else{
       echo $delete_error;   
   } 

 }
}
}
function f_kontrole_liga($in_obj){
        
}

?>