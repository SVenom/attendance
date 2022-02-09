require('../utils/database')
const employeesregister = require('../model/registraion')
const Attendance = require('../model/attendence')
const jwt = require('jsonwebtoken');
const ls = require('local-storage');
const bcript= require('bcryptjs');
const verifyUser = require("../verify");
const moment = require("moment");
const { name } = require('ejs');
const JWTSECRATE = "##Hello My New User@@"
let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

 const getmonthnumber=(month)=>{
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    for(let i=0;i<12;i++){
        if(months[i]===month)
            return i+1
    }
 }
//*Show Register Page
exports.getregistration= async(req,res,next)=>{
    // res.render("registration.ejs") 
    res.json({"msg":"hchcwjcebh"}) 
}

//*Empoye Register
exports.postregistration = async (req,res,next)=>{
    try {
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
    
            await nweRegister.save()
            return res.send({"Msg" : "You Registered Successfully!"})
        }
    } catch (error) {
        console.log(error);
        
    }
}

//*Show login page
exports.getlogin =async(req,res,next)=>{
    res.render("login.ejs",{title: 'Employe LogIn'})
}

//*Login For Valid Employe 
exports.postlogin  = async(req,res,next)=>{

    const email= req.body.email
    const password = req.body.password

    const user = await employeesregister.findOne({email})
    if(user===null){
        return res.send({"Msg" : "Invalid user"})
    }
    const comparepassword = await bcript.compare(password,user.password)
    if(!comparepassword){
        return res.send({"Msg" : "Invalid user"})
    }
    if(comparepassword===true){
    const useremail={
        user:{
            email: req.body.email
        }
    }
    const generatetoken = jwt.sign(useremail,JWTSECRATE)
    ls.set("token",generatetoken)
    res.render('attadance.ejs',{isAdmin:user.isAdmin});
    
}
    else{
        res.json({msg: " invalid user"})
    }
}

//*Store Attendance
exports.attendanceonpost = async(req,res,next)=>{
    try {
        
        const jwtchecking = ls.get("token")
        if(!jwtchecking){
            return res.send({"msg":"you need to be login"})
        }
        const verifiedemail = verifyUser(jwtchecking)
        const employename = await employeesregister.find({email: verifiedemail})
        let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const d = new Date()
        const date = d.getDate()+" "+months[d.getMonth()]+" "+ d.getFullYear()
        const time = d.getHours() +":"+ d.getMinutes() +":"+ d.getSeconds()
        const attadance = await Attendance.find(
            {
                day: date,
                email: verifiedemail,
                isPresent:true}
                )
                if(attadance.length){
                    return res.send({"Msg": "you have allready login"}) 
                }
                const employeAttadance= new Attendance({
                    name:employename[0].fname +" "+ employename[0].lname,
                    day: date,
                    time:time,
                    email: verifiedemail,
                    isPresent:true
                })
                await employeAttadance.save()
                res.render("attadance.ejs",{isAdmin:employename.isAdmin})
                console.log(employeAttadance)
                console.log(date)
                
            
        } catch (error) {
            console.log(error);
}
}

// *See Attendance(Only Admin) & Give Attendance(Only Employe)
exports.viewattendence = async(req,res,next)=>{
    try {
        const jwtchecking = ls.get("token")
    if(!jwtchecking){
        return res.send({"msg":"you need to be login"})
    }
    const verifiedemail = verifyUser(jwtchecking)
    const employename = await employeesregister.find({email: verifiedemail})
    const employees = await Attendance.find({})
    res.render("view_attendence.ejs",{title: 'View Attendance',employees})
    
    
    } catch (error) {
        console.log(error);
    }
}
//* View All Employe
exports.viewall = async(req,res,next)=>{
    try {
        const jwtchecking = ls.get("token")
    if(!jwtchecking){
        return res.send({"msg":"you need to be login"})
    }
    const verifiedemail = verifyUser(jwtchecking)
    const employename = await employeesregister.find({email: verifiedemail})
    const employees = await employeesregister.find({})
    res.render("viewall_employe.ejs",{title: 'Employees',employees})
    
    
    } catch (error) {
        console.log(error);
    }
}

//*Search Employe
exports.searchemploye= async (req,res,next)=>{
    try {
        const searchTerm =req.body.searchTerm
        const searchdate =req.body.searchdate
        const dayarray = searchdate.split("-")
        const date =parseInt(dayarray[2])
        const month =months[parseInt( dayarray[1])-1]
        const searchingdate = date +" "+month+" "+dayarray[0]
        const searchname = await Attendance.find({$and : [{name:searchTerm},{day:searchingdate}]})
        console.log(searchname);
        res.render("search.ejs", {title: 'Search',searchname} );
        
    } catch (error) {
        console.log(error);
    }
    }
    
//*Show Calender
exports.showcalender= async(req,res,next)=>{
    const token = ls.get("token")
    if(!token){
        return res.send({"Msg":"You Need To Be Authorised"})
    }
    const email = verifyUser(token)
    const user = await employeesregister.findOne({email})
    if(!user.isAdmin){
        return res.send({"Msg":"You Need To Be an Admin"})
    }
    const useremail= req.params.email
    let attendanceemploye = await Attendance.find({email:useremail})
    let attendate = ""
    let totalpresentThisMonth=0
    const d1=new Date()
    const thisMonth=months[d1.getMonth()]
    for(let i=0; i<attendanceemploye.length;i++){
        
        let thedate =""
        let date= attendanceemploye[i].day.split(" ")
        thedate = getmonthnumber(date[1])+"/"+date[0]+"/"+date[2]
        if(date[1]===thisMonth)
        totalpresentThisMonth++
        attendate+=thedate
        attendate+=" "
    }
    console.log("Total present in this month is ",totalpresentThisMonth)
    const daysinmonth = moment().daysInMonth()
    const d = new Date()
    const today = d.getDate()
    const noOfPresentday=totalpresentThisMonth
    const AbsentDays = today-noOfPresentday
    res.render("check.ejs",{title: 'View Attendance',attendanceemploye,attendate,daysinmonth,today,noOfPresentday,AbsentDays,totalpresentThisMonth})
}
exports.testingroute= async(req,res,next)=>{
    const month = req.body.month
    const name = req.body.name
    console.log(month);
    console.log(name);
    const search = await Attendance.find({})
    // console.log(search)
    let abc= []
    for(let i = 0; i<search.length;i++){
        const efg  = search[i].day
        const pqr = search[i].name
        const xyz = month
        const ijk = name
        if(efg.includes(xyz) & pqr.includes(ijk)){
        abc.push(search[i])
        }
    }
    res.json({abc})
}