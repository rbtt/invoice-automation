import 'dotenv/config'
import * as schedule from 'node-schedule'
import getWorkHours from './helpers/hubstaff/getWorkHours'
import createInvoice from './helpers/inv.bg/createInvoice'
import { sendEmailEng, sendEmailBul } from './helpers/inv.bg/sendEmail'

const mainSequence = async () => {
  try {
    const date = new Date()
    const month = date.getMonth()
    const year = date.getFullYear()
    // month provided would be non-0-based - Jan=1, May=5 (not 0, 4 resp.)
    const workHours = await getWorkHours(month, year)
    const { id, number } = await createInvoice(workHours, month + 1, year)
    await sendEmailEng(id, number)
    await sendEmailBul(id, number)
  } catch (err) {
    console.warn(err)
  }
}

// runs on the first day of every month
schedule.scheduleJob('0 0 0 1 */1 *', function () {
  mainSequence()
})
//runs every 5 minutes
// schedule.scheduleJob('0 */5 * * * * ', function () {
//   mainSequence()
// })
