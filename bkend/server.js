let express=require('express')
let cors=require('cors')
let mongoose=require('mongoose')
let cron=require('node-cron')
let app=express()
app.use(express.json())
app.use(cors())
mongoose.connect("mongodb://127.0.0.1:27017/test",{useNewUrlParser:true,useUnifiedTopology:true}).then(()=>{
  console.log("ok")
}).catch((err)=>{
  console.log(err)
})
const userRecordSchema = new mongoose.Schema({
 "userId": String, 
  "checkInTime": Date,
  "checkOutTime": Date,
});
const UserRecord = mongoose.model('UserRecord', userRecordSchema);
app.post('/checkin', async (req, res) => {
  const { userId } = req.body;
  const checkInTime = new Date();
  const userRecord = new UserRecord({
    userId,
    checkInTime,
  });

  await userRecord.save();
  res.json(userRecord);
});
app.post('/checkout', async (req, res) => {
  const { userId } = req.body;
  const checkOutTime = new Date();
  const userRecord = await UserRecord.findOne({ userId, checkOutTime: null });
  if (!userRecord) {
    return res.status(404).json({ message: 'User must check in before checking out.' });
  }
  userRecord.checkOutTime = checkOutTime;
  await userRecord.save();
  const duration = userRecord.checkOutTime - userRecord.checkInTime;
  res.json({ userRecord, duration });
});
cron.schedule('* * * * *', async () => {
  const users = await UserRecord.find({ checkOutTime: null });
  users.forEach(async (user) => {
    const currentTime = new Date();
    const duration = currentTime - user.checkInTime;
    await UserRecord.findByIdAndUpdate(user._id, { duration });
  });
});
app.listen(5000)
