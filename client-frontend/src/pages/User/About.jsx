import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import colors from "../../constants/colors";
import { Plus, Minus } from "lucide-react";

const About = () => {
    const navigate = useNavigate();

    const faqs = [
        {
            question: "How do I book an event on EventEase?",
            answer:
                "Browse events, select your tickets, complete the payment, and you'll receive your e-ticket immediately.",
        },
        {
            question: "Can I host both free and paid events?",
            answer:
                "Yes! EventEase supports both free and paid events with flexible ticketing options.",
        },
        {
            question: "Is my payment secure?",
            answer:
                "Absolutely. EventEase uses secure, encrypted payment processing for all transactions.",
        },
        {
            question: "Can I cancel or refund tickets?",
            answer:
                "Cancellation and refund policies are set by each event organizer. Check the event details for specific instructions.",
        },
    ];

    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="w-full px-6 md:px-12 py-12 bg-white text-gray-800">

            {/* Hero Section */}
            <section className="text-center mb-16">
                <h1 style={{color : colors.primary}} className="text-4xl md:text-5xl font-bold mb-4">
                    EventEase: Where Events Come Alive
                </h1>
                <p className="text-lg md:text-xl max-w-2xl mx-auto">
                    Simplify event management and ticketing while creating experiences your audience will never forget.
                </p>
                <div className="mt-6 flex justify-center flex-col md:flex-row gap-4">
                    <button
                        onClick={() => navigate("/")}
                        className="px-6 py-3 bg-yellow-500 text-white rounded-full font-semibold shadow-md hover:bg-yellow-600 transition"
                    >
                        Get Started for Free
                    </button>
                    <button className="px-6 py-3 bg-gray-200 text-gray-800 rounded-full font-semibold hover:bg-gray-300 transition">
                        Contact Sales
                    </button>
                </div>
            </section>

            {/* Platform Features */}
            <section className="grid md:grid-cols-3 gap-8 mb-16">
                <div className="p-6 border rounded-lg shadow-sm text-center">
                    <h2 className="text-xl font-bold mb-2">Smart Ticketing</h2>
                    <p>Easily create customizable ticket options and manage sales seamlessly.</p>
                </div>
                <div className="p-6 border rounded-lg shadow-sm text-center">
                    <h2 className="text-xl font-bold mb-2">Event Analytics</h2>
                    <p>Gain insights into attendee behavior, sales trends, and engagement in real-time.</p>
                </div>
                <div className="p-6 border rounded-lg shadow-sm text-center">
                    <h2 className="text-xl font-bold mb-2">Organizer Tools</h2>
                    <p>Manage registrations, track check-ins, and communicate with attendees effortlessly.</p>
                </div>
            </section>

            {/* Marketing & Growth */}
            <section className="mb-16 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Reach More Attendees</h2>
                <p className="text-lg md:text-xl max-w-3xl mx-auto mb-6">
                    Grow your audience with EventEase’s marketing tools and promotion channels.
                </p>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="p-6 border rounded-lg shadow-sm">
                        <h3 className="font-semibold mb-2">Event Discovery</h3>
                        <p>Connect your event to attendees based on interests and location.</p>
                    </div>
                    <div className="p-6 border rounded-lg shadow-sm">
                        <h3 className="font-semibold mb-2">Promotional Tools</h3>
                        <p>Launch ads and campaigns to boost visibility across our platform and beyond.</p>
                    </div>
                    <div className="p-6 border rounded-lg shadow-sm">
                        <h3 className="font-semibold mb-2">Email & Social Marketing</h3>
                        <p>Reach your audience with automated campaigns and social media integrations.</p>
                    </div>
                </div>
            </section>

            {/* Payments Section */}
            <section className="mb-16 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Seamless Payments</h2>
                <p className="text-lg md:text-xl max-w-3xl mx-auto mb-6">
                    Collect payments securely, with low fees and flexible payout options.
                </p>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="p-6 border rounded-lg shadow-sm">
                        <h3 className="font-semibold mb-2">Transparent Fees</h3>
                        <p>Simple, predictable costs that let you focus on your event.</p>
                    </div>
                    <div className="p-6 border rounded-lg shadow-sm">
                        <h3 className="font-semibold mb-2">Fast Payouts</h3>
                        <p>Get paid quickly after ticket sales, so you can plan your next event with confidence.</p>
                    </div>
                    <div className="p-6 border rounded-lg shadow-sm">
                        <h3 className="font-semibold mb-2">Secure Processing</h3>
                        <p>All payments handled safely with built-in payment processing technology.</p>
                    </div>
                </div>
            </section>

            {/* How to Book an Event */}
            <section className="mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center">How to Book an Event</h2>

                <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between relative">

                    {/* Step 1 */}
                    <div className="flex flex-col items-center text-center md:w-1/4 mb-8 md:mb-0">
                        <div className="w-12 h-12 rounded-full bg-yellow-500 text-white flex items-center justify-center font-bold text-lg mb-2">
                            1
                        </div>
                        <h3 className="font-semibold mb-1">Browse Events</h3>
                        <p className="text-gray-600 text-sm md:text-base">Explore upcoming events and find one that interests you.</p>
                    </div>

                    {/* Step 2 */}
                    <div className="flex flex-col items-center text-center md:w-1/4 mb-8 md:mb-0">
                        <div className="w-12 h-12 rounded-full bg-yellow-500 text-white flex items-center justify-center font-bold text-lg mb-2">
                            2
                        </div>
                        <h3 className="font-semibold mb-1">Select Tickets</h3>
                        <p className="text-gray-600 text-sm md:text-base">Choose the number and type of tickets you want and add them to your cart.</p>
                    </div>

                    {/* Step 3 */}
                    <div className="flex flex-col items-center text-center md:w-1/4 mb-8 md:mb-0">
                        <div className="w-12 h-12 rounded-full bg-yellow-500 text-white flex items-center justify-center font-bold text-lg mb-2">
                            3
                        </div>
                        <h3 className="font-semibold mb-1">Make Payment</h3>
                        <p className="text-gray-600 text-sm md:text-base">Complete your booking securely using our payment system.</p>
                    </div>

                    {/* Step 4 */}
                    <div className="flex flex-col items-center text-center md:w-1/4">
                        <div className="w-12 h-12 rounded-full bg-yellow-500 text-white flex items-center justify-center font-bold text-lg mb-2">
                            4
                        </div>
                        <h3 className="font-semibold mb-1">Receive Tickets</h3>
                        <p className="text-gray-600 text-sm md:text-base">Your tickets will be emailed to you instantly. Show them at the event.</p>
                    </div>

                </div>
            </section>

            {/* FAQ Section */}
            <section className="mb-16 max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className={`border rounded-lg shadow-sm bg-white overflow-hidden`}
                        >
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full flex justify-between items-center p-4 focus:outline-none"
                            >
                                <span className="font-semibold" style={{ color: colors.primary }}>
                                    {faq.question}
                                </span>
                                <span>
                                    {openIndex === index ? <Minus size={20} /> : <Plus size={20} />}
                                </span>
                            </button>
                            {openIndex === index && (
                                <div className="px-4 pb-4 text-gray-700">
                                    {faq.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* Call-to-Action */}
            <section className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Start Hosting with EventEase Today
                </h2>
                <p className="text-lg md:text-xl mb-6">
                    Everything you need to manage, promote, and grow your events—all in one place.
                </p>
                <div className="flex justify-center flex-col md:flex-row gap-4">
                    <button
                        onClick={() => navigate("/")}
                        className="px-6 py-3 bg-yellow-500 text-white rounded-full font-semibold shadow-md hover:bg-yellow-600 transition"
                    >
                        Get Started for Free
                    </button>
                    <button className="px-6 py-3 bg-gray-200 text-gray-800 rounded-full font-semibold hover:bg-gray-300 transition">
                        Contact Sales
                    </button>
                </div>
            </section>
        </div>
    );
};

export default About;
