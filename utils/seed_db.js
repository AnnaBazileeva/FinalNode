const Service = require("../models/Service");
const User = require("../models/User");
const faker = require("@faker-js/faker").fakerEN_US;
const FactoryBot = require("factory-bot");
require("dotenv").config();

const testUserPassword = faker.internet.password();
const factory = FactoryBot.factory;
const factoryAdapter = new FactoryBot.MongooseAdapter();
factory.setAdapter(factoryAdapter);
factory.define("service", Service, {
    company: () => faker.company.name(),
    serviceName: () => faker.commerce.productName(),

});
factory.define("user", User, {
    name: () => faker.person.firstName(),
    email: () => faker.internet.email(),
    password: () => faker.internet.password(),
});

const seed_db = async () => {
    let testUser = null;
    try {
        const mongoURL = process.env.MONGO_URI_TEST;
        await Service.deleteMany({});
        await User.deleteMany({});
        testUser = await factory.create("user", { password: testUserPassword });
        await factory.createMany("service", 20, { createdBy: testUser._id });
    } catch (e) {
        console.log("database error");
        console.log(e.message);
        throw e;
    }
    return testUser;
};

module.exports = { testUserPassword, factory, seed_db };