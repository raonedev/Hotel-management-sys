import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const Home = () => {
  return (
    <Swiper
      modules={[Autoplay]}
      autoplay={{ delay: 2000, disableOnInteraction: false }}
      loop={true}
      slidesPerView={1}
      className="w-full h-screen"
    >
      <SwiperSlide className="relative">
  <img
    src="https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?auto=format&fit=crop&w=2560&q=80"
    alt="Image 1"
    className="w-full h-screen object-cover"
  />

  {/* Gradient Overlay at Bottom */}
  <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent z-10" />

  {/* Text Content at Bottom Left */}
  <div className="absolute bottom-10 left-10 z-20">
    <h2 className="text-white text-4xl font-bold mb-2 drop-shadow-lg">
      this is title
    </h2>
    <p className="text-white text-lg max-w-md drop-shadow-md">
      this is description
    </p>
  </div>
</SwiperSlide>
      <SwiperSlide>
        <img
          src="https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=2940&q=80"
          alt="Image 2"
          className="w-full h-screen object-cover"
        />
      </SwiperSlide>
      <SwiperSlide>
        <img
          src="https://images.unsplash.com/photo-1518623489648-a173ef7824f3?auto=format&fit=crop&w=2762&q=80"
          alt="Image 3"
          className="w-full h-screen object-cover"
        />
      </SwiperSlide>
    </Swiper>
  );
};

export default Home;
