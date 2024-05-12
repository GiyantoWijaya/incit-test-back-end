export const templateHtmlEmail = (
    email: string, tokenEmail: string
): string => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">

    <table style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 10px;">
        <tr>
            <td>
                <h2 style="color: #333;">Verify Your Email Address</h2>
                <p style="color: #666;">Please click the button below to verify your email address. </p>
                <a href="http://localhost:3000/verify/auth/${email}/${tokenEmail}" style="display: inline-block; background-color: #007bff; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 5px;">Verify Email</a>
                <p style="color: #666;">If you did not request this verification, you can ignore this email.</p>
            </td>
        </tr>
    </table>

</body>
</html>`;


