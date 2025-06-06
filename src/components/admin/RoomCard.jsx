import React from 'react';

function RoomCard({ room }) {
   // Helper to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "Available":
        return "text-green-500";
      case "Booked":
        return "text-red-500";
      case "Maintenance":
        return "text-yellow-500";
      default:
        return "text-gray-400";
    }
  };
   const defaultImage = "https://placehold.co/600x400/334155/E2E8F0?text=No+Image"; 
  return (
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 flex flex-col transform hover:scale-102 transition-all duration-300 ease-in-out">
      <img
        src={room.images && room.images.length > 0 ? room.images[0] : defaultImage}
        alt={room.name}
        className="w-full h-48 object-cover rounded-lg mb-4 border border-gray-700"
        onError={(e) => { e.target.onerror = null; e.target.src = defaultImage; }}
      />
      <h3 className="text-2xl font-bold text-blue-400 mb-2">{room.name}</h3>
      <p className="text-gray-300 mb-1">
        <span className="font-semibold text-white">Category:</span> {room.category}
      </p>
      <p className="text-gray-300 mb-1">
        <span className="font-semibold text-white">Price:</span> ${room.price}/night
      </p>
      <p className="text-gray-300 mb-1">
        <span className="font-semibold text-white">Capacity:</span> {room.capacity} guests
      </p>
      <p className="text-gray-300 mb-1">
        <span className="font-semibold text-white">Description:</span> {room.description}
      </p>
      <p className="text-gray-300 mb-4">
        <span className="font-semibold text-white">Status:</span>{" "}
        <span className={`font-bold ${getStatusColor(room.bookingStatus)}`}>
          {room.bookingStatus}
        </span>
      </p>
      {room.amenities && room.amenities.length > 0 && (
        <div className="mb-4">
          <span className="font-semibold text-white">Amenities:</span>
          <div className="flex flex-wrap gap-2 mt-2">
            {room.amenities.map((amenity, index) => (
              <span key={index} className="bg-gray-700 text-gray-200 text-xs px-3 py-1 rounded-full">
                {amenity}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-auto flex justify-end space-x-3">
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-200">
          View
        </button>
        <button className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-200">
          Edit
        </button>
        <button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-200">
          Delete
        </button>
      </div>
    </div>
  );
}

export default RoomCard;