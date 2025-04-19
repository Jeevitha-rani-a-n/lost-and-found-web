const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const twilio = require("twilio");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = twilio(accountSid, authToken);

require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI);

const ItemSchema = new mongoose.Schema({
  item: String,
  reporter: String,
  email: String,
  phone: String,
  description: String,
  retrieved: { type: Boolean, default: false }
});

const LostItem = mongoose.model("LostItem", ItemSchema);

app.post("/report", async (req, res) => {
  const item = new LostItem(req.body);
  await item.save();
  res.send({ success: true });
});

app.get("/items", async (req, res) => {
  const items = await LostItem.find();
  res.send(items);
});

app.put("/mark-retrieved/:id", async (req, res) => {
  await LostItem.findByIdAndUpdate(req.params.id, { retrieved: true });
  res.send({ success: true });
});

app.delete("/delete/:id", async (req, res) => {
  await LostItem.findByIdAndDelete(req.params.id);
  res.send({ success: true });
});

app.post("/contact/:id", async (req, res) => {
    try {
      const item = await Item.findById(req.params.id);
      if (!item || !item.phone) {
        return res.status(404).send("Item or phone number not found");
      }
  
      const messageBody = `Hello ${item.reporter}, an item matching your lost report (${item.item}) has been found. Please contact the admin at the administration office to retrieve it.`;
  
      await twilioClient.messages.create({
        body: messageBody,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: item.phone,
      });
  
      res.send("Message sent successfully.");
    } catch (err) {
      console.error("Twilio error:", err);
      res.status(500).send("Failed to send message.");
    }
  });
  

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
