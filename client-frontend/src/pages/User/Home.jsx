import React from "react";
import FeaturesSection from "../../components/UserComponents/FeaturesSection";
import FeaturedEvents from "../../components/UserComponents/FeaturedEvents";
import EventCategories from "../../components/UserComponents/EventCategories";
import HeroSlider from "../../components/UserComponents/HeroSlider";

const Home = () => {

  return (
    <div className="flex flex-col gap-3 mb-10">
      {/* Hero Slider */}
      <HeroSlider/>

      {/* Features Section */}
      <FeaturesSection/>

      {/* Events' Categories */}
      <EventCategories/>

      {/* Featured Events Grid */}
      <FeaturedEvents/>
    </div>
  );
};

export default Home;
