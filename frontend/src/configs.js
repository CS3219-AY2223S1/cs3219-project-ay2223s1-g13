const URI_USER_SVC = process.env.URI_USER_SVC || 'http://localhost:8000'

const PREFIX_USER_SVC = '/api/user'

const PREFIX_USER_LOGIN = '/login'

const PREFIX_CHECK_TOKEN = '/check'

const PREFIX_CHANGE_PASSWORD = '/change_password'

export const URL_MATCHING = 'http://localhost:8001'

export const URL_USER_SVC = URI_USER_SVC + PREFIX_USER_SVC

export const URL_LOGIN_SVC = URI_USER_SVC + PREFIX_USER_SVC + PREFIX_USER_LOGIN

export const URL_CHECK_TOKEN = URI_USER_SVC + PREFIX_USER_SVC + PREFIX_CHECK_TOKEN

export const URL_CHANGE_PASSWORD = URI_USER_SVC + PREFIX_USER_SVC + PREFIX_CHANGE_PASSWORD