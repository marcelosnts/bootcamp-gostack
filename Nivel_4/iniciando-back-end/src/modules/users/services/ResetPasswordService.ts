import { injectable, inject } from 'tsyringe';
import { isAfter, addHours } from 'date-fns';

// import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IUserTokensRepository from '@modules/users/repositories/IUserTokenRepository';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';

import AppError from '@shared/errors/AppError';

interface IRequest {
    token: string;
    password: string;
}

@injectable()
class ResetPasswordService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
        @inject('UserTokensRepository')
        private userTokensRepository: IUserTokensRepository,
        @inject('HashProvider')
        private hashProvider: IHashProvider,
    ) {}

    public async execute({ token, password }: IRequest): Promise<void> {
        const userToken = await this.userTokensRepository.findByToken(token);

        if (!userToken) {
            throw new AppError('User token does not exists');
        }

        const user = await this.usersRepository.findById(userToken.user_id);

        if (!user) {
            throw new AppError('User does not exists');
        }

        const { created_at } = userToken;
        const compareDate = addHours(created_at, 2);

        if (isAfter(Date.now(), compareDate)) {
            throw new AppError('Token expired!');
        }

        // if (differenceInHours(Date.now(), created_at) > 2) {
        //     throw new AppError('Token expired!');
        // }

        user.password = await this.hashProvider.generateHash(password);

        await this.usersRepository.save(user);
    }
}

export default ResetPasswordService;
