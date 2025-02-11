import { brevoApi, brevoApiKey } from "../utils/secrets";


const sendMail = async () => {
    try {
       

        const response = await fetch(brevoApi, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': brevoApiKey,
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                sender: {
                    name: ' Notification',
                    email: 'noreply@sportslot.fi',
                },
                to: [
                    {
                        name: ' Notification',
                        email: 'mubashare96@gmail.com',
                    },
                ],
                subject: 'Test mail',
                htmlContent: `<h1>test test</h1>`,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            console.log(' email sent successfully:', data);
        } else {
            console.error('Failed to send email:', data);
        }
    } catch (error) {
        console.error('Error while sending  email:', error);
    }
};
 
export default sendMail;