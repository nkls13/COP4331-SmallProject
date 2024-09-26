
<?php
	if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
		header("HTTP/1.1 200 OK");
		exit();
	}
	$inData = getRequestInfo();

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331"); 	
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{   
		$stmt = $conn->prepare("DELETE FROM Contacts WHERE ID=? AND UserID=?");
		$stmt->bind_param("ii", $inData["id"], $inData["userId"]);
		$stmt->execute();

        returnWithError("");

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
