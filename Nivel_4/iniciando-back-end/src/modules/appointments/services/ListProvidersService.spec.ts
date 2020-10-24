import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProvidersService from '@modules/appointments/services/ListProvidersService';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

let fakeUsersRepository: FakeUsersRepository;
let listProvidersService: ListProvidersService;
let fakeCacheProvider: FakeCacheProvider;

describe('ListProviders', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        listProvidersService = new ListProvidersService(
            fakeUsersRepository,
            fakeCacheProvider,
        );
    });

    it('should be able to show the list all the providers', async () => {
        const user1 = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@email.com',
            password: '123456',
        });

        const user2 = await fakeUsersRepository.create({
            name: 'John Tre',
            email: 'johntre@email.com',
            password: '123456',
        });

        const loggedUser = await fakeUsersRepository.create({
            name: 'John Qua',
            email: 'johnqua@email.com',
            password: '123456',
        });

        const providers = await listProvidersService.execute({
            user_id: loggedUser.id,
        });

        expect(providers).toEqual([user1, user2]);
    });
});
