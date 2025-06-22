import { sendMail } from "../services/sendMail.service.js";
import { Contact } from "../model/contactmessage.model.js";
import {ApiRespose} from "../services/ApiResponse.js";
import { ApiError } from "../services/ApiError.js";

const createContact = async (req, res, next) => {
  const { name, email, subject, message } = req.body;
  console.log(req.body)
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }
  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof subject !== "string" ||
    typeof message !== "string"
  ) {
    return res.status(400).json({ error: "Invalid input types" });
  }
  // console.log("Contact form submission:", req.body);

  try {
    // 1 Save to DB
    const contact = await Contact.create(req.body);
    console.log("Contact saved:", contact._id);

    // 2  Notify admins
    const adminList = process.env.ADMIN_EMAILS;
    const tpl = `
      <p><strong>Name:</strong> ${contact.name}</p>
      <p><strong>Email:</strong> ${contact.email}</p>
      <p><strong>Subject:</strong> ${contact.subject}</p>
      <p style="white-space:pre-wrap;"><strong>Message:</strong><br>${
        contact.message
      }</p>
      <p>🕐 ${new Date(contact.createdAt).toLocaleString("en-IN")}</p>
    `;
    // console.log("contact_name:", contact.name);
    // console.log("contact_email:", contact.email);
    // console.log("contact_subject:", contact.subject);
    // console.log("contact_message:", contact.message);
    // console.log("createdAt:", contact.createdAt);

    console.log("Admin notification template:", tpl);
    console.log("Admin email list:", adminList);

    const sendingMail = await sendMail({
      from: contact.email, // Use a verified sender email
      to: adminList,
      subject: `📩 New portfolio enquiry – ${contact.subject}`,
      html: tpl,
    });
    console.log("Mail sent successfully", sendingMail);

    res.status(201).json({ ok: true });
  } catch (err) {
    next(err);
  }
};

const getAllMessages = async (req, res) => {
  try {
    /* ───── 1. Pagination helpers ───── */
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = Math.max(parseInt(req.query.limit || "20", 10), 1);
    const skip = (page - 1) * limit;

    /* ───── 2. Fetch messages ───── */
    const [messages, total] = await Promise.all([
      Contact.find()
        .sort({ createdAt: -1 }) // newest first
        .skip(skip)
        .limit(limit)
        .lean(),
      Contact.countDocuments(),
    ]);

    /* ───── 3. Return response ───── */
    return res.status(200).json(
      new ApiRespose(
        200,
        {
          messages,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
          },
        },
        "Messages fetched successfully."
      )
    );
  } catch (err) {
    console.error("getAllMessages error:", err);
    return res
      .status(500)
      .json(
        new ApiError(500, "Internal Server Error", "Error fetching messages.")
      );
  }
};

const markMessageRead = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!id?.match(/^[0-9a-fA-F]{24}$/)) {
      return res
        .status(400)
        .json(new ApiError(400, "Invalid message ID format."));
    }

    const updated = await Contact.findByIdAndUpdate(
      id,
      { $set: { isRead: true } },
      { new: true, runValidators: true }
    ).lean();

    if (!updated) {
      return res.status(404).json(new ApiError(404, "Message not found."));
    }

    return res
      .status(200)
      .json(
        new ApiRespose(
          200,
          updated,
          `Message from ${updated.name} marked as read.`
        )
      );
  } catch (err) {
    console.error("markMessageRead error:", err);
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          "Internal Server Error",
          "Error marking message as read."
        )
      );
  }
};

const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format
    if (!id?.match(/^[0-9a-fA-F]{24}$/)) {
      return res
        .status(400)
        .json(new ApiError(400, "Invalid message ID format."));
    }

    const deleted = await Contact.findByIdAndDelete(id).lean();

    if (!deleted) {
      return res.status(404).json(new ApiError(404, "Message not found."));
    }

    return res
      .status(200)
      .json(
        new ApiRespose(
          200,
          deleted,
          `Message from ${deleted.name} deleted successfully.`
        )
      );
  } catch (err) {
    console.error("deleteMessage error:", err);
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          "Internal Server Error",
          "An error occurred while deleting the message."
        )
      );
  }
};

const getUnreadMessageCount=async(req, res) => {
  try{
    const unreadCount = await Contact.countDocuments({ isRead: false });

    return res.status(200).json(
      new ApiRespose(200, { unreadCount }, "Unread message count fetched successfully.")
    );

  }catch(error){
    console.error("getUnreadMessageCount error:", error);
    return res
      .status(500)
      .json(
        new ApiError(500, "Internal Server Error", "Error fetching unread count.")
      );
  }
}

export { getAllMessages, markMessageRead, deleteMessage, createContact, getUnreadMessageCount };
