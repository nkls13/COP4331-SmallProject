
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
		if ($inData["deleteAll"] == true)
		{
			$stmt = $conn->prepare("DELETE FROM Contacts WHERE UserID=?");
            $stmt->bind_param("i", $inData["userId"]);
		    $stmt->execute();
		}
		else
		{
			foreach($inData["ids"] as $id)
			{
				$stmt = $conn->prepare("DELETE FROM Contacts WHERE ID=? AND UserID=?");
				$stmt->bind_param("ii", $id, $inData["userId"]);
				$stmt->execute();
			}
		}
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
