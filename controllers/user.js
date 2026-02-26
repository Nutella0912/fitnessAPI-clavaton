const User = require('../models/User');
const bcrypt = require('bcrypt');
const auth = require('../auth.js');
const { errorHandler } = auth;  


module.exports.registerUser = (req, res) => {
	if (!req.body.email.includes("@")){
		return res.status(400).send({
			message: 'Invalid email format'
		});
	} else if (req.body.password < 10){
		return res.status(400).send({
			message: 'Password must be atleast 10 characters long'
		});
	} else {
		let newUser = new User ({
			email:req.body.email,
			password: bcrypt.hashSync(req.body.password, 10)
		})

		return newUser.save()
		.then((result) => res.status(201)
			.send ({
			message: 'Registered succesfully',
		}))
		.catch(error => errorHandler(error,
			req,res));
	}
};

module.exports.loginUser = (req, res) => {

    if(req.body.email.includes("@")){

       return User.findOne({ email : req.body.email })
        .then(result => {
            if(result == null){
                // Send status 404
                return res.status(404).send({ message: 'No email found' });
            } else {
                const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);
                if (isPasswordCorrect) {

                    //Send status 200
                    return res.status(200).send({ 
                        access : auth.createAccessToken(result)
                        })
                } else {

                    //Send status 401
                    return res.status(401).send({ message: 'Incorrect email or password' });
                }
            }
        })
        .catch(error => errorHandler(error, req, res)); 
    } else {
        return res.status(400).send({ message: 'Invalid email format' })
    }
};


