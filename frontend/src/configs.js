const URI_USER_SVC = process.env.URI_USER_SVC || 'https://user-service-e2rvjs4unq-uc.a.run.app'
const URI_QUESTION_SVC = process.env.URI_QUESTION_SVC || 'https://question-service-sg7kdn2zna-uc.a.run.app'


const PREFIX_USER_SVC = '/api/user'

const PREFIX_QUESTION_SVC = '/api/question'

const PREFIX_USER_LOGIN = '/login'

const PREFIX_CHECK_TOKEN = '/check'

const PREFIX_CHANGE_PASSWORD = '/change_password'

export const URL_MATCHING = 'https://matching-service-au7tawfmmq-uc.a.run.app'

export const URL_USER_SVC = URI_USER_SVC + PREFIX_USER_SVC

export const URL_LOGIN_SVC = URI_USER_SVC + PREFIX_USER_SVC + PREFIX_USER_LOGIN

export const URL_CHECK_TOKEN = URI_USER_SVC + PREFIX_USER_SVC + PREFIX_CHECK_TOKEN

export const URL_CHANGE_PASSWORD = URI_USER_SVC + PREFIX_USER_SVC + PREFIX_CHANGE_PASSWORD

export const URL_QUESTION_SVC = URI_QUESTION_SVC + PREFIX_QUESTION_SVC