import { SALON_INFO } from '../data/salonData';

export interface AppointmentEnquiry {
  fullName: string;
  phone: string;
  service: string;
  preferredDate: string;
  preferredTime: string;
  notes?: string;
}

export function generateAppointmentWhatsAppUrl(enquiry: AppointmentEnquiry): string {
  const message = [
    `✨ *APPOINTMENT ENQUIRY — ${SALON_INFO.name}*`,
    `_Rewa, Madhya Pradesh_`,
    ``,
    `👤 *Client Name:* ${enquiry.fullName || 'Guest'}`,
    `📞 *Contact:* ${enquiry.phone || 'Not provided'}`,
    `💇 *Service Requested:* ${enquiry.service}`,
    `📅 *Preferred Date:* ${enquiry.preferredDate || 'Earliest available'}`,
    `⏰ *Preferred Time Slot:* ${enquiry.preferredTime || 'Flexible'}`,
    enquiry.notes ? `📝 *Notes:* ${enquiry.notes}` : '',
    ``,
    `_Please let me know availability and confirmation for this slot. Thank you!_`
  ]
    .filter(Boolean)
    .join('\n');

  return `https://wa.me/918815707200?text=${encodeURIComponent(message)}`;
}

export function generateAcademyWhatsAppUrl(topic: string = 'Academy Course Enquiry'): string {
  const message = [
    `🎓 *ACADEMY ENQUIRY — ${SALON_INFO.name}*`,
    `_Rewa, Madhya Pradesh_`,
    ``,
    `Hello, I would like to inquire about training opportunities and professional beauty courses at 98 Salon & Academy.`,
    `Topic: ${topic}`,
    ``,
    `Please share details regarding upcoming batches, course modules, and admission process.`
  ].join('\n');

  return `https://wa.me/918815707200?text=${encodeURIComponent(message)}`;
}

export function generateGeneralWhatsAppUrl(): string {
  const message = `Hello 98 Salon & Academy, I would like to make an enquiry regarding your salon services in Rewa.`;
  return `https://wa.me/918815707200?text=${encodeURIComponent(message)}`;
}
