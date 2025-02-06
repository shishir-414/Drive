    const express=require('express');
    const router=express.Router();
    const {body, validationResult}=require('express-validator');
    const bcrypt=require('bcrypt');
    const userModel=require('../model/users.model')
    const jwt=require('jsonwebtoken');

    router.get('/test',(req,res)=>{
        res.send('test routes');
    })
    router.get('/register',(req,res)=>
    {
        res.render('register');
    })

    router.post('/register',
        body('email').trim().isEmail().withMessage('Invalid email'),
        body('password').trim().isLength({ min: 5 }).withMessage('Password must be at least 5 characters long'),
        body('username').trim().isLength({ min: 2 }).withMessage('Username must be at least 2 characters long')
    ,async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await userModel.create({ 
            username, email,password:hashedPassword });
            res.send('Register sucessfull  go to http://localhost/user/login');
    }
    );

    router.get('/login',(req,res)=>{
    res.render('login')
    })
    router.post('/login', 
        body('username').trim().isLength({ min: 2 }),
        body('password').trim().isLength({ min: 6 }),
        async (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array(), message: 'Error' });
            }
    
            const { username, password } = req.body;
            const user = await userModel.findOne({ username: username });
    
            if (!user) {
                return res.status(400).json({ message: 'User or password is incorrect' });
            }
    
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Username or password is incorrect' });
            }
    
            // Create JWT token
            const token = jwt.sign(
                {
                    userId: user._id,
                    username: user.username,
                    email: user.email
                },
                process.env.JWT_SECRET
            );
    
            // Set JWT token in cookies
            res.cookie('token', token);
    
            // Redirect to home page
            res.redirect('/home');  // Redirects user to the home page
        }
    );
    
    module.exports=router;
