/* jshint node:true, expr:true */
'use strict';

module.exports = {
    /**
     * Wrapper class that can be used to test lambda functions.
     */
    LambdaWrapper: require('./lambda-wrapper'),

    /**
     * Helper class that can be used to generate aws lambda contexts.
     */
    LambdaContext: require('./lambda-context'),

    /**
     * Helper class that can be used to clean up records created in dynamodb
     * during testing.
     */
    DynamoDbHelper: require('./dynamodb-helper')
}
