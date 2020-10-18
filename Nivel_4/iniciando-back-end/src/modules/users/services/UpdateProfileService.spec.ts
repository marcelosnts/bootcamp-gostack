import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import UpdateProfileService from '@modules/users/services/UpdateProfileService';

import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfileService: UpdateProfileService;

describe('UpdateProfile', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();
        updateProfileService = new UpdateProfileService(
            fakeUsersRepository,
            fakeHashProvider,
        );
    });

    it('should be able to update the users profile', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@email.com',
            password: '123456',
        });

        const updatedUser = await updateProfileService.execute({
            user_id: user.id,
            name: 'John Tré',
            email: 'johntre@email.com',
        });

        expect(updatedUser.name).toBe('John Tré');
        expect(updatedUser.email).toBe('johntre@email.com');
    });

    it('should not be able to update the users profile from a non-existing user id', async () => {
        await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@email.com',
            password: '123456',
        });

        await expect(
            updateProfileService.execute({
                user_id: 'non-existing id',
                name: 'John Tré',
                email: 'johntre@email.com',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to update to another user email', async () => {
        await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@email.com',
            password: '123456',
        });

        const user = await fakeUsersRepository.create({
            name: 'John Tré',
            email: 'johntre@email.com',
            password: '123456',
        });

        await expect(
            updateProfileService.execute({
                user_id: user.id,
                name: user.name,
                email: 'johndoe@email.com',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should be able to update the password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@email.com',
            password: '123456',
        });

        const updatedUser = await updateProfileService.execute({
            user_id: user.id,
            name: user.name,
            email: 'johndoe@email.com',
            password: '123123',
            old_password: '123456',
        });

        expect(updatedUser.password).toBe('123123');
    });

    it('should be not able to update the password without the old password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@email.com',
            password: '123456',
        });

        await expect(
            updateProfileService.execute({
                user_id: user.id,
                name: user.name,
                email: user.email,
                password: '123123',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should be not able to update the password with the wrong old password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@email.com',
            password: '123456',
        });

        await expect(
            updateProfileService.execute({
                user_id: user.id,
                name: user.name,
                email: user.email,
                old_password: 'wrong-old-password',
                password: '123123',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
