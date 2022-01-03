const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let advisorTimesSchema = new Schema({
    advisor: {
        type: mongoose.Types.ObjectId,
        ref: 'staff'
    },
    sunday: {
        durations: [{from:String, to:String}],  
        time_slots: [{from:String, to:String}],
    },
    monday: {
        durations: [{from:String, to:String}],  
        time_slots: [{from:String, to:String}],
    },
    tuesday: {
        durations: [{from:String, to:String}],  
        time_slots: [{from:String, to:String}],
    },
    wednesday: {
        durations: [{from:String, to:String}],  
        time_slots: [{from:String, to:String}],
    },
    thursday: {
        durations: [{from:String, to:String}],  
        time_slots: [{from:String, to:String}],
    },
})

const AdvisorTimes = mongoose.model('advisor-times', advisorTimesSchema );

module.exports= AdvisorTimes;
