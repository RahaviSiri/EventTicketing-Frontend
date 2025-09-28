import React from "react";
import FeaturesSection from "../../components/UserComponents/FeaturesSection";
import FeaturedEvents from "../../components/UserComponents/FeaturedEvents";
import EventCategories from "../../components/UserComponents/EventCategories";
import HeroSlider from "../../components/UserComponents/HeroSlider";
import CTABanner from "../../components/UserComponents/CTABanner";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/events');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col gap-3 mb-10">
      {/* Hero Slider */}
      <HeroSlider />

      {/* Features Section */}
      <FeaturesSection />

      {/* Events' Categories */}
      <EventCategories />

      {/* Featured Events Grid */}
      <FeaturedEvents />

      {/* ...other sections... */}
      <CTABanner
        title="Stay in the Loop!"
        subtitle="Get the latest events and offers straight to your inbox."
        buttonText="Join Now"
        onClick={handleClick}
      />
    </div>
  );
};

export default Home;
