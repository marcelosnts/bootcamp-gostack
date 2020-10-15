import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import AppointmentsController from '@modules/appointments/infra/http/controllers/AppointmentsController';

const appointmentsRouter = Router();
const appointmentsController = new AppointmentsController();

appointmentsRouter.use(ensureAuthenticated);
appointmentsRouter.post('/', appointmentsController.create);

// POST http://localhost:3333/appointments
// appointmentsRouter.get('/', async (request, response) => {
//     const appointments = await appointmentsRepository.find();

//     return response.json(appointments);
// });

export default appointmentsRouter;
