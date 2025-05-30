import React from 'react'

const rooms = [
  {
    id: 1,
    title: 'Deluxe Room',
    image: 'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?auto=format&fit=crop&w=2560&q=80',
    description: 'Experience luxury and comfort in our spacious Deluxe Room, perfect for a relaxing getaway.'
  },
  {
    id: 2,
    title: 'Executive Suite',
    image: 'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?auto=format&fit=crop&w=2560&q=80',
    description: 'Indulge in the elegance of our Executive Suite, offering panoramic views and premium amenities.'
  },
  {
    id: 3,
    title: 'Standard Room',
    image: 'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?auto=format&fit=crop&w=2560&q=80',
    description: 'A comfortable and cozy option, our Standard Room provides all the essentials for a pleasant stay.'
  },
  {
    id: 4,
    title: 'Presidential Suite',
    image: 'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?auto=format&fit=crop&w=2560&q=80',
    description: 'The ultimate in luxury, the Presidential Suite offers unparalleled sophistication and space.'
  },
   {
    id: 5,
    title: 'Family Room',
    image: 'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?auto=format&fit=crop&w=2560&q=80',
    description: 'Designed for families, this room provides ample space and amenities for everyone to enjoy.'
  },
  {
    id: 6,
    title: 'Honeymoon Suite',
    image: 'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?auto=format&fit=crop&w=2560&q=80',
    description: 'A romantic escape awaits in our Honeymoon Suite, perfect for couples.'
  },
  {
    id: 7,
    title: 'Accessible Room',
    image: 'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?auto=format&fit=crop&w=2560&q=80',
    description: 'Thoughtfully designed for accessibility, ensuring a comfortable stay for all guests.'
  },
  {
    id: 8,
    title: 'Studio Apartment',
    image: 'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?auto=format&fit=crop&w=2560&q=80',
    description: 'Ideal for extended stays, our Studio Apartment offers a kitchenette and living area.'
  },
   {
    id: 1,
    title: 'Deluxe Room',
    image: 'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?auto=format&fit=crop&w=2560&q=80',
    description: 'Experience luxury and comfort in our spacious Deluxe Room, perfect for a relaxing getaway.'
  },
  {
    id: 2,
    title: 'Executive Suite',
    image: 'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?auto=format&fit=crop&w=2560&q=80',
    description: 'Indulge in the elegance of our Executive Suite, offering panoramic views and premium amenities.'
  },
  {
    id: 3,
    title: 'Standard Room',
    image: 'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?auto=format&fit=crop&w=2560&q=80',
    description: 'A comfortable and cozy option, our Standard Room provides all the essentials for a pleasant stay.'
  },
  {
    id: 4,
    title: 'Presidential Suite',
    image: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=2940&q=80',
    description: 'The ultimate in luxury, the Presidential Suite offers unparalleled sophistication and space.'
  },
   {
    id: 5,
    title: 'Family Room',
    image: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=2940&q=80',
    description: 'Designed for families, this room provides ample space and amenities for everyone to enjoy.'
  },
  {
    id: 6,
    title: 'Honeymoon Suite',
    image: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=2940&q=80',
    description: 'A romantic escape awaits in our Honeymoon Suite, perfect for couples.'
  },
  {
    id: 7,
    title: 'Accessible Room',
    image: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=2940&q=80',
    description: 'Thoughtfully designed for accessibility, ensuring a comfortable stay for all guests.'
  },
  {
    id: 8,
    title: 'Studio Apartment',
    image: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=2940&q=80',
    description: 'Ideal for extended stays, our Studio Apartment offers a kitchenette and living area.'
  },
];


const RoomBookingPage = () => {
  return (
      // Main container with dark background and text color
    <div className="min-h-screen bg-gray-950 text-gray-100 p-4 sm:p-8 font-inter">
      {/* Header section */}
      <header className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 leading-tight">
          Discover Your Perfect Stay
        </h1>
        <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto">
          Explore our exquisite collection of rooms and suites, designed for ultimate comfort and luxury.
        </p>
      </header>

      {/* Grid for room cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 max-w-7xl mx-auto">
        {rooms.map((room, index) => (
          <div
            // Using a combination of title, id, and index for a more unique key
            key={`${room.title}-${room.id}-${index}`}
            className="relative h-72 rounded-2xl shadow-xl overflow-hidden group transform hover:scale-105 transition-all duration-500 ease-in-out
                       bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700"
          >
            {/* Background image for the room card */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
              style={{ backgroundImage: `url(${room.image})` }}
              // Fallback for image loading errors
              onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/600x400/334155/E2E8F0?text=Image+Not+Found"; }}
            ></div>

            {/* Overlay for text and button */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
              <h2 className="text-white text-2xl font-bold mb-2 drop-shadow-lg">{room.title}</h2>
              <p className="text-gray-300 text-sm mb-4 line-clamp-2">{room.description}</p>
              <button className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md
                                 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75
                                 transform hover:-translate-y-0.5 transition-all duration-300">
                Book Now
              </button>
            </div>
          </div>
        ))}
        
      </div>
      {/* Beautiful Quote Section */}
      <footer className="text-center mt-16 py-8 px-4 bg-gray-900 rounded-xl shadow-inner w-full"> {/* Removed max-w-3xl mx-auto */}
        <p className="text-2xl italic text-gray-300 mb-4 leading-relaxed">
          "The world is a book, and those who do not travel read only one page."
        </p>
        <p className="text-lg font-semibold text-gray-400">- Saint Augustine</p>
      </footer>
    </div>
  )
}

export default RoomBookingPage