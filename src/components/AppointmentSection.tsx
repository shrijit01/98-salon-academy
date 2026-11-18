import React, { useState } from 'react';
import { generateAppointmentWhatsAppUrl, type AppointmentEnquiry } from '../utils/whatsapp';

interface AppointmentProps {
  prefilledService?: string;
}

export const AppointmentSection: React.FC<AppointmentProps> = ({ prefilledService = 'Hair' }) => {
  const [formData, setFormData] = useState<AppointmentEnquiry>({
    fullName: '',
    phone: '',
    service: prefilledService,
    preferredDate: '',
    preferredTime: 'Morning (10:00 AM – 1:00 PM)',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const url = generateAppointmentWhatsAppUrl(formData);
    window.open(url, '_blank');
  };

  return (
    <section id="book" className="py-28 sm:py-36 bg-[#FAF8F5] text-[#161514] border-t border-[#E8E2D8]">
      <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="mb-14 sm:mb-18 text-center">
          <span className="text-[10px] tracking-[0.3em] uppercase font-sans text-[#9C7E55] font-medium block mb-3">
            07 / APPOINTMENTS
          </span>
          <h2 className="text-4xl sm:text-6xl font-serif font-light text-[#161514] tracking-[-0.02em]">
            BOOK AN APPOINTMENT
          </h2>
          <p className="mt-4 text-xs sm:text-sm text-[#646059] max-w-md mx-auto font-sans font-light leading-relaxed">
            Send an appointment enquiry directly to 98 Salon &amp; Academy. We will review availability and confirm your dedicated session.
          </p>
        </div>

        {/* Minimalist Editorial Form */}
        <form
          onSubmit={handleSubmit}
          className="border border-[#E8E2D8] bg-[#FAF8F5] p-8 sm:p-14 space-y-8"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {/* Full Name */}
            <div>
              <label htmlFor="appointment-fullname" className="block text-[10px] uppercase tracking-[0.2em] font-sans font-medium text-[#646059] mb-2">
                Full Name *
              </label>
              <input
                id="appointment-fullname"
                name="fullName"
                type="text"
                required
                placeholder="Your full name"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-4 py-3 bg-transparent border-b border-[#DFD5C6] text-sm text-[#161514] placeholder-[#646059]/40 focus:outline-hidden focus:border-[#161514] transition-colors font-sans"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="appointment-phone" className="block text-[10px] uppercase tracking-[0.2em] font-sans font-medium text-[#646059] mb-2">
                Phone Number *
              </label>
              <input
                id="appointment-phone"
                name="phone"
                type="tel"
                required
                placeholder="Your contact number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 bg-transparent border-b border-[#DFD5C6] text-sm text-[#161514] placeholder-[#646059]/40 focus:outline-hidden focus:border-[#161514] transition-colors font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {/* Service */}
            <div>
              <label htmlFor="appointment-service" className="block text-[10px] uppercase tracking-[0.2em] font-sans font-medium text-[#646059] mb-2">
                Service *
              </label>
              <select
                id="appointment-service"
                name="service"
                value={formData.service}
                onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                className="w-full px-4 py-3 bg-transparent border-b border-[#DFD5C6] text-sm text-[#161514] focus:outline-hidden focus:border-[#161514] transition-colors font-sans cursor-pointer"
              >
                <option value="Hair">Hair Design &amp; Styling</option>
                <option value="Skin">Skincare &amp; Facials</option>
                <option value="Makeup">Bridal &amp; Occasion Makeup</option>
                <option value="Nails">Manicure, Pedicure &amp; Nails</option>
                <option value="Consultation">Bespoke Consultation</option>
              </select>
            </div>

            {/* Preferred Date */}
            <div>
              <label htmlFor="appointment-date" className="block text-[10px] uppercase tracking-[0.2em] font-sans font-medium text-[#646059] mb-2">
                Preferred Date
              </label>
              <input
                id="appointment-date"
                name="preferredDate"
                type="date"
                value={formData.preferredDate}
                onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                className="w-full px-4 py-3 bg-transparent border-b border-[#DFD5C6] text-sm text-[#161514] focus:outline-hidden focus:border-[#161514] transition-colors font-sans"
              />
            </div>

            {/* Preferred Time */}
            <div>
              <label htmlFor="appointment-time" className="block text-[10px] uppercase tracking-[0.2em] font-sans font-medium text-[#646059] mb-2">
                Preferred Time
              </label>
              <select
                id="appointment-time"
                name="preferredTime"
                value={formData.preferredTime}
                onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                className="w-full px-4 py-3 bg-transparent border-b border-[#DFD5C6] text-sm text-[#161514] focus:outline-hidden focus:border-[#161514] transition-colors font-sans cursor-pointer"
              >
                <option value="Morning (10:00 AM – 1:00 PM)">Morning (10:00 AM – 1:00 PM)</option>
                <option value="Afternoon (1:00 PM – 4:00 PM)">Afternoon (1:00 PM – 4:00 PM)</option>
                <option value="Evening (4:00 PM – 8:00 PM)">Evening (4:00 PM – 8:00 PM)</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="appointment-notes" className="block text-[10px] uppercase tracking-[0.2em] font-sans font-medium text-[#646059] mb-2">
              Additional Details (Optional)
            </label>
            <textarea
              id="appointment-notes"
              name="notes"
              rows={2}
              placeholder="Tell us about your hair type, occasion or specific preferences..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-3 bg-transparent border-b border-[#DFD5C6] text-sm text-[#161514] placeholder-[#646059]/40 focus:outline-hidden focus:border-[#161514] transition-colors resize-none font-sans"
            />
          </div>

          <div className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-t border-[#E8E2D8]">
            <p className="text-xs text-[#646059] font-sans font-light">
              Submitting opens WhatsApp to <strong>088157 07200</strong>. Requests require salon confirmation.
            </p>

            <button
              type="submit"
              className="px-8 py-3.5 bg-[#161514] hover:bg-[#2A2825] text-[#FAF8F5] text-xs font-sans tracking-[0.2em] uppercase font-medium transition-colors cursor-pointer shrink-0"
            >
              Send Enquiry via WhatsApp
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};
