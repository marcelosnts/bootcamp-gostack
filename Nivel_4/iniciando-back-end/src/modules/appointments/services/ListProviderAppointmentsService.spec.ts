import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import ListProviderAppointmentsService from '@modules/appointments/services/ListProviderAppointmentsService';

// import AppError from '@shared/errors/AppError';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderAppointmentsService: ListProviderAppointmentsService;

describe('ListProviderAppointmentsService', () => {
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        listProviderAppointmentsService = new ListProviderAppointmentsService(
            fakeAppointmentsRepository,
        );
    });

    it('should be able to list the appointments for the selected day', async () => {
        const appointment1 = await fakeAppointmentsRepository.create({
            provider_id: 'provider',
            user_id: 'user2',
            date: new Date(2020, 9, 20, 14, 0, 0),
        });

        const appointment2 = await fakeAppointmentsRepository.create({
            provider_id: 'provider',
            user_id: 'user2',
            date: new Date(2020, 9, 20, 15, 0, 0),
        });

        const appointments = await listProviderAppointmentsService.execute({
            provider_id: 'provider',
            day: 20,
            month: 10,
            year: 2020,
        });

        expect(appointments).toEqual(
            expect.arrayContaining([appointment1, appointment2]),
        );
    });
});
