"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    /*
    ============================================================
    1. CREATE QUIZZES TABLE
    ============================================================
    */

    await queryInterface.createTable("Quizzes", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      batchId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Batches",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      durationMinutes: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },

      passingScore: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      maxAttempts: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },

      status: {
        type: Sequelize.ENUM(
          "draft",
          "published",
          "closed"
        ),
        allowNull: false,
        defaultValue: "draft",
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP"
        ),
      },

      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP"
        ),
      },
    });

    /*
    ============================================================
    2. CREATE QUIZ QUESTIONS
    ============================================================
    */

    await queryInterface.createTable(
      "QuizQuestions",
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },

        quizId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "Quizzes",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },

        questionText: {
          type: Sequelize.TEXT,
          allowNull: false,
        },

        questionType: {
          type: Sequelize.ENUM(
            "single",
            "multiple"
          ),
          allowNull: false,
          defaultValue: "single",
        },

        marks: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },

        order: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },

        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal(
            "CURRENT_TIMESTAMP"
          ),
        },

        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal(
            "CURRENT_TIMESTAMP"
          ),
        },
      }
    );

    /*
    ============================================================
    3. CREATE QUIZ OPTIONS
    ============================================================
    */

    await queryInterface.createTable(
      "QuizOptions",
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },

        questionId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "QuizQuestions",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },

        optionText: {
          type: Sequelize.STRING,
          allowNull: false,
        },

        isCorrect: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },

        order: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },

        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal(
            "CURRENT_TIMESTAMP"
          ),
        },

        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal(
            "CURRENT_TIMESTAMP"
          ),
        },
      }
    );

    /*
    ============================================================
    4. CREATE QUIZ ATTEMPTS
    ============================================================
    */

    await queryInterface.createTable(
      "QuizAttempts",
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },

        quizId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "Quizzes",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },

        enrollmentId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "Enrollments",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },

        attemptNumber: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },

        startedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal(
            "CURRENT_TIMESTAMP"
          ),
        },

        submittedAt: {
          type: Sequelize.DATE,
          allowNull: true,
        },

        totalMarks: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },

        scoredMarks: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },

        percentage: {
          type: Sequelize.FLOAT,
          allowNull: false,
          defaultValue: 0,
        },

        status: {
          type: Sequelize.ENUM(
            "in_progress",
            "submitted",
            "evaluated"
          ),
          allowNull: false,
          defaultValue: "in_progress",
        },

        passed: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },

        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal(
            "CURRENT_TIMESTAMP"
          ),
        },

        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal(
            "CURRENT_TIMESTAMP"
          ),
        },
      }
    );

    /*
    ============================================================
    5. CREATE QUIZ ANSWERS
    ============================================================
    */

    await queryInterface.createTable(
      "QuizAnswers",
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },

        attemptId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "QuizAttempts",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },

        questionId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "QuizQuestions",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },

        selectedOptionId: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: "QuizOptions",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
        },

        selectedOptionIds: {
          type: Sequelize.JSON,
          allowNull: true,
        },

        isCorrect: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },

        marksAwarded: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },

        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal(
            "CURRENT_TIMESTAMP"
          ),
        },

        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal(
            "CURRENT_TIMESTAMP"
          ),
        },
      }
    );
  },

  async down(queryInterface) {
    /*
    Reverse order because of foreign keys.
    */

    await queryInterface.dropTable(
      "QuizAnswers"
    );

    await queryInterface.dropTable(
      "QuizAttempts"
    );

    await queryInterface.dropTable(
      "QuizOptions"
    );

    await queryInterface.dropTable(
      "QuizQuestions"
    );

    await queryInterface.dropTable(
      "Quizzes"
    );

    /*
    PostgreSQL ENUM cleanup
    */

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_Quizzes_status";'
    );

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_QuizQuestions_questionType";'
    );

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_QuizAttempts_status";'
    );
  },
};