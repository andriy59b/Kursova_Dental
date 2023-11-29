const UserModel = require('../models/user-model');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('./mail-service');
const tokenService = require('./token-service');
const UserDto = require('../dtos/user-dto');
const ApiError = require('../exceptions/api-error');

class UserService {
    async registration(email, password) {
        // Перевіряємо чи існує користувач з таким токеном.
       const candidate = await UserModel.findOne({email})
        // Якщо користувача за токеном не знайдено тоді виводимо помилку.
       if(candidate) { 
        throw ApiError.BadRequest(`Користувач з таким емейлом ${email} вже існує`)
       } 
       // Хешуємо пароль
       const hashPassword = await bcrypt.hash(password, 3);
       // силка для активації
       const activationLink = uuid.v4(); // vydg233-sgddhd-1234dbdb-sa-asf
       // зберігаємо користувача в базу даних
       const user = await UserModel.create({email, password: hashPassword, activationLink})
       // відправляємо користувачеви емейл підтвердження
       await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);

       const userDto = new UserDto(user); // id, email, isActivated
       // генеруємо токени
       const tokens = tokenService.generateTokens({...userDto});
       // зберігаємо токени в базі даних
       await tokenService.saveToken(userDto.id, tokens.refreshToken);

       return {...tokens, user: userDto}
    }

    async activate(activationLink) {
        const user = await UserModel.findOne({activationLink})
        if (!user) {
            throw ApiError.BadRequest('Incorrect activation link')
        }
        user.isActivated = true;
        await user.save();
    }

    async login(email, password) {
        const user = await UserModel.findOne({ email})
        if (!user) {
            throw ApiError.BadRequest('User with this email was not found!')
        }
        const isPassEquals = await bcrypt.compare(password, user.password);
        if (!isPassEquals) {
            throw ApiError.BadRequest('Incorrect password!')
        }
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});

        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {...tokens, user: userDto}
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if(!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }
        const user = await UserModel.findById(userData.id);
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});

        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {...tokens, user: userDto}
    }

    async getAllUsers() {
        const users = await UserModel.find();
        return users;
    }
}

module.exports = new UserService();