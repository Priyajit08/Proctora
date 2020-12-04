import axios from 'axios';

export class DataService {
    async getCustomersLarge() {
        const res = await axios.get('https://localhost:5001/api/Loader/GetData');
        return res.data;
    }
}