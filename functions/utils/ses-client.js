const AWS = require('aws-sdk');
const config = require('../utils/email_config');


AWS.config.update({
    accessKeyId: config.aws.key,
    secretAccessKey: config.aws.secret,
    region: config.aws.ses.region,
});

const ses = new AWS.SES({ apiVersion: '2010-12-01' });

const sendEmail = async (to, subject, message, req, res, from) => {
    const params = {
        Destination: {
            ToAddresses: [to],
        },
        Message: {
            Body: {
                Html: {
                    Charset: 'UTF-8',
                    Data: message,
                },
                /* replace Html attribute with the following if you want to send plain text emails.
                        Text: {
                            Charset: "UTF-8",
                            Data: message
                        }
                     */
            },
            Subject: {
                Charset: 'UTF-8',
                Data: subject,
            },
        },
        // ReturnPath: from ? from : config.aws.ses.from.default,
        // Source: from ? from : config.aws.ses.from.default,

        ReturnPath: from,
        Source: from,
    };

    ses.sendEmail(params, async (err, data) => {
        if (err) {
            //console.log(err.toString(), err.stack);
            return res.send({
                success: false,
                result: 'Error sending email',
                server_error: err.toString(),
            });
        }
        //console.log('Email sent.', data);
    });
};
module.exports = { sendEmail };