<?php
session_start();
$code = "";
if(isset($_GET['code'],$_GET['state'])){
    $code = $_GET['code'];
    $state = $_GET['state'];
    if($state != $_SESSION['state']){
        echo "stato incorretto, riesegui la procedura";
        session_destroy();
        return;
    }

    $post = new stdClass;
    $post->grant_type = "authorization_code";
    $post->code = $code;
    $post->redirect_uri = "https://darkness.altervista.org/index.php";//
    $post->client_id = "1dff1a78ea86d14f89c7373e750e88ff";
    $post->client_secret = "1999663d0a43e91f82c8d0a21b943460ae91e429418b1a4e5764d4e27cadf3f2382862cb61fca33b3c7d0fc68c071dcd52c64ab8d45c140738fd3c6d709f7de8";

    $curl = curl_init();
    curl_setopt_array($curl, [
        CURLOPT_URL => "https://id.paleo.bg.it/oauth/token", 
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "POST",
        CURLOPT_POSTFIELDS => json_encode($post),
        CURLOPT_HTTPHEADER => [
            "Content-Type: application/json"
        ],
    ]);

    $response = curl_exec($curl);
    $err = curl_error($curl);

    curl_close($curl);

    if ($err) {
        echo "cURL Error #:".$err;
    } else {
        $obj = json_decode($response);
        $token = $obj->{'access_token'}; 
        $curl = curl_init();

        curl_setopt_array($curl, [
            CURLOPT_URL => "https://id.paleo.bg.it/api/v2/user",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "GET",
            CURLOPT_HTTPHEADER => [
                "Authorization: Bearer ".$token,    
                "Content-Type: application/json"
            ],
        ]);

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            echo "cURL Error #:" . $err;
        } else {
            $user = json_decode($response);
            echo "benvenuto ".$user->{'cognome'}." ".$user->{'nome'}."<br>";
        }
    }

}else{
    $random_string = md5(uniqid(rand(), true));
    $_SESSION['state'] = $random_string;
    header("Location: https://id.paleo.bg.it/oauth/authorize?client_id=2be8b2c150b15de38bce39d3a63794b8&response_type=code&state=$random_string&redirect_uri=https://darkness.altervista.org/index.php");
}
?> 