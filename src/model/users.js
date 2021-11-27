let mongoose = require('mongoose')
let ObjectId = mongoose.Types.ObjectId;

let newID = () => new ObjectId();


const usersSchema = new mongoose.Schema({
  username: { type:String, required:true },  
  //_id: { type:mongoose.Schema.Types.ObjectId, default:new ObjectId() },
  created: { type:Date, default:Date.now }
});
const Users = mongoose.model("users",usersSchema);

//save user object : {username,_id}
const createAndSaveUser = (user,done) => {  
  Users.create(user,done); 
};

//get one document
const findUser = async(id) => {
  return await Users.findOne({ _id:id }).exec();  
}  

//get all 'toSearch' from originalurl
const findUsers = async (username, done) => {
  if (username===null | username==='' | username===undefined) {
    return await Users.find({ username:/\w*/g },'username id').exec()
  }
  return await Users.find({username:new RegExp(toSearch,'g')},'username id').exec();
}

const deleteUser = async (id, done) => {
  if (id!==null | id!=='' | id!==undefined) {
    return await Users.findOneAndRemove({ _id:id }).execute();
  }
}

const deleteUsers = async (username, done) => {
  if (username!==null | username!=='' | username!==undefined) {
    return await Users.deleteMany({ username:new RegExp(username)}).exec();
  }
}

//delete everything
const deleteAllUsers = async() => {  
  await Users.collection.drop(done);
}

module.exports = {
  newID,
  Users,
  createAndSaveUser,
  findUser,  
  findUsers,
  deleteUser,
  deleteUsers,
  deleteAllUsers,
}