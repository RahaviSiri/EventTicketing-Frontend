import React from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import Login from "../Login";

// Page sections for the Home subroutes
const Landing = () => (
  <section className="p-6">
    <h1 className="text-4xl font-bold text-center mt-10">
      Welcome to EventEase
    </h1>
  </section>
);

const Events = () => (
  <section className="p-6">
    <h2 className="text-3xl font-semibold text-center mt-10">Browse Events</h2>
  </section>
);

const About = () => (
  <section className="p-6">
    <h2 className="text-3xl font-semibold text-center mt-10">About Us</h2>
  </section>
);

const Contact = () => (
  <section className="p-6">
    <h2 className="text-3xl font-semibold text-center mt-10">Contact Us</h2>
  </section>
);

const Home = () => {
  return (
    <>
      <NavBar />

      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/events" element={<Events />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Login />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
};

export default Home;
