const { GoogleGenAI } = require("@google/genai");
const Invoice = require("../models/Invoice");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// @desc    Parse invoice data from text using AI
// @route   POST /api/ai/parse-text
// @access  Private
const parseInvoiceFromText = async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ message: "Text is required" });
  }

  try {
    const prompt = `
        You are an expert invoice data extraction AI.
        Analyze the following text and extract the relevant information to create an invoice.
        The output MUST be a valid JSON object.

        The JSON object should have the following structure:

        {
        "clientName": "string",
        "email": "string (if available)",
        "address": "string (if available)",
        "items": [
            {
            "name": "string",
            "quantity": "number",
            "unitPrice": "number"
            }
        ]
        }

        Here is the text to parse:
        --- TEXT START ---
        ${text}
        --- TEXT END ---

        Extract the data and provide only the JSON object.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    let responseText = response.text;

    if (typeof responseText !== "string") {
      if (typeof response.text === "function") {
        responseText = response.text();
      } else {
        throw new Error("Could not extract text from AI response.");
      }
    }

    const cleanedJson = responseText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsedData = JSON.parse(cleanedJson);

    res.status(200).json(parsedData);
  } catch (error) {
    console.error("Error parsing invoice with AI:", error);
    res.status(500).json({
      message: "Failed to parse invoice data from text",
      details: error.message,
    });
  }
};

// @desc    Generate reminder email using AI
// @route   POST /api/ai/generate-reminder
// @access  Private
const generateReminderEmail = async (req, res) => {
    const { invoiceId } = req.body;
    if (!invoiceId) {
      return res.status(400).json({ message: "Invoice ID is required" });
    }

    try {
      const invoice = await Invoice.findById(invoiceId);
      if (!invoice) {
        return res.status(404).json({ message: "Invoice not found" });
      }

      const prompt = `
  You are a professional and polite accounting assistant.
  Write a friendly reminder email to a client about an invoice payment.

  Client Name: ${invoice.billTo.clientName}
  Invoice Number: ${invoice.invoiceNumber}
  Amount Due: ${invoice.total.toFixed(2)}
  Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}

  Start the email with "Subject:".
  Keep it concise and professional.
  `;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const reminderText =
        response.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!reminderText) {
        throw new Error("Empty AI response");
      }

      res.status(200).json({ reminderText });

    } catch (error) {
      console.error("Error generating reminder email:", error);
      res.status(500).json({
        message: "Failed to generate reminder email",
        error: error.message,
      });
    }
  };


// @desc    Dashboard summary (AI / stats)
// @route   GET /api/ai/dashboard-summary
// @access  Private
const getDashboardSummary = async (req, res) => {
  try {
    const invoices = await Invoice.find({ user: req.user.id });

    if (invoices.length === 0) {
      return res.status(200).json({
        insights: ["No invoice data available to generate insights."],
      });
    }

    // Process and summarize data
    const totalInvoices = invoices.length;
    const paidInvoices = invoices.filter((inv) => inv.status === "Paid");
    const unpaidInvoices = invoices.filter((inv) => inv.status !== "Paid");
    const totalRevenue = paidInvoices.reduce((acc, inv) => acc + inv.total, 0);
    const totalOutstanding = unpaidInvoices.reduce(
      (acc, inv) => acc + inv.total,
      0
    );

    const dataSummary = `
        - Total number of invoices: ${totalInvoices}
        - Total paid invoices: ${paidInvoices.length}
        - Total unpaid/pending invoices: ${unpaidInvoices.length}
        - Total revenue from paid invoices: ${totalRevenue.toFixed(2)}
        - Total outstanding amount from unpaid/pending invoices: ${totalOutstanding.toFixed(
            2
            )}
        - Recent invoices (last 5): ${invoices
            .slice(0, 5)
            .map(
                (inv) =>
                `Invoice #${inv.invoiceNumber} for ${inv.total.toFixed(
                    2
                )} with status${inv.status}`
            )
            .join(",")}
        `;

    const prompt = `
        You are a friendly and insightful financial analyst for a small business owner.
        Based on the following summary of their invoice data, provide 2-3 concise and actionable insights.

        Each insight should be a short string in a JSON array.
        The insights should be encouraging and helpful.Do not just repeat the data.

        For example:
        - If there is a high outstanding amount, suggest sending reminders.
        - If revenue is high, encourage maintaining momentum.

        Data Summary:
        ${dataSummary}

        Return your response as a valid JSON object with a single key "insights"which is an array of strings.
        Example format:
        {
        "insights": [
            "Your revenue is looking strong this month!.",
            "You have several unpaid invoices—sending reminders may improve cash flow.",
            "consider sending reminders to get paid faster.",
        ]
        }
        `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const responseText = response.text;
    const cleanedJson = responseText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    const parsedData = JSON.parse(cleanedJson);

    res.status(200).json(parsedData);
  } catch (error) {
    console.error("Error dashboard invoice with AI:", error);
    res
      .status(500)
      .json({
        message: "Failed to fetch dashboard summary",
        error: error.message,
      });
  }
};

module.exports = {
  parseInvoiceFromText,
  generateReminderEmail,
  getDashboardSummary,
};
