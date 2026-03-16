
import emailjs from '@emailjs/browser';

export interface EmailData {
  to: string;
  subject: string;
  body: string;
}

export interface BookingEmailData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  persons: string;
  startDate: string;
  endDate: string;
  bookingType: string;
  itemName?: string;
}

// EmailJS configuration
const EMAILJS_SERVICE_ID = 'service_5qruhvn';
const EMAILJS_TEMPLATE_ID = 'template_wor4tpn'; // Original template
const BOOKING_TEMPLATE_ID = 'template_wa9jzcn'; // New booking template
const EMAILJS_PUBLIC_KEY = 'Ehen9ozSTvORPH3Ma';

export const sendEmail = async (data: EmailData): Promise<boolean> => {
  try {
    // Initialize EmailJS with your public key
    emailjs.init(EMAILJS_PUBLIC_KEY);
    
    // Prepare template parameters
    const templateParams = {
      to_email: data.to,
      subject: data.subject,
      message: data.body,
      from_name: 'Safeer Booking System'
    };
    
    // Send email using EmailJS
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    );
    
    console.log('Email sent successfully:', response);
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
};

export const sendBookingEmail = async (data: BookingEmailData): Promise<boolean> => {
  try {
    // Initialize EmailJS with your public key
    emailjs.init(EMAILJS_PUBLIC_KEY);
    
    // Prepare template parameters for booking
    const templateParams = {
      to_email: 'safeer@example.com', // Replace with your email
      from_name: 'Safeer Booking System',
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone: data.phone,
      persons: data.persons,
      start_date: data.startDate,
      end_date: data.endDate,
      booking_type: data.bookingType,
      item_name: data.itemName || 'Not specified',
      property_name: data.itemName || 'Not specified'
    };
    
    console.log('Sending booking email with params:', templateParams);
    
    // Send email using EmailJS with booking template
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      BOOKING_TEMPLATE_ID,
      templateParams
    );
    
    console.log('Booking email sent successfully:', response);
    return true;
  } catch (error) {
    console.error('Failed to send booking email:', error);
    return false;
  }
};
