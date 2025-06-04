import mongoose from 'mongoose';

const weeklyEntrySchema = new mongoose.Schema({
    week: {
      type: Number,
      required: true
    },
    goal: {
      type: String,
      required: true
    },
    tasks: {
      type: [String],
      required: true
    },
    completed: {
      type: Boolean,
      default: false
    },
  }, { _id: false });


const roadmapSchema = new mongoose.Schema({
    goal: {
      type: String,
      required: true
    },
    experience: {
      type: String,
      required: true
    },
    content: {
      type: [weeklyEntrySchema], // your structured roadmap
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  });

  
  
const userModel = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    roadmaps: {
      type: [roadmapSchema],
      default: [],
      required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true,
    },
    
});

const User = mongoose.models.User || mongoose.model('User', userModel);

export default User;
