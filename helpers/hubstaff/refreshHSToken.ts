import fetch from 'node-fetch'

export default async function (): Promise<string> {
  const details: { [key: string]: string } = {
    grant_type: 'refresh_token',
    refresh_token: process.env.HUBSTAFF_REFRESH_TOKEN!,
  }

  let formBody = []
  for (let property in details) {
    const encodedKey = encodeURIComponent(property)
    const encodedValue = encodeURIComponent(details[property])
    formBody.push(encodedKey + '=' + encodedValue)
  }
  const formBodyEncoded = formBody.join('&')
  try {
    const response = await fetch('https://account.hubstaff.com/access_tokens', {
      body: formBodyEncoded,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
    })
    const resData = await response.json()
    // console.log('Refresh response: ', resData)
    process.env.HUBSTAFF_ACCESS_TOKEN = resData.access_token
    setTimeout(() => {
      delete process.env.HUBSTAFF_ACCESS_TOKEN
    }, resData.expires_in * 1000)
    console.log('Refreshed access token. \nNew token: ', resData.access_token)
    return resData.access_token
  } catch (err) {
    throw new Error('Error while trying to refresh HubStaff access token.')
  }
}
