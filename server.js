const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const validator = require('validator')
const bodyParser = require('body-parser')
const { format, parseISO } = require('date-fns')
const { connecter } = require('./src/database')

const  {
  newID,
  Users,
  createAndSaveUser,
  findUser,  
  findUsers,
  deleteUser,
  deleteUsers,
  deleteAllUsers,
} = require('./src/model/users');
const {
  Logs,
  createAndSaveLogs,
  findLog,
  findLogs,
  findLogsByUser,
  findLogsByDesc,
  deleteAllLogs,
  deleteLogs,
  deleteLog,
} = require('./src/model/logs');

deleteLogs('test');
deleteUsers('fcc');

class Final extends Object{
  constructor(){
    super();
    this.result = undefined;
  }
}


//log all request
//request object, response object, next function
const posthandler = (req,res,next) => {
    //log the request
    console.log(`${req.method} ${req.path} - ${req.ip}`);
    // you need to declare, coz your server will get stuck
    next();
}
//report result (callback)
const done = (error,result) => {  
    console.log(result);  
}
const doneresult = (error, result) => {
  return result;
}

const allUsers = async (req,res,next) => {
  findUsers(null,done)
  .then(result => {    
    res.send(result);
  });
}

const newUser = async (req,res,next) => {
  const username = req.body.username;
    //add first to mongodb atlas using User
  //use async
  if (validator.matches(username,/\w+/)) {   
    const id = newID();
    createAndSaveUser({username:username,_id:id},done)     
    res.send({ username : `${username}`, _id:`${id}`});
 } else {
   res.send('')   
 }

}

const newLog = async (req,res,next) => {
  const userid = req.params._id;   
  if (!validator.isAlphanumeric(userid)){
    res.send('')
  }
  findUser(userid)
  .then(user=> {    
    if (user===null){
      res.send('')
    }
    else {

      const desc = req.body.description;
      const duration = req.body.duration;
      let date = req.body.date || Date.now();
      date = new Date(date);      
      if ((validator.matches(desc,/[\w-$&\\.\\+\\\\\\*\\/\[\]#@!%^\{\}]+/)||desc===undefined||desc==="") && validator.isNumeric(duration) && validator.isDate(date) && date!==null) {
        createAndSaveLogs({user:userid,date:date,duration:Number.parseInt(duration),description:desc}).then(result=>{
          res.send({ username:user.username, description:desc, duration:Number.parseInt(duration), date:date.toDateString(), _id:userid })
        });
      }
        
    }
  })
  .catch(error=>console.log('error:',error))

}

const userLogs = async (req,res,next) => {  
  //console.log("id:",req.params._id,"_from:",req.query.from,"_to:",req.query.to,"_limit:",req.query.limit);
  const userid = req.params._id; 
  const _from = req.query.from;
  const _to = req.query.to;  

  let searchDate = {};
  let pattern = /\d{4}-\d\d-\d\d/;
  
  if (_to!==undefined && validator.matches(_to,pattern)) searchDate['$lte'] = new Date(_to);
  if (_from!==undefined && validator.matches(_from,pattern)) searchDate['$gte'] = new Date(_from);
  
  console.log(searchDate)
  const _limit = !isNaN(req.query.limit)?Number.parseInt(req.query.limit):undefined;
  
  const toSearch = Object.keys(searchDate).length===0?{user:userid}:{user:userid,date:searchDate};
  
  if (!validator.isAlphanumeric(userid) && isNaN(_limit)) res.send('');
  else { 
      findUser(userid)
      .then(user => {    
        
          if (user===null){            
            res.send('');      
          }
          else {
              findLogs(toSearch,_limit,done).then(logs => {                
                  if (logs!==null) {                    
                      const count = logs.length;                      
                      let cleanlogs = Object.assign([],logs);
                      cleanlogs = cleanlogs.map(log => {                          
                          
                          const logduration = (typeof log.duration)==='number'?log.duration:Number.parseInt(log.duration);

                          return {description: log.description, duration: logduration, date:format(log.date,'EEE MMM dd yyyy')}
                      });
                      console.log('count',count);
                      let cleanuser = {username: user.username, count: count, _id:user.id, log: cleanlogs}
                                        
                      res.send(cleanuser);
                      
                  }
              });

          }
      })
      .catch(error=>console.log('error:',error))
  }
  
}

app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(posthandler); 
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


app.route('/api/users').post(newUser).get(allUsers);
app.get('/api/users/exercises',(req,res)=>res.send('Invalid ID!'));
app.post('/api/users/:_id/exercises',newLog)
app.get('/api/users/:_id/logs',userLogs)


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})