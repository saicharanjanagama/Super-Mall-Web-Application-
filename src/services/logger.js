// src/services/logger.js

import log from "loglevel";
import { db } from "../api/firebase";
import { collection, addDoc } from "firebase/firestore";

const isProd =
  process.env.NODE_ENV === "production";

log.setLevel(isProd ? "warn" : "info");

function safeSerialize(obj) {
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch {
    return { message: "Serialization failed" };
  }
}

async function writeToFirestore(payload) {
  try {
    await addDoc(
      collection(db, "logs"),
      payload
    );
  } catch (err) {
    log.warn("Logger Firestore write failed", err);
  }
}

function createLog(level, event, meta = {}) {
  return {
    level,
    event,
    meta: safeSerialize(meta),
    timestamp: new Date().toISOString(),
    environment: isProd
      ? "production"
      : "development",
  };
}

const logger = {
  info(event, meta = {}) {
    log.info(event, meta);

    if (!isProd) return;

    writeToFirestore(
      createLog("info", event, meta)
    );
  },

  warn(event, meta = {}) {
    log.warn(event, meta);
    writeToFirestore(
      createLog("warn", event, meta)
    );
  },

  error(event, meta = {}) {
    log.error(event, meta);
    writeToFirestore(
      createLog("error", event, meta)
    );
  },
};

export default logger;