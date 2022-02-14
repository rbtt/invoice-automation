import 'dotenv/config'
import fetch from 'node-fetch'
import * as exchangeRates from 'ecb-euro-exchange-rates'

const hourlyRateInUSD = 25

const fetchRates = async () => {
  const result = await exchangeRates.fetch()
  return {
    date: new Date(result.time).toISOString(),
    bgn: result.rates.BGN,
    usd: result.rates.USD,
  }
}

function addDays(date: Date, days: number) {
  let result = date
  result.setDate(result.getDate() + days)
  return result
}
export function monthName(month: number) {
  return [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ][month - 1]
}

const accessToken = process.env.INVBG_TOKEN

const getInvoiceNumber = async () => {
  try {
    const response = await fetch('https://api.inv.bg/v3/invoices', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/json',
      },
    })
    const resData = await response.json()
    return resData.total + 1
  } catch (err) {
    throw new Error('Error while trying to get invoice number from INV.BG')
  }
}

const generateInvoice = async (hours: number, month: number, year: number) => {
  try {
    const currentInvoiceNumber = await getInvoiceNumber()
    const rates = await fetchRates()
    const response = await fetch('https://api.inv.bg/v3/invoices', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to_name: '*******',
        to_town: '********',
        to_address: '*********',
        to_mol: '********',
        to_bulstat: '**********',
        to_is_reg_vat: true,
        to_vat_number: '******',
        vat: {
          percent: 0,
          reason_without: 'Subject to the EU reverse charge system',
        },
        type: 'dan',
        number: currentInvoiceNumber,
        to_country: '*****',
        recipient: '******',
        payment_currency: 'EUR',
        currency_rate: rates.bgn,
        date_rate: rates.date,
        payment_method: 'bank',
        date_create: new Date().toISOString(),
        notes: `Invoice for ${monthName(month - 1)} ${year}`,
        date_event: new Date().toISOString(),
        date_mature: addDays(new Date(), 7).toISOString(), 
        items: [
          {
            name: 'Software Developement',
            price: hourlyRateInUSD / rates.usd,
            quantity: hours,
            quantity_unit: 'hours',
          },
        ],
        bank_accounts: [1],
      }),
    })
    const resData: { id: number; number: string } = await response.json()
    console.log('Invoice created: ', resData)
    console.log(
      `Invoice total: ${(hourlyRateInUSD / rates.usd) * hours}EUR @ ${
        hourlyRateInUSD / rates.usd
      }EUR/h `
    )
    return resData
  } catch (err) {
    throw new Error('Error while trying to create an invoice.')
  }
}

export default generateInvoice
