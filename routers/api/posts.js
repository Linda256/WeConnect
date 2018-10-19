const express = require('express');
const router = express.Router();
const mongoose = require ('mongoose');
const passport = require ('passport');

const Post = require('../../models/Post');
const validationPostInput = require ('../../validation/post');

// @route   GET api/posts/test
// @desc    Tests posts route
// @access  Public
router.get('/test',(req,res)=>res.json({msg:"Posts Works"}));

router.get('/',(req,res) => {

})

// @route   POST api/posts/
// @desc    Create posts
// @access  Private
router.post('/', passport.authenticate('jwt', { session:false }), (req,res) =>{
  //check validation

  //if not valid, return status 400 and error message
  const {errors, isValid} = validationPostInput(req.body);
  if (!isValid) return res.status(400).json(errors);
  //if valid, get the post fields from req.body one by one
  //save the fields to post

  const newPost = new Post({
    text: req.body.text,
    name:req.body.name,
    avatar:req.body.avatar,
    user:req.user.id
  });

  newPost.save().then(post => res.json(post));
});

module.exports = router;