import React, { useState } from 'react';
import {
  X,
  ArrowRight,
  Trash2,
  ShoppingBag,
  ShieldCheck,
  Tag,
  CheckCircle,
  MessageCircle,
  MapPin,
  Phone,
  User,
  Truck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { authService } from '../features/auth/services/authService';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalCount,
    subtotal,
    discount,
    total,
    isFreeShippingQualified,
    freeShippingProgress,
    promoCode,
    applyPromoCode,
    removePromoCode,
    formatPrice,
  } = useCart();

  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);

  // Informations de livraison pour une commande ultra-précise
  const [clientName, setClientName] = useState(() => {
    return authService.getUserName() || localStorage.getItem('ckennedy_client_name') || '';
  });
  const [clientPhone, setClientPhone] = useState(() => {
    return localStorage.getItem('ckennedy_client_phone') || '';
  });
  const [clientCity, setClientCity] = useState(() => {
    return localStorage.getItem('ckennedy_client_city') || '';
  });
  const [clientPayment, setClientPayment] = useState<'Orange Money' | 'MTN Mobile Money' | 'Espèces à la livraison'>(() => {
    const saved = localStorage.getItem('ckennedy_client_payment');
    if (saved === 'MTN Mobile Money' || saved === 'Espèces à la livraison') return saved;
    return 'Orange Money';
  });
  const [clientNotes, setClientNotes] = useState('');
  const [showDeliveryForm, setShowDeliveryForm] = useState(true);

  if (!isCartOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyPromoCode(promoInput);
    setPromoMessage({ text: res.message, isError: !res.success });
    if (res.success) setPromoInput('');
  };

  // Numéro WhatsApp de commande direct du client (+237 696 61 16 23)
  const WHATSAPP_NUMBER = '237696611623';
  const SHIPPING_FEE = 2000; // Frais de livraison standard en FCFA

  const handleCompleteCheckout = () => {
    setIsCheckingOut(true);

    // Sauvegarder les coordonnées pour la prochaine commande
    if (clientName.trim()) localStorage.setItem('ckennedy_client_name', clientName.trim());
    if (clientPhone.trim()) localStorage.setItem('ckennedy_client_phone', clientPhone.trim());
    if (clientCity.trim()) localStorage.setItem('ckennedy_client_city', clientCity.trim());
    localStorage.setItem('ckennedy_client_payment', clientPayment);
    
    const calculatedTotal = total + (isFreeShippingQualified ? 0 : SHIPPING_FEE);
    const dateStr = new Date().toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    const orderRef = `CK-${Math.floor(100000 + Math.random() * 900000)}`;

    // ─── Facture textuelle ultra-détaillée pour WhatsApp ───
    let message = `📦 *BON DE COMMANDE C'KENNEDY* 🇨🇲\n`;
    message += `🆔 *RÉFÉRENCE :* #${orderRef}\n`;
    message += `📅 *DATE :* ${dateStr}\n`;
    message += `────────────────────────────\n\n`;

    message += `👤 *CLIENT & LIVRAISON*\n`;
    message += `• Nom : ${clientName.trim() || 'Client web'}\n`;
    message += `• Contact : ${clientPhone.trim() || 'Numéro WhatsApp émetteur'}\n`;
    message += `• Lieu de livraison : ${clientCity.trim() || 'À préciser avec le vendeur'}\n`;
    message += `• Paiement souhaité : ${clientPayment}\n`;
    if (clientNotes.trim()) {
      message += `• Consigne particulière : ${clientNotes.trim()}\n`;
    }
    message += `\n────────────────────────────\n`;
    message += `🛍️ *ARTICLES COMMANDÉS (${totalCount} pièce${totalCount > 1 ? 's' : ''})*\n\n`;
    
    cart.forEach((item, index) => {
      const unitPrice = item.product.price ?? item.product.priceUsd ?? 0;
      const itemPrice = unitPrice * item.quantity;
      const imageUrl = item.selectedColor?.imageUrl || item.product.images?.primary;

      message += `*${index + 1}. ${item.product.name.toUpperCase()}*\n`;
      message += `   • Réf produit : ${item.product.id}\n`;
      message += `   • Taille : ${item.selectedSize}\n`;
      message += `   • Coloris : ${item.selectedColor.name}\n`;
      message += `   • Quantité : ${item.quantity}\n`;
      message += `   • Prix unitaire : ${formatPrice(unitPrice)}\n`;
      message += `   • Total ligne : ${formatPrice(itemPrice)}\n`;
      if (imageUrl && imageUrl.startsWith('http')) {
        message += `   • Visuel : ${imageUrl}\n`;
      }
      message += `\n`;
    });

    message += `────────────────────────────\n`;
    message += `💰 *RÉCAPITULATIF FINANCIER*\n`;
    message += `• Sous-total articles : ${formatPrice(subtotal)}\n`;
    if (discount > 0) {
      message += `• Remise promo (${promoCode}) : -${formatPrice(discount)}\n`;
    }
    message += `• Frais d'expédition : ${isFreeShippingQualified ? 'Gratuite (Offerte dès 90 000 FCFA)' : formatPrice(SHIPPING_FEE)}\n`;
    message += `• *TOTAL NET À PAYER :* *${formatPrice(calculatedTotal)}*\n`;
    message += `────────────────────────────\n\n`;
    message += `✅ *Statut :* Commande vérifiée depuis la boutique en ligne.\n`;
    message += `Bonjour ! Merci de me confirmer la prise en charge de ma commande et de m'indiquer vos coordonnées de paiement pour valider l'expédition.`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

    // Simuler un léger délai pour le retour visuel puis redirection
    setTimeout(() => {
      setIsCheckingOut(false);
      window.open(whatsappUrl, '_blank');
    }, 600);
  };

  const amountNeededForFreeShipping = Math.max(0, 90000 - subtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl p-6 flex flex-col justify-between animate-slide-left border-l border-black/10">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-black/10">
            <div>
              <h2 className="text-lg font-display font-black tracking-tight uppercase">
                SHOPPING BAG
              </h2>
              <p className="text-xs text-neutral-500 font-mono">
                {totalCount} {totalCount === 1 ? 'ARTICLE' : 'ARTICLES'} DANS VOTRE PANIER
              </p>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-neutral-500 hover:text-black rounded-full hover:bg-neutral-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {checkoutComplete ? (
            /* Checkout Success State */
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="font-display font-black text-xl uppercase">COMMANDE CONFIRMÉE</h3>
              <p className="text-xs font-mono text-neutral-600 max-w-xs">
                Votre commande #CKENNEDY-{Math.floor(100000 + Math.random() * 900000)} a été enregistrée. Les détails de livraison vous seront envoyés par e-mail.
              </p>
              <button
                onClick={() => {
                  setCheckoutComplete(false);
                  setIsCartOpen(false);
                }}
                className="bg-black text-white px-6 py-2.5 rounded-full text-xs font-mono uppercase tracking-wider hover:bg-neutral-800 transition-colors"
              >
                Continue Browsing
              </button>
            </div>
          ) : (
            <>
              {/* Free Shipping Tracker */}
              <div className="my-3 bg-neutral-50 p-3.5 rounded-2xl border border-neutral-200">
                <div className="flex justify-between text-xs font-semibold mb-1.5 font-mono">
                  <span>
                    {isFreeShippingQualified
                      ? 'Livraison gratuite débloquée'
                      : `Plus que ${formatPrice(amountNeededForFreeShipping)} pour la livraison gratuite`}
                  </span>
                  <span className={isFreeShippingQualified ? 'text-emerald-600' : 'text-neutral-500'}>
                    {freeShippingProgress}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-black transition-all duration-500"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>

              {/* Cart Item List */}
              <div className="flex-1 overflow-y-auto space-y-4 py-2 pr-1">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-400 space-y-3">
                    <ShoppingBag className="w-12 h-12 stroke-[1.2]" />
                    <p className="text-xs font-mono uppercase tracking-wider">
                      Votre panier est vide.
                    </p>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="bg-black text-white px-5 py-2 rounded-full text-xs font-mono uppercase"
                    >
                      Explore Gear
                    </button>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={`${item.product.id}-${item.selectedSize}-${item.selectedColor?.name || 'def'}`}
                      className="flex space-x-3.5 border-b border-neutral-100 pb-4"
                    >
                      <div className="w-20 h-24 bg-neutral-100 rounded-xl overflow-hidden flex-shrink-0 border border-black/5">
                        <img
                          src={item.selectedColor?.imageUrl || item.product.images?.cartThumbnail || item.product.images?.primary}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 flex-col justify-between flex">
                        <div>
                          <div className="flex justify-between items-start">
                            <h3 className="text-xs font-bold uppercase tracking-tight">
                              {item.product.name}
                            </h3>
                            <span className="text-xs font-mono font-bold">
                              {formatPrice((item.product.price ?? item.product.priceUsd ?? 0) * item.quantity)}
                            </span>
                          </div>
                          <p className="text-[11px] text-neutral-500 font-mono mt-0.5">
                            {item.selectedColor && item.selectedColor.name !== 'Standard'
                              ? `Couleur : ${item.selectedColor.name} • `
                              : ''}
                            Taille : {item.selectedSize}
                          </p>
                        </div>

                        <div className="flex items-center justify-between text-xs pt-2">
                          <div className="flex items-center bg-neutral-100 rounded-lg border border-neutral-200 font-mono text-xs">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.selectedSize,
                                  item.selectedColor.name,
                                  -1
                                )
                              }
                              className="w-6 h-6 flex items-center justify-center hover:bg-neutral-200 text-neutral-600"
                            >
                              −
                            </button>
                            <span className="w-6 text-center font-bold text-[11px]">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.selectedSize,
                                  item.selectedColor.name,
                                  1
                                )
                              }
                              className="w-6 h-6 flex items-center justify-center hover:bg-neutral-200 text-neutral-600"
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() =>
                              removeFromCart(
                                item.product.id,
                                item.selectedSize,
                                item.selectedColor.name
                              )
                            }
                            className="text-[11px] text-neutral-400 hover:text-red-500 underline font-mono flex items-center space-x-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Promo Code Bar */}
              {cart.length > 0 && (
                <div className="pt-2 border-t border-neutral-100">
                  {promoCode ? (
                    <div className="flex justify-between items-center bg-emerald-50 text-emerald-800 p-2.5 rounded-xl text-xs font-mono">
                      <span className="flex items-center">
                        <Tag className="w-3.5 h-3.5 mr-1.5" />
                        Code '{promoCode}' active
                      </span>
                      <button
                        onClick={removePromoCode}
                        className="text-[11px] underline text-emerald-900 hover:text-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyPromo} className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="PROMO CODE (e.g. CKENNEDY10)"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        className="flex-1 bg-neutral-100 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-mono uppercase focus:outline-none focus:ring-1 focus:ring-black"
                      />
                      <button
                        type="submit"
                        className="bg-black text-white px-4 py-2 rounded-xl text-xs font-mono uppercase hover:bg-neutral-800"
                      >
                        Apply
                      </button>
                    </form>
                  )}
                  {promoMessage && (
                    <p
                      className={`text-[10px] font-mono mt-1 ${
                        promoMessage.isError ? 'text-red-500' : 'text-emerald-600'
                      }`}
                    >
                      {promoMessage.text}
                    </p>
                  )}
                </div>
              )}

              {/* Formulaire de livraison précis pour le client et le vendeur */}
              {cart.length > 0 && (
                <div className="my-3 bg-neutral-50 border border-neutral-200/80 rounded-2xl p-3.5 space-y-3 font-mono text-xs">
                  <div
                    onClick={() => setShowDeliveryForm(!showDeliveryForm)}
                    className="flex justify-between items-center cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-black">
                      <Truck className="w-4 h-4 text-emerald-600" />
                      <span>Coordonnées de livraison</span>
                    </div>
                    <span className="text-[10px] text-neutral-500 flex items-center gap-1">
                      {clientName && clientPhone ? (
                        <span className="text-emerald-600 font-bold">✓ Renseigné</span>
                      ) : (
                        <span>Facultatif</span>
                      )}
                      {showDeliveryForm ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </span>
                  </div>

                  {showDeliveryForm && (
                    <div className="space-y-2.5 pt-2 border-t border-neutral-200/60">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {/* Nom du client */}
                        <div>
                          <label className="block text-[10px] uppercase text-neutral-500 mb-1 font-bold">
                            Votre Nom
                          </label>
                          <div className="relative">
                            <User className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                              type="text"
                              value={clientName}
                              onChange={(e) => setClientName(e.target.value)}
                              placeholder="ex: Jean Dupont"
                              className="w-full bg-white border border-neutral-200 rounded-xl pl-8 pr-2.5 py-1.5 text-xs text-black focus:outline-none focus:border-black font-sans"
                            />
                          </div>
                        </div>

                        {/* Téléphone WhatsApp */}
                        <div>
                          <label className="block text-[10px] uppercase text-neutral-500 mb-1 font-bold">
                            Numéro WhatsApp
                          </label>
                          <div className="relative">
                            <Phone className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                              type="tel"
                              value={clientPhone}
                              onChange={(e) => setClientPhone(e.target.value)}
                              placeholder="ex: +237 690 00 00 00"
                              className="w-full bg-white border border-neutral-200 rounded-xl pl-8 pr-2.5 py-1.5 text-xs text-black focus:outline-none focus:border-black font-mono"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Ville et Quartier de livraison */}
                      <div>
                        <label className="block text-[10px] uppercase text-neutral-500 mb-1 font-bold">
                          Ville & Quartier de livraison (Cameroun)
                        </label>
                        <div className="relative">
                          <MapPin className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            type="text"
                            value={clientCity}
                            onChange={(e) => setClientCity(e.target.value)}
                            placeholder="ex: Douala (Akwa) ou Yaoundé (Bastos)"
                            className="w-full bg-white border border-neutral-200 rounded-xl pl-8 pr-2.5 py-1.5 text-xs text-black focus:outline-none focus:border-black font-sans"
                          />
                        </div>
                      </div>

                      {/* Moyen de paiement préféré */}
                      <div>
                        <label className="block text-[10px] uppercase text-neutral-500 mb-1 font-bold">
                          Mode de règlement souhaité
                        </label>
                        <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                          {(['Orange Money', 'MTN Mobile Money', 'Espèces à la livraison'] as const).map((mode) => (
                            <button
                              key={mode}
                              type="button"
                              onClick={() => setClientPayment(mode)}
                              className={`py-1.5 px-1.5 rounded-xl border text-center transition-all cursor-pointer font-sans leading-tight ${
                                clientPayment === mode
                                  ? 'bg-black text-white border-black font-bold shadow-sm'
                                  : 'bg-white text-neutral-700 border-neutral-200 hover:border-black/40'
                              }`}
                            >
                              {mode === 'Orange Money' ? '🟠 OM' : mode === 'MTN Mobile Money' ? '🟡 MoMo' : '💵 Cash'}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Note spéciale */}
                      <div>
                        <label className="block text-[10px] uppercase text-neutral-500 mb-1 font-bold">
                          Consigne spéciale (facultatif)
                        </label>
                        <input
                          type="text"
                          value={clientNotes}
                          onChange={(e) => setClientNotes(e.target.value)}
                          placeholder="ex: Appeler avant d'arriver, livraison après 17h"
                          className="w-full bg-white border border-neutral-200 rounded-xl px-2.5 py-1.5 text-xs text-black focus:outline-none focus:border-black font-sans"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Checkout Summary Footer */}
              {cart.length > 0 && (
                <div className="pt-3 border-t border-black/10 space-y-2.5">
                  <div className="flex justify-between text-xs font-mono text-neutral-600">
                    <span>SUBTOTAL</span>
                    <span className="font-bold text-black">{formatPrice(subtotal)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-xs font-mono text-emerald-600">
                      <span>DISCOUNT</span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-xs font-mono text-neutral-600">
                    <span>LIVRAISON</span>
                    <span>{isFreeShippingQualified ? 'GRATUITE' : formatPrice(SHIPPING_FEE)}</span>
                  </div>

                  <div className="pt-2 border-t border-neutral-100 flex justify-between text-sm font-mono font-bold text-black">
                    <span>TOTAL ESTIMÉ</span>
                    <span>{formatPrice(total + (isFreeShippingQualified ? 0 : SHIPPING_FEE))}</span>
                  </div>

                  <button
                    onClick={handleCompleteCheckout}
                    disabled={isCheckingOut}
                    className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-black font-black text-xs font-mono tracking-widest py-3.5 rounded-full transition-all uppercase flex justify-center items-center space-x-2 cursor-pointer shadow-lg active:scale-98"
                  >
                    {isCheckingOut ? (
                      <span>OUVERTURE DE WHATSAPP...</span>
                    ) : (
                      <>
                        <MessageCircle className="w-4 h-4 text-black fill-black/10" />
                        <span>Commander sur WhatsApp</span>
                        <ArrowRight className="w-3.5 h-3.5 text-black" />
                      </>
                    )}
                  </button>

                  <div className="text-[10px] font-mono text-center text-neutral-400 flex items-center justify-center space-x-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>FINALISATION DIRECTE (OM • MOMO • VIREMENT • ESPÈCES)</span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
