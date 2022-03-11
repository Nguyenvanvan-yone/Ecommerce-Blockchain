const User = require('../Models/Users')
const argon2 = require('argon2');
var jwt = require('jsonwebtoken');
require('dotenv').config();

class AuthController {

    //[POST]  
    //path /admin/register  
    //des  register admin
    async register(req,res){ 
        const {name, password, email,phone} = req.body;
        const user = await User.findOne({ email })
        let listError = {};
        try {
            if(user){
                listError ={
                    email:"Email account already in use, please choose another account!"
                }
                return res.status(400).json({success:false, message:"Register Failure!",listError})
            } 
            const hashPassword  = await argon2.hash(password);
            const registerAdmin  = new User({ 
                name: name,
                phone:phone,
                email:email,
                password:hashPassword
            });
             await  registerAdmin.save()
                                .then((message)=>{
                                    const {email,name,phone} = message;
                                    const accessToken = jwt.sign({userId: registerAdmin._id}, process.env.ACCESS_TOKEN_SECRET,{ expiresIn: '3h'});
                                    res.status(200).json({success:true,message:"Register Successfully ",accessToken,info:{name,email,phone}});
                                })
                                .catch((error)=>{
                                    listError = {
                                        name:  error.errors.name ? error.errors.name.message : '',
                                        email: error.errors.email ? error.errors.email.message : '',
                                        phone: error.errors.phone ? error.errors.phone.message : '',
                                    };
                                    res.status(403).json({success:false,message:"Register Failure!",listError});
                                });
        } catch (error) {
            console.log(error.message)
            res.status(500).json({success:false,message:"Internal Server Error"})
        }
    }
    //[POST]  
    //path /admin/login
    //des login admin
    async login (req, res,next){
        const {email, password} = req.body;
        try {
            const user = await User.findOne({ email })
            if(!user){
                return res.status(400).json({success:false, message:"Incorret Email or Password!"})
            }
            const passwordVeryfi   = await argon2.verify(user.password,password);
            if(!passwordVeryfi){
                return res.status(400).json({success:false, message:"Incorret Email or Password!"})
            }
    
            const accessToken = jwt.sign({userId: user._id},process.env.ACCESS_TOKEN_SECRET,{ expiresIn: '3h'});
    
            res.json({
                success:true,
                message:"Login Successfully ",
                accessToken,
                info:{
                    name :user.name,
                    email,
                    phone: user.phone
                }
            });
        } catch (error) {
            res.status(500).json({success:false,message:"Internal Server Error"})
        }
    }
    async loginGooogle(req,res){
        const {id} = req.body;
        const accessToken = jwt.sign({userId: id},process.env.ACCESS_TOKEN_SECRET,{ expiresIn: '3h'});
            res.json({
                success:true,
                message:"Login Successfully ",
                accessToken
        });
    }
    async forgotPassword(req,res){
        const {email } = req.body;
        User.findOne({email},(err,user)=>{
            if(err || !user)
            {
               return  res.status(400).json({message: " User with this email does not exits."})
            }
            const resetAccountToken = jwt.sign({userId: user._id},process.env.RESET_PASSWORD_SECRET,{ expiresIn: '20m'});

            return user.updateOne({resetLink:resetAccountToken}, (err,success)=>{
                if(err)
                {
                    return  res.status(400).json({message: " Reset link error"})
                }
                res.status(200).json({success:true,link: `http://localhost:2106/admin/reset-password/${resetAccountToken}`});
            })
        })
    }
    async resetPassword(req,res){
        const  {token, password} = req.body;
        const hashPassword = await argon2.hash(password)
        jwt.verify(token,process.env.RESET_PASSWORD_SECRET,(err,decodeData)=>{
            if(err)
            {
                return res.status(403).json({success:false,message:"Incorret token or token it is expried"})
            }
            User.findOne({token},(err,user)=>{
                if(err || !user)
                {
                   return  res.status(400).json({message: " User with this token does not exits."})
                }
                const {email,name,phone,_id} = user;
                user.updateOne({password:hashPassword},(err,success)=>{
                    if(err)
                    {
                        return  res.status(400).json({message: " Reset link error",error:err})
                    }
                    const accessToken = jwt.sign({userId: _id}, process.env.ACCESS_TOKEN_SECRET,{ expiresIn: '3h'});
                    res.status(200).json({success:true,message:'Your password has been changed',accessToken,info:{name,email,phone}});
                })
            })
        })
    }
}


module.exports = new AuthController;