// src/services/logger.js

import log from "loglevel";
import { firestore } from "../api/firebase";

/* =====================================================
   CONFIG
===================================================== */

const isProd =
  process.env.NODE_ENV === "production";

log.setLevel(isProd ? "warn" : "info");

/* =====================================================
   SAFE SERIALIZER
   (prevents circular JSON crash)
===================================================== */

function safeSerialize(obj) {
  try {
    return JSON.parse(
      JSON.stringify(obj)
    );
  } catch {
    return { message: "Serialization failed" };
  }
}

/* =====================================================
   FIRESTORE WRITE (non-blocking)
===================================================== */

function writeToFirestore(payload) {
  try {
    firestore
      .collection("logs")
      .add(payload)
      .catch((err) => {
        log.warn(
          "Logger Firestore write failed",
          err
        );
      });
  } catch (err) {
    log.warn(
      "Logger unexpected error",
      err
    );
  }
}

/* =====================================================
   GET USER CONTEXT
===================================================== */

function getUserContext() {
  try {
    const authUser =
      window?.firebase?.auth?.()?.currentUser;

    if (!authUser) return null;

    return {
      uid: authUser.uid,
      email: authUser.email,
    };
  } catch {
    return null;
  }
}

/* =====================================================
   CORE LOGGER
===================================================== */

function createLog(level, event, meta = {}) {
  const serializedMeta =
    safeSerialize(meta);

  const payload = {
    level,
    event,
    meta: serializedMeta,
    timestamp: new Date(),
    environment: isProd
      ? "production"
      : "development",
    user: getUserContext(),
  };

  return payload;
}

const logger = {
  info(event, meta = {}) {
    log.info(event, meta);

    if (!isProd) {
      // In dev, avoid spamming Firestore
      return;
    }

    const payload = createLog(
      "info",
      event,
      meta
    );

    writeToFirestore(payload);
  },

  warn(event, meta = {}) {
    log.warn(event, meta);

    const payload = createLog(
      "warn",
      event,
      meta
    );

    writeToFirestore(payload);
  },

  error(event, meta = {}) {
    log.error(event, meta);

    const payload = createLog(
      "error",
      event,
      meta
    );

    writeToFirestore(payload);
  },
};

export default logger;