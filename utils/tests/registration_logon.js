it("should log the user on", async () => {
    const dataToPost = {
        email: this.user.email,
        password: this.password,
        _csrf: this.csrfToken,
    };
    const { expect, request } = await get_chai();
    const req = request
        .execute(app)
        .post("/api/auth/register")
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