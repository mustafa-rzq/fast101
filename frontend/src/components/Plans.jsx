import { useState, useEffect } from "react";
import SavePlans from "./SavePlans";
import axios from "axios";

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [medicineName, setMedicineName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [times, setTimes] = useState("");
  const [notes, setNotes] = useState("");
  const [showForm, setShowForm] = useState(false);

  const handleAddPlan = () => {
    setShowForm(!showForm);
  };
  const handleSavePlan = async (e) => {
    const userId = localStorage.getItem("userid");
    e.preventDefault();
    const newPlan = {
      userId: userId,
      medicine_name: medicineName,
      medicine_quantity: quantity,
      medicine_time: times,
      notes: notes,
    };
    try {
      const response = await axios.post(
        "http://localhost:8000/api/treatmentplan",
        newPlan
      );
      setPlans([...plans, newPlan]);
      setMedicineName("");
      setQuantity("");
      setTimes("");
      setNotes("");
      setShowForm(false);
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeletePlan = (index) => {
    const updatedPlans = [...plans];
    updatedPlans.splice(index, 1);
    setPlans(updatedPlans);
  };
  useEffect(() => {
    const fetchPlans = async () => {
      const userId = localStorage.getItem("userid");
      try {
        const response = await axios.get(
          `http://localhost:8000/api/get-treatmentplan/${userId}`
        );
      } catch (error) {
        console.error("Error fetching plans:", error);
      }
    };
    fetchPlans();
  }, []);

  return (
    <div className="p-10 pt-36 w-5/6 mx-auto text-center">
      <button
        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg mb-6"
        onClick={handleAddPlan}
      >
        New treatment plan
      </button>
      {showForm && (
        <div className="bg-gray-200 p-6 rounded-xl mb-6 border-2 border-gray-300">
          <input
            type="text"
            placeholder="Medicine name"
            className="border border-gray-400 p-2 rounded my-2 mr-2"
            value={medicineName}
            onChange={(e) => setMedicineName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Medicine taking quantity"
            className="border border-gray-400 p-2 rounded my-2 mr-2"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Medicine taking times"
            className="border border-gray-400 p-2 rounded my-2 mr-2"
            value={times}
            onChange={(e) => setTimes(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Notes"
            className="border border-gray-400 p-2 rounded my-2 mr-2"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            required
          />
          <button
            className="text-sm bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg mr-2 ml-2"
            onClick={handleSavePlan}
          >
            Save plan
          </button>
          <button
            className="text-sm bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg"
            onClick={() => setShowForm(false)}
          >
            Close
          </button>
        </div>
      )}
      <SavePlans />
    </div>
  );
};

export default Plans;
