import React, { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';

interface Menu {
  menu_id: string;
  name: string;
  image_url: string;
  calories: number;
  protein: number;
  carbs: number;
  price: number;
  category: string[];
  description?: string;
}

interface CartItem extends Menu {
  quantity: number;
}

interface Reservation {
  reservation_id: string;
  reservation_time: string;
  guests: number;
  status: string;
}

interface Restaurant {
  restaurant_id: string;
  name: string;
  description?: string;
}

interface FoodReservationProps {
  reservation: Reservation;
  restaurant: Restaurant;
  menus: Menu[];
  minimumSpend: number;
  existingOrders?: any[];
}

export default function FoodReservation({ 
  reservation, 
  restaurant, 
  menus, 
  minimumSpend,
  existingOrders = []
}: FoodReservationProps) {
  const [showPopup, setShowPopup] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['All']);
  const [isProcessing, setIsProcessing] = useState(false);

  // Load existing orders jika ada
  useEffect(() => {
    if (existingOrders && existingOrders.length > 0) {
      const existingCart = existingOrders.map(order => ({
        ...order.menu,
        quantity: order.quantity
      }));
      setCart(existingCart);
      
      const existingNotes: Record<string, string> = {};
      existingOrders.forEach(order => {
        if (order.notes) {
          existingNotes[order.menu_id] = order.notes;
        }
      });
      setNotes(existingNotes);
    }
  }, [existingOrders]);

  // Get unique categories from menus
  const categories = ['All', ...Array.from(new Set(menus.flatMap(menu => menu.category)))];

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
    ? menus
    : menus.filter(menu => 
        selectedCategories.some(cat => menu.category.includes(cat))
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
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    // Check minimum spend
    if (minimumSpend > 0 && subtotal < minimumSpend) {
      alert(`Minimum spend required: ${formatRupiah(minimumSpend)}\nCurrent subtotal: ${formatRupiah(subtotal)}\nPlease add ${formatRupiah(minimumSpend - subtotal)} more to proceed.`);
      return;
    }

    setIsProcessing(true);

    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      
      const orderData = {
        reservation_id: reservation.reservation_id,
        items: cart.map(item => ({
          menu_id: item.menu_id,
          quantity: item.quantity,
          notes: notes[item.menu_id] || null
        }))
      };

      const response = await fetch('/api/food-reservation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          ...(csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {})
        },
        body: JSON.stringify(orderData)
      });

      const contentType = response.headers.get('content-type');
      
      if (contentType?.includes('application/json')) {
        const data = await response.json();
        
        if (response.ok && data.success) {
          alert('Food order placed successfully!');
          // Redirect ke payment atau confirmation page
          window.location.href = `/reservation/payment/${reservation.reservation_id}`;
        } else {
          let errorMessage = data.message || 'Failed to place order';
          
          if (data.errors) {
            const errorList = Object.values(data.errors).flat().join('\n');
            errorMessage += '\n\n' + errorList;
          }
          
          alert(errorMessage);
        }
      } else {
        alert(`Server returned ${response.status} error`);
      }
    } catch (error) {
      console.error('Order error:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Info */}
      <div className="bg-white shadow-sm p-6 mb-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-2">{restaurant.name}</h1>
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
                        <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-4xl">🍽️</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{item.name}</h3>
                          <div className="flex gap-2 mt-1">
                            {item.category.map((cat, idx) => (
                              <span key={idx} className="text-xs bg-gray-200 px-2 py-1">
                                {cat}
                              </span>
                            ))}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {item.calories} Cal | Protein: {item.protein}g | Carbs: {item.carbs}g
                          </p>
                          <p className="text-lg font-semibold mt-2">
                            {formatRupiah(item.price)}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.menu_id)}
                          className="text-gray-400 hover:text-gray-600"
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
                          className="w-8 h-8 border flex items-center justify-center hover:bg-gray-100"
                        >
                          -
                        </button>
                        <span className="font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.menu_id, 1)}
                          className="w-8 h-8 border flex items-center justify-center hover:bg-gray-100"
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
          <div className="bg-white shadow p-6 h-fit">
            <h3 className="text-lg font-semibold mb-4">Price Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal ({cart.length} items)</span>
                <span>{formatRupiah(subtotal)}</span>
              </div>
              {minimumSpend > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Minimum Spend</span>
                  <span className="text-yellow-600 font-semibold">{formatRupiah(minimumSpend)}</span>
                </div>
              )}
              {minimumSpend > 0 && subtotal < minimumSpend && (
                <div className="flex justify-between text-red-600">
                  <span className="font-semibold">Still Need</span>
                  <span className="font-semibold">{formatRupiah(minimumSpend - subtotal)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (10%)</span>
                <span>{formatRupiah(tax)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Service (5%)</span>
                <span>{formatRupiah(service)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-semibold text-base">
                <span>Total Amount</span>
                <span>{formatRupiah(total)}</span>
              </div>
            </div>
            <button 
              onClick={handlePlaceOrder}
              disabled={cart.length === 0 || isProcessing || (minimumSpend > 0 && subtotal < minimumSpend)}
              className="w-full bg-black text-white py-3 mt-6 hover:bg-gray-800 transition font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Processing...' : 'Place Order →'}
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
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* Category Filter */}
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
              {filteredMenu.map((menu) => (
                <div key={menu.menu_id} className="border p-4 hover:shadow-lg transition">
                  <div className="w-full h-32 bg-gray-100 flex items-center justify-center mb-3 overflow-hidden">
                    {menu.image_url ? (
                      <img src={menu.image_url} alt={menu.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-6xl">🍽️</span>
                    )}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{menu.name}</h3>
                  {menu.description && (
                    <p className="text-sm text-gray-600 mb-2">{menu.description}</p>
                  )}
                  <div className="flex gap-1 mb-2 flex-wrap">
                    {menu.category.map((cat, idx) => (
                      <span key={idx} className="text-xs bg-gray-200 px-2 py-1">
                        {cat}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    {menu.calories} Cal | Protein: {menu.protein}g | Carbs: {menu.carbs}g
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold">{formatRupiah(menu.price)}</span>
                    <button
                      onClick={() => {
                        addToCart(menu);
                      }}
                      className="bg-black text-white px-4 py-2 hover:bg-gray-800 transition"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}