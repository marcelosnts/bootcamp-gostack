import FakeStorageProvider from '@shared/container/providers/StorageProviders/fakes/FakeStorageProvider';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';

import AppError from '@shared/errors/AppError';

describe('UpdateUserAvatar', () => {
    it('should be able to update avatar image', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeStorageProvider = new FakeStorageProvider();
        const updateUserAvatarService = new UpdateUserAvatarService(
            fakeUsersRepository,
            fakeStorageProvider,
        );

        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@email.com',
            password: '123456',
        });

        await updateUserAvatarService.execute({
            user_id: user.id,
            avatarFileName: 'avatar.png',
        });

        expect(user.avatar).toBe('avatar.png');
    });

    it('should not be able to update a non existing user image', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeStorageProvider = new FakeStorageProvider();
        const updateUserAvatarService = new UpdateUserAvatarService(
            fakeUsersRepository,
            fakeStorageProvider,
        );

        expect(
            updateUserAvatarService.execute({
                user_id: 'undefined',
                avatarFileName: 'avatar.png',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should be able to delete the old avatar when uploading a new one', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeStorageProvider = new FakeStorageProvider();
        const updateUserAvatarService = new UpdateUserAvatarService(
            fakeUsersRepository,
            fakeStorageProvider,
        );

        const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@email.com',
            password: '123456',
        });

        await updateUserAvatarService.execute({
            user_id: user.id,
            avatarFileName: 'avatar.png',
        });

        await updateUserAvatarService.execute({
            user_id: user.id,
            avatarFileName: 'avatar_new.png',
        });

        expect(deleteFile).toHaveBeenCalledWith('avatar.png');
        expect(user.avatar).toBe('avatar_new.png');
    });
});
