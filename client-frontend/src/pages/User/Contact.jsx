import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, User, MessageCircle, Send, Tag, X } from "lucide-react";
import emailjs from "@emailjs/browser";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ type: "", message: "", visible: false });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const showToast = (type, message) => {
    setToast({ type, message, visible: true });
    setTimeout(() => setToast({ ...toast, visible: false }), 3000); // auto hide after 3s
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const templateParams = { ...formData, time: new Date().toLocaleString() };

      await emailjs.send(
        "service_vyq9bzm",
        "template_7k3y9jd",
        templateParams,
        "029ATmoVVrAyg0Gp1"
      );

      showToast("success", "Your message has been sent successfully!");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      console.error(err);
      showToast("error", "Failed to send message. Please try again later.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      {/* Contact Card */}
      <motion.div
        className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Mail className="text-blue-600" /> Contact Us
        </h1>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="font-medium text-gray-700 flex items-center gap-1">
              <User size={16} /> Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="border rounded-lg p-2 w-full"
              required
            />
          </div>

          <div>
            <label className="font-medium text-gray-700 flex items-center gap-1">
              <Mail size={16} /> Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="border rounded-lg p-2 w-full"
              required
            />
          </div>

          <div>
            <label className="font-medium text-gray-700 flex items-center gap-1">
              <Tag size={16} /> Subject
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject} 
              onChange={handleChange}
              className="border rounded-lg p-2 w-full"
            />
          </div>

          <div>
            <label className="font-medium text-gray-700 flex items-center gap-1">
              <MessageCircle size={16} /> Message *
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="border rounded-lg p-2 w-full h-24"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg text-white ${
              loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            } flex items-center justify-center gap-2`}
          >
            <Send size={16} /> {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </motion.div>

      {/* Toast Notification */}
{toast.visible && (
  <motion.div
    className={`fixed top-20 right-6 px-4 py-3 rounded-lg text-white shadow-lg z-50 ${
      toast.type === "success" ? "bg-green-600" : "bg-red-600"
    } flex items-center justify-between gap-4`}
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 50 }}
  >
    <span>{toast.message}</span>
    <X
      className="cursor-pointer"
      onClick={() => setToast({ ...toast, visible: false })}
    />
  </motion.div>
)}

    </div>
  );
};

export default ContactUs;
