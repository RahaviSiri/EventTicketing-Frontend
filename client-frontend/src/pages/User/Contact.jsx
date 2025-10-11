import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import { Mail, User, MessageCircle, Send, Tag, X } from "lucide-react";
import emailjs from "@emailjs/browser";
import colors from "../../constants/colors";
import { AppContext } from "../../context/AppContext";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ type: "", message: "", visible: false });
  const { token, notificationServiceURL } = useContext(AppContext);
  // console.log("Auth Token:", token);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const showToast = (type, message) => {
    setToast({ type, message, visible: true });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${notificationServiceURL}/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      } else {
        showToast("success", "Your message has been sent successfully!");
        setFormData({ name: "", email: "", subject: "", message: "" });
      }
    } catch (err) {
      console.error("Error " + err.message);
      showToast("error", "Failed to send message. Please try again later.");
    }
    setLoading(false);
  };


  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-center bg-no-repeat bg-cover"
      style={{ backgroundImage: "url('/BackroundImage_2.jpg')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/1"></div>

      {/* Contact Card */}
      <motion.div
        style={{ backgroundColor: "rgba(255, 255, 255, 0.2)", backdropFilter: "blur(10px)" }}
        className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-8 z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold mb-6 flex items-center justify-center gap-2 text-white">
          <Mail /> Contact Us
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name & Email side by side */}
          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
            <div className="flex-1">
              <label className="font-medium text-white flex items-center gap-2">
                <User size={16} /> Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="text-white mt-2 border border-amber-50 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />
            </div>

            <div className="flex-1">
              <label className="font-medium text-white flex items-center gap-2">
                <Mail size={16} /> Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="text-white mt-2 border border-amber-50 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="font-medium text-white flex items-center gap-2">
              <Tag size={16} /> Subject
            </label>
            <input
              required
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="text-white mt-2 border border-amber-50 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-yellow-400"
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
              className="text-white mt-2 border border-amber-50 rounded-lg p-2 w-full h-28 focus:outline-none focus:ring-2 focus:ring-yellow-400"
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
          style={{
            backgroundColor: toast.type === "success" ? colors.accent : colors.primary,
          }}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
        >
          <span>{toast.message}</span>
          <X
            className="cursor-pointer"
            onClick={() => setToast((t) => ({ ...t, visible: false }))}
          />
        </motion.div>
      )}
    </div>
  );
};

export default ContactUs;
