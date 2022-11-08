import chai from "chai";
import chaiHttp from "chai-http";
import app from "../index.js";
import HistoryModel from "../model/history-model.js";

// Configure chai
chai.use(chaiHttp);
chai.should();

const validHistory = {
    username: "testABC",
    matchedUsername: "testBCD",
    difficulty: "Easy",
    question: "Two Sum",
    questionId: "636ab1a33e322a76a949775d",
};

const invalidHistory = {
    username: "test1",
    matchedUsername: "test2",
    difficulty: "Easy",
    question: "Two Sum",
};
describe("History ", () => {
    describe("POST /", () => {
        after((done) => {
            HistoryModel.deleteMany({username: validHistory.username}, (err) => {
                done();
            })
        })
        it("should create the history", (done) => {
            const historyToAdd = validHistory;
            chai.request(app)
                .post("/api/history")
                .send(historyToAdd)
                .end((_, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a("object");
                    res.body.should.have.property("message");
                    res.body.should.have
                        .property("message")
                        .eql(
                            `Added in history of ${validHistory.username} and ${validHistory.matchedUsername}`
                        );
                    done();
                });
        });

        it("error for creating invalid history", (done) => {
            const historyToAdd = invalidHistory;
            chai.request(app)
                .post("/api/history")
                .send(historyToAdd)
                .end((_, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a("object");
                    res.body.should.have.property("message");
                    res.body.should.have
                        .property("message")
                        .eql("Incomplete history format!");
                    done();
                });
        });
    });

    describe("GET /", () => {
        it("should retrieve history for the user", (done) => {
            chai.request(app)
                .get("/api/history")
                .query({ username: validHistory.username })
                .end((_, res) => {
                    res.should.have.status(202);
                    res.body.should.have.property("message");
                    res.body.should.have
                        .property("message")
                        .eql(`Found histories for ${validHistory.username}`);
                    res.body.should.have.property("history");
                    done();
                });
        });
    });

    describe("DELETE /", () => {
        it("should delete the records", (done) => {
            chai.request(app)
            .delete("/api/history")
            .query({ username: validHistory.username })
            .end((_, res) => {
                res.should.have.status(200);
                res.body.should.have.property("message");
                res.body.should.have
                    .property("message")
                    .eql(`Deleted history for user ${validHistory.username} succesfully`);
                done();
            });
        })
    })
});
