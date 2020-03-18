import axios from 'axios';

const instance = axios.create({
	baseURL: 'https://burgerordering.firebaseio.com/'
});
export default instance;
