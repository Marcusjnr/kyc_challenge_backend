module.exports = {
    aws: {
        key: 'AKIAQCNDADCAWVITJXWX',
        secret: 'VGOqDkuH3uc0SgAaKjZHW962oy2dadrliJQWKAEQ',
        ses: {
            from: {
                // replace with actual email address
                default: '"shootfish.xyz" <noreply@bshop.shootfish.xyz>',
            },
            // e.g. us-west-2
            region: 'eu-west-1',
        },
    },
    delivery: {
        subject: 'Your confirmation pin',
        message: 'Welcome to kyc',
    },
};
