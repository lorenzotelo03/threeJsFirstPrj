<?php
if(isset($_POST["submit"])){
    $to      = $_POST['email'];
    $subject = 'Cambiamento Password';
    $message = "qui ti lasciamo il link per cambiare la tua password: https://darkness.altervista.org/ArchExam/updatePass.html ";
    $headers = array(
        'From' => 'webmaster@example.com',
        'Reply-To' => 'webmaster@example.com',
        'X-Mailer' => 'PHP/' . phpversion()
    );

    mail($to, $subject, $message, $headers);
    echo "email inviata";
}
?>