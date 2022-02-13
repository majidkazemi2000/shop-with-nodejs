const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const roleSchema = Schema({
    name : { type : String , required : true},
    label : { type : String , required : true},
    permissions : [{ type : Schema.Types.ObjectId , ref : 'Permission'}]
} , { timestamps : true , toJSON : { virtuals : true } });

roleSchema.plugin(mongoosePaginate);


module.exports = mongoose.model('Role' , roleSchema);