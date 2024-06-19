import React, { useState, useEffect } from "react";
import axios from "axios";

const SavePlans = () => {
  const [plans, setPlans] = useState([]);
  const userID = localStorage.getItem("userid");

  useEffect(() => {
    const fetchSavedPlans = async () => {
      if (!userID) {
        console.error("No userID found in local storage.");
        return;
      }
      try {
        const response = await axios.get(
          `http://localhost:8000/api/get-treatmentplan/${userID}`
        );
        setPlans(response.data.plans);
      } catch (error) {
        console.error("Error fetching saved plans:", error);
      }
    };
    fetchSavedPlans();
  }, []);

  const handleDeletePlan = async (index) => {
    const userID = localStorage.getItem("userid");
    const planId = plans[index].treatmentplan_id;
    try {
      await axios.delete(
        `http://localhost:8000/api/delete-treatmentplan/${userID}/${planId}`
      );
      // Remove the plan from the state
      const updatedPlans = [...plans];
      updatedPlans.splice(index, 1);
      setPlans(updatedPlans);
    } catch (error) {
      console.error("Error deleting plan:", error);
    }
  };

  return (
    <div className="p-10 pt-10 mx-auto bg-gray-200 rounded-xl border-2 border-gray-300">
      <h1 className="text-3xl font-bold mb-4 text-center">Saved Plans</h1>
      <div className="p-3 rounded-lg">
        <div className="flex justify-between py-2 bg-gray-300 rounded-lg mb-3">
          <div className="w-1/5 font-bold">Medicine Name</div>
          <div className="w-1/5 font-bold">Quantity</div>
          <div className="w-1/5 font-bold">Times</div>
          <div className="w-1/5 font-bold">Notes</div>
          <div className="w-1/5 font-bold">Actions</div>
        </div>
        {plans.length > 0 ? (
          plans.map((plan, index) => (
            <div
              key={plan.treatmentplan_id}
              className="flex justify-between items-center py-2 bg-gray-300 mb-2 rounded-lg"
            >
              <div className="w-1/5 px-2">{plan.medicine_name}</div>
              <div className="w-1/5 px-2">{plan.medicine_quantity}</div>
              <div className="w-1/5 px-2">{plan.medicine_time}</div>
              <div className="w-1/5 px-2">{plan.notes}</div>
              <div className="w-1/5 px-2">
                <button
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold py-1 px-4 rounded-lg"
                  onClick={() => handleDeletePlan(index)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-2 bg-gray-300 rounded-lg">
            No Plans Saved
          </div>
        )}
      </div>
    </div>
  );
};

export default SavePlans;
