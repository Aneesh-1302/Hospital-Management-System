const nodemailer = require("nodemailer");
const db = require("../config/db");

const EMAIL_POLL_INTERVAL_MS = Number(process.env.EMAIL_POLL_INTERVAL_MS || 30000);
const EMAIL_BATCH_SIZE = Number(process.env.EMAIL_BATCH_SIZE || 20);

let processorHandle = null;
let isProcessing = false;

const createTransporter = () => {
  if (!process.env.SMTP_HOST || !process.env.SMTP_PORT || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error("SMTP configuration is incomplete");
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: String(process.env.SMTP_SECURE || "false").toLowerCase() === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

const claimPendingEmails = async (limit) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [rows] = await connection.query(
      `SELECT id, recipient, subject, body
       FROM email_queue
       WHERE status = 'PENDING'
       ORDER BY created_at ASC
       LIMIT ?
       FOR UPDATE SKIP LOCKED`,
      [limit]
    );

    if (rows.length === 0) {
      await connection.commit();
      return [];
    }

    const emailIds = rows.map((row) => row.id);
    await connection.query(
      "UPDATE email_queue SET status = 'PROCESSING' WHERE id IN (?)",
      [emailIds]
    );

    await connection.commit();
    return rows;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

const markEmailStatus = async (id, status) => {
  await db.execute(
    "UPDATE email_queue SET status = ? WHERE id = ?",
    [status, id]
  );
};

const processPendingEmails = async () => {
  if (isProcessing) {
    return;
  }

  isProcessing = true;

  try {
    const transporter = createTransporter();
    const pendingEmails = await claimPendingEmails(EMAIL_BATCH_SIZE);

    for (const email of pendingEmails) {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_FROM || process.env.SMTP_USER,
          to: email.recipient,
          subject: email.subject,
          text: email.body
        });

        await markEmailStatus(email.id, "SENT");
      } catch (error) {
        console.error(`Email send failed for queue item ${email.id}:`, error);
        await markEmailStatus(email.id, "FAILED");
      }
    }
  } catch (error) {
    console.error("Email queue processing failed:", error);
  } finally {
    isProcessing = false;
  }
};

const startEmailQueueProcessor = () => {
  if (processorHandle) {
    return processorHandle;
  }

  processorHandle = setInterval(() => {
    processPendingEmails().catch((error) => {
      console.error("Unhandled email queue processor error:", error);
    });
  }, EMAIL_POLL_INTERVAL_MS);

  processorHandle.unref?.();
  processPendingEmails().catch((error) => {
    console.error("Initial email queue processing failed:", error);
  });

  return processorHandle;
};

module.exports = {
  processPendingEmails,
  startEmailQueueProcessor
};
