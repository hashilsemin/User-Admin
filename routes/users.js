var express = require('express');
const { Db } = require('mongodb');
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
    res.render('user/userHome')
  }else{
    res.redirect('/')
  }
 
});

router.get('/login',function(req,res){
let user =req.session.user
if(user){
  res.redirect('/')
}

  res.render('user/userLogin',{'error':req.session.userLoginErr})
})

router.get('/signup',function(req,res){
  res.render('user/userSignup')
})

router.get('/logout',function(req,res){
  req.session.destroy()
  res.redirect('/login')
})


router.post('/login',function(req,res){
console.log(req.body);
userHelpers.doLogin(req.body).then((response)=>{
if(response.status){
  req.session.user=response.user
  req.session.userLoggedIn=true
  res.redirect('/')
}else{
  req.session.userLoginErr=true
  res.redirect('/login')
}
})
})

router.post('/signup',function(req,res){

 userHelpers.signupUser(req.body).then((data)=>{
   console.log(data);
   req.session.user=data

 }).then(()=>{
  res.redirect('/')
 })


})

module.exports = router;
