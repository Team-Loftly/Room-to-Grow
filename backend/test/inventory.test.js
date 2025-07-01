import { expect } from "chai";
import supertest from "supertest";
import app, { sandbox } from "./testApp.js";
import Inventory from "../src/models/Inventory.js";

const request = supertest(app);

describe("Inventory API", function () {
  describe("GET /", () => {
    afterEach(() => {
      sandbox.restore();
    });
    it("should return the user's inventory if found", async () => {
      // mock db interaction to return an inventory
      sandbox.stub(Inventory, 'findOne').returns({
        populate: sandbox.stub().resolves({
          userId: 'fakeUser123',
          coins: 1000,
          decorations: []
        })
      });

      const res = await request.get("/inventory").set('Authorization', 'Bearer 123');
      expect(res.status).to.equal(200);
    });

    it("should fail the user's inventory doesn't exist", async () => {
      // mock db interaction to return nothing 
      sandbox.stub(Inventory, 'findOne').returns({
        populate: sandbox.stub().resolves(null)
      });
      const res = await request.get("/inventory").set('Authorization', 'Bearer 123');
      expect(res.status).to.equal(404);
    });
  });
  describe("CREATE /", () => {
    afterEach(() => {
        sandbox.restore();
    });
    it("should create an inventory with valid parameters", async () => {
        // mock db to return no inventory
        sandbox.stub(Inventory, "findOne")
          .onFirstCall().resolves(null) // check for existing inventory
          .onSecondCall().returns({     // populate after save
            populate: sandbox.stub().resolves({
              userId: "12345",
              coins: 1000,
              decorations: [],
            }),
          });
        sandbox.stub(Inventory.prototype, "save").resolves();

        const res = await request
            .post("/inventory/create")
            .set('Authorization', 'Bearer fake-token')
            .send({
                inventory: [],
                coins: 1000
            });
    
        expect(res.status).to.equal(201);
        expect(res.body).to.include({ userId: "12345", coins: 1000 });

      });
    it("should return a bad request if the inventory already exists", async () => {
        // Stub findOne to simulate existing inventory
        sandbox.stub(Inventory, "findOne").resolves({
          userId: "12345",
          coins: 1000,
          decorations: [],
        });
    
        const res = await request
            .post("/inventory/create")
            .set('Authorization', 'Bearer fake-token')
            .send({
                inventory: [],
                coins: 1000
            });
    
        expect(res.status).to.equal(400);
      });
  });
  describe("UPDATE /", () => {
    afterEach(() => {
        sandbox.restore();
    });
    it ("should update the inventory if found", async () => {
        // Stub findOneAndUpdate to update correctly
        sandbox.stub(Inventory, 'findOneAndUpdate').returns({
            populate: sandbox.stub().resolves({
              userId: '12345',
              coins: 1000,
              decorations: []
            })
          });
      
          const res = await request
              .post("/inventory/update")
              .set('Authorization', 'Bearer fake-token')
              .send({
                  inventory: [],
                  coins: 1000
              });
      
          expect(res.status).to.equal(200);
    });
    it ("should return a not found if the inventory was not found", async () => {
        // Stub findOneAndUpdate to not find the inventory
        sandbox.stub(Inventory, 'findOneAndUpdate').returns({
            populate: sandbox.stub().resolves(null)
          });
      
          const res = await request
              .post("/inventory/update")
              .set('Authorization', 'Bearer fake-token')
              .send({
                  inventory: [],
                  coins: 1000
              });
      
          expect(res.status).to.equal(404);
    });
  });
});
