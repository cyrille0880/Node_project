import bcrypt from 'bcrypt';
import { authenticateUser, createUser } from '../models/users.js';
import { getProjectsVolunteeredByUser } from '../models/projects.js';

const showUserRegistrationForm = (req, res) => {
    res.render('register', { title: 'Register' });
};

const showLoginForm = (req, res) => {
    res.render('login', { title: 'Log In' });
};

const processLoginForm = async (req, res, next) => {
    const email = typeof req.body.email === 'string' ? req.body.email.trim() : '';
    const password = typeof req.body.password === 'string' ? req.body.password : '';

    try {
        const user = await authenticateUser(email, password);
        if (!user) {
            req.flash('error', 'The email or password is incorrect.');
            return res.redirect('/login');
        }

        req.session.regenerate((error) => {
            if (error) return next(error);
            req.session.user = user;
            req.flash('success', `Welcome, ${user.name}.`);
            res.redirect('/dashboard');
        });
    } catch (error) {
        next(error);
    }
};

const processLogout = (req, res, next) => {
    req.session.destroy((error) => {
        if (error) return next(error);
        res.clearCookie('connect.sid');
        res.redirect('/');
    });
};

const showDashboard = async (req, res) => {
    const projects = await getProjectsVolunteeredByUser(req.session.user.user_id);
    res.render('dashboard', { title: 'My Volunteer Projects', projects });
};

const processUserRegistrationForm = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Hash the password before storing it
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Create the user in the database
        const userId = await createUser(name, email, passwordHash);

        // Redirect to the home page after successful registration
        req.flash('success', 'Registration successful! Please log in.');
        res.redirect('/');
    } catch (error) {
        console.error('Error registering user:', error);
        req.flash('error', 'An error occurred during registration. Please try again.');
        res.redirect('/register');
    }
};

export {
    showUserRegistrationForm,
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    processLogout,
    showDashboard
};