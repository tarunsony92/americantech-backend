"use strict";

const {
  Quiz,
  QuizQuestion,
  QuizOption,
  QuizAttempt,
  QuizAnswer,
  Enrollment,
  Student,
  sequelize,
} = require("../models");

const quizService = {
  /* =========================================================
     INTERNAL ERROR HELPER
     ========================================================= */
  createError(statusCode, message) {
    const error = new Error(message);
    error.statusCode = statusCode;
    error.status = statusCode;
    return error;
  },

  /* =========================================================
     OWNERSHIP GUARDS
     ========================================================= */

  // Confirms the enrollment belongs to the requesting user.
  // Chain: User -> Student (Student.userId) -> Enrollment (Enrollment.studentId)
  // Admins are exempt (they may legitimately act on any student's behalf).
  async assertEnrollmentOwnership(enrollmentId, user) {
    if (!user) {
      throw this.createError(401, "Unauthorized");
    }
    if (user.role === "admin") return;

    const enrollment = await Enrollment.findByPk(enrollmentId, {
      include: [{ model: Student, as: "student" }],
    });

    if (!enrollment) {
      throw this.createError(404, "Enrollment not found");
    }

    if (!enrollment.student || String(enrollment.student.userId) !== String(user.id)) {
      throw this.createError(403, "This enrollment does not belong to you");
    }

    return enrollment;
  },

  // Confirms the attempt belongs (via its enrollment) to the requesting user.
  async assertAttemptOwnership(attemptId, user) {
    if (!user) {
      throw this.createError(401, "Unauthorized");
    }
    if (user.role === "admin") return;

    const attempt = await QuizAttempt.findByPk(attemptId);

    if (!attempt) {
      throw this.createError(404, "Attempt not found");
    }

    await this.assertEnrollmentOwnership(attempt.enrollmentId, user);
  },

  /* =========================================================
     ADMIN / INSTRUCTOR
     ========================================================= */

  async createQuiz(payload) {
    const {
      batchId,
      title,
      description,
      durationMinutes,
      passingScore,
      maxAttempts,
    } = payload;

    if (!batchId) {
      throw this.createError(400, "batchId is required");
    }

    if (!title || !title.trim()) {
      throw this.createError(400, "Quiz title is required");
    }

    const quiz = await Quiz.create({
      batchId,
      title: title.trim(),
      description: description || null,
      durationMinutes:
        durationMinutes !== undefined &&
        durationMinutes !== null &&
        durationMinutes !== ""
          ? Number(durationMinutes)
          : null,
      passingScore:
        passingScore !== undefined &&
        passingScore !== null &&
        passingScore !== ""
          ? Number(passingScore)
          : 0,
      maxAttempts:
        maxAttempts !== undefined &&
        maxAttempts !== null &&
        maxAttempts !== ""
          ? Number(maxAttempts)
          : 1,
      status: "draft",
    });

    return quiz;
  },

  async listQuizzesByBatch(batchId) {
    if (!batchId) {
      throw this.createError(400, "batchId is required");
    }

    const quizzes = await Quiz.findAll({
      where: { batchId },
      order: [["createdAt", "DESC"]],
    });

    return quizzes;
  },

  async getQuizById(quizId, { includeAnswers = false } = {}) {
    const quiz = await Quiz.findByPk(quizId, {
      include: [
        {
          model: QuizQuestion,
          as: "questions",
          separate: true,
          order: [["order", "ASC"]],
          include: [
            {
              model: QuizOption,
              as: "options",
              separate: true,
              order: [["order", "ASC"]],
              attributes: includeAnswers
                ? ["id", "optionText", "isCorrect", "order"]
                : ["id", "optionText", "order"],
            },
          ],
        },
      ],
    });

    if (!quiz) {
      throw this.createError(404, "Quiz not found");
    }

    return quiz;
  },

  async updateQuiz(quizId, payload) {
    const quiz = await Quiz.findByPk(quizId);

    if (!quiz) {
      throw this.createError(404, "Quiz not found");
    }

    const allowedFields = [
      "batchId",
      "title",
      "description",
      "durationMinutes",
      "passingScore",
      "maxAttempts",
      "status",
    ];

    const updateData = {};

    allowedFields.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(payload, field)) {
        updateData[field] = payload[field];
      }
    });

    if (updateData.title !== undefined && typeof updateData.title === "string") {
      updateData.title = updateData.title.trim();
    }

    await quiz.update(updateData);

    return quiz;
  },

  async deleteQuiz(quizId) {
    const quiz = await Quiz.findByPk(quizId);

    if (!quiz) {
      throw this.createError(404, "Quiz not found");
    }

    await quiz.destroy();

    return true;
  },

  async publishQuiz(quizId) {
    const quiz = await Quiz.findByPk(quizId, {
      include: [{ model: QuizQuestion, as: "questions" }],
    });

    if (!quiz) {
      throw this.createError(404, "Quiz not found");
    }

    if (!quiz.questions || quiz.questions.length === 0) {
      throw this.createError(400, "Cannot publish a quiz with no questions");
    }

    await quiz.update({ status: "published" });

    return quiz;
  },

  /* =========================================================
     QUESTIONS
     ========================================================= */

  async addQuestion(quizId, payload) {
    const { questionText, questionType, marks, order, options } = payload;

    if (!questionText || !questionText.trim()) {
      throw this.createError(400, "Question text is required");
    }

    if (!options || !Array.isArray(options)) {
      throw this.createError(400, "Options are required");
    }

    if (options.length < 2) {
      throw this.createError(400, "A question needs at least 2 options");
    }

    if (!options.some((option) => option.isCorrect)) {
      throw this.createError(400, "At least one option must be marked correct");
    }

    return sequelize.transaction(async (transaction) => {
      const quiz = await Quiz.findByPk(quizId, { transaction });

      if (!quiz) {
        throw this.createError(404, "Quiz not found");
      }

      const question = await QuizQuestion.create(
        {
          quizId,
          questionText: questionText.trim(),
          questionType: questionType || "single",
          marks: marks !== undefined ? Number(marks) : 1,
          order: order !== undefined ? Number(order) : 0,
        },
        { transaction }
      );

      const optionRows = options.map((option, index) => ({
        questionId: question.id,
        optionText: option.optionText || "",
        isCorrect: !!option.isCorrect,
        order: option.order !== undefined ? Number(option.order) : index,
      }));

      await QuizOption.bulkCreate(optionRows, { transaction });

      return QuizQuestion.findByPk(question.id, {
        include: [{ model: QuizOption, as: "options" }],
        transaction,
      });
    });
  },

  async updateQuestion(questionId, payload) {
    const question = await QuizQuestion.findByPk(questionId);

    if (!question) {
      throw this.createError(404, "Question not found");
    }

    await question.update(payload);

    return question;
  },

  async deleteQuestion(questionId) {
    const question = await QuizQuestion.findByPk(questionId);

    if (!question) {
      throw this.createError(404, "Question not found");
    }

    await question.destroy();

    return true;
  },

  /* =========================================================
     OPTIONS
     ========================================================= */

  async updateOption(optionId, payload) {
    const option = await QuizOption.findByPk(optionId);

    if (!option) {
      throw this.createError(404, "Option not found");
    }

    await option.update(payload);

    return option;
  },

  async deleteOption(optionId) {
    const option = await QuizOption.findByPk(optionId);

    if (!option) {
      throw this.createError(404, "Option not found");
    }

    await option.destroy();

    return true;
  },

  /* =========================================================
     STUDENT
     ========================================================= */

  async startAttempt(quizId, enrollmentId) {
    const quiz = await Quiz.findByPk(quizId, {
      include: [{ model: QuizQuestion, as: "questions" }],
    });

    if (!quiz) {
      throw this.createError(404, "Quiz not found");
    }

    if (quiz.status !== "published") {
      throw this.createError(400, "Quiz is not available");
    }

    const enrollment = await Enrollment.findByPk(enrollmentId);

    if (!enrollment) {
      throw this.createError(404, "Enrollment not found");
    }

    if (
      enrollment.batchId !== undefined &&
      enrollment.batchId !== null &&
      String(enrollment.batchId) !== String(quiz.batchId)
    ) {
      throw this.createError(403, "You are not enrolled in this batch");
    }

    const existingAttempts = await QuizAttempt.count({
      where: { quizId, enrollmentId },
    });

    const maxAttempts = quiz.maxAttempts || 1;

    if (existingAttempts >= maxAttempts) {
      throw this.createError(400, "Maximum attempts reached for this quiz");
    }

    const inProgress = await QuizAttempt.findOne({
      where: { quizId, enrollmentId, status: "in_progress" },
    });

    if (inProgress) {
      return inProgress;
    }

    const totalMarks = (quiz.questions || []).reduce(
      (sum, question) => sum + Number(question.marks || 0),
      0
    );

    const attempt = await QuizAttempt.create({
      quizId,
      enrollmentId,
      attemptNumber: existingAttempts + 1,
      startedAt: new Date(),
      totalMarks,
      status: "in_progress",
    });

    return attempt;
  },

  /* =========================================================
     TIME-LIMIT GUARD
     ========================================================= */
  async assertAttemptNotExpired(attempt, quiz) {
    if (!quiz.durationMinutes) return; // untimed quiz

    const deadline =
      new Date(attempt.startedAt).getTime() + quiz.durationMinutes * 60000;

    if (attempt.status === "in_progress" && Date.now() > deadline) {
      throw this.createError(400, "Time limit for this attempt has expired");
    }
  },

  /* =========================================================
     SAVE ANSWER
     ========================================================= */
  async saveAnswer(attemptId, questionId, payload) {
    const attempt = await QuizAttempt.findByPk(attemptId);

    if (!attempt) {
      throw this.createError(404, "Attempt not found");
    }

    if (attempt.status !== "in_progress") {
      throw this.createError(400, "Attempt is already submitted");
    }

    const quiz = await Quiz.findByPk(attempt.quizId);
    if (quiz) {
      await this.assertAttemptNotExpired(attempt, quiz);
    }

    const question = await QuizQuestion.findByPk(questionId, {
      include: [{ model: QuizOption, as: "options" }],
    });

    if (!question) {
      throw this.createError(404, "Question not found");
    }

    const { selectedOptionId, selectedOptionIds } = payload;

    const [answer] = await QuizAnswer.findOrCreate({
      where: { attemptId, questionId },
      defaults: { attemptId, questionId },
    });

    await answer.update({
      selectedOptionId: selectedOptionId ?? null,
      selectedOptionIds: selectedOptionIds ?? null,
    });

    return answer;
  },

  /* =========================================================
     SUBMIT ATTEMPT
     ========================================================= */
  async submitAttempt(attemptId) {
    return sequelize.transaction(async (transaction) => {
      // Step 1: lock the attempt row only (no join here)
      const attempt = await QuizAttempt.findByPk(attemptId, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!attempt) {
        throw this.createError(404, "Attempt not found");
      }

      if (attempt.status !== "in_progress") {
        throw this.createError(400, "Attempt is already submitted");
      }

      // Step 2: fetch answers separately (no lock needed on this join)
      const answers = await QuizAnswer.findAll({
        where: { attemptId },
        transaction,
      });

      const quiz = await Quiz.findByPk(attempt.quizId, {
        include: [
          {
            model: QuizQuestion,
            as: "questions",
            include: [{ model: QuizOption, as: "options" }],
          },
        ],
        transaction,
      });

      if (!quiz) {
        throw this.createError(404, "Quiz not found");
      }

      let scoredMarks = 0;

      for (const question of quiz.questions || []) {
        const answer = answers.find((item) => item.questionId === question.id);

        if (!answer) {
          continue;
        }

        const correctOptionIds = question.options
          .filter((option) => option.isCorrect)
          .map((option) => option.id);

        let isCorrect = false;

        if (question.questionType === "single") {
          isCorrect =
            correctOptionIds.length === 1 &&
            Number(answer.selectedOptionId) === Number(correctOptionIds[0]);
        } else {
          const selected = Array.isArray(answer.selectedOptionIds)
            ? answer.selectedOptionIds.map(Number).sort((a, b) => a - b)
            : [];

          const correct = correctOptionIds.map(Number).sort((a, b) => a - b);

          isCorrect =
            selected.length === correct.length &&
            selected.every((id, index) => id === correct[index]);
        }

        const marksAwarded = isCorrect ? Number(question.marks || 0) : 0;

        scoredMarks += marksAwarded;

        await answer.update({ isCorrect, marksAwarded }, { transaction });
      }

      const totalMarks = Number(attempt.totalMarks || 0);

      const percentage =
        totalMarks > 0
          ? Math.round((scoredMarks / totalMarks) * 10000) / 100
          : 0;

      const passingScore = Number(quiz.passingScore || 0);

      const passed = percentage >= passingScore;

      await attempt.update(
        {
          status: "evaluated",
          submittedAt: new Date(),
          scoredMarks,
          percentage,
          passed,
        },
        { transaction }
      );

      return attempt;
    });
  },

  /* =========================================================
     RESULT
     ========================================================= */
  async getAttemptResult(attemptId) {
    const attempt = await QuizAttempt.findByPk(attemptId, {
      include: [
        {
          model: QuizAnswer,
          as: "answers",
          include: [
            {
              model: QuizQuestion,
              as: "question",
              include: [{ model: QuizOption, as: "options" }],
            },
            {
              model: QuizOption,
              as: "selectedOption",
            },
          ],
        },
      ],
    });

    if (!attempt) {
      throw this.createError(404, "Attempt not found");
    }

    return attempt;
  },

  /* =========================================================
     ATTEMPTS
     ========================================================= */
  async listAttemptsByEnrollment(enrollmentId, quizId) {
    return QuizAttempt.findAll({
      where: {
        enrollmentId,
        ...(quizId ? { quizId } : {}),
      },
      order: [["attemptNumber", "ASC"]],
    });
  },

  async listAttemptsByQuiz(quizId) {
    return QuizAttempt.findAll({
      where: { quizId },
      order: [["createdAt", "DESC"]],
    });
  },
};

module.exports = quizService;