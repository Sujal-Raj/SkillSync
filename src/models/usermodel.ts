import mongoose from 'mongoose';

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
})


// const User = mongoose.model('User', userModel);
const User = mongoose.models.User || mongoose.model('User', userModel);

export default User;