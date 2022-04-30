<?php
use \Firebase\JWT\JWT;
session_set_cookie_params(3600);
session_start();
include_once 'php-jwt-master/src/BeforeValidException.php';
include_once 'php-jwt-master/src/ExpiredException.php';
include_once 'php-jwt-master/src/SignatureInvalidException.php';
include_once 'php-jwt-master/src/JWT.php';

if(isset($_COOKIE["userCookie"])){
//se ha accettato il remberMe
    header('Content-Type: application/json');
     //CHIAVE
     $key = "buona_fortuna";
     //PARAMETRO
     $jwt = $_COOKIE["userCookie"];
     try {
         // decode jwt
         $decoded = JWT::decode($jwt, $key, array('HS256')); 
         http_response_code(200);
         echo json_encode($decoded->data);
     }
     // if decode fails, it means jwt is invalid
     catch (Exception $e){
         // set response code
         http_response_code(401);
         // show error message
         echo json_encode(array(
             "message" => "Access denied.",
             "error" => $e->getMessage()
         ));
     }
}else{
//se è salvato solo in sessione

}


?>