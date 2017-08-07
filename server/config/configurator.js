module.exports = {
  'secret'    : process.env.SCRIBA_SECRET_CODE || 'InformaticiSenzaFrontiere&COLLAB',
  'host'      : process.env.SCRIBA_SERVER_HOST || '0.0.0.0',
  'serverPort': process.env.SCRIBA_SERVER_PORT || '9091',
  'socketPort': process.env.SCRIBA_SOCKET_PORT || '9092',
  'database'  : process.env.SCRIBA_MONGODB_URI || 'mongodb://db:27017/scribaDB'
};