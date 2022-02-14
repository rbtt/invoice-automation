import fetch from 'node-fetch'
import refreshToken from './refreshHSToken'
import { monthName } from '../inv.bg/createInvoice'

const organization_id = process.env.HUBSTAFF_ORGANNIZATION_ID
let accessToken = process.env.HUBSTAFF_ACCESS_TOKEN
const getAccessToken = async () => {
  accessToken = await refreshToken()
}
if (!accessToken) {
  console.log('No HubStaff Access Token Found. Getting a new one..')
  getAccessToken()
}

const getWorkHours = async (month: number, year: number) => {
  try {
    const getDaysWorkMinutes = async (startDate: string, endDate: string) => {
      const response = await fetch(
        `https://api.hubstaff.com/v2/organizations/${organization_id}/activities?time_slot[start]=${startDate}&time_slot[stop]=${endDate}`,
        {
          method: 'GET',
          headers: {
            Authorization: 'Bearer ' + accessToken,
          },
        }
      )
      const resData = await response.json()
      let workSecondsInADay = 0
      resData.activities.forEach(
        (activity: any) => (workSecondsInADay += activity.tracked)
      )
      return workSecondsInADay / 60
    }

    const getMonthsWorkHours = async (month: number, year: number) => {
      const daysInMonth = new Date(year, month, 0).getDate() // 31, 30, 28, 29
      console.log(`Days in  ${monthName(month - 1)}: `, daysInMonth)
      let totalMinutes = 0
      for (let i = 1; i <= daysInMonth; i++) {
        totalMinutes += await getDaysWorkMinutes(
          new Date(year, month - 1, i).toISOString(),
          new Date(year, month - 1, i, 23, 59, 59).toISOString()
        )
      }

      return (Math.floor(totalMinutes) / 60).toFixed(2)
    }
    const hoursWorked = parseFloat(await getMonthsWorkHours(month, year))
    console.log(
      `Succesfully got work hours for ${monthName(month - 1)}, ${year}: `,
      hoursWorked
    )
    return hoursWorked
  } catch (err) {
    throw new Error('Error getting work activity from HubStaff.')
  }
}

export default getWorkHours
