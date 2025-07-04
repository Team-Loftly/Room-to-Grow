import { expect } from "chai";
import supertest from "supertest";
import app, { sandbox } from "./testApp.js";
import Rooms from "../src/models/Rooms.js";

const request = supertest(app);

describe("Inventory API", function () {
  describe("GET /", () => {
    afterEach(() => {
      sandbox.restore();
    });
    it("should return the user's inventory if found", async () => {
      const roomData = {
        userId: "fakeUser123",
        coins: 1000,
        decorations: [],
      };

      // Create a stub chain for .populate().populate()
      const secondPopulateStub = sandbox.stub().resolves(roomData);
      const firstPopulateStub = sandbox
        .stub()
        .returns({ populate: secondPopulateStub });

      sandbox.stub(Rooms, "findOne").returns({ populate: firstPopulateStub });

      const res = await request
        .get("/rooms")
        .set("Authorization", "Bearer 123");
      expect(res.status).to.equal(200);
      expect(res.body).to.include({ userId: "fakeUser123", coins: 1000 });
    });

    it("should fail if the user's inventory doesn't exist", async () => {
      const secondPopulateStub = sandbox.stub().resolves(null);
      const firstPopulateStub = sandbox
        .stub()
        .returns({ populate: secondPopulateStub });

      sandbox.stub(Rooms, "findOne").returns({ populate: firstPopulateStub });

      const res = await request
        .get("/rooms")
        .set("Authorization", "Bearer 123");
      expect(res.status).to.equal(404);
    });
  });
  describe("CREATE /", () => {
    afterEach(() => {
      sandbox.restore();
    });
    it("should create an inventory with valid parameters", async () => {
      // mock db to return no inventory
      sandbox
        .stub(Rooms, "findOne")
        .onFirstCall()
        .resolves(null) // check for existing inventory
        .onSecondCall()
        .returns({
          // populate after save
          populate: sandbox.stub().resolves({
            userId: "12345",
            coins: 1000,
            decorations: [],
          }),
        });
      sandbox.stub(Rooms.prototype, "save").resolves();

      const res = await request
        .post("/rooms/create")
        .set("Authorization", "Bearer fake-token")
        .send({
          decorations: [],
          coins: 1000,
        });

      expect(res.status).to.equal(201);
      expect(res.body).to.include({ userId: "12345", coins: 1000 });
    });
    it("should return a bad request if the inventory already exists", async () => {
      // Stub findOne to simulate existing inventory
      sandbox.stub(Rooms, "findOne").resolves({
        userId: "12345",
        coins: 1000,
        decorations: [],
      });

      const res = await request
        .post("/rooms/create")
        .set("Authorization", "Bearer fake-token")
        .send({
          decorations: [],
          coins: 1000,
        });

      expect(res.status).to.equal(400);
    });
  });
  describe("UPDATE /", () => {
    afterEach(() => {
      sandbox.restore();
    });
    it("should update the inventory if found", async () => {
      // Stub findOneAndUpdate to update correctly
      sandbox.stub(Rooms, "findOneAndUpdate").returns({
        populate: sandbox.stub().resolves({
          userId: "12345",
          coins: 1000,
          decorations: [],
        }),
      });

      const res = await request
        .post("/rooms/update")
        .set("Authorization", "Bearer fake-token")
        .send({
          decorations: [],
          coins: 1000,
        });

      expect(res.status).to.equal(200);
    });
    it("should return a not found if the inventory was not found", async () => {
      // Stub findOneAndUpdate to not find the inventory
      sandbox.stub(Rooms, "findOneAndUpdate").returns({
        populate: sandbox.stub().resolves(null),
      });

      const res = await request
        .post("/rooms/update")
        .set("Authorization", "Bearer fake-token")
        .send({
          decorations: [],
          coins: 1000,
        });

      expect(res.status).to.equal(404);
    });
  });
});
