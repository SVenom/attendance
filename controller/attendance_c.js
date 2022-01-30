require('../utils/database')
const employeesregister = require('../model/registraion')
const Attendance = require('../model/attendence')
const jwt = require('jsonwebtoken');
const ls = require('local-storage');
const bcript= require('bcryptjs');
const verifyUser = require("../verify")


const JWTSECRATE = "##Hello My New User@@"


exports.getregistration= async(req,res,next)=>{
    res.render("registration.ejs") 
}
exports.postregistration = async (req,res,next)=>{
    try {
        console.log(req.body);
        const password = req.body.psw
        const Cpassword = req.body.cpsw
        if(password===Cpassword){
            const hashpassword = await bcript.hash(password,10)
            const nweRegister = new employeesregister({
                fname: req.body.fname,
                lname: req.body.lname,
                password:hashpassword,
                gender:req.body.gender,
                email:req.body.email,
                txtEmpPhone: req.body.txtEmpPhone,
                select: req.body.select,
                answer: req.body.answer,
            })
            const data = {
                user:{
                    email: req.body.email
                }
            };
            const authtoken = jwt.sign(data,JWTSECRATE)
            ls.set("token",authtoken)
            console.log("authtoken:"+ authtoken);
    
            await nweRegister.save()
            res.render("main.ejs")
        }
    } catch (error) {
        console.log(error);
        
    }
}
exports.getlogin =async(req,res,next)=>{
    res.render("login.ejs")
}
exports.postlogin  = async(req,res,next)=>{
    console.log(req.body);
    const email= req.body.email
    const password = req.body.password

    const user = await employeesregister.findOne({email})
    console.log("xyz: " +user)
    if(user == null){
        console.log("invalid user")
    }
    const comparepassword = await bcript.compare(password,user.password)
    console.log("comparepassword: "+ comparepassword);
    if(comparepassword===true){
    const useremail={
        user:{
            email: req.body.email
        }
    }
    const generatetoken = jwt.sign(useremail,JWTSECRATE)
    ls.set("token",generatetoken)
    console.log("generatedtoken: "+ generatetoken);
    res.render('attadance.ejs');
}
    else{
        res.json({msg: " invalid user"})
        console.log("Invalid password");
    }
}
exports.attendanceonpost = async(req,res,next)=>{
    try {
        
        const jwtchecking = ls.get("token")
        if(!jwtchecking){
            return res.send({"msg":"you need to be login"})
            // console.log("jwtchecking: " + jwtchecking);
        }
        const verifiedemail = verifyUser(jwtchecking)
        const employename = await employeesregister.find({email:verifiedemail})
        let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const d = new Date()
        const date = d.getDay()+months[d.getMonth()]+""+d.getFullYear
        const time = d.getHours()+":"+d.getMinutes()+":"+d.getSeconds

        const employeAttadance= new Attendance({
            name:employename[0].fname +" "+ employename[0].lname,
            day: date,
            time:time,
            email: verifiedemail,
            isPresent:true
        })
        await employeAttadance.save()
        
        } catch (error) {
            console.log(error);
        }}    
        
exports.viewattendence = async(req,res,next)=>{
    try {
        const employees = await Attendance.find({})
        console.log(employees);
        res.render("view_attendence.ejs",{employees})
        
        
    } catch (error) {
        console.log(error);
    }
}