import emailjs from 'emailjs-com';

export function sendCandidateEmail(candidateEmail: string, candidateName: string, status: 'hired' | 'rejected') {
  const templateParams = {
    to_email: candidateEmail,
    to_name: candidateName,
    message: status === 'hired'
      ? 'Congratulations! You have been selected for the position.'
      : 'Thank you for applying. Unfortunately, you were not selected.',
  };

  return emailjs.send(
    'YOUR_SERVICE_ID', // replace with your EmailJS service ID
    'YOUR_TEMPLATE_ID', // replace with your EmailJS template ID
    templateParams,
    'YOUR_USER_ID' // replace with your EmailJS user ID
  );
}
