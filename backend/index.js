require("dotenv").config();
const express = require("express");
const { WebClient } = require("@slack/web-api");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 5000;
const slackClient = new WebClient(process.env.SLACK_BOT_TOKEN);
const slackToken = process.env.SLACK_BOT_TOKEN;
const channelId = process.env.CHANNEL_ID;

let lastSentTimestamp = null;

// 1. Send a message
app.post("/send", async (req, res) => {
  try {
    const message = req.body.message || "Default message from /send";
    const result = await slackClient.chat.postMessage({
      channel: channelId,
      text: message,
    });
    lastSentTimestamp = result.ts;
    res.send({ status: "Message sent", ts: result.ts });
  } catch (error) {
    res.status(500).send({ error: error.data || error.message });
  }
});

// 2. Schedule a message
app.post("/schedule", async (req, res) => {
  try {
    const { message, postAt } = req.body;

    if (!message || !postAt) {
      return res.status(400).send({ error: "Message and postAt required" });
    }

    const result = await slackClient.chat.scheduleMessage({
      channel: channelId,
      text: message,
      post_at: postAt, // Must be UNIX timestamp (seconds)
    });

    res.send({
      status: "Message scheduled",
      scheduled_message_id: result.scheduled_message_id,
    });
  } catch (err) {
    console.error("❌ Schedule Error:", err.data || err.message);
    res.status(500).send(err.data || { error: "Schedule failed" });
  }
});

// 3. Retrieve latest messages (limit: 1)
app.post("/retrieveById", async (req, res) => {
  try {
    const { ts } = req.body;
    let result;

    if (ts) {
      // Fetch specific message by ts
      console.log(`🔍 Fetching message with ts = ${ts}`);
      result = await slackClient.conversations.history({
        token: slackToken,
        channel: channelId,
        latest: ts,
        inclusive: true,
        limit: 1,
      });
    } else {
      // Fetch the most recent message
      console.log("🔍 Fetching latest message");
      result = await slackClient.conversations.history({
        token: slackToken,
        channel: channelId,
        limit: 1,
      });
    }

    if (!result.messages || result.messages.length === 0) {
      return res.status(404).send({ error: "Message not found" });
    }

    const message = result.messages[0];
    console.log("✅ Message found:", message);
    res.send({ message, ts: message.ts });
  } catch (err) {
    console.error("❌ Backend Error:", err);
    res.status(500).send({ error: err.data?.error || "Retrieve by ID error" });
  }
});

// 4. Edit last sent/retrieved message
app.post("/edit", async (req, res) => {
  try {
    if (!lastSentTimestamp)
      return res.status(400).send({ error: "No message to edit" });

    const newText = req.body.message || "This message has been edited by /edit";
    const result = await slackClient.chat.update({
      channel: channelId,
      ts: lastSentTimestamp,
      text: newText,
    });

    res.send({ status: "Message edited", text: result.text });
  } catch (error) {
    res.status(500).send({ error: error.data || error.message });
  }
});

// 5. Delete last sent/retrieved message
app.delete("/delete", async (req, res) => {
  try {
    const { ts } = req.body;
    if (!ts)
      return res.status(400).send({ error: "Message ID (ts) is required" });

    const result = await slackClient.chat.delete({
      token: slackToken,
      channel: channelId,
      ts,
    });

    if (!result.ok) {
      return res.status(500).send({ error: "Failed to delete message" });
    }

    res.send({ ts });
  } catch (err) {
    console.error("❌ Delete Error:", err);
    res.status(500).send({ error: err.data?.error || "Delete error" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Slack API backend running on http://localhost:${PORT}`);
});
