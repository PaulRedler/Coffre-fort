const router = require('express').Router();
const mayan = require('../services/mayan');
const auth = require('../middlewares/auth');

router.get("/", auth, async (req, res) => {
  const docs = await mayan.searchDocuments(req.query.q || "");
  res.json(docs);
});

router.get("/:id", auth, async (req, res) => {
  const doc = await mayan.getDocument(req.params.id);
  res.json(doc);
});

module.exports = router;
const ai = require('../services/ai');

router.post("/:id/analyze", auth, async (req, res) => {
  const doc = await mayan.getDocument(req.params.id);
  const text = doc.latest_version?.content || ""; // dépend version Mayan

  const summary = await ai.summarize(text);
  res.json(summary);
});
const timeWindow = require('../middlewares/timeWindow');
const auth = require('../middlewares/auth');

router.get("/", auth, timeWindow(), async (req, res) => {
  // code pour récupérer les documents
});
