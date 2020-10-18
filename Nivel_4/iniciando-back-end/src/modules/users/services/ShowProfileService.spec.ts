import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ShowProfileService from '@modules/users/services/ShowProfileService';

import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let showProfileService: ShowProfileService;

describe('UpdateProfile', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        showProfileService = new ShowProfileService(fakeUsersRepository);
    });

    it('should be able show the users profile', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@email.com',
            password: '123456',
        });

        const profile = await showProfileService.execute({
            user_id: user.id,
        });

        expect(profile.name).toBe('John Doe');
        expect(profile.email).toBe('johndoe@email.com');
    });

    it('should not be able show the users profile with non-existing user id', async () => {
        await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@email.com',
            password: '123456',
        });

        await expect(
            showProfileService.execute({
                user_id: 'non-existing id',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
