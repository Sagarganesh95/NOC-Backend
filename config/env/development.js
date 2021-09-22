var host = "localhost";
var tokenSecret = "NOC-dhamodar-77";
var port = 3017;
var options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    autoIndex: false, // Don't build indexes
    useUnifiedTopology: true,
    // reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    // reconnectInterval: 500, // Reconnect every 500ms
    poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0,
    connectTimeoutMS: 500000, // Give up initial connection after 10 seconds
    socketTimeoutMS: 900000, // Close sockets after 45 seconds of inactivity
    family: 4 // Use IPv4, skip trying IPv6
};
var db = {
    adobe: {
        url: "mongodb://root:adapptroot@adobe.adapptonline.com/occupancy?authSource=admin",
        options: options
    },
    barclays: {
        url: "mongodb://adapptadmin:adappt-barclays-admin@barclays.adapptonline.com/occupancy?authSource=admin",
        options: options
    },
    localhost: {
        url: "mongodb://root:adapptroot@13.250.240.158/pcsdata?authSource=admin",
        options: options
    },
    // "adappt-accenture": {
    //     url: "mongodb://root:adapptroot@accenture.adapptonline.com/adappt-accenture?authSource=admin",
    //     options: options
    // },
    // "adappt-kores": {
    //     url: "mongodb://root:adapptroot@kores.adapptonline.com/adappt-kores?authSource=admin",
    //     options: options
    // },
    // "adappt-jll": {
    //     url: "mongodb://root:adapptroot@jll.adapptonline.com/adappt-jll?authSource=admin",
    //     options: options
    // },
    "lntpowai": {
        url: "mongodb://adapptdemo:adappt-demo@lntpowai.adapptonline.com/finaldata?authSource=admin",
        options: options
    },
    "adappt-mmoser": {
        url: "mongodb://root:adapptroot@52.220.122.153/adappt-mmoser?authSource=admin",
        options: options
    },
    // "adappt-zs": {
    //     url: "mongodb://root:adapptroot@zs.adapptonline.com/adappt-zs?authSource=admin",
    //     options: options
    // },
    // "adappt-tomtom": {
    //     url: "mongodb://adapptadmin:adappt-dsp-admin@tomtom.adapptonline.com/dsp?authSource=admin",
    //     options: options
    // },
    // "adappt-bosch": {
    //     url: "mongodb://root:adapptroot@bosch.adapptonline.com/lmsDemo?authSource=admin",
    //     options: options
    // },
    "maersk": {
        url: "mongodb://adapptdemo:adappt-demo@larsentoubro.adapptonline.com/finaldata?authSource=admin",
        options: options
    },
    "kla":{
        url: "mongodb://root:adapptroot@52.220.122.153/adappt-kla?authSource=admin",
        options: options
    }
    // "adappt-amazon": {
    //     url: "mongodb://root:adapptroot@amazon.adapptonline.com/occupancy?authSource=admin",
    //     options: options
    // },
    // "adappt-lenovo": {
    //     url: "mongodb://adapptadmin:adappt-lenovo-admin@lenovo-us.adapptonline.com/adappt-lenovo-us?authSource=admin",
    //     options: options
    // }
};

var domainlist = [
    "adobe",
    // "adappt-amazon",
    "barclays",
    // "adappt-accenture",
    // "adappt-kores",
    // "adappt-jll",
    "lntpowai",
    "adappt-mmoser",
    // "adappt-tomtom",
    // "adappt-bosch",
    // "adappt-lenovo",
    "localhost",
    "maersk",
    "kla"
];
global.domainData = [
    "adobe",
    // "adappt-amazon",
    "barclays",
    // "adappt-accenture",
    // "adappt-kores",
    // "adappt-jll",
    "lntpowai",
    "adappt-mmoser",
    // "adappt-zs",
    // "adappt-tomtom",
    // "adappt-bosch",
    "maersk",
    "kla"
    // "adappt-lenovo",
];


module.exports = {
    port: port,
    db: db,
    sessiondb: "mongodb://root:adapptroot@noc.adapptonline.com/sessions?authSource=admin",
    host: host,
    tokenSecret: tokenSecret,
    sessiontimeout: 15 * 60,
    master_database_uri: "mongodb://root:adapptroot@noc.adapptonline.com/master?authSource=admin",
    master_database_name: "adappt_noc",
    auth_service_jwt_url: "http://localhost:4014/jwt/auth",
    auth_service_oauth_url: "http://localhost:4014/oauth/auth",
    domainlist: domainlist
};