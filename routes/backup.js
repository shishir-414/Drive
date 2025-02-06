router.post('/login',body('username').trim().isLength({min:2}),body('password').trim().isLength({min:6}),async(req,res)=>
    {
        const error=validationResult(req);
        if(!error.isEmpty())
            return res.status(400).json({errors:error.array(),message:'error'});
        const {username,password}=req.body;
        const user=await userModel.findOne({username:username});
        if(!user)
            return res.status(400).json({message:'User or password is incorrect'});
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch)
            return res.status(400).json({
         message:'username or password is incorrect'})
         const token =jwt.sign({
            userId:user._id,
            username:user.username,
            email:user.email
         },process.env.JWT_SECRET,)
         res.cookie('token',token);
         res.send('Login sucessfully')

    });router.post('/login',body('username').trim().isLength({min:2}),body('password').trim().isLength({min:6}),async(req,res)=>
    {
        const error=validationResult(req);
        if(!error.isEmpty())
            return res.status(400).json({errors:error.array(),message:'error'});
        const {username,password}=req.body;
        const user=await userModel.findOne({username:username});
        if(!user)
            return res.status(400).json({message:'User or password is incorrect'});
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch)
            return res.status(400).json({
         message:'username or password is incorrect'})
         const token =jwt.sign({
            userId:user._id,
            username:user.username,
            email:user.email
         },process.env.JWT_SECRET,)
         res.cookie('token',token);
         res.send('Login sucessfully')

    });

    