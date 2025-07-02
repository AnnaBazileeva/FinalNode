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
    it("should log the user on", async () => {
        const dataToPost = {
            email: this.user.email,
            password: this.password,
            _csrf: this.csrfToken,
        };
        const { expect, request } = await get_chai();
        const req = request
            .execute(app)
            .post("/api/auth/logon")
            .set("Cookie", this.csrfCookie)
            .set("content-type", "application/x-www-form-urlencoded")
            .redirects(0)
            .send(dataToPost);
        const res = await req;
        expect(res).to.have.status(302);
        expect(res.headers.location).to.equal("/");
        const cookies = res.headers["set-cookie"];
        this.sessionCookie = cookies.find((element) =>
            element.startsWith("connect.sid"),
        );
        expect(this.sessionCookie).to.not.be.undefined;
    });

    it("should get the index page", async () => {
        const { expect, request } = await get_chai();
        const req = request
            .execute(app)
            .get("/")
            .set("Cookie", this.csrfCookie)
            .set("Cookie", this.sessionCookie)
            .send();
        const res = await req;
        expect(res).to.have.status(200);
        expect(res).to.have.property("text");
        expect(res.text).to.include(this.user.name);
    });
});
