import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import AppError from '@shared/errors/AppError';

describe('CreateAppointment', () => {
    it('should be able to create a new appointment', async () => {
        const fakeAppointmentsRepository = new FakeAppointmentsRepository();
        const createAppointmentService = new CreateAppointmentService(
            fakeAppointmentsRepository,
        );

        const appointment = await createAppointmentService.execute({
            date: new Date(),
            provider_id: '123',
        });

        expect(appointment).toHaveProperty('id');
        expect(appointment.provider_id).toBe('123');
    });

    it('should not be able to create appointments on the same date/hour', async () => {
        const fakeAppointmentsRepository = new FakeAppointmentsRepository();
        const createAppointmentService = new CreateAppointmentService(
            fakeAppointmentsRepository,
        );

        const appointmentDate = new Date();

        await createAppointmentService.execute({
            date: appointmentDate,
            provider_id: '123',
        });

        expect(
            createAppointmentService.execute({
                date: appointmentDate,
                provider_id: '123',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
