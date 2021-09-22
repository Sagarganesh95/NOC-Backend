const hostData = require('../controllers/hosts.server.controller');

module.exports = (app) => {
    app.route("/api/hosts/getUnhealthyHosts").post(hostData.getUnhealthyHosts);
    app.route("/api/hosts/getHostLogsData").post(hostData.getHostLogsDatacache, hostData.getHostLogsData);
    app.route("/api/hosts/getObjectTimeStamp").post(hostData.getObjectTimeStamp);
    app.route("/api/hosts/getHostUnhelathyTrend").post(hostData.getHostUnhelathyTrendcache, hostData.getHostUnhelathyTrend);
    app.route("/api/hosts/getHostComplaints").post(hostData.getHostComplaints);
}