const deskDatas = require('../controllers/deskData.server.controller');
module.exports = function(app) {
    app.route('/api/desksensor/deskData').post(deskDatas.getDeskDatasCache, deskDatas.getDeskDatas);
    app.route('/api/desksensor/getDeskCount').post(deskDatas.getDeskCountCache, deskDatas.getDeskCount);
}