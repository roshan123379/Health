import mongoose from "mongoose";

const upkendraPrapatraOneRowSchema = new mongoose.Schema(
    {
        villageList: { type: String, trim: true, default: '' },
        hrArea: { type: String, trim: true, default: '' },
        population: { type: String, trim: true, default: '' },
        annualPregnant: { type: String, trim: true, default: '' },
        annualChildren: { type: String, trim: true, default: '' },
        monthlyPregnant: { type: String, trim: true, default: '' },
        monthlyChildren: { type: String, trim: true, default: '' },
        tdLoad: { type: String, trim: true, default: '' },
        childLoad: { type: String, trim: true, default: '' },
        totalLoad: { type: String, trim: true, default: '' },
        sessionNeed: { type: String, trim: true, default: '' },
        wardMember: { type: String, trim: true, default: '' },
    },
    { _id: false },
);

const upkendraPrapatraOneSchema = new mongoose.Schema(
    {
        details: {
            district: { type: String, trim: true, default: '' },
            blockPlanningUnit: { type: String, trim: true, default: '' },
            upkendra: { type: String, trim: true, default: '' },
            medicalOfficer: { type: String, trim: true, default: '' },
            supervisor: { type: String, trim: true, default: '' },
            anm: { type: String, trim: true, default: '' },
        },
        rows: { type: [upkendraPrapatraOneRowSchema], default: [] },
        savedAt: { type: Date, default: Date.now },
    },
    { timestamps: true },
);

const upkendraPrapatraTwoRowSchema = new mongoose.Schema(
    {
        sessionAddress: { type: String, trim: true, default: '' },
        coveredVillages: { type: String, trim: true, default: '' },
        sessionFrequency: { type: String, trim: true, default: '' },
        pregnantTarget: { type: String, trim: true, default: '' },
        childrenTarget: { type: String, trim: true, default: '' },
        tdLoad: { type: String, trim: true, default: '' },
        childLoad: { type: String, trim: true, default: '' },
        totalLoad: { type: String, trim: true, default: '' },
        sessionDay: { type: String, trim: true, default: '' },
        ashaMobilizer: { type: String, trim: true, default: '' },
        anganwadiWorker: { type: String, trim: true, default: '' },
        localInfluencer: { type: String, trim: true, default: '' },
    },
    { _id: false },
);

const upkendraPrapatraTwoSchema = new mongoose.Schema(
    {
        details: {
            district: { type: String, trim: true, default: '' },
            blockPlanningUnit: { type: String, trim: true, default: '' },
            upkendra: { type: String, trim: true, default: '' },
            medicalOfficer: { type: String, trim: true, default: '' },
            supervisor: { type: String, trim: true, default: '' },
            anm: { type: String, trim: true, default: '' },
            deliveryFruAddress: { type: String, trim: true, default: '' },
            doctorName: { type: String, trim: true, default: '' },
        },
        rows: { type: [upkendraPrapatraTwoRowSchema], default: [] },
        savedAt: { type: Date, default: Date.now },
    },
    { timestamps: true },
);

const upkendraPrapatraThreeColumnSchema = new mongoose.Schema(
    {
        sessionDay: { type: String, trim: true, default: '' },
        villageArea: { type: String, trim: true, default: '' },
        sessionAddress: { type: String, trim: true, default: '' },
        hrCode: { type: String, trim: true, default: '' },
        ashaMobilizer: { type: String, trim: true, default: '' },
        anganwadiWorker: { type: String, trim: true, default: '' },
        localInfluencer: { type: String, trim: true, default: '' },
        avdName: { type: String, trim: true, default: '' },
        sessionTime: { type: String, trim: true, default: '' },
    },
    { _id: false },
);

const upkendraPrapatraThreeSchema = new mongoose.Schema(
    {
        details: {
            district: { type: String, trim: true, default: '' },
            blockPlanningUnit: { type: String, trim: true, default: '' },
            upkendra: { type: String, trim: true, default: '' },
            medicalOfficer: { type: String, trim: true, default: '' },
            anm: { type: String, trim: true, default: '' },
            aefiNodal: { type: String, trim: true, default: '' },
            supervisor: { type: String, trim: true, default: '' },
        },
        wednesdays: { type: [upkendraPrapatraThreeColumnSchema], default: [] },
        saturdays: { type: [upkendraPrapatraThreeColumnSchema], default: [] },
        savedAt: { type: Date, default: Date.now },
    },
    { timestamps: true },
);

const userSchema = new mongoose.Schema({
   
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    token: { type: String, default: null },
    isVerified: { type: Boolean, default: false },
    isLoggedIn: { type: Boolean, default: false },
    otp: { type: String, default: null },
    otpExpiry: { type: Date, default: null },
    phoneNo: { type: String },
    upkendraPrapatraOne: { type: [upkendraPrapatraOneSchema], default: [] },
    upkendraPrapatraTwo: { type: [upkendraPrapatraTwoSchema], default: [] },
    upkendraPrapatraThree: { type: [upkendraPrapatraThreeSchema], default: [] },
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
