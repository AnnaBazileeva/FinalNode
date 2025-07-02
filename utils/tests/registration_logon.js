const chai = require("chai");
const chaiHttp = require("chai-http");
const faker = require("@faker-js/faker").fakerEN_US;
const http = require("http");

chai.use(chaiHttp);
const { expect, request } = chai;

let server, address;

before(async () => {
    const connectDB = require("../../db/connect");
    await connectDB();
    const app = require("../../app");
    server = http.createServer(app);
    await new Promise((resolve) => server.listen(0, resolve));
    address = `http://localhost:${server.address().port}`;
});

after(() => {
    server.close();
});

describe("auth: registration and login", () => {
    const email = faker.internet.email();
    const password = faker.internet.password();
    let token;

    it("should register a new user via JSON", async () => {
        const res = await request(address)
            .post("/api/auth/register")
            .send({ name: "Test User", email, password, role: "customer" });

        expect(res).to.have.status(200);
        expect(res.body).to.have.property("token");
    });

    it("should login the user and return a token", async () => {
        const res = await request(address)
            .post("/api/auth/login")
            .send({ email, password, role: "customer" });

        expect(res).to.have.status(200);
        expect(res.body).to.have.property("token");
        token = res.body.token;
    });

    it("should access protected route with token", async () => {
        const res = await request(address)
            .get("/api/services")
            .set("Authorization", `Bearer ${token}`);

        expect(res).to.have.status(200);
    });

    it("should log the user off", async () => {
        const res = await request(address)
            .post("/api/auth/logout")
            .set("Authorization", `Bearer ${token}`)
            .send();

        expect(res).to.have.status(200);
        expect(res.body).to.have.property("message", "User logged out");
    });
});
