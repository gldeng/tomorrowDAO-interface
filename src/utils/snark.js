import Jszip from 'jszip';
import axios from 'axios';

const jszip = new Jszip();


export function detectMob() {
    if (
        navigator.userAgent.match(/Android/i) ||
        navigator.userAgent.match(/webOS/i) ||
        navigator.userAgent.match(/iPhone/i) ||
        navigator.userAgent.match(/iPad/i) ||
        navigator.userAgent.match(/iPod/i) ||
        navigator.userAgent.match(/BlackBerry/i) ||
        navigator.userAgent.match(/Windows Phone/i)
    ) {
        return true;
    } else {
        return false;
    }
}

async function getTornadoKeys(getProgress) {
    try {
        const keys = await Promise.all([
            download({ name: 'tornado.json.zip', contentType: 'string' }),
            download({ name: 'tornadoProvingKey.bin.zip', contentType: 'arraybuffer', getProgress })
        ]);
        return { circuit: JSON.parse(keys[0]), provingKey: keys[1] };
    } catch (err) {
        throw err;
    }
}

async function fetchFile({ url, name, getProgress, id, retryAttempt = 0 }) {
    try {
        const response = await axios.get(`${url}/${name}`, {
            responseType: 'blob',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            onDownloadProgress: (progressEvent) => {
                if (typeof getProgress === 'function') {
                    const progress = Math.round((progressEvent.loaded * 100) / 9626311);
                    getProgress(progress);
                }
            }
        });

        return response;
    } catch (err) {
        throw err;
    }
}

async function download({ name, contentType, getProgress, eventName = 'events' }) {
    try {
        const response = await fetchFile({ getProgress, url: '/files', name });

        const zip = await jszip.loadAsync(response.data);
        const file = zip.file(name.replace(`${eventName}/`, '').slice(0, -4));

        const content = await file.async(contentType);

        return content;
    } catch (err) {
        throw err;
    }
}

export {
    getTornadoKeys,
    download,
};