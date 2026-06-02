import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useUser, useAuth } from '@clerk/react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../data/products';
import { placeOrder } from '../services/api';
import type { OrderResponse } from '../services/api';
import { IoCheckmarkCircle, IoArrowBackOutline, IoChevronForwardOutline } from 'react-icons/io5';

const CheckoutPage = () => {
  const { items, cartTotal, clearCart } = useCart();
  const helmetTitle = 'Checkout — NASSEG';
  const [step, setStep] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Form state
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const shippingCost = cartTotal >= 200 ? 0 : shippingMethod === 'express' ? 25 : 15;
  const discount = promoApplied ? Math.round(cartTotal * 0.1) : 0;
  const total = cartTotal + shippingCost - discount;

  const [paymentMethod] = useState<'cash'>('cash');
  const [submitting, setSubmitting] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [orderResult, setOrderResult] = useState<OrderResponse | null>(null);
  const { user } = useUser();
  const { getToken } = useAuth();

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    setOrderError('');

    try {
      const token = await getToken();
      if (!token) throw new Error('Authentication required');
      const result = await placeOrder({
        email,
        items: items.map((i) => ({ product_id: i.id, quantity: i.quantity })),
      }, token);
      setOrderResult(result);
      setOrderPlaced(true);
      clearCart();
    } catch (err: any) {
      setOrderError(err.message || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };



  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen bg-[#f9f8f5] flex flex-col items-center justify-center p-5">
        <Helmet><title>{helmetTitle}</title></Helmet>
        <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h1 className="font-serif text-3xl text-dark italic mb-3">Your Bag is Empty</h1>
        <p className="text-sm font-sans text-muted mb-10 max-w-xs text-center">Add items to your bag to proceed with your luxury purchase.</p>
        <Link to="/collections" className="btn-primary px-10">Start Shopping</Link>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-dark flex flex-col items-center justify-center p-5 text-white">
        <Helmet><title>Order Confirmed — NASSEG</title></Helmet>
        <div className="w-24 h-24 rounded-full bg-gold/20 flex items-center justify-center mb-8 order-success-pulse">
          <IoCheckmarkCircle className="w-12 h-12 text-gold" />
        </div>
        <h1 className="font-serif text-4xl lg:text-5xl italic mb-4">Order Received</h1>
        <p className="text-white/60 font-sans tracking-widest-lg uppercase text-xs mb-10">
          Order #NSG-{orderResult?.id.toString().padStart(5, '0')}
        </p>
        <div className="space-y-4 w-full max-w-xs">
          <Link to="/" className="block w-full text-center bg-white text-dark py-4 text-[11px] font-sans tracking-widest-2xl uppercase hover:bg-gold hover:text-white transition-all">Return to Boutique</Link>
          <button className="block w-full text-center border border-white/20 text-white/60 py-4 text-[11px] font-sans tracking-widest-2xl uppercase hover:border-white hover:text-white transition-all">Download Receipt</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9f8f5] flex flex-col lg:flex-row overflow-hidden">
      <Helmet><title>{helmetTitle}</title></Helmet>
      {/* Left Column: Checkout Form (60%) */}
      <div className={`lg:w-[60%] p-5 lg:p-12 flex flex-col transition-all duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0 translate-y-8'}`}>
        <div className="max-w-2xl w-full mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-10">
            <Link to="/" className="text-dark hover:text-gold transition-colors flex items-center gap-2 text-[10px] font-sans tracking-widest-2xl uppercase">
              <IoArrowBackOutline className="w-4 h-4" />
              Boutique
            </Link>
            <h1 className="font-sans text-xl tracking-[0.4em] uppercase font-medium text-dark">NASSEG</h1>
            <div className="w-20" />
          </div>

          {/* Stepper */}
          <div className="flex items-center gap-4 mb-10">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-4">
                <div className={`text-[10px] font-sans tracking-widest uppercase transition-colors ${step === s ? 'text-dark font-semibold' : 'text-muted'}`}>
                  {s === 1 ? 'Shipping' : s === 2 ? 'Delivery' : 'Payment'}
                </div>
                {s < 3 && <IoChevronForwardOutline className="w-3 h-3 text-muted/40" />}
              </div>
            ))}
          </div>

          <form onSubmit={handlePlaceOrder} className="space-y-12">
            {/* Step 1: Shipping Address */}
            <div className={`space-y-8 transition-all duration-500 ${step >= 1 ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-2xl text-dark italic">Shipping Address</h2>
                {step > 1 && <button type="button" onClick={() => setStep(1)} className="text-[10px] font-sans tracking-widest uppercase text-gold">Edit</button>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="checkout-label">Contact Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="auth-input bg-transparent" required disabled={step > 1} />
                </div>
                <div>
                  <label className="checkout-label">First Name</label>
                  <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="auth-input bg-transparent" required disabled={step > 1} />
                </div>
                <div>
                  <label className="checkout-label">Last Name</label>
                  <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="auth-input bg-transparent" required disabled={step > 1} />
                </div>
                <div className="md:col-span-2">
                  <label className="checkout-label">Address</label>
                  <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Street Name, Building Number" className="auth-input bg-transparent" required disabled={step > 1} />
                </div>
                <div>
                  <label className="checkout-label">City</label>
                  <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className="auth-input bg-transparent" required disabled={step > 1} />
                </div>
                <div>
                  <label className="checkout-label">Postal Code</label>
                  <input type="text" value={zip} onChange={(e) => setZip(e.target.value)} className="auth-input bg-transparent" required disabled={step > 1} />
                </div>
              </div>

              {step === 1 && (
                <button type="button" onClick={() => setStep(2)} className="btn-primary w-full py-4 !mt-10">Continue to Delivery</button>
              )}
            </div>

            {/* Step 2: Delivery Method */}
            <div className={`space-y-8 transition-all duration-500 ${step >= 2 ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
              <div className="flex items-center justify-between border-t border-border-light pt-12">
                <h2 className="font-serif text-2xl text-dark italic">Delivery Method</h2>
                {step > 2 && <button type="button" onClick={() => setStep(2)} className="text-[10px] font-sans tracking-widest uppercase text-gold">Edit</button>}
              </div>

              {step >= 2 && (
                <div className="space-y-4">
                  <label className={`flex items-center justify-between p-5 border cursor-pointer transition-all ${shippingMethod === 'standard' ? 'border-dark bg-white' : 'border-border-light bg-transparent hover:border-dark/30'}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${shippingMethod === 'standard' ? 'border-dark' : 'border-border-light'}`}>
                        {shippingMethod === 'standard' && <div className="w-2.5 h-2.5 rounded-full bg-dark" />}
                      </div>
                      <div>
                        <span className="text-sm font-sans font-medium text-dark block">Standard Delivery</span>
                        <span className="text-[10px] font-sans text-muted uppercase tracking-wider">3–5 Business Days</span>
                      </div>
                    </div>
                    <span className="text-sm font-sans text-dark">{cartTotal >= 200 ? 'Free' : '$15'}</span>
                    <input type="radio" name="delivery" checked={shippingMethod === 'standard'} onChange={() => setShippingMethod('standard')} className="sr-only" />
                  </label>

                  <label className={`flex items-center justify-between p-5 border cursor-pointer transition-all ${shippingMethod === 'express' ? 'border-dark bg-white' : 'border-border-light bg-transparent hover:border-dark/30'}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${shippingMethod === 'express' ? 'border-dark' : 'border-border-light'}`}>
                        {shippingMethod === 'express' && <div className="w-2.5 h-2.5 rounded-full bg-dark" />}
                      </div>
                      <div>
                        <span className="text-sm font-sans font-medium text-dark block">Express Delivery</span>
                        <span className="text-[10px] font-sans text-gold uppercase tracking-wider">1–2 Business Days</span>
                      </div>
                    </div>
                    <span className="text-sm font-sans text-dark">$25</span>
                    <input type="radio" name="delivery" checked={shippingMethod === 'express'} onChange={() => setShippingMethod('express')} className="sr-only" />
                  </label>
                </div>
              )}

              {step === 2 && (
                <button type="button" onClick={() => setStep(3)} className="btn-primary w-full py-4 !mt-10">Continue to Payment</button>
              )}
            </div>

            {/* Step 3: Payment */}
            <div className={`space-y-8 transition-all duration-500 ${step >= 3 ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
              <div className="flex items-center justify-between border-t border-border-light pt-12">
                <h2 className="font-serif text-2xl text-dark italic">Payment Details</h2>
              </div>

              {step === 3 && (
                <div className="space-y-8">
                  {/* Payment Method - Cash on Delivery */}
                  <div className="p-6 border border-dashed border-gold/30 bg-gold/5 rounded-lg animate-in fade-in slide-in-from-top-2 duration-300">
                    <p className="text-sm font-sans text-dark/80 leading-relaxed text-center">
                      Cash on Delivery — Please have the exact amount <span className="font-semibold">{formatPrice(total)}</span> ready for our courier upon delivery. 
                      A verification call may be made before shipping.
                    </p>
                  </div>

                  {!user && (
                    <div className="text-center py-6 border border-gold/30 bg-gold/5 rounded-lg">
                      <p className="text-sm font-sans text-muted mb-2">Please sign in to complete your purchase.</p>
                      <Link to="/auth" className="text-gold underline text-xs font-sans">Sign In</Link>
                    </div>
                  )}
                  {user && <button type="submit" disabled={submitting} className="btn-primary w-full py-5 !mt-10 group relative overflow-hidden">
                    <span className="relative z-10">
                      {submitting ? 'Processing…' : `Complete Purchase · ${formatPrice(total)}`}
                    </span>
                    {submitting && (
                      <div className="absolute inset-0 flex items-center justify-center bg-dark">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      </div>
                    )}
                  </button>}
                  {orderError && (
                    <p className="text-[10px] font-sans text-red-500 text-center uppercase tracking-widest leading-relaxed">
                      {orderError}
                    </p>
                  )}
                  <p className="text-[10px] font-sans text-muted text-center uppercase tracking-widest leading-relaxed">
                    By clicking "Complete Purchase", you agree to our Terms & Conditions.
                  </p>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Right Column: Order Summary (40%) */}
      <div className="lg:w-[40%] bg-white lg:bg-dark p-8 lg:p-12 flex flex-col min-h-screen">
        <div className="max-w-md w-full mx-auto h-full flex flex-col">
          <h2 className="font-serif text-xl text-dark lg:text-white italic mb-8">Order Summary</h2>

          {/* Item List */}
          <div className="flex-initial space-y-4 overflow-y-auto mb-8 pr-2 custom-scrollbar max-h-[40vh]">
            {items.map((item) => (
              <div key={`${item.id}-${item.size}`} className="flex gap-5">
                <div className="w-16 h-20 bg-[#eae7e0] flex-shrink-0 relative overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-gold text-white text-[9px] font-sans font-semibold rounded-full flex items-center justify-center">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-serif text-sm text-dark lg:text-white truncate mb-1">{item.name}</h4>
                  <p className="text-[10px] font-sans text-muted uppercase tracking-widest mb-2">{item.size} · {item.color}</p>
                  <span className="text-sm font-serif text-dark lg:text-white font-medium">{formatPrice(item.price * item.quantity)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Promo */}
          <div className="flex gap-2 mb-8">
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="PROMO CODE"
              className="bg-transparent border border-dark/10 lg:border-white/10 px-4 py-2.5 text-[10px] font-sans tracking-widest-xl text-dark lg:text-white flex-1 outline-none focus:border-gold transition-colors"
            />
            <button
              onClick={() => promoCode && setPromoApplied(true)}
              className="px-5 py-2.5 bg-dark lg:bg-white text-white lg:text-dark text-[10px] font-sans tracking-widest-xl uppercase hover:bg-gold hover:text-white transition-all duration-300"
            >
              {promoApplied ? 'Applied' : 'Apply'}
            </button>
          </div>

          {/* Totals */}
          <div className="space-y-4 pt-8 border-t border-dark/10 lg:border-white/10">
            <div className="flex justify-between">
              <span className="text-[11px] font-sans text-muted uppercase tracking-widest">Subtotal</span>
              <span className="text-sm font-serif text-dark lg:text-white">{formatPrice(cartTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[11px] font-sans text-muted uppercase tracking-widest">Shipping</span>
              <span className="text-sm font-sans text-gold">
                {shippingCost === 0 ? 'Complimentary' : formatPrice(shippingCost)}
              </span>
            </div>
            {promoApplied && (
              <div className="flex justify-between">
                <span className="text-[11px] font-sans text-green-stock uppercase tracking-widest">Discount</span>
                <span className="text-sm font-sans text-green-stock">-{formatPrice(discount)}</span>
              </div>
            )}
            <div className="flex justify-between pt-3">
              <span className="text-sm font-sans font-medium text-dark lg:text-white uppercase tracking-[0.2em]">Total</span>
              <div className="text-right">
                <span className="text-xl font-serif text-dark lg:text-white font-medium">{formatPrice(total)}</span>
                <p className="text-[9px] font-sans text-muted uppercase tracking-wider mt-1">Including VAT & Duties</p>
              </div>
            </div>
          </div>

          {/* Branding Image (Larger and under totals) */}
          <div className="mt-8 hidden lg:block opacity-40 hover:opacity-70 transition-opacity">
            <img src="/brand-image.png" alt="NASSEG" className="w-full h-40 object-cover" />
          </div>


        </div>
      </div>

    </div>
  );
};

export default CheckoutPage;
