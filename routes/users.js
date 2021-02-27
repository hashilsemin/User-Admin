var express = require('express');
const { Db } = require('mongodb');
const adminHelpers = require('../helpers/admin-helpers');
var router = express.Router();
const verifyUserLogin=(req,res,next)=>{
  let user=req.session.user
  console.log(user);

  if(user){
    next()
  }else{
    res.redirect('/login')
  }

}
const userHelpers = require('../helpers/user-helpers')
/* GET users listing. */
router.get('/',verifyUserLogin, function(req, res, next) {
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  let user = req.session.user

  if(user){
    res.render('user/userHome',{userNav:true,user})
  }else{
    res.redirect('/')
  }
 
});

router.get('/login',function(req,res){
let user =req.session.user
if(user){
  res.redirect('/')
}

  res.render('user/userLogin',{'error':req.session.userLoginErr,'errorPass':req.session.userLoginPassErr})
  req.session.userLoginPassErr=false
  req.session.userLoginErr=false
})

router.get('/signup', function(req,res){
  if(req.session.user){
    res.redirect('/')
  }else{
    res.render('user/userSignup',{'error': req.session.userExist})
    req.session.userExist=false
  }
 
})

router.get('/logout',function(req,res){ 
  req.session.destroy()
  res.redirect('/login')
})


router.post('/login',function(req,res){
console.log(req.body);
userHelpers.doLogin(req.body).then((response)=>{
  console.log(response);
  console.log("jajjajajajajaj");
  
if(response.status){
  req.session.user=response.user
  req.session.userLoggedIn=true
  res.redirect('/')
}
else if(response.response.errPass){
  console.log("mwonaaaaaaaaaaaaa");
  req.session.userLoginPassErr=true
  res.redirect('/login')
 
}

else {
  req.session.userLoginErr=true
  res.redirect('/login')
}
})

})

router.post('/signup',async(req,res)=>{
let status = await adminHelpers.checkUser(req.body)
console.log(status); 
if(status){
  req.session.userExist=true
  res.redirect('/signup')
}else{



 userHelpers.signupUser(req.body).then((data)=>{
   console.log(data);
   req.session.user=data

 }).then(()=>{
  res.redirect('/')
 })

}
})

module.exports = router;
