import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import AppError from '@shared/errors/AppError';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointmentService: CreateAppointmentService;

describe('CreateAppointment', () => {
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        createAppointmentService = new CreateAppointmentService(
            fakeAppointmentsRepository,
        );
    });

    it('should be able to create a new appointment', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 9, 20, 10).getTime();
        });

        const appointment = await createAppointmentService.execute({
            date: new Date(2020, 9, 20, 13),
            user_id: '321',
            provider_id: '123',
        });

        expect(appointment).toHaveProperty('id');
        expect(appointment.provider_id).toBe('123');
    });

    it('should not be able to create appointments on the same date/hour', async () => {
        const appointmentDate = new Date(2020, 9, 20, 12);

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 9, 20, 10).getTime();
        });

        await createAppointmentService.execute({
            date: appointmentDate,
            user_id: '321',
            provider_id: '123',
        });

        await expect(
            createAppointmentService.execute({
                date: appointmentDate,
                user_id: '321',
                provider_id: '123',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create an appointment on a past date', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 9, 20, 12).getTime();
        });

        await expect(
            createAppointmentService.execute({
                date: new Date(2020, 9, 20, 11),
                user_id: '321',
                provider_id: '123',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create an appointment with same user as provider', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 9, 20, 12).getTime();
        });

        await expect(
            createAppointmentService.execute({
                date: new Date(2020, 9, 20, 13),
                user_id: '123',
                provider_id: '123',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create an appointment before 8am and after 5pm', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 9, 20, 12).getTime();
        });

        await expect(
            createAppointmentService.execute({
                date: new Date(2020, 9, 20, 7),
                user_id: '321',
                provider_id: '123',
            }),
        ).rejects.toBeInstanceOf(AppError);

        await expect(
            createAppointmentService.execute({
                date: new Date(2020, 9, 20, 18),
                user_id: '321',
                provider_id: '123',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
