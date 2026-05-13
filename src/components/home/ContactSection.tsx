import { IoMailOutline, IoCallOutline, IoLocationOutline } from 'react-icons/io5';
import { useRevealOnScroll } from '../../hooks/useRevealOnScroll';

const ContactSection = () => {
  const leftReveal = useRevealOnScroll<HTMLDivElement>({ threshold: 0.1 });
  const rightReveal = useRevealOnScroll<HTMLDivElement>({ threshold: 0.1 });

  return (
    <section id="contact-home" className="bg-white overflow-hidden my-20 lg:my-32">
      <div className="max-w-8xl mx-auto px-5 lg:px-12 py-20 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:min-h-[600px] items-stretch">
          {/* Left - Contact Info (Dark Background) */}
          <div 
            ref={leftReveal.ref}
            className={`bg-dark text-white p-8 lg:p-20 flex flex-col justify-center reveal-element ${leftReveal.isVisible ? 'revealed' : ''}`}
          >
            <span className="text-[11px] font-sans tracking-widest-2xl uppercase text-gold block mb-4">
              Get In Touch
            </span>
            <h2 className="font-serif text-4xl lg:text-5xl text-white italic mb-8 leading-tight">
              We're here to help you<br />with any inquiry.
            </h2>
            
            <div className="space-y-10 mt-6">
              <div className="flex items-center gap-6 group">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-white transition-all duration-300">
                  <IoMailOutline className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[10px] font-sans tracking-widest-xl uppercase text-white/40 mb-1">Email Us</h4>
                  <p className="text-white font-medium hover:text-gold transition-colors cursor-pointer">care@nasseg.com</p>
                </div>
              </div>

              <div className="flex items-center gap-6 group">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-white transition-all duration-300">
                  <IoCallOutline className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[10px] font-sans tracking-widest-xl uppercase text-white/40 mb-1">Call Us</h4>
                  <p className="text-white font-medium hover:text-gold transition-colors cursor-pointer">+1 (800) NASSEG-01</p>
                </div>
              </div>

              <div className="flex items-center gap-6 group">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-white transition-all duration-300">
                  <IoLocationOutline className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[10px] font-sans tracking-widest-xl uppercase text-white/40 mb-1">Flagship Store</h4>
                  <p className="text-white font-medium leading-relaxed">
                    124 Madison Avenue, New York
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Simple Form (Light Background) */}
          <div 
            ref={rightReveal.ref}
            className={`bg-[#f9f8f5] p-8 lg:p-20 flex flex-col justify-center reveal-element ${rightReveal.isVisible ? 'revealed' : ''}`}
          >
            <h3 className="font-serif text-2xl text-dark mb-8 italic">Send a Message</h3>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="checkout-label">Full Name</label>
                  <input type="text" className="auth-input" placeholder="Jane Doe" />
                </div>
                <div>
                  <label className="checkout-label">Email Address</label>
                  <input type="email" className="auth-input" placeholder="jane@example.com" />
                </div>
              </div>
              <div>
                <label className="checkout-label">Subject</label>
                <select className="auth-input appearance-none">
                  <option>General Inquiry</option>
                  <option>Order Support</option>
                  <option>Styling Advice</option>
                  <option>Returns</option>
                </select>
              </div>
              <div>
                <label className="checkout-label">Message</label>
                <textarea 
                  rows={4} 
                  className="auth-input resize-none" 
                  placeholder="How can we assist you today?"
                ></textarea>
              </div>
              <button 
                type="submit" 
                className="w-full bg-dark text-white text-[11px] font-sans tracking-widest-xl uppercase py-4 hover:bg-gold transition-colors duration-300"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
