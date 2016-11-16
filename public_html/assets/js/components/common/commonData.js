const commonData = {
  global_serverJSONUrl: 'http://localhost:8083/hs/json',
  global_rsa_e: '10001',
  mask: '+7(999)999-99-99',
  global_aes_mode: slowAES.modeOfOperation.CFB,
  data_update_interval: 10000,
  print_debug_to_console: true,
  first_loaded: true,
  user_login: '',
  connection_type: 'remote',
  format: 'HH:mm',
  fullFormat: 'DD.MM.YYYY, HH:mm',
  email: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Zа-яА-Я]{2,}))$/,
};

export default commonData;
