var db = require('../../config/mongoose'),
    jwt = require('jsonwebtoken');
var moment = require('moment-timezone');
var _ = require('lodash');
const cron = require("node-cron");

// const Moment = require('moment')
const MomentRange = require('moment-range');
const momentrange = MomentRange.extendMoment(moment);

var mongoose = global.mongoose;
Number.prototype.pad = function(size) {
    var s = String(this);
    while (s.length < (size || 2)) { s = "0" + s; }
    return s;
};
const redis = require('redis');
const DoorToBleSchema = require('../models/doorToBle.server.model');
const REDIS_PORT = process.env.PORT || 6379;
const client = redis.createClient({ port: REDIS_PORT, detect_buffers: true });
client.on("error", function(err) {
    console.log("Error " + err);
})



exports.getfootfallDatasCache = async(req, res, next) => {
    try {
        let obj = req.body;
        let df = new Date(obj.FromDate),
            dt = new Date(obj.ToDate);
        client.lrange(`getfootfallDatas-${obj.subdomain}-${df.getDate()  }-${dt.getDate()}`, 0, -1, (err, data) => {
            if (data.length > 0) {
                let finalArray = [];
                for (let t of data) {
                    finalArray.push(JSON.parse(t))
                }
                res.send(finalArray);
            } else {
                console.log(err, "not cached so Orginal Request getfootfallDatas", obj.subdomain)
                next();
            }
        })
    } catch (e) {
        console.error(e);
        next();
    }
}
exports.getfootfallDatas = async function(req, res, next) {
    try {
        let objC;
        jwt.verify(req.authToken, req.config.tokenSecret, (err, decoded) => {
            if (err) {
                res.status(403).send({ err });
            }
            objC = Object.assign({}, decoded);
        });
        let multi = client.multi();
        const result = await db['localhost'].users.findOne({ username: objC.username }, { password: 1, _id: 0, Buildings: 1 });
        let pass = result.password === objC.password;
        if (pass == true) {
            let Buildings = result.Buildings;
            var count = 0;
            var sendArray = [];
            let obj = req.body;
            var dates = req.body;
            var bu = ['SGP-MBFC', 'Barclays Japan'];
            let blesLook = { $lookup: { from: "bles", localField: "bleId", foreignField: "_id", as: "bles_docs" } },
                blesUnwind = { $unwind: "$bles_docs" };
            let floorLook = { $lookup: { from: "floors", localField: "floorId", foreignField: "_id", as: "floors_docs" } },
                floorUnwind = { $unwind: "$floors_docs" };
            let buildLook = { $lookup: { from: "buildings", localField: "floors_docs.buildingId", foreignField: "_id", as: "building_docs" } },
                buildUnwind = { $unwind: "$building_docs" };
            let hostLook = { $lookup: { from: "hosts", localField: "bles_docs.hostId", foreignField: "_id", as: "host_docs" } },
                hostUnwind = { $unwind: "$host_docs" };
            let segmentLook = { $lookup: { from: "segments", localField: "segmentId", foreignField: "_id", as: "segments_docs" } },
                segmentUnwind = { $unwind: "$segments_docs" };
            let sectionLook = { $lookup: { from: "sections", localField: "roomId", foreignField: "_id", as: "sections_docs" } },
                sectionsUnwind = { $unwind: "$sections_docs" };
console.log(sectionUnwing,"unwinded section")
            let Group = {
                $group: {
                    _id: "$bles_docs._id",
                    "status": { $first: "$status" },
                    "room_name": { $push: "$segments_docs.name" },
                    "ble_address": { $first: "$bles_docs.address" },
                    "floor_name": { $first: "$floors_docs.alias" },
                    "building_name": { $first: "$building_docs.alias" },
                    "lastUpdated": { $first: "$lastUpdated" },
                    "timezone": { $first: "$building_docs.timezone" },
                    "timezoneoffset": { $first: "$building_docs.timezoneOffset" },
                    "hostName": { $first: "$host_docs.name" }
                }
            };
            let Project = {
                $project: {
                    "ble_address": "$bles_docs.address",
                    "floor_name": "$floors_docs.alias",
                    "room_name": ["$sections_docs.name"],
                    "building_name": "$building_docs.alias",
                    lastUpdated: 1,
                    status: 1,
                    "_id": "$bles_docs._id",
                    "timezone": "$building_docs.timezone",
                    "timezoneoffset": "$building_docs.timezoneOffset",
                    "hostName": "$host_docs.name"
                }
            };

            let builg = [],
                buildingM;
            if (Buildings.length > 0) {
                Buildings.map((b) => {
                    if (b.subdomain === obj.subdomain)
                        builg.push(mongoose.Types.ObjectId(b.id))
                })
                buildingM = { $in: builg };
            } else {
                buildingM = { $nin: builg };
            };

            let MatchNotPIR = { $match: { "building_docs.alias": { $nin: bu } } };
            let userBlgMatch = { $match: { "building_docs._id": buildingM } };

            try {
                let result = [];
                let segments = await db[obj.subdomain].segmentToBles.aggregate([blesLook, blesUnwind, floorLook, floorUnwind, buildLook,
                    buildUnwind, userBlgMatch, hostLook, hostUnwind, segmentLook, segmentUnwind, Group
                ]);
                let rooms = await db[obj.subdomain].roomToBles.aggregate([blesLook, blesUnwind, floorLook, floorUnwind, sectionLook, sectionsUnwind, buildLook,
                    buildUnwind, userBlgMatch, hostLook, hostUnwind, MatchNotPIR, Project
                ]);
                let doors = await db[obj.subdomain].doorToBles.aggregate([blesLook, blesUnwind, floorLook, floorUnwind, sectionLook, sectionsUnwind, buildLook,
                    buildUnwind, userBlgMatch, hostLook, hostUnwind, MatchNotPIR, Project
                ]);

                // if (segments.length > 0) {
                //     for (let i of segments) {
                //         result.push(i)
                //     }
                // }
                // if (rooms.length > 0) {
                //     for (let i of rooms) {
                //         result.push(i)
                //     }
                // }

                if(doors.length>0){
                    for(let i of doors){
                        result.push(i)
                    }
                }

                if (result.length > 0) {
                    result.forEach(async function(room, i) {
                        timezone = room.timezone;
                        var startm = moment.tz(timezone).startOf('day').utc();
                        var endm = moment.tz(timezone).endOf('day').utc();
                        var momentstart = moment.tz(dates.FromDate, room.timezone).valueOf();
                        var momentend = moment.tz(dates.ToDate, room.timezone).valueOf();
                        var sendStruc = {};
                        let startdate = await getStartDate(req.body, room._id);
                        sendStruc.id = i,
                            sendStruc.customers = req.body.subdomain,
                            sendStruc.buildings = room.building_name,
                            sendStruc.blgtimezone = room.timezone,
                            sendStruc.blgoffset = room.timezoneoffset,
                            sendStruc.floors = room.floor_name,
                            sendStruc.bleaddress = room.ble_address,
                            sendStruc.status = room.status,
                            sendStruc.lastresponsetime = moment.tz(room.lastUpdated, room.timezone).format("DD/M/YYYY hh:mm A"),
                            sendStruc.noofresponsesTillNow = await gethealthLog(req.body.subdomain, momentstart, momentend, room._id),
                            sendStruc.startDate = moment.tz(startdate, room.timezone).format("DD/M/YYYY hh:mm A"),
                            sendStruc.bleId = room._id;

                        sendStruc.hostName = room.hostName;
                        sendStruc.noofresponses = await gethealthLog(req.body.subdomain, startm, endm, room._id);
                        sendStruc.areaName = room.room_name;
                        sendArray.push(sendStruc);
                        let df = new Date(momentstart),
                            dt = new Date(momentend);
                        await multi.rpush(`getPcsDatas-${req.body.subdomain}-${df.getDate()  }-${dt.getDate()}`, JSON.stringify(sendStruc));
                        if (result.length == ++count) {
                            console.log(" PCS response from = ", req.body.subdomain);
                            multi.exec(async(err, res) => {
                                err ? console.error(err, "error") : await client.expire(`getPcsDatas-${req.body.subdomain}-${df.getDate()  }-${dt.getDate()}`, 600);
                            });
                            res.send(sendArray.sort(function(a, b) { return a.id - b.id }))
                        }
                    })
                } else {
                    console.log(" PCS no response from = ", req.body.subdomain);
                    res.send(sendArray);
                }
            } catch (e) {
                console.log(e.message)
            }

        } else {
            res.status(400).send({ error: "no authToken matched " })
        }
    } catch (e) {
        console.log(e.message);
        res.send({ err: e.message })
    }



}