//
const mailgun = require("mailgun-js");

const sendEmail = async (options) => {
    const client = mailgun({
        apiKey: "99e5ea1faa18957ed099fe14fad8ec9b-cc9b2d04-85b682c1",
        domain: "sandboxac9e5827f54f4cf994bf8c8c3bc8a378.mailgun.org",
    });

    const data = {
        from: "seunsanyaa <postmaster@sandboxac9e5827f54f4cf994bf8c8c3bc8a378.mailgun.org>",

        to: options.email,
        subject: "OTP to reset your password",
        html: options.message,
        // text: options.message,
    };

    client.messages().send(data, function (error, body) {
        console.log(body);
    });
};

export default sendEmail;
