const validator = require('validator');
const isEmpty = require ('./isEmpty');

function validatePostInput(data){
  const errors={};

  data.text = !isEmpty(data.text) ? data.text : '';

  if (!validator.isLength(data.text, {min:10, max:300})){
    errors.text = "Post should be between 10 and 300 characters."
  }

  if (validator.isEmpty(data.text)){
    errors.text = "Post text is required!";
  }

  // if (validator.isEmpty(data.comments.text)){
  //   errors.comments = "Comment text is required!";
  // }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}

module.exports = validatePostInput;