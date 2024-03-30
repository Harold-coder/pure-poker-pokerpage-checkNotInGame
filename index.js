const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const connectionsTableName = process.env.CONNECTIONS_TABLE;

exports.handler = async (event) => {
    // Assuming the gameId is passed as a path parameter from API Gateway
    const playerId = event.queryStringParameters.playerId; // Adjust according to how you receive path parameters
    const requestOrigin = event.headers ? event.headers.origin : "*";

    console.log(playerId);

    const scanParams = {
        TableName: connectionsTableName,
        FilterExpression: 'playerId = :playerId',
        ExpressionAttributeValues: {
            ':playerId': playerId,
        },
    };

    try {
        const response = await dynamoDb.scan(scanParams).promise();
        if (response.Items.length > 0) {
            // Assuming you want to return the first match, adjust as necessary
            return {
                statusCode: 200,
                headers: {
                    "Access-Control-Allow-Origin": requestOrigin,
                    "Access-Control-Allow-Headers": "Content-Type",
                    "Access-Control-Allow-Methods": "OPTIONS,GET"
                },
                body: JSON.stringify(response.Items[0]) // Sending back the first matching item
            };
        } else {
            // Couldn't find a connection
            return {
                statusCode: 404,
                body: JSON.stringify({ message: "Connection not found" })
            };
        }
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Internal server error" })
        };
    }
};
