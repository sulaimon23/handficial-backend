const app = require("../../express-vercel/app");
const request = require("supertest");

describe("Index Endpoint", () => {
    it("GET /", async () => {
        const response = await request(app).get("/");

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            success: true,
            message: "express vercel boiler plate",
            data: null,
        });
    });
});
