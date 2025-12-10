import React, { useState, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { X } from 'lucide-react';
import { router } from '@inertiajs/react';

interface SelectedTable {
    table_id: string;
    table_name: string;
    table_number: string;
    count: number;
    minimun_spend: number;
}

interface Table {
    table_name: string;
    table_id: string;
    table_number: string;
    total_chair: number;
    minimun_spend: number;
    price: number;
    desc: string;
}

interface Restaurant {
    restaurant_id: string;
    name: string;
    description?: string;
    image_url?: string;
}

interface ReservationProps {
    restaurant: Restaurant | null;
    tables: Table[];
}

export default function Reservation({ restaurant: initialRestaurant, tables: initialTables }: ReservationProps) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const [restaurant, setRestaurant] = useState<Restaurant | null>(initialRestaurant);
    const [tables, setTables] = useState<Table[]>(initialTables || []);
    const [name, setName] = useState("");
    const [selected, setSelected] = useState<Date | undefined>(tomorrow);
    const [dateOpen, setDateOpen] = useState(false);
    const [timeOpen, setTimeOpen] = useState(false);
    const [hour, setHour] = useState("07");
    const [minute, setMinute] = useState("00");
    const [period, setPeriod] = useState<"AM" | "PM">("AM");
    const [guests, setGuests] = useState(2);
    const [tableTypeOpen, setTableTypeOpen] = useState(false);
    const [selectedTables, setSelectedTables] = useState<SelectedTable[]>([]);
    const [tempTableId, setTempTableId] = useState("");
    const [tempTableCount, setTempTableCount] = useState(1);
    const [policyChecked, setPolicyChecked] = useState(false);
    const [policyOpen, setPolicyOpen] = useState(false);
    const [foodReservationOpen, setFoodReservationOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (tables && tables.length > 0 && !tempTableId) {
            setTempTableId(tables[0].table_id);
        }
    }, [tables, tempTableId]);

    // Format currency to Rupiah
    const formatRupiah = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const timeSlots = [
        { hour: "07", minute: "00", period: "AM" as const },
        { hour: "08", minute: "00", period: "AM" as const },
        { hour: "09", minute: "00", period: "AM" as const },
        { hour: "10", minute: "00", period: "AM" as const },
        { hour: "11", minute: "00", period: "AM" as const },
        { hour: "12", minute: "00", period: "PM" as const },
        { hour: "01", minute: "00", period: "PM" as const },
        { hour: "02", minute: "00", period: "PM" as const },
        { hour: "03", minute: "00", period: "PM" as const },
        { hour: "04", minute: "00", period: "PM" as const },
        { hour: "05", minute: "00", period: "PM" as const },
        { hour: "06", minute: "00", period: "PM" as const },
        { hour: "07", minute: "00", period: "PM" as const },
        { hour: "08", minute: "00", period: "PM" as const },
        { hour: "09", minute: "00", period: "PM" as const },
    ];

    function formatDateDisplay(date: Date) {
        const weekday = date.toLocaleDateString("en-US", { weekday: "long" }).toUpperCase();
        const day = date.getDate().toString().padStart(2, "0");
        const month = date.toLocaleDateString("en-US", { month: "long" }).toUpperCase();
        const year = date.getFullYear();
        return `${weekday}, ${day} ${month} ${year}`;
    }

    function formatDateForBackend(date: Date) {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

    const handleTimeSelect = (slot: typeof timeSlots[0]) => {
        setHour(slot.hour);
        setMinute(slot.minute);
        setPeriod(slot.period);
        setTimeOpen(false);
    };

    const handleAddTable = () => {
        if (!tempTableId) {
            alert("Please select a table type.");
            return;
        }

        const exists = selectedTables.find(t => t.table_id === tempTableId);
        if (exists) {
            alert("Table type already selected. Please choose a different one.");
            return;
        }

        const selectedTable = tables.find(t => t.table_id === tempTableId);
        if (selectedTable) {
            setSelectedTables([...selectedTables, { 
                table_id: selectedTable.table_id,
                table_name: selectedTable.table_name,
                table_number: selectedTable.table_number,
                count: tempTableCount,
                minimun_spend: selectedTable.minimun_spend
            }]);
            setTempTableCount(1);
        }
    };

    const handleRemoveTable = (index: number) => {
        setSelectedTables(selectedTables.filter((_, i) => i !== index));
    };

    const handleConfirmSelection = () => {
        if (selectedTables.length === 0) {
            alert("Please add at least one table.");
            return;
        }
        setTableTypeOpen(false);
    };

    const handlePolicyClick = () => {
        setPolicyOpen(true);
    };

    const handleAcceptPolicy = () => {
        setPolicyChecked(true);
        setPolicyOpen(false);
    };

    const handleConfirmReservation = () => {
        if (!policyChecked) {
            alert("Please read and accept the policy");
            return;
        }
        if (selectedTables.length === 0) {
            alert("Please select at least one table type");
            return;
        }
        if (!name.trim()) {
            alert("Please enter your name");
            return;
        }
        
        setFoodReservationOpen(true);
    };

    // Check if any selected table has minimum spend
    const hasMinimumSpend = () => {
        return selectedTables.some(table => table.minimun_spend > 0);
    };

    // Calculate total minimum spend
    const getTotalMinimumSpend = () => {
        let total = 0;

        selectedTables.forEach(item => {
            const table = getTableDetails(item.table_id);
            if (table?.minimun_spend) {
                total += Number(table.minimun_spend) * item.count;
            }
        });

        return total;
    };

    const handleSubmitReservation = async (reserveFood: boolean) => {
    setSubmitting(true);

    // Pastikan waktu valid (05:05 PM)
    const formattedTime = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")} ${period}`;

    const formData = {
        restaurant_id: restaurant?.restaurant_id,
        name: name,
        date: selected ? formatDateForBackend(selected) : "",
        time: formattedTime,
        guests: guests,
        tables: selectedTables,
        reserve_food: reserveFood
    };

    try {
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

        const response = await fetch('/api/reservation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                ...(csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {})
            },
            body: JSON.stringify(formData)
        });

        const contentType = response.headers.get('content-type');

        if (contentType?.includes('application/json')) {
            const data = await response.json();

            if (response.ok && data.success) {
                if (data.redirect_url) {
                    router.visit(data.redirect_url);
                    return;
                }

                // Jika tidak ada minimum spend → reset form
                alert("Reservation confirmed successfully!");

                setName("");
                setSelected(tomorrow);
                setGuests(2);
                setSelectedTables([]);
                setPolicyChecked(false);
                return;
            } else {
                // Error VALIDATION
                let message = data.message || "Failed to create reservation";

                if (data.errors) {
                    message += "\n\n" + Object.values(data.errors).flat().join("\n");
                }

                alert(message);
                setSubmitting(false);
            }
        } else {
            // Server error non-JSON
            alert(`Server returned status ${response.status}`);
            setSubmitting(false);
        }

    } catch (error) {
        console.error("Error submitting reservation:", error);
        alert("Failed to submit reservation. Check your connection.");
        setSubmitting(false);
    } finally {
        // Tutup modal food reservation jika ada
        setFoodReservationOpen(false);
    }
};



    const getTableDetails = (tableId: string) => {
        return tables.find(t => t.table_id === tableId);
    };

    if (!restaurant) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center bg-[#F9F6F1]">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">No Restaurant Available</h2>
                    <p className="text-gray-600">Please check back later.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen flex flex-col lg:flex-row">
            {/* Left Side - Image */}
            <div className="w-full lg:w-[50%] min-h-[300px] lg:min-h-screen flex relative">
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/20 z-10"></div>
                <div className="relative w-full h-full">
                    <img 
                        src={restaurant.image_url || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80"} 
                        alt={restaurant.name} 
                        className="w-full h-full object-cover absolute" 
                    />
                </div>
                <div className="absolute bottom-8 left-8 z-20 text-white">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-white"></div>
                        <p className="text-sm tracking-widest">RESTAURANT</p>
                    </div>
                    <h2 className="text-4xl font-bold mb-2">{restaurant.name}</h2>
                    <p className="text-sm max-w-md">
                        {restaurant.description || "Here, you can explore flavors, relax with friends, or simply enjoy an atmosphere filled with energy and happiness."}
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-[50%] min-h-screen flex flex-col p-8 lg:p-12 bg-[#F9F6F1]">
                <div className="flex w-full h-fit items-center mb-6">
                    <h1 className="font-bold text-2xl">Reserve</h1>
                    <div className="w-[2px] h-6 bg-black mx-4"></div>
                    <h1 className="font-medium text-xl">{restaurant.name}</h1>
                </div>
                <div className="w-full h-[1px] bg-black mb-8"></div>

                {/* Reserved Name */}
                <div className="w-full h-fit flex flex-col mb-6">
                    <label htmlFor="name" className="font-semibold text-sm tracking-wide mb-2">
                        RESERVED NAME
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="outline-none bg-white py-3 px-6 font-medium"
                        placeholder="Your Name"
                    />
                </div>

                {/* Date */}
                <div className="w-full h-fit flex flex-col mb-6 relative">
                    <label htmlFor="date" className="font-semibold text-sm tracking-wide mb-2">
                        DATE
                    </label>
                    <button
                        className="w-full text-left bg-white py-3 px-6 font-medium hover:bg-gray-50 transition-colors"
                        onClick={() => setDateOpen(!dateOpen)}
                    >
                        {selected ? formatDateDisplay(selected) : "No date selected"}
                    </button>
                    {dateOpen && (
                        <div className="absolute top-full right-0 mt-2 bg-white shadow-lg z-50 border border-gray-200">
                            <DayPicker
                                mode="single"
                                selected={selected}
                                onSelect={(day) => {
                                    if (day) {
                                        setSelected(day);
                                        setDateOpen(false);
                                    }
                                }}
                                defaultMonth={tomorrow}
                                disabled={{
                                    before: tomorrow,
                                }}
                            />
                        </div>
                    )}
                </div>

                {/* Time and Guests Row */}
                <div className="w-full flex gap-4 mb-6">
                    {/* Time */}
                    <div className="flex-1 flex flex-col relative">
                        <label className="font-semibold text-sm tracking-wide mb-2">TIME</label>
                        <button
                            className="bg-white py-3 px-6 flex items-center justify-between font-medium hover:bg-gray-50 transition-colors"
                            onClick={() => setTimeOpen(!timeOpen)}
                        >
                            <span>{hour}:{minute} {period}</span>
                            <svg
                                className={`w-4 h-4 transition-transform ${timeOpen ? "rotate-180" : ""}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        {timeOpen && (
                            <div className="absolute top-full left-0 mt-2 bg-white shadow-lg z-50 border border-gray-200 w-full max-h-64 overflow-y-auto">
                                {timeSlots.map((slot, idx) => (
                                    <button
                                        key={idx}
                                        className="w-full text-left py-3 px-6 hover:bg-gray-100 transition-colors font-medium"
                                        onClick={() => handleTimeSelect(slot)}
                                    >
                                        {slot.hour}:{slot.minute} {slot.period}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Guests */}
                    <div className="flex-1 flex flex-col">
                        <label className="font-semibold text-sm tracking-wide mb-2">GUESTS</label>
                        <div className="bg-white py-3 px-6 flex items-center justify-between">
                            <button
                                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors"
                                onClick={() => setGuests(Math.max(1, guests - 1))}
                            >
                                -
                            </button>
                            <span className="font-medium">{guests} PERSON</span>
                            <button
                                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors"
                                onClick={() => setGuests(guests + 1)}
                            >
                                +
                            </button>
                        </div>
                    </div>
                </div>

                {/* Table Type */}
                <div className="w-full h-fit flex flex-col mb-6">
                    <label className="font-semibold text-sm tracking-wide mb-2">TABLE TYPE</label>
                    <button
                        className="w-full text-left bg-white py-3 px-6 font-medium hover:bg-gray-50 transition-colors"
                        onClick={() => setTableTypeOpen(true)}
                        disabled={tables.length === 0}
                    >
                        {tables.length === 0 
                            ? "No tables available"
                            : selectedTables.length > 0 
                                ? `${selectedTables.length} table type(s) selected` 
                                : "Select table types"}
                    </button>
                    
                    {/* Display Selected Tables */}
                    {selectedTables.length > 0 && (
                        <div className="mt-2 flex flex-col gap-2">
                            {selectedTables.map((table, index) => {
                                const tableDetails = getTableDetails(table.table_id);
                                return (
                                    <div key={index} className="bg-black text-white py-2 px-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-medium">{table.table_name}</span>
                                            <div className="w-[1px] h-4 bg-white"></div>
                                            <span className="text-sm font-medium">{table.count} TABLE</span>
                                            {table.minimun_spend > 0 && (
                                                <>
                                                    <div className="w-[1px] h-4 bg-white"></div>
                                                    <span className="text-sm text-yellow-300">Min Spend: {formatRupiah(table.minimun_spend * table.count)}</span>
                                                </>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => handleRemoveTable(index)}
                                            className="w-6 h-6 flex items-center justify-center hover:bg-white/20 transition-colors rounded"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Minimum Spend Notice */}
                {hasMinimumSpend() && (
                    <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
                        <p className="text-sm font-semibold text-yellow-800 mb-1">⚠️ Minimum Spend Required</p>
                        <p className="text-xs text-yellow-700">
                            Your selected tables require a minimum spend of {formatRupiah(getTotalMinimumSpend())}. 
                            You must reserve food to proceed.
                        </p>
                    </div>
                )}

                {/* Policy Checkbox */}
                <div className="flex items-start gap-3 mb-8">
                    <input
                        type="checkbox"
                        id="policy"
                        checked={policyChecked}
                        onChange={() => {}}
                        onClick={handlePolicyClick}
                        className="mt-1 w-4 h-4 cursor-pointer"
                    />
                    <label htmlFor="policy" className="text-sm cursor-pointer" onClick={handlePolicyClick}>
                        I have carefully read the policy
                    </label>
                </div>

                {/* Confirm Button */}
                <button
                    className={`w-full py-4 text-white font-semibold tracking-wide transition-colors ${
                        policyChecked && selectedTables.length > 0 && name.trim()
                            ? "bg-black hover:bg-gray-800"
                            : "bg-gray-400 cursor-not-allowed"
                    }`}
                    onClick={handleConfirmReservation}
                    disabled={!policyChecked || selectedTables.length === 0 || !name.trim()}
                >
                    CONFIRM RESERVATION
                </button>
            </div>

            {/* Table Type Popup */}
            {tableTypeOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#F9F6F1] w-full max-w-lg p-8 relative max-h-[90vh] overflow-y-auto">
                        <button
                            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center hover:bg-gray-200 transition-colors rounded"
                            onClick={() => setTableTypeOpen(false)}
                        >
                            <X size={20} />
                        </button>

                        <h2 className="text-2xl font-bold mb-6">Select Table Types</h2>

                        {/* Current Selected Tables */}
                        {selectedTables.length > 0 && (
                            <div className="mb-6">
                                <h3 className="font-semibold text-sm tracking-wide mb-3">SELECTED TABLES</h3>
                                <div className="space-y-2">
                                    {selectedTables.map((table, index) => {
                                        const tableDetails = getTableDetails(table.table_id);
                                        return (
                                            <div key={index} className="bg-white p-4 flex items-center justify-between">
                                                <div>
                                                    <p className="font-semibold">{table.table_name}</p>
                                                    <p className="text-sm text-gray-600">{table.count} table(s)</p>
                                                    {tableDetails && (
                                                        <p className="text-sm text-gray-600">
                                                            {formatRupiah(tableDetails.price)} per table · {tableDetails.total_chair} chairs
                                                            {tableDetails.minimun_spend > 0 && (
                                                                <span className="text-yellow-600 font-semibold"> · Min Spend: {formatRupiah(tableDetails.minimun_spend)}</span>
                                                            )}
                                                        </p>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => handleRemoveTable(index)}
                                                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors rounded"
                                                >
                                                    <X size={18} />
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Add New Table */}
                        <div className="border-t pt-6">
                            <div className="mb-4">
                                <label className="font-semibold text-sm tracking-wide mb-2 block">
                                    TABLE TYPE
                                </label>
                                <select
                                    value={tempTableId}
                                    onChange={(e) => setTempTableId(e.target.value)}
                                    className="w-full bg-white py-3 px-6 font-medium outline-none cursor-pointer"
                                >
                                    {tables.map((table) => (
                                        <option key={table.table_id} value={table.table_id}>
                                            {table.table_name}
                                        </option>
                                    ))}
                                </select>
                                
                                {tempTableId && (
                                    <div className="mt-2 p-3 bg-white">
                                        <p className="text-sm text-gray-600 mb-2">
                                            {getTableDetails(tempTableId)?.desc || "No description available"}
                                        </p>
                                        {getTableDetails(tempTableId)?.minimun_spend && getTableDetails(tempTableId)!.minimun_spend > 0 && (
                                            <p className="text-sm font-semibold text-yellow-600 mt-2">
                                                ⚠️ Minimum Spend: {formatRupiah(getTableDetails(tempTableId)!.minimun_spend)}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="font-semibold text-sm tracking-wide mb-2 block">
                                    NUMBER OF TABLES
                                </label>
                                <div className="bg-white py-3 px-6 flex items-center justify-between">
                                    <button
                                        className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors text-xl"
                                        onClick={() => setTempTableCount(Math.max(1, tempTableCount - 1))}
                                    >
                                        -
                                    </button>
                                    <span className="font-medium text-lg">{tempTableCount}</span>
                                    <button
                                        className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors text-xl"
                                        onClick={() => setTempTableCount(tempTableCount + 1)}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <button
                                className="w-full bg-gray-800 text-white py-3 font-semibold tracking-wide hover:bg-gray-700 transition-colors mb-4"
                                onClick={handleAddTable}
                            >
                                ADD TABLE
                            </button>
                        </div>

                        <button
                            className={`w-full py-4 font-semibold tracking-wide transition-colors ${
                                selectedTables.length > 0
                                    ? "bg-black text-white hover:bg-gray-800"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                            onClick={handleConfirmSelection}
                            disabled={selectedTables.length === 0}
                        >
                            CONFIRM SELECTION
                        </button>
                    </div>
                </div>
            )}

            {/* Policy Popup */}
            {policyOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
                        <div className="p-8 border-b">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-2xl font-bold">Terms and Conditions</h2>
                                <button
                                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors rounded"
                                    onClick={() => setPolicyOpen(false)}
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <p className="text-sm text-gray-600">Please read and accept our terms and conditions</p>
                        </div>
                        
                        <div className="p-8 overflow-y-auto flex-1">
                            <div className="space-y-4 text-sm leading-relaxed">
                                <div>
                                    <h3 className="font-bold text-base mb-2">1. Reservation Policy</h3>
                                    <p className="text-gray-700">All reservations must be made at least 24 hours in advance. We reserve the right to cancel or modify reservations due to unforeseen circumstances.</p>
                                </div>
                                
                                <div>
                                    <h3 className="font-bold text-base mb-2">2. Cancellation Policy</h3>
                                    <p className="text-gray-700">Cancellations must be made at least 12 hours before the reservation time. Late cancellations may incur a fee.</p>
                                </div>
                                
                                <div>
                                    <h3 className="font-bold text-base mb-2">3. Table Reservation</h3>
                                    <p className="text-gray-700">Tables will be held for 15 minutes past the reservation time. After that, the reservation may be cancelled and the table released.</p>
                                </div>
                                
                                <div>
                                    <h3 className="font-bold text-base mb-2">4. Payment Terms</h3>
                                    <p className="text-gray-700">Payment is due at the time of service. We accept cash, credit cards, and digital payments.</p>
                                </div>
                                
                                <div>
                                    <h3 className="font-bold text-base mb-2">5. Special Requests</h3>
                                    <p className="text-gray-700">While we will do our best to accommodate special requests, we cannot guarantee their fulfillment.</p>
                                </div>

                                <div>
                                    <h3 className="font-bold text-base mb-2">6. Privacy Policy</h3>
                                    <p className="text-gray-700">Your personal information will be used solely for reservation purposes and will not be shared with third parties.</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-8 border-t bg-gray-50">
                            <div className="flex gap-4">
                                <button
                                    className="flex-1 py-3 border-2 border-black text-black font-semibold hover:bg-gray-100 transition-colors"
                                    onClick={() => setPolicyOpen(false)}
                                >
                                    DECLINE
                                </button>
                                <button
                                    className="flex-1 py-3 bg-black text-white font-semibold hover:bg-gray-800 transition-colors"
                                    onClick={handleAcceptPolicy}
                                >
                                    ACCEPT
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Food Reservation Popup */}
            {foodReservationOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white w-full max-w-md p-8">
                        <h2 className="text-2xl font-bold mb-4 text-center">
                            {hasMinimumSpend() ? "Minimum Spend Required" : "Reserve Food?"}
                        </h2>
                        <p className="text-center text-gray-600 mb-8">
                            {hasMinimumSpend() 
                                ? `Your selected tables require a minimum spend of ${getTotalMinimumSpend().toFixed(2)}. You must order food to meet this requirement.`
                                : "Would you like to reserve food for your table reservation?"}
                        </p>
                        
                        <div className="flex flex-col gap-3">
                            {hasMinimumSpend() ? (
                                // Jika ada minimum spend, hanya tampilkan tombol reserve food
                                <button
                                    className="w-full py-4 bg-black text-white font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                                    onClick={() => handleSubmitReservation(true)}
                                    disabled={submitting}
                                >
                                    {submitting ? "Processing..." : "PROCEED TO FOOD MENU"}
                                </button>
                            ) : (
                                // Jika tidak ada minimum spend, tampilkan kedua tombol
                                <>
                                    <button
                                        className="w-full py-4 bg-black text-white font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                                        onClick={() => handleSubmitReservation(true)}
                                        disabled={submitting}
                                    >
                                        {submitting ? "Processing..." : "YES, RESERVE FOOD"}
                                    </button>
                                    <button
                                        className="w-full py-4 border-2 border-black text-black font-semibold hover:bg-gray-100 transition-colors"
                                        onClick={() => handleSubmitReservation(false)}
                                        disabled={submitting}
                                    >
                                        {submitting ? "Processing..." : "NO, JUST TABLE"}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}