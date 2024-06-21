const db = require("../db");
const { hash } = require("bcryptjs");
const { sign } = require("jsonwebtoken");
const { SECRET } = require("../constants");

exports.getUsers = async (req, res) => {
  try {
    const { rows } = await db.query("select * from users");
    console.log(rows);
    return res.status(200).json({
      users: rows,
    });
  } catch (error) {
    console.log(error.message);
  }
};

exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashpassword = await hash(password, 10);
    await db.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2 , $3)",
      [username, email, hashpassword]
    );
    return res.status(201).json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
  let user = req.user;
  let payload = {
    id: user.user_id,
    email: user.email,
    user: user.username,
    userid: user.user_id,
  };
  try {
    const token = sign(payload, SECRET);
    return res.status(200).cookie("token", token, { httpOnly: true }).json({
      success: true,
      message: "Login successful",
      token: token,
      user: user.username,
      userid: user.user_id,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

exports.dashboard = async (req, res) => {
  try {
    return res.status(200).json({
      info: "Dashboard info",
    });
  } catch (error) {
    console.log(error.message);
  }
};

exports.logout = async (req, res) => {
  try {
    return res.status(200).clearCookie("token", { httpOnly: true }).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

exports.hospital = async (req, res) => {
  const {
    hospital_name,
    hospital_location,
    hospital_link,
    hospital_distance,
    estimated_waiting_time,
  } = req.body;
  try {
    await db.query(
      "INSERT INTO hospitals (hospital_name, hospital_location, hospital_link, hospital_distance ,estimated_waiting_time) VALUES ($1, $2 , $3, $4)",
      [hospital_name, hospital_location, hospital_link, hospital_distance ,estimated_waiting_time]
    );
    return res.status(201).json({
      success: true,
      message: "Hospital added successfully",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

exports.gethospitals = async (req, res) => {
  try {
    const { rows } = await db.query("select * from hospitals");
    console.log(rows);
    return res.status(200).json({
      hospitals: rows,
    });
  } catch (error) {
    console.log(error.message);
  }
};

exports.gethospitalsbyid = async (req, res) => {
  const hospital_id = req.params.hospital_id;
  try {
    const { rows } = await db.query(
      "SELECT * FROM hospitals WHERE hospital_id = $1",
      [hospital_id]
    );
    console.log(rows);
    return res.status(200).json({
      hospitals: rows,
    });
  } catch (error) {
    console.log(error.message);
  }
};

exports.addUserTreatmentPlan = async (req, res) => {
  const { userId, medicine_name, medicine_quantity, medicine_time, notes } =
    req.body;
  try {
    const result = await db.query(
      `INSERT INTO treatmentplan (user_id, medicine_name, medicine_quantity, medicine_time, notes) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [userId, medicine_name, medicine_quantity, medicine_time, notes]
    );
    const newItem = result.rows[0];
    return res.status(201).json({
      success: true,
      message: "Item added successfully",
      plan: newItem,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

exports.getUserTreatmentPlan = async (req, res) => {
  const userId = req.params.userId;
  try {
    const { rows } = await db.query(
      "SELECT * FROM treatmentplan WHERE user_id = $1",
      [userId]
    );
    return res.status(200).json({
      plans: rows,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

exports.deleteUserTreatmentPlan = async (req, res) => {
  const treatmentplan_id = req.params.planId;
  const userId = req.params.userId;
  try {
    const result = await db.query(
      "DELETE FROM treatmentplan WHERE user_id = $1 AND   treatmentplan_id  = $2 RETURNING *",
      [userId, treatmentplan_id]
    );
    return res.status(200).json({
      success: true,
      message: "Treatment plan deleted successfully",
      deletedPlan: result.rows[0],
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

exports.addreviews = async (req, res) => {
  const hospital_id = req.params.hospital_id;
  const user_id = req.params.user_id;
  const { rating, hospital_feedback } = req.body;
  try {
    const result = await db.query(
      `INSERT INTO reviews (user_id, hospital_id, rating, hospital_feedback) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [user_id, hospital_id, rating, hospital_feedback]
    );
    const newItem = result.rows[0];
    return res.status(200).json({
      success: true,
      message: "Added hospital review successfully",
      review: newItem,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

exports.getaveragerating = async (req, res) => {
  const hospital_id = req.params.hospital_id;
  try {
    const avgRatingResult = await db.query(
      "SELECT AVG(rating) AS average_rating FROM reviews WHERE hospital_id = $1",
      [hospital_id]
    );
    let averageRating = avgRatingResult.rows[0].average_rating;
    // Round the average rating to 2 decimal places
    if (averageRating !== null) {
      averageRating = parseFloat(averageRating).toFixed(1);
    }
    const feedbackResult = await db.query(
      "SELECT hospital_feedback FROM reviews WHERE hospital_id = $1",
      [hospital_id]
    );
    const feedback = feedbackResult.rows.map((row) => row.hospital_feedback);
    return res.status(200).json({
      success: true,
      average_rating: averageRating,
      feedback: feedback,
    });
  } catch (error) {
    console.log(`Error executing query: ${error.message}`);
    return res.status(500).json({
      error: error.message,
    });
  }
};
