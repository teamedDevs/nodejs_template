const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../../models/User');

describe('User Model Unit Tests', () => {
    // connect to the datbase
    beforeAll(async () => {
        try{

            await mongoose.connect('mongodb://127.0.0.1:27017/nodejsTemplate', {
            useNewUrlParser: true,
            useUnifiedTopology: true
            });   
        }catch(error) {
            console.log(error);
            process.exit(1);
        }
    });
    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    }) 
    afterEach(async () => {
        await User.deleteMany();
    });

    // test for saving user
    it('should create & save a new user successfully', async () => {
        const userData = {
            username: 'honnette.marie',
            email: 'marie@gmail.com',
            password: 'password@123',
            profile: 'profile'
        };
        const originalPassword = userData.password;
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync( userData.password,salt);
        userData.password= hash;

        const user = new User(userData);
        const savedUser = await user.save();

        expect(savedUser._id).toBeDefined();
        expect(savedUser.username).toBe(userData.username);
        expect(savedUser.email).toBe(userData.email);
        expect(savedUser.profile).toBe(userData.profile);

        const isPasswordMatch = await bcrypt.compare(originalPassword, savedUser.password);
        expect(isPasswordMatch).toBe(true);
        
    });

    it('should fail to save a user with an existing email',async () => {
        const existingUser = {
            username: 'honnette.marie',
            email: 'example@gmail.com',
            password: 'password@123',
            profile: 'profile'
        };
        const user = new User(existingUser);
        await user.save();

        const newUser = {
            username: 'john.doe',
            email: 'example@gmail.com',
            password: 'newpassword',
            profile: 'profile'
        };
        let error;
        try {
            const newUserObj = new User(newUser);
            await newUserObj.save();
        }catch(e) {
            error = e;
        }

        expect(error).toBeDefined();
        expect(error.message).toContain('duplicate key error');
    });

    it('should fail to save a user with missing required fields', async () => {
            const user = new User({});
            let err;
            try {
                const savedUserWithoutRequiredField = await user.save();
                error = savedUserWithoutRequiredField;
            }catch(e) {
                error = e;
            }

            expect(error).toBeDefined();
            expect(error.message).toContain('user validation failed')
    });
    it('should find a user by id', async () => {
        const userData = {
            username: 'honnette.marie',
            email: 'marie@gmail.com',
            password: 'password@123',
            profile: 'profile'
        };
        const user = new User(userData);
        await user.save();

        const foundUser = await User.findById(user._id);

        expect(foundUser).toBeDefined();
        expect(foundUser._id).toEqual(user._id);
        expect(foundUser.username).toEqual(user.username);
        expect(foundUser.email).toEqual(user.email);
        expect(foundUser.password).toEqual(user.password);
        expect(foundUser.profile).toEqual(user.profile);
    });
    it('should update a user by id', async () => {
        const userData = {
            username: 'honnette.marie',
            email: 'marie@gmail.com',
            password: 'password@123',
            profile: 'profile'
        };
        const user = new User(userData);
        await user.save();

        const updateData = {
            username: 'jane.doe',
            email: 'jane@example.com',
            password: 'test@123',
            profile: 'Updated profile'
        }
        const updateUser = await User.findByIdAndUpdate(user._id, updateData, {new: true});

        expect(updateUser).toBeDefined();
        expect(updateUser._id.toString()).toBe(user._id.toString());
        expect(updateUser.username).toBe(updateData.username);
        expect(updateUser.email).toBe(updateData.email);
        expect(updateUser.password).toBe(updateData.password);
        expect(updateUser.profile).toBe(updateData.profile);
    });
    it('should delete a user by id', async () => {
        const userData = {
            username: 'honnette.marie',
            email: 'marie@gmail.com',
            password: 'password@123',
            profile: 'profile'
        };
        const user = new User(userData);
        await user.save();

        await User.findByIdAndDelete(user._id);
        const deletedUser = await User.findById(user._id);

        expect(deletedUser).toBeNull();
    });
});

describe('User Model - Login', () => {
    let testUser;

    beforeAll(async () => {
        try{
            await mongoose.connect('mongodb://127.0.0.1:27017/nodejsTemplate', {
            useNewUrlParser: true,
            useUnifiedTopology: true
            });   
        }catch(error) {
            console.log(error);
            process.exit(1);
        } 
        const userData = {
            username: 'honnette.marie',
            email: 'marie@gmail.com',
            password: 'password@123',
            profile: 'profile'
        };
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync( userData.password,salt);
        userData.password= hash;

        const user = new User(userData);
        testUser = await user.save();
    });
    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });

    it('should successfully login a user with correct email and password', async () => {
        const loginData = {
            email: 'marie@gmail.com',
            password: 'password@123',
        }
        const user = await User.findOne({email: loginData.email});
        const isPasswordMatch = await bcrypt.compare(loginData.password, user.password);
        expect(user).toBeDefined();
        expect(isPasswordMatch).toBe(true);
    });
    it('should fail to login with incorrect email', async () => {
        const loginData ={
            email: 'invalid@gmail.com',
            password: 'password@123',
        };

        const user = await User.findOne({email: loginData.email});
        expect(user).toBeNull();
    });
    it('should fail to login with incorrect password', async () => {
        const loginData ={
            email: 'marie@gmail.com',
            password: 'wrong-password'
        };
        const user = await User.findOne({email: loginData.email});
        const isPasswordMatch = await bcrypt.compare(loginData.password, user.password);
        expect(user).toBeDefined();
        expect(isPasswordMatch).toBe(false);
    });
    it('should fail to login with missing required fields', async () => {
        const loginData = {};
        let error;
        try {
            const user = new User(loginData);
            await user.save();
        }catch(e) {
            error = e;
        }
        expect(error).toBeDefined();
        expect(error.message).toContain('user validation failed');
    });
});