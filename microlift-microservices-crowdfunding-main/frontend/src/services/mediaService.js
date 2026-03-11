import axios from 'axios';
import { API_BASE } from './config';

const MEDIA_URL = `${API_BASE}/media`;

const mediaService = {
    uploadFile: async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await axios.post(`${MEDIA_URL}/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data; // Expected { url: "..." }
    }
};

export default mediaService;
