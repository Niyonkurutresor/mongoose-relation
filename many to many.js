const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const app = express()
app.use(bodyParser.urlencoded({extended:false}))

mongoose.set('strictQuery',false)
mongoose.connect('mongodb://127.0.0.1:27017/manytomany')

// Define the Schema for the first model
const ownerSchema = new mongoose.Schema({
    name: String,
    age:Number,
    house: [{ type: mongoose.Types.ObjectId, ref: 'House' }],
  });
  
  // Define the Schema for the second model
  const houseSchema = new mongoose.Schema({
    houseLocation: String,
    housePrice:String,
    rooms:String,
    owner: [{ type: mongoose.Types.ObjectId, ref: 'Owner' }],
  });
  
  // Define the Schema for the third model
  const  houseHasOwnerSchema = new mongoose.Schema({
    ownerId: [{ type: mongoose.Types.ObjectId, ref: 'Owner' }],
    houseId: [{ type: mongoose.Types.ObjectId, ref: 'House' }],
    date: { type: Date, default: Date.now },
  });

// Define the models for each schema
const House = mongoose.model('House', houseSchema);
const Owner = mongoose.model('Owner', ownerSchema);
const HouseOwner = mongoose.model('HouseOwner', houseHasOwnerSchema);




app.post('/owner',async (req,res)=>{
    const {name,age,houseId} = req.body
    const newOwner = await Owner.create({name:name,age:age,house:houseId})
    // House.findOneAndUpdate({_id:houseId},{$push:{owner:newOwner._id}})
    res.status(201).json({message:'owner is created',newOwner:newOwner})
})

app.post('/house',async (req,res)=>{
    const{houseLocation,housePrice,rooms,ownerId} = req.body
    const newHouse = await House.create({houseLocation:houseLocation,housePrice:housePrice,rooms:rooms,owner:ownerId})
//    const user = await Owner.findOneAndUpdate({_id:ownerId},{$push:{house:newHouse._id}})
    res.status(201).json({message:'house is created',newHouse:newHouse})
})

app.post('/ownerHaveHouse',async (req,res)=>{
    const {ownerId,houseId} = req.body
    const house_has_owner  = await HouseOwner.create({ownerId:ownerId,houseId:houseId})
    res.status(201).json({message:'ralation created successfully!',house_has_owner:house_has_owner})
})



app.get('/owner',async (req,res)=>{
    const owner = await Owner.find().populate({path:'house',select:'-_id houseLocation housePrice roons'})
    res.status(200).json({message:'owner retrieved successfuly', owner:owner})
})

app.get('/house',async (req,res)=>{
    const house = await House.find().populate({path:'owner', select:'-_id name age'})
    res.status(200).json({message:'data are retrieved successfully',house:house})
})

app.get('/ownerHaveHouse',async (req,res)=>{
    const house_has_owner = await HouseOwner.find().populate({path:'houseId', select:'-_id houseLocation housePrice rooms'})
                                                    .populate({path:'ownerId',select:'-_id name age'})
    res.status(200).json({message:'user and house are retrieved successfullly!',users:house_has_owner})
})

//server 
app.listen(7000,()=>{
    console.log('app is runing on port 7000')
})