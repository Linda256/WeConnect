const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref:'users'
  },
  handle:{
    type:String,
    required:true,
    max:40
  },
  website:{
    type:String,
  },
  company:{
    type:String
  },
  location:{
    type:String,
  },
  status:{
    type:String,
    required:true
  },
  skills:{
    type:[String],
    require:true
  },
  bio:{
    type:String
  },
  experience:[
    {
      title:{
        type:String,
        required:true
      },
      company:{
        type:String,
        required:true
      },
      from:{
        type:Date,
        required:true
      },
      to:{
        type:Date
      },
      current:{
        type: Boolean,
        default: false
      },
      description:{
        type:String
      }
    }
  ],
  education:[
    {
      school:{
        type:String,
        required:true
      },
      degree:{
        type:String,
        required:true
      },
      fieldOfStudy:{
        type:String,
        requred: true
      },
      from:{
        type:Date,
        required:true
      },
      to:{
        type:Date
      },
      current:{
        type: Boolean,
        default: false
      },
      description:{
        type:String
      }
    }
  ],
  social:{
    youtube:{
      type:String
    },
    twitter:{
      type:String
    },
    facebook:{
      type:String
    },
    linkedin:{
      type:String
    },
  },
  date:{
      type:Date,
      default: Date.now
    }
})

module.exports = Profile = mongoose.model('profile',ProfileSchema);
