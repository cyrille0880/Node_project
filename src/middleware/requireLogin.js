const requireLogin = (req, res, next) => {
    if (req.session?.user?.user_id) {
        return next();
    }

    req.flash('error', 'Please log in to volunteer for a project.');
    res.redirect('/login');
};

export default requireLogin;