const footfallDatas = require('../controllers/footfallData.server.controller');
module.exports = function(app) {

    app.route('/api/sensors/pcsData').post(footfallDatas.getfootfallDatasCache, footfallDatas.getfootfallDatas);
}