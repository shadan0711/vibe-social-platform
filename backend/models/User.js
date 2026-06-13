import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  bio: {
    type: String,
    default: '',
    maxlength: 160,
  },
  avatar: {
    type: String,
    default: '',
  },
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
}, { timestamps: true });

userSchema.methods.toProfileJSON = function () {
  return {
    _id: this._id,
    username: this.username,
    email: this.email,
    bio: this.bio,
    avatar: this.avatar,
    followers: this.followers,
    following: this.following,
    followersCount: this.followers.length,
    followingCount: this.following.length,
    createdAt: this.createdAt,
  };
};

export default mongoose.model('User', userSchema);
