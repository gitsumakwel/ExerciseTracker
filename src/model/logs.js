let mongoose = require('mongoose')
var ObjectId = mongoose.Types.ObjectId;

const logsSchema = new mongoose.Schema({
  //_id: { type:mongoose.Schema.Types.ObjectId, default:new ObjectId() },
  user: { type:String, required:true }, //this will be id of the username
  date: { type:Date},
  duration: { type:Number, required:true },
  description: { type:String, required:true },
  created: { type:Date, default:Date.now }
});
const Logs = mongoose.model("logs",logsSchema);

//save shortenrul object : {username}
const createAndSaveLogs = async (exercise, done) => {
  return await Logs.create(exercise);

};

//get one document
//id is the document _id
const findLog = async(id, done) => {
  return await Logs.findOne({ _id:id }).exec();
}

//get all exercises for a specific user(need id) from logs
const findLogsByUser = async (user, done) => {
  return await Logs.find({user:new RegExp(user,'g')},'-created -__v').exec();
}

const findLogs = async (toSearch, limit, done) => {
  if (toSearch===null|toSearch===''|toSearch===undefined) {
   return await Logs.find({ user:/\w*/g },'-created -__v').limit(limit).exec();
  }

  else return await Logs.find(toSearch,'-created -__v').limit(limit).exec();

}


const findLogsByDesc = async (desc, done) => {
  if (desc===null|desc===''|isNaN(desc)|desc===undefined) {
    return await Logs.find({ description:/\w*/g },'-created -__v').exec()
  }
  return await Logs.find({ description:new RegExp(desc,'g') },'-created -__v').exec();
}

const deleteLogs = async (desc, done) => {
  if (desc!==null | desc!=='' | desc!==undefined) {
    return await Logs.deleteMany({ description:new RegExp(desc)}).exec();
  }
}

const deleteLog = async (id, done) => {
  if (user!==null | user!=='' | user!==undefined) {
    return await Logs.findOneAndRemove({ _id:id }).execute();
  }
}

//delete everything
const deleteAllLogs = async() => {
  await Logs.collection.drop(done);
}

module.exports = {
  Logs,
  createAndSaveLogs,
  findLog,
  findLogs,
  findLogsByUser,
  findLogsByDesc,
  deleteAllLogs,
  deleteLogs,
  deleteLog,
}
