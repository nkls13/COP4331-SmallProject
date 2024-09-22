<?php
	if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
		header("HTTP/1.1 200 OK");
		exit();
	}
	$inData = getRequestInfo();
	
    $id = $inData["id"];
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
		$stmt = $conn->prepare("UPDATE Contacts SET FirstName=?, LastName=?, Phone=?, Email=?, Favorites=? WHERE ID=? AND UserId=?");
		$stmt->bind_param("ssssiii", $firstName, $lastName, $phone, $email, $favorite, $id, $userId);
		$stmt->execute();

        returnWithError(""); // Return no error to indicate success

		$stmt->close();
		$conn->close();
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
