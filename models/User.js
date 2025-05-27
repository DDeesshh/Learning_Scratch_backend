import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: false, lowercase: true, trim: true }, // unique: false
    password: { type: String, required: true },
    progress: {
        type: Object,
        default: {
            beginner: {
                1: { status: 'not_started', comment: '', submittedFile: '' },
                2: { status: 'not_started', comment: '', submittedFile: '' },
                3: { status: 'not_started', comment: '', submittedFile: '' },
            }
        }
    }
}, {
    timestamps: true,
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

userSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;