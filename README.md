# covers-v3

A Vue 3 version of an app to store data about songs I might wish to cover

Utilises Google Firestore to store the data (using Google auth to log in), and a Vue front end to view and edit it

Also a bit of a playground to experiment with Vue related ideas

Upgraded from previous version to Vue 3 and Vuetify 3, hosted with Firebase

Requires a `/src/firebaseConfig.js` file with appropriate keys, e.g.:
```
export default {
  API_KEY: "api-key",
  AUTH_DOMAIN: "auth-domain",
  PROJECT_ID: "project-id",
  STORAGE_BUCKET: "storage-bucket",
  MESSAGING_SENDER_ID: "messagaing-sender-id",
  APP_ID: "app-id",
  RECAPTCHA_KEY: "recaptcha-key"
}
```

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

Still to do:
* Ordering of set lists
* Play set list
* Possibly split out tabs in to separate table for optimization of table
* Remove songs from sets when deleting
* Use store for more things
* Probably other things

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
