import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeUserTokenRepository from '@modules/users/repositories/fakes/FakeUserTokenRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import ResetPasswordService from '@modules/users/services/ResetPasswordService';
import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokenRepository: FakeUserTokenRepository;
let fakeHashProvider: FakeHashProvider;
let resetPasswordService: ResetPasswordService;

describe('ResetPasswordService', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeUserTokenRepository = new FakeUserTokenRepository();
        fakeHashProvider = new FakeHashProvider();

        resetPasswordService = new ResetPasswordService(
            fakeUsersRepository,
            fakeUserTokenRepository,
            fakeHashProvider,
        );
    });

    it('should be able to reset the password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@email.com',
            password: '123456',
        });

        const { token } = await fakeUserTokenRepository.generate(user.id);

        const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

        await resetPasswordService.execute({
            token,
            password: '654321',
        });

        const updatedUser = await fakeUsersRepository.findById(user.id);

        expect(generateHash).toHaveBeenCalledWith('654321');
        expect(updatedUser?.password).toBe('654321');
    });

    it('should not be able to reset the password with non-existing token', async () => {
        await expect(
            resetPasswordService.execute({
                token: 'non-existing',
                password: '123456',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to reset the password with non-existing user', async () => {
        const { token } = await fakeUserTokenRepository.generate(
            'non-existing',
        );

        await expect(
            resetPasswordService.execute({
                token,
                password: '123456',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should be not able to reset the password with an expired token', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@email.com',
            password: '123456',
        });

        const { token } = await fakeUserTokenRepository.generate(user.id);

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            const customDate = new Date();

            return customDate.setHours(customDate.getHours() + 3);
        });

        await expect(
            resetPasswordService.execute({
                token,
                password: '654321',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
