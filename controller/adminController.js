const Admin=require('../models/adminModel')
const fs=require('fs')
const path=require('path')

module.exports.logIn=async(req,res)=>{
    if(req.user){
        return res.redirect('/admin/dashboard')
    }
    else{
        return res.render('logIn')
}
    }
module.exports.signIn=async(req,res)=>{
    try{
        req.flash('success','login successfully')
        return res.redirect('/admin/dashboard')
    }
    catch(err){
        req.flash('error','something wrong')            
        return res.redirect('back')
    }
}

module.exports.dashboard=async(req,res)=>{
    return res.render('dashboard',{
        adminData:req.user
    });
}

module.exports.addAdmin=async(req,res)=>{
    res.render('addAdmin');
}
module.exports.viewAdmin=async(req,res)=>{
    try{
        let viewData=await Admin.find({});
        return res.render('viewAdmin',{
            adminData:viewData,
        });
    }
    catch(err){
        req.flash('error','something wrong')            
        return res.redirect('back');
    }
    
}
module.exports.insertAdmin=async(req,res)=>{
    console.log(req.body);
    console.log(req.file);  
    try{
        var img='';
        if(req.file){
            img=Admin.iPath+'/'+req.file.filename;
        }
        req.body.name=req.body.fname+' '+req.body.lname;
        req.body.image=img;

        let adminData=await Admin.create(req.body);
        if(adminData){
            req.flash('success',' Record inserted Successfully')
            return res.redirect('back')
        }else{
            req.flash('error',' Record not inserted')            
            return res.redirect('back')
        }
    }
    catch(err){
        req.flash('error','something wrong')            
        return res.redirect('back')
    }

}
module.exports.deleteRecord=async(req,res)=>{
    try{
        let singleData=await Admin.findById(req.params.id);
        if(singleData){
            let imagePath=path.join(__dirname,'..',singleData.image)
            await fs.unlinkSync(imagePath)
        }else{
            console.log('wrong')
            return res.redirect('back')
        }
        let delData=await Admin.findByIdAndDelete(req.params.id);
        if(delData){
            req.flash('success',' Record deleted successfully')            
            return res.redirect('/admin/viewAdmin')
        }else{
            req.flash('error','something wrong')            
        }
    }
    catch(err){
        req.flash('error','something wrong')            
        return res.redirect('back');
    }
}
module.exports.updateRecord=async(req,res)=>{
    try{
        let singleData=await Admin.findById(req.params.id);
        return res.render('editAdmin',{
            adminData:singleData,
        })
    }catch(err){
        req.flash('error','something wrong')            
        return res.redirect('back')
    }
}
module.exports.editAdmin=async(req,res)=>{
    try{
        if(req.file){
            let findData=await Admin.findById(req.params.id);
            if(findData){
                let imagePath=path.join(__dirname,'..',findData.image);
                await fs.unlinkSync(imagePath);
            }
            var img='';
            req.body.image=Admin.iPath+'/'+req.file.filename;
        }
        else{
            let findData=await Admin.findById(req.params.id);
            if(findData){
                req.body.image=findData.image;
                req.body.name=req.body.fname+' '+req.body.lname;
            }
        }
        await Admin.findByIdAndUpdate(req.params.id,req.body);
        req.flash('success',' Record updated successfully')            
        return res.redirect('/admin/viewAdmin');
    }
    catch(err){
        req.flash('error','something wrong')            
        return res.redirect('back')
    }
}

module.exports.profile=async(req,res)=>{
    return res.render('profile',{
        adminData:req.user,
    })
}
module.exports.changePass=async(req,res)=>{
    return res.render('changePass')
}
module.exports.resetAdminPass=async(req,res)=>{
    try{
        console.log(req.body);
        if(req.body.cpass==req.user.password){
            if(req.body.cpass!=req.body.npass){
                if(req.body.npass==req.body.conpass){
                    let changed=await Admin.findByIdAndUpdate(req.user.id,{
                        password:req.body.npass
                    })
                    if(changed){
                        req.flash('success','Password Changed Successfully')            
                        return res.redirect('/admin/logout')
                    }else{
                        req.flash('error','Password not change')            
                        return res.redirect('back');
                    }
                }else{
                    req.flash('error','New and confirm password not same')            
                    return res.redirect('back');
                }
            }else{
                req.flash('error','Current and New password are same')            
            }
        }
        else{
            req.flash('error','db password not match')            
            return res.redirect('back')
        }
    }
    catch(err){
        req.flash('error','something wrong')            
        return res.redirect('back')
    }
}