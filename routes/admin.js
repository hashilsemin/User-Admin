var express = require('express');
var router = express.Router();
const adminHelpers = require('../helpers/admin-helpers')
const verifyAdminLogin = (req,res,next)=>{
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
let admin = req.session.admin
  if(admin){
    next()
  }else{
    res.redirect('/admin/login')
  }
}
/* GET home page. */
router.get('/', function(req, res, next) {
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  if(req.session.adminLoggedIn){
    return new Promise(async(resolve,reject)=>{
      let Alluser = await adminHelpers.getUser()
console.log(Alluser);
    res.render('admin/adminHome',{adminNav:true,Alluser})
    })

  }else{
    console.log("hi");
    res.redirect('/admin/login')
  }


}); 


router.get('/login',function(req,res){

  if(req.session.adminLoggedIn){
    res.redirect('/admin')
  }else{
    
    res.render('admin/adminLogin',{admin:true,'error': req.session.adminerror, 'errorPass': req.session.adminerrorPass, 'errorMail': req.session.adminerrorMail})
    req.session.adminerrorMail = false
    req.session.adminerrorPass = false
  }

})

router.get('/logout',function(req,res){
  req.session.destroy()
  res.redirect('/admin/login')
})

router.get('/deleteUser/:id',(req,res)=>{
  let userId=req.params.id
  console.log(userId);
  adminHelpers.deleteUser(userId).then(()=>{
    res.redirect('/admin')
  })

})

router.get('/editUser/:id',verifyAdminLogin,async(req,res)=>{
  let userId=req.params.id
  console.log(userId);
  let userData= await adminHelpers.getUserforEdit(userId)
  console.log(userData);
  console.log("mjjjj");
  res.render('admin/editPage',{userData,adminNav:true})
})

router.get('/addUser',verifyAdminLogin,async(req,res)=>{

  res.render('admin/addUser',{adminNav:true,'error':  req.session.userExistforadmin})
})

router.post('/addUser',async(req,res)=>{ 
  
  let status = await adminHelpers.checkUser(req.body)
console.log(status); 
if(status){
  req.session.userExistforadmin=true
  res.redirect('/admin/addUser')
}else{
  adminHelpers.addUser(req.body).then(()=>{
    res.redirect('/admin')
  })

}
  


})


router.post('/editUser/:id',async(req,res)=>{

let userId= req.params.id
console.log(userId);
adminHelpers.editUser(userId,req.body).then(()=>{
  
  res.redirect('/admin')
})

})




router.post('/login',function(req,res){
let adminInfo={
  email:"hashilsemin2@gmail.com",
  password:"zzz"
}
if (adminInfo.email != req.body.email) {
  req.session.adminerrorMail = true
  res.redirect('/admin/login')
  req.session.adminerrorMail = false
} 


else if (adminInfo.password != req.body.password) {
  req.session.adminerrorPass = true
  res.redirect('/admin/login')
  req.session.adminerrorPass = false
}

else if (adminInfo.email == req.body.email && adminInfo.password == req.body.password) {
  req.session.adminLoggedIn = true;
  req.session.admin = req.body

  console.log(req.session.admin);
  res.redirect('/admin')
} else {
  req.session.adminerror = true
  res.redirect('/admin/login')
  req.session.adminerror = false

}
  console.log(req.body);
})


module.exports = router;
