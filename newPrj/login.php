<?php
use \Firebase\JWT\JWT;
session_set_cookie_params(3600);
session_start();
echo "sei dentro";
$connection = mysqli_connect("localhost" , "darkness" , "", "my_darkness");

$userName = $_POST["userName"];
$password = hash("SHA256",$_POST["password"]);

echo $userName . "<br>".$password;

$query = "SELECT * FROM `Utenti` WHERE UserName='$userName' and uPassword ='".$password."'";
$result = mysqli_query($connection,$query);
if(mysqli_num_rows($result) > 0){
    echo "sei dentro";
    if(isset($_POST["remeberMe"])){
        include_once 'php-jwt-master/src/BeforeValidException.php';
        include_once 'php-jwt-master/src/ExpiredException.php';
        include_once 'php-jwt-master/src/SignatureInvalidException.php';
        include_once 'php-jwt-master/src/JWT.php';
        //CHIAVE
        $key = "buona_fortuna";
        //ORARI --> EXP IN 60s
        $issued_at = time();
        $expiration_time = $issued_at + (60 * 60);
        //PAYLOAD
        $payload = array(
            "iat" => $issued_at,
            "exp" => $expiration_time,
            "data" => array(   
                "Utente" => array(
                "UserName" => $userName
                )
            )
        );
        //CREAZIONE JWT
        try{ //OK
            $jwt = JWT::encode($payload, $key,'HS256'); //viene creato il vero e proprio jwt con il contenuto:payload, la chiave di encode, e il tipo di hash per criptarla
            $res=array("responseCode"=>200,"responseText"=>"OK", "status"=>true,"token"=>$jwt); //codice di risposta con status e il token completo che verranno visualizzati dall'utente
            http_response_code(200);
            echo json_encode($res);
        }catch (UnexpectedValueException $e) { //INTERNAL SERVER ERROR
            $res=array("responseCode"=>500,"responseText"=>"Internal Server Error", "text"=>"something went wrong","status"=>false,"error"=>$e->getMessage());   
            http_response_code(500);
            echo json_encode($res);
        }
        setcookie("userCookie", $jwt, time()+3600);  
    }else{ //BAD REQUEST
        $_SESSION["userName"] = $userName;
    }
    header("Location: main.php");
}else{
    echo "dio ca";
}
?>