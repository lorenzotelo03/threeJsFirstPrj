 <?php

    try {
        $db = new PDO('mysql:host=localhost;dbname=db', 'root', 'root');
    } catch (PDOException $e) {
        print "Error!: " . $e->getMessage() . "<br/>";
        die();
    }

    $userName = $_POST["userName"];
    $password = hash("SHA256",$_POST["password"]);
    $confP = hash("SHA256",$_POST["confPassword"]);

    if(isset($_POST["submit"])){
        if($confP == $password){
            $query = "UPDATE Utenti SET uPassword = '$password' WHERE UserName = '$userName'";
            $stmt = $db->prepare($query);
            $stmt->execute();
            echo "ahhh beh idk controlla stupido gay di <inserisci nome docente>";
            // if (mysqli_query($connection,$query)) {
            //     echo "New record updated successfully";
            //     echo "<div class='form'><h3>Utente già registrato</h3><br/>Click here to <a href='index.html'>Login</a></div>";

            // }else {
            //     echo "Error: " . $query . "<br>" . mysqli_error($conn);
            // }
        }
    }

    /*
    $query = "SELECT * FROM `Utenti` WHERE UserName='$userName'";
    $result = mysqli_query($connection,$query);
    if(mysqli_num_rows($result) > 0){
       $upd = 
    }
    */

 ?>