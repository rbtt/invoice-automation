import fetch from 'node-fetch'

const accessToken = process.env.INVBG_TOKEN

export const sendEmailEng = async (invoiceId: number, number: string) => {
  try {
    const response = await fetch(`https://api.inv.bg/v3/invoices/${invoiceId}/emails`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        //   email: 'nikola.gb@gmail.com',
        email: '****@gmail.com',
        name: '****',
        subject: `Invoice #${number}`,
        message:
          "As requested attached you'll find the above mentioned invoice. \n \n Best Regard",
        delivery: 'file',
        inv_language: 'eng',
      }),
    })
    const resData = await response.json()
    console.log('ENG Invoice sent via email: ', resData)
    return resData
  } catch (err) {
    throw new Error('Error while creating ENG Invoice.')
  }
}

export const sendEmailBul = async (invoiceId: number, number: string) => {
  try {
    const response = await fetch(`https://api.inv.bg/v3/invoices/${invoiceId}/emails`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        //   email: 'nikola.gb@gmail.com',
        email: '*****@gmail.com',
        name: '******',
        subject: `Invoice #${number}`,
        message:
          "As requested attached you'll find the above mentioned invoice. \n \n Best Regards",
        delivery: 'file',
        inv_language: 'bul',
      }),
    })
    const resData = await response.json()
    console.log('BG Invoice sent via email: ', resData)
    return resData
  } catch (err) {
    throw new Error('Error while creating BUL Invoice.')
  }
}
