const validator = require('validator');
const isEmpty =require('./isEmpty');

function validateProfileInput(data){
  let errors = {};

  data.handle = !isEmpty(data.handle) ? data.email : '';
  data.status= !isEmpty(data.status) ? data.status : '';
  data.skills= !isEmpty(data.skills) ? data.skills : '';



  if(!validator.isLength(data.handle,{min:2, max:40})){
    errors.handle = "Handle needs to between 2 and 4 character";
  }

  if(validator.isEmpty(data.handle)){
    errors.handle = "Profile handle is required";
  }

  if(validator.isEmpty(data.status)){
    errors.status= "Status field is required";
  }

  if(validator.isEmpty(data.skills)){
    errors.skills= "Skills field is required";
  }

  if(!isEmpty(data.website)){
    if(!validator.isURL(data.website)){
      errors.website="Not a valid URL"
    }
  }

if(!isEmpty(data.youtube)){
    if(!validator.isURL(data.youtube)){
      errors.youtube ="Not a valid URL"
    }
  }

if(!isEmpty(data.linkedin)){
    if(!validator.isURL(data.linkedin)){
      errors.linkedin="Not a valid URL"
    }
  }

if(!isEmpty(data.instagram)){
    if(!validator.isURL(data.instagram)){
      errors.instagram="Not a valid URL"
    }
}

  return {
    errors:errors,
    isValid: isEmpty(errors)
  }
}

module.exports =  validateProfileInput;