
var db=require('../config/connection')
var collection=require('../config/collection');
const { response } = require('express');
const bcrypt = require('bcrypt')
var objectId=require('mongodb').ObjectID
module.exports={

signupUser:(userData)=>{
    return new Promise(async(resolve,reject)=>{
        console.log(userData.password+"iusiehfi");
        userData.password= await bcrypt.hash(userData.password, 10)
        db.get().collection(collection.USER_COLLECTION).insert(userData).then((data)=>{
            resolve(data.ops[0])
        })
    })
} ,
doLogin:(userData)=>{
    return new Promise(async(resolve,reject)=>{
        console.log(userData);
        let status =false
        let response = {}
        let userContent = await db.get().collection(collection.USER_COLLECTION).findOne({email:userData.email})
        console.log("qqqqqqqqq"+userContent);
        if(userContent){
            bcrypt.compare(userData.password, userContent.password).then((status)=>{
                if(status){
                    response.user= userContent,
                    response.status= true
                    resolve(response)   
                }else{
                    resolve({status:false})
                }
            })
        }else{
            resolve({ status: false })
        }
    })
}


}