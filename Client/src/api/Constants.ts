// Constants.ts
const IS_DEV = true; // שנה ל-false כשאתה מעלה לענן

export const BASE_URL = IS_DEV 
  ? 'http://10.0.2.2:8080/api'  // כתובת לאמולטור
  : 'https://your-app-api.com/api'; // הכתובת העתידית בענן