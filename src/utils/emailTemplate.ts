const verificationEmail = (username: string, token: string) => {
    return {
        subject: 'Verify Your Email',
        text: `Hi ${username},\n\nPlease verify your email Thank you!`,
        html: `<h1>Hi ${username}</h1>
               <p>Your verification code is: ${token}</p>`,
    };
};

export default verificationEmail;
