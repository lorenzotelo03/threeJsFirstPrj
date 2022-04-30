<?php 


    if(isset($_POST["submit"])){
        $connection = mysqli_connect("localhost" , "darkness" , "", "my_darkness");
        $email = $_POST["email"];
        $userName = $_POST["userName"];
        $password = hash("SHA256",$_POST["password"]);
        echo "$userName";
        $query = "SELECT * FROM `Utenti` WHERE UserName='$userName' and Email ='$email'";
        $result = mysqli_query($connection,$query);
        if(mysqli_num_rows($result) > 0){
            echo "<div class='form'><h3>Utente già registrato</h3><br/>Click here to <a href='index.html'>Login</a></div>";
        }else{
            $sql = "INSERT INTO Utenti (Email,UserName, uPassword) VALUES ('".$email."', '".$userName."', '".$password."');";
            if (mysqli_query($connection,$sql)) {
                echo "New record created successfully";
            } else {
                echo "Error: " . $sql . "<br>" . mysqli_error($conn);
            }
        
        }
    }

?>
