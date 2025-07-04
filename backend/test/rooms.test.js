import { expect } from "chai";
import supertest from "supertest";
import app, { sandbox } from "./testApp.js";
import Rooms from "../src/models/Rooms.js";

const request = supertest(app);

describe("Rooms API", function () {
  describe("GET /", () => {
    afterEach(() => {
      sandbox.restore();
    });

    it("should return the user's room data if found", async () => {
      const roomData = {
        userId: "fakeUser123",
        coins: 400,
        decorations: [
          {
            decorId: "68660edaf079d0ff8d6cc86d",
            placed: true,
            position: [-10, 0, 10],
            rotation: [0, 3.141592653589793, 0],
          },
          {
            decorId: "68660edaf079d0ff8d6cc86e",
            placed: true,
            position: [-5, 0, -5],
            rotation: [0, 3.141592653589793, 0],
          },
        ],
      };

      const secondPopulateStub = sandbox.stub().resolves(roomData);
      const firstPopulateStub = sandbox
        .stub()
        .returns({ populate: secondPopulateStub });

      sandbox.stub(Rooms, "findOne").returns({ populate: firstPopulateStub });

      const res = await request
        .get("/rooms")
        .set("Authorization", "Bearer valid-token");

      expect(res.status).to.equal(200);
      expect(res.body).to.deep.include({
        userId: "fakeUser123",
        coins: 400,
      });
      expect(res.body.decorations).to.be.an("array").with.length(2);
      expect(res.body.decorations[0]).to.include({
        placed: true,
      });
      expect(res.body.decorations[0].position).to.deep.equal([-10, 0, 10]);
    });

    it("should return 404 if the user's room data is not found", async () => {
      const secondPopulateStub = sandbox.stub().resolves(null);
      const firstPopulateStub = sandbox
        .stub()
        .returns({ populate: secondPopulateStub });

      sandbox.stub(Rooms, "findOne").returns({ populate: firstPopulateStub });

      const res = await request
        .get("/rooms")
        .set("Authorization", "Bearer valid-token");

      expect(res.status).to.equal(404);
    });
  });

  describe("CREATE /", () => {
    afterEach(() => {
      sandbox.restore();
    });

    it("should create a new room with valid data", async () => {
      sandbox
        .stub(Rooms, "findOne")
        .onFirstCall()
        .resolves(null)
        .onSecondCall()
        .returns({
          populate: sandbox.stub().resolves({
            userId: "newUser123",
            coins: 400,
            decorations: [],
          }),
        });

      sandbox.stub(Rooms.prototype, "save").resolves();

      const res = await request
        .post("/rooms/create")
        .set("Authorization", "Bearer new-token")
        .send({
          coins: 400,
          decorations: [],
        });

      expect(res.status).to.equal(201);
      expect(res.body).to.deep.include({
        userId: "newUser123",
        coins: 400,
      });
    });

    it("should return 400 if room already exists", async () => {
      sandbox.stub(Rooms, "findOne").resolves({
        userId: "existingUser",
        coins: 400,
        decorations: [],
      });

      const res = await request
        .post("/rooms/create")
        .set("Authorization", "Bearer existing-token")
        .send({
          coins: 400,
          decorations: [],
        });

      expect(res.status).to.equal(400);
    });
  });

  describe("UPDATE /", () => {
    afterEach(() => {
      sandbox.restore();
    });

    it("should update an existing room", async () => {
      sandbox.stub(Rooms, "findOneAndUpdate").returns({
        populate: sandbox.stub().resolves({
          userId: "updateUser",
          coins: 500,
          decorations: [],
        }),
      });

      const res = await request
        .post("/rooms/update")
        .set("Authorization", "Bearer update-token")
        .send({
          coins: 500,
          decorations: [],
        });

      expect(res.status).to.equal(200);
      expect(res.body).to.deep.include({
        userId: "updateUser",
        coins: 500,
      });
    });

    it("should return 404 if room to update doesn't exist", async () => {
      sandbox.stub(Rooms, "findOneAndUpdate").returns({
        populate: sandbox.stub().resolves(null),
      });

      const res = await request
        .post("/rooms/update")
        .set("Authorization", "Bearer missing-token")
        .send({
          coins: 500,
          decorations: [],
        });

      expect(res.status).to.equal(404);
    });

    // NEW: Tests for decoration updates

    it("should update the position of a decoration", async () => {
      const updatedDecorations = [
        {
          decorId: "68660edaf079d0ff8d6cc86d",
          placed: true,
          position: [0, 1, 2], // changed position
          rotation: [0, 3.141592653589793, 0],
        },
      ];

      sandbox.stub(Rooms, "findOneAndUpdate").returns({
        populate: sandbox.stub().resolves({
          userId: "decorUser",
          coins: 400,
          decorations: updatedDecorations,
        }),
      });

      const res = await request
        .post("/rooms/update")
        .set("Authorization", "Bearer decor-token")
        .send({
          coins: 400,
          decorations: updatedDecorations,
        });

      expect(res.status).to.equal(200);
      expect(res.body.decorations[0].position).to.deep.equal([0, 1, 2]);
    });

    it("should update the rotation of a decoration", async () => {
      const updatedDecorations = [
        {
          decorId: "68660edaf079d0ff8d6cc86d",
          placed: true,
          position: [-10, 0, 10],
          rotation: [1, 0, 0], // changed rotation
        },
      ];

      sandbox.stub(Rooms, "findOneAndUpdate").returns({
        populate: sandbox.stub().resolves({
          userId: "decorUser",
          coins: 400,
          decorations: updatedDecorations,
        }),
      });

      const res = await request
        .post("/rooms/update")
        .set("Authorization", "Bearer decor-token")
        .send({
          coins: 400,
          decorations: updatedDecorations,
        });

      expect(res.status).to.equal(200);
      expect(res.body.decorations[0].rotation).to.deep.equal([1, 0, 0]);
    });

    it("should update the placed boolean of a decoration", async () => {
      const updatedDecorations = [
        {
          decorId: "68660edaf079d0ff8d6cc86d",
          placed: false, // changed placed boolean
          position: [-10, 0, 10],
          rotation: [0, 3.141592653589793, 0],
        },
      ];

      sandbox.stub(Rooms, "findOneAndUpdate").returns({
        populate: sandbox.stub().resolves({
          userId: "decorUser",
          coins: 400,
          decorations: updatedDecorations,
        }),
      });

      const res = await request
        .post("/rooms/update")
        .set("Authorization", "Bearer decor-token")
        .send({
          coins: 400,
          decorations: updatedDecorations,
        });

      expect(res.status).to.equal(200);
      expect(res.body.decorations[0].placed).to.equal(false);
    });
  });
});
