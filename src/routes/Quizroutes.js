const express = require("express");
const router = express.Router();

const quizController = require("../controllers/Quizcontroller");
const { authenticate, authorize } = require("../middlewares/auth");

/* =========================================================
   ADMIN — QUIZ
   ========================================================= */

router.post("/", authenticate, authorize("admin"), quizController.createQuiz);

router.get("/batch/:batchId", authenticate, quizController.listQuizzesByBatch);

// NOTE: includeAnswers is now gated INSIDE the controller by role,
// so this route stays open to any authenticated user (students need
// to fetch the quiz to attempt it), but answers only ever go to admins.
router.get("/:id", authenticate, quizController.getQuiz);

router.put("/:id", authenticate, authorize("admin"), quizController.updateQuiz);

router.delete("/:id", authenticate, authorize("admin"), quizController.deleteQuiz);

router.patch("/:id/publish", authenticate, authorize("admin"), quizController.publishQuiz);

/* =========================================================
   QUESTIONS
   ========================================================= */

router.post("/:id/questions", authenticate, authorize("admin"), quizController.addQuestion);
router.put("/questions/:questionId", authenticate, authorize("admin"), quizController.updateQuestion);
router.delete("/questions/:questionId", authenticate, authorize("admin"), quizController.deleteQuestion);

/* =========================================================
   OPTIONS
   ========================================================= */

router.put("/options/:optionId", authenticate, authorize("admin"), quizController.updateOption);
router.delete("/options/:optionId", authenticate, authorize("admin"), quizController.deleteOption);

/* =========================================================
   ADMIN — ATTEMPTS
   ========================================================= */

router.get("/:id/attempts", authenticate, authorize("admin"), quizController.listAttemptsByQuiz);

/* =========================================================
   STUDENT — ATTEMPTS (ownership enforced in controller/service)
   ========================================================= */

router.post("/:id/attempts/start", authenticate, quizController.startAttempt);
router.get("/:id/attempts/mine", authenticate, quizController.listMyAttempts);
router.put("/attempts/:attemptId/questions/:questionId/answer", authenticate, quizController.saveAnswer);
router.post("/attempts/:attemptId/submit", authenticate, quizController.submitAttempt);
router.get("/attempts/:attemptId/result", authenticate, quizController.getAttemptResult);

module.exports = router;