type ApplicationEmailInput = {
  to?: string | null
  name: string
  applicationNumber: string
  status?: string
}

export async function sendApplicationEmail({ to, name, applicationNumber, status = 'submitted' }: ApplicationEmailInput) {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.EMAIL_FROM

  if (!to || !apiKey || !from) {
    console.warn('Application email skipped: RESEND_API_KEY, EMAIL_FROM, or recipient is missing.')
    return { sent: false }
  }

  const subject = status === 'approved'
    ? `Application ${applicationNumber} approved`
    : status === 'declined'
      ? `Application ${applicationNumber} declined`
      : `Application ${applicationNumber} submitted`

  const message = status === 'approved'
    ? `Hello ${name},\n\nYour application ${applicationNumber} has been approved. Please use My Applications on the IDA World Support Grant website to view the latest status and continue your conversation with the grant team.\n\nIDA World Support Grant`
    : status === 'declined'
      ? `Hello ${name},\n\nYour application ${applicationNumber} has been declined following review. Please use My Applications on the IDA World Support Grant website to view the latest status and any available decision information.\n\nIDA World Support Grant`
      : `Hello ${name},\n\nYour application ${applicationNumber} has been submitted successfully and is now under review. An agent will attend to you shortly.\n\nYou can use My Applications on the IDA World Support Grant website to track this application and use the live chat for this application.\n\nIDA World Support Grant`

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from, to: [to], subject, text: message }),
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`Email provider returned ${response.status}: ${body}`)
  }

  return { sent: true }
}
