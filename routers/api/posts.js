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

// @route   GET api/posts
// @desc    Fetch all posts
// @access  Public
router.get('/',(req,res) => {
  Post.find()
    .sort({date:-1})
    .then(posts => res.json(posts))
    .catch(err=> res.status(404).json(err));

})

// @route   GET api/posts:id
// @desc    Fetch a post by id
// @access  Public
router.get('/:id',(req,res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err=> res.status(404).json({noPostFound:'No post found with that ID'}));
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