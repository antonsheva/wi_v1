const dbModels = require('../models')
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const mailService = require('./mail-service')
const tokenService = require('./token-service')
const UserDto = require('../dtos/user-dto')
import ApiError from '../exceptions/api-error'

const UserModel = dbModels.user;

class UserService {
    async registration(login:string, password:string, email:string){
        const candidate = await UserModel.findOne({where: {login: login}});
        if (candidate !== null){
            throw ApiError.BadRequest(`Логин ${login} занят`);
        }
        const hashPassword = bcrypt.hashSync(password, 7);
        const activatedLink = uuid.v4();

        const user = await UserModel.create({login: login, password: hashPassword, activated_link: activatedLink});
        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activatedLink}`);
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});

        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        return {
            error:0,
            message: "Ok",
            userData:{
                ...tokens,
                user:userDto
            }

        }
    }
    async activate(activationLink:string){
        const userModel = await UserModel.findOne({where:{activated_link: activationLink}});
        if (userModel === null){
            console.log('Пользователь не найден')
            throw ApiError.BadRequest(`Пользователь не найден`);
        }
        const user = userModel.dataValues;
        console.log('activate -> start')
        console.log(user)
        console.log('userId -> '+user.id)
        await UserModel.update(
            {is_activated: true},
            {
                where:{id:user.id},
                returning: true,
                plain: true
            })
            .then( () => {
                console.log('activate -> ok')
                return true;
            })
            .catch(() => {
                console.log('activate -> error')
                throw ApiError.BadRequest(`Ошибка активации`);
            });
        console.log('activate -> end')
    }
    async login(login:string, password:string){
        const userModel = await UserModel.findOne({where: {login: login}});
        if (userModel === null){
            throw ApiError.AuthorisationError();
        }
        const user = userModel.dataValues
        const isEqualsPass = await bcrypt.compare(password, user.password);
        if (!isEqualsPass){
            throw ApiError.AuthorisationError();
        }
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken)
        return {...tokens, user: userDto}
    }
    async logout(refreshToken:string){
        return await tokenService.removeToken(refreshToken);
    }
    async updateAvatar(userId:number, img:string){
        return new Promise(resolve=>{
            const userModel =  UserModel.findOne({where: {id: userId}});
            console.log('###################')
            console.log('userModel -> '+userModel)
            if (!userModel){
                throw ApiError.AuthorisationError();
            }
            UserModel.update(
                {
                    img_big: `avatars/big/${img}.jpg`,
                    img_small: `avatars/small/${img}.jpg`
                },

                {
                    where:{id:userId},
                    returning: true,
                    plain: true
                })
                .then( () => {
                    console.log('newAvatar -> '+img)
                    resolve(`/avatars/small/${img}.jpg`);
                })
                .catch(() => {
                    console.log('avatar change -> error')
                    throw ApiError.BadRequest(`Ошибка активации`);
                });
        })

    }
    async refresh(refreshToken:string){
        if(!refreshToken){
            throw ApiError.UnauthorisedError();
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = tokenService.findToken(refreshToken);
        if(!userData || !tokenFromDb){
            throw ApiError.UnauthorisedError();
        }
        const user = await UserModel.findOne({where: {id: userData.id}})

        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken)
        return {...tokens, user: userDto}
    }

    async getAllUsers(){
        return await UserModel.findAll()
    }
}

module.exports = new UserService()
