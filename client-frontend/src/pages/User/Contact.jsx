import React, { useState } from "react";
import { color, motion } from "framer-motion";
import { Mail, User, MessageCircle, Send, Tag, X } from "lucide-react";
import emailjs from "@emailjs/browser";
import colors from "../../constants/colors";

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
    setTimeout(() => setToast({ ...toast, visible: false }), 3000);
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
    <div
      className="relative min-h-screen flex items-center justify-center p-6 bg-yellow-100 bg-center bg-no-repeat bg-cover"
      style={{ backgroundImage: "url('/ContactBackround.jpg')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/25"></div>

      {/* Contact Card */}
      <motion.div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.2)", 
          backdropFilter: "blur(10px)", 
        }}
        className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-8 z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold mb-6 flex items-center justify-center gap-2 text-white">
          <Mail /> Contact Us
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="font-medium text-white flex items-center gap-2">
              <User size={16} /> Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-2 border border-amber-50 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="font-medium text-white flex items-center gap-2">
              <Mail size={16} /> Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-2 border border-amber-50 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
            />
          </div>

          {/* Subject */}
          <div>
            <label className="font-medium text-white flex items-center gap-2">
              <Tag size={16} /> Subject
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="mt-2 border border-amber-50 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {/* Message */}
          <div>
            <label className="font-medium text-white flex items-center gap-2">
              <MessageCircle size={16} /> Message *
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="mt-2 border border-amber-50 rounded-lg p-2 w-full h-28 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
            ></textarea>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg text-white flex items-center justify-center gap-2 font-semibold"
            style={{ backgroundColor: loading ? "#ccc" : colors.accent }}
          >
            <Send size={16} /> {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </motion.div>

      {/* Toast */}
      {toast.visible && (
        <motion.div
          className="fixed top-20 right-6 px-4 py-3 rounded-lg text-white shadow-lg z-50 flex items-center justify-between gap-4"
          style={{ backgroundColor: toast.type === "success" ? colors.accent : colors.primary }}
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
