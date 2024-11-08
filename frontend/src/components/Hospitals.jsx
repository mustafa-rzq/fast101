import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";

const Hospitals = () => {
  const navigate = useNavigate();
  const [hospitals, setHospitals] = useState([]);
  const [distanceWeight, setDistanceWeight] = useState(0);
  const [waitingTimeWeight, setWaitingTimeWeight] = useState(0);
  const [ratingWeight, setRatingWeight] = useState(0);
  const [error, setError] = useState(null);
  const [userLatitude, setUserLatitude] = useState(null);
  const [userLongitude, setUserLongitude] = useState(null);

  // Function to fetch hospitals and sort based on weights
  const fetchAndSortHospitals = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/get-hospitals");
      const sortedHospitals = sortHospitals(
          response.data.hospitals || [],
          distanceWeight,
          waitingTimeWeight,
          ratingWeight
      );
      setHospitals(sortedHospitals);
    } catch (err) {
      setError(err.message);
    }
  };

  // Function to handle click on hospital info button
  const handleClickInfo = async (hospitalId) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/get-hospital-info/${hospitalId}`);
      navigate("/dashboard/hospital-info", {
        state: response.data.hospitals[0],
      });
    } catch (err) {
      setError(err.message);
    }
  };

  // Function to calculate distance between two points (in this case, user and hospital)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  // Function to sort hospitals based on weights and user location
  const sortHospitals = (hospitals, distanceWeight, waitingTimeWeight, ratingWeight) => {
    if (userLatitude === null || userLongitude === null) {
      return hospitals; // If user location is not available, return unsorted hospitals
    }
    const maxDistance = Math.max(...hospitals.map(hospital => calculateDistance(userLatitude, userLongitude, hospital.latitude, hospital.longitude)));

    const maxWaitingTime = Math.max(...hospitals.map(hospital => hospital.estimated_waiting_time));
    const maxRating = 5;

    hospitals.forEach(hospital => {
      const distance = calculateDistance(userLatitude, userLongitude, hospital.latitude, hospital.longitude);
      const normalizedDistance = distance / maxDistance;
      const normalizedWaitingTime = hospital.estimated_waiting_time / maxWaitingTime;
      const normalizedRating = hospital.average_rating / maxRating;

      hospital.score = (
          normalizedDistance * distanceWeight +
          normalizedWaitingTime * waitingTimeWeight +
          (1 - normalizedRating) * ratingWeight
      );

      hospital.distance = distance.toFixed(2); // Round distance to 2 decimal places
    });

    hospitals.sort((a, b) => a.score - b.score);

    return hospitals;
  };

  // Effect to fetch hospitals when weights or user location changes
  useEffect(() => {
    fetchAndSortHospitals();
  }, [distanceWeight, waitingTimeWeight, ratingWeight, userLatitude, userLongitude]);

  // HTML script to get user location
  useEffect(() => {
    function getLocation() {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
              const latitude = position.coords.latitude;
              const longitude = position.coords.longitude;
              setUserLatitude(latitude);
              setUserLongitude(longitude);
            },
            function(error) {
              switch(error.code) {
                case error.PERMISSION_DENIED:
                  console.log('User denied the request for Geolocation.');
                  break;
                case error.POSITION_UNAVAILABLE:
                  console.log('Location information is unavailable.');
                  break;
                case error.TIMEOUT:
                  console.log('The request to get user location timed out.');
                  break;
                case error.UNKNOWN_ERROR:
                  console.log('An unknown error occurred.');
                  break;
              }
            }
        );
      } else {
        console.log('Geolocation is not supported by this browser.');
      }
    }
    getLocation();
  }, []); // Empty dependency array to run once on mount

  // Render hospitals and weights UI
  return (
      <div className="p-7 pt-20 w-5/6 mx-auto">
        <div className="p-10 mx-auto bg-white shadow-lg mt-14 rounded-xl border-2 border-gray-300">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
            Nearby Hospitals
          </h1>
          <h2 className="text-lg mb-4 text-center text-gray-700">
            Enter the weights to prioritize your search for a suitable hospital
          </h2>
          <div className="text-center">
            <span className="ml-2 text-red-600">&#128544;</span>
            <span className="text-gray-500">1 is bad ||</span>
            <span className="mx-2 text-green-600">&#128513;</span>
            <span className="text-gray-500">5 is good ||</span>
          </div>
          <br/>

          <div className="mb-8 flex justify-center space-x-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Distance Weight:
              </label>
              <input
                  type="number"
                  value={distanceWeight}
                  onChange={(e) => setDistanceWeight(Number(e.target.value))}
                  min="1"
                  max="5"
                  className="border px-2 py-1 rounded w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Waiting Time Weight:
              </label>
              <input
                  type="number"
                  value={waitingTimeWeight}
                  onChange={(e) => setWaitingTimeWeight(Number(e.target.value))}
                  min="1"
                  max="5"
                  className="border px-2 py-1 rounded w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Rating Weight:
              </label>
              <input
                  type="number"
                  value={ratingWeight}
                  onChange={(e) => setRatingWeight(Number(e.target.value))}
                  min="1"
                  max="5"
                  className="border px-2 py-1 rounded w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="p-3 rounded-lg">
            <div className="flex justify-between py-2 bg-gray-100 rounded-lg mb-3 text-center text-gray-700 font-semibold">
              <div className="w-1/5">Name</div>
              <div className="w-1/5">Address</div>
              <div className="w-1/5">Waiting Time (hours)</div>
              <div className="w-1/5">Rating</div>
              <div className="w-1/5">Distance (KM)</div>
              <div className="w-1/5">Details</div>
            </div>
            {hospitals.length > 0 ? (
                hospitals.map((hospital) => (
                    <div
                        key={hospital.hospital_id}
                        className="flex justify-between items-center py-2 bg-gray-100 mb-2 rounded-lg text-center text-gray-800 text-lg hover:bg-gray-200 transition"
                    >
                      <div className="w-1/5 px-2">{hospital.hospital_name}</div>
                      <div className="w-1/5 px-2">{hospital.hospital_location}</div>
                      <div className="w-1/5 px-2">
                        {hospital.estimated_waiting_time}
                      </div>
                      <div className="w-1/5 px-2">{hospital.average_rating}</div>
                      <div className="w-1/5 px-2">{hospital.distance}</div>
                      <div className="w-1/5 px-2">
                        <NavLink
                            className="p-1 px-2 bg-red-600 text-white rounded-lg hover:bg-blue-700 transition"
                            onClick={() => handleClickInfo(hospital.hospital_id)}
                        >
                          Info
                        </NavLink>
                      </div>
                    </div>
                ))
            ) : (
                <div className="text-center py-2 bg-gray-100 rounded-lg">
                  No hospitals found
                </div>
            )}
          </div>
          {error && <div className="text-red-600 text-center mt-4">{error}</div>}
        </div>
      </div>
  );
};

export default Hospitals;
