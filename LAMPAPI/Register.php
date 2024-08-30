
<?php

	$inData = getRequestInfo();
	
    //Where does the things inside [] come from? why is it camelCase? The data base has it spelt differently?
	$firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $login = $inData["login"];
    $password = $inData["password"];
    //I dont need to account for ID because its accounted for? 

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331"); 	
    
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{

        //first check if User already exists. Prepare SQL query
        // The ? acts as a place holder which is binded in the next line. 
        //This prevents SQL injection and improves security.
        $stmt = $conn->prepare("SELECT ID FROM Users WHERE Login=?");
        //The s indicates string
        $stmt->bind_param("s", $login);
        //execute does sql query
        $stmt->execute();
        $result = $stmt->get_result();

        //Summary: Checks if a row exists with the exact login

        if ($row = $result->fetch_assoc()) 
        {
            returnWithError("User already exists");
        } 

        //else register the contact
        else {
            $stmt = $conn->prepare("INSERT into Users (FirstName, LastName, Login, Password) VALUES(?, ?, ?, ?)");

            //bind input to fields here. Add an S per bind
            $stmt->bind_param("ssss", $firstName , $lastName, $login, $password );
            //What does this line do?
            $stmt->execute();
            //Why double close?
            $newID = $conn->insert_id;
            $stmt->close();
            $conn->close();
    
            //Is this id insertion right?
            returnWithInfo($firstName, $lastName, $newID);
        }

        
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
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $firstName, $lastName, $id )
	{
		$retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
