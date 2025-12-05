const fetch = require("node-fetch");

const MAYAN_URL = "http://mayan:8000";
const MAYAN_TOKEN = "TON_API_KEY_ICI";

async function getDocumentsFromMayan() {
  const res = await fetch(`${MAYAN_URL}/api/documents/`, {
    headers: { Authorization: `Token ${MAYAN_TOKEN}` }
  });
  return await res.json();
}

async function getOCRFromMayan(id) {
  const res = await fetch(
    `${MAYAN_URL}/api/documents/${id}/versions/1/pages/1/ocr/`,
    {
      headers: { Authorization: `Token ${MAYAN_TOKEN}` }
    }
  );
  return await res.json();
}

module.exports = { getDocumentsFromMayan, getOCRFromMayan };
