
var db=require('../config/connection')
var collection=require('../config/collection');
const { response } = require('express');
const bcrypt = require('bcrypt')
var objectId=require('mongodb').ObjectID
module.exports={

getUser:()=>{
return new Promise(async(resolve,reject)=>{
let users= await db.get().collection(collection.USER_COLLECTION).find().toArray()
resolve(users)
})
},

deleteUser:(userId)=>{ 
    return new Promise(async(resolve,reject)=>{
        db.get().collection(collection.USER_COLLECTION).deleteOne({_id:objectId(userId)})
        resolve()
    })

},

getUserforEdit:(userId)=>{
    return new Promise(async(resolve,reject)=>{
       let user = await db.get().collection(collection.USER_COLLECTION).findOne({_id:objectId(userId)})
        resolve(user)
    })
},

editUser:(userId,userData)=>{
    return new Promise(async(resolve,reject)=>{
        db.get().collection(collection.USER_COLLECTION).updateOne({_id:objectId(userId)},{
            
                $set :{
                name : userData.name,
                email : userData.email,
                mobile : userData.mobile,
                country : userData.country

            }
        }).then(()=>{
            resolve()
        })
    })
},
addUser:(userData)=>{
    return new Promise(async(resolve,reject)=>{
        let pass = userData.password
        userData.password = await bcrypt.hash(pass, 10)
        console.log(userData.password);
        console.log("maakkalleeeeeeeee");
        db.get().collection(collection.USER_COLLECTION).insertOne(userData).then(()=>{
            resolve()
        })
    })
},

checkUser:(userData)=>{
    return new Promise(async(resolve,reject)=>{
        let existUser = await db.get().collection(collection.USER_COLLECTION).find({email:userData.email}).count()
        if(existUser){
            status = true;
            resolve(status)
        }else{
            status = false;
            resolve(status)
        }
    })
}


}