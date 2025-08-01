import { expect } from "chai";
import supertest from "supertest";
import app, { sandbox } from "./testApp.js";
import Habit from "../src/models/Habit.js";
import mongoose from "mongoose";

const request = supertest(app);

describe("Habits API", function () {
  const MOCK_USER_ID = new mongoose.Types.ObjectId().toString();
  const MOCK_HABIT_ID = new mongoose.Types.ObjectId().toString();

  let habitSaveStub;

  const createMockHabit = (
    id = MOCK_HABIT_ID,
    userId = MOCK_USER_ID,
    overrides = {}
  ) => ({
    _id: id,
    userId: userId,
    title: "Read a book",
    description: "Read for 30 minutes every day",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    priority: 2,
    type: "timed",
    hours: 0,
    minutes: 30,
    checkmarks: null,
    dailyStatuses: [],
    currentStreak: 0,
    lastStreakUpdateDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  });

  const createMongooseMockHabitInstance = (
    id = MOCK_HABIT_ID,
    userId = MOCK_USER_ID,
    overrides = {}
  ) => {
    const instance = {
      _id: new mongoose.Types.ObjectId(id),
      userId: new mongoose.Types.ObjectId(userId),
      title: "Read a book",
      description: "Read for 30 minutes every day",
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      priority: 2,
      type: "timed",
      hours: 0,
      minutes: 30,
      checkmarks: null,
      dailyStatuses: [],
      currentStreak: 0,
      lastStreakUpdateDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides,
      // Mock toObject to return a plain object without mock methods
      toObject: function () {
        const obj = { ...this };
        delete obj.save;
        delete obj.toObject;
        delete obj.populate;
        return obj;
      },
      // Mock populate to return itself for chaining
      populate: sandbox.stub().returnsThis(),
    };
    // Add a stubbed save method directly to this instance
    instance.save = sandbox.stub().callsFake(function () {
      return Promise.resolve(this);
    });
    return instance;
  };

  beforeEach(() => {
    sandbox
      .stub(mongoose.Types.ObjectId, "isValid")
      .callsFake(
        (id) =>
          id === MOCK_HABIT_ID ||
          id === MOCK_USER_ID ||
          mongoose.Types.ObjectId.isValid(id)
      );
    habitSaveStub = sandbox
      .stub(Habit.prototype, "save")
      .callsFake(function () {
        return Promise.resolve(this);
      });
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe("GET /", () => {
    it("should return habits for the user on the specified date", async () => {
      const today = new Date("2025-07-04T12:00:00.000Z");
      const mockHabit = createMockHabit(undefined, MOCK_USER_ID, {
        days: ["Friday"],
        dailyStatuses: [
          {
            date: today,
            status: "incomplete",
            value: 15,
            dayOfWeek: "Friday",
            month: 7,
            year: 2025,
          },
        ],
      });

      sandbox
        .stub(Habit, "find")
        .returns({ lean: sandbox.stub().resolves([mockHabit]) });

      const res = await request
        .get(`/habits?date=${today.toISOString()}`)
        .set("Authorization", "Bearer fake-token");

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("array").and.have.lengthOf(1);
      expect(res.body[0].title).to.equal("Read a book");
      expect(res.body[0].progress.status).to.equal("incomplete");
      expect(res.body[0].progress.value).to.equal(15);
    });

    it("should return habits for the user for today if no date is specified", async () => {
      const originalDate = Date;
      const mockDate = new Date("2025-07-04T12:00:00.000Z"); // Friday
      global.Date = class extends originalDate {
        constructor(dateString) {
          if (dateString) {
            return new originalDate(dateString);
          }
          return mockDate;
        }
      };

      const mockHabit = createMockHabit(undefined, MOCK_USER_ID, {
        days: ["Friday"],
        dailyStatuses: [
          {
            date: mockDate,
            status: "incomplete",
            value: 10,
            dayOfWeek: "Friday",
            month: 7,
            year: 2025,
          },
        ],
      });
      sandbox
        .stub(Habit, "find")
        .returns({ lean: sandbox.stub().resolves([mockHabit]) });

      const res = await request
        .get("/habits")
        .set("Authorization", "Bearer fake-token");

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("array").and.have.lengthOf(1);
      expect(res.body[0].title).to.equal("Read a book");
      expect(res.body[0].progress.status).to.equal("incomplete");
      expect(res.body[0].progress.value).to.equal(10);

      global.Date = originalDate;
    });

    it("should return an empty array if no habits are found for the user on that date", async () => {
      sandbox
        .stub(Habit, "find")
        .returns({ lean: sandbox.stub().resolves([]) });

      const res = await request
        .get("/habits?date=2025-07-05T00:00:00.000Z") // Saturday
        .set("Authorization", "Bearer fake-token");

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("array").and.have.lengthOf(0);
    });

    it("should return 400 for invalid date format", async () => {
      const res = await request
        .get("/habits?date=invalid-date")
        .set("Authorization", "Bearer fake-token");

      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal("Invalid date format provided.");
    });

    it("should handle internal server errors", async () => {
      sandbox
        .stub(Habit, "find")
        .throws(new Error("Database connection error"));

      const res = await request
        .get("/habits")
        .set("Authorization", "Bearer fake-token");

      expect(res.status).to.equal(500);
      expect(res.body.message).to.equal("Error retrieving habits");
    });
  });

  describe("GET /all", () => {
    it("should return all habits for the user", async () => {
      const mockHabits = [
        createMockHabit(undefined, MOCK_USER_ID, {
          title: "Habit 1",
          dailyStatuses: undefined,
        }),
        createMockHabit(undefined, MOCK_USER_ID, {
          title: "Habit 2",
          dailyStatuses: undefined,
        }),
      ];
      sandbox
        .stub(Habit, "find")
        .returns({ lean: sandbox.stub().resolves(mockHabits) });

      const res = await request
        .get("/habits/all")
        .set("Authorization", "Bearer fake-token");

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("array").and.have.lengthOf(2);
      expect(res.body[0].title).to.equal("Habit 1");
      expect(res.body[1].title).to.equal("Habit 2");
      expect(res.body[0]).to.not.have.property("dailyStatuses");
    });

    it("should return an empty array if no habits are found for the user", async () => {
      sandbox
        .stub(Habit, "find")
        .returns({ lean: sandbox.stub().resolves([]) });

      const res = await request
        .get("/habits/all")
        .set("Authorization", "Bearer fake-token");

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("array").and.have.lengthOf(0);
    });

    it("should handle internal server errors", async () => {
      sandbox
        .stub(Habit, "find")
        .throws(new Error("Database connection error"));

      const res = await request
        .get("/habits/all")
        .set("Authorization", "Bearer fake-token");

      expect(res.status).to.equal(500);
      expect(res.body.message).to.equal("Error retrieving habits");
    });
  });

  describe("POST /", () => {
    it("should create a new habit with valid parameters (timed)", async () => {
      const newHabitData = {
        title: "Go for a run",
        description: "Run for 45 minutes",
        days: ["Monday", "Wednesday", "Friday"],
        priority: 1,
        type: "timed",
        hours: 0,
        minutes: 45,
      };

      sandbox.stub(Habit, "findOne").resolves(
        createMockHabit(MOCK_HABIT_ID, MOCK_USER_ID, {
          ...newHabitData,
          dailyStatuses: [],
        })
      );

      const res = await request
        .post("/habits")
        .set("Authorization", "Bearer fake-token")
        .send(newHabitData);

      expect(res.status).to.equal(201);
      expect(res.body.title).to.equal("Go for a run");
      expect(res.body.type).to.equal("timed");
      expect(res.body.hours).to.equal(0);
      expect(res.body.minutes).to.equal(45);
      expect(res.body.progress).to.deep.equal({
        status: "incomplete",
        value: 0,
      });
      expect(res.body.currentStreak).to.equal(0);
      expect(res.body).to.not.have.property("dailyStatuses");
    });

    it("should create a new habit with valid parameters (checkmark)", async () => {
      const newHabitData = {
        title: "Drink water",
        description: "Drink 8 glasses of water",
        days: ["Everyday"],
        priority: 3,
        type: "checkmark",
        checkmarks: 8,
      };

      sandbox.stub(Habit, "findOne").resolves(
        createMockHabit(MOCK_HABIT_ID, MOCK_USER_ID, {
          ...newHabitData,
          hours: null,
          minutes: null,
          dailyStatuses: [],
        })
      );

      const res = await request
        .post("/habits")
        .set("Authorization", "Bearer fake-token")
        .send(newHabitData);

      expect(res.status).to.equal(201);
      expect(res.body.title).to.equal("Drink water");
      expect(res.body.type).to.equal("checkmark");
      expect(res.body.checkmarks).to.equal(8);
      expect(res.body.progress).to.deep.equal({
        status: "incomplete",
        value: 0,
      });
      expect(res.body.currentStreak).to.equal(0);
      expect(res.body).to.not.have.property("dailyStatuses");
    });

    it("should return 400 for missing required fields (title)", async () => {
      const res = await request
        .post("/habits")
        .set("Authorization", "Bearer fake-token")
        .send({
          description: "Test",
          days: ["Monday"],
          priority: 1,
          type: "timed",
          hours: 1,
          minutes: 0,
        });

      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal("Missing required habit fields.");
    });

    it("should return 400 for missing required fields (days)", async () => {
      const res = await request
        .post("/habits")
        .set("Authorization", "Bearer fake-token")
        .send({
          title: "Test",
          description: "Test",
          priority: 1,
          type: "timed",
          hours: 1,
          minutes: 0,
        });

      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal("Missing required habit fields.");
    });

    it("should return 400 for empty days array", async () => {
      const res = await request
        .post("/habits")
        .set("Authorization", "Bearer fake-token")
        .send({
          title: "Test",
          description: "Test",
          days: [],
          priority: 1,
          type: "timed",
          hours: 1,
          minutes: 0,
        });

      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal("Missing required habit fields.");
    });

    it("should return 400 for invalid habit type", async () => {
      const res = await request
        .post("/habits")
        .set("Authorization", "Bearer fake-token")
        .send({
          title: "Test",
          description: "Test",
          days: ["Monday"],
          priority: 1,
          type: "invalid",
          hours: 1,
          minutes: 0,
        });

      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal("Invalid habit type.");
    });

    it("should return 400 for timed habit with 0 hours and 0 minutes", async () => {
      const res = await request
        .post("/habits")
        .set("Authorization", "Bearer fake-token")
        .send({
          title: "Test",
          description: "Test",
          days: ["Monday"],
          priority: 1,
          type: "timed",
          hours: 0,
          minutes: 0,
        });

      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal(
        "Hours and minutes are required for timed habits and can't both be 0."
      );
    });

    it("should return 400 for checkmark habit with checkmarks < 1", async () => {
      const res = await request
        .post("/habits")
        .set("Authorization", "Bearer fake-token")
        .send({
          title: "Test",
          description: "Test",
          days: ["Monday"],
          priority: 1,
          type: "checkmark",
          checkmarks: 0,
        });

      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal(
        "Checkmarks count is required for checkmark habits and can't be less than 1."
      );
    });

    it("should handle internal server errors", async () => {
      habitSaveStub.throws(new Error("Database save error"));

      const res = await request
        .post("/habits")
        .set("Authorization", "Bearer fake-token")
        .send({
          title: "Test",
          description: "Test",
          days: ["Monday"],
          priority: 1,
          type: "timed",
          hours: 1,
          minutes: 0,
        });

      expect(res.status).to.equal(500);
      expect(res.body.message).to.equal("Error creating habit");
    });
  });

  describe("PUT /:id", () => {
    it("should update an existing habit with valid parameters", async () => {
      const existingHabit = createMongooseMockHabitInstance(
        MOCK_HABIT_ID,
        MOCK_USER_ID,
        {
          title: "Old Title",
          type: "timed",
          hours: 1,
          minutes: 0,
        }
      );
      const updatedHabitData = {
        title: "New Title",
        description: "Updated Description",
        days: ["Tuesday", "Thursday"],
        priority: 1,
        type: "timed",
        hours: 0,
        minutes: 45,
      };

      sandbox.stub(Habit, "findOne").resolves(existingHabit);

      const res = await request
        .put(`/habits/${MOCK_HABIT_ID}`)
        .set("Authorization", "Bearer fake-token")
        .send(updatedHabitData);

      expect(res.status).to.equal(200);
      expect(res.body.title).to.equal("New Title");
      expect(res.body.description).to.equal("Updated Description");
      expect(res.body.days).to.deep.equal(["Tuesday", "Thursday"]);
      expect(res.body.hours).to.equal(0);
      expect(res.body.minutes).to.equal(45);
    });

    it("should return 404 if the habit is not found or not authorized", async () => {
      sandbox.stub(Habit, "findOne").resolves(null);

      const res = await request
        .put(`/habits/${MOCK_HABIT_ID}`)
        .set("Authorization", "Bearer fake-token")
        .send({
          title: "New Title",
          days: ["Monday"],
          priority: 1,
          type: "timed",
          hours: 1,
          minutes: 0,
        });

      expect(res.status).to.equal(404);
      expect(res.body.message).to.equal("Habit not found or not authorized.");
    });

    it("should return 400 for invalid habit ID format", async () => {
      mongoose.Types.ObjectId.isValid.restore();
      sandbox.stub(mongoose.Types.ObjectId, "isValid").callsFake(() => false);

      const res = await request
        .put("/habits/invalid-id")
        .set("Authorization", "Bearer fake-token")
        .send({
          title: "New Title",
          days: ["Monday"],
          priority: 1,
          type: "timed",
          hours: 1,
          minutes: 0,
        });

      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal("Invalid habit ID.");
    });

    it("should return 400 for missing required fields (title)", async () => {
      const existingHabit = createMongooseMockHabitInstance(
        MOCK_HABIT_ID,
        MOCK_USER_ID
      );
      sandbox.stub(Habit, "findOne").resolves(existingHabit);

      const res = await request
        .put(`/habits/${MOCK_HABIT_ID}`)
        .set("Authorization", "Bearer fake-token")
        .send({
          description: "Updated",
          days: ["Monday"],
          priority: 1,
          type: "timed",
          hours: 1,
          minutes: 0,
        });

      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal("Missing required habit fields.");
    });

    it("should return 400 for invalid habit type", async () => {
      const existingHabit = createMongooseMockHabitInstance(
        MOCK_HABIT_ID,
        MOCK_USER_ID
      );
      sandbox.stub(Habit, "findOne").resolves(existingHabit);

      const res = await request
        .put(`/habits/${MOCK_HABIT_ID}`)
        .set("Authorization", "Bearer fake-token")
        .send({
          title: "Test",
          days: ["Monday"],
          priority: 1,
          type: "bad-type",
          hours: 1,
          minutes: 0,
        });

      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal("Invalid habit type.");
    });

    it("should return 400 for timed habit with 0 hours and 0 minutes", async () => {
      const existingHabit = createMongooseMockHabitInstance(
        MOCK_HABIT_ID,
        MOCK_USER_ID
      );
      sandbox.stub(Habit, "findOne").resolves(existingHabit);

      const res = await request
        .put(`/habits/${MOCK_HABIT_ID}`)
        .set("Authorization", "Bearer fake-token")
        .send({
          title: "Test",
          days: ["Monday"],
          priority: 1,
          type: "timed",
          hours: 0,
          minutes: 0,
        });

      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal(
        "Hours and minutes are required for timed habits and can't both be 0."
      );
    });

    it("should handle internal server errors", async () => {
      sandbox.stub(Habit, "findOne").throws(new Error("Database find error"));

      const res = await request
        .put(`/habits/${MOCK_HABIT_ID}`)
        .set("Authorization", "Bearer fake-token")
        .send({
          title: "New Title",
          days: ["Monday"],
          priority: 1,
          type: "timed",
          hours: 1,
          minutes: 0,
        });

      expect(res.status).to.equal(500);
      expect(res.body.message).to.equal("Error updating habit");
    });
  });

  describe("DELETE /:id", () => {
    it("should delete an existing habit", async () => {
      sandbox.stub(Habit, "findOneAndDelete").resolves({ _id: MOCK_HABIT_ID });

      const res = await request
        .delete(`/habits/${MOCK_HABIT_ID}`)
        .set("Authorization", "Bearer fake-token");

      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal("Habit deleted successfully.");
      expect(res.body.deletedId).to.equal(MOCK_HABIT_ID);
    });

    it("should return 404 if the habit is not found or not authorized", async () => {
      sandbox.stub(Habit, "findOneAndDelete").resolves(null);

      const res = await request
        .delete(`/habits/${MOCK_HABIT_ID}`)
        .set("Authorization", "Bearer fake-token");

      expect(res.status).to.equal(404);
      expect(res.body.message).to.equal(
        "Habit not found or not authorized to delete."
      );
    });

    it("should return 400 for invalid habit ID format", async () => {
      mongoose.Types.ObjectId.isValid.restore();
      sandbox.stub(mongoose.Types.ObjectId, "isValid").callsFake(() => false);

      const res = await request
        .delete("/habits/invalid-id")
        .set("Authorization", "Bearer fake-token");

      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal("Invalid habit ID format.");
    });

    it("should handle internal server errors", async () => {
      sandbox
        .stub(Habit, "findOneAndDelete")
        .throws(new Error("Database delete error"));

      const res = await request
        .delete(`/habits/${MOCK_HABIT_ID}`)
        .set("Authorization", "Bearer fake-token");

      expect(res.status).to.equal(500);
      expect(res.body.message).to.equal("Error deleting habit.");
    });
  });

  describe("POST /:id/complete", () => {
    it("should mark a habit as complete and update its value (new entry)", async () => {
      const mockHabit = createMongooseMockHabitInstance(
        MOCK_HABIT_ID,
        MOCK_USER_ID,
        {
          dailyStatuses: [],
          type: "timed",
          hours: 0,
          minutes: 30,
        }
      );
      sandbox.stub(Habit, "findOne").resolves(mockHabit);

      const res = await request
        .post(`/habits/${MOCK_HABIT_ID}/complete`)
        .set("Authorization", "Bearer fake-token")
        .send({ value: 10 });

      expect(res.status).to.equal(200);
      expect(res.body.progress.status).to.equal("incomplete");
      expect(res.body.progress.value).to.equal(10);
      expect(mockHabit.dailyStatuses).to.have.lengthOf(1);
      expect(mockHabit.dailyStatuses[0].value).to.equal(10);
      expect(mockHabit.dailyStatuses[0].status).to.equal("incomplete");
    });

    it("should mark a habit as complete and update its value (existing entry)", async () => {
      const today = new Date();
      const mockHabit = createMongooseMockHabitInstance(
        MOCK_HABIT_ID,
        MOCK_USER_ID,
        {
          dailyStatuses: [
            {
              date: today,
              status: "incomplete",
              value: 5,
              dayOfWeek: "Friday",
              month: 7,
              year: 2025,
            },
          ],
          type: "timed",
          hours: 0,
          minutes: 30,
        }
      );
      sandbox.stub(Habit, "findOne").resolves(mockHabit);

      const res = await request
        .post(`/habits/${MOCK_HABIT_ID}/complete`)
        .set("Authorization", "Bearer fake-token")
        .send({ value: 10 });

      expect(res.status).to.equal(200);
      expect(res.body.progress.status).to.equal("incomplete");
      expect(res.body.progress.value).to.equal(15);
      expect(mockHabit.dailyStatuses).to.have.lengthOf(1);
      expect(mockHabit.dailyStatuses[0].value).to.equal(15);
      expect(mockHabit.dailyStatuses[0].status).to.equal("incomplete");
    });

    it("should mark a timed habit as complete when goal is met", async () => {
      const today = new Date();
      const mockHabit = createMongooseMockHabitInstance(
        MOCK_HABIT_ID,
        MOCK_USER_ID,
        {
          dailyStatuses: [
            {
              date: today,
              status: "incomplete",
              value: 25,
              dayOfWeek: "Friday",
              month: 7,
              year: 2025,
            },
          ],
          type: "timed",
          hours: 0,
          minutes: 30,
        }
      );
      sandbox.stub(Habit, "findOne").resolves(mockHabit);

      const res = await request
        .post(`/habits/${MOCK_HABIT_ID}/complete`)
        .set("Authorization", "Bearer fake-token")
        .send({ value: 5 });

      expect(res.status).to.equal(200);
      expect(res.body.progress.status).to.equal("complete");
      expect(res.body.progress.value).to.equal(30);
      expect(mockHabit.dailyStatuses[0].status).to.equal("complete");
    });

    it("should mark a checkmark habit as complete when goal is met", async () => {
      const today = new Date();
      const mockHabit = createMongooseMockHabitInstance(
        MOCK_HABIT_ID,
        MOCK_USER_ID,
        {
          dailyStatuses: [
            {
              date: today,
              status: "incomplete",
              value: 2,
              dayOfWeek: "Friday",
              month: 7,
              year: 2025,
            },
          ],
          type: "checkmark",
          checkmarks: 3,
          hours: null,
          minutes: null,
        }
      );
      sandbox.stub(Habit, "findOne").resolves(mockHabit);

      const res = await request
        .post(`/habits/${MOCK_HABIT_ID}/complete`)
        .set("Authorization", "Bearer fake-token")
        .send({ value: 1 });

      expect(res.status).to.equal(200);
      expect(res.body.progress.status).to.equal("complete");
      expect(res.body.progress.value).to.equal(3);
      expect(mockHabit.dailyStatuses[0].status).to.equal("complete");
    });

    it("should return 404 if the habit is not found or not authorized", async () => {
      sandbox.stub(Habit, "findOne").resolves(null);

      const res = await request
        .post(`/habits/${MOCK_HABIT_ID}/complete`)
        .set("Authorization", "Bearer fake-token")
        .send({ value: 10 });

      expect(res.status).to.equal(404);
      expect(res.body.message).to.equal("Habit not found or not authorized.");
    });

    it("should return 400 for invalid habit ID format", async () => {
      mongoose.Types.ObjectId.isValid.restore();
      sandbox.stub(mongoose.Types.ObjectId, "isValid").callsFake(() => false);

      const res = await request
        .post("/habits/invalid-id/complete")
        .set("Authorization", "Bearer fake-token")
        .send({ value: 10 });

      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal("Invalid habit ID.");
    });

    it("should return 400 if value is not a number", async () => {
      const mockHabit = createMongooseMockHabitInstance(
        MOCK_HABIT_ID,
        MOCK_USER_ID
      );
      sandbox.stub(Habit, "findOne").resolves(mockHabit);

      const res = await request
        .post(`/habits/${MOCK_HABIT_ID}/complete`)
        .set("Authorization", "Bearer fake-token")
        .send({ value: "not-a-number" });

      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal("Completion value must be a number.");
    });

    it("should handle internal server errors", async () => {
      sandbox.stub(Habit, "findOne").throws(new Error("Database find error"));

      const res = await request
        .post(`/habits/${MOCK_HABIT_ID}/complete`)
        .set("Authorization", "Bearer fake-token")
        .send({ value: 10 });

      expect(res.status).to.equal(500);
      expect(res.body.message).to.equal("Error completing habit");
    });
  });

  describe("POST /:id/skip", () => {
    it("should mark a habit as skipped (new entry)", async () => {
      const mockHabit = createMongooseMockHabitInstance(
        MOCK_HABIT_ID,
        MOCK_USER_ID,
        {
          dailyStatuses: [],
        }
      );
      sandbox.stub(Habit, "findOne").resolves(mockHabit);

      const res = await request
        .post(`/habits/${MOCK_HABIT_ID}/skip`)
        .set("Authorization", "Bearer fake-token");

      expect(res.status).to.equal(200);
      expect(res.body.progress.status).to.equal("skipped");
      expect(res.body.progress.value).to.equal(0);
      expect(mockHabit.dailyStatuses).to.have.lengthOf(1);
      expect(mockHabit.dailyStatuses[0].status).to.equal("skipped");
      expect(mockHabit.dailyStatuses[0].value).to.equal(0);
    });

    it("should mark a habit as skipped (existing entry)", async () => {
      const today = new Date();
      const mockHabit = createMongooseMockHabitInstance(
        MOCK_HABIT_ID,
        MOCK_USER_ID,
        {
          dailyStatuses: [
            {
              date: today,
              status: "incomplete",
              value: 5,
              dayOfWeek: "Friday",
              month: 7,
              year: 2025,
            },
          ],
        }
      );
      sandbox.stub(Habit, "findOne").resolves(mockHabit);

      const res = await request
        .post(`/habits/${MOCK_HABIT_ID}/skip`)
        .set("Authorization", "Bearer fake-token");

      expect(res.status).to.equal(200);
      expect(res.body.progress.status).to.equal("skipped");
      expect(res.body.progress.value).to.equal(5);
      expect(mockHabit.dailyStatuses).to.have.lengthOf(1);
      expect(mockHabit.dailyStatuses[0].status).to.equal("skipped");
      expect(mockHabit.dailyStatuses[0].value).to.equal(5);
    });

    it("should return 404 if the habit is not found or not authorized", async () => {
      sandbox.stub(Habit, "findOne").resolves(null);

      const res = await request
        .post(`/habits/${MOCK_HABIT_ID}/skip`)
        .set("Authorization", "Bearer fake-token");

      expect(res.status).to.equal(404);
      expect(res.body.message).to.equal("Habit not found or not authorized.");
    });

    it("should return 400 for invalid habit ID format", async () => {
      mongoose.Types.ObjectId.isValid.restore();
      sandbox.stub(mongoose.Types.ObjectId, "isValid").callsFake(() => false);

      const res = await request
        .post("/habits/invalid-id/skip")
        .set("Authorization", "Bearer fake-token");

      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal("Invalid habit ID.");
    });

    it("should handle internal server errors", async () => {
      sandbox.stub(Habit, "findOne").throws(new Error("Database find error"));

      const res = await request
        .post(`/habits/${MOCK_HABIT_ID}/skip`)
        .set("Authorization", "Bearer fake-token");

      expect(res.status).to.equal(500);
      expect(res.body.message).to.equal("Error skipping habit");
    });
  });

  describe("POST /:id/fail", () => {
    it("should mark a habit as failed (new entry)", async () => {
      const mockHabit = createMongooseMockHabitInstance(
        MOCK_HABIT_ID,
        MOCK_USER_ID,
        {
          dailyStatuses: [],
        }
      );
      sandbox.stub(Habit, "findOne").resolves(mockHabit);

      const res = await request
        .post(`/habits/${MOCK_HABIT_ID}/fail`)
        .set("Authorization", "Bearer fake-token");

      expect(res.status).to.equal(200);
      expect(res.body.progress.status).to.equal("failed");
      expect(res.body.progress.value).to.equal(0);
      expect(mockHabit.dailyStatuses).to.have.lengthOf(1);
      expect(mockHabit.dailyStatuses[0].status).to.equal("failed");
      expect(mockHabit.dailyStatuses[0].value).to.equal(0);
    });

    it("should mark a habit as failed (existing entry)", async () => {
      const today = new Date();
      const mockHabit = createMongooseMockHabitInstance(
        MOCK_HABIT_ID,
        MOCK_USER_ID,
        {
          dailyStatuses: [
            {
              date: today,
              status: "incomplete",
              value: 5,
              dayOfWeek: "Friday",
              month: 7,
              year: 2025,
            },
          ],
        }
      );
      sandbox.stub(Habit, "findOne").resolves(mockHabit);

      const res = await request
        .post(`/habits/${MOCK_HABIT_ID}/fail`)
        .set("Authorization", "Bearer fake-token");

      expect(res.status).to.equal(200);
      expect(res.body.progress.status).to.equal("failed");
      expect(res.body.progress.value).to.equal(5);
      expect(mockHabit.dailyStatuses).to.have.lengthOf(1);
      expect(mockHabit.dailyStatuses[0].status).to.equal("failed");
      expect(mockHabit.dailyStatuses[0].value).to.equal(5);
    });

    it("should return 404 if the habit is not found or not authorized", async () => {
      sandbox.stub(Habit, "findOne").resolves(null);

      const res = await request
        .post(`/habits/${MOCK_HABIT_ID}/fail`)
        .set("Authorization", "Bearer fake-token");

      expect(res.status).to.equal(404);
      expect(res.body.message).to.equal("Habit not found or not authorized.");
    });

    it("should return 400 for invalid habit ID format", async () => {
      mongoose.Types.ObjectId.isValid.restore();
      sandbox.stub(mongoose.Types.ObjectId, "isValid").callsFake(() => false);

      const res = await request
        .post("/habits/invalid-id/fail")
        .set("Authorization", "Bearer fake-token");

      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal("Invalid habit ID.");
    });

    it("should handle internal server errors", async () => {
      sandbox.stub(Habit, "findOne").throws(new Error("Database find error"));

      const res = await request
        .post(`/habits/${MOCK_HABIT_ID}/fail`)
        .set("Authorization", "Bearer fake-token");

      expect(res.status).to.equal(500);
      expect(res.body.message).to.equal("Error failing habit");
    });
  });

  describe("GET /:id/stats", () => {
    it("should return statistics for a given habit", async () => {
      const today = new Date("2025-07-04T12:00:00.000Z"); // Friday
      const yesterday = new Date("2025-07-03T12:00:00.000Z"); // Thursday
      const twoDaysAgo = new Date("2025-07-02T12:00:00.000Z"); // Wednesday

      const mockHabit = createMongooseMockHabitInstance(
        MOCK_HABIT_ID,
        MOCK_USER_ID,
        {
          title: "Daily Coding",
          currentStreak: 5,
          type: "timed",
          dailyStatuses: [
            {
              date: today,
              status: "complete",
              value: 60,
              dayOfWeek: "Friday",
              month: 7,
              year: 2025,
            },
            {
              date: yesterday,
              status: "failed",
              value: 0,
              dayOfWeek: "Thursday",
              month: 7,
              year: 2025,
            },
            {
              date: twoDaysAgo,
              status: "skipped",
              value: 0,
              dayOfWeek: "Wednesday",
              month: 7,
              year: 2025,
            },
            {
              date: new Date("2025-06-29T12:00:00.000Z"), // Last Sunday
              status: "complete",
              value: 90,
              dayOfWeek: "Sunday",
              month: 6,
              year: 2025,
            },
            {
              date: new Date("2025-06-30T12:00:00.000Z"), // Monday
              status: "complete",
              value: 120,
              dayOfWeek: "Monday",
              month: 6,
              year: 2025,
            },
            {
              date: new Date("2025-07-01T12:00:00.000Z"), // Tuesday
              status: "complete",
              value: 30,
              dayOfWeek: "Tuesday",
              month: 7,
              year: 2025,
            },
          ],
        }
      );

      sandbox
        .stub(Habit, "findOne")
        .returns({ select: sandbox.stub().resolves(mockHabit) });

      const res = await request
        .get(`/habits/${MOCK_HABIT_ID}/stats`)
        .set("Authorization", "Bearer fake-token");

      expect(res.status).to.equal(200);
      expect(res.body.title).to.equal("Daily Coding");
      expect(res.body.currentStreak).to.equal(5);
      expect(res.body.completedDays).to.equal(4);
      expect(res.body.failedDays).to.equal(1); // Yesterday
      expect(res.body.skippedDays).to.equal(1); // Two days ago
      expect(res.body.type).to.equal("timed");
      expect(res.body.totalValue).to.equal(60 + 0 + 0 + 90 + 120 + 30); // Sum of all values
      expect(res.body.totalValuePerDayCurrentWeek)
        .to.be.an("array")
        .and.have.lengthOf(7);
      // Verify values for current week (Sunday to Saturday)
      expect(res.body.totalValuePerDayCurrentWeek[0]).to.equal(90); // Sunday (2025-06-29)
      expect(res.body.totalValuePerDayCurrentWeek[1]).to.equal(120); // Monday (2025-06-30)
      expect(res.body.totalValuePerDayCurrentWeek[2]).to.equal(30); // Tuesday (2025-07-01)
      expect(res.body.totalValuePerDayCurrentWeek[3]).to.equal(0); // Wednesday (2025-07-02)
      expect(res.body.totalValuePerDayCurrentWeek[4]).to.equal(0); // Thursday (2025-07-03)
      expect(res.body.totalValuePerDayCurrentWeek[5]).to.equal(60); // Friday (2025-07-04)
      expect(res.body.totalValuePerDayCurrentWeek[6]).to.equal(0); // Saturday (not present)
      
      // Test date arrays
      expect(res.body.completedDates).to.be.an("array").and.have.lengthOf(4);
      expect(res.body.failedDates).to.be.an("array").and.have.lengthOf(1);
      expect(res.body.skippedDates).to.be.an("array").and.have.lengthOf(1);
    });

    it("should return 404 if the habit is not found or not authorized", async () => {
      sandbox
        .stub(Habit, "findOne")
        .returns({ select: sandbox.stub().resolves(null) });

      const res = await request
        .get(`/habits/${MOCK_HABIT_ID}/stats`)
        .set("Authorization", "Bearer fake-token");

      expect(res.status).to.equal(404);
      expect(res.body.message).to.equal("Habit not found or not authorized.");
    });

    it("should return 400 for invalid habit ID format", async () => {
      mongoose.Types.ObjectId.isValid.restore();
      sandbox.stub(mongoose.Types.ObjectId, "isValid").callsFake(() => false);

      const res = await request
        .get("/habits/invalid-id/stats")
        .set("Authorization", "Bearer fake-token");

      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal("Invalid habit ID.");
    });

    it("should handle internal server errors", async () => {
      sandbox.stub(Habit, "findOne").throws(new Error("Database find error"));

      const res = await request
        .get(`/habits/${MOCK_HABIT_ID}/stats`)
        .set("Authorization", "Bearer fake-token");

      expect(res.status).to.equal(500);
      expect(res.body.message).to.equal("Error retrieving habit statistics");
    });
  });
});
