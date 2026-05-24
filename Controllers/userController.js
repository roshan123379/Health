import { User } from '../Models/userModel.js';   
import bcrypt from 'bcryptjs'; 
import jwt from 'jsonwebtoken';
import { sendOTPEmail } from '../EmailVerify/sendOTPEmail.js';
// import { sendVerificationEmail } from '../EmailVerify/verifyemail.js';
export const registerUser = async (req, res) => {
    try {
       
        const { firstName, lastName, email, password, phoneNo, role, isVerified } = req.body;
       
        if ( !firstName || !lastName || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (role && !['user', 'admin'].includes(role)) {
            return res.status(400).json({ error: 'Invalid role' });
        }
       
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }
       
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            phoneNo,
            role: role || 'user',
            isVerified: Boolean(isVerified),
        });
       
        const token = jwt.sign({ id:newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        newUser.token = token;
        // sendVerificationEmail(email, token);

        await newUser.save();
        const user = await User.findById(newUser._id).select('-password -token -otp -otpExpiry');
        res.status(201).json({ success: true, message: 'User registered successfully', user });
    } catch (error) {
        console.error('Register error:', error.message);
        res.status(500).json({ error: error.message || 'Server error' });
    }
};

export const verify  = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Authorization header missing or invalid' });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Token missing' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        user.token = null;
        user.isVerified = true;
        await user.save();
        res.status(200).json({ message: 'Email verified successfully' });
    } catch (error) {
        console.error('Verify error:', error.message);
        res.status(500).json({ error: error.message || 'Server error' });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
       
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
       
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }       
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }    
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        user.token = token;
        user.isLoggedIn = true;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'User logged in successfully',
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error('Login error:', error.message);
        res.status(500).json({ error: error.message || 'Server error' });
    }
};  

export const logoutUser = async (req, res) => {
    try { 
        const user = await User.findById(req.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        user.token = null;
        user.isLoggedIn = false;
        await user.save();
        res.status(200).json({ message: 'User logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error.message);
        res.status(500).json({ error: error.message || 'Server error' });
    }
};

export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.id).select('-password -token -otp -otpExpiry');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ error: error.message || 'Server error' });
    }
};

const upkendraDetailKeys = [
    'district',
    'blockPlanningUnit',
    'upkendra',
    'medicalOfficer',
    'supervisor',
    'anm',
];

const upkendraRowKeys = [
    'villageList',
    'hrArea',
    'population',
    'annualPregnant',
    'annualChildren',
    'monthlyPregnant',
    'monthlyChildren',
    'tdLoad',
    'childLoad',
    'totalLoad',
    'sessionNeed',
    'wardMember',
];

const upkendraTwoDetailKeys = [
    'district',
    'blockPlanningUnit',
    'upkendra',
    'medicalOfficer',
    'supervisor',
    'anm',
    'deliveryFruAddress',
    'doctorName',
];

const upkendraTwoRowKeys = [
    'sessionAddress',
    'coveredVillages',
    'sessionFrequency',
    'pregnantTarget',
    'childrenTarget',
    'tdLoad',
    'childLoad',
    'totalLoad',
    'sessionDay',
    'ashaMobilizer',
    'anganwadiWorker',
    'localInfluencer',
];

const upkendraThreeDetailKeys = [
    'district',
    'blockPlanningUnit',
    'upkendra',
    'medicalOfficer',
    'anm',
    'aefiNodal',
    'supervisor',
];

const upkendraThreeColumnKeys = [
    'sessionDay',
    'villageArea',
    'sessionAddress',
    'hrCode',
    'ashaMobilizer',
    'anganwadiWorker',
    'localInfluencer',
    'avdName',
    'sessionTime',
];

const pickStringFields = (source, keys) =>
    keys.reduce((values, key) => {
        values[key] = typeof source?.[key] === 'string' ? source[key] : '';
        return values;
    }, {});

const getUserFormArray = async (req, res, formKey) => {
    try {
        const user = await User.findById(req.id).select(formKey);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({
            success: true,
            data: user[formKey] || [],
        });
    } catch (error) {
        res.status(500).json({ error: error.message || 'Server error' });
    }
};

const saveUserFormArray = async (req, res, formKey, formData, message) => {
    try {
        const user = await User.findById(req.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const existingForm = req.body.formId ? user[formKey].id(req.body.formId) : user[formKey][0];
        let savedForm;

        if (existingForm) {
            existingForm.set(formData);
            savedForm = existingForm;
        } else {
            savedForm = user[formKey].create(formData);
            user[formKey].push(savedForm);
        }

        await user.save();

        res.status(200).json({
            success: true,
            message,
            data: savedForm,
        });
    } catch (error) {
        res.status(500).json({ error: error.message || 'Server error' });
    }
};

export const getUpkendraPrapatraOne = async (req, res) => {
    return getUserFormArray(req, res, 'upkendraPrapatraOne');
};

export const saveUpkendraPrapatraOne = async (req, res) => {
    const formData = {
        details: pickStringFields(req.body.details, upkendraDetailKeys),
        rows: Array.isArray(req.body.rows)
            ? req.body.rows.map((row) => pickStringFields(row, upkendraRowKeys))
            : [],
        savedAt: new Date(),
    };

    return saveUserFormArray(
        req,
        res,
        'upkendraPrapatraOne',
        formData,
        'Upkendra Prapatra 1 saved successfully',
    );
};

export const getUpkendraPrapatraTwo = async (req, res) => {
    return getUserFormArray(req, res, 'upkendraPrapatraTwo');
};

export const saveUpkendraPrapatraTwo = async (req, res) => {
    const formData = {
        details: pickStringFields(req.body.details, upkendraTwoDetailKeys),
        rows: Array.isArray(req.body.rows)
            ? req.body.rows.map((row) => pickStringFields(row, upkendraTwoRowKeys))
            : [],
        savedAt: new Date(),
    };

    return saveUserFormArray(
        req,
        res,
        'upkendraPrapatraTwo',
        formData,
        'Upkendra Prapatra 2 saved successfully',
    );
};

export const getUpkendraPrapatraThree = async (req, res) => {
    return getUserFormArray(req, res, 'upkendraPrapatraThree');
};

export const saveUpkendraPrapatraThree = async (req, res) => {
    const formData = {
        details: pickStringFields(req.body.details, upkendraThreeDetailKeys),
        wednesdays: Array.isArray(req.body.wednesdays)
            ? req.body.wednesdays.map((row) => pickStringFields(row, upkendraThreeColumnKeys))
            : [],
        saturdays: Array.isArray(req.body.saturdays)
            ? req.body.saturdays.map((row) => pickStringFields(row, upkendraThreeColumnKeys))
            : [],
        savedAt: new Date(),
    };

    return saveUserFormArray(
        req,
        res,
        'upkendraPrapatraThree',
        formData,
        'Upkendra Prapatra 3 saved successfully',
    );
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Implement forgot password logic here
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpiry = new Date(Date.now() + 10*60*1000); 
        await user.save();
        // Send OTP to user's email
        await sendOTPEmail(email, otp);
        res.status(200).json({ message: 'OTP sent to email' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

export const verifyOTP = async (req, res) => {
    try {
        const { otp } = req.body;
        const email = req.params.email;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        if (user.otp !== otp || user.otpExpiry < new Date()) {
            return res.status(400).json({ error: 'Invalid or expired OTP' });
        }
        user.otp = null;
        user.otpExpiry = null;
        await user.save();
        res.status(200).json({ message: 'OTP verified successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

export const changePassword = async (req, res) => {
    try {
        const { newPassword, confirmPassword } = req.body;
        const user = await User.findById(req.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ error: 'Passwords do not match' });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

export const allUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password -token -otp -otpExpiry');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

export const resetPasswordWithOTP = async (req, res) => {
    try {
        const { email, otp, newPassword, confirmPassword } = req.body;

        if (!email || !otp || !newPassword || !confirmPassword) {
            return res.status(400).json({ error: 'Email, OTP and password are required' });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ error: 'Passwords do not match' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.otp !== otp || !user.otpExpiry || user.otpExpiry < new Date()) {
            return res.status(400).json({ error: 'Invalid or expired OTP' });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.otp = null;
        user.otpExpiry = null;
        user.token = null;
        user.isLoggedIn = false;
        await user.save();

        res.status(200).json({ success: true, message: 'Password reset successfully. Please log in.' });
    } catch (error) {
        res.status(500).json({ error: error.message || 'Server error' });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { firstName, lastName, email, role, isVerified, isLoggedIn, phoneNo } = req.body;

        if (!firstName || !lastName || !email) {
            return res.status(400).json({ error: 'First name, last name and email are required' });
        }

        if (role && !['user', 'admin'].includes(role)) {
            return res.status(400).json({ error: 'Invalid role' });
        }

        const existingUser = await User.findOne({ email, _id: { $ne: req.params.id } });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already belongs to another user' });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            {
                firstName,
                lastName,
                email,
                role: role || 'user',
                isVerified: Boolean(isVerified),
                isLoggedIn: Boolean(isLoggedIn),
                phoneNo,
            },
            { new: true, runValidators: true },
        ).select('-password -token -otp -otpExpiry');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ success: true, message: 'User updated successfully', user });
    } catch (error) {
        res.status(500).json({ error: error.message || 'Server error' });
    }
};

export const deleteUser = async (req, res) => {
    try {
        if (String(req.id) === String(req.params.id)) {
            return res.status(400).json({ error: 'You cannot delete your own account while logged in' });
        }

        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message || 'Server error' });
    }
};

export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password -token -otp -otpExpiry');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
