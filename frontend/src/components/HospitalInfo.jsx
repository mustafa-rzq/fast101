import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import axios from "axios";

const HospitalInfo = () => {
  const location = useLocation();
  const hospital = location.state;
  const [hospitalLocation, setHospitalLocation] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [rating, setRating] = useState("");
  const [formRating, setFormRating] = useState("");
  const [formFeedback, setFormFeedback] = useState("");
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/get-hospital-review/${hospital.hospital_id}`
        );
        setRating(response.data.average_rating || "Unrated");
        setFeedbacks(response.data.feedback || []);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchFeedbacks();
  }, [hospital.hospital_id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userID = localStorage.getItem("userid");
      await axios.post(
        `http://localhost:8000/api/hospital-review/${userID}/${hospital.hospital_id}`,
        {
          rating: formRating,
          hospital_feedback: formFeedback,
        }
      );
      setShowForm(false);
      setFormRating("");
      setFormFeedback("");

      // Refetch the feedbacks to update the list
      const response = await axios.get(
        `http://localhost:8000/api/get-hospital-review/${hospital.hospital_id}`
      );
      setRating(response.data.average_rating || "Unrated");
      setFeedbacks(response.data.feedback || []);
    } catch (err) {
      setError(err.message);
    }
  };
  const fetchHospitalInfo = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/get-hospital-info/${hospital.hospital_id}`
      );
      setHospitalLocation(response.data.hospitals[0].hospital_link);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchHospitalInfo();
  }, []);

  const handleLeaveFeedback = () => {
    if (!token) {
      alert("Please login to leave feedback");
    } else {
      setShowForm(!showForm);
    }
  };
  return (
    <>
      <div className="flex justify-center pt-32">
        <div className="bg-gray-200 text-red-600 rounded-xl p-10 py-2 w-10/12 mx-auto flex flex-col items-center border-2 border-gray-300">
          <div className="flex w-full items-center justify-between">
            <div className="flex flex-col items-start mr-6">
              <h2 className="text-3xl font-semibold text-black">Hospital</h2>
              <h1 className="text-5xl font-bold tracking-wider mb-2">
                {hospital.hospital_name}
              </h1>
            </div>
            <div className="border-black h-32 mx-6 border-l-2"></div>
            <div className="flex flex-col items-start ml-6 w-full h-full">
              <div className="text-gray-600 w-full">
                <div className="py-3 pt-5 mx-auto">
                  <div className="flex flex-wrap justify-around text-center">
                    <div className="p-2 w-1/3 ml-4">
                      <h2 className="title-font font-medium sm:text-2xl text-lg text-gray-900">
                        {hospital.hospital_location}
                      </h2>
                      <p className="leading-relaxed">Address</p>
                    </div>
                    <div className="p-2 w-1/5">
                      <h2 className="title-font font-medium sm:text-2xl text-lg text-gray-900">
                        {hospital.estimated_waiting_time}
                      </h2>
                      <p className="leading-relaxed">Waiting Time</p>
                    </div>
                    <div className="p-2 w-1/5">
                      <h2 className="title-font font-medium sm:text-2xl text-lg text-gray-900">
                        {rating}
                      </h2>
                      <p className="leading-relaxed">Average Rating</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center w-full mt-2 py-3">
                <button
                  className="text-white hover:bg-red-700 text-md font-bold bg-red-600 p-2 px-3 rounded-lg mr-4"
                  // onClick={() => setShowForm(!showForm)}
                  onClick={handleLeaveFeedback}
                >
                  Leave Feedback
                </button>
                <a
                  href={hospitalLocation}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:bg-red-700 text-md font-bold bg-red-600 p-2 px-3 rounded-lg mr-4"
                >
                  Visit Hospital
                </a>
                <NavLink
                  className="text-white hover:bg-red-700 text-md font-bold bg-red-600 p-2 px-3 rounded-lg"
                  to="/dashboard/hospitals"
                >
                  Hospitals Home
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showForm && (
        <div className="w-5/6 mt-3 mx-auto">
          <form
            onSubmit={handleSubmit}
            className="bg-gray-200 rounded-xl border-2 border-gray-300 p-6 flex flex-wrap justify-center"
          >
            <div className="mb-4">
              <label
                className="block text-black text-md font-bold mb-2"
                htmlFor="rating"
              >
                Rating
              </label>
              <input
                id="rating"
                type="number"
                min="1"
                max="5"
                placeholder="Rate"
                value={formRating}
                onChange={(e) => setFormRating(e.target.value)}
                className="shadow appearance-none border rounded py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-4"
                required
              />
            </div>
            <div className="flex flex-col mb-4">
              <label
                className="block text-black text-md font-bold mb-2"
                htmlFor="feedback"
              >
                Feedback
              </label>
              <input
                id="feedback"
                placeholder="Feedback"
                value={formFeedback}
                onChange={(e) => setFormFeedback(e.target.value)}
                className="shadow appearance-none border rounded py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-4"
                required
              />
            </div>
            <div className="flex justify-between items-center">
              <button
                className="text-white hover:bg-green-700 text-sm font-bold bg-green-500 p-2 px-3 rounded-lg mr-3 mt-4"
                type="submit"
              >
                Submit Feedback
              </button>
              <button
                className="text-sm bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg mt-4"
                onClick={() => setShowForm(false)}
              >
                Close
              </button>
            </div>
          </form>
        </div>
      )}
      <div className="mt-8 w-1/2 text-center mx-auto">
        <h2 className="text-2xl font-bold mb-2">Historic Reviews</h2>
        {feedbacks.length > 0 ? (
          feedbacks.map((fb, index) => (
            <div key={index} className="bg-gray-300 rounded-lg p-2 mb-3">
              <div className="text-black text-md">{fb}</div>
            </div>
          ))
        ) : (
          <div className="text-center py-2 bg-gray-200 rounded-lg border-2 border-gray-300">
            No reviews found
          </div>
        )}
      </div>
    </>
  );
};

export default HospitalInfo;
