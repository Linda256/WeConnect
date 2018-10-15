const validator = require('validator');
const isEmpty =require('./isEmpty');

function validateExperienceInput(data){
  let errors = {};

  data.title = !isEmpty(data.title) ? data.title : '';
  data.company= !isEmpty(data.company) ? data.company : '';
  //data.current= !isEmpty(data.current) ? data.current : ''
  data.from= !isEmpty(data.from) ? data.from : ''
  // data.to= !isEmpty(data.to) ? data.to : '';
  // data.description= !isEmpty(data.description) ? data.description : ''

  if(validator.isEmpty(data.title)){
    errors.title = "Job title is required";
  }

  if(validator.isEmpty(data.company)){
    errors.company= "Company field is required";
  }

  if(validator.isEmpty(data.from)){
    errors.from= "From date field is required";
  }

  return {
    errors:errors,
    isValid: isEmpty(errors)
  }
}

module.exports =  validateExperienceInput;