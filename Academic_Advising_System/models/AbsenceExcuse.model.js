const mongoose = require('mongoose')
const { Schema } = mongoose ;

const excusesSchema = new Schema({
    student : { type: Schema.Types.ObjectId , ref : 'students'},
    name:{
        type:String
    },
    type : {
        type : String,
        required:true,
    },

    status : {
        type : String,
        required: true
    },
    info :
        [
        {
       code: {
           type : Number,
       },
       courseName : {
           type: Number,
       },
       section : {
           type: Number,
       },
       lecturer:{
           type: String,
       } ,
    },
    ],
    dateFrom:{
        type : Date,
        required:true
    },
    dateTo:{
        type: Date,
        required: true
    },
    proof:
        {
            type:String,
            required:true
        },
    advisorComment:{
        type : String,
    },
    aauComment:{
        type : String,
    },
    deanComment:{
        type : String,
    }
},{
    collection:'excuses',
    timestamps: true
});

const Excuses =   mongoose.model('excuses', excusesSchema);
module.exports = Excuses;
