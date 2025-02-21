import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000"; // URL ของ API Server

const App: React.FC = () => {
  const [text, setText] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  // const startContract = async () => {
  //   try {
  //     const response = await axios.get(`${API_BASE_URL}/deploy`);
  //     alert("strat contract !" + response.data.address);
  //   } catch (error) {
  //     console.error("Error fetching message:", error);
  //   }
  // };
  // 📌 1️⃣ อ่านค่าข้อความจาก Blockchain
  const fetchMessage = async () => {
    try {
        const response = await axios.get<{ status: string; message: string }>(`${API_BASE_URL}/message`);
        setMessage(response.data.message);
    } catch (error) {
        console.error("Error fetching message:", error);
    }
};

  // 📌 2️⃣ ส่งข้อความไปยัง Smart Contract
  const sendTextToContract = async () => {
    if (!text) {
        alert("Please enter a message!");
        return;
    }

    try {
        const response = await axios.post<{ success: boolean; newMessage: string }>(
            `${API_BASE_URL}/message`,
            { text }
        );
        alert("Message sent to blockchain: " + response.data.newMessage);
        fetchMessage(); // โหลดข้อมูลใหม่
    } catch (error) {
        console.error("Error sending message:", error);
    }
};

  // 📌 3️⃣ โหลดข้อความจาก Blockchain เมื่อ Component เริ่มต้น
  useEffect(() => {
    // startContract();
    fetchMessage();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h2>Blockchain Message</h2>
        <p>Current Message: <strong>{message}</strong></p>
      </header>
      <input 
        type="text" 
        placeholder="Enter new message"
        value={text}
        onChange={(e) => setText(e.target.value)} 
      />
      <button onClick={sendTextToContract}>Send to Blockchain</button>
    </div>
  );
};

export default App;
