<?php
	if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
		header("HTTP/1.1 200 OK");
		exit();
	}
	$inData = getRequestInfo();
	
	// I want an object array
	$searchResults = [];
	$searchCount = 0;

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{   
        // Like searches for Partial Matches
		$stmt = $conn->prepare("SELECT ID, FirstName, LastName, Phone, Email FROM Contacts WHERE (FirstName LIKE ? OR LastName LIKE ? OR Phone LIKE ? OR Email LIKE ?) AND UserId=?");
		
        // The % allows for different characters before or after the search term
		$searchTerm = "%" . $inData["searchTerm"] . "%";

		// Binding the search term for FirstName, LastName, Phone, and Email
		$stmt->bind_param("ssssi", $searchTerm, $searchTerm, $searchTerm, $searchTerm, $inData["userId"]);
		$stmt->execute();
		
		$result = $stmt->get_result();
		
		while($row = $result->fetch_assoc())
		{	
			// Fetch results of SQL query and store them into an array
			$searchResults[] = [
				"id" => $row["ID"],
				"firstName" => $row["FirstName"],
				"lastName" => $row["LastName"],
				"phone" => $row["Phone"],
				"email" => $row["Email"]
			];
			//Above is later passed in to json encode which converts the entire array into a json string
			//Below is for manually creating a JSON array of objects.
			//$searchResults .= '{"ID" : "' . $row["ID"] . '", "Name" : "' . $row["Name"] . '", "Phone" : "' . $row["Phone"] . '", "Email" : "' . $row["Email"] . '"}';
			$searchCount++;
		}
		
		if( $searchCount == 0 )
		{
			returnWithError( "No Records Found" );
		}
		else
		{
			returnWithInfo( $searchResults, $searchCount );
		}
		
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
		//convert PHP array into a json string.
		//echo outputsn data from php to web page
		echo json_encode($obj);
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $searchResults, $searchCount )
	{
		//ensures search results is passed as an array instead of a string
		$retValue = [
					'count' => $searchCount,
					'results' => $searchResults, 
					'error' => ''
					];
		sendResultInfoAsJson( $retValue );
	}
	
?>
