const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let reservedTimesSchema = new Schema({
    advisor: {
        type: mongoose.Types.ObjectId,
        ref: 'staff',
        required: true
    },
    student: {
        type: mongoose.Types.ObjectId,
        ref: 'students',
        required: true
    },
    to: {
        type: String,
        required: true
    },
    from: {
        type: String,
        required: true
    },
    day: {
        type:String,
        enum: [ 'sunday','monday','tuesday',
                'wednesday','thursday','friday', 
                'saturday'
            ]
    },
    date: {
        type: Number,
        required: true
    },
    isCanceled: {
        type: Boolean,
        default: false,
    },
    accepted: {
        type: Boolean,
        default: false,
    },
    isCompleted: {
        type: Boolean,
        default: false, 
    }

}, {
    timestamps: true, 
})

const ReservedTimes = mongoose.model('reserved-times', reservedTimesSchema);

module.exports = ReservedTimes;
