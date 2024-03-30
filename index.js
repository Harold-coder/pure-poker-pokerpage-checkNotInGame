const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const connectionsTableName = process.env.CONNECTIONS_TABLE;

exports.handler = async (event) => {
    // Assuming the gameId is passed as a path parameter from API Gateway
    const playerId = event.pathParameters.playerId;
    const requestOrigin = event.headers ? event.headers.origin : "*";

    const params = {
        TableName: connectionsTableName,
        Key: {
            'playerId': playerId
        }
    };

    try {
        const response = await dynamoDb.get(params).promise();
        if (response.Item) {
            // We found a connection, we can return it.
            return {
                statusCode: 200,
                headers: {
                    "Access-Control-Allow-Origin": requestOrigin,
                    "Access-Control-Allow-Headers": "Content-Type",
                    "Access-Control-Allow-Methods": "OPTIONS,GET"
                },
                body: JSON.stringify(response.Item)
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
