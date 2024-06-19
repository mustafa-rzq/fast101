import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";

const Hospitals = () => {
  const navigate = useNavigate();
  const [hospitals, setHospitals] = useState([]);
  const [avgrating, setAvgrating] = useState();
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSavedHospitals = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/get-hospitals"
        );
        setHospitals(response.data.hospitals || []);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchSavedHospitals();
  }, []);

  const handleClickInfo = async (hospitalId) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/get-hospital-info/${hospitalId}`
      );
      console.log(response.data.hospitals);
      navigate("/dashboard/hospital-info", {
        state: response.data.hospitals[0],
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-7 pt-20 w-5/6 mx-auto">
      <div className="p-10 mx-auto bg-gray-200 mt-14 rounded-xl border-2 border-gray-300">
        <h1 className="text-3xl font-bold mb-4 text-center">
          Nearby Hospitals
        </h1>
        <div className="p-3 rounded-lg">
          <div className="flex justify-between py-2 bg-gray-300 rounded-lg mb-3 text-center">
            <div className="w-1/5 font-bold">Name</div>
            <div className="w-1/5 font-bold">Address</div>
            <div className="w-1/5 font-bold">Waiting Time</div>
            <div className="w-1/5 font-bold">Rating</div>
            <div className="w-1/5 font-bold">Details</div>
          </div>
          {hospitals.length > 0 ? (
            hospitals.map((hospital) => (
              <div
                key={hospital.hospital_id}
                className="flex justify-between items-center py-2 bg-gray-300 mb-2 rounded-lg text-center text-lg"
              >
                <div className="w-1/5 px-2">{hospital.hospital_name}</div>
                <div className="w-1/5 px-2">{hospital.hospital_location}</div>
                <div className="w-1/5 px-2">
                  {hospital.estimated_waiting_time}
                </div>
                <div className="w-1/5 px-2">{hospital.average_rating}</div>
                <div className="w-1/5 px-2">
                  <NavLink
                    className="p-1 px-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    onClick={() => handleClickInfo(hospital.hospital_id)}
                  >
                    Info
                  </NavLink>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-2 bg-gray-300 rounded-lg">
              No hospitals found
            </div>
          )}
        </div>
        {/* {error && <div className="text-red-600 text-center mt-4">{error}</div>} */}
      </div>
    </div>
  );
};

export default Hospitals;
