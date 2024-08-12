const host = window.location.hostname

export const API = host === 'localhost' ? `http://localhost:3001/` : 'https://nodejs-resume-api-ts.onrender.com/'
