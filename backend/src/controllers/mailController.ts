import apiConfig from '../config/apiConfig'
import mailjet from 'node-mailjet'

const sendEmail = async (props: {
  toEmail: string,
  subject: string,
  text: string,
}) => {
  const mailjetConnect = mailjet.apiConnect(apiConfig.mailjet.apiKey, apiConfig.mailjet.apiSecret)
  const request = mailjetConnect
    .post("send", { 'version': 'v3.1' })
    .request({
      "Messages": [
        {
          "From": {
            "Email": "jerome.rastit@libertysurf.fr",
            "Name": "Jerome"
          },
          "To": [
            {
              "Email": props.toEmail,
              "Name": "Jerome"
            }
          ],
          "Subject": props.subject,
          "TextPart": props.text,
          //"HTMLPart": "<h3>Dear passenger 1, welcome to <a href='https://www.mailjet.com/'>Mailjet</a>!</h3><br />May the delivery force be with you!",
          //"CustomID": "AppGettingStartedTest"
        }
      ]
    })
  request
    .then((result) => {
      console.log(result.body)
    })
    .catch((err) => {
      console.log(err.statusCode)
    })
}
