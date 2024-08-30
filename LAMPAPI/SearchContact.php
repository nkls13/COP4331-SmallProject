<?php

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
        //Like searches for Partial Matches?
		//Eahc "?" represents it needed to be bind
		// Use () to make it apply to the entire search
		$stmt = $conn->prepare("SELECT ID, Name, Phone, Email FROM Contacts WHERE (Name LIKE ? OR Phone LIKE ? OR Email LIKE ?) AND UserID=?");
		
        //The % allows for different characters before or after the search
		$contactName = "%" . $inData["name"] . "%";
		//Im searching for Name, phone, and email using the search term contact name so I need to bind it 4 times.
		
		$stmt->bind_param("sssi", $contactName, $contactName, $contactName, $inData["userId"]);
		$stmt->execute();
		
		$result = $stmt->get_result();
		
		while($row = $result->fetch_assoc())
		{	
			//fetch results of sql query and store into array. Builds an array of associative arrays, where each is a JSOn object
			$searchResults[] = [
				"id" => $row["ID"],
				"name" => $row["Name"],
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