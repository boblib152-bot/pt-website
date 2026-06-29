/**
 * Notification service for sending email alerts on client activities.
 * Uses FormSubmit.co AJAX endpoint to securely dispatch emails to Hanoch Lib.
 */

const targetEmail = import.meta.env.VITE_NOTIFICATION_EMAIL || 'hanochlib@gmail.com';

export async function sendEmailNotification(subject: string, messageBody: string) {
  try {
    const response = await fetch(`https://formsubmit.co/ajax/${targetEmail}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        _subject: `[PT Portal Alert] ${subject}`,
        message: messageBody,
        _honey: '' // Anti-spam honeypot
      })
    });

    const result = await response.json();
    console.log('Email notification sent successfully:', result);
  } catch (error) {
    console.error('Failed to dispatch email notification:', error);
  }
}
