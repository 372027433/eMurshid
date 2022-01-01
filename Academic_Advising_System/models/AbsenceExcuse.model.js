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
       DOE : {
           type : Date,
       }
    },
    ],
    dateFrom:{
        type : Date,
    },
    dateTo:{
        type: Date,
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
    },
    exam : {
        type : Boolean,
        required : true
    },
    semester:{
      type :String,
      required:true
    }
},{
    collection:'excuses',
    timestamps: true
});

const Excuses =   mongoose.model('excuses', excusesSchema);
module.exports = Excuses;
