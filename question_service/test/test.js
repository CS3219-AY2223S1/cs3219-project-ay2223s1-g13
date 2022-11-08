import chai from "chai";
import chaiHttp from "chai-http";
import app from "../index.js";
import QuestionModel from "../model/question-model.js";

// Configure chai
chai.use(chaiHttp);
chai.should();

const validQuestions = [
    {
        title: "Problem Test Valid2",
        body: "This is only a problem to test",
        difficulty: "Easy",
    },
    {
        title: "Test Another Valid3",
        body: "This is only a problem to test",
        difficulty: "Easy",
    },
];

const invalidQuestion = {
    title: "Problem Test Invalid",
    difficulty: "Dummy",
};

describe("Question", () => {
    let id = "";
    describe("POST /", () => {
        afterEach((done) => {
            QuestionModel.deleteOne({ _id: id }, (err) => {
                done();
            });
        });
        it("should create the task", (done) => {
            const questionToAdd = validQuestions[0];
            chai.request(app)
                .post("/api/question")
                .send(questionToAdd)
                .end((_, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a("object");
                    res.body.should.have.property("message");
                    res.body.should.have
                        .property("message")
                        .eql(
                            `Created the question ${questionToAdd.title} succesfully!`
                        );
                    id = res.body.id;
                    done();
                });
        });

        it("error for creating invalid task", (done) => {
            const questionToAdd = invalidQuestion;
            chai.request(app)
                .post("/api/question")
                .send(questionToAdd)
                .end((_, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a("object");
                    res.body.should.have.property("message");
                    res.body.should.have
                        .property("message")
                        .eql("Incomplete question format!");
                    done();
                });
        });
    });

    describe("GET /id", () => {
        let id = "";
        after((done) => {
            QuestionModel.deleteOne({ _id: id }, () => {
                done();
            });
        });
        it("should get the question added", (done) => {
            const question = new QuestionModel(validQuestions[1]);
            id = question._id;
            question.save((err, question) => {
                chai.request(app)
                    .get("/api/question/id?id=" + question.id)
                    .send(question)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a("object");
                        res.body.should.have.property("message");
                        res.body.should.have.property("question");
                        res.body.should.have
                            .property("question")
                            .eql({ ...question._doc, _id: question.id });
                        done();
                    });
            });
        });
    });

    describe("GET /", () => {
        it("should get 2 questions with given difficulty", (done) => {
            const difficulty = "Easy";
            chai.request(app)
                .get("/api/question")
                .query({ difficulty })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("message");
                    res.body.should.have.property("questions");
                    res.body.questions.should.be.instanceof(Array);
                    res.body.questions.should.have.length(2);
                    res.body.questions[0].should.have
                        .property("difficulty")
                        .eql(difficulty);
                    res.body.questions[1].should.have
                        .property("difficulty")
                        .eql(difficulty);
                    done();
                });
        });
    });

    describe("DELETE /", () => {
        it("delete a task", (done) => {
            const question = new QuestionModel(validQuestions[1]);
            question.save((err, question) => {
                chai.request(app)
                    .delete("/api/question/id?id=" + question.id)
                    .send(question)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property("message");
                        res.body.should.have
                            .property("message")
                            .eql(
                                `Deleted Question ${question.id} successfully!`
                            );
                        done();
                    });
            });
        });

        it("delete not existing task", (done) => {
            chai.request(app)
                .delete("/api/question/id")
                .query({ id: "afds" })
                .end((err, res) => {
                    res.should.have.status(406);
                    res.body.should.have.property("message");
                    res.body.should.have
                        .property("message")
                        .eql(`Question does not exist`);
                    done();
                });
        });
    });
});
