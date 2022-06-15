// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'http://172.17.102.21:8080',
  //apiUrl: 'https://0984-45-4-202-152.sa.ngrok.io',
  apiUrlEnvio: 'http://172.17.102.21:9001',
  //apiUrlEnvioSap: 'http://172.17.102.21:8090',
  apiUrlEnvioSap: 'http://172.17.102.21:8090',
  //apiUrlEnvio: 'https://10d6-45-4-202-152.sa.ngrok.io',
  token: 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJlbmNhcnRvbmFkbyIsImlhdCI6MTY1NTEzNjA0OSwiZXhwIjoxNjU1MjIyNDQ5fQ.3sKFaCvjJCzf85KPDSN2WQG63_5MAGY8osSJp-2jIg-j0uCiH5LEuJOkba4zlfUzFCU2Bly4gTx0_UuTT2OvYA'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
