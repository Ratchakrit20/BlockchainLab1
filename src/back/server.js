const express = require("express");
const cors = require("cors");
const { ethers } = require("hardhat");
const HelloWorldABI = require("../../artifacts/contracts/HelloWorld.sol/HelloWorld.json");

const app = express();
app.use(cors());
app.use(express.json());
// ⚡ ตั้งค่า Provider และ Signer (ใช้ Hardhat Network)
const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:7545");

// เลือกบัญชีที่ใช้เซ็นธุรกรรม (ใช้ Account #0 ที่ Hardhat ให้)
const privateKey = "0x0b115d5767f91b486a07002348c9edcf034d01883aff354883f1cd1bd7fd2173";
const signer = new ethers.Wallet(privateKey, provider);

// ⚡ ใส่ Contract Address ที่ Deploy แล้ว
var contractAddress = "0x29C7265219Df86b60636b3712a701561F605dF3b"; // 📌 แก้ไขเป็น Contract ที่ Deploy แล้ว "npx hardhat run scripts/deploy.js --network ganache"
const contract = new ethers.Contract(contractAddress, HelloWorldABI.abi, signer);

// 📌 1️⃣ API สำหรับ Deploy Smart Contract (ใช้เมื่อยังไม่ได้ Deploy)
// app.get("/deploy", async (req, res) => {
//     try {
//         const HelloWorld = await ethers.getContractFactory("HelloWorld");
//         const contract = await HelloWorld.deploy("Hello World!");
//         // await contract.deployed();
//         contractAddress = contract.address;
//         console.log("Contract deployed at:", contract.address);
//         res.json({ address: contract.address });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: error.message });
//     }
// });

// 📌 2️⃣ API สำหรับอ่านค่าข้อความจาก Smart Contract
app.get("/message", async (req, res) => {
    try {
        const message = await contract.getMessage();
        res.json({ status: "success", message });
    } catch (e) {
        res.json({ status: "error", error: e.message });
    }
});

// 📌 3️⃣ API สำหรับอัปเดตข้อความใน Smart Contract
app.post("/message", async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) return res.status(400).json({ error: "Missing 'text' parameter" });
        // 🔹 เรียก setMessage() พร้อมกำหนด Gas Options
        const estimatedGas = await contract.estimateGas.setMessage(text);
        const gasOptions = {
            gasPrice: ethers.utils.parseUnits("5", "gwei"),  // ปรับค่า Gas Price ให้น้อยลง
            gasLimit: estimatedGas.mul(2)  // ใช้ gas ที่คำนวณมาและเผื่อไว้อีกเท่าตัว
        };

        const tx = await contract.setMessage(text, gasOptions);
        await tx.wait();
        // 🔹 อ่านค่าข้อความที่อัปเดตจาก Contract
        const newMessage = await contract.getMessage();
        console.log("✅ Updated Message:", newMessage);
        // await writeContract("setMessage", text);
        res.json({ success: true, newMessage: newMessage });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// 🌍 รัน API บนพอร์ต 5000
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
