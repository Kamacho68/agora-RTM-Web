module.exports = function() {
    switch (process.env.NODE_ENV) {
        case 'development':
            return {
                // Pass your app ID here.
                appId: "15bd8f34ad054b3db9a2e133f8424e17",
                // Set the channel name.
                channel: "demo_channel_name", // "demo_channel_name"
                // Pass a token if your project enables the App Certificate.
                token: "NETLESSSDK_YWs9VkctX2tNRTM0VjdPNjl4bSZub25jZT05YzVlMzBkMC1hODYzLTExZWMtOGFkZS05YjA2MGI3MWYyNDkmcm9sZT0wJnNpZz1mOGYxYWViN2JjMDU2NTMyYjU5YTIyNmMyOGUxZTE5M2U5ZWQ4N2ZmNTM4ZjllYWE0OTg0MDlmNmUzYjA0MWVm",
                uid: null,
            };

        case 'production':
            return { // Pass your app ID here.
                appId: "15bd8f34ad054b3db9a2e133f8424e17",
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