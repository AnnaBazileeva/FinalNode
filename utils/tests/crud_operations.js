const chai = require("chai");
const chaiHttp = require("chai-http");
const faker = require("@faker-js/faker").fakerEN_US;
const { expect } = chai;
const app = require("../../app");
const Service = require("../../models/Service");
const { seed_db, testUserPassword } = require("../../utils/seed_db");

chai.use(chaiHttp);

let csrfToken, sessionCookie, csrfCookie;
let test_user;

describe("HTML-based service form tests (CSRF + cookie)", () => {
    before(async () => {
        test_user = await seed_db();

        const res = await chai.request(app).get("/auth/login");
        const cookies = res.headers["set-cookie"];
        csrfCookie = cookies.find(c => c.startsWith("csrfToken"));
        sessionCookie = cookies.find(c => c.startsWith("connect.sid"));

        if (!csrfCookie) throw new Error("CSRF cookie not found");
        if (!sessionCookie) throw new Error("Session cookie not found");

        const csrfTokenMatch = csrfCookie.match(/csrfToken=([^;]+)/);
        if (!csrfTokenMatch) throw new Error("CSRF token not found in cookie");

        csrfToken = match[1];



        await chai.request(app)
            .post("/auth/login")
            .set("Cookie", `${csrfCookie}; ${sessionCookie}`)
            .set("Content-Type", "application/x-www-form-urlencoded")
            .send({
                email: test_user.email,
                password: testUserPassword,
                _csrf: csrfToken,
            });
    });

    it("should GET the service list with 20 entries", async () => {
        const res = await chai.request(app)
            .get("/services")
            .set("Cookie", `${csrfCookie}; ${sessionCookie}`);

        expect(res).to.have.status(200);

        const pageParts = res.text.split("<tr>");
        expect(pageParts.length).to.equal(21);
    });

    it("should ADD a service entry via the form", async () => {
        const serviceData = {
            serviceName: faker.commerce.productName().slice(0, 30),
            company: faker.company.name().slice(0, 30),
            location: faker.location.city().slice(0, 100),
            description: faker.lorem.sentence().slice(0, 500),
        };

        const res = await chai.request(app)
            .post("/services")
            .set("Cookie", `${csrfCookie}; ${sessionCookie}`)
            .set("Content-Type", "application/x-www-form-urlencoded")
            .send({
                _csrf: csrfToken,
                ...serviceData,
            });

        expect(res).to.redirect;

        const services = await Service.find({ createdBy: test_user._id });
        expect(services.length).to.equal(21);
    });
});
