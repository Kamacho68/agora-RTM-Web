module.exports = function() {
    switch (process.env.NODE_ENV) {
        case 'development':
            return {
                // Pass your app ID here.
                appId: "YOUR_APP_ID",
                // Set the channel name.
                channel: "demo_channel_name", // "demo_channel_name"
                // Pass a token if your project enables the App Certificate.
                token: "TOKEN_HERE",
                uid: null,
            };

        case 'production':
            return { // Pass your app ID here.
                appId: "YOUR_APP_ID",
                // Set the channel name.
                channel: null,
                // Pass a token if your project enables the App Certificate.
                token: null,
                uid: null,
            };
        default:
            return null;
    }
};