<?php


  $foo = file_get_contents("php://input");

var_dump(json_decode($foo, true));

  $admin_email = "gruby20@hotmail.com";
  $email = "web@miagrill.com";
  $subject = "ORDER REQUEST"
$message = "Results: " . print_r( $foo, true );
  
  //send email
  mail($admin_email, $subject, $message, "From:" . $email);
  
  //Email response
  echo "Thank you for contacting us!";

  
?>
