import express from 'express';
import cors from 'cors';
import http from 'http';

const app = express();
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors()) // config cors so that front-end can use
app.options('*', cors())
// import { createUser, loginUser, deleteUser, changePassword, authenticateToken } from './controller/user-controller.js';
import { createQuestion, findQuestion, findQuestionById } from './controller/question-controller.js';

const router = express.Router()

// Controller will contain all the User-defined Routes
router.get('/', findQuestion)
router.post('/', createQuestion)
router.get('/id', findQuestionById)

app.use('/api/question', router).all((_, res) => {
    res.setHeader('content-type', 'application/json')
    res.setHeader('Access-Control-Allow-Origin', '*')
})


app.listen(8002, () => console.log('question-service listening on port 8002'));
