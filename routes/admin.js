var express = require('express');
var router = express.Router();
const verifyAdminLogin = (req,res,next)=>{
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
    res.render('admin/adminHome',{adminHbs:true})
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
