import FakeStorageProvider from '@shared/container/providers/StorageProviders/fakes/FakeStorageProvider';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';

import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatarService: UpdateUserAvatarService;

describe('UpdateUserAvatar', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeStorageProvider = new FakeStorageProvider();
        updateUserAvatarService = new UpdateUserAvatarService(
            fakeUsersRepository,
            fakeStorageProvider,
        );
    });

    it('should be able to update avatar image', async () => {
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
        await expect(
            updateUserAvatarService.execute({
                user_id: 'undefined',
                avatarFileName: 'avatar.png',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should be able to delete the old avatar when uploading a new one', async () => {
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
