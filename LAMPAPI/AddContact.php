<?php

	if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
		header("HTTP/1.1 200 OK");
		exit();
	}
	$inData = getRequestInfo();
	
	$firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
    $phone = $inData["phone"];
    $email = $inData["email"];
	$userId = $inData["userId"];
	$favorite = $inData["favorite"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		//first make sure userID contact getting added EXISTS
		$stmt = $conn->prepare("SELECT ID FROM Users WHERE ID = ?");
		$stmt->bind_param("i", $userId);
		$stmt->execute();
		$result = $stmt->get_result();

		if ($result->num_rows == 0) {
			$stmt->close();
			$conn->close();
			returnWithError("User does not exist");
			
		}

		$stmt = $conn->prepare("INSERT into Contacts (FirstName, LastName, Phone, Email, UserID, Favorites) VALUES(?,?,?,?, ?, ?)");
		$stmt->bind_param("ssssii", $firstName, $lastName, $phone, $email, $userId, $favorite);
		$stmt->execute();
		$stmt->close();
		$conn->close();
		returnWithError("");
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
?>