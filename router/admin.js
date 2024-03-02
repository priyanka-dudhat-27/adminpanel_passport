const express=require('express');
const routs=express.Router();
const adminController=require('../controller/adminController')
const Admin=require('../models/adminModel')
const passport=require('passport')

routs.get('/',adminController.logIn)
routs.post('/signIn',passport.authenticate('local',{failureRedirect:'/admin/'}),adminController.signIn)
routs.get('/dashboard',passport.checkAuth,adminController.dashboard)
routs.get('/addAdmin',passport.checkAuth,adminController.addAdmin)
routs.get('/viewAdmin',passport.checkAuth,adminController.viewAdmin)
routs.post('/insertAdmin',Admin.uploadImage,adminController.insertAdmin)
routs.get('/deleteRecord/:id',adminController.deleteRecord)
routs.get('/updateRecord/:id',passport.checkAuth,adminController.updateRecord)
routs.post('/editAdmin/:id',Admin.uploadImage,adminController.editAdmin)
routs.get('/profile',adminController.profile)
routs.get('/changePass',adminController.changePass)
routs.post('/resetAdminPass',adminController.resetAdminPass)
routs.get('/logout',async(req,res)=>{
    req.session.destroy(function(err){
        if(err){
            console.log(err)
        }
        return res.redirect('/admin')
    })
})
module.exports=routs;