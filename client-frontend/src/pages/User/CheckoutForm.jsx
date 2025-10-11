import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { motion } from "framer-motion";
import { CreditCard, Tag } from "lucide-react";
import { AppContext } from "../../context/AppContext";
import colors from "../../constants/colors";
import { HeaderContext } from "../../context/HeaderContext";

export const CheckoutForm = ({ event, selectedSeats, totalPrice }) => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const {
        paymentServiceURL,
        seatingServiceURL,
        ticketServiceURL,
        discountServiceURL,
        token,
        userID,
        orderServiceURL,
    } = useContext(AppContext);

    const { api } = useContext(HeaderContext);
    const [discountCode, setDiscountCode] = useState("");
    const [discounts, setDiscounts] = useState([]);
    const [appliedDiscount, setAppliedDiscount] = useState(null);
    const [finalPrice, setFinalPrice] = useState(totalPrice);

    const eventId = event?.id;

    // Fetch available discounts for the event
    useEffect(() => {
        fetchDiscounts();
    }, [eventId, api])

    const fetchDiscounts = async () => {
        if (!eventId) return;
        try {
            const discounts = await api.getDiscountsByEvent(eventId);
            setDiscounts(discounts || []);
        } catch (err) {
            console.error("Error fetching discounts:", err);
        }
    };

    console.log("Available discounts:", discounts);

    // Apply discount code
    const applyDiscount = async () => {
        if (!discountCode) return;

        try {
            const res = await fetch(`${discountServiceURL}/validate/${eventId}/${discountCode}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const isValid = await res.json();

            if (isValid) {
                const discount = discounts.find(
                    (d) => d.code.toLowerCase() === discountCode.toLowerCase()
                );
                if (discount) {
                    setAppliedDiscount(discount);
                    console.log("Applying discount value:", discount.value, "Type:", discount.discountType);

                    let newPrice = totalPrice;
                    if (discount.discountType === "PERCENTAGE") {
                        newPrice = totalPrice - (totalPrice * discount.value) / 100;
                    } else if (discount.discountType === "FIXED") {
                        newPrice = Math.max(totalPrice - discount.value, 0);
                    }

                    setFinalPrice(newPrice);
                    console.log("Discount applied. New price:", newPrice);
                } else {
                    setError("No discount code.");
                    setAppliedDiscount(null);
                    setFinalPrice(totalPrice);
                }
            } else {
                setError("Early or Expired discount code. Check the Date of validation of discount");
                setAppliedDiscount(null);
                setFinalPrice(totalPrice);
            }
        } catch (err) {
            console.error(err);
            setError("Error validating discount code");
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // --- Stripe mock for Cypress tests ---
        if (typeof Cypress !== "undefined" && Cypress.env('TEST_MODE')) {
            stripe.confirmCardPayment = () =>
                Promise.resolve({ paymentIntent: { status: 'succeeded' } });
        }


        console.log("Event ", event);
        console.log("Selected seats from Payment Page ", selectedSeats);
        console.log("Total Price " + totalPrice);

        try {
            console.log("token:", token);

            const res = await fetch(`${paymentServiceURL}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    userId: userID,
                    amount: finalPrice,
                    currency: "USD",
                    paymentMethod: "card",
                }),
            });

            const text = await res.text();
            console.log("Text ", text);
            let data;
            try {
                data = text ? JSON.parse(text) : {};
            } catch (parseErr) {
                setError("Server returned invalid JSON: " + parseErr.message);
                setLoading(false);
                return;
            }

            const clientSecret = data.clientSecret;
            console.log("Client Secret : ", clientSecret);
            if (!clientSecret) {
                setError(
                    data.message || `Payment endpoint returned status ${res.status}`
                );
                setLoading(false);
                return;
            }

            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                    billing_details: { name: "Customer Name" },
                },
            });
            console.log(result);

            if (result.error) {
                setError(result.error.message);
            } else if (result.paymentIntent.status === "succeeded") {
                try {
                    // Extract seat numbers from selectedSeats
                    const seatNumbers = selectedSeats.map((s) => s.seatNumber);
                    console.log("Seat numbers to confirm:", seatNumbers);
                    if (!seatNumbers || seatNumbers.length === 0) {
                        alert("No seats to confirm!");
                        return;
                    }
                    console.log("Seat numbers being sent to backend:", seatNumbers);
                    const res = await fetch(`${seatingServiceURL}/${eventId}/confirm`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ seatNumbers }),
                    });
                    console.log("Res after stripe Confirmation ", res);
                    if (!res.ok) {
                        const errData = await res.json();
                        alert(
                            `Failed to confirm seats: ${errData.message || "Unknown error"}`
                        );
                        return;
                    }

                    console.log("Seats confirmed:");
                    console.log("Event ID", eventId);
                    console.log("Event name", event.name);
                    console.log("Venue name ", event.venue?.name);
                    console.log("Start Date and Time ", `${event.startDate}T${event.startTime}`);
                    const seatNumbersStr = selectedSeats.map((s) => s.seatNumber).join(",");
                    const eventDateTime = event.startDate && event.startTime
                        ? `${event.startDate}T${event.startTime}`
                        : null;

                    const resp = await fetch(`${ticketServiceURL}`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            eventId: event.id,
                            userId: userID,
                            seatNumbers: seatNumbersStr,
                            price: finalPrice,
                            eventDate: eventDateTime,
                            venueName: event.venue?.name || "",
                            eventName: event.name,

                        }),
                    });
                    if (!resp.ok) {
                        const text = await resp.text();
                        alert(text || `Ticket creation failed with status ${resp.status}`);
                        setLoading(false);
                        return;
                    }
                    const ticketData = await resp.json();

                    console.log("Ticket created:", ticketData);

                    console.log(ticketData.ticketId);

                    // Update payment with ticket ID
                    if (ticketData?.ticketId) {
                        const updatePaymentRes = await fetch(`${paymentServiceURL}/${data.paymentId}/assign-ticket/${ticketData.ticketId}`, {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                            },
                        });

                        if (!updatePaymentRes.ok) {
                            console.warn("Failed to assign ticket ID to payment");
                        } else {
                            console.log("Payment updated with ticket ID");
                        }
                    }

                    // Update order 
                    if (ticketData?.ticketId) {
                        console.log("Creating order record");
                        const updateOrderRes = await fetch(`${orderServiceURL}`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify({
                                eventId: event.id,
                                userId: userID,
                                ticketId: ticketData.ticketId,
                                price: finalPrice
                            })
                        });

                        const data = await updateOrderRes.json();
                        console.log("Order Created", data);

                    }

                    // Navigate to success page
                    navigate(`/events/${event.id}/success`, {
                        state: { event, selectedSeats, finalPrice, ticketData },
                    });
                } catch (err) {
                    console.error(err);
                    alert(err.message);
                }
            }
        } catch (err) {
            setError(err.message);
        }

        setLoading(false);
    };

    return (
        <motion.form
            onSubmit={handleSubmit}
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <CreditCard size={24} /> Payment Details
            </h2>

            {/* 🔹 Show available discounts */}
            {discounts.length > 0 && (
                <div className="p-4 border rounded-lg bg-green-50 shadow-sm">
                    <p className="font-semibold text-green-800 mb-2 flex items-center gap-1">
                        <Tag size={18} /> Available Discounts
                    </p>
                    <ul className="text-sm text-green-700 list-disc pl-5">
                        {discounts.map((d, idx) => (
                            <li key={idx}>
                                Code: <b>{d.code}</b> –{" "}
                                {d.discountType === "PERCENTAGE"
                                    ? `${d.value}% off`
                                    : `Rs.${d.value} off`}{" "}
                                (expires: {new Date(d.validTo).toLocaleString()})
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* 🔹 Discount Code Input */}
            <div className="flex gap-2 items-center">
                <input
                    type="text"
                    placeholder="Enter discount code"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    className="flex-1 p-2 border rounded-lg"
                />
                <button
                    type="button"
                    onClick={applyDiscount}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg"
                >
                    Apply
                </button>
            </div>

            {appliedDiscount && (
                <p className="text-green-600 font-medium">
                    ✅ Discount applied: {appliedDiscount.code}
                    → New Price: Rs.{finalPrice}
                </p>
            )}

            {/* Card Input */}
            <div className="p-4 border rounded-lg bg-white shadow-sm">
                <label className="block mb-2 font-medium text-gray-700">
                    Card Information
                </label>
                <div className="p-3 border rounded bg-gray-50">
                    <CardElement
                        options={{
                            style: {
                                base: {
                                    fontSize: "16px",
                                    color: "#32325d",
                                    "::placeholder": { color: "#a0aec0" },
                                    fontFamily: "Arial, sans-serif",
                                },
                                invalid: { color: "#fa755a" },
                            },
                            hidePostalCode: true,
                        }}
                    />
                </div>
            </div>

            {error && <p className="text-red-500 font-medium">{error}</p>}

            <button
                type="submit"
                disabled={!stripe || loading}
                style={{
                    backgroundColor: loading ? "bg-gray-400" : colors.primary,
                    cursor: loading ? "not-allowed" : "pointer",
                }}
                className={`w-full py-3 rounded-lg font-semibold text-white shadow transition-colors`}
            >
                {loading ? "Processing..." : `Pay Rs.${finalPrice}`}
            </button>
        </motion.form>
    );
};