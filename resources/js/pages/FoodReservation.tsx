import React, { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import { PageProps as InertiaPageProps, router } from '@inertiajs/core';
import { usePage } from '@inertiajs/react';

interface Menu {
  menu_id: string;
  menu_name: string;
  image_url: string;
  calories: number;
  protein: number;
  carbo: number;
  price: number;
  category: string[];
  description?: string;
}

declare global {
  interface Window {
    snap: {
      pay: (
        token: string,
        callbacks: {
          onSuccess?: (result: any) => void;
          onPending?: (result: any) => void;
          onError?: (result: any) => void;
          onClose?: () => void;
        }
      ) => void;
    };
  }
}


interface CartItem extends Menu {
  quantity: number;
}

interface Reservation {
  reservation_id: string;
  reservation_time: string;
  guests: number;
  status: string;
  minimum_spend?: number;
}

interface Restaurant {
  restaurant_id: string;
  name: string;
  description?: string;
}

interface PageProps extends InertiaPageProps {
  reservation: Reservation;
  restaurant: Restaurant;
  menus: Menu[];
  minimumSpend: number;
  flash: {
    snapToken?: string;
    message?: string;
    error?: string;
  };
  midtransClientKey: string;
}

export default function FoodReservation() {
  const { reservation, restaurant, menus, minimumSpend, flash, midtransClientKey } = usePage<PageProps>().props;
  
  const [showPopup, setShowPopup] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['All']);
  const [isProcessing, setIsProcessing] = useState(false);
  const [snapLoaded, setSnapLoaded] = useState(false);

  // Load Midtrans Snap script
  useEffect(() => {
    console.log('Loading Midtrans script with client key:', midtransClientKey);
    
    const script = document.createElement('script');
    script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
    script.setAttribute('data-client-key', midtransClientKey);
    
    script.onload = () => {
      console.log('✅ Midtrans Snap script loaded successfully');
      setSnapLoaded(true);
    };
    
    script.onerror = () => {
      console.error('❌ Failed to load Midtrans Snap script');
      alert('Failed to load payment system. Please refresh the page.');
    };
    
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [midtransClientKey]);

  // Handle snap token from flash session
  useEffect(() => {
    console.log('Flash data:', flash);
    
    if (flash?.snapToken) {
      console.log('📦 Snap token received from backend:', flash.snapToken);
      
      if (!snapLoaded) {
        console.log('⏳ Waiting for Midtrans script to load...');
        return;
      }
      
      if (typeof (window as any).snap === 'undefined') {
        console.error('❌ Midtrans snap is undefined');
        alert('Payment system not ready. Please refresh the page.');
        return;
      }
      
      console.log('🚀 Opening Midtrans payment popup');
      
      (window as any).snap.pay(flash.snapToken, {
        onSuccess: function(result: any) {
          console.log('✅ Payment success:', result);
          alert('Payment successful! Thank you for your order.');
          router.visit('/dashboard', {
            data: { payment: 'success' }
          });
        },
        onPending: function(result: any) {
          console.log('⏳ Payment pending:', result);
          alert('Payment is pending. Please complete your payment.');
          router.visit('/dashboard', {
            data: { payment: 'pending' }
          });
        },
        onError: function(result: any) {
          console.error('❌ Payment error:', result);
          alert('Payment failed. Please try again.');
          setIsProcessing(false);
        },
        onClose: function() {
          console.log('🔒 Payment popup closed');
          alert('Payment window closed. Your order is saved.');
          setIsProcessing(false);
          // Clear snapToken from session
          router.reload({ only: ['flash'] });
        }
      });
    }
  }, [flash?.snapToken, snapLoaded]);

  const menuList = Array.isArray(menus) ? menus : [];

  const categories = ['All', ...Array.from(new Set(menuList.flatMap(menu => 
    Array.isArray(menu.category) ? menu.category : []
  )))];

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleCategoryToggle = (category: string) => {
    if (category === 'All') {
      setSelectedCategories(['All']);
    } else {
      let newCategories = selectedCategories.filter(c => c !== 'All');
      
      if (newCategories.includes(category)) {
        newCategories = newCategories.filter(c => c !== category);
      } else {
        newCategories.push(category);
      }
      
      if (newCategories.length === 0) {
        setSelectedCategories(['All']);
      } else {
        setSelectedCategories(newCategories);
      }
    }
  };

  const filteredMenu = selectedCategories.includes('All')
    ? menuList
    : menuList.filter(menu => 
        Array.isArray(menu.category) && selectedCategories.some(cat => menu.category.includes(cat))
      );

  const addToCart = (menu: Menu) => {
    const existingItem = cart.find(item => item.menu_id === menu.menu_id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.menu_id === menu.menu_id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...menu, quantity: 1 }]);
    }
  };

  const removeFromCart = (menuId: string) => {
    setCart(cart.filter(item => item.menu_id !== menuId));
    const newNotes = { ...notes };
    delete newNotes[menuId];
    setNotes(newNotes);
  };

  const updateQuantity = (menuId: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.menu_id === menuId) {
        const newQuantity = item.quantity + delta;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const updateNote = (menuId: string, note: string) => {
    setNotes({ ...notes, [menuId]: note });
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.10;
  const service = subtotal * 0.05;
  const total = subtotal + tax + service;

  const handlePlaceOrder = async () => {
  console.log('🛒 Place Order clicked');

  if (cart.length === 0) {
    alert('Your cart is empty!');
    return;
  }

  if (!snapLoaded) {
    alert('Payment system is still loading. Please wait...');
    return;
  }

  if (minimumSpend > 0 && subtotal < minimumSpend) {
    alert(`Minimum spend: ${formatRupiah(minimumSpend)}`);
    return;
  }

  setIsProcessing(true);

  const orderData = {
    reservation_id: reservation.reservation_id,
    items: cart.map(item => ({
      menu_id: item.menu_id,
      quantity: item.quantity,
      notes: notes[item.menu_id] || null
    })),
    subtotal,
    tax,
    service,
    total
  };

  try {
    const csrfToken =
      (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)
        ?.content ?? '';

    const response = await fetch('/api/food-reservation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': csrfToken,
      },
      body: JSON.stringify(orderData),
    });

    const data = await response.json();
    console.log('📥 API Response:', data);

    if (!response.ok) {
      alert('❌ Failed: ' + (data.message ?? 'Unknown error'));
      setIsProcessing(false);
      return;
    }

    // ambil token, mendukung dua format: snap_token atau snapToken
    const snapToken = data.snap_token || data.snapToken;

    if (!snapToken) {
      alert("❌ Snap token not found");
      setIsProcessing(false);
      return;
    }

    window.snap.pay(snapToken, {
      onSuccess: function (result) {
        console.log("✅ Payment success", result);
        router.visit('/dashboard', {
          replace: true,
        });
      },

      onPending: function (result) {
        console.log("⏳ Pending", result);
        router.visit('/dashboard', {
          replace: true,
        });
      },

      onError: function (result) {
        console.error("❌ Error", result);
        alert("Payment failed");
        setIsProcessing(false);
      },

      onClose: function () {
        alert("Payment cancelled");
        setIsProcessing(false);
      }
    });

  } catch (e) {
    console.error('❌ Network error:', e);
    alert('Network error. Please try again.');
  } finally {
    setIsProcessing(false);
  }
};




  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Info */}
      <div className="bg-white shadow-sm p-6 mb-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-2">{restaurant?.name || 'Restaurant'}</h1>
          <div className="flex gap-6 text-sm text-gray-600">
            <p>Reservation: {new Date(reservation.reservation_time).toLocaleString('id-ID')}</p>
            <p>Guests: {reservation.guests}</p>
            {minimumSpend > 0 && (
              <p className="text-yellow-600 font-semibold">
                ⚠️ Minimum Spend: {formatRupiah(minimumSpend)}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Cart Section */}
          <div className="lg:col-span-3 bg-white shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Your Order ({cart.length} items)</h2>
              <button
                onClick={() => setShowPopup(true)}
                className="flex items-center space-x-2 bg-black text-white px-4 py-2 hover:bg-gray-800 transition"
              >
                <Plus className="w-5 h-5" />
                <span>Add Food</span>
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p>Your cart is empty</p>
                <p className="text-sm mt-2">Click "Add Food" to start ordering</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.menu_id} className="flex gap-4 border-b pb-4">
                    <div className="w-24 h-24 bg-gray-100 flex items-center justify-center overflow-hidden">
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.menu_name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-4xl">🍽️</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{item.menu_name}</h3>
                          <div className="flex gap-2 mt-1">
                            {Array.isArray(item.category) && item.category.map((cat, idx) => (
                              <span key={idx} className="text-xs bg-gray-200 px-2 py-1">
                                {cat}
                              </span>
                            ))}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {item.calories} Cal | Protein: {item.protein}g | carbo: {item.carbo}g
                          </p>
                          <p className="text-lg font-semibold mt-2">
                            {formatRupiah(item.price)}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.menu_id)}
                          className="text-gray-400 hover:text-red-600 transition"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="mt-3">
                        <input
                          type="text"
                          placeholder="Add note (e.g., no spicy, extra sauce)"
                          value={notes[item.menu_id] || ''}
                          onChange={(e) => updateNote(item.menu_id, e.target.value)}
                          className="w-full px-3 py-2 border text-sm focus:outline-none focus:ring-2 focus:ring-black"
                        />
                      </div>
                      <div className="flex items-center space-x-3 mt-3">
                        <button
                          onClick={() => updateQuantity(item.menu_id, -1)}
                          className="w-8 h-8 border flex items-center justify-center hover:bg-gray-100 transition"
                        >
                          -
                        </button>
                        <span className="font-semibold min-w-[30px] text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.menu_id, 1)}
                          className="w-8 h-8 border flex items-center justify-center hover:bg-gray-100 transition"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Price Details */}
          <div className="bg-white shadow p-6 h-fit sticky top-6">
            <h3 className="text-lg font-semibold mb-4">Price Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal ({cart.length} items)</span>
                <span className="font-medium">{formatRupiah(subtotal)}</span>
              </div>
              {minimumSpend > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Minimum Spend</span>
                  <span className="text-yellow-600 font-semibold">{formatRupiah(minimumSpend)}</span>
                </div>
              )}
              {minimumSpend > 0 && subtotal < minimumSpend && (
                <div className="flex justify-between text-red-600 bg-red-50 px-2 py-1">
                  <span className="font-semibold">Still Need</span>
                  <span className="font-semibold">{formatRupiah(minimumSpend - subtotal)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (10%)</span>
                <span className="font-medium">{formatRupiah(tax)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Service (5%)</span>
                <span className="font-medium">{formatRupiah(service)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-bold text-base">
                <span>Total Amount</span>
                <span className="text-lg">{formatRupiah(total)}</span>
              </div>
            </div>
            <button 
              onClick={handlePlaceOrder}
              disabled={cart.length === 0 || isProcessing || !snapLoaded || (minimumSpend > 0 && subtotal < minimumSpend)}
              className="w-full bg-black text-white py-3 mt-6 hover:bg-gray-800 transition font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {!snapLoaded ? 'Loading Payment System...' : isProcessing ? 'Processing...' : 'Place Order & Pay →'}
            </button>
            {minimumSpend > 0 && subtotal < minimumSpend && (
              <p className="text-xs text-red-600 text-center mt-2">
                Please add {formatRupiah(minimumSpend - subtotal)} more to meet minimum spend
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Food Menu Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
          <div 
            className="absolute inset-0 bg-black bg-opacity-10"
            onClick={() => setShowPopup(false)}
          ></div>
          <div className="bg-white max-w-5xl w-full max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-20">
              <h2 className="text-2xl font-semibold">Our Menu</h2>
              <button
                onClick={() => setShowPopup(false)}
                className="text-gray-500 hover:text-gray-700 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="px-6 py-4 border-b bg-gray-50">
              <div className="flex gap-2 flex-wrap">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryToggle(category)}
                    className={`px-4 py-2 text-sm font-medium transition ${
                      selectedCategories.includes(category)
                        ? 'bg-black text-white'
                        : 'bg-white text-gray-700 border hover:bg-gray-100'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMenu.length === 0 ? (
                <div className="col-span-full text-center py-12 text-gray-500">
                  <p>No menu items found in this category</p>
                </div>
              ) : (
                filteredMenu.map((menu) => (
                  <div key={menu.menu_id} className="border p-4 hover:shadow-lg transition">
                    <div className="w-full h-32 bg-gray-100 flex items-center justify-center mb-3 overflow-hidden">
                      {menu.image_url ? (
                        <img src={menu.image_url} alt={menu.menu_name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-6xl">🍽️</span>
                      )}
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{menu.menu_name}</h3>
                    {menu.description && (
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{menu.description}</p>
                    )}
                    <div className="flex gap-1 mb-2 flex-wrap">
                      {Array.isArray(menu.category) && menu.category.map((cat, idx) => (
                        <span key={idx} className="text-xs bg-gray-200 px-2 py-1">
                          {cat}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {menu.calories} Cal | Protein: {menu.protein}g | carbo: {menu.carbo}g
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold">{formatRupiah(menu.price)}</span>
                      <button
                        onClick={() => addToCart(menu)}
                        className="bg-black text-white px-4 py-2 cursor-pointer hover:bg-gray-800 transition"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}