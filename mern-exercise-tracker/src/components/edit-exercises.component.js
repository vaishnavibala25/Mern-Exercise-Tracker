import React, { useEffect, useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useParams, useNavigate } from "react-router-dom";

export default function EditExercise() {
  const { id } = useParams();       // ✅ ROUTE PARAM
  const navigate = useNavigate();   // ✅ NAVIGATION

  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(0);
  const [date, setDate] = useState(new Date());
  const [users, setUsers] = useState([]);

  // 🔹 Load exercise + users
  useEffect(() => {
    axios.get("http://localhost:3000/exercises/" + id)
      .then(res => {
        setUsername(res.data.username);
        setDescription(res.data.description);
        setDuration(res.data.duration);
        setDate(new Date(res.data.date));
      })
      .catch(err => console.log(err));

    axios.get("http://localhost:3000/users/")
      .then(res => {
        setUsers(res.data.map(u => u.username));
      });
  }, [id]);

  const onSubmit = (e) => {
    e.preventDefault();

    const exercise = {
      username,
      description,
      duration,
      date
    };

    axios.post("http://localhost:3000/exercises/update/" + id, exercise)
      .then(res => console.log(res.data));

    navigate("/");   // ✅ redirect
  };

  return (
    <div>
      <h3>Edit Exercise Log</h3>
      <form onSubmit={onSubmit}>

        <div className="form-group">
          <label>Username:</label>
          <select
            required
            className="form-control"
            value={username}
            onChange={e => setUsername(e.target.value)}
          >
            {users.map(user => (
              <option key={user} value={user}>{user}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Description:</label>
          <input
            type="text"
            required
            className="form-control"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Duration (minutes):</label>
          <input
            type="number"
            className="form-control"
            value={duration}
            onChange={e => setDuration(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Date:</label>
          <DatePicker selected={date} onChange={setDate} />
        </div>

        <div className="form-group">
          <input
            type="submit"
            value="Edit Exercise Log"
            className="btn btn-primary"
          />
        </div>

      </form>
    </div>
  );
}
