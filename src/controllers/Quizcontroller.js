const asyncHandler = require("../utils/asyncHandler");
const { success, failure } = require("../utils/apiResponse");
const quizService = require("../services/Quizservice");

const quizController = {
  /* =========================================================
     ADMIN / INSTRUCTOR
  ========================================================= */

  createQuiz: asyncHandler(async (req, res) => {
    const quiz = await quizService.createQuiz(req.body);
    return success(res, {
      statusCode: 201,
      message: "Quiz created successfully",
      data: quiz,
    });
  }),

  listQuizzesByBatch: asyncHandler(async (req, res) => {
    const quizzes = await quizService.listQuizzesByBatch(req.params.batchId);
    return success(res, {
      message: "Quizzes fetched successfully",
      data: quizzes,
    });
  }),

  // Get single quiz
  getQuiz: asyncHandler(async (req, res) => {
    // SECURITY FIX: only admins may ever receive isCorrect flags,
    // regardless of what the client passes in the query string.
    const wantsAnswers = req.query.includeAnswers === "true";
    const includeAnswers = wantsAnswers && req.user?.role === "admin";

    const quiz = await quizService.getQuizById(req.params.id, {
      includeAnswers,
    });

    return success(res, {
      message: "Quiz fetched successfully",
      data: quiz,
    });
  }),

  updateQuiz: asyncHandler(async (req, res) => {
    const quiz = await quizService.updateQuiz(req.params.id, req.body);
    return success(res, {
      message: "Quiz updated successfully",
      data: quiz,
    });
  }),

  deleteQuiz: asyncHandler(async (req, res) => {
    await quizService.deleteQuiz(req.params.id);
    return success(res, { message: "Quiz deleted successfully" });
  }),

  publishQuiz: asyncHandler(async (req, res) => {
    const quiz = await quizService.publishQuiz(req.params.id);
    return success(res, {
      message: "Quiz published successfully",
      data: quiz,
    });
  }),

  /* =========================================================
     QUESTIONS
  ========================================================= */

  addQuestion: asyncHandler(async (req, res) => {
    const question = await quizService.addQuestion(req.params.id, req.body);
    return success(res, {
      statusCode: 201,
      message: "Question added successfully",
      data: question,
    });
  }),

  updateQuestion: asyncHandler(async (req, res) => {
    const question = await quizService.updateQuestion(req.params.questionId, req.body);
    return success(res, {
      message: "Question updated successfully",
      data: question,
    });
  }),

  deleteQuestion: asyncHandler(async (req, res) => {
    await quizService.deleteQuestion(req.params.questionId);
    return success(res, { message: "Question deleted successfully" });
  }),

  /* =========================================================
     OPTIONS
  ========================================================= */

  updateOption: asyncHandler(async (req, res) => {
    const option = await quizService.updateOption(req.params.optionId, req.body);
    return success(res, {
      message: "Option updated successfully",
      data: option,
    });
  }),

  deleteOption: asyncHandler(async (req, res) => {
    await quizService.deleteOption(req.params.optionId);
    return success(res, { message: "Option deleted successfully" });
  }),

  /* =========================================================
     ADMIN — ATTEMPTS
  ========================================================= */

  listAttemptsByQuiz: asyncHandler(async (req, res) => {
    const attempts = await quizService.listAttemptsByQuiz(req.params.id);
    return success(res, {
      message: "Attempts fetched successfully",
      data: attempts,
    });
  }),

  /* =========================================================
     STUDENT
  ========================================================= */

  startAttempt: asyncHandler(async (req, res) => {
    const { enrollmentId } = req.body;

    if (!enrollmentId) {
      return failure(res, {
        statusCode: 400,
        message: "enrollmentId is required",
      });
    }

    // Ownership check: the enrollment being used must belong to the caller.
    await quizService.assertEnrollmentOwnership(enrollmentId, req.user);

    const attempt = await quizService.startAttempt(req.params.id, enrollmentId);

    return success(res, {
      statusCode: 201,
      message: "Attempt started successfully",
      data: attempt,
    });
  }),

  saveAnswer: asyncHandler(async (req, res) => {
    // Ownership check: the attempt being written to must belong to the caller.
    await quizService.assertAttemptOwnership(req.params.attemptId, req.user);

    const answer = await quizService.saveAnswer(
      req.params.attemptId,
      req.params.questionId,
      req.body
    );

    return success(res, {
      message: "Answer saved successfully",
      data: answer,
    });
  }),

  submitAttempt: asyncHandler(async (req, res) => {
    await quizService.assertAttemptOwnership(req.params.attemptId, req.user);

    const attempt = await quizService.submitAttempt(req.params.attemptId);

    return success(res, {
      message: "Quiz submitted and evaluated successfully",
      data: attempt,
    });
  }),

  getAttemptResult: asyncHandler(async (req, res) => {
    await quizService.assertAttemptOwnership(req.params.attemptId, req.user);

    const attempt = await quizService.getAttemptResult(req.params.attemptId);

    return success(res, {
      message: "Result fetched successfully",
      data: attempt,
    });
  }),

  listMyAttempts: asyncHandler(async (req, res) => {
    const { enrollmentId } = req.query;

    if (!enrollmentId) {
      return failure(res, {
        statusCode: 400,
        message: "enrollmentId is required",
      });
    }

    // Ownership check: can't read another user's attempts via their enrollmentId.
    await quizService.assertEnrollmentOwnership(enrollmentId, req.user);

    const attempts = await quizService.listAttemptsByEnrollment(
      enrollmentId,
      req.params.id
    );

    return success(res, {
      message: "Attempts fetched successfully",
      data: attempts,
    });
  }),
};

module.exports = quizController;