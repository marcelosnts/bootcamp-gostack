import { injectable, inject } from 'tsyringe';

import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';

interface IRequest {
    user_id: string;
    name: string;
    email: string;
    old_password?: string;
    password?: string;
}

@injectable()
class UpdateProfileService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
        @inject('HashProvider')
        private hashProvider: IHashProvider,
    ) {}

    public async execute({
        user_id,
        name,
        email,
        password,
        old_password,
    }: IRequest): Promise<User> {
        const user = await this.usersRepository.findById(user_id);

        if (!user) {
            throw new AppError('User not found');
        }

        const userWithUpdatedEmail = await this.usersRepository.findByEmail(
            email,
        );

        if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user_id) {
            throw new AppError('Email already used!');
        }

        user.name = name;
        user.email = email;

        if (password) {
            if (
                old_password &&
                (await this.hashProvider.compareHash(
                    old_password,
                    user.password,
                ))
            ) {
                user.password = await this.hashProvider.generateHash(password);
            } else {
                throw new AppError('Old password does not match');
            }
        }

        return this.usersRepository.save(user);
    }
}

export default UpdateProfileService;
