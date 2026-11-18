import React, { useState } from 'react';
import { X } from 'lucide-react';
import { generateAppointmentWhatsAppUrl, type AppointmentEnquiry } from '../utils/whatsapp';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: string;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  initialService = 'Hair',
}) => {
  const [formData, setFormData] = useState<AppointmentEnquiry>({
    fullName: '',
    phone: '',
    service: initialService,
    preferredDate: '',
    preferredTime: 'Morning (10:00 AM – 1:00 PM)',
    notes: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const url = generateAppointmentWhatsAppUrl(formData);
    window.open(url, '_blank');
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-[#FAF8F5] border border-[#E8E2D8] p-8 sm:p-10 text-[#161514]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-6 right-6 p-2 text-[#646059] hover:text-[#161514] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5 stroke-1" />
        </button>

        {/* Modal Header */}
        <div className="mb-8">
          <span className="text-[10px] tracking-[0.3em] uppercase font-sans text-[#9C7E55] font-medium block mb-2">
            RESERVATION ENQUIRY
          </span>
          <h3 className="font-serif text-3xl font-light text-[#161514]">
            Book an Appointment
          </h3>
          <p className="text-xs text-[#646059] mt-2 font-sans font-light leading-relaxed">
            98 Salon &amp; Academy • Allahabad Road, Rewa. Inquiries are confirmed by our salon team.
          </p>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
          <div>
            <label htmlFor="modal-fullname" className="block text-[10px] uppercase tracking-[0.2em] font-sans font-medium text-[#646059] mb-1">
              Full Name *
            </label>
            <input
              id="modal-fullname"
              name="fullName"
              type="text"
              required
              placeholder="Your full name"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-3 py-2 bg-transparent border-b border-[#DFD5C6] text-sm text-[#161514] placeholder-[#646059]/40 focus:outline-hidden focus:border-[#161514] font-sans"
            />
          </div>

          <div>
            <label htmlFor="modal-phone" className="block text-[10px] uppercase tracking-[0.2em] font-sans font-medium text-[#646059] mb-1">
              Phone Number *
            </label>
            <input
              id="modal-phone"
              name="phone"
              type="tel"
              required
              placeholder="Contact number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 bg-transparent border-b border-[#DFD5C6] text-sm text-[#161514] placeholder-[#646059]/40 focus:outline-hidden focus:border-[#161514] font-mono"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="modal-service" className="block text-[10px] uppercase tracking-[0.2em] font-sans font-medium text-[#646059] mb-1">
                Service *
              </label>
              <select
                id="modal-service"
                name="service"
                value={formData.service}
                onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                className="w-full px-3 py-2 bg-transparent border-b border-[#DFD5C6] text-xs text-[#161514] focus:outline-hidden focus:border-[#161514] font-sans cursor-pointer"
              >
                <option value="Hair Cut & Styling">Hair Cut &amp; Styling</option>
                <option value="Hair Color & Treatments">Hair Color &amp; Treatments</option>
                <option value="Skin & Facial Rituals">Skin &amp; Facial Rituals</option>
                <option value="Bridal & Occasion Makeup">Bridal &amp; Occasion Makeup</option>
                <option value="Nail Art & Extensions">Nail Art &amp; Extensions</option>
                <option value="Academy Course Enquiry">Academy Course Enquiry</option>
              </select>
            </div>

            <div>
              <label htmlFor="modal-date" className="block text-[10px] uppercase tracking-[0.2em] font-sans font-medium text-[#646059] mb-1">
                Preferred Date
              </label>
              <input
                id="modal-date"
                name="preferredDate"
                type="date"
                value={formData.preferredDate}
                onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                className="w-full px-3 py-2 bg-transparent border-b border-[#DFD5C6] text-xs text-[#161514] focus:outline-hidden focus:border-[#161514] font-sans"
              />
            </div>
          </div>

          <div>
            <label htmlFor="modal-time" className="block text-[10px] uppercase tracking-[0.2em] font-sans font-medium text-[#646059] mb-1">
              Time Slot
            </label>
            <select
              id="modal-time"
              name="preferredTime"
              value={formData.preferredTime}
              onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
              className="w-full px-3 py-2 bg-transparent border-b border-[#DFD5C6] text-xs text-[#161514] focus:outline-hidden focus:border-[#161514] font-sans cursor-pointer"
            >
              <option value="Morning (10:00 AM – 1:00 PM)">Morning (10:00 AM – 1:00 PM)</option>
              <option value="Afternoon (1:00 PM – 5:00 PM)">Afternoon (1:00 PM – 5:00 PM)</option>
              <option value="Evening (5:00 PM – 8:00 PM)">Evening (5:00 PM – 8:00 PM)</option>
            </select>
          </div>

          <div>
            <label htmlFor="modal-notes" className="block text-[10px] uppercase tracking-[0.2em] font-sans font-medium text-[#646059] mb-1">
              Notes (Optional)
            </label>
            <textarea
              id="modal-notes"
              name="notes"
              rows={2}
              placeholder="Any specific preferences..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 bg-transparent border-b border-[#DFD5C6] text-xs text-[#161514] placeholder-[#646059]/40 focus:outline-hidden focus:border-[#161514] resize-none font-sans"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-3.5 bg-[#161514] hover:bg-[#2A2825] text-[#FAF8F5] text-xs font-sans tracking-[0.2em] uppercase font-medium transition-colors cursor-pointer"
            >
              Send Enquiry via WhatsApp
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
