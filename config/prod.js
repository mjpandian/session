module.exports.config = function() {
    return {
        RefreshTokenTable: 'prod-KODemoTokens',
        UsersTable: 'prod-KODemoUsers',
        RefreshTokenExpiration: '30 days',
        AccessTokenExpiration: '1h',
        LogLevel: 'warn',
        //NOTE: DO NOT STORE SALT IN CODE --> this is for demo puposes only
        //in production consider an encrypted value in code and store the decryption key in AWS KMS
        ApiIdSalt: '{apiId_salt}',
        PasswordSalt: '{password_salt}',
        VPC: {
            securityGroupIds: ['sg-b2200bcb'],
            subnetIds: ['subnet-3ec1c248', 'subnet-3103ea56']
        }
    };
};