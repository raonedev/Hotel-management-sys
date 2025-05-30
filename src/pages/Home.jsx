import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css"; // Ensure Swiper's basic CSS is imported
// Assuming Navbar is in "../components/NavBar" and correctly styled for dark mode
import Navbar from "../components/NavBar";
import { Link } from "react-router-dom";

// Data for the hero carousel slides
const slides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?auto=format&fit=crop&w=2560&q=80",
    title: "Experience Unforgettable Stays",
    description: "Discover a world where luxury meets comfort, designed for your ultimate relaxation and enjoyment.",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=2940&q=80",
    title: "Your Home Away From Home",
    description: "Immerse yourself in unparalleled hospitality and personalized service.",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1518623489648-a173ef7824f3?auto=format&fit=crop&w=2762&q=80",
    title: "Luxury Redefined, Every Moment",
    description: "From exquisite dining to serene spa experiences, every detail is crafted for perfection.",
  },
];

// Data for featured rooms section
const featuredRooms = [
  {
    id: 1,
    title: 'Deluxe Room',
    image: 'https://images.unsplash.com/photo-1582719478280-fd86f4a81381?auto=format&fit=crop&w=2940&q=80',
    description: 'Spacious and elegant, offering premium comfort and amenities.'
  },
  {
    id: 2,
    title: 'Executive Suite',
    image: 'https://images.unsplash.com/photo-1596394348231-c918a000412e?auto=format&fit=crop&w=2940&q=80',
    description: 'Indulge in luxury with breathtaking views and exclusive services.'
  },
  {
    id: 3,
    title: 'Presidential Suite',
    image: 'https://images.unsplash.com/photo-1621376885376-e17f8a798991?auto=format&fit=crop&w=2940&q=80',
    description: 'The pinnacle of luxury, designed for an unparalleled experience.'
  },
];

// Data for amenities section
const amenities = [
  { name: 'Free Wi-Fi', icon: '🌐', description: 'Stay connected with high-speed internet access.' },
  { name: 'Swimming Pool', icon: '🏊', description: 'Relax and unwind in our refreshing swimming pool.' },
  { name: 'Fitness Center', icon: '🏋️', description: 'Maintain your routine in our state-of-the-art gym.' },
  { name: 'Restaurant & Bar', icon: '🍽️', description: 'Savor exquisite cuisine and fine beverages.' },
  { name: '24/7 Room Service', icon: '🛎️', description: 'Enjoy delicious meals delivered to your room anytime.' },
  { name: 'Spa & Wellness', icon: '💆‍♀️', description: 'Rejuvenate your mind and body with our spa treatments.' },
  { name: 'Conference Rooms', icon: '🏢', description: 'Equipped for successful meetings and events.' },
  { name: 'Concierge Service', icon: '✨', description: 'Our team is ready to assist with all your needs.' },
];

// Data for testimonials section
const testimonials = [
  {
    quote: "An absolutely wonderful stay! The staff were incredibly friendly and the room was luxurious.",
    author: "Jane Doe"
  },
  {
    quote: "The best hotel experience I've ever had. Highly recommend for anyone looking for comfort and class.",
    author: "John Smith"
  },
  {
    quote: "From check-in to check-out, everything was perfect. The amenities are top-notch!",
    author: "Emily White"
  },
];


const Home = () => {
  return (
    // Main container with dark background and Inter font
    <div className="min-h-screen bg-gray-950 text-gray-100 font-inter">
      {/* Navbar component */}
      <Navbar />

      <main>
        {/* Hero Carousel Section */}
        <section className="relative w-full h-screen">
          <Swiper
            modules={[Autoplay]}
            autoplay={{ delay: 4000, disableOnInteraction: false }} // Increased delay for better readability
            loop={true}
            slidesPerView={1}
            className="w-full h-full" // Ensure Swiper takes full height
          >
            {slides.map((slide) => (
              <SwiperSlide key={slide.id} className="relative">
                <img
                  src={slide.image}
                  alt={`Slide ${slide.id}`}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/1920x1080/1F2937/D1D5DB?text=Image+Not+Found"; }}
                />

                {/* Gradient Overlay at Bottom */}
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black via-black/60 to-transparent z-10" />

                {/* Text Content at Bottom Left */}
                <div className="absolute bottom-10 left-10 right-10 z-20 p-4 sm:p-6 lg:p-10 max-w-2xl">
                  <h2 className="text-white text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight drop-shadow-lg">
                    {slide.title}
                  </h2>
                  <p className="text-gray-200 text-lg sm:text-xl max-w-lg drop-shadow-md mb-6">
                    {slide.description}
                  </p>
                  <Link to="/room">
                    <button className="px-8 py-3 rounded-lg text-white font-semibold
                                       bg-blue-600 shadow-lg
                                       hover:bg-blue-700 transition-all duration-300
                                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75
                                       transform hover:-translate-y-0.5">
                      Explore Rooms
                    </button>
                  </Link>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        {/* About Us Section */}
        <section className="py-20 px-4 sm:px-8 max-w-6xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-6">About Our Hotel</h2>
          <p className="text-lg sm:text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
            Welcome to HotelVista, where luxury meets comfort. Nestled in the heart of the city, our hotel offers an unparalleled experience with world-class amenities and personalized service. We are dedicated to making your stay memorable and enjoyable.
          </p>
        </section>

        {/* Featured Rooms Section */}
        <section className="py-20 px-4 sm:px-8 bg-gray-900">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white text-center mb-12">Our Featured Rooms</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {featuredRooms.map((room) => (
              <div
                key={room.id}
                className="relative h-72 rounded-2xl shadow-xl overflow-hidden group transform hover:scale-105 transition-all duration-500 ease-in-out
                           bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url(${room.image})` }}
                  onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/600x400/334155/E2E8F0?text=Image+Not+Found"; }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                  <h3 className="text-white text-2xl font-bold mb-2 drop-shadow-lg">{room.title}</h3>
                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">{room.description}</p>
                  <Link to="/room">
                    <button className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md
                                       hover:bg-blue-700 transition">
                      View Details
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Amenities Section */}
        <section className="py-20 px-4 sm:px-8 max-w-6xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-12">Our Amenities</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {amenities.map((amenity, index) => (
              <div key={index} className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 flex flex-col items-center">
                <span className="text-5xl text-blue-400 mb-4">{amenity.icon}</span>
                <h3 className="text-xl font-semibold text-white mb-2">{amenity.name}</h3>
                <p className="text-gray-300 text-center">{amenity.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 px-4 sm:px-8 bg-gray-900">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white text-center mb-12">What Our Guests Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 flex flex-col items-center text-center">
                <p className="text-gray-300 italic mb-4">"{testimonial.quote}"</p>
                <p className="text-white font-semibold">- {testimonial.author}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="text-center mt-16 py-8 px-4 bg-gray-900 rounded-t-xl shadow-inner w-full">
        <p className="text-lg text-gray-400 mb-4">© {new Date().getFullYear()} HotelVista. All rights reserved.</p>
        <div className="flex justify-center space-x-6 text-gray-400">
          <Link to="#" className="hover:text-blue-400 transition">Privacy Policy</Link>
          <Link to="#" className="hover:text-blue-400 transition">Terms of Service</Link>
          <Link to="#" className="hover:text-blue-400 transition">Contact Us</Link>
        </div>
      </footer>
    </div>
  );
};

export default Home;
