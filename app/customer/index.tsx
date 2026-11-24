import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Image, Linking, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../src/theme/colors';
import { useStore, getApiUrl, resolveProductImageUrl } from '../../src/store/useStore';
import { Send, Truck, ChevronRight, ChevronLeft, X, ZoomIn } from 'lucide-react-native';
import { ChatMessage, Customer, Address, Product } from '../../src/store/types';
import { SERVICEABLE_PINCODES } from '../../src/store/mockData';
import { useRouter } from 'expo-router';
import RazorpayCheckout from 'react-native-razorpay';

export interface DiaperSpecs {
  size: string;
  weightCapacity: string;
  recommendedAge: string;
  packCount: string;
  style: string;
}

export interface TrialSizeInfo {
  id: string;
  label: string;
  weight: string;
  age: string;
}

export const TRIAL_SIZES: TrialSizeInfo[] = [
  { id: 'PB', label: 'Premie (PB)', weight: '1.5 – 3 kg', age: 'Premature / Early Newborn' },
  { id: 'NB', label: 'Newborn (NB)', weight: '<= 5 kg (Up to 5 kg)', age: '0 – 3 Months' },
  { id: 'S', label: 'Small (S)', weight: '4 – 8 kg', age: '1 – 6 Months' },
  { id: 'M', label: 'Medium (M)', weight: '6 – 11 kg', age: '5 – 12 Months' },
  { id: 'L', label: 'Large (L)', weight: '9 – 14 kg', age: '9 – 24 Months' },
  { id: 'XL', label: 'Extra Large (XL)', weight: '12 – 17 kg', age: '18 – 36 Months' },
  { id: 'XXL', label: 'Double Extra Large (XXL)', weight: '15 – 25 kg', age: '2 – 4 Years' },
  { id: 'XXXL', label: 'Triple Extra Large (XXXL)', weight: '18 – 35 kg', age: '3 – 5+ Years' },
];

export const isTrialOrSampleProduct = (product: Product): boolean => {
  const name = (product.name || '').toLowerCase();
  const id = (product.id || '').toLowerCase();
  return name.includes('sample') || name.includes('trial') || name.includes('pack of 2') || id.includes('sample') || id.includes('trial');
};

export const getDiaperSpecs = (product: Product, selectedTrialSizeId?: string): DiaperSpecs => {
  const name = (product.name || '').toLowerCase();
  const id = (product.id || '').toLowerCase();
  const pack = product.packSize && product.packSize !== '1' ? product.packSize : 'Pack of 2';
  const categoryStyle = product.category || (name.includes('velcro') ? 'Tape & Velcro Style' : 'Pant-Style');

  // If this is a trial/sample pack with multiple size options
  if (isTrialOrSampleProduct(product)) {
    if (selectedTrialSizeId) {
      const match = TRIAL_SIZES.find(s => s.id === selectedTrialSizeId);
      if (match) {
        return {
          size: match.label,
          weightCapacity: match.weight,
          recommendedAge: match.age,
          packCount: pack.includes('Pack') ? pack : `Pack of ${pack}`,
          style: categoryStyle
        };
      }
    }
    return {
      size: 'Trial Sizes (PB to XXXL)',
      weightCapacity: '1.5 – 35 kg (Choose Size)',
      recommendedAge: 'All Baby Stages',
      packCount: pack.includes('Pack') ? pack : `Pack of ${pack}`,
      style: categoryStyle
    };
  }

  // Premie (PB): 1.5 - 3 kg
  if (id.includes('pb') || name.includes('premie') || name.includes('premature') || name.includes('(pb)')) {
    return {
      size: 'Premie (PB)',
      weightCapacity: '1.5 – 3 kg',
      recommendedAge: 'Premature / Early Newborn',
      packCount: pack || '30 pcs',
      style: 'Tape & Velcro Style'
    };
  }
  // Newborn (NB): <= 5 kg
  if (id.includes('nb') || name.includes('newborn') || name.includes('(nb)')) {
    return {
      size: 'Newborn (NB)',
      weightCapacity: '<= 5 kg (Up to 5 kg)',
      recommendedAge: '0 – 3 Months',
      packCount: pack || '36 & 72 pcs',
      style: 'Tape & Velcro Style'
    };
  }
  // XXXL: 18 - 35 kg
  if (id.includes('xxxl') || name.includes('xxxl') || name.includes('triple extra large')) {
    return {
      size: 'Triple Extra Large (XXXL)',
      weightCapacity: '18 – 35 kg',
      recommendedAge: '3 – 5+ Years',
      packCount: pack || '40 pcs',
      style: product.category || 'Pant-Style'
    };
  }
  // XXL: 15 - 25 kg
  if (id.includes('xxl') || name.includes('xxl') || name.includes('double extra large')) {
    return {
      size: 'Double Extra Large (XXL)',
      weightCapacity: '15 – 25 kg',
      recommendedAge: '2 – 4 Years',
      packCount: pack || '44 pcs',
      style: product.category || 'Pant-Style'
    };
  }
  // XL: 12 - 17 kg
  if (id.includes('xl') || name.includes('extra large') || name.includes('(xl)')) {
    return {
      size: 'Extra Large (XL)',
      weightCapacity: '12 – 17 kg',
      recommendedAge: '18 – 36 Months',
      packCount: pack || '48 pcs',
      style: product.category || 'Pant-Style'
    };
  }
  // Large (L): 9 - 14 kg
  if (id.includes('-l-') || name.includes('large') || name.includes('(l)')) {
    return {
      size: 'Large (L)',
      weightCapacity: '9 – 14 kg',
      recommendedAge: '9 – 24 Months',
      packCount: pack || '52 pcs',
      style: product.category || 'Pant-Style'
    };
  }
  // Medium (M): 6 - 11 kg
  if (id.includes('-m-') || name.includes('medium') || name.includes('(m)')) {
    return {
      size: 'Medium (M)',
      weightCapacity: '6 – 11 kg',
      recommendedAge: '5 – 12 Months',
      packCount: pack || (id.includes('velcro') ? '52 pcs' : '56 pcs'),
      style: id.includes('velcro') ? 'Tape & Velcro Style' : 'Pant-Style'
    };
  }
  // Small (S): 4 - 8 kg
  if (id.includes('-s-') || name.includes('small') || name.includes('(s)')) {
    return {
      size: 'Small (S)',
      weightCapacity: '4 – 8 kg',
      recommendedAge: '1 – 6 Months',
      packCount: pack || '62 pcs',
      style: id.includes('velcro') ? 'Tape & Velcro Style' : 'Pant-Style'
    };
  }

  return {
    size: pack || 'Standard Size',
    weightCapacity: 'Standard Fit',
    recommendedAge: 'Baby & Toddler',
    packCount: pack || 'Pack of 2',
    style: categoryStyle
  };
};

export default function CustomerChatScreen() {
  const router = useRouter();
  const {
    chatMessages, addChatMessage, chatState, setChatState,
    products, addToCart, updateCartQuantity, cart, clearCart,
    customers, currentCustomer, setCurrentCustomer,
    currentAddress, setCurrentAddress, saveNewCustomer, createOrder, markOrderAsPaid,
    orders, deliveryPartners,
    coupons, appliedCoupon, applyCoupon, removeCoupon, getCartTotal
  } = useStore();

  const [inputText, setInputText] = useState('');
  const [couponInput, setCouponInput] = useState('');
  const [tempCustomer, setTempCustomer] = useState<Partial<Customer>>({});
  const [tempAddress, setTempAddress] = useState<Partial<Address>>({});
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [selectedProductForEnlarge, setSelectedProductForEnlarge] = useState<Product | null>(null);
  const [selectedTrialSize, setSelectedTrialSize] = useState<string>('M');
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [isFullScreenZoom, setIsFullScreenZoom] = useState<boolean>(false);
  const flatListRef = useRef<FlatList>(null);
  const galleryTouchRef = useRef<number>(0);

  const getProductImageList = (p: Product | null): string[] => {
    if (!p) return [];
    if (p.images && Array.isArray(p.images) && p.images.length > 0) {
      return p.images;
    }
    const nameLower = (p.name || '').toLowerCase();
    const isPantS = p.id === 'pant-s-62' || p.id === 'pant-s' || ((nameLower.includes('(s)') || nameLower.includes('small')) && (p.category === 'Pant-Style' || nameLower.includes('pant')));
    if (isPantS) {
      return [
        p.imageUrl || '/public/images/(P)S-62.jpg',
        '/public/images/(P)S-62-1.jpg',
        '/public/images/(P)S-62-2.jpg',
        '/public/images/(P)S-62-3.jpg'
      ];
    }
    return p.imageUrl ? [p.imageUrl] : [];
  };

  // Find active order for the current customer
  const activeOrder = currentCustomer
    ? orders.find(o => o.customerId === currentCustomer.id && o.status !== 'DELIVERED' && o.status !== 'CANCELLED')
    : null;

  const activePartner = activeOrder?.deliveryPartnerId ? deliveryPartners.find(dp => dp.id === activeOrder.deliveryPartnerId) : null;

  useEffect(() => {
    // When returning from address form, chatState is set to PAYMENT.
    // If the last message isn't already the checkout message, add it.
    if (chatState === 'PAYMENT') {
      const messages = useStore.getState().chatMessages;
      const lastMsg = messages[messages.length - 1];
      if (lastMsg?.type !== 'checkout') {
        addChatMessage({
          sender: 'bot',
          text: 'Location & details confirmed! 📍\n\nPlease select a payment method to complete your order:',
          type: 'checkout'
        });
      }
    }
  }, [chatState]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    const text = inputText.trim();

    addChatMessage({ sender: 'user', text, type: 'text' });
    setInputText('');

    setTimeout(() => {
      processStatefulResponse(text);
    }, 800);
  };

  const handleTextChange = (text: string) => {
    if (chatState === 'CHECKING_PINCODE') {
      const numeric = text.replace(/[^0-9]/g, '');
      setInputText(numeric.slice(0, 6));
    } else if (chatState === 'COLLECTING_CUSTOMER_DETAILS') {
      let filtered = text.replace(/[^0-9]/g, '');
      filtered = filtered.replace(/^[^6-9]+/, '');
      filtered = filtered.replace(/(.)\1{3,}/g, '$1$1$1');
      setInputText(filtered.slice(0, 10));
    } else if (chatState === 'COLLECTING_CUSTOMER_DETAILS_NAME') {
      let filtered = text.replace(/[^a-zA-Z\s]/g, '');
      filtered = filtered.replace(/(.)\1{3,}/gi, '$1$1$1');
      setInputText(filtered);
    } else {
      setInputText(text);
    }
  };

  const processStatefulResponse = async (text: string) => {
    const lowerText = text.toLowerCase();
    const currentState = useStore.getState().chatState;

    if (currentState === 'CHECKING_PINCODE') {
      const pin = text.trim();
      if (SERVICEABLE_PINCODES.includes(pin)) {
        useStore.setState({ tempCustomer: { pincode: pin } });
        addChatMessage({
          sender: 'bot',
          text: 'Great! 🎉 We deliver to this location.\n\nPlease enter your 10-digit mobile number so we can reach you.',
          type: 'text'
        });
        setChatState('COLLECTING_CUSTOMER_DETAILS');
      } else {
        addChatMessage({
          sender: 'bot',
          text: "We're sorry! 💚\n\nAt the moment, Nappee Diapers offers direct delivery only within Mysore.\n\nWe're working towards expanding our delivery coverage.\n\nYou can still explore our complete range and place your order through our official website.",
          type: 'link',
          linkText: 'Visit nappee Website',
          linkUrl: 'https://www.nappee.com/'
        });
        setChatState('WELCOME');
      }
      return;
    }

    // Handle phone number input
    if (currentState === 'COLLECTING_CUSTOMER_DETAILS') {
      const phoneStr = text.trim();
      const isValidPhone = /^[6-9]\d{9}$/.test(phoneStr) && !/(.)\1{3}/.test(phoneStr);

      if (isValidPhone) {
        
        try {
          const res = await fetch(`${getApiUrl('diapers')}/api/customers`);
          if (res.ok) {
            const data = await res.json();
            useStore.setState({ customers: data });
          }
        } catch (e) {
          console.error('Failed to sync customers before login:', e);
        }

        const latestCustomers = useStore.getState().customers;
        const existing = latestCustomers.find(c => c.phone === phoneStr);
        const savedPin = useStore.getState().tempCustomer?.pincode || '570001';
        useStore.setState((state) => ({ tempCustomer: { ...state.tempCustomer, phone: phoneStr, name: existing?.name || '' } }));

        if (existing) {
          useStore.getState().setCurrentCustomer(existing);
          if (existing.addresses && existing.addresses.length > 0) {
            addChatMessage({
              sender: 'bot',
              text: `Welcome back, ${existing.name}! 💚\n\nPlease select your delivery location:`,
              type: 'address_selection',
              existingAddresses: existing.addresses
            });
          } else {
            addChatMessage({
              sender: 'bot',
              text: `Welcome back, ${existing.name}! 💚\n\nPlease provide your delivery details to get started.`,
              type: 'location_prompt',
              pincode: savedPin
            });
          }
          setChatState('WAITING_FOR_LOCATION');
        } else {
          addChatMessage({
            sender: 'bot',
            text: 'Thanks! What is your full name?',
            type: 'text'
          });
          setChatState('COLLECTING_CUSTOMER_DETAILS_NAME');
        }
      } else {
        addChatMessage({
          sender: 'bot',
          text: 'Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9. The same digit cannot repeat continuously more than 3 times.',
          type: 'text'
        });
      }
      return;
    }

    if (currentState === 'COLLECTING_CUSTOMER_DETAILS_NAME') {
      const nameStr = text.trim();
      const savedPin = useStore.getState().tempCustomer?.pincode || '570001';
      useStore.setState((state) => ({ tempCustomer: { ...state.tempCustomer, name: nameStr } }));

      addChatMessage({
        sender: 'bot',
        text: `Nice to meet you, ${nameStr}! 🌿\n\nPlease provide your delivery details to get started.`,
        type: 'location_prompt',
        pincode: savedPin
      });
      setChatState('WAITING_FOR_LOCATION');
      return;
    }

    // Legacy states can be ignored as address-form handles them now
    if (['COLLECTING_ADDRESS', 'ADDRESS_CONFIRMATION'].includes(currentState)) {
      showOrderSummary();
      return;
    }

    // Advanced intent matching
    if (lowerText.includes('hi') || lowerText.includes('hello')) {
      addChatMessage({
        sender: 'bot',
        text: 'Hello! 👋 Welcome to Nappee Diapers. How can we help you today?',
        type: 'text'
      });
      setChatState('WELCOME');
    } else if (lowerText.includes('product') || lowerText.includes('shop') || lowerText.includes('buy')) {
      addChatMessage({
        sender: 'bot',
        text: 'What kind of diapers are you looking for?',
        type: 'category_selection'
      });
      setChatState('SELECTING_CATEGORY');
    } else if (currentState === 'SELECTING_CATEGORY' && (lowerText.includes('pant') || lowerText.includes('velcro'))) {
      const type = lowerText.includes('pant') ? 'Pant-Style' : 'Velcro Style';
      addChatMessage({
        sender: 'bot',
        text: `Here are our available ${type} Nappee Diapers:`,
        type: 'products',
        category: type
      });
      setChatState('BROWSING_PRODUCTS');
    } else if (lowerText.includes('track') || lowerText.includes('where is my order') || lowerText.includes('status')) {
      const state = useStore.getState();
      const currentCustomer = state.currentCustomer;
      const orders = state.orders;
      const deliveryPartners = state.deliveryPartners;
      const activeOrder = currentCustomer ? orders.find(o => o.customerId === currentCustomer.id && o.status !== 'DELIVERED' && o.status !== 'CANCELLED') : null;

      if (activeOrder) {
        let msg = `Your order ${activeOrder.id} is currently: ${activeOrder.status.replace(/_/g, ' ')}. 🌿\n\nWe'll let you know once it progresses.`;
        if (activeOrder.status === 'PREPARING') {
          msg = `Your order ${activeOrder.id} is currently being prepared. 🌿\n\nWe'll let you know once it has been packed and dispatched.`;
        } else if (activeOrder.status === 'OUT_FOR_DELIVERY') {
          const partner = deliveryPartners.find(dp => dp.id === activeOrder.deliveryPartnerId);
          msg = `🚚 Your order is currently out for delivery.\n\nDelivery Partner:\n${partner?.name || 'Assigned Agent'}\n${partner?.phone || ''}`;
        }
        addChatMessage({ sender: 'bot', text: msg, type: 'text' });
      } else {
        const lastOrder = currentCustomer ? orders.find(o => o.customerId === currentCustomer.id) : null;
        if (lastOrder && lastOrder.status === 'DELIVERED') {
          addChatMessage({ sender: 'bot', text: `🌿 Your last order ${lastOrder.id} has been delivered successfully.\n\nThank you for shopping with nappee. 💚`, type: 'text' });
        } else {
          addChatMessage({ sender: 'bot', text: "You don't have any active orders right now. Would you like to shop for products?", type: 'text' });
        }
      }
      setChatState('WELCOME');
    } else if (lowerText.includes('order') || lowerText.includes('history')) {
      router.push('/customer/orders');
    } else if (lowerText.includes('cart')) {
      const latestCart = useStore.getState().cart;
      if (latestCart.length > 0) {
        addChatMessage({ sender: 'bot', text: "Here is your cart:", type: 'cart' });
      } else {
        addChatMessage({ sender: 'bot', text: "Your cart is empty. Would you like to see our products?", type: 'text' });
      }
    } else {
      const matchedCoupon = useStore.getState().coupons.find(c => lowerText.toUpperCase().includes(c.code.toUpperCase()));
      if (matchedCoupon) {
        const res = useStore.getState().applyCoupon(matchedCoupon.code);
        if (res.success) {
          addChatMessage({ sender: 'bot', text: `Coupon ${matchedCoupon.code} added to cart. 🛒`, type: 'text' });
        } else {
          addChatMessage({ sender: 'bot', text: res.message, type: 'text' });
        }
      } else {
        // AI Fallback Integration
        
        const API_URL = getApiUrl('diapers');
        const customerId = useStore.getState().currentCustomer?.phone || 'mobile_user';
        
        try {
          // Show typing indicator or just wait (it's fast enough)
          const res = await fetch(`${API_URL}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text, customerId })
          });
          
          if (res.ok) {
            const data = await res.json();
            addChatMessage({
              sender: 'bot',
              text: data.reply,
              type: 'text'
            });
          } else {
            throw new Error("Failed to connect to AI");
          }
        } catch (err) {
          console.error("AI Chat Error:", err);
          addChatMessage({
            sender: 'bot',
            text: "I'm having trouble thinking right now. But I can still help you shop, track an order, or check delivery! 🌿",
            type: 'text'
          });
        }
      }
    }
  };

  const showOrderSummary = () => {
    addChatMessage({
      sender: 'bot',
      text: "Here is your order summary. Please select a payment method to complete your order.",
      type: 'checkout'
    });
    setChatState('PAYMENT');
  };

  const handlePayment = async () => {
    if (isProcessingPayment) return;
    setIsProcessingPayment(true);
    
    addChatMessage({
      sender: 'bot',
      text: "Connecting to secure payment gateway...",
      type: 'text'
    });

    try {
      // 1. Create PENDING Order in Zustand & Database
      const nappeeOrderId = await createOrder('RAZORPAY');
      
      // 2. Fetch Razorpay Order ID from Backend
      const { Platform } = require('react-native');
      
      const API_URL = getApiUrl('diapers');
      const response = await fetch(`${API_URL}/api/payments/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: nappeeOrderId })
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || "Failed to create payment order");
      }
      
      // 3. Configure Razorpay Checkout
      const options = {
        description: 'nappee diapers Order',
        image: 'https://nappee-diapers.com/logo.png', // Optional branding
        currency: data.currency,
        key: data.keyId,
        amount: data.amount,
        name: 'Nappee Diapers',
        order_id: data.razorpayOrderId,
        prefill: {
          email: 'customer@nappeediapers.com',
          contact: currentCustomer?.phone || '',
          name: currentCustomer?.name || ''
        },
        theme: { color: colors.primary }
      };
      
      // 4. Open Checkout
      if (Platform.OS === 'web') {
        // --- Web Checkout Flow ---
        const loadRazorpay = () => {
          return new Promise((resolve) => {
            if ((window as any).Razorpay) return resolve(true);
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
          });
        };
        
        const isSdkLoaded = await loadRazorpay();
        if (!isSdkLoaded) throw new Error("Razorpay SDK failed to load. Are you online?");
        
        const webOptions = {
          ...options,
          handler: async function (paymentData: any) {
            try {
              const verifyRes = await fetch(`${API_URL}/api/payments/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  orderId: nappeeOrderId,
                  razorpayPaymentId: paymentData.razorpay_payment_id,
                  razorpayOrderId: paymentData.razorpay_order_id,
                  razorpaySignature: paymentData.razorpay_signature
                })
              });
              
              const verifyData = await verifyRes.json();
              
              if (verifyData.success) {
                markOrderAsPaid(nappeeOrderId, 'RAZORPAY_UPI');
                addChatMessage({
                  sender: 'bot',
                  text: `🎉 Payment Successful!\n\nThank you for choosing Nappee Diapers. 💚\nYour order has been successfully placed.\n\nOrder ID: ${nappeeOrderId}\nPayment ID: ${paymentData.razorpay_payment_id}\n\nYour order is now being prepared with care.\nWe'll keep you updated right here.`,
                  type: 'text'
                });
                setChatState('ORDER_CONFIRMED');
              } else {
                throw new Error("Payment verification failed securely.");
              }
            } catch (err: any) {
              console.error("Web Verification Error:", err);
            } finally {
              setIsProcessingPayment(false);
            }
          }
        };
        
        const rzp = new (window as any).Razorpay(webOptions);
        rzp.on('payment.failed', function (response: any) {
          console.error("Razorpay Web Error:", response.error);
          addChatMessage({
            sender: 'bot',
            text: `Payment could not be completed. Your order has not been marked as paid. You can try again securely.`,
            type: 'text'
          });
          setIsProcessingPayment(false);
        });
        
        // Handle user closing the modal without paying
        const originalClose = rzp.close;
        let paymentCompletedOrFailed = false;
        
        rzp.open();
        
      } else {
        // --- Native Mobile Checkout Flow ---
        RazorpayCheckout.open(options).then(async (paymentData: any) => {
          // Payment Success!
          // The backend webhook will ALSO verify this, but we verify here for the UI flow.
          const verifyRes = await fetch(`${API_URL}/api/payments/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
               orderId: nappeeOrderId,
               razorpayPaymentId: paymentData.razorpay_payment_id,
               razorpayOrderId: paymentData.razorpay_order_id,
               razorpaySignature: paymentData.razorpay_signature
            })
          });
          
          const verifyData = await verifyRes.json();
          
          if (verifyData.success) {
            markOrderAsPaid(nappeeOrderId, 'RAZORPAY_UPI');
            
            addChatMessage({
              sender: 'bot',
              text: `🎉 Payment Successful!\n\nThank you for choosing Nappee Diapers. 💚\nYour order has been successfully placed.\n\nOrder ID: ${nappeeOrderId}\nPayment ID: ${paymentData.razorpay_payment_id}\n\nYour order is now being prepared with care.\nWe'll keep you updated right here.`,
              type: 'text'
            });
            setChatState('ORDER_CONFIRMED');
          } else {
            throw new Error("Payment verification failed securely.");
          }
          setIsProcessingPayment(false);
        }).catch((error: any) => {
          // Payment Failed or Closed
          console.error("Razorpay Error:", error);
          addChatMessage({
            sender: 'bot',
            text: `Payment could not be completed. Your order has not been marked as paid. You can try again securely.`,
            type: 'text'
          });
          setIsProcessingPayment(false);
        });
      }
      
    } catch (err: any) {
      console.error(err);
      addChatMessage({
        sender: 'bot',
        text: `Error initiating payment: ${err.message}. Please try again.`,
        type: 'text'
      });
      setIsProcessingPayment(false);
    }
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isBot = item.sender === 'bot';

    return (
      <View style={[styles.messageRow, isBot ? styles.messageRowBot : styles.messageRowUser]}>
        {isBot && (
          <View style={styles.botAvatar}>
            <Image
              source={require('../../assets/logo.png')}
              style={{ width: 24, height: 24 }}
              resizeMode="contain"
            />
          </View>
        )}
        <View style={{ flex: 1 }}>
          {item.text ? (
            <View style={[
              styles.messageBubble, 
              isBot ? styles.bubbleBot : styles.bubbleUser,
              { alignSelf: isBot ? 'flex-start' : 'flex-end' }
            ]}>
              <Text style={[styles.messageText, isBot ? styles.textBot : styles.textUser]}>
                {typeof item.text === 'string' ? item.text : (item.text as any)?.text || JSON.stringify(item.text)}
              </Text>
            </View>
          ) : null}

          {item.type === 'add_to_cart_success' && (
            <TouchableOpacity
              style={styles.inlineCheckoutBtn}
              onPress={() => {
                addChatMessage({ sender: 'user', text: 'View Cart & Checkout' });
                setTimeout(() => processStatefulResponse('cart'), 100);
              }}
            >
              <Text style={styles.inlineCheckoutBtnText}>View Cart & Checkout ➔</Text>
            </TouchableOpacity>
          )}

          {item.type === 'location_prompt' && (
            <View style={{ marginTop: 12, flexDirection: 'column', gap: 10 }}>
              <TouchableOpacity
                style={[styles.primaryBtn, { marginTop: 0, paddingVertical: 12 }]}
                onPress={() => router.push(`/customer/location?pincode=${item.pincode || useStore.getState().tempCustomer?.pincode || '570001'}`)}
              >
                <Text style={styles.primaryBtnText}>📍 Use Current Location</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.primaryBtn, { marginTop: 0, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.primary, paddingVertical: 12 }]}
                onPress={() => router.push(`/customer/address-form`)}
              >
                <Text style={[styles.primaryBtnText, { color: colors.primary }]}>📝 Add New Address Manually</Text>
              </TouchableOpacity>
            </View>
          )}

          {item.type === 'address_selection' && item.existingAddresses && (
            <View style={{ marginTop: 12 }}>
              <TouchableOpacity
                style={[styles.primaryBtn, { marginTop: 0, paddingVertical: 12, marginBottom: 12 }]}
                onPress={() => router.push(`/customer/location?pincode=${useStore.getState().tempCustomer?.pincode || '570001'}`)}
              >
                <Text style={styles.primaryBtnText}>📍 Use Current Location</Text>
              </TouchableOpacity>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.carousel}>
                {item.existingAddresses.map((addr, idx) => (
                  <View key={idx} style={styles.addressCard}>
                    <View>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <Text style={{ fontWeight: '700', color: colors.darkPurple, fontSize: 14 }}>
                          {addr.addressType === 'HOME' ? '🏠 ' : addr.addressType === 'WORK' ? '🏢 ' : '📍 '}{addr.addressType || 'Saved Address'}
                        </Text>
                      </View>
                      <Text style={{ color: colors.text, marginBottom: 12, fontSize: 13, lineHeight: 18 }} numberOfLines={3}>
                        {addr.houseNumber}, {addr.buildingName ? addr.buildingName + ', ' : ''}{addr.street}, {addr.area}
                      </Text>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                      <TouchableOpacity 
                        style={[styles.primaryBtn, { marginTop: 0, paddingVertical: 10 }]} 
                        onPress={() => {
                          useStore.getState().setCurrentAddress(addr);
                          addChatMessage({ sender: 'user', text: `Deliver to ${addr.addressType || 'Saved Address'}` });
                          setTimeout(() => showOrderSummary(), 500);
                        }}
                      >
                        <Text style={styles.primaryBtnText}>Deliver Here</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </ScrollView>
              
              <TouchableOpacity 
                style={[styles.primaryBtn, { marginTop: 12, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.primary, paddingVertical: 12 }]} 
                onPress={() => router.push(`/customer/address-form`)}
              >
                <Text style={[styles.primaryBtnText, { color: colors.primary }]}>➕ Add New Address</Text>
              </TouchableOpacity>
            </View>
          )}

          {item.type === 'category_selection' && (
            <View style={{ marginTop: 12, flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity
                style={[styles.primaryBtn, { flex: 1, marginTop: 0, paddingVertical: 12 }]}
                onPress={() => {
                  addChatMessage({ sender: 'user', text: 'Pant-Style Diapers' });
                  setTimeout(() => processStatefulResponse('pant'), 100);
                }}
              >
                <Text style={styles.primaryBtnText}>👖 Pant-Style</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.primaryBtn, { flex: 1, marginTop: 0, paddingVertical: 12 }]}
                onPress={() => {
                  addChatMessage({ sender: 'user', text: 'Velcro Style Diapers' });
                  setTimeout(() => processStatefulResponse('velcro'), 100);
                }}
              >
                <Text style={styles.primaryBtnText}>🎀 Velcro Style</Text>
              </TouchableOpacity>
            </View>
          )}

          {item.type === 'products' && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.carousel}>
              {products.filter(p => p.active && (!item.category || (p.category === item.category || p.name.includes(item.category)))).map(p => {
                const isOut = p.stockStatus === 'OUT_OF_STOCK';
                const specs = getDiaperSpecs(p);
                return (
                  <View key={p.id} style={styles.productCard}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => {
                        setSelectedProductForEnlarge(p);
                        setActiveImageIndex(0);
                      }}
                      style={styles.productCardTouch}
                    >
                      <View style={styles.productImgContainer}>
                        {resolveProductImageUrl(p.imageUrl) ? (
                          <Image 
                            source={{ uri: resolveProductImageUrl(p.imageUrl)! }} 
                            style={styles.img} 
                            resizeMode="contain"
                          />
                        ) : (
                          <View style={[styles.img, { backgroundColor: p.imageFallback }]} />
                        )}
                      </View>
                      <Text style={styles.pName} numberOfLines={2}>{p.name}</Text>
                      <View style={styles.pMetaRow}>
                        <Text style={styles.pPrice}>₹{p.sellingPrice}</Text>
                        {p.mrp > p.sellingPrice && (
                          <Text style={styles.pMrp}>₹{p.mrp}</Text>
                        )}
                      </View>
                      <View style={styles.pWeightBadge}>
                        <Text style={styles.pWeightText} numberOfLines={1}>👶 {specs.weightCapacity}</Text>
                      </View>
                    </TouchableOpacity>
                    {isOut ? (
                      <Text style={styles.outOfStockText}>Currently Out of Stock</Text>
                    ) : (
                      <TouchableOpacity style={styles.btn} onPress={() => {
                        if (isTrialOrSampleProduct(p)) {
                          setSelectedProductForEnlarge(p);
                          setActiveImageIndex(0);
                        } else {
                          addToCart(p, 1);
                          addChatMessage({ sender: 'bot', text: `Added ${p.packSize} to your cart. 🛒`, type: 'add_to_cart_success' });
                        }
                      }}>
                        <Text style={styles.btnText}>{isTrialOrSampleProduct(p) ? 'Select Size ➔' : 'Add to Cart'}</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )
              })}
            </ScrollView>
          )}

          {item.type === 'cart' && cart.length > 0 && (
            <View style={styles.cardBlock}>
              {cart.map(c => (
                <View key={c.product.id} style={styles.row}>
                  <Text>{c.quantity}x {c.product.packSize}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ marginRight: 12 }}>₹{c.product.sellingPrice * c.quantity}</Text>
                    <TouchableOpacity onPress={() => updateCartQuantity(c.product.id, 0)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                      <Text style={{ color: 'red', fontWeight: 'bold', fontSize: 16 }}>✕</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}

              <View style={styles.divider} />
              <Text style={styles.boldText}>Coupons & Offers</Text>
              {appliedCoupon ? (
                <View style={styles.appliedCouponBox}>
                  <Text style={styles.appliedCouponText}>✓ {appliedCoupon.code} Applied</Text>
                  <TouchableOpacity onPress={removeCoupon}><Text style={styles.removeCouponText}>Remove</Text></TouchableOpacity>
                </View>
              ) : (
                <View>
                  <View style={styles.couponInputContainer}>
                    <TextInput
                      style={styles.couponInput}
                      placeholder="Enter coupon code"
                      value={couponInput}
                      onChangeText={setCouponInput}
                      autoCapitalize="characters"
                    />
                    <TouchableOpacity
                      style={styles.couponApplyBtn}
                      onPress={() => {
                        if (!couponInput.trim()) return;
                        const res = applyCoupon(couponInput.trim().toUpperCase());
                        if (res.success) {
                          setCouponInput('');
                        } else {
                          addChatMessage({ sender: 'bot', text: res.message, type: 'text' });
                        }
                      }}
                    >
                      <Text style={styles.couponApplyBtnText}>Apply</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              <View style={styles.divider} />

              <View style={styles.row}>
                <Text>Subtotal</Text>
                <Text>₹{getCartTotal().subtotal}</Text>
              </View>
              {appliedCoupon && (
                <View style={styles.row}>
                  <Text style={{ color: colors.primary }}>Coupon ({appliedCoupon.code})</Text>
                  <Text style={{ color: colors.primary }}>-₹{getCartTotal().discountAmount.toFixed(2)}</Text>
                </View>
              )}
              <View style={styles.row}>
                <Text>Delivery</Text>
                <Text>FREE</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.row}>
                <Text style={styles.boldText}>Total</Text>
                <Text style={styles.boldText}>₹{getCartTotal().total.toFixed(2)}</Text>
              </View>

              <TouchableOpacity style={styles.primaryBtn} onPress={() => {
                if (appliedCoupon) {
                  addChatMessage({ sender: 'bot', text: `✨ Great! ${appliedCoupon.code} has been applied.\n\nYou saved ₹${getCartTotal().discountAmount.toFixed(2)} on this order. 💚`, type: 'text' });
                }
                addChatMessage({ sender: 'bot', text: "Please enter your 6-digit delivery pincode (Mysore only).", type: 'text' });
                setChatState('CHECKING_PINCODE');
              }}>
                <Text style={styles.primaryBtnText}>Proceed to Checkout</Text>
              </TouchableOpacity>
            </View>
          )}



          {item.type === 'checkout' && (
            <View style={styles.cardBlock}>
              <Text style={styles.boldText}>Secure Payment (Razorpay)</Text>
              
              <TouchableOpacity 
                style={[styles.paymentBtn, isProcessingPayment && {opacity: 0.7}]} 
                onPress={handlePayment}
                disabled={isProcessingPayment}
              >
                <Text style={styles.paymentBtnText}>
                  {isProcessingPayment ? "Processing..." : `Pay ₹${getCartTotal().total.toFixed(2)} securely via UPI / Razorpay`}
                </Text>
              </TouchableOpacity>
              
            </View>
          )}

          {item.type === 'link' && (
            <TouchableOpacity style={styles.linkCard} onPress={() => item.linkUrl && Linking.openURL(item.linkUrl)}>
              <Text style={styles.linkText}>{item.linkText}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding" keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 80}>

      {activeOrder && (
        <TouchableOpacity style={styles.activeOrderCard} onPress={() => router.push(`/customer/tracking`)}>
          <View style={styles.activeOrderContent}>
            <View style={styles.activeOrderLeft}>
              <Truck size={20} color={colors.primary} />
              <View style={styles.activeOrderDetails}>
                <Text style={styles.activeOrderTitle}>Active Order {activeOrder.id}</Text>
                <Text style={styles.activeOrderStatus}>{activeOrder.status.replace(/_/g, ' ')}</Text>
                {activePartner && (
                  <Text style={styles.activeOrderPartner}>{activePartner.name} • {activePartner.phone}</Text>
                )}
              </View>
            </View>
            <ChevronRight size={20} color={colors.primary} />
          </View>
        </TouchableOpacity>
      )}

      <FlatList
        ref={flatListRef}
        data={chatMessages}
        extraData={{ products, activeOrder, chatState }}
        keyExtractor={item => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.chatList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
      />

      {chatState === 'ADDRESS_CONFIRMATION' && (
        <View style={styles.quickReplies}>
          <TouchableOpacity style={styles.qrBtn} onPress={() => { addChatMessage({ sender: 'user', text: 'Yes, Use This Address' }); processStatefulResponse('yes'); }}><Text style={styles.qrText}>Yes, Use This Address</Text></TouchableOpacity>
          <TouchableOpacity style={styles.qrBtn} onPress={() => { addChatMessage({ sender: 'user', text: 'Add New Address' }); processStatefulResponse('no'); }}><Text style={styles.qrText}>Add New Address</Text></TouchableOpacity>
        </View>
      )}

      <View style={styles.quickReplies}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity style={styles.qrBtn} onPress={() => { setInputText('🛍 Shop Products'); setTimeout(handleSend, 10); }}><Text style={styles.qrText}>🛍 Shop</Text></TouchableOpacity>
          <TouchableOpacity style={styles.qrBtn} onPress={() => { setInputText('📦 Track My Order'); setTimeout(handleSend, 10); }}><Text style={styles.qrText}>📦 Track</Text></TouchableOpacity>
          <TouchableOpacity style={styles.qrBtn} onPress={() => router.push('/customer/orders')}><Text style={styles.qrText}>📜 My Orders</Text></TouchableOpacity>
          <TouchableOpacity style={styles.qrBtn} onPress={() => { setInputText('🛒 My Cart'); setTimeout(handleSend, 10); }}><Text style={styles.qrText}>🛒 Cart</Text></TouchableOpacity>
        </ScrollView>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Message Nappee Diapers..."
          value={inputText}
          onChangeText={handleTextChange}
          onSubmitEditing={handleSend}
          keyboardType="default"
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Send size={20} color={colors.white} />
        </TouchableOpacity>
      </View>

      {/* Enlarged Product Details Modal */}
      <Modal
        visible={!!selectedProductForEnlarge}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedProductForEnlarge(null)}
      >
        <View style={styles.modalBackdrop}>
          <TouchableOpacity 
            style={styles.modalDismissArea} 
            activeOpacity={1} 
            onPress={() => setSelectedProductForEnlarge(null)} 
          />
          {selectedProductForEnlarge && (() => {
            const p = selectedProductForEnlarge;
            const isTrial = isTrialOrSampleProduct(p);
            const specs = getDiaperSpecs(p, isTrial ? selectedTrialSize : undefined);
            const isOut = p.stockStatus === 'OUT_OF_STOCK';
            
            // Collect all available product images for Amazon-style gallery
            const productImages = getProductImageList(p);
            const currentImgUri = productImages[activeImageIndex] || productImages[0];
            const resolvedMainImg = resolveProductImageUrl(currentImgUri);
            
            return (
              <View style={styles.modalCard}>
                {/* Header with Title and Close Button */}
                <View style={styles.modalHeader}>
                  <View style={{ flex: 1, paddingRight: 8 }}>
                    <Text style={styles.modalCategoryBadge}>{specs.style.toUpperCase()}</Text>
                    <Text style={styles.modalProductTitle} numberOfLines={2}>
                      {isTrial ? `${p.name} (Size ${selectedTrialSize})` : p.name}
                    </Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.modalCloseBtn}
                    onPress={() => setSelectedProductForEnlarge(null)}
                    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                  >
                    <X size={20} color={colors.text} />
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                  {/* Hero Enlarged Image Viewer with Amazon-style Navigation */}
                  <View 
                    style={styles.enlargedGalleryContainer}
                    onTouchStart={(e) => {
                      (galleryTouchRef as any).current = e.nativeEvent.pageX;
                    }}
                    onTouchEnd={(e) => {
                      const startX = (galleryTouchRef as any).current;
                      if (startX !== undefined) {
                        const diffX = e.nativeEvent.pageX - startX;
                        if (diffX < -30 && activeImageIndex < productImages.length - 1) {
                          setActiveImageIndex(prev => prev + 1);
                        } else if (diffX > 30 && activeImageIndex > 0) {
                          setActiveImageIndex(prev => prev - 1);
                        }
                      }
                    }}
                  >
                    {/* Main Image - Click to open full-screen zoom */}
                    <TouchableOpacity
                      activeOpacity={0.92}
                      onPress={() => setIsFullScreenZoom(true)}
                      style={styles.enlargedImgTouchArea}
                    >
                      {resolvedMainImg ? (
                        <Image 
                          source={{ uri: resolvedMainImg }} 
                          style={styles.enlargedImg} 
                          resizeMode="contain"
                        />
                      ) : (
                        <View style={[styles.enlargedImg, { backgroundColor: p.imageFallback || colors.softPurple }]} />
                      )}
                    </TouchableOpacity>

                    {/* Photo counter pill (e.g. 1/4) */}
                    {productImages.length > 1 && (
                      <View style={styles.imageCounterBadge}>
                        <Text style={styles.imageCounterText}>{activeImageIndex + 1} / {productImages.length}</Text>
                      </View>
                    )}

                    {/* Click-to-zoom hint */}
                    <TouchableOpacity 
                      style={styles.tapToZoomHint}
                      onPress={() => setIsFullScreenZoom(true)}
                    >
                      <ZoomIn size={11} color="#ffffff" />
                      <Text style={styles.tapToZoomText}>Tap to zoom</Text>
                    </TouchableOpacity>

                    {/* Previous image button */}
                    {productImages.length > 1 && activeImageIndex > 0 && (
                      <TouchableOpacity 
                        style={[styles.galleryNavArrow, { left: 8 }]} 
                        onPress={() => setActiveImageIndex(prev => Math.max(0, prev - 1))}
                        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                      >
                        <ChevronLeft size={22} color={colors.darkPurple} />
                      </TouchableOpacity>
                    )}

                    {/* Next image button */}
                    {productImages.length > 1 && activeImageIndex < productImages.length - 1 && (
                      <TouchableOpacity 
                        style={[styles.galleryNavArrow, { right: 8 }]} 
                        onPress={() => setActiveImageIndex(prev => Math.min(productImages.length - 1, prev + 1))}
                        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                      >
                        <ChevronRight size={22} color={colors.darkPurple} />
                      </TouchableOpacity>
                    )}

                    {/* Amazon-style Dot Indicators */}
                    {productImages.length > 1 && (
                      <View style={styles.galleryDotsContainer}>
                        {productImages.map((_, idx) => (
                          <TouchableOpacity
                            key={idx}
                            onPress={() => setActiveImageIndex(idx)}
                            style={[
                              styles.galleryDot,
                              idx === activeImageIndex ? styles.galleryDotActive : styles.galleryDotInactive
                            ]}
                          />
                        ))}
                      </View>
                    )}
                  </View>

                  {/* Amazon-style Interactive Thumbnail Strip */}
                  {productImages.length > 1 && (
                    <View style={styles.thumbnailContainer}>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.thumbnailRow}>
                        {productImages.map((imgUri, idx) => {
                          const resolvedThumb = resolveProductImageUrl(imgUri);
                          const isActive = idx === activeImageIndex;
                          return (
                            <TouchableOpacity
                              key={idx}
                              onPress={() => setActiveImageIndex(idx)}
                              style={[styles.thumbnailBox, isActive && styles.thumbnailBoxActive]}
                              activeOpacity={0.8}
                            >
                              {resolvedThumb ? (
                                <Image source={{ uri: resolvedThumb }} style={styles.thumbnailImg} resizeMode="contain" />
                              ) : (
                                <View style={[styles.thumbnailImg, { backgroundColor: p.imageFallback || colors.softPurple }]} />
                              )}
                            </TouchableOpacity>
                          );
                        })}
                      </ScrollView>
                    </View>
                  )}

                  {/* If Trial Pack: Interactive Size Selector */}
                  {isTrial && (
                    <View style={styles.trialSizeSection}>
                      <Text style={styles.trialSizeHeader}>Select Trial Size (Pack of 2):</Text>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.trialSizeRow}>
                        {TRIAL_SIZES.map(item => {
                          const active = selectedTrialSize === item.id;
                          return (
                            <TouchableOpacity
                              key={item.id}
                              style={[styles.trialChip, active && styles.trialChipActive]}
                              onPress={() => setSelectedTrialSize(item.id)}
                            >
                              <Text style={[styles.trialChipTitle, active && styles.trialChipTitleActive]}>{item.id}</Text>
                              <Text style={[styles.trialChipWeight, active && styles.trialChipWeightActive]}>{item.weight.replace(' (Up to 5 kg)', '')}</Text>
                            </TouchableOpacity>
                          );
                        })}
                      </ScrollView>
                    </View>
                  )}

                  {/* Highlighted Baby Weight Capacity Card */}
                  <View style={styles.capacityHighlightCard}>
                    <View style={styles.capacityHeaderRow}>
                      <Text style={styles.capacityIcon}>👶</Text>
                      <View style={{ flex: 1, marginLeft: 8 }}>
                        <Text style={styles.capacityLabel}>RECOMMENDED BABY WEIGHT CAPACITY</Text>
                        <Text style={styles.capacityValue}>{specs.weightCapacity}</Text>
                      </View>
                    </View>
                    <Text style={styles.capacitySubtext}>
                      {isTrial ? 'Trial pack of 2 diapers perfectly sized to test absorbency, comfort & fit for your baby.' : 'Specially crafted for baby comfort, leak protection & gentle fit for this weight range.'}
                    </Text>
                  </View>

                  {/* Size, Pack & Age Spec Badges */}
                  <View style={styles.specBadgesRow}>
                    <View style={styles.specBadgeBox}>
                      <Text style={styles.specBadgeTitle}>DIAPER SIZE</Text>
                      <Text style={styles.specBadgeValue}>{specs.size}</Text>
                    </View>
                    <View style={styles.specBadgeBox}>
                      <Text style={styles.specBadgeTitle}>PACK COUNT</Text>
                      <Text style={styles.specBadgeValue}>{specs.packCount}</Text>
                    </View>
                    <View style={styles.specBadgeBox}>
                      <Text style={styles.specBadgeTitle}>RECOMMENDED AGE</Text>
                      <Text style={styles.specBadgeValue}>{specs.recommendedAge}</Text>
                    </View>
                  </View>

                  {/* Pricing Section */}
                  <View style={styles.modalPriceContainer}>
                    <View>
                      <Text style={styles.modalPriceLabel}>Special Price</Text>
                      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8 }}>
                        <Text style={styles.modalPriceValue}>₹{p.sellingPrice}</Text>
                        {p.mrp > p.sellingPrice && (
                          <Text style={styles.modalMrpValue}>MRP ₹{p.mrp}</Text>
                        )}
                      </View>
                    </View>
                    {p.discount > 0 && (
                      <View style={styles.discountPill}>
                        <Text style={styles.discountPillText}>{p.discount}% OFF</Text>
                      </View>
                    )}
                  </View>

                  {/* Description if present */}
                  {p.description ? (
                    <View style={styles.modalDescBox}>
                      <Text style={styles.modalDescTitle}>About this product</Text>
                      <Text style={styles.modalDescText}>{p.description}</Text>
                    </View>
                  ) : null}
                </ScrollView>

                {/* Footer Action Button */}
                <View style={styles.modalFooter}>
                  {isOut ? (
                    <View style={styles.modalOutBox}>
                      <Text style={styles.modalOutText}>Currently Out of Stock</Text>
                    </View>
                  ) : (
                    <TouchableOpacity 
                      style={styles.modalAddToCartBtn}
                      onPress={() => {
                        const cartProduct = isTrial ? {
                          ...p,
                          name: `${p.name} - Size ${selectedTrialSize} (${specs.weightCapacity})`,
                          packSize: `Pack of 2 (${selectedTrialSize})`
                        } : p;
                        addToCart(cartProduct, 1);
                        addChatMessage({ 
                          sender: 'bot', 
                          text: `Added ${cartProduct.name} to your cart. 🛒`, 
                          type: 'add_to_cart_success' 
                        });
                        setSelectedProductForEnlarge(null);
                      }}
                    >
                      <Text style={styles.modalAddToCartBtnText}>
                        {isTrial ? `🛒 Add Size ${selectedTrialSize} to Cart (₹${p.sellingPrice})` : `🛒 Add to Cart (₹${p.sellingPrice})`}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })()}
        </View>
      </Modal>

      {/* Full-Screen Lightbox Zoom Modal (Amazon Style) */}
      <Modal
        visible={isFullScreenZoom && !!selectedProductForEnlarge}
        transparent
        animationType="fade"
        onRequestClose={() => setIsFullScreenZoom(false)}
      >
        <View style={styles.fullScreenBackdrop}>
          <TouchableOpacity 
            style={styles.fullScreenDismissArea} 
            activeOpacity={1} 
            onPress={() => setIsFullScreenZoom(false)} 
          />

          {/* Top Bar with Title and Close Button */}
          <View style={styles.fullScreenHeader}>
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Text style={styles.fullScreenTitle} numberOfLines={1}>
                {selectedProductForEnlarge?.name}
              </Text>
              <Text style={styles.fullScreenSubtitle}>
                Image {activeImageIndex + 1} of {selectedProductForEnlarge ? getProductImageList(selectedProductForEnlarge).length : 1}
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.fullScreenCloseBtn} 
              onPress={() => setIsFullScreenZoom(false)}
              hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}
            >
              <X size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>

          {/* High Resolution Centered Image */}
          <View style={styles.fullScreenImgWrapper}>
            {selectedProductForEnlarge && (() => {
              const imgs = getProductImageList(selectedProductForEnlarge);
              const uri = resolveProductImageUrl(imgs[activeImageIndex] || imgs[0]);
              return uri ? (
                <Image 
                  source={{ uri }} 
                  style={styles.fullScreenImg} 
                  resizeMode="contain" 
                />
              ) : null;
            })()}
          </View>

          {/* Previous Arrow */}
          {selectedProductForEnlarge && getProductImageList(selectedProductForEnlarge).length > 1 && activeImageIndex > 0 && (
            <TouchableOpacity 
              style={[styles.fullScreenNavArrow, { left: 16 }]} 
              onPress={() => setActiveImageIndex(prev => Math.max(0, prev - 1))}
              hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
            >
              <ChevronLeft size={32} color="#ffffff" />
            </TouchableOpacity>
          )}

          {/* Next Arrow */}
          {selectedProductForEnlarge && getProductImageList(selectedProductForEnlarge).length > 1 && activeImageIndex < getProductImageList(selectedProductForEnlarge).length - 1 && (
            <TouchableOpacity 
              style={[styles.fullScreenNavArrow, { right: 16 }]} 
              onPress={() => setActiveImageIndex(prev => Math.min(getProductImageList(selectedProductForEnlarge).length - 1, prev + 1))}
              hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
            >
              <ChevronRight size={32} color="#ffffff" />
            </TouchableOpacity>
          )}

          {/* Bottom Thumbnails in Full-Screen Modal */}
          {selectedProductForEnlarge && getProductImageList(selectedProductForEnlarge).length > 1 && (
            <View style={styles.fullScreenThumbBar}>
              {getProductImageList(selectedProductForEnlarge).map((imgUri, idx) => {
                const thumbUri = resolveProductImageUrl(imgUri);
                const isActive = idx === activeImageIndex;
                return (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => setActiveImageIndex(idx)}
                    style={[styles.fullScreenThumbItem, isActive && styles.fullScreenThumbItemActive]}
                  >
                    {thumbUri ? (
                      <Image source={{ uri: thumbUri }} style={styles.fullScreenThumbImg} resizeMode="contain" />
                    ) : null}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  activeOrderCard: {
    backgroundColor: colors.softPurple,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  activeOrderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  activeOrderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeOrderDetails: {
    marginLeft: 12,
  },
  activeOrderTitle: {
    fontSize: 13,
    color: colors.darkPurple,
    fontWeight: '700',
  },
  activeOrderStatus: {
    fontSize: 15,
    color: colors.primary,
    fontWeight: '700',
    marginTop: 2,
  },
  activeOrderPartner: {
    fontSize: 12,
    color: colors.mutedText,
    marginTop: 2,
  },
  chatList: { padding: 16, paddingBottom: 20 },
  messageRow: { flexDirection: 'row', marginBottom: 16, alignItems: 'flex-end' },
  messageRowBot: { justifyContent: 'flex-start' },
  messageRowUser: { justifyContent: 'flex-end' },
  botAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginTop: 4,
  },
  messageBubble: { 
    maxWidth: '85%', 
    padding: 14, 
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  bubbleBot: { backgroundColor: colors.white, borderBottomLeftRadius: 4 },
  bubbleUser: { backgroundColor: colors.chatBubbleOut, borderBottomRightRadius: 4 },
  messageText: { fontSize: 15, lineHeight: 22 },
  textBot: { color: colors.text },
  textUser: { color: colors.darkPurple },
  inputContainer: { flexDirection: 'row', padding: 12, backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: colors.border, alignItems: 'center' },
  input: { flex: 1, backgroundColor: colors.background, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, fontSize: 15 },
  sendButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', marginLeft: 12 },
  quickReplies: { flexDirection: 'row', paddingHorizontal: 16, paddingBottom: 12 },
  qrBtn: { backgroundColor: colors.white, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, marginRight: 10, borderWidth: 1, borderColor: colors.primary },
  qrText: { color: colors.primary, fontWeight: '500' },
  carousel: { marginTop: 12, width: '100%', height: 290 },
  addressCard: { width: 240, height: 170, backgroundColor: colors.white, borderRadius: 20, padding: 16, marginRight: 16, borderWidth: 1, borderColor: colors.border, justifyContent: 'space-between', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  productCard: { width: 168, height: 280, backgroundColor: colors.white, borderRadius: 20, padding: 12, marginRight: 16, borderWidth: 1, borderColor: colors.border, justifyContent: 'space-between', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  productCardTouch: { flex: 1, justifyContent: 'flex-start' },
  productImgContainer: { position: 'relative', width: '100%', height: 95, backgroundColor: '#f8fafc', borderRadius: 12, overflow: 'hidden', marginBottom: 8, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#f1f5f9' },
  img: { width: '100%', height: '100%' },
  pName: { fontSize: 13, fontWeight: '600', marginBottom: 4, color: colors.text, height: 36 },
  pMetaRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6, marginBottom: 2 },
  pPrice: { fontSize: 15, fontWeight: '800', color: colors.darkPurple },
  pMrp: { fontSize: 11, color: colors.mutedText, textDecorationLine: 'line-through' },
  pWeightBadge: { backgroundColor: colors.softPurple, paddingHorizontal: 6, paddingVertical: 3, borderRadius: 6, alignSelf: 'flex-start', marginTop: 2, marginBottom: 4 },
  pWeightText: { fontSize: 10, color: colors.primary, fontWeight: '700' },
  btn: { backgroundColor: colors.softPurple, paddingVertical: 8, borderRadius: 8, alignItems: 'center', marginTop: 4 },
  btnText: { color: colors.primary, fontSize: 12, fontWeight: '700' },
  outOfStockText: { color: 'red', fontSize: 12, fontWeight: '600', textAlign: 'center', marginVertical: 8 },
  
  // Enlarged Product Modal Styles
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.75)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  modalDismissArea: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 },
  modalCard: { width: '100%', maxWidth: 440, maxHeight: '90%', backgroundColor: colors.white, borderRadius: 24, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.25, shadowRadius: 20, elevation: 10 },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, paddingTop: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  modalCategoryBadge: { fontSize: 11, fontWeight: '700', color: colors.primary, letterSpacing: 0.5, marginBottom: 2 },
  modalProductTitle: { fontSize: 16, fontWeight: '700', color: colors.darkPurple },
  modalCloseBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center' },
  modalBody: { paddingHorizontal: 18, paddingVertical: 14 },
  enlargedImgWrapper: { width: '100%', height: 260, backgroundColor: '#f8fafc', borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', marginBottom: 14 },
  enlargedGalleryContainer: {
    width: '100%',
    height: 260,
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
    marginBottom: 10,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  enlargedImgTouchArea: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tapToZoomHint: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
    zIndex: 10,
  },
  tapToZoomText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '600',
  },
  thumbnailContainer: {
    marginBottom: 14,
  },
  thumbnailRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 2,
    alignItems: 'center',
  },
  thumbnailBox: {
    width: 54,
    height: 54,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  thumbnailBoxActive: {
    borderColor: colors.primary,
    backgroundColor: '#FAF5FF',
    borderWidth: 2,
  },
  thumbnailImg: {
    width: 46,
    height: 46,
  },
  gallerySlide: {
    height: 260,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageCounterBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    zIndex: 10,
  },
  imageCounterText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  galleryNavArrow: {
    position: 'absolute',
    top: '50%',
    marginTop: -18,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 10,
  },
  galleryDotsContainer: {
    position: 'absolute',
    bottom: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    gap: 6,
    zIndex: 10,
  },
  galleryDot: {
    height: 6,
    borderRadius: 3,
  },
  galleryDotActive: {
    width: 18,
    backgroundColor: colors.primary,
  },
  galleryDotInactive: {
    width: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  enlargedImg: { width: '92%', height: '92%' },

  // Full-Screen Lightbox Zoom Modal Styles
  fullScreenBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.94)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenDismissArea: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  fullScreenHeader: {
    position: 'absolute',
    top: 40,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 20,
  },
  fullScreenTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  fullScreenSubtitle: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 2,
  },
  fullScreenCloseBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImgWrapper: {
    width: '90%',
    height: '65%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImg: {
    width: '100%',
    height: '100%',
  },
  fullScreenNavArrow: {
    position: 'absolute',
    top: '50%',
    marginTop: -25,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  fullScreenThumbBar: {
    position: 'absolute',
    bottom: 30,
    flexDirection: 'row',
    gap: 10,
    zIndex: 20,
  },
  fullScreenThumbItem: {
    width: 52,
    height: 52,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  fullScreenThumbItemActive: {
    borderColor: '#ffffff',
    borderWidth: 2.5,
  },
  fullScreenThumbImg: {
    width: 44,
    height: 44,
  },
  capacityHighlightCard: { backgroundColor: '#F3E8FF', borderRadius: 14, padding: 12, borderWidth: 1, borderColor: '#D8B4FE', marginBottom: 12 },
  capacityHeaderRow: { flexDirection: 'row', alignItems: 'center' },
  capacityIcon: { fontSize: 24 },
  capacityLabel: { fontSize: 10, fontWeight: '700', color: colors.primary, letterSpacing: 0.5 },
  capacityValue: { fontSize: 17, fontWeight: '800', color: colors.darkPurple, marginTop: 1 },
  capacitySubtext: { fontSize: 11, color: colors.darkPurple, marginTop: 4, lineHeight: 16, opacity: 0.85 },
  specBadgesRow: { flexDirection: 'row', gap: 6, marginBottom: 12 },
  specBadgeBox: { flex: 1, backgroundColor: colors.background, borderRadius: 10, padding: 8, borderWidth: 1, borderColor: colors.border, alignItems: 'center' },
  specBadgeTitle: { fontSize: 9, fontWeight: '700', color: colors.mutedText, marginBottom: 3, textAlign: 'center' },
  specBadgeValue: { fontSize: 12, fontWeight: '700', color: colors.text, textAlign: 'center' },
  modalPriceContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FAF5FF', padding: 12, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#F3E8FF' },
  modalPriceLabel: { fontSize: 11, color: colors.mutedText, fontWeight: '600' },
  modalPriceValue: { fontSize: 20, fontWeight: '800', color: colors.darkPurple },
  modalMrpValue: { fontSize: 13, color: colors.mutedText, textDecorationLine: 'line-through', fontWeight: '500' },
  discountPill: { backgroundColor: '#16A34A', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  discountPillText: { color: '#ffffff', fontSize: 11, fontWeight: '700' },
  modalDescBox: { marginBottom: 14, backgroundColor: colors.background, padding: 10, borderRadius: 10, borderWidth: 1, borderColor: colors.border },
  modalDescTitle: { fontSize: 12, fontWeight: '700', color: colors.text, marginBottom: 3 },
  modalDescText: { fontSize: 12, color: colors.mutedText, lineHeight: 17 },
  modalFooter: { paddingHorizontal: 18, paddingVertical: 12, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.white },
  modalAddToCartBtn: { backgroundColor: colors.primary, paddingVertical: 13, borderRadius: 14, alignItems: 'center', shadowColor: colors.primary, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.25, shadowRadius: 6, elevation: 3 },
  modalAddToCartBtnText: { color: colors.white, fontSize: 14, fontWeight: '700' },
  modalOutBox: { backgroundColor: '#FEE2E2', paddingVertical: 11, borderRadius: 12, alignItems: 'center' },
  modalOutText: { color: '#DC2626', fontSize: 13, fontWeight: '700' },
  cardBlock: { marginTop: 12, backgroundColor: colors.background, borderRadius: 8, padding: 12, width: '100%' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 12 },
  appliedCouponBox: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: colors.softPurple, padding: 10, borderRadius: 8, marginTop: 8 },
  appliedCouponText: { color: colors.primary, fontWeight: '600' },
  removeCouponText: { color: 'red', fontWeight: '500' },
  viewOffersBtn: { padding: 10, borderWidth: 1, borderColor: colors.primary, borderRadius: 8, marginTop: 8, alignItems: 'center' },
  viewOffersBtnInline: { marginTop: 12, alignItems: 'center' },
  viewOffersText: { color: colors.primary, fontWeight: '600', fontSize: 13 },
  couponInputContainer: { flexDirection: 'row', marginTop: 8 },
  couponInput: { flex: 1, borderWidth: 1, borderColor: colors.border, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, fontSize: 14, backgroundColor: colors.white },
  couponApplyBtn: { backgroundColor: colors.primary, justifyContent: 'center', paddingHorizontal: 16, borderRadius: 8, marginLeft: 8 },
  couponApplyBtnText: { color: colors.white, fontWeight: '600' },
  couponCard: { width: 220, backgroundColor: colors.white, borderRadius: 12, padding: 12, marginRight: 12, borderWidth: 1, borderColor: colors.primary, justifyContent: 'space-between' },
  couponCode: { fontSize: 16, fontWeight: '700', color: colors.primary, marginBottom: 4 },
  couponDesc: { fontSize: 14, fontWeight: '600', marginBottom: 4 },
  couponSubDesc: { fontSize: 12, color: colors.mutedText, marginBottom: 8 },
  couponMin: { fontSize: 11, color: colors.mutedText, marginBottom: 12, fontStyle: 'italic' },
  primaryBtn: { backgroundColor: colors.primary, paddingVertical: 12, borderRadius: 24, alignItems: 'center', marginTop: 16, shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 4 },
  primaryBtnText: { color: colors.white, fontWeight: '700', fontSize: 15 },
  boldText: { fontWeight: '700', marginBottom: 12 },
  paymentBtn: { padding: 16, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, borderRadius: 24, marginBottom: 8, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  paymentBtnText: { fontWeight: '700', color: colors.text, fontSize: 15 },
  linkCard: { marginTop: 8, backgroundColor: colors.softPurple, padding: 12, borderRadius: 16, alignItems: 'center' },
  linkText: { color: colors.primary, fontWeight: '700' },
  inlineCheckoutBtn: { marginTop: 12, backgroundColor: colors.primary, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 24, alignSelf: 'flex-start', shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 4 },
  inlineCheckoutBtnText: { color: colors.white, fontWeight: '700', fontSize: 15 },
  trialSizeSection: {
    marginBottom: 12,
  },
  trialSizeHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.darkPurple,
    marginBottom: 8,
  },
  trialSizeRow: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 4,
  },
  trialChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.white,
    alignItems: 'center',
    minWidth: 62,
  },
  trialChipActive: {
    borderColor: colors.primary,
    backgroundColor: '#FDF2F8',
  },
  trialChipTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.text,
  },
  trialChipTitleActive: {
    color: colors.primary,
  },
  trialChipWeight: {
    fontSize: 10,
    color: colors.mutedText,
    marginTop: 2,
    fontWeight: '600',
  },
  trialChipWeightActive: {
    color: colors.primary,
    fontWeight: '700',
  }
});
