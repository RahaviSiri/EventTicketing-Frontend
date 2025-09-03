import React, { useContext, useState, useRef, useEffect } from "react";
import axios from "axios";
import colors from "../../constants/colors";
import { AppContext } from "../../context/AppContext";
import { useLocation, useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";


const DiscountCreation = () => {
  const [discountData, setDiscountData] = useState({
    code: "",
    description: "",
    discountType: "PERCENTAGE",
    value: "",
    validFrom: "",
    validTo: "",
  });
  const location = useLocation();
  const event = location.state?.event;
  const navigate = useNavigate();

  // event.id will give you eventId
  const eventId = event?.id;

  const { discountServiceURL, token } = useContext(AppContext);
  const [message, setMessage] = useState("");
  const canvasRef = useRef(null);
  const [imageURL, setImageURL] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDiscountData((prev) => ({ ...prev, [name]: value }));
  };

  const drawImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    canvas.width = 600;
    canvas.height = 300;

    // Background
    ctx.fillStyle = colors.secondary || "#f0f0f0";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = colors.primary || "#333";
    ctx.textAlign = "center";

    ctx.font = "bold 30px 'Outfit', Arial";
    ctx.fillText(`⭐ Code: ${discountData.code} ⭐`, canvas.width / 2, 60);

    ctx.font = "20px 'Outfit', Arial";
    ctx.fillText(discountData.description, canvas.width / 2, 120);

    const discountText =
      discountData.discountType === "PERCENTAGE"
        ? `${discountData.value}% OFF`
        : `$${discountData.value} OFF`;
    ctx.fillText(discountText, canvas.width / 2, 180);

    ctx.font = "16px 'Outfit', Arial";
    ctx.fillText(
      `📅 Valid: ${discountData.validFrom} to ${discountData.validTo}`,
      canvas.width / 2,
      240
    );

    setImageURL(canvas.toDataURL("image/png"));
  };

  useEffect(() => {
    drawImage();
  }, [discountData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/png")
    );

    const formData = new FormData();
    formData.append(
      "discount",
      new Blob([JSON.stringify(discountData)], { type: "application/json" })
    );
    formData.append("image", blob, `${discountData.code}.png`);

    try {
      const res = await axios.post(
        `${discountServiceURL}/event/${eventId}/file`,
        formData,
        { headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` } }
      );
      setMessage(`Discount created! Code: ${res.data.code}`);
      setDiscountData({
        code: "",
        description: "",
        discountType: "PERCENTAGE",
        value: "",
        validFrom: "",
        validTo: "",
      })
      navigate('/organizers/eventDetails', { state: { event } });
    } catch (error) {
      console.error(error);
      setMessage("Error creating discount.");
    }
  };

  return (
    <div className="p-6">
      <h2
        className="text-2xl font-bold mb-6"
        style={{ color: colors.primary }}
      >
        Create Discount
      </h2>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
      >
        {/* Code */}
        <div className="flex flex-col md:flex-row md:items-center md:gap-4">
          <label className="w-full md:w-1/3 font-semibold text-gray-700">
            Code:
          </label>
          <input
            placeholder="Unique discount code"
            type="text"
            name="code"
            value={discountData.code}
            onChange={handleChange}
            required
            className="w-full md:w-2/3 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Description */}
        <div className="flex flex-col md:flex-row md:items-start md:gap-4">
          <label className="w-full md:w-1/3 font-semibold text-gray-700">
            Description:
          </label>
          <textarea
            placeholder="Brief description of the discount"
            name="description"
            value={discountData.description}
            onChange={handleChange}
            required
            className="w-full md:w-2/3 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            rows={3}
          />
        </div>

        {/* Discount Type & Value */}
        <div className="flex flex-col md:flex-row md:items-center md:gap-4">
          <label className="w-full md:w-1/3 font-semibold text-gray-700">
            Discount Type:
          </label>
          <select
            name="discountType"
            value={discountData.discountType}
            onChange={handleChange}
            className="w-full md:w-2/3 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="PERCENTAGE">Percentage</option>
            <option value="FLAT">Flat</option>
          </select>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:gap-4">
          <label className="w-full md:w-1/3 font-semibold text-gray-700 ">
            Value:
          </label>
          <input
            placeholder="e.g., 20 for 20% or 15 for $15"
            type="number"
            name="value"
            value={discountData.value}
            onChange={handleChange}
            required
            className="w-full md:w-2/3 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Validity */}
        <div className="flex flex-col md:flex-row md:items-center md:gap-4">
          <label className="w-full md:w-1/3 font-semibold text-gray-700 ">
            Valid From:
          </label>
          <input
            type="datetime-local"
            name="validFrom"
            value={discountData.validFrom}
            onChange={handleChange}
            required
            className="w-full md:w-2/3 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:gap-4">
          <label className="w-full md:w-1/3 font-semibold text-gray-700 ">
            Valid To:
          </label>
          <input
            type="datetime-local"
            name="validTo"
            value={discountData.validTo}
            onChange={handleChange}
            required
            className="w-full md:w-2/3 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Submit Button */}
        <button
          style={{ backgroundColor: colors.primary }}
          type="submit"
          className="w-full md:w-1/3 mx-auto p-3 text-white rounded-lg font-semibold hover:bg-primary-dark transition mt-4"
        >
          Create Discount
        </button>

        {/* Message */}
        {message && (
          <p style={{color : colors.primary}} className="text-center mt-2 font-medium">{message}</p>
        )}
      </form>

      {/* Canvas (hidden) */}
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {/* Discount Image Preview */}
      {imageURL && (
        <div className="mt-6 text-center">
          <p className="text-primary font-semibold mb-2">Discount Image Preview:</p>
          <img
            src={imageURL}
            alt="Discount"
            className="w-full max-w-md mx-auto rounded-lg border-2 border-primary"
          />
          <a
            href={imageURL}
            download={`${discountData.code || "discount"}.png`}
            className="block mt-2 text-accent font-medium hover:underline"
          >
            Download Image
          </a>
        </div>
      )}
    </div>
  );
};

export default DiscountCreation;
