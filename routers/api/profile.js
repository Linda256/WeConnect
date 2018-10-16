const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//Load Validation
const validationProfileInput = require('../../validation/profile.js');
const validateExperienceInput = require('../../validation/experience.js');
const validateEducationInput = require('../../validation/education.js')

const User = require('../../models/User.js');
const Profile = require('../../models/Profile.js')

// @route   GET api/profile/test
// @desc    Tests posts route
// @access  Public
router.get('/test',(req,res)=>res.json({msg:"Profile Works"}));

// @route   GET api/profile
// @desc    Get current user profile
// @access  Private
router.get('/',passport.authenticate('jwt',{session:false}),(req,res) => {
  const errors={};
  Profile.findOne({user:req.user.id})
    .populate('user',['name','avatar','email'])
    .then(profile => {
      if(!profile){
        errors.noprofile = 'There is no profile for this user'
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
})

// @route   GET api/profile/handle/:handle
// @desc    Get profile by handle
// @access  Public
router.get('/handle/:handle',(req,res) => {
  const errors={};
  Profile.findOne({handle:req.params.handle})
    .populate('user',['name','avatar','email'])
    .then(profile => {
      if(!profile){
        errors.noprofile = 'There is no profile for this user'
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
})

// @route   GET api/profile/user/:id
// @desc    Get profile by user id
// @access  Public
router.get('/user/:user_id',(req,res) => {
  const errors={};
  Profile.findOne({user:req.params.user_id})
    .populate('user',['name','avatar','email'])
    .then(profile => {
      if(!profile){
        errors.noprofile = 'There is no profile for this user'
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json({profile:'There is no profile for this user id'}));
})

// @route   GET api/profile/all
// @desc    Get all profiles
// @access  Public
router.get('/all',(req,res) => {
  const errors={};
  Profile.find()
    .populate('user',['name','avatar','email'])
    .then(profiles => {
      if(!profiles || profiles.length===0){
        errors.noprofiles = 'There is no profile'
        return res.status(404).json(errors);
      }
      res.json(profiles);
    })
    .catch(err => res.status(404).json({profile:'There is no profiles'}));
})


// @route   POST api/profile
// @desc    Create and Edit user profile
// @access  Private
router.post('/',passport.authenticate('jwt',{session:false}),(req,res) => {
  const { errors, isValid } = validationProfileInput(req.body);

  //Check Validation
  if(!isValid){
    //Return any erros with 400 status
    return res.status(400).json(errors);
  }

  //Get fields
  const profileFields={};
  profileFields.user=req.user.id;
  if(req.body.handle) profileFields.handle = req.body.handle;
  if(req.body.company) profileFields.company = req.body.company;
  if (req.body.website) profileFields.website = req.body.website;
  if (req.body.location) profileFields.location = req.body.location;
  if (req.body.bio) profileFields.bio = req.body.bio;
  if (req.body.status) profileFields.status = req.body.status;
  if (req.body.githubusername)
    profileFields.githubusername = req.body.githubusername;
  //Skills -Split into array
  if (typeof req.body.skills !=='undefined'){
    profileFields.skills = req.body.skills.split(',');
  }

  //Social
  profileFields.social = {};
  if(req.body.youtube) profileFields.social.youtube = req.body.youtube;
  if(req.body.twitter) profileFields.social.twitter = req.body.twitter;
  if(req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
  if(req.body.facebook) profileFields.social.facebook = req.body.facebook;
  if(req.body.instagram) profileFields.social.instagram = req.body.instagram;

  Profile.findOne({ user: req.user.id})
    .then(profile => {
      if(profile){
        //Update
        Profile.findOneAndUpdate(
          { user:req.user.id },
          { $set: profileFields},
          { new:true }
        ).then(profile => res.json(profile))
      } else {
        //Create

        //Check if handle exists
        Profile.findOne({ handle: profileFields.handle }).then(profile =>{
          //if handle exist, response the error message
          if(profile){
            errors.handle =" Thaat handle already exist";
            res.status(400).json(errors);
          }
         //if handle not exist, create a new profile;
          new Profile(profileFields).save().then(profile => res.json(profile));
        })
      }
    })
});

// @route   POST api/profile/experience
// @desc    Add experience user profile
// @access  Private

router.post('/experience',passport.authenticate('jwt',{session:false}),(req,res) => {
  console.log(req.body);
  //check validation
  const {errors,isValid} = validateExperienceInput(req.body);
  console.log(isValid);
  //if not valid, response with status code and errors
  if(!isValid){
    return res.status(404).json(errors)
  }
  //search the profile by user.id,
  //save experience fields and response with json profile

  Profile.findOne({user:req.user.id})
    .then(profile => {
      const newExp = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current:req.body.current,
        description: req.body.description
      }

      //Add to exp array
      profile.experience.unshift(newExp);

      profile
      .save()
      .then(profile =>
        res.json(profile));
  })
});

// @route   DELETE api/profile/experience/:user_id
// @desc    Delete experience user profile
// @access  Private

router.delete('/experience/:exp_id',passport.authenticate('jwt',{session:false}),(req,res) => {
  //find the profile exprience by exp_id
  // delete the experience found
  //save profile and response with json profile

  Profile.findOne({user:req.user.id})
  .then(profile => {
    const removeIndex = profile.experience
    .map(exp=>exp.id)
    .indexOf(req.params.exp_id);

    profile.experience.splice(removeIndex,1);

    profile.save().then(profile=>res.json(profile));
  })
    .catch(err=>res.status(404).json(err));

});


// @route   POST api/profile/education
// @desc    Add education user profile
// @access  Private
router.post('/education',passport.authenticate('jwt',{session:false}),(req,res) => {
  console.log(req.body);
  //check validation
  const {errors,isValid} = validateEducationInput(req.body);
  console.log(isValid);
  //if not valid, response with status code and errors
  if(!isValid){
    return res.status(404).json(errors)
  }
  //search the profile by user.id,
  //save education fields and response with json profile

  Profile.findOne({user:req.user.id})
    .then(profile => {
      const newEdu = {
        school: req.body.school,
        degree: req.body.degree,
        fieldOfStudy: req.body.fieldOfStudy,
        from: req.body.from,
        to: req.body.to,
        current:req.body.current,
        description: req.body.description
      }

      //Add to edu array
      profile.education.unshift(newEdu);

      profile
      .save()
      .then(profile =>
        res.json(profile));
  })
});

// @route DELETE api/profile/education/:edu_id
// @desc Delete education from user profile
// @access Private
router.delete('/education/:edu_id',passport.authenticate('jwt',{session:false}),(req,res)=>{
  Profile.findOne({user:req.user.id})
  .then(profile =>{
    const deleteEduIndex = profile.education
    .map(edu=>edu.id)
    .indexOf(req.param.edu_id);

     profile.education.splice(deleteEduIndex,1);

     profile.save().then(profile=>res.json(profile));
  }).catch(err=>res.status(404).json(err));
})

module.exports = router;