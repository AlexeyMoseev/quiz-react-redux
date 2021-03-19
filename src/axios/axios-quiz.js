import axios from 'axios'

export default axios.create({
    baseURL: 'https://moseev-react-quiz-cb960-default-rtdb.firebaseio.com/'
})