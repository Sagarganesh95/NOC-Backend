const mongoose = global.mongoose;
const Schema = mongoose.Schema;
const SchemaTypes = Schema.Types;

const DoorToBleSchema = new Schema({
    floorId: {
        type: Schema.ObjectId,
        ref: "Floors",
        index: true
    },
    doorId: {
        type: Schema.ObjectId,
        ref: 'Sections',
        index: true
    },
    bleId: {
        type: Schema.ObjectId,
        ref: 'Ble',
        index: true
    },
    hostId: {
        type: Schema.ObjectId,
        ref: 'Hosts'
    },
    peopleCount: {
        type: Number,
        index: true,
        min: 0
    },
    fin:{
        type:Number,
        index: true,
        min:0
    },
    fout:{
        type: Number,
        index: true,
        min:0
    },
    lastUpdated: {
        type: Date,
        index: true
    },
    status:{
        type:Boolean,
        default: false
    },
});
DoorToBleSchema.pre('save', function(next){
    next();
});
DoorToBleSchema.post('save', function(doc, next){
    console.log("%s is created", doc._id);
    next();
})
DoorToBleSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        if(ret.lastUpdated)
            ret.lastUpdated = ret.lastUpdated.getTime();
        else
            ret.lastUpdated = ret.lastUpdated;
        delete ret._id;
        delete ret.__v;
     }
});
var DoorToBle = mongoose.model('DoorToBle', DoorToBleSchema);
module.exports = DoorToBleSchema;