import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import ListProviderMonthAvailabilityService from '@modules/appointments/services/ListProviderMonthAvailabilityService';

// import AppError from '@shared/errors/AppError';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderMonthAvailabilityService: ListProviderMonthAvailabilityService;

describe('ListProviderMonthAvailabilityService', () => {
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        listProviderMonthAvailabilityService = new ListProviderMonthAvailabilityService(
            fakeAppointmentsRepository,
        );
    });

    it('should be able to list the month availability from provider', async () => {
        await fakeAppointmentsRepository.create({
            provider_id: 'user1',
            user_id: 'user2',
            date: new Date(2020, 9, 20, 8, 0, 0),
        });

        await fakeAppointmentsRepository.create({
            provider_id: 'user1',
            user_id: 'user2',
            date: new Date(2020, 9, 20, 9, 0, 0),
        });

        await fakeAppointmentsRepository.create({
            provider_id: 'user1',
            user_id: 'user2',
            date: new Date(2020, 9, 20, 10, 0, 0),
        });

        await fakeAppointmentsRepository.create({
            provider_id: 'user1',
            user_id: 'user2',
            date: new Date(2020, 9, 20, 11, 0, 0),
        });

        await fakeAppointmentsRepository.create({
            provider_id: 'user1',
            user_id: 'user2',
            date: new Date(2020, 9, 20, 12, 0, 0),
        });

        await fakeAppointmentsRepository.create({
            provider_id: 'user1',
            user_id: 'user2',
            date: new Date(2020, 9, 20, 13, 0, 0),
        });

        await fakeAppointmentsRepository.create({
            provider_id: 'user1',
            user_id: 'user2',
            date: new Date(2020, 9, 20, 14, 0, 0),
        });

        await fakeAppointmentsRepository.create({
            provider_id: 'user1',
            user_id: 'user2',
            date: new Date(2020, 9, 20, 15, 0, 0),
        });

        await fakeAppointmentsRepository.create({
            provider_id: 'user1',
            user_id: 'user2',
            date: new Date(2020, 9, 20, 16, 0, 0),
        });

        await fakeAppointmentsRepository.create({
            provider_id: 'user1',
            user_id: 'user2',
            date: new Date(2020, 9, 20, 17, 0, 0),
        });

        await fakeAppointmentsRepository.create({
            provider_id: 'user1',
            user_id: 'user2',
            date: new Date(2020, 9, 21, 8, 0, 0),
        });

        const availability = await listProviderMonthAvailabilityService.execute(
            {
                provider_id: 'user1',
                year: 2020,
                month: 10,
            },
        );

        expect(availability).toEqual(
            expect.arrayContaining([
                { day: 19, available: true },
                { day: 20, available: false },
                { day: 21, available: true },
                { day: 22, available: true },
            ]),
        );
    });
});
