import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from '@modules/users/services/CreateUserService';

import AppError from '@shared/errors/AppError';

describe('CreateUser', () => {
    it('should be able to create a new appointment', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();
        const createUserService = new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );

        const user = await createUserService.execute({
            name: 'john Doe',
            email: 'johndoe@email.com',
            password: '123456',
        });

        expect(user).toHaveProperty('id');
    });

    it('should not be able to create a new user with an existing email', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();
        const createUserService = new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );

        await createUserService.execute({
            name: 'john Doe',
            email: 'johndoe@email.com',
            password: '123456',
        });

        expect(
            createUserService.execute({
                name: 'john Doe',
                email: 'johndoe@email.com',
                password: '123456',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
